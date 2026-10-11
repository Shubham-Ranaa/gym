import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { visitRepository, memberRepository } from '@/lib/repository';
import { formatTime, formatDuration } from '@/lib/utils';

export async function GET() {
  try {
    await requireAdmin();
    
    const visits = await visitRepository.findCurrentlyInside();
    const members = await memberRepository.findAll();
    const memberMap = new Map(members.map(m => [m.id, m]));
    
    const inside = visits.map(visit => {
      const member = memberMap.get(visit.memberId);
      const entryTime = new Date(visit.entryTimestamp);
      const now = new Date();
      const durationMs = now.getTime() - entryTime.getTime();
      
      return {
        id: visit.id,
        memberName: member?.name || 'Unknown',
        memberCode: member?.memberCode || 'N/A',
        entryTime: formatTime(entryTime),
        duration: formatDuration(Math.floor(durationMs / 1000)),
      };
    });
    
    return NextResponse.json(inside);
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Currently inside error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}