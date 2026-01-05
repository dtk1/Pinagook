import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 's' | 'm' | 'l';
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'm',
  isLoading = false,
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl';
  
  const sizes = {
    s: 'h-8 px-3 text-sm gap-2',
    m: 'h-10 px-4 text-base gap-2',
    l: 'h-12 px-5 text-base gap-2.5'
  };

  const variants = {
    primary: 'bg-[#0EA5B7] text-white hover:bg-[#0B8A99] shadow-sm hover:shadow-md disabled:opacity-40 disabled:shadow-none',
    secondary: 'bg-transparent border border-[#E6EEF2] text-[#0F172A] hover:bg-[#D9F6F8] disabled:opacity-40',
    ghost: 'bg-transparent text-[#0EA5B7] hover:bg-[#D9F6F8] disabled:opacity-40',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm hover:shadow-md disabled:opacity-40 disabled:shadow-none'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${isDisabled ? 'cursor-not-allowed' : ''} ${className}`}
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
