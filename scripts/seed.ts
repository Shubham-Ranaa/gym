import { promises as fs } from 'fs';
import { join } from 'path';
import { hashPassword } from '../lib/auth/password';
import { generateId, generateMemberCode } from '../lib/utils';
import { formatInTimeZone } from 'date-fns-tz';

const DATA_DIR = join(process.cwd(), 'data');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

async function writeJsonFile(filename: string, data: any[]) {
  await ensureDataDir();
  const filepath = join(DATA_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✓ Created ${filename} with ${data.length} records`);
}

async function seedData() {
  console.log('🌱 Seeding demo data...\n');
  
  const now = new Date();
  const gymTime = formatInTimeZone(now, 'Asia/Kolkata', "yyyy-MM-dd'T'HH:mm:ssXXX");
  
  // Seed membership plans
  const plans = [
    {
      id: generateId('plan_'),
      name: 'Monthly Flex',
      price: 2999,
      durationDays: 30,
      benefits: [
        '24/7 Gym Access',
        'All Group Classes Included',
        'Free Fitness Assessment',
        'Locker Room Access',
        'Mobile App Access',
        '2 Guest Passes/Month',
      ],
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('plan_'),
      name: 'Quarterly Power',
      price: 7999,
      durationDays: 90,
      benefits: [
        'Everything in Monthly Flex',
        'Priority Class Booking',
        'Body Composition Scan (Quarterly)',
        '4 Guest Passes/Month',
        'Nutrition Guide Access',
        'Workout Program Library',
      ],
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('plan_'),
      name: 'Half-Yearly Pro',
      price: 14999,
      durationDays: 180,
      benefits: [
        'Everything in Quarterly Power',
        '1 Personal Training Session/Month',
        'Monthly Body Composition Scan',
        'Custom Workout Program',
        '6 Guest Passes/Month',
        'Monthly Nutrition Check-in',
        'Advanced Recovery Access',
      ],
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('plan_'),
      name: 'Yearly Elite',
      price: 26999,
      durationDays: 365,
      benefits: [
        'Everything in Half-Yearly Pro',
        '2 Personal Training Sessions/Month',
        'Bi-weekly Body Composition Scans',
        'Unlimited Nutrition Coaching',
        'Unlimited Guest Passes',
        'Quarterly Metabolic Testing',
        'Competition Prep Support',
        'Exclusive Member Events',
        '2 Weeks Freeze/Year',
      ],
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
  ];
  await writeJsonFile('membership-plans.json', plans);
  
  // Seed trainers
  const trainers = [
    {
      id: generateId('train_'),
      name: 'Alex Morgan',
      email: 'alex@fitforge.com',
      phone: '+1 (555) 123-4567',
      specialization: ['Strength Training', 'Powerlifting', 'Athletic Performance'],
      experienceYears: 12,
      certifications: ['NSCA CSCS', 'USAW Level 2', 'CF-L2'],
      bio: 'Former collegiate strength coach with a passion for building raw strength. Alex has coached 50+ national-level powerlifters and helps everyday athletes unlock their potential.',
      photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face',
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('train_'),
      name: 'Jordan Rivera',
      email: 'jordan@fitforge.com',
      phone: '+1 (555) 234-5678',
      specialization: ['HIIT', 'Functional Fitness', 'Weight Loss'],
      experienceYears: 8,
      certifications: ['NASM CPT', 'CrossFit L2', 'Precision Nutrition L1'],
      bio: 'High-energy coach specializing in metabolic conditioning and body recomposition. Jordan\'s classes are famous for pushing limits while keeping it fun and accessible.',
      photoUrl: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400&h=400&fit=crop&crop=face',
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('train_'),
      name: 'Dr. Sam Chen',
      email: 'sam@fitforge.com',
      phone: '+1 (555) 345-6789',
      specialization: ['Rehabilitation', 'Mobility', 'Corrective Exercise'],
      experienceYears: 15,
      certifications: ['DPT', 'FMS Certified', 'DNS Practitioner', 'CSCS'],
      bio: 'Physical therapist turned performance coach. Sam bridges the gap between rehab and performance, helping members move pain-free and build resilient bodies.',
      photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('train_'),
      name: 'Maya Patel',
      email: 'maya@fitforge.com',
      phone: '+1 (555) 456-7890',
      specialization: ['Yoga', 'Pilates', 'Mind-Body Connection'],
      experienceYears: 10,
      certifications: ['RYT-500', 'PMA-CPT', 'Yoga Therapy'],
      bio: 'Former dancer with a decade of teaching experience. Maya blends traditional yoga with modern movement science for mobility, recovery, and mental clarity.',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('train_'),
      name: 'Chris Thompson',
      email: 'chris@fitforge.com',
      phone: '+1 (555) 567-8901',
      specialization: ['Bodybuilding', 'Hypertrophy', 'Nutrition'],
      experienceYears: 11,
      certifications: ['IFBB Pro', 'ISSA Master Trainer', 'Precision Nutrition L2'],
      bio: 'Natural bodybuilding champion and nutrition expert. Chris designs science-backed hypertrophy programs and sustainable nutrition strategies for aesthetic goals.',
      photoUrl: 'https://images.unsplash.com/photo-1566251577-5c7d8b5e6e8d?w=400&h=400&fit=crop&crop=face',
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('train_'),
      name: 'Taylor Kim',
      email: 'taylor@fitforge.com',
      phone: '+1 (555) 678-9012',
      specialization: ['Olympic Lifting', 'Sports Performance', 'Speed & Agility'],
      experienceYears: 9,
      certifications: ['USAW Level 1', 'CSCS', 'EXOS XPS'],
      bio: 'Former track athlete turned Olympic lifting specialist. Taylor develops explosive power and speed for athletes across football, basketball, and track & field.',
      photoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1c?w=400&h=400&fit=crop&crop=face',
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
  ];
  await writeJsonFile('trainers.json', trainers);
  
  // Seed members
  const members = [
    {
      id: generateId('mem_'),
      memberCode: generateMemberCode(),
      name: 'Admin User',
      email: 'admin@fitforge.com',
      phone: '+1 (555) 000-0000',
      passwordHash: await hashPassword('admin123'),
      role: 'admin',
      approvalStatus: 'approved',
      membershipStatus: 'active',
      membershipPlanId: plans[3].id, // Yearly Elite
      membershipStartDate: formatInTimeZone(now, 'Asia/Kolkata', "yyyy-MM-dd'T'HH:mm:ssXXX"),
      membershipEndDate: formatInTimeZone(
        new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('mem_'),
      memberCode: generateMemberCode(),
      name: 'John Doe',
      email: 'john@fitforge.com',
      phone: '+1 (555) 111-1111',
      passwordHash: await hashPassword('member123'),
      role: 'member',
      approvalStatus: 'approved',
      membershipStatus: 'active',
      membershipPlanId: plans[2].id, // Half-Yearly Pro
      membershipStartDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() - 6, 15),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      membershipEndDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() + 6, 15),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('mem_'),
      memberCode: generateMemberCode(),
      name: 'Sarah Smith',
      email: 'sarah@fitforge.com',
      phone: '+1 (555) 222-2222',
      passwordHash: await hashPassword('member123'),
      role: 'member',
      approvalStatus: 'approved',
      membershipStatus: 'active',
      membershipPlanId: plans[1].id, // Quarterly Power
      membershipStartDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() - 3, 10),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      membershipEndDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() + 3, 10),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('mem_'),
      memberCode: generateMemberCode(),
      name: 'Mike Johnson',
      email: 'mike@fitforge.com',
      phone: '+1 (555) 333-3333',
      passwordHash: await hashPassword('member123'),
      role: 'member',
      approvalStatus: 'approved',
      membershipStatus: 'active',
      membershipPlanId: plans[0].id, // Monthly Flex
      membershipStartDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() - 1, 5),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      membershipEndDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() + 1, 5),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('mem_'),
      memberCode: generateMemberCode(),
      name: 'Emily Davis',
      email: 'emily@fitforge.com',
      phone: '+1 (555) 444-4444',
      passwordHash: await hashPassword('member123'),
      role: 'member',
      approvalStatus: 'approved',
      membershipStatus: 'expired',
      membershipPlanId: plans[0].id,
      membershipStartDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() - 2, 1),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      membershipEndDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('mem_'),
      memberCode: generateMemberCode(),
      name: 'Alex Wilson',
      email: 'alex.w@fitforge.com',
      phone: '+1 (555) 555-5555',
      passwordHash: await hashPassword('member123'),
      role: 'member',
      approvalStatus: 'approved',
      membershipStatus: 'active',
      membershipPlanId: plans[0].id,
      membershipStartDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth(), 1),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      membershipEndDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() + 1, 1),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('mem_'),
      memberCode: generateMemberCode(),
      name: 'Priya Sharma',
      email: 'priya@fitforge.com',
      phone: '+1 (555) 666-6666',
      passwordHash: await hashPassword('member123'),
      role: 'member',
      approvalStatus: 'pending', // Pending approval
      membershipStatus: 'active',
      membershipPlanId: plans[0].id,
      membershipStartDate: null,
      membershipEndDate: null,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('mem_'),
      memberCode: generateMemberCode(),
      name: 'David Brown',
      email: 'david@fitforge.com',
      phone: '+1 (555) 777-7777',
      passwordHash: await hashPassword('member123'),
      role: 'member',
      approvalStatus: 'approved',
      membershipStatus: 'inactive',
      membershipPlanId: plans[1].id,
      membershipStartDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() - 4, 20),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      membershipEndDate: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth(), 20),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      createdAt: gymTime,
      updatedAt: gymTime,
    },
  ];
  await writeJsonFile('members.json', members);
  
  // Seed attendance events and visits for demo
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatInTimeZone(yesterday, 'Asia/Kolkata', "yyyy-MM-dd");
  
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekStr = formatInTimeZone(lastWeek, 'Asia/Kolkata', "yyyy-MM-dd");
  
  const events = [];
  const visits = [];
  
  // Create visits for active members
  const activeMembers = members.filter(m => m.approvalStatus === 'approved' && m.membershipStatus === 'active');
  
  for (let i = 0; i < Math.min(5, activeMembers.length); i++) {
    const member = activeMembers[i];
    
    // Visit from yesterday (completed)
    const visitId = generateId('vis_');
    const entryTimeYesterday = formatInTimeZone(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 8, 30, 0),
      'Asia/Kolkata',
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );
    const exitTimeYesterday = formatInTimeZone(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 11, 45, 0),
      'Asia/Kolkata',
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );
    
    const visit = {
      id: visitId,
      memberId: member.id,
      entryEventId: generateId('evt_'),
      exitEventId: generateId('evt_'),
      entryTimestamp: entryTimeYesterday,
      exitTimestamp: exitTimeYesterday,
      durationSeconds: 11700, // 3 hours 15 minutes
      gymLocalDate: yesterdayStr,
      status: 'COMPLETED',
    };
    visits.push(visit);
    
    events.push({
      id: visit.entryEventId,
      visitId,
      memberId: member.id,
      type: 'ENTRY',
      timestamp: entryTimeYesterday,
      gymLocalDate: yesterdayStr,
      createdAt: entryTimeYesterday,
    });
    
    events.push({
      id: visit.exitEventId,
      visitId,
      memberId: member.id,
      type: 'EXIT',
      timestamp: exitTimeYesterday,
      gymLocalDate: yesterdayStr,
      createdAt: exitTimeYesterday,
    });
    
    // Visit from last week (completed)
    const visitId2 = generateId('vis_');
    const entryTimeLastWeek = formatInTimeZone(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 17, 0, 0),
      'Asia/Kolkata',
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );
    const exitTimeLastWeek = formatInTimeZone(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 20, 30, 0),
      'Asia/Kolkata',
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );
    
    const visit2 = {
      id: visitId2,
      memberId: member.id,
      entryEventId: generateId('evt_'),
      exitEventId: generateId('evt_'),
      entryTimestamp: entryTimeLastWeek,
      exitTimestamp: exitTimeLastWeek,
      durationSeconds: 12600, // 3 hours 30 minutes
      gymLocalDate: lastWeekStr,
      status: 'COMPLETED',
    };
    visits.push(visit2);
    
    events.push({
      id: visit2.entryEventId,
      visitId: visitId2,
      memberId: member.id,
      type: 'ENTRY',
      timestamp: entryTimeLastWeek,
      gymLocalDate: lastWeekStr,
      createdAt: entryTimeLastWeek,
    });
    
    events.push({
      id: visit2.exitEventId,
      visitId: visitId2,
      memberId: member.id,
      type: 'EXIT',
      timestamp: exitTimeLastWeek,
      gymLocalDate: lastWeekStr,
      createdAt: exitTimeLastWeek,
    });
  }
  
  // Create an open visit for one member (currently inside)
  const memberInside = activeMembers[0];
  const visitIdInside = generateId('vis_');
  const entryTimeInside = formatInTimeZone(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15, 0),
    'Asia/Kolkata',
    "yyyy-MM-dd'T'HH:mm:ssXXX"
  );
  
  const visitInside = {
    id: visitIdInside,
    memberId: memberInside.id,
    entryEventId: generateId('evt_'),
    exitEventId: null,
    entryTimestamp: entryTimeInside,
    exitTimestamp: null,
    durationSeconds: null,
    gymLocalDate: formatInTimeZone(now, 'Asia/Kolkata', "yyyy-MM-dd"),
    status: 'OPEN',
  };
  visits.push(visitInside);
  
  events.push({
    id: visitInside.entryEventId,
    visitId: visitIdInside,
    memberId: memberInside.id,
    type: 'ENTRY',
    timestamp: entryTimeInside,
    gymLocalDate: formatInTimeZone(now, 'Asia/Kolkata', "yyyy-MM-dd"),
    createdAt: entryTimeInside,
  });
  
  await writeJsonFile('visits.json', visits);
  await writeJsonFile('attendance-events.json', events);
  
  // Seed enquiries
  const enquiries = [
    {
      id: generateId('enq_'),
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 111-2222',
      subject: 'Membership Inquiry',
      message: 'Hello, I\'m interested in joining your gym. Could you please provide more information about your membership options and pricing?',
      status: 'new',
      notes: '',
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('enq_'),
      name: 'Jessica Lee',
      email: 'jessica.lee@email.com',
      phone: '+1 (555) 222-3333',
      subject: 'Personal Training',
      message: 'I\'m looking for a personal trainer to help me with weight loss and strength training. Do you offer introductory packages?',
      status: 'contacted',
      notes: 'Called back on ' + formatInTimeZone(new Date(Date.now() - 86400000), 'Asia/Kolkata', "yyyy-MM-dd") + '. Interested in 3-month package.',
      createdAt: gymTime,
      updatedAt: formatInTimeZone(new Date(Date.now() - 43200000), 'Asia/Kolkata', "yyyy-MM-dd'T'HH:mm:ssXXX"),
    },
    {
      id: generateId('enq_'),
      name: 'Robert Kim',
      email: 'robert.kim@email.com',
      phone: '+1 (555) 333-4444',
      subject: 'Facility Tour',
      message: 'I would like to schedule a tour of your facility. I work nearby and am considering switching gyms.',
      status: 'new',
      notes: '',
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('enq_'),
      name: 'Amanda Rodriguez',
      email: 'amanda.rodriguez@email.com',
      phone: '+1 (555) 444-5555',
      subject: 'Group Classes',
      message: 'What types of group classes do you offer? Are they included in all memberships?',
      status: 'converted',
      notes: 'Converted to member on ' + formatInTimeZone(new Date(Date.now() - 172800000), 'Asia/Kolkata', "yyyy-MM-dd") + '. Assigned to member ID: ' + members[3].id,
      createdAt: gymTime,
      updatedAt: formatInTimeZone(new Date(Date.now() - 86400000), 'Asia/Kolkata', "yyyy-MM-dd'T'HH:mm:ssXXX"),
    },
  ];
  await writeJsonFile('enquiries.json', enquiries);
  
  // Seed announcements
  const announcements = [
    {
      id: generateId('ann_'),
      title: 'New Year, New You Challenge',
      message: 'Join our 30-day fitness challenge starting January 1st! Includes personalized workout plans, nutrition guidance, and weekly check-ins. Prizes for top participants!',
      status: 'published',
      publishedAt: gymTime,
      expiresAt: formatInTimeZone(
        new Date(now.getFullYear() + 1, 0, 31), // Jan 31 next year
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('ann_'),
      title: 'Holiday Hours Notice',
      message: 'Please note our holiday hours: Dec 24 & 31: 5AM-3PM | Dec 25 & Jan 1: 8AM-6PM. Regular hours resume Jan 2nd.',
      status: 'published',
      publishedAt: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() - 1, 15),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      expiresAt: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth(), 10),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      createdAt: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() - 1, 15),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      updatedAt: formatInTimeZone(
        new Date(now.getFullYear(), now.getMonth() - 1, 15),
        'Asia/Kolkata',
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
    },
    {
      id: generateId('ann_'),
      title: 'Equipment Maintenance Schedule',
      message: 'Our cardio theater will be undergoing maintenance on Jan 15-17. Alternative cardio equipment will be available in the main floor during this time.',
      status: 'draft',
      publishedAt: null,
      expiresAt: null,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
  ];
  await writeJsonFile('announcements.json', announcements);
  
  // Seed workout plans
  const workoutPlans = [
    {
      id: generateId('wp_'),
      name: 'Beginner Strength Foundation',
      description: 'Perfect for those new to strength training or returning after a break. Focuses on proper form, basic movement patterns, and building a strong foundation.',
      trainerId: trainers[0].id, // Alex Morgan
      memberIds: [members[1].id, members[2].id], // John and Sarah
      days: [
        {
          day: 1,
          name: 'Upper Body Push',
          exercises: [
            { id: generateId('ex_'), name: 'Barbell Bench Press', sets: 4, reps: '8-10', restSeconds: 90, instructions: 'Focus on controlled movement, touch chest lightly', order: 1 },
            { id: generateId('ex_'), name: 'Overhead Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 75, instructions: 'Keep core tight, avoid arching back', order: 2 },
            { id: generateId('ex_'), name: 'Incline Push-ups', sets: 3, reps: '12-15', restSeconds: 60, instructions: 'Hands on bench, body straight', order: 3 },
            { id: generateId('ex_'), name: 'Triceps Rope Pushdown', sets: 3, reps: '12-15', restSeconds: 60, instructions: 'Elbows tucked, full extension', order: 4 },
          ],
        },
        {
          day: 2,
          name: 'Lower Body & Core',
          exercises: [
            { id: generateId('ex_'), name: 'Goblet Squat', sets: 4, reps: '12-15', restSeconds: 90, instructions: 'Chest up, knees out, full depth', order: 1 },
            { id: generateId('ex_'), name: 'Romanian Deadlift', sets: 3, reps: '10-12', restSeconds: 90, instructions: 'Hinge at hips, slight knee bend', order: 2 },
            { id: generateId('ex_'), name: 'Leg Press', sets: 3, reps: '12-15', restSeconds: 75, instructions: 'Feet shoulder-width, controlled motion', order: 3 },
            { id: generateId('ex_'), name: 'Plank', sets: 3, reps: '30-45s', restSeconds: 60, instructions: 'Straight line from head to heels', order: 4 },
            { id: generateId('ex_'), name: 'Russian Twists', sets: 3, reps: '20/side', restSeconds: 45, instructions: 'Feet off ground, touch floor each side', order: 5 },
          ],
        },
        {
          day: 3,
          name: 'Upper Body Pull',
          exercises: [
            { id: generateId('ex_'), name: 'Pull-ups', sets: 4, reps: 'AMRAP', restSeconds: 90, instructions: 'Use band if needed, full range of motion', order: 1 },
            { id: generateId('ex_'), name: 'Seated Cable Row', sets: 3, reps: '10-12', restSeconds: 75, instructions: 'Squeeze shoulder blades, neutral grip', order: 2 },
            { id: generateId('ex_'), name: 'Face Pulls', sets: 3, reps: '15-20', restSeconds: 60, instructions: 'High elbows, external rotation', order: 3 },
            { id: generateId('ex_'), name: 'Biceps Curl', sets: 3, reps: '12-15', restSeconds: 60, instructions: 'Supinated grip, no swinging', order: 4 },
          ],
        },
      ],
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
    {
      id: generateId('wp_'),
      name: 'HIIT Fat Loss Program',
      description: 'High-intensity interval training designed for maximum calorie burn and cardiovascular improvement. Scalable for all fitness levels.',
      trainerId: trainers[1].id, // Jordan Rivera
      memberIds: [members[3].id], // Mike
      days: [
        {
          day: 1,
          name: 'Circuit Training',
          exercises: [
            { id: generateId('ex_'), name: 'Kettlebell Swings', sets: 4, reps: '20', restSeconds: 45, instructions: 'Hip hinge movement, explode up', order: 1 },
            { id: generateId('ex_'), name: 'Burpees', sets: 4, reps: '10', restSeconds: 60, instructions: 'Chest to ground, jump up', order: 2 },
            { id: generateId('ex_'), name: 'Box Jumps', sets: 4, reps: '12', restSeconds: 60, instructions: 'Soft landing, step down', order: 3 },
            { id: generateId('ex_'), name: 'Battle Ropes', sets: 4, reps: '30s', restSeconds: 60, instructions: 'Alternating waves, fight the rope', order: 4 },
          ],
        },
        {
          day: 2,
          name: 'Sprint Intervals',
          exercises: [
            { id: generateId('ex_'), name: 'Treadmill Sprints', sets: 8, reps: '30s', restSeconds: 90, instructions: '90% effort, walk recovery', order: 1 },
            { id: generateId('ex_'), name: 'Sled Push', sets: 6, reps: '25m', restSeconds: 120, instructions: 'Light weight, fast pace', order: 2 },
            { id: generateId('ex_'), name: 'Jump Rope', sets: 6, reps: '60s', restSeconds: 60, instructions: 'Double unders if possible', order: 3 },
            { id: generateId('ex_'), name: 'Farmer\'s Carry', sets: 6, reps: '30m', restSeconds: 90, instructions: 'Heavy weights, walk tall', order: 4 },
          ],
        },
      ],
      isActive: true,
      createdAt: gymTime,
      updatedAt: gymTime,
    },
  ];
  await writeJsonFile('workout-plans.json', workoutPlans);
  
  // Seed settings
  const settings = [
    {
      gymName: 'FitForge',
      gymEmail: 'hello@fitforge.com',
      gymPhone: '+1 (555) 123-4567',
      gymAddress: '123 Fitness Street, Gym City, GC 12345',
      timezone: 'Asia/Kolkata',
      openingHours: {
        'Monday': { open: '05:00', close: '23:00', closed: false },
        'Tuesday': { open: '05:00', close: '23:00', closed: false },
        'Wednesday': { open: '05:00', close: '23:00', closed: false },
        'Thursday': { open: '05:00', close: '23:00', closed: false },
        'Friday': { open: '05:00', close: '23:00', closed: false },
        'Saturday': { open: '07:00', close: '21:00', closed: false },
        'Sunday': { open: '07:00', close: '21:00', closed: false },
      },
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      membershipSettings: {
        allowSelfRegistration: true,
        requireApproval: true,
        defaultPlanId: plans[0].id, // Monthly Flex
        gracePeriodDays: 7,
      },
      attendanceSettings: {
        maxVisitsPerDay: 1,
        allowManualCorrection: true,
        requireExitConfirmation: false,
      },
      updatedAt: gymTime,
    },
  ];
  await writeJsonFile('settings.json', settings);
  
  // Seed audit logs (empty initially)
  await writeJsonFile('audit-logs.json', []);
  
  console.log('\n✅ Demo data seeding complete!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin: admin@fitforge.com / admin123');
  console.log('   Members:');
  console.log('     - john@fitforge.com / member123 (Half-Yearly Pro)');
  console.log('     - sarah@fitforge.com / member123 (Quarterly Power)');
  console.log('     - mike@fitforge.com / member123 (Monthly Flex)');
  console.log('     - emily@fitforge.com / member123 (Expired)');
  console.log('     - alex.w@fitforge.com / member123 (Monthly Flex)');
  console.log('     - priya@fitforge.com / member123 (Pending Approval)');
  console.log('     - david@fitforge.com / member123 (Inactive)');
  console.log('\n🚀 To start the application:');
  console.log('   npm run dev');
  console.log('\n🔧 Environment variables (create .env.local):');
  console.log('   APP_URL=http://localhost:3000');
  console.log('   SESSION_SECRET=your-super-secret-key-change-in-production');
  console.log('   GYM_TIMEZONE=Asia/Kolkata');
}

seedData().catch(console.error);