import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireMember } from '@/lib/auth/session';
import { workoutPlanRepository, memberRepository } from '@/lib/repository';

export async function GET() {
  try {
    const session = await requireMember();
    
    const workoutPlan = await workoutPlanRepository.findByMemberId(session.id);
    
    if (!workoutPlan) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(workoutPlan);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get member workout plan error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}