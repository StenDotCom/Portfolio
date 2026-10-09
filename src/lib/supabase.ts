import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

// Fallback dummy client if credentials are not configured yet
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Health check to verify if the live Supabase project can be queried.
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return {
      ok: false,
      message: 'Supabase credentials not configured in environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY).',
    };
  }

  try {
    const { error } = await supabase.from('profile').select('id').limit(1);
    if (error) {
      // Table might not exist yet if migrations haven't run
      return {
        ok: false,
        message: `Connected to Supabase endpoint, but table query returned: ${error.message}. Ensure schema.sql has been run.`,
      };
    }
    return {
      ok: true,
      message: 'Successfully connected to Supabase database!',
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err.message || 'Network error while attempting to reach Supabase.',
    };
  }
}
