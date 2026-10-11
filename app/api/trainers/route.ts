import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireAdmin } from '@/lib/auth/session';
import { trainerRepository } from '@/lib/repository';
import { trainerSchema } from '@/lib/validation';
import { generateId } from '@/lib/utils';
import type { Trainer } from '@/types';

/**
 * Public and member callers only receive active trainers.
 * Admins may request the full list, including inactive profiles.
 */
export async function GET() {
  try {
    const session = await getSession();
    const isAdmin = session?.role === 'admin';
    
    const trainers = isAdmin
      ? await trainerRepository.findAll()
      : await trainerRepository.findActive();
    
    return NextResponse.json(trainers);
  } catch (error) {
    console.error('Trainers list error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const validated = trainerSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const now = new Date().toISOString();
    const trainer: Trainer = {
      id: generateId('train_'),
      name: validated.data.name,
      email: validated.data.email,
      phone: validated.data.phone,
      specialization: validated.data.specialization,
      experienceYears: validated.data.experienceYears,
      certifications: validated.data.certifications ?? [],
      bio: validated.data.bio ?? '',
      photoUrl: validated.data.photoUrl ?? null,
      isActive: validated.data.isActive,
      createdAt: now,
      updatedAt: now,
    };
    
    await trainerRepository.create(trainer);
    return NextResponse.json(trainer, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create trainer error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}