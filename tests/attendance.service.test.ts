import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processAttendance, processExit, getAttendanceStatus } from '@/lib/attendance/service';
import { memberRepository, visitRepository, attendanceEventRepository } from '@/lib/repository';

// Mock the repository functions
vi.mock('@/lib/repository', () => ({
  memberRepository: {
    findById: vi.fn(),
    findAll: vi.fn(),
  },
  visitRepository: {
    findOpenByMemberId: vi.fn(),
    findByMemberId: vi.fn(),
    findCurrentlyInside: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  attendanceEventRepository: {
    findByMemberAndDate: vi.fn(),
    findByGymLocalDate: vi.fn(),
    create: vi.fn(),
  },
  auditLogRepository: {
    create: vi.fn().mockResolvedValue({ id: 'aud_1' }),
  },
}));

vi.mock('@/lib/auth/session', () => ({
  getSession: vi.fn(),
  requireMember: vi.fn(),
  requireAdmin: vi.fn(),
}));

vi.mock('@/lib/date', () => ({
  getGymLocalDate: vi.fn(() => '2026-10-10'),
  getCurrentGymTime: vi.fn(() => new Date('2026-10-10T09:00:00Z')),
}));

describe('Attendance Service', () => {
  const mockMember = {
    id: 'mem_123',
    memberCode: 'GYM26ABC',
    name: 'Test Member',
    email: 'test@fitforge.com',
    phone: '+1 (555) 123-4567',
    passwordHash: '$2a$12$hashedpassword',
    role: 'member',
    approvalStatus: 'approved',
    membershipStatus: 'active',
    membershipPlanId: 'plan_1',
    membershipStartDate: '2026-10-01',
    membershipEndDate: '2027-10-01',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock member repository
    (memberRepository.findById as any).mockResolvedValue(mockMember);
    (memberRepository.findAll as any).mockResolvedValue([mockMember]);
    
    // Mock visit repository
    (visitRepository.findOpenByMemberId as any).mockResolvedValue(undefined);
    (visitRepository.findByMemberId as any).mockResolvedValue([]);
    (visitRepository.findCurrentlyInside as any).mockResolvedValue([]);
    (visitRepository.create as any).mockImplementation((visit: Record<string, unknown>) => Promise.resolve({ ...visit, id: 'vis_123' }));
    (visitRepository.update as any).mockImplementation((id: string, updates: Record<string, unknown>) => Promise.resolve({ id, ...updates }));
    
    // Mock attendance event repository
    (attendanceEventRepository.findByMemberAndDate as any).mockResolvedValue([]);
    (attendanceEventRepository.findByGymLocalDate as any).mockResolvedValue([]);
    (attendanceEventRepository.create as any).mockImplementation((event: Record<string, unknown>) => Promise.resolve({ ...event, id: 'evt_123' }));
  });

  describe('processAttendance', () => {
    it('should record ENTRY for first check-in of the day', async () => {
      const result = await processAttendance('mem_123');
      
      expect(result.success).toBe(true);
      expect(result.event).toBeDefined();
      expect(result.event?.type).toBe('ENTRY');
      expect(result.visit).toBeDefined();
      expect(result.visit?.status).toBe('OPEN');
      
      // Verify repository calls: one ENTRY event and one visit
      expect(attendanceEventRepository.create).toHaveBeenCalledTimes(1);
      expect(visitRepository.create).toHaveBeenCalledTimes(1);
      
      // The event must reference the visit that is actually stored,
      // otherwise the visit and its events cannot be joined.
      const eventArg = (attendanceEventRepository.create as any).mock.calls[0][0];
      const visitArg = (visitRepository.create as any).mock.calls[0][0];
      expect(eventArg.visitId).toBe(visitArg.id);
    });

    it('should record EXIT for second check-in of the day', async () => {
      // First, create an open visit
      (visitRepository.findOpenByMemberId as any).mockResolvedValue({
        id: 'vis_123',
        memberId: 'mem_123',
        entryEventId: 'evt_123',
        entryTimestamp: new Date('2026-10-10T08:00:00Z').toISOString(),
        gymLocalDate: '2026-10-10',
        status: 'OPEN',
      } as any);
      
      const result = await processAttendance('mem_123');
      
      expect(result.success).toBe(true);
      expect(result.event).toBeDefined();
      expect(result.event?.type).toBe('EXIT');
      expect(result.visit).toBeDefined();
      expect(result.visit?.status).toBe('COMPLETED');
      
      // Verify repository calls
      expect(attendanceEventRepository.create).toHaveBeenCalledTimes(1); // EXIT event
      expect(visitRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should reject third check-in of the day', async () => {
      // First, create an open visit and then complete it
      (visitRepository.findOpenByMemberId as any).mockResolvedValue({
        id: 'vis_123',
        memberId: 'mem_123',
        entryEventId: 'evt_123',
        entryTimestamp: new Date('2026-10-10T08:00:00Z').toISOString(),
        gymLocalDate: '2026-10-10',
        status: 'OPEN',
      } as any);
      
      // Process first check-in (ENTRY)
      await processAttendance('mem_123');
      
      // Mock completed visit for second check-in
      (attendanceEventRepository.findByMemberAndDate as any).mockResolvedValue([
        { id: 'evt_123', type: 'ENTRY', gymLocalDate: '2026-10-10' },
        { id: 'evt_124', type: 'EXIT', gymLocalDate: '2026-10-10' },
      ]);
      
      const result = await processAttendance('mem_123');
      
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('ALREADY_COMPLETED_TODAY');
      expect(result.message).toContain('already completed your gym attendance for today');
    });

    it('should reject check-in if member is not approved', async () => {
      const unapprovedMember = { ...mockMember, approvalStatus: 'pending' };
      (memberRepository.findById as any).mockResolvedValue(unapprovedMember);
      
      const result = await processAttendance('mem_123');
      
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('MEMBER_NOT_APPROVED');
      expect(result.message).toContain('pending approval');
    });

    it('should reject check-in if member has expired membership', async () => {
      const expiredMember = { ...mockMember, membershipStatus: 'expired' };
      (memberRepository.findById as any).mockResolvedValue(expiredMember);
      
      const result = await processAttendance('mem_123');
      
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('MEMBERSHIP_EXPIRED');
      expect(result.message).toContain('has expired');
    });
  });

  describe('getAttendanceStatus', () => {
    it('should return correct status when member is inside', async () => {
      (visitRepository.findOpenByMemberId as any).mockResolvedValue({
        id: 'vis_123',
        memberId: 'mem_123',
        entryEventId: 'evt_123',
        entryTimestamp: new Date('2026-10-10T09:00:00Z').toISOString(),
        gymLocalDate: '2026-10-10',
        status: 'OPEN',
      } as any);
      
      (attendanceEventRepository.findByMemberAndDate as any).mockResolvedValue([
        { id: 'evt_123', type: 'ENTRY', timestamp: new Date('2026-10-10T09:00:00Z').toISOString(), gymLocalDate: '2026-10-10' },
      ]);
      
      const status = await getAttendanceStatus('mem_123');
      
      expect(status.isInside).toBe(true);
      expect(status.currentVisit).toBeDefined();
      expect(status.completedToday).toBe(false);
      expect(status.lastEntry).toBeDefined();
      expect(status.lastExit).toBeNull();
    });

    it('should return correct status when member has completed attendance', async () => {
      (visitRepository.findOpenByMemberId as any).mockResolvedValue(undefined);
      
      (attendanceEventRepository.findByMemberAndDate as any).mockResolvedValue([
        { id: 'evt_123', type: 'ENTRY', timestamp: new Date('2026-10-10T09:00:00Z').toISOString(), gymLocalDate: '2026-10-10' },
        { id: 'evt_124', type: 'EXIT', timestamp: new Date('2026-10-10T11:00:00Z').toISOString(), gymLocalDate: '2026-10-10' },
      ]);
      
      const status = await getAttendanceStatus('mem_123');
      
      expect(status.isInside).toBe(false);
      expect(status.currentVisit).toBeNull();
      expect(status.completedToday).toBe(true);
      expect(status.lastEntry).toBeDefined();
      expect(status.lastExit).toBeDefined();
    });
  });
});