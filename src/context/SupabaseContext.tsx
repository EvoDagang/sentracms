import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Team' | 'Client Admin' | 'Client Team';
  clientId?: number;
  permissions: string[];
}

interface SupabaseContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: {
    name: string;
    role: 'Super Admin' | 'Team' | 'Client Admin' | 'Client Team';
    clientId?: number;
    permissions: string[];
  }) => Promise<{ data: any; error: any }>;
  updateUserProfile: (updates: Partial<AuthUser>) => Promise<{ error: any }>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

interface SupabaseProviderProps {
  children: ReactNode;
}

// Helper function to fetch user profile
const fetchUserProfile = async (userId: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return {
      id: data.id,
      email: data.email || '',
      name: data.name,
      role: data.role,
      clientId: data.client_id,
      permissions: data.permissions || ['all']
    };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session and user profile
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            // Update last login
            await supabase.rpc('update_last_login', { user_id: session.user.id });
            setUser({ ...profile, email: session.user.email || profile.email });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            // Update last login
            await supabase.rpc('update_last_login', { user_id: session.user.id });
            setUser({ ...profile, email: session.user.email || profile.email });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback to demo mode if Supabase auth fails
        console.warn('Supabase auth failed, falling back to demo mode:', error.message);
        
        // Demo credentials fallback
        if ((email === 'admin@sentra.com' && password === 'password123') ||
            (email === 'client@sentra.com' && password === 'password123') ||
            (email === 'team@sentra.com' && password === 'password123')) {
          
          let mockUser: AuthUser;
          if (email === 'admin@sentra.com') {
            mockUser = {
              id: 'admin-user-id',
              email: 'admin@sentra.com',
              name: 'Admin User',
              role: 'Super Admin',
              permissions: ['all']
            };
          } else if (email === 'client@sentra.com') {
            mockUser = {
              id: 'client-user-id',
              email: 'client@sentra.com',
              name: 'Nik Salwani Bt.Nik Ab Rahman',
              role: 'Client Admin',
              clientId: 1,
              permissions: ['client_dashboard', 'client_profile', 'client_messages']
            };
          } else {
            mockUser = {
              id: 'team-user-id',
              email: 'team@sentra.com',
              name: 'Team Member',
              role: 'Team',
              permissions: ['clients', 'calendar', 'chat', 'reports', 'dashboard']
            };
          }
          
          setUser(mockUser);
          return { data: { user: mockUser }, error: null };
        }
        
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Sign in failed' } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Sign out failed' } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    name: string;
    role: 'Super Admin' | 'Team' | 'Client Admin' | 'Client Team';
    clientId?: number;
    permissions: string[];
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            clientId: userData.clientId,
            permissions: userData.permissions
          }
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Sign up failed' } };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<AuthUser>) => {
    try {
      if (!user) {
        return { error: { message: 'No user logged in' } };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: updates.name,
          role: updates.role,
          client_id: updates.clientId,
          permissions: updates.permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Update failed' } };
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    signUp,
    updateUserProfile
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};