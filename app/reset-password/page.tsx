import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set new password</h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>
        <form className="space-y-4">
          <Input type="password" label="New Password" placeholder="••••••••" />
          <Input type="password" label="Confirm New Password" placeholder="••••••••" />
          <Button variant="primary" className="w-full">Reset password</Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          <Link href="/login" className="text-[#0ea5e9] hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

