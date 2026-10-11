'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Input';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface GymSettings {
  gymName: string;
  gymEmail: string;
  gymPhone: string;
  gymAddress: string;
  timezone: string;
  openingHours: Record<string, { open: string; close: string; closed: boolean }>;
  appUrl: string;
  membershipSettings: {
    allowSelfRegistration: boolean;
    requireApproval: boolean;
    defaultPlanId: string | null;
    gracePeriodDays: number;
  };
  attendanceSettings: {
    maxVisitsPerDay: number;
    allowManualCorrection: boolean;
    requireExitConfirmation: boolean;
  };
  updatedAt: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function Toggle({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-brand-surface border border-brand-border rounded-xl">
      <div>
        <p className="font-medium text-brand-text">{label}</p>
        {description && <p className="text-sm text-brand-textMuted mt-1">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent ${
          checked ? 'bg-brand-accent' : 'bg-brand-border'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GymSettings | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    async function load() {
      try {
        const [settingsRes, plansRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/plans'),
        ]);
        
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings(Array.isArray(data) ? data[0] || null : data);
        }
        if (plansRes.ok) {
          const data = await plansRes.json();
          setPlans(Array.isArray(data) ? data : []);
        }
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-brand-accent animate-spin" />
        </div>
      </AdminLayout>
    );
  }
  
  if (!settings) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-brand-textDim">
          <AlertCircle className="h-16 w-16 mx-auto mb-4" />
          <p>Unable to load settings. Please try again later.</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-brand-text">Gym Settings</h1>
              <p className="text-brand-textMuted">
                Configure gym information, membership rules and attendance rules
              </p>
            </div>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gym Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label htmlFor="gymName">Gym Name</Label>
                  <Input
                    id="gymName"
                    value={settings.gymName}
                    onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gymEmail">Email Address</Label>
                  <Input
                    id="gymEmail"
                    type="email"
                    value={settings.gymEmail}
                    onChange={(e) => setSettings({ ...settings, gymEmail: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gymPhone">Phone Number</Label>
                  <Input
                    id="gymPhone"
                    value={settings.gymPhone}
                    onChange={(e) => setSettings({ ...settings, gymPhone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gymAddress">Address</Label>
                  <Textarea
                    id="gymAddress"
                    value={settings.gymAddress}
                    onChange={(e) => setSettings({ ...settings, gymAddress: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                  </Select>
                  <p className="text-xs text-brand-textMuted mt-1">
                    Used for all attendance day calculations
                  </p>
                </div>
                <div>
                  <Label htmlFor="appUrl">Public Application URL</Label>
                  <Input
                    id="appUrl"
                    value={settings.appUrl}
                    onChange={(e) => setSettings({ ...settings, appUrl: e.target.value })}
                    required
                  />
                  <p className="text-xs text-brand-textMuted mt-1">Used to generate the gym QR code</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Opening Hours</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {DAYS.map((day) => {
                  const hours = settings.openingHours[day] || { open: '06:00', close: '22:00', closed: false };
                  return (
                    <div key={day} className="border-b border-brand-border pb-3 last:pb-0 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-brand-text">{day}</span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={!hours.closed}
                          aria-label={`${day} open`}
                          onClick={() =>
                            setSettings({
                              ...settings,
                              openingHours: {
                                ...settings.openingHours,
                                [day]: { ...hours, closed: !hours.closed },
                              },
                            })
                          }
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent ${
                            hours.closed ? 'bg-brand-border' : 'bg-brand-accent'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              hours.closed ? 'translate-x-0' : 'translate-x-5'
                            }`}
                          />
                        </button>
                      </div>
                      {!hours.closed && (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div>
                            <Label htmlFor={`${day}-open`} className="sr-only">
                              {day} opening time
                            </Label>
                            <Input
                              id={`${day}-open`}
                              type="time"
                              value={hours.open}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  openingHours: {
                                    ...settings.openingHours,
                                    [day]: { ...hours, open: e.target.value },
                                  },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${day}-close`} className="sr-only">
                              {day} closing time
                            </Label>
                            <Input
                              id={`${day}-close`}
                              type="time"
                              value={hours.close}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  openingHours: {
                                    ...settings.openingHours,
                                    [day]: { ...hours, close: e.target.value },
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <Toggle
                  label="Allow Self-Registration"
                  description="New members can create an account on the public website"
                  checked={settings.membershipSettings.allowSelfRegistration}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      membershipSettings: {
                        ...settings.membershipSettings,
                        allowSelfRegistration: value,
                      },
                    })
                  }
                />
                <Toggle
                  label="Require Admin Approval"
                  description="New members must be approved before they can check in"
                  checked={settings.membershipSettings.requireApproval}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      membershipSettings: {
                        ...settings.membershipSettings,
                        requireApproval: value,
                      },
                    })
                  }
                />
                <div>
                  <Label htmlFor="defaultPlanId">Default Plan for New Members</Label>
                  <Select
                    id="defaultPlanId"
                    value={settings.membershipSettings.defaultPlanId || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        membershipSettings: {
                          ...settings.membershipSettings,
                          defaultPlanId: e.target.value || null,
                        },
                      })
                    }
                  >
                    <option value="">None</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({formatCurrency(plan.price)} / {plan.durationDays} days)
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gracePeriodDays">Grace Period (Days)</Label>
                  <Input
                    id="gracePeriodDays"
                    type="number"
                    min={0}
                    max={365}
                    value={settings.membershipSettings.gracePeriodDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        membershipSettings: {
                          ...settings.membershipSettings,
                          gracePeriodDays: parseInt(e.target.value, 10) || 0,
                        },
                      })
                    }
                  />
                  <p className="text-xs text-brand-textMuted mt-1">
                    Days after expiry before a membership is considered inactive
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label htmlFor="maxVisitsPerDay">Max Visits Per Day</Label>
                  <Select
                    id="maxVisitsPerDay"
                    value={String(settings.attendanceSettings.maxVisitsPerDay)}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        attendanceSettings: {
                          ...settings.attendanceSettings,
                          maxVisitsPerDay: parseInt(e.target.value, 10),
                        },
                      })
                    }
                  >
                    <option value="1">1 Visit Per Day</option>
                    <option value="2">2 Visits Per Day</option>
                    <option value="3">3 Visits Per Day</option>
                  </Select>
                </div>
                <Toggle
                  label="Allow Manual Corrections"
                  description="Admins can add attendance corrections with a reason and audit record"
                  checked={settings.attendanceSettings.allowManualCorrection}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      attendanceSettings: {
                        ...settings.attendanceSettings,
                        allowManualCorrection: value,
                      },
                    })
                  }
                />
                <Toggle
                  label="Require Exit Confirmation"
                  description="Members must explicitly confirm when leaving the gym"
                  checked={settings.attendanceSettings.requireExitConfirmation}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      attendanceSettings: {
                        ...settings.attendanceSettings,
                        requireExitConfirmation: value,
                      },
                    })
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}