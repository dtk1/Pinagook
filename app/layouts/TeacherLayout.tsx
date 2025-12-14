import { ReactNode } from 'react';
import Link from 'next/link';

interface TeacherLayoutProps {
  children: ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/teacher/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#14b8a6] flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐬</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Pinagook</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/teacher/dashboard" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Dashboard</Link>
              <Link href="/teacher/lessons" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Lessons</Link>
              <Link href="/teacher/templates" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Templates</Link>
              <Link href="/teacher/profile" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Profile</Link>
              <button className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-[1440px] mx-auto px-8 py-8">{children}</main>
    </div>
  );
}

