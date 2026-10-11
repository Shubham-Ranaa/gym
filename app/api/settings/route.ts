import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { settingsRepository } from '@/lib/repository';
import { settingsSchema } from '@/lib/validation';

export async function GET() {
  try {
    await requireAdmin();
    
    const settings = await settingsRepository.find();
    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Settings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const validated = settingsSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid settings', errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const updated = await settingsRepository.update({
      ...validated.data,
      membershipSettings: {
        ...validated.data.membershipSettings,
        defaultPlanId: validated.data.membershipSettings.defaultPlanId ?? null,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update settings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}