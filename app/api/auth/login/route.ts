import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSession, setSessionCookie } from '@/lib/auth/session';
import { memberRepository } from '@/lib/repository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { email, password } = validated.data;
    
    const member = await memberRepository.findByEmail(email);
    if (!member) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const isValid = await verifyPassword(password, member.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const sessionUser = {
      id: member.id,
      memberCode: member.memberCode,
      name: member.name,
      email: member.email,
      role: member.role,
      approvalStatus: member.approvalStatus,
      membershipStatus: member.membershipStatus,
      membershipPlanId: member.membershipPlanId,
    };
    
    const token = await createSession(sessionUser);
    await setSessionCookie(token);
    
    return NextResponse.json({
      message: 'Login successful',
      user: sessionUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}