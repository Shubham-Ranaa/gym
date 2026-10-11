'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import {
  User, Mail, Phone, CreditCard, CalendarCheck, Clock, ArrowLeft,
  CheckCircle, XCircle, Save, Loader2, Dumbbell, Trash2,
} from 'lucide-react';
import { formatDate, formatTime, formatDuration } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  isActive: boolean;
}

interface Visit {
  id: string;
  entryTimestamp: string;
  exitTimestamp: string | null;
  durationSeconds: number | null;
  gymLocalDate: string;
  status: string;
}

interface MemberDetail {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  approvalStatus: string;
  membershipStatus: string;
  membershipPlanId: string | null;
  membershipStartDate: string | null;
  membershipEndDate: string | null;
  createdAt: string;
  plan: Plan | null;
  visits: Visit[];
}

export default function AdminMemberDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    async function load() {
      try {
        const [mRes, pRes] = await Promise.all([
          fetch(`/api/members/${id}`),
          fetch('/api/plans'),
        ]);
        if (mRes.ok) setMember(await mRes.json());
        else toast.error('Member not found');
        if (pRes.ok) setPlans(await pRes.json());
      } catch {
        toast.error('Failed to load member');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);
  
  const validate = () => {
    if (!member) return false;
    const next: Record<string, string> = {};
    if (!member.name.trim()) next.name = 'Name is required';
    else if (member.name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!member.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) next.email = 'Invalid email address';
    if (!member.phone.trim()) next.phone = 'Phone is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member || !validate()) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: member.name,
          email: member.email,
          phone: member.phone,
          approvalStatus: member.approvalStatus,
          membershipStatus: member.membershipStatus,
          membershipPlanId: member.membershipPlanId,
          membershipStartDate: member.membershipStartDate,
          membershipEndDate: member.membershipEndDate,
        }),
      });
      if (res.ok) {
        toast.success('Member updated successfully');
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to update member');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };
  
  const handleApprove = () => setMember(m => m && { ...m, approvalStatus: 'approved' });
  const handleReject = () => setMember(m => m && { ...m, approvalStatus: 'rejected' });
  
  const handleDelete = async () => {
    if (!member || !window.confirm(`Permanently delete ${member.name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/members/${member.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Member deleted');
        router.push('/admin/members');
      } else {
        toast.error('Failed to delete member');
      }
    } catch {
      toast.error('Network error');
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
  
  if (!member) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-brand-textDim">
          <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Member not found</p>
          <Link href="/admin/members" className="link text-sm mt-4 inline-block">Back to members</Link>
        </div>
      </AdminLayout>
    );
  }
  
  const totalVisits = member.visits.filter(v => v.status === 'COMPLETED').length;
  
  return (
    <AdminLayout>
      <form onSubmit={handleSave} noValidate>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/admin/members">
                <Button variant="ghost" size="icon" aria-label="Back to members">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-brand-text">{member.name}</h1>
                  <Badge variant="outline">{member.memberCode}</Badge>
                </div>
                <p className="text-brand-textMuted text-sm mt-1">
                  Member details, membership and attendance
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReject}
                className="text-brand-error"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
          
          {member.approvalStatus === 'pending' && (
            <div className="p-6 bg-brand-warningBg/50 border border-brand-warning/30 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-brand-warning flex-shrink-0" />
                <div>
                  <p className="font-medium text-brand-warning">Membership pending approval</p>
                  <p className="text-sm text-brand-textMuted">
                    This member cannot record attendance until an admin approves them.
                  </p>
                </div>
              </div>
              <Button type="button" onClick={handleApprove} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Approve Member
              </Button>
            </div>
          )}
          
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label htmlFor="name" required>Full Name</Label>
                  <Input
                    id="name"
                    value={member.name}
                    onChange={(e) => { setMember({ ...member, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: '' }); }}
                    error={errors.name}
                  />
                </div>
                <div>
                  <Label htmlFor="email" required>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={member.email}
                    onChange={(e) => { setMember({ ...member, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: '' }); }}
                    error={errors.email}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" required>Phone</Label>
                  <Input
                    id="phone"
                    value={member.phone}
                    onChange={(e) => { setMember({ ...member, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: '' }); }}
                    error={errors.phone}
                  />
                </div>
                <div>
                  <Label htmlFor="code">Member Code</Label>
                  <Input id="code" value={member.memberCode} disabled />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Membership</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label htmlFor="approvalStatus">Approval Status</Label>
                  <Select
                    id="approvalStatus"
                    value={member.approvalStatus}
                    onChange={(e) => setMember({ ...member, approvalStatus: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="membershipStatus">Membership Status</Label>
                  <Select
                    id="membershipStatus"
                    value={member.membershipStatus}
                    onChange={(e) => setMember({ ...member, membershipStatus: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="planId">Assigned Plan</Label>
                  <Select
                    id="planId"
                    value={member.membershipPlanId || ''}
                    onChange={(e) => setMember({ ...member, membershipPlanId: e.target.value || null })}
                  >
                    <option value="">No plan assigned</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ₹{p.price.toLocaleString()} / {p.durationDays} days
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={member.membershipStartDate ? member.membershipStartDate.split('T')[0] : ''}
                    onChange={(e) => setMember({ ...member, membershipStartDate: e.target.value || null })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Expiry Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={member.membershipEndDate ? member.membershipEndDate.split('T')[0] : ''}
                    onChange={(e) => setMember({ ...member, membershipEndDate: e.target.value || null })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-brand-textMuted">Total Visits</p>
                <p className="text-3xl font-extrabold text-brand-text mt-1">{totalVisits}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-brand-textMuted">Joined</p>
                <p className="text-lg font-bold text-brand-text mt-2">{formatDate(member.createdAt)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-brand-textMuted">Current Plan</p>
                <p className="text-lg font-bold text-brand-text mt-2">{member.plan?.name || 'None'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-brand-textMuted">Approval</p>
                <Badge variant={member.approvalStatus === 'approved' ? 'success' : member.approvalStatus === 'pending' ? 'warning' : 'error'} className="mt-2">
                  {member.approvalStatus}
                </Badge>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {member.visits.length === 0 ? (
                <div className="text-center py-12 text-brand-textDim">
                  <CalendarCheck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No attendance records</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {member.visits
                    .slice()
                    .sort((a, b) => b.entryTimestamp.localeCompare(a.entryTimestamp))
                    .map((v) => (
                      <div key={v.id} className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${v.status === 'COMPLETED' ? 'bg-brand-successBg text-brand-success' : 'bg-brand-warningBg text-brand-warning'}`}>
                            {v.status === 'COMPLETED' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-brand-text">{formatDate(v.entryTimestamp)}</p>
                            <p className="text-sm text-brand-textMuted">
                              {formatTime(v.entryTimestamp)} - {v.exitTimestamp ? formatTime(v.exitTimestamp) : 'In progress'}
                            </p>
                          </div>
                        </div>
                        {v.durationSeconds && (
                          <Badge variant="outline" className="text-xs">{formatDuration(v.durationSeconds)}</Badge>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-brand-errorBg/30 border border-brand-error/30 rounded-xl">
                <div>
                  <p className="font-medium text-brand-error">Delete this member</p>
                  <p className="text-sm text-brand-textMuted">
                    Permanently removes the member record. This cannot be undone.
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={handleDelete} className="text-brand-error gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </AdminLayout>
  );
}