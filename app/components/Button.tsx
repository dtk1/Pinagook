import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: ReactNode;
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-full font-medium transition-all duration-200 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] text-white hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105',
    secondary: 'bg-white text-[#0ea5e9] border-2 border-[#0ea5e9] hover:bg-[#e0f2fe]',
    outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:border-[#0ea5e9] hover:text-[#0ea5e9]'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

