import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${
        hover ? 'hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

