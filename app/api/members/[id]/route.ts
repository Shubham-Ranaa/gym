import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireAdmin } from '@/lib/auth/session';
import { memberRepository, membershipPlanRepository, visitRepository, attendanceEventRepository } from '@/lib/repository';
import { memberSchema } from '@/lib/validation';
import { formatTime, formatDate, formatDuration } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    
    const member = await memberRepository.findById(id);
    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }
    
    if (session.role === 'member' && session.id !== id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const plan = member.membershipPlanId ? await membershipPlanRepository.findById(member.membershipPlanId) : null;
    const visits = await visitRepository.findByMemberId(id);
    const events = await attendanceEventRepository.findByMemberId(id);
    
    const { passwordHash, ...memberWithoutPassword } = member;
    
    return NextResponse.json({
      ...memberWithoutPassword,
      plan,
      visits: visits.map(v => ({
        ...v,
        entryTime: formatTime(v.entryTimestamp),
        exitTime: v.exitTimestamp ? formatTime(v.exitTimestamp) : null,
        duration: v.durationSeconds ? formatDuration(v.durationSeconds) : null,
      })),
      recentEvents: events.slice(0, 20).map(e => ({
        ...e,
        time: formatTime(e.timestamp),
        date: formatDate(e.timestamp),
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get member error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    
    const { id } = await params;
    const body = await request.json();
    // Partial schema allows single-field updates such as approving a member
    const validated = memberSchema.partial().safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const member = await memberRepository.findById(id);
    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }
    
    if (validated.data.email && validated.data.email !== member.email) {
      const existing = await memberRepository.findByEmail(validated.data.email);
      if (existing) {
        return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
      }
    }
    
    const updated = await memberRepository.update(id, validated.data);
    if (!updated) {
      return NextResponse.json({ message: 'Failed to update' }, { status: 500 });
    }
    
    const { passwordHash, ...memberWithoutPassword } = updated;
    return NextResponse.json(memberWithoutPassword);
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update member error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    
    const { id } = await params;
    const deleted = await memberRepository.delete(id);
    
    if (!deleted) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Member deleted' });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Delete member error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}