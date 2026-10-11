import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { announcementRepository } from '@/lib/repository';

export async function GET() {
  try {
    await getSession();
    
    const announcements = await announcementRepository.findActive();
    return NextResponse.json(announcements);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get announcements error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}