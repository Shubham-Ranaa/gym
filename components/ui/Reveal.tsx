'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/**
 * Scroll-triggered entrance animation. Respects prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, y = 24, className, once = true }: RevealProps) {
  const reduce = useReducedMotion();
  
  if (reduce) return <div className={className}>{children}</div>;
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Reveals children one after another on scroll.
 */
export function Stagger({ children, className, delay = 0 }: StaggerProps) {
  const reduce = useReducedMotion();
  
  if (reduce) return <div className={className}>{children}</div>;
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.08, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  
  if (reduce) return <div className={className}>{children}</div>;
  
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Consistent section heading used across the public site.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  return (
    <Reveal
      className={`mb-10 lg:mb-14 ${align === 'center' ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}
    >
      {eyebrow && (
        <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-heading-xl sm:text-display-sm font-extrabold tracking-tight text-brand-text">
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base sm:text-body-lg text-brand-textMuted ${align === 'center' ? 'mx-auto' : ''} max-w-2xl`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}