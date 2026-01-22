/**
 * Supabase browser client
 * For use in client components and browser-side code
 * Uses localStorage for session persistence (works with cookie-based SSR)
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './db.types';

/**
 * Create a Supabase client for browser usage
 * This client persists session in localStorage and syncs with server cookies
 */
export function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // Detect auth tokens in URL (for email confirmation, etc.)
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  });
}
