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
  const [role, setRole] = useState<'student' | 'teacher'>('student');
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

    const result = await signUpAction(email, password, role);

    if (result.ok) {
      if (result.needsConfirmation) {
        setNeedsConfirmation(true);
        setIsLoading(false);
      } else {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl border-slate-200">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                🐬
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Join Pinagook</h1>
              <p className="text-sm text-slate-500 mt-1">Select your account type to get started</p>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                    role === 'student'
                      ? 'border-sky-500 bg-sky-50/80 text-sky-900 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-2xl">🎓</span>
                  <span className="font-extrabold text-sm">Student</span>
                  <span className="text-[11px] text-slate-500 leading-tight">Learn English & test level</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                    role === 'teacher'
                      ? 'border-purple-500 bg-purple-50/80 text-purple-900 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-2xl">👩‍🏫</span>
                  <span className="font-extrabold text-sm">Teacher</span>
                  <span className="text-[11px] text-slate-500 leading-tight">Create lessons & manage students</span>
                </button>
              </div>
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
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 space-y-2">
                  <p>{error}</p>
                  {error.includes('already exists') && (
                    <Link 
                      href="/auth/login" 
                      className="text-sky-600 hover:underline font-bold block"
                    >
                      → Go to Sign In
                    </Link>
                  )}
                </div>
              )}

              {needsConfirmation && (
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-3">
                  <div className="text-sm text-sky-900">
                    <p className="font-bold mb-1">✓ Account created successfully!</p>
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
                  </div>
                </div>
              )}

              {!needsConfirmation && (
                <Button type="submit" variant="primary" tactile={true} className="w-full" isLoading={isLoading}>
                  Register as {role === 'teacher' ? 'Teacher 👩‍🏫' : 'Student 🎓'}
                </Button>
              )}
            </form>

            <div className="text-center text-sm text-slate-500 font-medium pt-2">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-sky-600 font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
