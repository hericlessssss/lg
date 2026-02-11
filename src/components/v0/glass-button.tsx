'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { LogIn, UserPlus } from 'lucide-react';

interface GlassButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
}

export function GlassButton({ children, variant, onClick }: GlassButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex min-w-[180px] items-center justify-center gap-3 overflow-hidden rounded-lg px-8 py-4 font-medieval text-lg tracking-wider transition-all duration-300 sm:min-w-[200px] sm:px-10 sm:py-4 sm:text-xl',
        'backdrop-blur-xl border',
        isPrimary
          ? 'border-[#d4af37]/40 bg-[#d4af37]/10 text-[#f5e6c8] hover:border-[#d4af37]/70 hover:bg-[#d4af37]/20 hover:text-[#fff8e7] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]'
          : 'border-[#f5e6c8]/20 bg-[#f5e6c8]/5 text-[#c4b08a] hover:border-[#f5e6c8]/40 hover:bg-[#f5e6c8]/10 hover:text-[#f5e6c8] hover:shadow-[0_0_30px_rgba(245,230,200,0.15)]',
      )}
    >
      {/* Shimmer effect */}
      <span
        className={cn(
          'absolute inset-0 -translate-x-full skew-x-[-20deg] transition-transform duration-700 group-hover:translate-x-full',
          isPrimary
            ? 'bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent'
            : 'bg-gradient-to-r from-transparent via-[#f5e6c8]/10 to-transparent',
        )}
      />

      {/* Top edge glow */}
      <span
        className={cn(
          'absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          isPrimary
            ? 'bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent'
            : 'bg-gradient-to-r from-transparent via-[#f5e6c8]/30 to-transparent',
        )}
      />

      {/* Icon */}
      <span className="relative z-10">
        {isPrimary ? (
          <LogIn className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <UserPlus className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        )}
      </span>

      {/* Label */}
      <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
        {children}
      </span>
    </button>
  );
}
