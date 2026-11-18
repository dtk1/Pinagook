'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, role, isLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const isTeacher = role === 'teacher';

  return (
    <nav className="w-full max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 shadow-md shadow-sky-500/20 flex items-center justify-center transform group-hover:scale-105 transition-transform">
          <span className="text-white font-black text-xl leading-none">🐬</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
            Pinagook
          </span>
          <span className="text-[10px] font-bold text-sky-600 tracking-wider uppercase leading-none mt-0.5">
            English Teaching Workspace
          </span>
        </div>
      </Link>
      
      {/* Navigation Links - ONLY shown when logged in */}
      {user && (
        <div className="hidden md:flex items-center gap-6">
          {isTeacher ? (
            <>
              <Link href="/teacher" className="text-purple-700 bg-purple-50 hover:bg-purple-100 font-extrabold text-sm transition-colors px-3 py-1.5 rounded-lg border border-purple-200/60">
                👩‍🏫 Teacher Dashboard
              </Link>
              <Link href="/courses" className="text-slate-600 hover:text-sky-600 font-bold text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-sky-50">
                Courses
              </Link>
              <Link href="/progress" className="text-slate-600 hover:text-sky-600 font-bold text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-sky-50">
                Progress
              </Link>
            </>
          ) : (
            <>
              <Link href="/courses" className="text-slate-600 hover:text-sky-600 font-bold text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-sky-50">
                Courses
              </Link>
              <Link href="/placement-test" className="text-sky-600 bg-sky-50 hover:bg-sky-100 font-extrabold text-sm transition-colors px-3 py-1.5 rounded-lg border border-sky-200/60">
                🌍 Placement Test
              </Link>
              <Link href="/progress" className="text-slate-600 hover:text-sky-600 font-bold text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-sky-50">
                Progress
              </Link>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {isLoading ? (
          <span className="text-xs font-semibold text-slate-400 animate-pulse">Loading...</span>
        ) : user ? (
          <>
            <span className="text-xs text-slate-600 font-bold hidden lg:block bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
              {isTeacher ? '👩‍🏫 Teacher' : '🎓 Student'}: <span className="font-semibold text-slate-800">{user.email}</span>
            </span>
            <Button variant="secondary" size="s" tactile={true} onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-slate-600 hover:text-sky-600 font-bold text-sm transition-colors hidden md:block px-3 py-1.5">
              Login
            </Link>
            <Link href="/auth/register">
              <Button variant="primary" size="s" tactile={true}>
                Register FREE
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
