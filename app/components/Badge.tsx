import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 's' | 'm';
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'default',
  size = 'm',
  className = '' 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const sizes = {
    s: 'px-2 py-0.5 text-xs',
    m: 'px-2.5 py-1 text-sm'
  };

  const variants = {
    default: 'bg-[#E6EEF2] text-[#475569]',
    success: 'bg-[#DCFCE7] text-[#16A34A]',
    warning: 'bg-[#FEF3C7] text-[#F59E0B]',
    error: 'bg-[#FEE2E2] text-[#EF4444]',
    info: 'bg-[#DBEAFE] text-[#3B82F6]'
  };

  return (
    <span className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
