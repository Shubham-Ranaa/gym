import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import {
  attendanceEventRepository,
  visitRepository,
  memberRepository,
  enquiryRepository,
} from '@/lib/repository';
import { getLastNGymDays } from '@/lib/date';
import { formatDate, formatTime, formatDuration } from '@/lib/utils';

function toCsv(rows: (string | number)[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? '');
          return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(',')
    )
    .join('\n');
}

function csvResponse(csv: string, filename: string) {
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const reportType = request.nextUrl.searchParams.get('type') || 'attendance';
    
    const members = await memberRepository.findAll();
    const memberMap = new Map(members.map((m) => [m.id, m]));
    const events = await attendanceEventRepository.findAll();
    const visits = await visitRepository.findAll();
    const enquiries = await enquiryRepository.findAll();
    
    if (reportType === 'members') {
      const rows: (string | number)[][] = [
        ['Member Code', 'Name', 'Email', 'Phone', 'Role', 'Approval', 'Membership', 'Joined'],
        ...members.map((m) => [
          m.memberCode,
          m.name,
          m.email,
          m.phone,
          m.role,
          m.approvalStatus,
          m.membershipStatus,
          formatDate(m.createdAt),
        ]),
      ];
      return csvResponse(toCsv(rows), 'members.csv');
    }
    
    if (reportType === 'visits') {
      const rows: (string | number)[][] = [
        ['Visit ID', 'Member', 'Member Code', 'Gym Date', 'Entry', 'Exit', 'Duration', 'Status'],
        ...visits
          .sort((a, b) => b.entryTimestamp.localeCompare(a.entryTimestamp))
          .map((v) => {
            const member = memberMap.get(v.memberId);
            return [
              v.id,
              member?.name || 'Unknown',
              member?.memberCode || 'N/A',
              v.gymLocalDate,
              formatTime(v.entryTimestamp),
              v.exitTimestamp ? formatTime(v.exitTimestamp) : '',
              v.durationSeconds != null ? formatDuration(v.durationSeconds) : '',
              v.status,
            ];
          }),
      ];
      return csvResponse(toCsv(rows), 'visits.csv');
    }
    
    if (reportType === 'summary') {
      const last7 = getLastNGymDays(7);
      const rows: (string | number)[][] = [['Date', 'Entries', 'Exits', 'Net Inside']];
      for (const day of last7) {
        const dayEvents = events.filter((e) => e.gymLocalDate === day);
        const entries = dayEvents.filter((e) => e.type === 'ENTRY').length;
        const exits = dayEvents.filter((e) => e.type === 'EXIT').length;
        rows.push([day, entries, exits, Math.max(entries - exits, 0)]);
      }
      return csvResponse(toCsv(rows), 'attendance-summary.csv');
    }
    
    if (reportType === 'enquiries') {
      const rows: (string | number)[][] = [
        ['Name', 'Email', 'Phone', 'Subject', 'Status', 'Created'],
        ...enquiries.map((e) => [
          e.name,
          e.email,
          e.phone,
          e.subject,
          e.status,
          formatDate(e.createdAt),
        ]),
      ];
      return csvResponse(toCsv(rows), 'enquiries.csv');
    }
    
    // Default: full attendance event log
    const rows: (string | number)[][] = [
      ['Event ID', 'Member', 'Member Code', 'Type', 'Timestamp', 'Gym Date'],
      ...events
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .map((e) => {
          const member = memberMap.get(e.memberId);
          return [
            e.id,
            member?.name || 'Unknown',
            member?.memberCode || 'N/A',
            e.type,
            e.timestamp,
            e.gymLocalDate,
          ];
        }),
    ];
    return csvResponse(toCsv(rows), 'attendance-events.csv');
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Report error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}