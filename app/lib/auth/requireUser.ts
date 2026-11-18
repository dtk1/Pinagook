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

/**
 * Get current authenticated user AND ensure they have the Teacher role.
 * Redirects to /courses if user is a student.
 */
export async function requireTeacher(redirectTo: string = '/courses') {
  const user = await requireUser(redirectTo);

  // Email override for primary teacher/admin
  if (user.email?.toLowerCase().trim() === 'dauletlegenov@gmail.com') {
    return user;
  }
  
  // Check user metadata role or query profiles table
  const role = user.user_metadata?.role;
  
  if (role && role !== 'teacher') {
    redirect(`${redirectTo}?error=${encodeURIComponent('Teacher access required.')}`);
  }

  // Fallback: check profile table if metadata isn't set yet
  if (!role) {
    const supabase = await createServerSupabaseClient();
    const { data: profile } = await (supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle() as any);

    if (profile?.role !== 'teacher') {
      redirect(`${redirectTo}?error=${encodeURIComponent('Teacher access required.')}`);
    }
  }

  return user;
}

