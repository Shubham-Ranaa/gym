import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { enquiryRepository } from '@/lib/repository';

export async function GET() {
  try {
    await requireAdmin();
    const enquiries = await enquiryRepository.findAll();
    return NextResponse.json(enquiries);
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}