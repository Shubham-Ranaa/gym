import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { generateGymQRCode } from '@/lib/qr';

export async function GET() {
  try {
    await requireAdmin();
    const { dataUrl, svg, checkInUrl } = await generateGymQRCode();
    return NextResponse.json({ dataUrl, svg, checkInUrl });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    console.error('QR generation error:', error);
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to generate QR code' }, { status: 500 });
  }
}