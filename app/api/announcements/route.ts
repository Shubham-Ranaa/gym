import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { announcementRepository } from '@/lib/repository';
import { announcementSchema } from '@/lib/validation';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    await requireAdmin();
    const announcements = await announcementRepository.findAll();
    return NextResponse.json(announcements);
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const validated = announcementSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const now = new Date().toISOString();
    const status = validated.data.status;
    
    const announcement = {
      id: generateId('ann_'),
      title: validated.data.title,
      message: validated.data.message,
      status,
      publishedAt: status === 'published' ? now : null,
      expiresAt: validated.data.expiresAt ?? null,
      createdAt: now,
      updatedAt: now,
    };
    
    await announcementRepository.create(announcement);
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}