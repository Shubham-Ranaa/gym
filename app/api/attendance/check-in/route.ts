import { NextRequest, NextResponse } from 'next/server';
import { requireMember } from '@/lib/auth/session';
import { processAttendance } from '@/lib/attendance/service';

/**
 * Single attendance endpoint used by the QR check-in flow.
 *
 * The server derives whether this scan is an ENTRY or an EXIT from the
 * member's current server-side attendance state. The client never sends a
 * member ID, attendance type, timestamp, visit ID or attendance day, and any
 * such values in the body are ignored.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireMember();
    
    // Consume the body so malformed input cannot break the handler, but never
    // trust anything it contains.
    await request.json().catch(() => ({}));
    
    const result = await processAttendance(session.id);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { message: 'Please log in to continue', errorCode: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    console.error('Check-in error:', error);
    return NextResponse.json(
      { message: 'Unable to process attendance. Please try again.', errorCode: 'STORAGE_ERROR' },
      { status: 500 }
    );
  }
}