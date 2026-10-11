'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { UserPlus, ArrowLeft, Save, Loader2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
}

export default function AdminNewMemberPage() {
  const router = useRouter();
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    approvalStatus: 'approved',
    membershipStatus: 'active',
    membershipPlanId: '',
    membershipStartDate: '',
    membershipEndDate: '',
  });
  
  useEffect(() => {
    fetch('/api/plans')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPlans(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);
  
  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    else if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Invalid email address';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    else if (!/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/.test(form.phone)) next.phone = 'Invalid phone number';
    if (form.password && form.password.length < 8) next.password = 'Password must be at least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        approvalStatus: form.approvalStatus,
        membershipStatus: form.membershipStatus,
      };
      if (form.password) payload.password = form.password;
      if (form.membershipPlanId) payload.membershipPlanId = form.membershipPlanId;
      if (form.membershipStartDate) payload.membershipStartDate = form.membershipStartDate;
      if (form.membershipEndDate) payload.membershipEndDate = form.membershipEndDate;
      
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        toast.success('Member created successfully');
        router.push('/admin/members');
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to create member');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/members">
            <Button variant="ghost" size="icon" aria-label="Back to members">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-text">Add New Member</h1>
            <p className="text-brand-textMuted">Create a gym member account</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label htmlFor="name" required>Full Name</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textDim" />
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: '' }); }}
                      className="pl-12"
                      placeholder="John Doe"
                      error={errors.name}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" required>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: '' }); }}
                    placeholder="john@example.com"
                    error={errors.email}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" required>Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: '' }); }}
                    placeholder="+1 (555) 123-4567"
                    error={errors.phone}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password (optional)</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textDim" />
                    <Input
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); if (errors.password) setErrors({ ...errors, password: '' }); }}
                      className="pl-12"
                      placeholder="Defaults to member123"
                      error={errors.password}
                    />
                  </div>
                  <p className="text-xs text-brand-textMuted mt-1">
                    Leave blank to use the default demo password.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Membership</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="approvalStatus">Approval Status</Label>
                    <Select
                      id="approvalStatus"
                      value={form.approvalStatus}
                      onChange={(e) => setForm({ ...form, approvalStatus: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="membershipStatus">Membership Status</Label>
                    <Select
                      id="membershipStatus"
                      value={form.membershipStatus}
                      onChange={(e) => setForm({ ...form, membershipStatus: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="membershipPlanId">Assign Plan</Label>
                  <Select
                    id="membershipPlanId"
                    value={form.membershipPlanId}
                    onChange={(e) => setForm({ ...form, membershipPlanId: e.target.value })}
                  >
                    <option value="">No plan</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ₹{p.price.toLocaleString()} / {p.durationDays} days
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.membershipStartDate}
                      onChange={(e) => setForm({ ...form, membershipStartDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Expiry Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={form.membershipEndDate}
                      onChange={(e) => setForm({ ...form, membershipEndDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Creating...' : 'Create Member'}
              </Button>
              <Link href="/admin/members">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}