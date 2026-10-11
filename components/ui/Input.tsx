'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-3 bg-brand-surface border border-brand-border text-brand-text placeholder-brand-textDim rounded-xl',
            'transition-all duration-200',
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

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-brand-surface border border-brand-border text-brand-text placeholder-brand-textDim rounded-xl',
            'transition-all duration-200 resize-none',
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

Textarea.displayName = 'Textarea';