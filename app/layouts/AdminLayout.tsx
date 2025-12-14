import { ReactNode } from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/users" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#14b8a6] flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐬</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Pinagook Admin</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/admin/users" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Users</Link>
              <Link href="/admin/lessons" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Lessons</Link>
              <Link href="/admin/analytics" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Analytics</Link>
              <Link href="/admin/plans" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Plans</Link>
              <Link href="/admin/settings" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Settings</Link>
              <button className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-[1440px] mx-auto px-8 py-8">{children}</main>
    </div>
  );
}

