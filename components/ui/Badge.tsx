'use client';

import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = ({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) => {
  const variants = {
    default: 'bg-brand-border text-brand-textMuted',
    success: 'bg-brand-successBg text-brand-success border border-brand-success/30',
    warning: 'bg-brand-warningBg text-brand-warning border border-brand-warning/30',
    error: 'bg-brand-errorBg text-brand-error border border-brand-error/30',
    info: 'bg-brand-accentBg text-brand-accent border border-brand-accent/30',
    outline: 'bg-transparent text-brand-textMuted border border-brand-border',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};