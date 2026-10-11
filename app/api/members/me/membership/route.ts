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
    
    return NextResponse.json({
      ...member,
      plan,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get member membership error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}