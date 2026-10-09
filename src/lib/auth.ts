import { supabase, isSupabaseConfigured } from './supabase';
import { AuthUser } from '../types';

const LOCAL_AUTH_KEY = 'sten_admin_session_auth_v1';

// Default local administrative credentials for development/offline testing
export const DEV_ADMIN_CREDENTIALS = {
  email: 'admin@cruz.engineering',
  defaultPassword: 'AdminPass2026!',
};

export const AuthService = {
  /**
   * Log in using Supabase Auth, or fallback to dev session if Supabase is unconfigured.
   */
  async login(email: string, password: string): Promise<{ user: AuthUser | null; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { user: null, error: error.message };
        }

        if (data.user) {
          const user: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            role: 'admin',
          };
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user));
          return { user };
        }
      } catch (err: any) {
        return { user: null, error: err.message || 'Authentication failed' };
      }
    }

    // Dev/Local fallback authentication mode
    // Allows testing admin dashboard before connecting real Supabase credentials
    if (
      email.toLowerCase().trim() === DEV_ADMIN_CREDENTIALS.email.toLowerCase() &&
      password === DEV_ADMIN_CREDENTIALS.defaultPassword
    ) {
      const devUser: AuthUser = {
        id: 'dev-admin-id',
        email: DEV_ADMIN_CREDENTIALS.email,
        role: 'admin',
      };
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(devUser));
      return { user: devUser };
    }

    // Also accept any valid custom email if password matches or matches stored local password
    const storedCustomPass = localStorage.getItem('sten_local_admin_password');
    if (storedCustomPass && password === storedCustomPass) {
      const customUser: AuthUser = {
        id: 'dev-custom-id',
        email: email.trim(),
        role: 'admin',
      };
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(customUser));
      return { user: customUser };
    }

    return {
      user: null,
      error: isSupabaseConfigured
        ? 'Invalid email or password.'
        : `Invalid credentials. For local testing, use: ${DEV_ADMIN_CREDENTIALS.email} / ${DEV_ADMIN_CREDENTIALS.defaultPassword} or configure Supabase in .env.`,
    };
  },

  /**
   * Sign out from current session.
   */
  async logout(): Promise<void> {
    localStorage.removeItem(LOCAL_AUTH_KEY);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
  },

  /**
   * Check if current user is logged in.
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          return {
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin',
          };
        }
      } catch (err) {
        console.warn('Error reading Supabase session:', err);
      }
    }

    // Check local session
    try {
      const local = localStorage.getItem(LOCAL_AUTH_KEY);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.error('Error parsing local session', e);
    }

    return null;
  },

  /**
   * Listen to auth state transitions
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session && session.user) {
          const user: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin',
          };
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user));
          callback(user);
        } else {
          localStorage.removeItem(LOCAL_AUTH_KEY);
          callback(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    // Return dummy unsubscriber for local mode
    return () => {};
  },
};
