import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireMember } from '@/lib/auth/session';
import { memberRepository, visitRepository, attendanceEventRepository, workoutPlanRepository } from '@/lib/repository';

export async function GET() {
  try {
    const session = await requireMember();
    
    const visits = await visitRepository.findByMemberId(session.id);
    const events = await attendanceEventRepository.findByMemberId(session.id);
    
    // Combine visits and events for display
    const attendanceData = visits.map((visit) => ({
      ...visit,
      entryTime: visit.entryTimestamp,
      exitTime: visit.exitTimestamp,
    }));
    
    return NextResponse.json(attendanceData);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get member attendance error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}