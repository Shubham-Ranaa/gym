'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Dumbbell, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/trainers', label: 'Trainers' },
  { href: '/membership', label: 'Membership' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Lock body scroll while the mobile panel is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Close on Escape for accessibility
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);
  
  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-brand-bg/95 backdrop-blur-sm border-b border-brand-border' : 'bg-transparent'
      )}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="FitForge Home">
              <Dumbbell className="h-8 w-8 text-brand-accent" />
              <span className="text-xl font-bold text-brand-text">FitForge</span>
            </Link>
            
            <div className="hidden md:flex md:items-center md:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-brand-textMuted hover:text-brand-text transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="hidden md:flex md:items-center md:gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
            
            <button
              className="md:hidden p-2 text-brand-text hover:text-brand-accent transition-colors"
              onClick={() => setIsOpen(true)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>
      
      {/* Mobile overlay panel */}
      <div
        className={cn(
          'fixed inset-0 z-[60] md:hidden',
          isOpen ? 'visible' : 'invisible pointer-events-none'
        )}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/70 transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Panel */}
        <div
          id="mobile-menu"
          className={cn(
            'absolute top-0 left-0 h-full w-[85%] max-w-sm bg-brand-bg border-r border-brand-border',
            'flex flex-col transition-transform duration-300 ease-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-16 items-center justify-between px-4 border-b border-brand-border flex-shrink-0">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <Dumbbell className="h-7 w-7 text-brand-accent" />
              <span className="text-lg font-bold text-brand-text">FitForge</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-brand-textMuted hover:text-brand-text hover:bg-brand-surfaceHover transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 rounded-xl text-base font-medium text-brand-textMuted hover:text-brand-text hover:bg-brand-surface transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-6 border-t border-brand-border space-y-3">
              <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <LogIn className="h-4 w-4" />
                  Log In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="block">
                <Button className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}