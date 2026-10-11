import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/session';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ message: 'Logged out successfully' });
}

export async function GET() {
  await clearSessionCookie();
  return NextResponse.redirect(new URL('/login', process.env.APP_URL || 'http://localhost:3000'));
}