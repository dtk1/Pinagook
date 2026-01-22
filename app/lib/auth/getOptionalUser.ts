/**
 * Server-only utility to get optional authenticated user
 * Does NOT redirect - returns null if user is not authenticated
 * Use this when you need to check auth status without forcing login
 */

import { createServerSupabaseClient } from '../supabase/server';
import type { User } from '@supabase/supabase-js';

/**
 * Get the current authenticated user or null
 * @returns User object or null if not authenticated
 */
export async function getOptionalUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
