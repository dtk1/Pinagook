'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // Navigate to login page after sign out
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <nav className="w-full max-w-[1440px] mx-auto px-8 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#0EA5B7] flex items-center justify-center">
          <span className="text-white font-bold text-lg">🐬</span>
        </div>
        <span className="text-xl font-semibold text-[#0F172A]">Pinagook</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <Link href="/courses" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">
          Courses
        </Link>
        {user && (
          <Link href="/teacher" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">
            Teacher
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isLoading ? (
          <span className="text-sm text-[#475569] animate-pulse">Loading...</span>
        ) : user ? (
          <>
            <span className="text-sm text-[#475569] hidden md:block">
              Signed in as <span className="font-medium">{user.email}</span>
            </span>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-[#475569] hover:text-[#0EA5B7] transition-colors hidden md:block">
              Login
            </Link>
            <Link href="/auth/register">
              <Button variant="primary">Register</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
