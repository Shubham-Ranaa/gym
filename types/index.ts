export type Role = 'admin' | 'member';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type MembershipStatus = 'active' | 'inactive' | 'expired' | 'cancelled';
export type AttendanceType = 'ENTRY' | 'EXIT';
export type VisitStatus = 'OPEN' | 'COMPLETED';
export type EnquiryStatus = 'new' | 'contacted' | 'converted' | 'closed';
export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export interface Member {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  approvalStatus: ApprovalStatus;
  membershipStatus: MembershipStatus;
  membershipPlanId: string | null;
  membershipStartDate: string | null;
  membershipEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  benefits: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceEvent {
  id: string;
  visitId: string;
  memberId: string;
  type: AttendanceType;
  timestamp: string;
  gymLocalDate: string;
  createdAt: string;
}

export interface Visit {
  id: string;
  memberId: string;
  entryEventId: string;
  exitEventId: string | null;
  entryTimestamp: string;
  exitTimestamp: string | null;
  durationSeconds: number | null;
  gymLocalDate: string;
  status: VisitStatus;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experienceYears: number;
  certifications: string[];
  bio: string;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  status: AnnouncementStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  memberIds: string[];
  days: WorkoutDay[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutDay {
  day: number;
  name: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string;
  restSeconds: number;
  instructions: string;
  order: number;
}

export interface GymSettings {
  gymName: string;
  gymEmail: string;
  gymPhone: string;
  gymAddress: string;
  timezone: string;
  openingHours: OpeningHours;
  appUrl: string;
  membershipSettings: MembershipSettings;
  attendanceSettings: AttendanceSettings;
  updatedAt: string;
}

export interface OpeningHours {
  [day: string]: { open: string; close: string; closed: boolean };
}

export interface MembershipSettings {
  allowSelfRegistration: boolean;
  requireApproval: boolean;
  defaultPlanId: string | null;
  gracePeriodDays: number;
}

export interface AttendanceSettings {
  maxVisitsPerDay: number;
  allowManualCorrection: boolean;
  requireExitConfirmation: boolean;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  performedByRole: Role;
  previousData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  reason: string | null;
  timestamp: string;
}

export interface SessionUser {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  role: Role;
  approvalStatus: ApprovalStatus;
  membershipStatus: MembershipStatus;
  membershipPlanId: string | null;
}

export interface AttendanceResult {
  success: boolean;
  event?: AttendanceEvent;
  visit?: Visit;
  message: string;
  errorCode?: AttendanceErrorCode;
}

export type AttendanceErrorCode =
  | 'ALREADY_INSIDE'
  | 'ALREADY_COMPLETED_TODAY'
  | 'PREVIOUS_VISIT_UNRESOLVED'
  | 'MEMBER_NOT_APPROVED'
  | 'MEMBER_INACTIVE'
  | 'MEMBERSHIP_EXPIRED'
  | 'MEMBERSHIP_INVALID'
  | 'UNAUTHORIZED'
  | 'INVALID_REQUEST'
  | 'STORAGE_ERROR'
  | 'CONCURRENT_REQUEST';

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  pendingApprovals: number;
  currentlyInside: number;
  entriesToday: number;
  exitsToday: number;
  expiredMemberships: number;
  pendingEnquiries: number;
}

export interface AttendanceChartData {
  date: string;
  entries: number;
  exits: number;
  currentlyInside: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}