'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CreditCard, CalendarCheck, AlertCircle, Loader2, ArrowRight, UserPlus, CheckCircle, XCircle, TrendingUp, DollarSign, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface MembershipData {
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
  plan: {
    id: string;
    name: string;
    price: number;
    durationDays: number;
    benefits: string[];
    isActive: boolean;
  } | null;
}

export default function MemberMembershipPage() {
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMembership();
  }, []);
  
  const fetchMembership = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/members/me/membership');
      if (res.ok) {
        const data = await res.json();
        setMembership(data);
      } else if (res.status === 401) {
        window.location.href = '/login?callbackUrl=/member/membership';
      }
    } catch {
      toast.error('Failed to load membership info');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRenew = async () => {
    if (!membership) return;
    
    try {
      const res = await fetch('/api/members/me/renew', {
        method: 'POST',
      });
      if (res.ok) {
        toast.success('Membership renewal request submitted');
        fetchMembership();
      } else {
        toast.error('Failed to submit renewal request');
      }
    } catch {
      toast.error('Network error');
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
  
  if (!membership) {
    return (
      <MemberLayout>
        <div className="text-center py-20 text-brand-textDim">
          <AlertCircle className="h-16 w-16 mx-auto mb-4" />
          <p>Unable to load membership information</p>
        </div>
      </MemberLayout>
    );
  }
  
  return (
    <MemberLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-text">My Membership</h1>
            <p className="text-brand-textMuted">View your current membership details and status</p>
          </div>
          <div className="flex-sm flex-col sm:flex-row gap-3">
            {membership.membershipStatus === 'active' && (
              <Link href="/member">
                <Button variant="outline" className="gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Back to Dashboard
                </Button>
              </Link>
            )}
            {membership.membershipStatus !== 'active' && (
              <Button onClick={handleRenew} className="w-full sm:w-auto" disabled={membership.approvalStatus !== 'approved'}>
                {membership.approvalStatus !== 'approved' ? 'Awaiting Approval' : 'Request Renewal'}
              </Button>
            )}
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            {membership.approvalStatus !== 'approved' && (
              <div className="p-6 bg-brand-warningBg/50 border border-brand-warning/30 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-brand-warning" />
                  <div>
                    <p className="font-medium text-brand-warning">Membership Status: Pending Approval</p>
                    <p className="text-sm text-brand-textMuted">Your membership is awaiting admin approval. You cannot check in until approved.</p>
                  </div>
                </div>
              </div>
            )}
            
            {membership.membershipStatus === 'expired' && (
              <div className="p-6 bg-brand-errorBg/50 border border-brand-error/30 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-brand-error" />
                  <div>
                    <p className="font-medium text-brand-error">Membership Status: Expired</p>
                    <p className="text-sm text-brand-textMuted">Your membership has expired. Please renew to continue accessing the gym.</p>
                  </div>
                </div>
              </div>
            )}
            
            {membership.membershipStatus === 'inactive' && (
              <div className="p-6 bg-brand-border/50 border border-brand-border/30 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-brand-textMuted" />
                  <div>
                    <p className="font-medium text-brand-textMuted">Membership Status: Inactive</p>
                    <p className="text-sm text-brand-textMuted">Your membership is currently inactive. Please contact the front desk to reactivate.</p>
                  </div>
                </div>
              </div>
            )}
            
            {membership.membershipStatus === 'active' && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">Current Plan</p>
                      <p className="text-sm text-brand-textMuted">{membership.plan?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">Billing Amount</p>
                      <p className="text-sm text-brand-textMuted">{formatCurrency(membership.plan?.price ?? 0)}</p>
                      <p className="text-xs text-brand-textMuted">/{membership.plan?.durationDays ?? 0} days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">Start Date</p>
                      <p className="text-sm text-brand-textMuted">{new Date(membership.membershipStartDate!).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">Expiry Date</p>
                      <p className="text-sm text-brand-textMuted">{new Date(membership.membershipEndDate!).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">Benefits Included</p>
                      <p className="text-xs text-brand-textMuted">{membership.plan?.benefits.length} benefits</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-brand-text mb-3">Plan Benefits</h2>
                  <div className="space-y-2">
                    {membership.plan?.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-brand-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="text-brand-textMuted">{benefit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button onClick={handleRenew} className="w-full" disabled={membership.approvalStatus !== 'approved'}>
                    {membership.approvalStatus !== 'approved' ? (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Awaiting Approval
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Request Renewal
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MemberLayout>
  );
}