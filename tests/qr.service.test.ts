import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/repository', () => ({
  settingsRepository: {
    find: vi.fn(),
  },
  auditLogRepository: { create: vi.fn() },
  memberRepository: { findById: vi.fn(), findAll: vi.fn() },
  visitRepository: {
    findOpenByMemberId: vi.fn(),
    findByMemberId: vi.fn(),
    currently: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  attendanceEventRepository: {
    findByMemberAndDate: vi.fn(),
    findByGymLocalDate: vi.fn(),
    create: vi.fn(),
  },
}));

import { generateGymQRCode } from '@/lib/qr';
import { settingsRepository } from '@/lib/repository';

async function checkInUrlFrom(appUrl: string): Promise<string> {
  delete process.env.APP_URL;
  (settingsRepository.find as any).mockResolvedValue({ appUrl });
  const result = await generateGymQRCode();
  return result.checkInUrl;
}

async function generateFrom(appUrl: string) {
  delete process.env.APP_URL;
  (settingsRepository.find as any).mockResolvedValue({ appUrl });
  return generateGymQRCode();
}

describe('gym QR check-in URL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('appends /check-in to a plain domain', async () => {
    const url = await checkInUrlFrom('https://gym-jbwi.onrender.com');
    expect(url).toBe('https://gym-jbwi.onrender.com/check-in');
  });

  it('strips a trailing slash before appending', async () => {
    const url = await checkInUrlFrom('https://gym-jbwi.onrender.com/');
    expect(url).toBe('https://gym-jbwi.onrender.com/check-in');
  });

  it('does not duplicate /check-in when already present', async () => {
    const url = await checkInUrlFrom('https://gym-jbwi.onrender.com/check-in');
    expect(url).toBe('https://gym-jbwi.onrender.com/check-in');
  });

  it('does not duplicate /check-in when present with a trailing slash', async () => {
    const url = await checkInUrlFrom('https://gym-jbwi.onrender.com/check-in/');
    expect(url).toBe('https://gym-jbwi.onrender.com/check-in');
  });

  it('never produces a double slash before check-in', async () => {
    const url = await checkInUrlFrom('https://gym-jbwi.onrender.com//');
    expect(url).toBe('https://gym-jbwi.onrender.com/check-in');
    expect(url).not.toContain('//check-in');
  });

  it('prefers the APP_URL environment variable over stored settings', async () => {
    process.env.APP_URL = 'https://from-env.onrender.com';
    (settingsRepository.find as any).mockResolvedValue({
      appUrl: 'https://stale-domain.onrender.com',
    });
    const result = await generateGymQRCode();
    expect(result.checkInUrl).toBe('https://from-env.onrender.com/check-in');
    delete process.env.APP_URL;
  });

  it('still returns a usable QR payload', async () => {
    const result = await generateFrom('https://gym-jbwi.onrender.com');
    expect(result.checkInUrl).toBe('https://gym-jbwi.onrender.com/check-in');
    expect(result.dataUrl).toMatch(/^data:image\/png;base64,/);
    expect(result.svg).toContain('<svg');
  });
});