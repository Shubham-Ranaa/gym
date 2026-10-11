'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, CalendarCheck, CreditCard, Dumbbell, MessageSquare, Megaphone, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, QrCode, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/admin/plans', label: 'Membership Plans', icon: CreditCard },
  { href: '/admin/trainers', label: 'Trainers', icon: Dumbbell },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/gym-qr', label: 'Gym QR Code', icon: QrCode, highlight: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  return (
    <>
      {/* Mobile top bar with hamburger */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-brand-surface border-b border-brand-border z-40 flex items-center px-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-xl text-brand-text hover:text-brand-accent hover:bg-brand-surfaceHover transition-colors"
          aria-label="Open admin menu"
          aria-expanded={mobileOpen}
          aria-controls="admin-sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="ml-3 text-lg font-bold text-brand-text">FitForge Admin</span>
      </header>
      
      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <aside
        id="admin-sidebar"
        className={cn(
          'fixed left-0 top-0 bottom-0 bg-brand-surface border-r border-brand-border z-50 transition-all duration-300',
          'lg:top-16 lg:z-30',
          collapsed ? 'lg:w-20' : 'lg:w-64',
          'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="flex flex-col h-full p-4" aria-label="Admin navigation">
          {/* Brand row (mobile only) */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <span className="text-lg font-bold text-brand-text">FitForge</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl text-brand-textMuted hover:text-brand-text hover:bg-brand-surfaceHover"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Header (desktop only) */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            {!collapsed && <h2 className="text-xl font-bold text-brand-text">Admin</h2>}
          </div>
          
          <ul className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-brand-accent/20',
                      item.highlight
                        ? 'text-brand-accent hover:text-brand-accentHover hover:bg-brand-accentBg'
                        : isActive
                          ? 'bg-brand-accentBg text-brand-accent border border-brand-accent/30'
                          : 'text-brand-textMuted hover:text-brand-text hover:bg-brand-surfaceHover',
                      (collapsed || false) && 'lg:justify-center'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span className="font-medium whitespace-nowrap lg:hidden">{item.label}</span>
                    {!collapsed && <span className="font-medium whitespace-nowrap hidden lg:inline">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
          
          <div className="border-t border-brand-border pt-4">
            <Link
              href="/api/auth/logout"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-brand-textMuted hover:text-brand-error hover:bg-brand-errorBg/50"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium whitespace-nowrap lg:hidden">Logout</span>
              {!collapsed && <span className="font-medium whitespace-nowrap hidden lg:inline">Logout</span>}
            </Link>
          </div>
          
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full',
              'bg-brand-surface border border-brand-border text-brand-textMuted hover:text-brand-accent hover:border-brand-accent transition-all',
              'focus:outline-none focus:ring-2 focus:ring-brand-accent hidden lg:block',
              collapsed && 'rotate-180'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </nav>
      </aside>
    </>
  );
}