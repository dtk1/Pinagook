import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Start teaching smarter today</p>
        </div>
        <form className="space-y-4">
          <Input type="text" label="Full Name" placeholder="John Doe" />
          <Input type="email" label="Email" placeholder="you@example.com" />
          <Input type="password" label="Password" placeholder="••••••••" />
          <Input type="password" label="Confirm Password" placeholder="••••••••" />
          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-1 rounded" />
            <span className="text-sm text-gray-600">
              I agree to the{' '}
              <Link href="/policies" className="text-[#0ea5e9] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/policies" className="text-[#0ea5e9] hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          <Button variant="primary" className="w-full">Create account</Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0ea5e9] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

