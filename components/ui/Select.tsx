'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-brand-surface border border-brand-border text-brand-text rounded-xl',
            'transition-all duration-200 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-brand-error focus:border-brand-error focus:ring-brand-error/20',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-brand-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';