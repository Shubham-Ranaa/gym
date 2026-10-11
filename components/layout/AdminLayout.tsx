'use client';

import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg">
      <AdminSidebar />
      {/* Sidebar is fixed; mobile has no offset, desktop is offset by the rail */}
      <main className="pt-16 lg:pt-16 lg:ml-64 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}