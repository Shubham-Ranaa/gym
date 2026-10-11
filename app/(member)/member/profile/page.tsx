'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Input';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Clock, CreditCard, Settings, AlertCircle, CheckCircle, Loader2, CalendarCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface MemberData {
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
  updatedAt: string;
}

export default function MemberProfilePage() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchMember();
  }, []);
  
  const fetchMember = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/members/me');
      if (res.ok) {
        const data = await res.json();
        setMember(data);
      } else if (res.status === 401) {
        window.location.href = '/login?callbackUrl=/member/profile';
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: member.name,
          email: member.email,
          phone: member.phone,
          // Note: approvalStatus, membershipStatus, membershipPlanId, etc. cannot be edited by members
        }),
      });
      if (res.ok) {
        toast.success('Profile updated successfully');
        setEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-brand-accent animate-spin" />
        </div>
      </MemberLayout>
    );
  }
  
  if (!member) {
    return (
      <MemberLayout>
        <div className="text-center py-20 text-brand-textDim">
          <AlertCircle className="h-16 w-16 mx-auto mb-4" />
          <p>Unable to load profile</p>
        </div>
      </MemberLayout>
    );
  }
  
  return (
    <MemberLayout>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-text">My Profile</h1>
            <p className="text-brand-textMuted">View and update your personal information</p>
          </div>
          <div className="flex-sm flex-col sm:flex-row gap-3">
            {!editing && (
              <Button onClick={() => setEditing(true)} className="gap-2">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
            {editing && (
              <>
                <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button onClick={() => setEditing(false)} variant="outline" className="w-full sm:w-auto ml-3">
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
        
        {editing ? (
          <Card>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={member.name}
                    onChange={(e) => setMember(m => ({ ...m!, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={member.email}
                    onChange={(e) => setMember(m => ({ ...m!, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={member.phone}
                    onChange={(e) => setMember(m => ({ ...m!, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">{member.name}</p>
                      <p className="text-sm text-brand-textMuted">{member.memberCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">{member.email}</p>
                      <p className="text-sm text-brand-textMuted">Primary Email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">{member.phone}</p>
                      <p className="text-sm text-brand-textMuted">Primary Phone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">Member Since</p>
                      <p className="text-sm text-brand-textMuted">{new Date(member.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Membership Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">{member.membershipStatus === 'active' ? 'Active' : member.membershipStatus}</p>
                      <p className="text-sm text-brand-textMuted">{member.approvalStatus === 'approved' ? 'Approved' : member.approvalStatus}</p>
                    </div>
                  </div>
                  {member.membershipPlanId && (
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-brand-accent flex-shrink-0" />
                      <div>
                        <p className="font-medium text-brand-text">Assigned Plan</p>
                        <p className="text-sm text-brand-textMuted">Plan ID: {member.membershipPlanId}</p>
                      </div>
                    </div>
                  )}
                  {member.membershipStartDate && member.membershipEndDate && (
                    <div className="flex items-center gap-3">
                      <CalendarCheck className="h-5 w-5 text-brand-accent flex-shrink-0" />
                      <div>
                        <p className="font-medium text-brand-text">Membership Period</p>
                        <p className="text-sm text-brand-textMuted">
                          {new Date(member.membershipStartDate).toLocaleDateString()} - 
                          {new Date(member.membershipEndDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </form>
    </MemberLayout>
  );
}