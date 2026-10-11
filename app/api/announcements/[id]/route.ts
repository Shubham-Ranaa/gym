import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { announcementRepository } from '@/lib/repository';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    
    const { id } = await params;
    const body = await request.json();
    
    const updates: Record<string, unknown> = { ...body };
    if (body.status === 'published') {
      updates.publishedAt = new Date().toISOString();
    }
    
    const updated = await announcementRepository.update(id, updates);
    
    if (!updated) {
      return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated);
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
    const deleted = await announcementRepository.delete(id);
    
    if (!deleted) {
      return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Announcement deleted' });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}