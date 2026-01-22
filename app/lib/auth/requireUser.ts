/**
 * Server-only utility to require authenticated user
 * Redirects to login if user is not authenticated
 */

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '../supabase/server';

/**
 * Get the current authenticated user or redirect to login
 * @param redirectTo - Optional path to redirect to after login (default: current path)
 * @returns User object (never returns null, redirects instead)
 */
export async function requireUser(redirectTo?: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const currentPath = redirectTo || '/';
    redirect(`/auth/login?next=${encodeURIComponent(currentPath)}`);
  }

  return user;
}
