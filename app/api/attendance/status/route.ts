import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getAttendanceStatus } from '@/lib/attendance/service';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const status = await getAttendanceStatus(session.id);
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('Attendance status error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}