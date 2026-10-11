'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, User, CalendarCheck, Dumbbell, Megaphone, CreditCard, LogOut, Menu, X
} from 'lucide-react';

const memberNavItems = [
  { href: '/member', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/member/profile', label: 'Profile', icon: User },
  { href: '/member/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/member/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/member/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/member/membership', label: 'Membership', icon: CreditCard },
];

export function MemberLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="fixed top-0 left-0 right-0 h-16 bg-brand-surface border-b border-brand-border z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-xl text-brand-text hover:text-brand-accent hover:bg-brand-surfaceHover transition-colors lg:hidden"
            aria-label="Open member menu"
            aria-expanded={mobileOpen}
            aria-controls="member-nav"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Link href="/member" className="flex items-center gap-2" aria-label="Member Dashboard">
            <span className="text-xl font-bold text-brand-accent">FitForge</span>
            <span className="hidden sm:inline text-sm text-brand-textMuted">Member Portal</span>
          </Link>
          
          <div className="flex items-center gap-1">
            <Link
              href="/check-in"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-brand-accentBg text-brand-accent hover:bg-brand-accent/20 transition-colors"
            >
              <CalendarCheck className="h-4 w-4" />
              Check In
            </Link>
            <Link
              href="/api/auth/logout"
              className="px-3 py-2 text-sm font-medium text-brand-textMuted hover:text-brand-error transition-colors"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>
      
      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        id="member-nav"
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-brand-surface border-r border-brand-border z-50 p-4 transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-bold text-brand-text">Menu</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl text-brand-textMuted hover:text-brand-text hover:bg-brand-surfaceHover"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Member navigation">
          <ul className="space-y-1">
            {memberNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-brand-accentBg text-brand-accent'
                        : 'text-brand-textMuted hover:text-brand-text hover:bg-brand-surfaceHover'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-6 pt-6 border-t border-brand-border">
          <Link
            href="/check-in"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-brand-accentBg text-brand-accent"
          >
            <CalendarCheck className="h-4 w-4" />
            Check In / Out
          </Link>
        </div>
      </aside>
      
      {/* Desktop nav */}
      <div className="hidden lg:block fixed top-16 left-0 right-0 bg-brand-bg/80 backdrop-blur-sm border-b border-brand-border z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 py-2" aria-label="Member navigation">
            {memberNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-brand-accentBg text-brand-accent'
                      : 'text-brand-textMuted hover:text-brand-text hover:bg-brand-surfaceHover'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      <main className="pt-16 lg:pt-32 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}