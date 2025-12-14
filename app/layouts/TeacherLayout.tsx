'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface TeacherLayoutProps {
  children: ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <nav className="bg-white border-b border-[#E6EEF2]">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/teacher/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0EA5B7] flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐬</span>
              </div>
              <span className="text-xl font-semibold text-[#0F172A]">Pinagook</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/teacher/dashboard" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">Dashboard</Link>
              <Link href="/teacher/lessons" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">Lessons</Link>
              <Link href="/teacher/templates" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">Templates</Link>
              <Link href="/teacher/profile" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">Profile</Link>
              {user && (
                <span className="text-sm text-[#94A3B8]">{user.name}</span>
              )}
              <button
                onClick={handleLogout}
                className="text-[#475569] hover:text-[#0EA5B7] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-[1440px] mx-auto px-8 py-8">{children}</main>
    </div>
  );
}

