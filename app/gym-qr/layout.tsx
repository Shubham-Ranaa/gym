import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

/**
 * The gym QR management page is admin-only. Members and anonymous
 * visitors are redirected away.
 */
export default async function GymQRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login?callbackUrl=/gym-qr');
  }
  
  if (session.role !== 'admin') {
    redirect('/member');
  }
  
  return <>{children}</>;
}