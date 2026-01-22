'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInAction, resendConfirmationAction } from '../../actions/authActions';
import { createBrowserSupabaseClient } from '../../lib/supabase/browser';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/courses';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNeedsConfirmation(false);
    setResendSuccess(false);
    setIsLoading(true);

    const result = await signInAction(email, password);

    if (result.ok) {
      // Also sign in with browser client to sync localStorage with cookies
      // This ensures AuthContext updates immediately and Navbar shows correct state
      const supabase = createBrowserSupabaseClient();
      const { error: browserError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (browserError) {
        // If browser sign in fails, still redirect (server cookies are set)
        console.warn('Browser sign in failed, but server cookies are set:', browserError);
      }

      // Wait a bit for AuthContext to update, then navigate
      await new Promise(resolve => setTimeout(resolve, 200));
      router.push(next);
      router.refresh();
    } else {
      setError(result.error);
      if (result.needsConfirmation) {
        setNeedsConfirmation(true);
      }
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setError(null);

    const result = await resendConfirmationAction(email);

    if (result.ok) {
      setResendSuccess(true);
    } else {
      setError(result.error);
    }
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md">
        <Card>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Sign In</h1>
              <p className="text-sm text-[#64748B]">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="you@example.com"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="••••••••"
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  {error}
                </div>
              )}

              {needsConfirmation && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Email not confirmed</p>
                    <p>Please check your email and confirm your account before signing in.</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleResendConfirmation}
                    isLoading={resendLoading}
                    className="w-full"
                  >
                    {resendSuccess ? '✓ Email Sent' : 'Resend Confirmation Email'}
                  </Button>
                  {resendSuccess && (
                    <p className="text-xs text-blue-700 text-center">
                      Confirmation email sent! Check your inbox.
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            <div className="text-center text-sm text-[#64748B]">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-[#0EA5B7] hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
