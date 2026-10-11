import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { membershipPlanRepository, memberRepository } from '@/lib/repository';
import { membershipPlanSchema } from '@/lib/validation';

/**
 * Updating a plan changes its current pricing and benefits only.
 * Members keep the plan they are assigned to and the price they agreed to;
 * existing memberships are not rewritten.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    
    const { id } = await params;
    const body = await request.json();
    const validated = membershipPlanSchema.partial().safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const plan = await membershipPlanRepository.findById(id);
    if (!plan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }
    
    const updated = await membershipPlanRepository.update(id, validated.data);
    if (!updated) {
      return NextResponse.json({ message: 'Failed to update plan' }, { status: 500 });
    }
    
    const members = await memberRepository.findAll();
    const assigned = members.filter((m) => m.membershipPlanId === id).length;
    
    return NextResponse.json({ ...updated, memberCount: assigned });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
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
    
    const members = await memberRepository.findAll();
    const assigned = members.filter((m) => m.membershipPlanId === id).length;
    if (assigned > 0) {
      return NextResponse.json(
        { message: `Cannot delete a plan assigned to ${assigned} member(s). Reassign them first.` },
        { status: 409 }
      );
    }
    
    const deleted = await membershipPlanRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Plan deleted' });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}