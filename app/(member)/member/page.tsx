'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Dumbbell, CalendarCheck, Clock, TrendingUp, Flame, Trophy, User, CreditCard, Megaphone, ArrowRight, CheckCircle, XCircle, DoorOpen, DoorClosed, AlertCircle, Loader2 } from 'lucide-react';
import { formatDate, formatTime, formatDuration } from '@/lib/utils';
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
  plan: { name: string; price: number; durationDays: number } | null;
  visits: { id: string; entryTimestamp: string; exitTimestamp: string | null; durationSeconds: number | null; status: string; gymLocalDate: string }[];
  recentEvents: { id: string; type: string; timestamp: string; time: string; date: string }[];
}

interface AttendanceStatus {
  isInside: boolean;
  currentVisit: { entryTimestamp: string; visitId: string } | null;
  todayEvents: { type: string; timestamp: string }[];
  completedToday: boolean;
  lastEntry: string | null;
  lastExit: string | null;
}

export default function MemberDashboardPage() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  
  useEffect(() => {
    fetchMemberData();
    fetchAttendanceStatus();
  }, []);
  
  const fetchMemberData = async () => {
    try {
      const res = await fetch('/api/members/me');
      if (res.ok) {
        const data = await res.json();
        setMember(data);
      } else if (res.status === 401) {
        window.location.href = '/login?callbackUrl=/member';
      }
    } catch {
      toast.error('Failed to load member data');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAttendanceStatus = async () => {
    try {
      const res = await fetch('/api/attendance/status');
      if (res.ok) {
        setAttendanceStatus(await res.json());
      }
    } catch {}
  };
  
  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await fetch('/api/attendance/check-in', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchMemberData();
        fetchAttendanceStatus();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Failed to check in');
    } finally {
      setCheckingIn(false);
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
  
  if (!member) return null;
  
  const isInside = attendanceStatus?.isInside || false;
  const completedToday = attendanceStatus?.completedToday || false;
  const currentVisit = attendanceStatus?.currentVisit;
  const totalVisits = member.visits?.filter(v => v.status === 'COMPLETED').length || 0;
  const thisMonthVisits = member.visits?.filter(v => {
    const visitDate = new Date(v.entryTimestamp);
    const now = new Date();
    return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear() && v.status === 'COMPLETED';
  }).length || 0;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'pending': return <Badge variant="warning">Pending Approval</Badge>;
      case 'expired': return <Badge variant="error">Expired</Badge>;
      case 'inactive': return <Badge variant="outline">Inactive</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };
  
  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'rejected': return <Badge variant="error">Rejected</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };
  
  return (
    <MemberLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-text">Welcome back, {member.name.split(' ')[0]}!</h1>
            <p className="text-brand-textMuted mt-1">Here's your fitness overview</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-textMuted">{member.memberCode}</span>
            {getApprovalBadge(member.approvalStatus)}
            {getStatusBadge(member.membershipStatus)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-textMuted">Total Visits</p>
                  <p className="text-3xl font-extrabold text-brand-text mt-1">{totalVisits}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center">
                  <CalendarCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-textMuted">This Month</p>
                  <p className="text-3xl font-extrabold text-brand-text mt-1">{thisMonthVisits}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-successBg text-brand-success flex items-center justify-center">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-textMuted">Current Streak</p>
                  <p className="text-3xl font-extrabold text-brand-text mt-1">{calculateStreak(member.visits)} days</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-warningBg text-brand-warning flex items-center justify-center">
                  <Flame className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-textMuted">Membership</p>
                  <p className="text-3xl font-extrabold text-brand-text mt-1">{member.plan?.name || 'None'}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-infoBg text-brand-info flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Attendance</CardTitle>
              <Link href="/check-in" className="text-sm text-brand-accent hover:text-brand-accentHover flex items-center gap-1">
                Check In
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center py-6">
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${isInside ? 'bg-brand-successBg' : completedToday ? 'bg-brand-warningBg' : 'bg-brand-accentBg'}`}>
                  {isInside ? <DoorOpen className="h-12 w-12 text-brand-success" /> : completedToday ? <CheckCircle className="h-12 w-12 text-brand-warning" /> : <DoorClosed className="h-12 w-12 text-brand-accent" />}
                </div>
                <div className={`text-2xl font-bold ${isInside ? 'text-brand-success' : completedToday ? 'text-brand-warning' : 'text-brand-accent'}`}>
                  {isInside ? 'Checked In' : completedToday ? 'Completed Today' : 'Ready to Train'}
                </div>
                <p className="text-brand-textMuted mt-1">
                  {isInside ? `Inside since ${currentVisit ? formatTime(currentVisit.entryTimestamp) : 'now'}` : completedToday ? 'Come back tomorrow for another session!' : 'Tap below to start your workout'}
                </p>
              </div>
              
              {currentVisit && (
                <div className="p-4 bg-brand-surface border border-brand-border rounded-xl mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-brand-text">Current Session</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-brand-textMuted justify-center">
                    <Clock className="h-4 w-4" />
                    <span>Started: {formatTime(currentVisit.entryTimestamp)}</span>
                  </div>
                </div>
              )}
              
              {!completedToday && (
                <Button 
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="w-full"
                  size="lg"
                  loading={checkingIn}
                  variant={isInside ? 'secondary' : 'primary'}
                >
                  {isInside ? (
                    <>
                      <DoorClosed className="h-5 w-5" />
                      Check Out
                    </>
                  ) : (
                    <>
                      <DoorOpen className="h-5 w-5" />
                      Check In Now
                    </>
                  )}
                </Button>
              )}
              
              {completedToday && (
                <div className="p-4 bg-brand-warningBg/50 border border-brand-warning/30 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-2 text-brand-warning mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Attendance Complete</span>
                  </div>
                  <p className="text-brand-textMuted text-sm">You have already checked in and out today. You can check in again tomorrow.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Membership Info</CardTitle>
              <Link href="/member/membership" className="text-sm text-brand-accent hover:text-brand-accentHover flex items-center gap-1">
                View Details
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text">{member.plan?.name || 'No Active Plan'}</p>
                    <p className="text-sm text-brand-textMuted">₹{member.plan?.price?.toLocaleString() || 0} / {member.plan?.durationDays || 0} days</p>
                  </div>
                </div>
                {member.membershipStartDate && member.membershipEndDate && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-brand-textMuted">Started</p>
                      <p className="font-medium text-brand-text">{formatDate(member.membershipStartDate)}</p>
                    </div>
                    <div>
                      <p className="text-brand-textMuted">Expires</p>
                      <p className="font-medium text-brand-text">{formatDate(member.membershipEndDate)}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Link href="/member/attendance">
                  <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                    <CalendarCheck className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Attendance History</p>
                      <p className="text-sm text-brand-textMuted">View all visits</p>
                    </div>
                  </Button>
                </Link>
                <Link href="/member/workouts">
                  <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                    <Dumbbell className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Workout Plans</p>
                      <p className="text-sm text-brand-textMuted">Your training program</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Visits</CardTitle>
              <Link href="/member/attendance" className="text-sm text-brand-accent hover:text-brand-accentHover flex items-center gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              {member.visits?.length === 0 ? (
                <div className="text-center py-8 text-brand-textDim">
                  <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No visits yet</p>
                  <p className="text-sm">Your first check-in will appear here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {member.visits?.slice(0, 8).map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${visit.status === 'COMPLETED' ? 'bg-brand-successBg text-brand-success' : 'bg-brand-accentBg text-brand-accent'}`}>
                          {visit.status === 'COMPLETED' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-brand-text">{formatDate(visit.entryTimestamp)}</p>
                          <p className="text-sm text-brand-textDim">{formatTime(visit.entryTimestamp)} - {visit.exitTimestamp ? formatTime(visit.exitTimestamp) : 'In progress'}</p>
                        </div>
                      </div>
                      {visit.durationSeconds && (
                        <Badge variant="outline" className="text-xs">{formatDuration(visit.durationSeconds)}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Announcements</CardTitle>
              <Link href="/member/announcements" className="text-sm text-brand-accent hover:text-brand-accentHover flex items-center gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              <AnnouncementsList />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <Link href="/check-in">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <DoorOpen className="h-4 w-4" />
                  {isInside ? 'Check Out' : completedToday ? 'Done for Today' : 'Check In'}
                </Button>
              </Link>
              <Link href="/member/profile">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/member/attendance">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  View Attendance
                </Button>
              </Link>
              <Link href="/member/workouts">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Dumbbell className="h-4 w-4" />
                  My Workouts
                </Button>
              </Link>
              <Link href="/member/membership">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <CreditCard className="h-4 w-4" />
                  Membership Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MemberLayout>
  );
}

function calculateStreak(visits: MemberData['visits']): number {
  if (!visits || visits.length === 0) return 0;
  const completed = visits.filter(v => v.status === 'COMPLETED').sort((a, b) => new Date(b.entryTimestamp).getTime() - new Date(a.entryTimestamp).getTime());
  if (completed.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (const visit of completed) {
    const visitDate = new Date(visit.entryTimestamp);
    visitDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
      today.setDate(today.getDate() - 1);
    } else if (diffDays > streak) {
      break;
    }
  }
  
  return streak;
}

function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/announcements/active')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  
  if (loading) return <div className="h-8 bg-brand-surface rounded animate-pulse" />;
  
  if (announcements.length === 0) {
    return (
      <div className="text-center py-8 text-brand-textDim">
        <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No active announcements</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {announcements.slice(0, 5).map((ann) => (
        <div key={ann.id} className="p-3 bg-brand-surface border border-brand-border rounded-xl">
          <p className="font-medium text-brand-text mb-1">{ann.title}</p>
          <p className="text-sm text-brand-textMuted line-clamp-2">{ann.message}</p>
          <p className="text-xs text-brand-textDim mt-2">Posted {formatDate(ann.publishedAt)}</p>
        </div>
      ))}
    </div>
  );
}