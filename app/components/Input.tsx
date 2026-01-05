'use client';

import { InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
}

export default function Input({ 
  label, 
  helperText,
  error = false,
  errorText,
  className = '', 
  type = 'text',
  ...props 
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#475569] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`w-full h-11 px-3.5 rounded-xl border ${
            error 
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20' 
              : 'border-[#E6EEF2] hover:border-[#CBD5E1] focus:border-[#0EA5B7] focus:ring-2 focus:ring-[#0EA5B7]/20'
          } bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-all ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
      {(helperText || errorText) && (
        <p className={`mt-2 text-xs ${error ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`}>
          {error ? errorText : helperText}
        </p>
      )}
    </div>
  );
}
