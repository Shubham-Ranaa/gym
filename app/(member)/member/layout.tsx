import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

/**
 * Server-side guard for the entire member portal.
 * Unauthenticated visitors are redirected to login.
 */
export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login?callbackUrl=/member');
  }
  
  return <>{children}</>;
}