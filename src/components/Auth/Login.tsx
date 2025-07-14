import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { useSupabase } from '../../context/SupabaseContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        throw signInError;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 lg:p-8"
      style={{
        backgroundImage: "url('/src/assets/Picture1 (1) copy copy copy.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f8fafc' // fallback color
      }}
    >
      {/* Main login container */}
      <div className="relative z-10 w-full max-w-sm lg:max-w-md ml-4 lg:ml-8">        
        {/* Login card */}
        <div className="rounded-2xl shadow-2xl border border-red-500 overflow-hidden backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          {/* Header with brand colors */}
          <div className="px-4 lg:px-8 py-6 lg:py-8 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
            <div className="flex justify-center">
                <img 
                  src="/src/assets/AiChatbot (15).png" 
                  alt="Sentra Logo" 
                  className="w-full h-auto max-w-[200px] lg:max-w-xs"
                />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mx-4 lg:mx-8 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form section */}
          <div className="px-4 lg:px-8 py-6 lg:py-8" style={{ backgroundColor: 'rgba(220, 38, 38, 0.95)' }}>
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-lg lg:text-xl font-semibold text-white mb-2">Welcome Back</h2>
              <p className="text-white/80 text-sm lg:text-base">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              {/* Email field */}
              <div>
                <label className="block text-sm lg:text-base font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 lg:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all duration-200 bg-slate-50 hover:bg-white text-sm lg:text-base"
                    placeholder="admin@sentra.com"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm lg:text-base font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-2 lg:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all duration-200 bg-slate-50 hover:bg-white text-sm lg:text-base"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-800 text-white py-2 lg:py-3 rounded-lg font-medium hover:bg-slate-900 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg text-sm lg:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-4 lg:mt-6 p-3 bg-red-100 rounded-lg border border-red-300">
              <div className="text-center mb-3">
                <p className="text-xs lg:text-sm font-semibold text-red-800 mb-2">⚠️ Demo Accounts (Setup Required):</p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-white rounded-md p-2 border border-red-400">
                  <p className="text-xs lg:text-sm text-amber-700">
                    <span className="font-medium text-blue-600">Super Admin:</span> admin@sentra.com / password123
                  </p>
                  <p className="text-xs text-red-600">Full system access & user management</p>
                </div>
                
                <div className="bg-white rounded-md p-2 border border-red-400">
                  <p className="text-xs lg:text-sm text-amber-700">
                    <span className="font-medium text-green-600">Client Admin:</span> client@sentra.com / password123
                  </p>
                  <p className="text-xs text-red-600">Client portal access & project management</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4 lg:mt-6">
          <p className="text-white/70 text-xs">
            © 2025 mysentree. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;