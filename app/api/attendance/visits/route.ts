import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { visitRepository } from '@/lib/repository';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get('memberId') || '';
    const status = searchParams.get('status') || '';
    const date = searchParams.get('date') || '';
    
    let visits = await visitRepository.findAll();
    
    if (memberId) visits = visits.filter((v) => v.memberId === memberId);
    if (status) visits = visits.filter((v) => v.status === status);
    if (date) visits = visits.filter((v) => v.gymLocalDate === date);
    
    return NextResponse.json(visits);
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}