import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'tactile-primary' | 'tactile-success';
  size?: 's' | 'm' | 'l';
  isLoading?: boolean;
  tactile?: boolean;
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'm',
  isLoading = false,
  tactile = false,
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl select-none';
  
  const sizes = {
    s: 'h-9 px-3.5 text-sm gap-2',
    m: 'h-11 px-5 text-base gap-2',
    l: 'h-13 px-6 text-lg gap-2.5'
  };

  const variants = {
    primary: tactile 
      ? 'btn-tactile btn-tactile-primary' 
      : 'bg-[#0ea5e9] text-white hover:bg-[#0284c7] shadow-sm hover:shadow-md disabled:opacity-40 disabled:shadow-none',
    success: tactile
      ? 'btn-tactile btn-tactile-success'
      : 'bg-[#58cc02] text-white hover:bg-[#46a302] shadow-sm hover:shadow-md disabled:opacity-40 disabled:shadow-none',
    danger: tactile
      ? 'btn-tactile btn-tactile-danger'
      : 'bg-[#ff4b4b] text-white hover:bg-[#ea2b2b] shadow-sm hover:shadow-md disabled:opacity-40 disabled:shadow-none',
    secondary: tactile
      ? 'btn-tactile btn-tactile-secondary'
      : 'bg-white border border-[#E6EEF2] text-[#0F172A] hover:bg-[#f8fafc] disabled:opacity-40',
    ghost: 'bg-transparent text-[#0ea5e9] hover:bg-[#e0f2fe] disabled:opacity-40',
    'tactile-primary': 'btn-tactile btn-tactile-primary',
    'tactile-success': 'btn-tactile btn-tactile-success'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${isDisabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

