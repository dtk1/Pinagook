'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signUpAction, resendConfirmationAction } from '../../actions/authActions';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const result = await signUpAction(email, password);

    if (result.ok) {
      if (result.needsConfirmation) {
        setNeedsConfirmation(true);
        setIsLoading(false);
      } else {
        // No email confirmation required, redirect to login
        window.location.href = '/auth/login?message=Account created. Please sign in.';
      }
    } else {
      setError(result.error);
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
              <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Create Account</h1>
              <p className="text-sm text-[#64748B]">Sign up to start creating courses</p>
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
                helperText="At least 6 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="••••••••"
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 space-y-2">
                  <p>{error}</p>
                  {error.includes('already exists') && (
                    <Link 
                      href="/auth/login" 
                      className="text-[#0EA5B7] hover:underline font-medium block"
                    >
                      → Go to Sign In
                    </Link>
                  )}
                </div>
              )}

              {needsConfirmation && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">✓ Account created successfully!</p>
                    <p>Please check your email to confirm your account before signing in.</p>
                  </div>
                  <div className="space-y-2">
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
                </div>
              )}

              {!needsConfirmation && (
                <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                  Create Account
                </Button>
              )}
            </form>

            <div className="text-center text-sm text-[#64748B]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#0EA5B7] hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
