import { InputHTMLAttributes, useState } from 'react';

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export default function SearchField({ 
  value,
  onChange,
  onClear,
  className = '', 
  placeholder = 'Search...',
  ...props 
}: SearchFieldProps) {
  const hasValue = value && String(value).length > 0;

  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        className={`w-full h-11 pl-10 pr-10 rounded-xl border border-[#E6EEF2] hover:border-[#CBD5E1] focus:border-[#0EA5B7] focus:ring-2 focus:ring-[#0EA5B7]/20 bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-all ${className}`}
        placeholder={placeholder}
        {...props}
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

