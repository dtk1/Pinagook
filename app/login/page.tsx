import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <form className="space-y-4">
          <Input type="email" label="Email" placeholder="you@example.com" />
          <Input type="password" label="Password" placeholder="••••••••" />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-[#0ea5e9] hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button variant="primary" className="w-full">Sign in</Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#0ea5e9] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

