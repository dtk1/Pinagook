/**
 * Authentication server actions
 * Handles sign up, sign in, and sign out with cookie-based auth
 */

'use server';

import { createServerSupabaseClient } from '../lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Sign up a new user
 * @param email - User email
 * @param password - User password
 * @returns Result object with ok status and optional error message
 */
export async function signUpAction(
  email: string,
  password: string
): Promise<
  | { ok: true; needsConfirmation?: boolean }
  | { ok: false; error: string }
> {
  const supabase = await createServerSupabaseClient();

  // Attempt to sign up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    // Handle "User already registered" error with a clearer message
    if (error.message.toLowerCase().includes('already registered') || 
        error.message.toLowerCase().includes('user already exists') ||
        error.message.toLowerCase().includes('email address is already registered')) {
      return { 
        ok: false, 
        error: 'An account with this email already exists. Please sign in instead.' 
      };
    }
    return { ok: false, error: error.message };
  }

  if (!data.user) {
    return { ok: false, error: 'Failed to create user' };
  }

  // Check if profile already exists (this indicates user was already registered)
  // Supabase may return success even for existing users (for security), so we check profile
  const { data: existingProfile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle();

  // If profile already exists, user was already registered
  // Supabase returned the existing user instead of creating a new one
  if (existingProfile && !profileCheckError) {
    return { 
      ok: false, 
      error: 'An account with this email already exists. Please sign in instead.' 
    };
  }

  // Create profile in profiles table with default role 'student'
  // Use upsert to handle case where profile might already exist (e.g., from trigger)
  // Type assertion needed due to Supabase type inference limitations
  const { error: profileError } = await (supabase
    .from('profiles')
    .upsert(
      {
        id: data.user.id,
        role: 'student',
      } as any,
      {
        onConflict: 'id',
      }
    ) as any);

  if (profileError) {
    // If profile creation fails due to conflict, user already exists
    if (profileError.code === '23505' || profileError.message.includes('duplicate') || profileError.message.includes('unique')) {
      return { 
        ok: false, 
        error: 'An account with this email already exists. Please sign in instead.' 
      };
    }
    console.error('Failed to create profile:', profileError);
    // Don't fail registration if profile creation fails - user can still sign in
    // Profile might be created by a database trigger
  }

  // Check if email confirmation is required
  // If user exists but wasn't confirmed, Supabase will return user without session
  const needsConfirmation = data.user && !data.session;

  revalidatePath('/', 'layout');
  return { ok: true, needsConfirmation };
}

/**
 * Resend email confirmation
 * @param email - User email
 * @returns Result object with ok status and optional error message
 */
export async function resendConfirmationAction(
  email: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/**
 * Sign in an existing user
 * @param email - User email
 * @param password - User password
 * @returns Result object with ok status and optional error message
 */
export async function signInAction(
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string; needsConfirmation?: boolean }> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Check if error is due to unconfirmed email
    const needsConfirmation = error.message.toLowerCase().includes('email') && 
                               (error.message.toLowerCase().includes('confirm') || 
                                error.message.toLowerCase().includes('verify') ||
                                error.message.toLowerCase().includes('not confirmed'));
    
    return { 
      ok: false, 
      error: error.message,
      needsConfirmation 
    };
  }

  if (!data.user) {
    return { ok: false, error: 'Failed to sign in' };
  }

  revalidatePath('/', 'layout');
  return { ok: true };
}

/**
 * Sign out the current user
 * @returns Result object with ok status and optional error message
 * Note: Does not redirect - client components should handle navigation
 */
export async function signOutAction(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  return { ok: true };
}
