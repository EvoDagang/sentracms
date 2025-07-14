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
    console.log('[fetchUserProfile] Starting profile fetch for user ID:', userId);
    console.log('[fetchUserProfile] About to execute Supabase query...');
    
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    const endTime = Date.now();
    console.log(`[fetchUserProfile] Supabase query completed in ${endTime - startTime}ms`);

    if (error) {
      console.error('[fetchUserProfile] Error fetching user profile:', error);
      console.error('[fetchUserProfile] Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    console.log('[fetchUserProfile] Profile data received:', data);
    
    if (!data) {
      console.warn('[fetchUserProfile] No profile data returned from query');
      return null;
    }
    
    console.log('[fetchUserProfile] Processing profile data...');
    return {
      id: data.id,
      email: data.email || '',
      name: data.name,
      role: data.role,
      clientId: data.client_id,
      permissions: data.permissions || ['all']
    };
  } catch (error) {
    console.error('[fetchUserProfile] Catch block error:', error);
    console.error('[fetchUserProfile] Error type:', typeof error);
    console.error('[fetchUserProfile] Error constructor:', error?.constructor?.name);
    return null;
  }
};

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session and user profile
    const initializeAuth = async () => {
      console.log('[SupabaseContext] Starting authentication initialization at:', new Date().toISOString());
      try {
        console.log('[SupabaseContext] Fetching initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[SupabaseContext] Session fetched:', session ? 'Session exists' : 'No session');
        
        if (session?.user) {
          console.log('[SupabaseContext] User found in session, fetching profile for user ID:', session.user.id);
          const profile = await fetchUserProfile(session.user.id);
          console.log('[SupabaseContext] Profile fetch result:', profile ? 'Profile found' : 'No profile');
          if (profile) {
            setUser({ ...profile, email: session.user.email || profile.email });
            console.log('[SupabaseContext] User set successfully:', profile.email);
          }
        } else {
          console.log('[SupabaseContext] No user in session');
        }
      } catch (error) {
        console.error('[SupabaseContext] Error initializing auth:', error);
      }
      console.log('[SupabaseContext] Setting loading to false at:', new Date().toISOString());
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[SupabaseContext] Auth state change event:', event, 'at:', new Date().toISOString());
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[SupabaseContext] SIGNED_IN event, fetching profile for user:', session.user.id);
          const profile = await fetchUserProfile(session.user.id);
          console.log('[SupabaseContext] Profile fetch result for SIGNED_IN:', profile ? 'Profile found' : 'No profile');
          if (profile) {
            setUser({ ...profile, email: session.user.email || profile.email });
            console.log('[SupabaseContext] User set for SIGNED_IN:', profile.email);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('[SupabaseContext] SIGNED_OUT event');
          setUser(null);
        } else {
          console.log('[SupabaseContext] Other auth event, clearing user');
          setUser(null);
        }
        console.log('[SupabaseContext] Auth state change complete, setting loading to false');
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Check for demo credentials first and handle them directly
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

      // For non-demo credentials, try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Invalid login credentials. Please check your email and password.' } };
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