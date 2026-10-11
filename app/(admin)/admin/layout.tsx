import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

/**
 * Server-side guard for the entire admin portal.
 * Unauthenticated visitors are redirected to login; members receive 404
 * rather than a hint that admin routes exist.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }
  
  if (session.role !== 'admin') {
    redirect('/member');
  }
  
  return <>{children}</>;
}