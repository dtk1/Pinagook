import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 's' | 'm' | 'l';
}

export default function Card({ 
  children, 
  className = '', 
  hover = true,
  padding = 'm'
}: CardProps) {
  const paddingClasses = {
    s: 'p-4',
    m: 'p-6',
    l: 'p-6'
  };

  return (
    <div
      className={`bg-white rounded-2xl ${paddingClasses[padding]} border border-[#E6EEF2] ${
        hover ? 'hover:shadow-md transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

