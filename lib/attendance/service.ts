import { AttendanceResult, AttendanceErrorCode, Visit, AttendanceEvent, Member } from '@/types';
import { getGymLocalDate, getCurrentGymTime } from '@/lib/date';
import {
  visitRepository,
  attendanceEventRepository,
  memberRepository,
  auditLogRepository,
} from '@/lib/repository';
import { generateId } from '@/lib/utils';

interface AttendanceContext {
  member: Member;
  now: Date;
  gymLocalDate: string;
  openVisit: Visit | undefined;
  todayEvents: AttendanceEvent[];
  completedToday: boolean;
}

async function buildAttendanceContext(memberId: string): Promise<AttendanceContext> {
  const now = getCurrentGymTime();
  const gymLocalDate = getGymLocalDate();
  
  const member = await memberRepository.findById(memberId);
  if (!member) {
    throw new Error('Member not found');
  }
  
  const openVisit = await visitRepository.findOpenByMemberId(memberId);
  const todayEvents = await attendanceEventRepository.findByMemberAndDate(memberId, gymLocalDate);
  const completedToday = todayEvents.some((e) => e.type === 'EXIT');
  
  return {
    member,
    now,
    gymLocalDate,
    openVisit,
    todayEvents,
    completedToday,
  };
}

function validateMembership(member: Member): AttendanceErrorCode | null {
  if (member.approvalStatus !== 'approved') {
    return 'MEMBER_NOT_APPROVED';
  }
  if (member.membershipStatus === 'expired') {
    return 'MEMBERSHIP_EXPIRED';
  }
  if (member.membershipStatus !== 'active') {
    return 'MEMBER_INACTIVE';
  }
  if (!member.membershipPlanId) {
    return 'MEMBERSHIP_INVALID';
  }
  if (member.membershipEndDate) {
    const endDate = new Date(member.membershipEndDate);
    const now = getCurrentGymTime();
    if (endDate < now) {
      return 'MEMBERSHIP_EXPIRED';
    }
  }
  return null;
}

async function recordAttendanceEvent(
  memberId: string,
  visitId: string,
  type: 'ENTRY' | 'EXIT',
  gymLocalDate: string,
  timestamp: Date
): Promise<AttendanceEvent> {
  const event: AttendanceEvent = {
    id: generateId('evt_'),
    visitId,
    memberId,
    type,
    timestamp: timestamp.toISOString(),
    gymLocalDate,
    createdAt: timestamp.toISOString(),
  };
  
  await attendanceEventRepository.create(event);
  return event;
}

async function createVisit(
  visitId: string,
  memberId: string,
  entryEventId: string,
  entryTimestamp: Date,
  gymLocalDate: string
): Promise<Visit> {
  const visit: Visit = {
    id: visitId,
    memberId,
    entryEventId,
    exitEventId: null,
    entryTimestamp: entryTimestamp.toISOString(),
    exitTimestamp: null,
    durationSeconds: null,
    gymLocalDate,
    status: 'OPEN',
  };
  
  await visitRepository.create(visit);
  return visit;
}

async function completeVisit(
  visitId: string,
  exitEventId: string,
  exitTimestamp: Date,
  entryTimestamp: Date
): Promise<Visit | null> {
  const durationSeconds = Math.floor((exitTimestamp.getTime() - entryTimestamp.getTime()) / 1000);
  
  return visitRepository.update(visitId, {
    exitEventId,
    exitTimestamp: exitTimestamp.toISOString(),
    durationSeconds,
    status: 'COMPLETED',
  });
}

