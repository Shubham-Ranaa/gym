import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireRole } from '@/lib/auth/session';
import { membershipPlanRepository, memberRepository } from '@/lib/repository';
import { membershipPlanSchema } from '@/lib/validation';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const session = await getSession();
    const isAdmin = session?.role === 'admin';
    
    const plans = await membershipPlanRepository.findAll();
    
    if (!isAdmin) {
      return NextResponse.json(plans.filter((p) => p.isActive));
    }
    
    const members = await memberRepository.findAll();
    const withCounts = plans.map((p) => ({
      ...p,
      memberCount: members.filter((m) => m.membershipPlanId === p.id).length,
    }));
    
    return NextResponse.json(withCounts);
  } catch (error) {
    console.error('Plans list error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin']);
    
    const body = await request.json();
    const validated = membershipPlanSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const newPlan = {
      id: generateId('plan_'),
      ...validated.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await membershipPlanRepository.create(newPlan);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create plan error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}