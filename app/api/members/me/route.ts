import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireMember } from '@/lib/auth/session';
import { memberRepository, membershipPlanRepository } from '@/lib/repository';

export async function GET() {
  try {
    const session = await requireMember();
    
    const member = await memberRepository.findById(session.id);
    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }
    
    const plan = member.membershipPlanId ? await membershipPlanRepository.findById(member.membershipPlanId) : null;
    const visits = await memberRepository.findAll().then(members => members.find(m => m.id === session.id)).then(m => m ? Promise.resolve([]) : []);
    
    const { passwordHash, ...memberWithoutPassword } = member;
    
    const allVisits = await (await import('@/lib/repository')).visitRepository.findByMemberId(session.id);
    const allEvents = await (await import('@/lib/repository')).attendanceEventRepository.findByMemberId(session.id);
    
    return NextResponse.json({
      ...memberWithoutPassword,
      plan,
      visits: allVisits,
      recentEvents: allEvents.slice(0, 20),
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get member me error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}