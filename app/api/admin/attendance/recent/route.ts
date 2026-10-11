import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { attendanceEventRepository, visitRepository, memberRepository } from '@/lib/repository';
import { formatTime } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const events = await attendanceEventRepository.findAll();
    const recentEvents = events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    const members = await memberRepository.findAll();
    const memberMap = new Map(members.map(m => [m.id, m]));
    
    const activity = recentEvents.map(event => {
      const member = memberMap.get(event.memberId);
      return {
        id: event.id,
        memberName: member?.name || 'Unknown',
        memberCode: member?.memberCode || 'N/A',
        type: event.type,
        timestamp: event.timestamp,
      };
    });
    
    return NextResponse.json(activity);
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Recent activity error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}