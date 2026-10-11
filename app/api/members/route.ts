import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { memberRepository, membershipPlanRepository, settingsRepository } from '@/lib/repository';
import { memberSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth/password';
import { generateId, generateMemberCode } from '@/lib/utils';
import type { Member } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    let members = await memberRepository.findAll();
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      members = members.filter(m => 
        m.name.toLowerCase().includes(lowerSearch) ||
        m.email.toLowerCase().includes(lowerSearch) ||
        m.memberCode.toLowerCase().includes(lowerSearch) ||
        m.phone.includes(lowerSearch)
      );
    }
    
    if (status) {
      if (status === 'active') {
        members = members.filter(m => m.approvalStatus === 'approved' && m.membershipStatus === 'active');
      } else if (status === 'pending') {
        members = members.filter(m => m.approvalStatus === 'pending');
      } else if (status === 'expired') {
        members = members.filter(m => m.membershipStatus === 'expired');
      } else if (status === 'inactive') {
        members = members.filter(m => m.membershipStatus === 'inactive');
      }
    }
    
    members.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];
      const aCmp = aVal === null || aVal === undefined ? '' : String(aVal);
      const bCmp = bVal === null || bVal === undefined ? '' : String(bVal);
      if (aCmp < bCmp) return sortOrder === 'asc' ? -1 : 1;
      if (aCmp > bCmp) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    const total = members.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = members.slice(start, start + limit);
    
    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Members list error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const validated = memberSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const settings = await settingsRepository.find();
    
    const existing = await memberRepository.findByEmail(validated.data.email);
    if (existing) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 409 }
      );
    }
    
    const bodyRecord = body as { password?: string; name?: string; phone?: string };
    const rawPassword = typeof bodyRecord.password === 'string' ? bodyRecord.password : '';
    const passwordHash = await hashPassword(rawPassword || 'member123');
    
    const newMember: Member = {
      id: generateId('mem_'),
      memberCode: generateMemberCode(),
      name: validated.data.name,
      email: validated.data.email,
      phone: validated.data.phone,
      passwordHash,
      role: 'member' as const,
      approvalStatus: settings?.membershipSettings?.requireApproval
        ? 'approved'
        : validated.data.approvalStatus,
      membershipStatus: validated.data.membershipStatus,
      membershipPlanId: validated.data.membershipPlanId ?? null,
      membershipStartDate: validated.data.membershipStartDate ?? null,
      membershipEndDate: validated.data.membershipEndDate ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await memberRepository.create(newMember);
    
    const { passwordHash: _, ...memberWithoutPassword } = newMember;
    
    return NextResponse.json(memberWithoutPassword, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create member error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}