'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && !allowedRoles.includes(user.role)) {
        // Redirect based on user role
        if (user.role === 'teacher') {
          router.push('/teacher/dashboard');
        } else if (user.role === 'admin') {
          router.push('/admin/users');
        } else {
          router.push('/');
        }
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}



