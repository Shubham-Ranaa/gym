import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { memberRepository, attendanceEventRepository, visitRepository, enquiryRepository } from '@/lib/repository';
import { getGymLocalDate } from '@/lib/date';

export async function GET() {
  try {
    await requireAdmin();
    
    const today = getGymLocalDate();
    const [members, events, visits, enquiries] = await Promise.all([
      memberRepository.findAll(),
      attendanceEventRepository.findByGymLocalDate(today),
      visitRepository.findCurrentlyInside(),
      enquiryRepository.findByStatus('new'),
    ]);
    
    const stats = {
      totalMembers: members.length,
      activeMembers: members.filter(m => m.approvalStatus === 'approved' && m.membershipStatus === 'active').length,
      pendingApprovals: members.filter(m => m.approvalStatus === 'pending').length,
      currentlyInside: visits.length,
      entriesToday: events.filter(e => e.type === 'ENTRY').length,
      exitsToday: events.filter(e => e.type === 'EXIT').length,
      expiredMemberships: members.filter(m => m.membershipStatus === 'expired').length,
      pendingEnquiries: enquiries.length,
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}