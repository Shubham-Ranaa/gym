import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth/password';
import { memberRepository } from '@/lib/repository';
import { generateId, generateMemberCode } from '@/lib/utils';
import { settingsRepository } from '@/lib/repository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { name, email, phone, password } = validated.data;
    
    const existing = await memberRepository.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    
    const settings = await settingsRepository.find();
    const requireApproval = settings?.membershipSettings?.requireApproval ?? true;
    
    const passwordHash = await hashPassword(password);
    
    const newMember = {
      id: generateId('mem_'),
      memberCode: generateMemberCode(),
      name,
      email,
      phone,
      passwordHash,
      role: 'member' as const,
      approvalStatus: requireApproval ? 'pending' as const : 'approved' as const,
      membershipStatus: 'active' as const,
      membershipPlanId: settings?.membershipSettings?.defaultPlanId || null,
      membershipStartDate: null,
      membershipEndDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await memberRepository.create(newMember);
    
    return NextResponse.json({
      message: requireApproval 
        ? 'Account created successfully! Your membership is pending admin approval.' 
        : 'Account created successfully!',
      member: {
        id: newMember.id,
        memberCode: newMember.memberCode,
        name: newMember.name,
        email: newMember.email,
        approvalStatus: newMember.approvalStatus,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}