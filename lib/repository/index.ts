import {
  Member,
  MembershipPlan,
  AttendanceEvent,
  Visit,
  Trainer,
  Enquiry,
  Announcement,
  WorkoutPlan,
  GymSettings,
  AuditLog,
} from '@/types';
import {
  readJsonFile,
  writeJsonFile,
  appendToJsonFile,
  findInJsonFile,
  findIndexInJsonFile,
  updateInJsonFile,
  deleteFromJsonFile,
  getAllFromJsonFile,
  STORAGE_FILES,
} from '@/lib/storage';

export const memberRepository = {
  async findAll(): Promise<Member[]> {
    return getAllFromJsonFile<Member>(STORAGE_FILES.members);
  },

  async findById(id: string): Promise<Member | undefined> {
    return findInJsonFile<Member>(STORAGE_FILES.members, (m) => m.id === id);
  },

  async findByEmail(email: string): Promise<Member | undefined> {
    return findInJsonFile<Member>(STORAGE_FILES.members, (m) => m.email.toLowerCase() === email.toLowerCase());
  },

  async findByMemberCode(code: string): Promise<Member | undefined> {
    return findInJsonFile<Member>(STORAGE_FILES.members, (m) => m.memberCode === code);
  },

  async findByRole(role: Member['role']): Promise<Member[]> {
    const members = await this.findAll();
    return members.filter((m) => m.role === role);
  },

  async findActiveMembers(): Promise<Member[]> {
    const members = await this.findAll();
    return members.filter((m) => m.approvalStatus === 'approved' && m.membershipStatus === 'active');
  },

  async create(member: Member): Promise<Member> {
    appendToJsonFile(STORAGE_FILES.members, member);
    return member;
  },

  async update(id: string, updates: Partial<Member>): Promise<Member | null> {
    return updateInJsonFile(STORAGE_FILES.members, (m) => m.id === id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<boolean> {
    return deleteFromJsonFile<Member>(STORAGE_FILES.members, (m) => m.id === id);
  },

  async count(): Promise<number> {
    const members = await this.findAll();
    return members.length;
  },

  async countByStatus(status: Member['membershipStatus']): Promise<number> {
    const members = await this.findAll();
    return members.filter((m) => m.membershipStatus === status).length;
  },

  async countByApproval(status: Member['approvalStatus']): Promise<number> {
    const members = await this.findAll();
    return members.filter((m) => m.approvalStatus === status).length;
  },
};

export const membershipPlanRepository = {
  async findAll(): Promise<MembershipPlan[]> {
    return getAllFromJsonFile<MembershipPlan>(STORAGE_FILES.membershipPlans);
  },

  async findActive(): Promise<MembershipPlan[]> {
    const plans = await this.findAll();
    return plans.filter((p) => p.isActive);
  },

  async findById(id: string): Promise<MembershipPlan | undefined> {
    return findInJsonFile<MembershipPlan>(STORAGE_FILES.membershipPlans, (p) => p.id === id);
  },

  async create(plan: MembershipPlan): Promise<MembershipPlan> {
    appendToJsonFile(STORAGE_FILES.membershipPlans, plan);
    return plan;
  },

  async update(id: string, updates: Partial<MembershipPlan>): Promise<MembershipPlan | null> {
    return updateInJsonFile(STORAGE_FILES.membershipPlans, (p) => p.id === id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<boolean> {
    return deleteFromJsonFile<MembershipPlan>(STORAGE_FILES.membershipPlans, (p) => p.id === id);
  },

  async getMemberCount(planId: string): Promise<number> {
    const members = await memberRepository.findAll();
    return members.filter((m) => m.membershipPlanId === planId).length;
  },
};

export const attendanceEventRepository = {
  async findAll(): Promise<AttendanceEvent[]> {
    return getAllFromJsonFile<AttendanceEvent>(STORAGE_FILES.attendanceEvents);
  },

  async findByVisitId(visitId: string): Promise<AttendanceEvent[]> {
    const events = await this.findAll();
    return events.filter((e) => e.visitId === visitId).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  },

  async findByMemberId(memberId: string): Promise<AttendanceEvent[]> {
    const events = await this.findAll();
    return events.filter((e) => e.memberId === memberId).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },

  async findByGymLocalDate(date: string): Promise<AttendanceEvent[]> {
    const events = await this.findAll();
    return events.filter((e) => e.gymLocalDate === date);
  },

  async findByMemberAndDate(memberId: string, gymLocalDate: string): Promise<AttendanceEvent[]> {
    const events = await this.findAll();
    return events.filter((e) => e.memberId === memberId && e.gymLocalDate === gymLocalDate)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  },

  async create(event: AttendanceEvent): Promise<AttendanceEvent> {
    appendToJsonFile(STORAGE_FILES.attendanceEvents, event);
    return event;
  },

  async countByDate(date: string): Promise<{ entries: number; exits: number }> {
    const events = await this.findByGymLocalDate(date);
    return {
      entries: events.filter((e) => e.type === 'ENTRY').length,
      exits: events.filter((e) => e.type === 'EXIT').length,
    };
  },
};

export const visitRepository = {
  async findAll(): Promise<Visit[]> {
    return getAllFromJsonFile<Visit>(STORAGE_FILES.visits);
  },

  async findById(id: string): Promise<Visit | undefined> {
    return findInJsonFile<Visit>(STORAGE_FILES.visits, (v) => v.id === id);
  },

  async findByMemberId(memberId: string): Promise<Visit[]> {
    const visits = await this.findAll();
    return visits.filter((v) => v.memberId === memberId).sort((a, b) => b.entryTimestamp.localeCompare(a.entryTimestamp));
  },

  async findOpenByMemberId(memberId: string): Promise<Visit | undefined> {
    const visits = await this.findAll();
    return visits.find((v) => v.memberId === memberId && v.status === 'OPEN');
  },

  async findByGymLocalDate(date: string): Promise<Visit[]> {
    const visits = await this.findAll();
    return visits.filter((v) => v.gymLocalDate === date);
  },

  async findCurrentlyInside(): Promise<Visit[]> {
    const visits = await this.findAll();
    return visits.filter((v) => v.status === 'OPEN');
  },

  async create(visit: Visit): Promise<Visit> {
    appendToJsonFile(STORAGE_FILES.visits, visit);
    return visit;
  },

  async update(id: string, updates: Partial<Visit>): Promise<Visit | null> {
    return updateInJsonFile(STORAGE_FILES.visits, (v) => v.id === id, updates);
  },

  async countByDate(date: string): Promise<number> {
    const visits = await this.findByGymLocalDate(date);
    return visits.length;
  },

  async countCompletedByDate(date: string): Promise<number> {
    const visits = await this.findByGymLocalDate(date);
    return visits.filter((v) => v.status === 'COMPLETED').length;
  },
};

export const trainerRepository = {
  async findAll(): Promise<Trainer[]> {
    return getAllFromJsonFile<Trainer>(STORAGE_FILES.trainers);
  },

  async findActive(): Promise<Trainer[]> {
    const trainers = await this.findAll();
    return trainers.filter((t) => t.isActive);
  },

  async findById(id: string): Promise<Trainer | undefined> {
    return findInJsonFile<Trainer>(STORAGE_FILES.trainers, (t) => t.id === id);
  },

  async create(trainer: Trainer): Promise<Trainer> {
    appendToJsonFile(STORAGE_FILES.trainers, trainer);
    return trainer;
  },

  async update(id: string, updates: Partial<Trainer>): Promise<Trainer | null> {
    return updateInJsonFile(STORAGE_FILES.trainers, (t) => t.id === id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<boolean> {
    return deleteFromJsonFile<Trainer>(STORAGE_FILES.trainers, (t) => t.id === id);
  },
};

export const enquiryRepository = {
  async findAll(): Promise<Enquiry[]> {
    return getAllFromJsonFile<Enquiry>(STORAGE_FILES.enquiries);
  },

  async findById(id: string): Promise<Enquiry | undefined> {
    return findInJsonFile<Enquiry>(STORAGE_FILES.enquiries, (e) => e.id === id);
  },

  async findByStatus(status: Enquiry['status']): Promise<Enquiry[]> {
    const enquiries = await this.findAll();
    return enquiries.filter((e) => e.status === status);
  },

  async create(enquiry: Enquiry): Promise<Enquiry> {
    appendToJsonFile(STORAGE_FILES.enquiries, enquiry);
    return enquiry;
  },

  async update(id: string, updates: Partial<Enquiry>): Promise<Enquiry | null> {
    return updateInJsonFile(STORAGE_FILES.enquiries, (e) => e.id === id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async countByStatus(status: Enquiry['status']): Promise<number> {
    const enquiries = await this.findAll();
    return enquiries.filter((e) => e.status === status).length;
  },
};

export const announcementRepository = {
  async findAll(): Promise<Announcement[]> {
    return getAllFromJsonFile<Announcement>(STORAGE_FILES.announcements);
  },

  async findActive(): Promise<Announcement[]> {
    const announcements = await this.findAll();
    const now = new Date().toISOString();
    return announcements.filter(
      (a) => a.status === 'published' && a.publishedAt && a.publishedAt <= now && (!a.expiresAt || a.expiresAt > now)
    );
  },

  async findById(id: string): Promise<Announcement | undefined> {
    return findInJsonFile<Announcement>(STORAGE_FILES.announcements, (a) => a.id === id);
  },

  async create(announcement: Announcement): Promise<Announcement> {
    appendToJsonFile(STORAGE_FILES.announcements, announcement);
    return announcement;
  },

  async update(id: string, updates: Partial<Announcement>): Promise<Announcement | null> {
    return updateInJsonFile(STORAGE_FILES.announcements, (a) => a.id === id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<boolean> {
    return deleteFromJsonFile<Announcement>(STORAGE_FILES.announcements, (a) => a.id === id);
  },
};

export const workoutPlanRepository = {
  async findAll(): Promise<WorkoutPlan[]> {
    return getAllFromJsonFile<WorkoutPlan>(STORAGE_FILES.workoutPlans);
  },

  async findActive(): Promise<WorkoutPlan[]> {
    const plans = await this.findAll();
    return plans.filter((p) => p.isActive);
  },

  async findById(id: string): Promise<WorkoutPlan | undefined> {
    return findInJsonFile<WorkoutPlan>(STORAGE_FILES.workoutPlans, (p) => p.id === id);
  },

  async findByMemberId(memberId: string): Promise<WorkoutPlan | undefined> {
    const plans = await this.findAll();
    return plans.find((p) => p.memberIds.includes(memberId) && p.isActive);
  },

  async findByTrainerId(trainerId: string): Promise<WorkoutPlan[]> {
    const plans = await this.findAll();
    return plans.filter((p) => p.trainerId === trainerId && p.isActive);
  },

  async create(plan: WorkoutPlan): Promise<WorkoutPlan> {
    appendToJsonFile(STORAGE_FILES.workoutPlans, plan);
    return plan;
  },

  async update(id: string, updates: Partial<WorkoutPlan>): Promise<WorkoutPlan | null> {
    return updateInJsonFile(STORAGE_FILES.workoutPlans, (p) => p.id === id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<boolean> {
    return deleteFromJsonFile<WorkoutPlan>(STORAGE_FILES.workoutPlans, (p) => p.id === id);
  },
};

export const settingsRepository = {
  async find(): Promise<GymSettings | null> {
    const settings = getAllFromJsonFile<GymSettings>(STORAGE_FILES.settings);
    return settings[0] || null;
  },

  async update(settings: Partial<GymSettings>): Promise<GymSettings> {
    const existing = await this.find();
    const updated = {
      ...(existing || {}),
      ...settings,
      updatedAt: new Date().toISOString(),
    } as GymSettings;
    
    writeJsonFile(STORAGE_FILES.settings, [updated]);
    return updated;
  },
};

export const auditLogRepository = {
  async findAll(): Promise<AuditLog[]> {
    return getAllFromJsonFile<AuditLog>(STORAGE_FILES.auditLogs);
  },

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    const logs = await this.findAll();
    return logs.filter((l) => l.entityType === entityType && l.entityId === entityId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },

  async create(log: AuditLog): Promise<AuditLog> {
    appendToJsonFile(STORAGE_FILES.auditLogs, log);
    return log;
  },
};