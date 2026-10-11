import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

/**
 * The check-in page requires an authenticated session. Anonymous scanners
 * who land here from the printed QR code are sent to login and returned
 * here afterwards.
 */
export default async function CheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login?callbackUrl=/check-in');
  }
  
  return <>{children}</>;
}