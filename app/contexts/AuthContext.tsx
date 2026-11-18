'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserSupabaseClient } from '../lib/supabase/browser';
import { signOutAction } from '../actions/authActions';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'student' | 'teacher' | null;

interface AuthContextType {
  user: SupabaseUser | null;
  role: UserRole;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    let mounted = true;

    // Safety timeout: Never stay stuck in loading state for more than 800ms
    const safetyTimer = setTimeout(() => {
      if (mounted && isLoading) {
        setIsLoading(false);
      }
    }, 800);

    const updateAuthState = async (currentUser: SupabaseUser | null) => {
      if (!mounted) return;

      setUser(currentUser);
      
      if (!currentUser) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      // Hardcode teacher override for primary admin/teacher account
      if (currentUser.email?.toLowerCase().trim() === 'dauletlegenov@gmail.com') {
        setRole('teacher');
        setIsLoading(false);
        return;
      }

      // Check metadata role first (fastest)
      const metaRole = (currentUser.user_metadata?.role as UserRole) || null;
      if (metaRole) {
        setRole(metaRole);
        setIsLoading(false);
        return;
      }

      // Default to student role immediately so UI doesn't hang
      setRole('student');
      setIsLoading(false);

      // Async background check for profiles table role
      try {
        const { data } = await (supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle() as any);

        if (mounted && data?.role) {
          setRole(data.role as UserRole);
        }
      } catch (e) {
        // Silently fallback to student
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error);
          }
          await updateAuthState(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        await updateAuthState(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await signOutAction();
    setUser(null);
    setRole(null);
  };

  const value: AuthContextType = {
    user,
    role,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
