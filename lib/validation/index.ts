import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/, 'Invalid phone number'),
  membershipPlanId: z.string().optional().nullable(),
  membershipStartDate: z.string().optional().nullable(),
  membershipEndDate: z.string().optional().nullable(),
  approvalStatus: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  membershipStatus: z.enum(['active', 'inactive', 'expired', 'cancelled']).default('active'),
});

export const membershipPlanSchema = z.object({
  name: z.string().min(2, 'Plan name must be at least 2 characters').max(100),
  price: z.number().min(0, 'Price cannot be negative'),
  durationDays: z.number().int().min(1, 'Duration must be at least 1 day'),
  benefits: z.array(z.string()).min(1, 'At least one benefit is required'),
  isActive: z.boolean().default(true),
});

export const trainerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/, 'Invalid phone number'),
  specialization: z.array(z.string()).min(1, 'At least one specialization is required'),
  experienceYears: z.number().int().min(0, 'Experience cannot be negative').max(100),
  certifications: z.array(z.string()).optional(),
  bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),
  photoUrl: z.string().url('Invalid URL').optional().nullable(),
  isActive: z.boolean().default(true),
});

export const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/, 'Invalid phone number'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export const announcementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const workoutPlanSchema = z.object({
  name: z.string().min(2, 'Plan name must be at least 2 characters').max(100),
  description: z.string().max(2000).optional(),
  trainerId: z.string().min(1, 'Trainer is required'),
  memberIds: z.array(z.string()).optional(),
  days: z.array(z.object({
    day: z.number().int().min(1).max(7),
    name: z.string().min(1, 'Day name is required'),
    exercises: z.array(z.object({
      name: z.string().min(1, 'Exercise name is required'),
      sets: z.number().int().min(1).max(20),
      reps: z.union([z.number().int().min(1).max(100), z.string()]),
      restSeconds: z.number().int().min(0).max(600),
      instructions: z.string().max(500).optional(),
      order: z.number().int().min(0),
    })).min(1, 'At least one exercise per day'),
  })).min(1, 'At least one day is required').max(7),
  isActive: z.boolean().default(true),
});

export const settingsSchema = z.object({
  gymName: z.string().min(2, 'Gym name must be at least 2 characters').max(100),
  gymEmail: z.string().email('Invalid email address'),
  gymPhone: z.string().regex(/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/, 'Invalid phone number'),
  gymAddress: z.string().min(10, 'Address must be at least 10 characters').max(500),
  timezone: z.string().min(1, 'Timezone is required'),
  openingHours: z.record(z.object({
    open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    closed: z.boolean(),
  })),
  appUrl: z.string().url('Invalid URL'),
  membershipSettings: z.object({
    allowSelfRegistration: z.boolean(),
    requireApproval: z.boolean(),
    defaultPlanId: z.string().optional().nullable(),
    gracePeriodDays: z.number().int().min(0).max(365),
  }),
  attendanceSettings: z.object({
    maxVisitsPerDay: z.number().int().min(1).max(10),
    allowManualCorrection: z.boolean(),
    requireExitConfirmation: z.boolean(),
  }),
});

export const attendanceSubmitSchema = z.object({
  // No client-supplied fields - everything derived from session
});

export const manualAttendanceCorrectionSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  type: z.enum(['ENTRY', 'EXIT']),
  timestamp: z.string().datetime('Invalid timestamp'),
  gymLocalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(1000),
  visitId: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MemberInput = z.infer<typeof memberSchema>;
export type MembershipPlanInput = z.infer<typeof membershipPlanSchema>;
export type TrainerInput = z.infer<typeof trainerSchema>;
export type EnquiryInput = z.infer<typeof enquirySchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type WorkoutPlanInput = z.infer<typeof workoutPlanSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type ManualAttendanceCorrectionInput = z.infer<typeof manualAttendanceCorrectionSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;