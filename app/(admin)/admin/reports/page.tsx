'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { BarChart3, Download, Users, CalendarCheck, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { getLastNGymDays } from '@/lib/date';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ReportsData {
  memberCount: number;
  activeMembers: number;
  expiredMembers: number;
  visitCount: number;
  completedVisits: number;
  enquiryCount: number;
  newEnquiries: number;
  last7Days: { date: string; entries: number; exits: number }[];
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function load() {
      try {
        const [membersRes, visitsRes, eventsRes, enquiriesRes] = await Promise.all([
          fetch('/api/members?limit=1000'),
          fetch('/api/attendance/visits'),
          fetch('/api/attendance/events'),
          fetch('/api/enquiries'),
        ]);
        
        const members = membersRes.ok ? (await membersRes.json()).data : [];
        const visits = visitsRes.ok ? await visitsRes.json() : [];
        const events = eventsRes.ok ? await eventsRes.json() : [];
        const enquiries = enquiriesRes.ok ? await enquiriesRes.json() : [];
        
        const last7 = getLastNGymDays(7).map((date) => {
          const dayEvents = events.filter((e: { gymLocalDate: string }) => e.gymLocalDate === date);
          return {
            date,
            entries: dayEvents.filter((e: { type: string }) => e.type === 'ENTRY').length,
            exits: dayEvents.filter((e: { type: string }) => e.type === 'EXIT').length,
          };
        });
        
        setData({
          memberCount: members.length,
          activeMembers: members.filter(
            (m: { approvalStatus: string; membershipStatus: string }) =>
              m.approvalStatus === 'approved' && m.membershipStatus === 'active'
          ).length,
          expiredMembers: members.filter(
            (m: { membershipStatus: string }) => m.membershipStatus === 'expired'
          ).length,
          visitCount: visits.length,
          completedVisits: visits.filter((v: { status: string }) => v.status === 'COMPLETED').length,
          enquiryCount: enquiries.length,
          newEnquiries: enquiries.filter((e: { status: string }) => e.status === 'new').length,
          last7Days: last7,
        });
      } catch {
        toast.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  
  const exportCsv = (type: string) => {
    window.location.href = `/api/reports?type=${type}`;
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
  
  const maxActivity = Math.max(
    1,
    ...(data?.last7Days.map((d) => Math.max(d.entries, d.exits)) || [1])
  );
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-brand-text">Reports</h1>
          <p className="text-brand-textMuted">Attendance, membership and enquiry analytics</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-textMuted">Total Members</p>
                  <p className="text-3xl font-extrabold text-brand-text mt-1">{data?.memberCount || 0}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-brand-textMuted mt-2">
                {data?.activeMembers || 0} active, {data?.expiredMembers || 0} expired
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-textMuted">Total Visits</p>
                  <p className="text-3xl font-extrabold text-brand-text mt-1">{data?.visitCount || 0}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-brand-successBg text-brand-success flex items-center justify-center">
                  <CalendarCheck className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-brand-textMuted mt-2">{data?.completedVisits || 0} completed visits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-textMuted">Enquiries</p>
                  <p className="text-3xl font-extrabold text-brand-text mt-1">{data?.enquiryCount || 0}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-brand-infoBg text-brand-info flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-brand-textMuted mt-2">{data?.newEnquiries || 0} awaiting response</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-textMuted">Exports</p>
                  <p className="text-3xl font-extrabold text-brand-text mt-1">4</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-brand-warningBg text-brand-warning flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-brand-textMuted mt-2">Available CSV downloads</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-accent" />
              Attendance - Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {data?.last7Days.map((day) => (
              <div key={day.date} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-textMuted">{formatDate(day.date)}</span>
                  <span className="text-brand-text">
                    {day.entries} in / {day.exits} out
                  </span>
                </div>
                <div className="flex gap-1 h-2">
                  <div
                    className="bg-brand-accent rounded-full"
                    style={{ width: `${(day.entries / maxActivity) * 100}%` }}
                  />
                  <div
                    className="bg-brand-warning rounded-full opacity-70"
                    style={{ width: `${(day.exits / maxActivity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Download Reports</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" onClick={() => exportCsv('attendance')} className="gap-2">
                <Download className="h-4 w-4" />
                Attendance Events
              </Button>
              <Button variant="outline" onClick={() => exportCsv('summary')} className="gap-2">
                <Download className="h-4 w-4" />
                7-Day Summary
              </Button>
              <Button variant="outline" onClick={() => exportCsv('visits')} className="gap-2">
                <Download className="h-4 w-4" />
                All Visits
              </Button>
              <Button variant="outline" onClick={() => exportCsv('members')} className="gap-2">
                <Download className="h-4 w-4" />
                Members
              </Button>
              <Button variant="outline" onClick={() => exportCsv('enquiries')} className="gap-2">
                <Download className="h-4 w-4" />
                Enquiries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}