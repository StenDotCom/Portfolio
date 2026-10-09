import React, { useState } from 'react';
import { Lock, ArrowLeft, KeyRound, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { AuthService, DEV_ADMIN_CREDENTIALS } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import { AuthUser } from '../types';

interface AdminLoginProps {
  onSuccess: (user: AuthUser) => void;
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToPublic }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await AuthService.login(email, password);
      if (result.error || !result.user) {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      } else {
        onSuccess(result.user);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoCredentials = () => {
    setEmail(DEV_ADMIN_CREDENTIALS.email);
    setPassword(DEV_ADMIN_CREDENTIALS.defaultPassword);
  };

  return (
    <div className="min-h-screen bg-warmWhite flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      
      {/* Back button */}
      <div className="w-full max-w-md mb-6 flex justify-start">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-neutralGray hover:text-nearBlack transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white border border-subtleBorder shadow-sm rounded-sm p-8 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-warmWhite border border-subtleBorder rounded-full flex items-center justify-center mx-auto mb-4 text-nearBlack">
            <Lock className="w-5 h-5 stroke-[1.75]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-nearBlack">
            Admin Dashboard Login
          </h1>
          <p className="text-xs text-neutralGray mt-1.5">
            John Yestin F. Cruz — Portfolio Management
          </p>
        </div>

        {/* Backend Status Notice */}
        <div className={`p-3 rounded-sm border text-[11px] mb-6 flex items-start space-x-2.5 ${
          isSupabaseConfigured
            ? 'bg-blue-50/70 border-blue-200 text-blue-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}>
          {isSupabaseConfigured ? (
            <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-semibold uppercase tracking-wider">
              {isSupabaseConfigured ? 'Supabase Authentication Active' : 'Local Development Mode Active'}
            </p>
            <p className="text-[11px] leading-relaxed">
              {isSupabaseConfigured
                ? 'Sign in using your administrator email and password registered in your Supabase Auth dashboard.'
                : 'Supabase credentials are not detected in .env yet. You can sign in using local test credentials below to manage content right now.'}
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@cruz.engineering"
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-nearBlack hover:bg-black text-warmWhite text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>
          </div>
        </form>

        {/* Quick test credentials button for local mode */}
        {!isSupabaseConfigured && (
          <div className="mt-6 pt-5 border-t border-subtleBorder text-center">
            <p className="text-[11px] text-neutralGray mb-2 font-medium">
              Offline Test Credentials:
            </p>
            <button
              type="button"
              onClick={handleUseDemoCredentials}
              className="text-[11px] font-mono text-accentBlue hover:underline bg-warmWhite px-3 py-1.5 rounded border border-subtleBorder inline-block"
            >
              Auto-fill: {DEV_ADMIN_CREDENTIALS.email}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
