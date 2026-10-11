import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { attendanceEventRepository } from '@/lib/repository';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get('memberId') || '';
    const type = searchParams.get('type') || '';
    const date = searchParams.get('date') || '';
    
    let events = await attendanceEventRepository.findAll();
    
    if (memberId) events = events.filter((e) => e.memberId === memberId);
    if (type) events = events.filter((e) => e.type === type);
    if (date) events = events.filter((e) => e.gymLocalDate === date);
    
    return NextResponse.json(events);
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}