async function logAudit(
  entityType: string,
  entityId: string,
  action: string,
  performedBy: string,
  performedByRole: 'admin' | 'member',
  previousData: Record<string, unknown> | null,
  newData: Record<string, unknown> | null,
  reason: string | null
): Promise<void> {
  await auditLogRepository.create({
    id: generateId('aud_'),
    entityType,
    entityId,
    action,
    performedBy,
    performedByRole,
    previousData,
    newData,
    reason,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Authoritative attendance state machine.
 *
 * The client never chooses the action. This function inspects server-side
 * records and derives the next valid action for the current gym-local day:
 *
 *   no open visit, nothing completed today -> ENTRY
 *   open visit created this gym-local day    -> EXIT
 *   already completed today                  -> rejected
 *   open visit from an earlier day           -> rejected
 */
export async function processAttendance(memberId: string): Promise<AttendanceResult> {
  const context = await buildAttendanceContext(memberId);
  const { member, now, gymLocalDate, openVisit, completedToday } = context;
  
  const membershipError = validateMembership(member);
  if (membershipError) {
    return {
      success: false,
      message: getErrorMessage(membershipError),
      errorCode: membershipError,
    };
  }
  
  if (completedToday) {
    await logAudit(
      'visit',
      memberId,
      'ATTENDANCE_REJECTED',
      memberId,
      'member',
      null,
      null,
      'Member attempted an attendance action after completing attendance for the day'
    );
    
    return {
      success: false,
      message: 'You have already completed your gym attendance for today. You can check in again tomorrow.',
      errorCode: 'ALREADY_COMPLETED_TODAY',
    };
  }
  
  // Rule B: the member is inside and the visit belongs to the current
  // gym-local day, so this scan is an EXIT.
  if (openVisit && openVisit.gymLocalDate === gymLocalDate) {
    const exitEvent = await recordAttendanceEvent(
      member.id,
      openVisit.id,
      'EXIT',
      gymLocalDate,
      now
    );
    const completedVisit = await completeVisit(
      openVisit.id,
      exitEvent.id,
      now,
      new Date(openVisit.entryTimestamp)
    );
    
    await logAudit(
      'visit',
      openVisit.id,
      'EXIT_RECORDED',
      memberId,
      'member',
      { status: 'OPEN' },
      {
        status: 'COMPLETED',
        exitTime: now.toISOString(),
        durationSeconds: completedVisit?.durationSeconds ?? null,
      },
      null
    );
    
    const durationText =
      completedVisit?.durationSeconds != null
        ? formatDuration(completedVisit.durationSeconds)
        : 'unknown duration';
    
    return {
      success: true,
      event: exitEvent,
      visit: completedVisit || undefined,
      message: `Goodbye, ${member.name}! You have been checked out at ${formatTime(now)}. Your visit lasted ${durationText}.`,
    };
  }
  
  // Rule E: a visit from an earlier attendance day is still open and only an
  // admin may resolve it.
  if (openVisit) {
    await logAudit(
      'visit',
      openVisit.id,
      'ATTENDANCE_REJECTED',
      memberId,
      'member',
      null,
      null,
      'Member attempted attendance while a previous day visit remains unresolved'
    );
    
    return {
      success: false,
      message:
        'You have an unresolved visit from a previous day. Please contact gym staff to resolve this before checking in again.',
      errorCode: 'PREVIOUS_VISIT_UNRESOLVED',
    };
  }
  
  // Rule A: first confirmed scan of the day records an ENTRY.
  const visitId = generateId('vis_');
  const entryEvent = await recordAttendanceEvent(member.id, visitId, 'ENTRY', gymLocalDate, now);
  const visit = await createVisit(visitId, member.id, entryEvent.id, now, gymLocalDate);
  
  await logAudit(
    'visit',
    visit.id,
    'ENTRY_RECORDED',
    memberId,
    'member',
    null,
    { visitId: visit.id, entryTime: now.toISOString() },
    null
  );
  
  return {
    success: true,
    event: entryEvent,
    visit,
    message: `Welcome, ${member.name}! You have been checked in at ${formatTime(now)}.`,
  };
}

export async function processExit(memberId: string): Promise<AttendanceResult> {
  const context = await buildAttendanceContext(memberId);
  const { member, now, gymLocalDate, openVisit, todayEvents, completedToday } = context;
  
  if (!openVisit) {
    if (completedToday) {
      return {
        success: false,
        message: 'You have already completed your gym attendance for today.',
        errorCode: 'ALREADY_COMPLETED_TODAY',
      };
    }
    
    return {
      success: false,
      message: 'No active check-in found. Please check in first.',
      errorCode: 'INVALID_REQUEST',
    };
  }
  
  if (openVisit.gymLocalDate !== gymLocalDate) {
    return {
      success: false,
      message: 'You have an unresolved visit from a previous day. Please contact gym staff.',
      errorCode: 'PREVIOUS_VISIT_UNRESOLVED',
    };
  }
  
  const exitEvent = await recordAttendanceEvent(member.id, openVisit.id, 'EXIT', gymLocalDate, now);
  const completedVisit = await completeVisit(openVisit.id, exitEvent.id, now, new Date(openVisit.entryTimestamp));
  
  await logAudit('visit', openVisit.id, 'EXIT_RECORDED', memberId, 'member', 
    { status: 'OPEN' }, { status: 'COMPLETED', exitTime: now.toISOString(), duration: completedVisit?.durationSeconds }, null);
  
  return {
    success: true,
    event: exitEvent,
    visit: completedVisit || undefined,
    message: `Goodbye, ${member.name}! You have been checked out at ${formatTime(now)}. Your visit lasted ${
      completedVisit?.durationSeconds != null
        ? formatDuration(completedVisit.durationSeconds)
        : 'unknown duration'
    }.`,
  };
}

export async function getAttendanceStatus(memberId: string): Promise<{
  isInside: boolean;
  currentVisit: Visit | null;
  todayEvents: AttendanceEvent[];
  completedToday: boolean;
  lastEntry: string | null;
  lastExit: string | null;
}> {
  const context = await buildAttendanceContext(memberId);
  const { openVisit, todayEvents, completedToday } = context;
  
  const entries = todayEvents.filter((e) => e.type === 'ENTRY');
  const exits = todayEvents.filter((e) => e.type === 'EXIT');
  
  return {
    isInside: !!openVisit && openVisit.gymLocalDate === context.gymLocalDate,
    currentVisit: openVisit && openVisit.gymLocalDate === context.gymLocalDate ? openVisit : null,
    todayEvents,
    completedToday,
    lastEntry: entries.length > 0 ? entries[entries.length - 1].timestamp : null,
    lastExit: exits.length > 0 ? exits[exits.length - 1].timestamp : null,
  };
}

export async function manualAttendanceCorrection(
  adminId: string,
  input: {
    memberId: string;
    type: 'ENTRY' | 'EXIT';
    timestamp: Date;
    gymLocalDate: string;
    reason: string;
    visitId?: string;
  }
): Promise<AttendanceResult> {
  const { memberId, type, timestamp, gymLocalDate, reason, visitId } = input;
  
  const member = await memberRepository.findById(memberId);
  if (!member) {
    return { success: false, message: 'Member not found', errorCode: 'INVALID_REQUEST' };
  }
  
  let targetVisit: Visit | undefined;
  
  if (visitId) {
    targetVisit = await visitRepository.findById(visitId);
  } else {
    const visits = await visitRepository.findByMemberId(memberId);
    targetVisit = visits.find((v) => v.gymLocalDate === gymLocalDate);
  }
  
  if (type === 'ENTRY') {
    if (targetVisit) {
      return { success: false, message: 'Visit already exists for this date', errorCode: 'INVALID_REQUEST' };
    }
    
    const newVisitId = generateId('vis_');
    const entryEvent = await recordAttendanceEvent(memberId, newVisitId, 'ENTRY', gymLocalDate, timestamp);
    const visit = await createVisit(newVisitId, memberId, entryEvent.id, timestamp, gymLocalDate);
    
    await logAudit('visit', visit.id, 'MANUAL_ENTRY', adminId, 'admin', null, { visitId: visit.id }, reason);
    
    return { success: true, event: entryEvent, visit, message: 'Manual entry recorded' };
  } else {
    if (!targetVisit || targetVisit.status !== 'OPEN') {
      return { success: false, message: 'No open visit found to close', errorCode: 'INVALID_REQUEST' };
    }
    
    const exitEvent = await recordAttendanceEvent(memberId, targetVisit.id, 'EXIT', gymLocalDate, timestamp);
    const completedVisit = await completeVisit(targetVisit.id, exitEvent.id, timestamp, new Date(targetVisit.entryTimestamp));
    
    await logAudit('visit', targetVisit.id, 'MANUAL_EXIT', adminId, 'admin', 
      { status: 'OPEN' }, { status: 'COMPLETED' }, reason);
    
    return { success: true, event: exitEvent, visit: completedVisit || undefined, message: 'Manual exit recorded' };
  }
}

export async function resolveStaleVisit(
  adminId: string,
  memberId: string,
  exitTimestamp: Date,
  reason: string
): Promise<AttendanceResult> {
  const openVisit = await visitRepository.findOpenByMemberId(memberId);
  
  if (!openVisit) {
    return { success: false, message: 'No open visit found', errorCode: 'INVALID_REQUEST' };
  }
  
  const gymLocalDate = openVisit.gymLocalDate;
  const exitEvent = await recordAttendanceEvent(memberId, openVisit.id, 'EXIT', gymLocalDate, exitTimestamp);
  const completedVisit = await completeVisit(openVisit.id, exitEvent.id, exitTimestamp, new Date(openVisit.entryTimestamp));
  
  await logAudit('visit', openVisit.id, 'STALE_VISIT_RESOLVED', adminId, 'admin',
    { status: 'OPEN' }, { status: 'COMPLETED', exitTime: exitTimestamp.toISOString() }, reason);
  
  return { success: true, event: exitEvent, visit: completedVisit || undefined, message: 'Stale visit resolved' };
}

function getErrorMessage(code: AttendanceErrorCode): string {
  const messages: Record<AttendanceErrorCode, string> = {
    ALREADY_INSIDE: 'You are already checked in. Please check out first.',
    ALREADY_COMPLETED_TODAY: 'You have already completed your gym attendance for today. You can check in again tomorrow.',
    PREVIOUS_VISIT_UNRESOLVED: 'You have an unresolved visit from a previous day. Please contact gym staff.',
    MEMBER_NOT_APPROVED: 'Your membership is pending approval. Please contact the front desk.',
    MEMBER_INACTIVE: 'Your membership is not active. Please contact the front desk.',
    MEMBERSHIP_EXPIRED: 'Your membership has expired. Please renew to continue.',
    MEMBERSHIP_INVALID: 'No valid membership plan assigned. Please contact the front desk.',
    UNAUTHORIZED: 'Please log in to continue.',
    INVALID_REQUEST: 'Invalid request. Please try again.',
    STORAGE_ERROR: 'Unable to process request. Please try again.',
    CONCURRENT_REQUEST: 'Another request is being processed. Please wait.',
  };
  return messages[code] || 'An error occurred';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}