'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Users, CalendarCheck, TrendingUp, AlertCircle, Clock, Dumbbell, MessageSquare, Megaphone, BarChart3, Settings, ArrowRight, UserPlus, CheckCircle, XCircle, DoorOpen, DoorClosed, Download, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  pendingApprovals: number;
  currentlyInside: number;
  entriesToday: number;
  exitsToday: number;
  expiredMemberships: number;
  pendingEnquiries: number;
}

interface RecentActivity {
  id: string;
  memberName: string;
  memberCode: string;
  type: 'ENTRY' | 'EXIT';
  timestamp: string;
}

interface CurrentlyInside {
  id: string;
  memberName: string;
  memberCode: string;
  entryTime: string;
  duration: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [currentlyInside, setCurrentlyInside] = useState<CurrentlyInside[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes, insideRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/attendance/recent'),
        fetch('/api/admin/attendance/currently-inside'),
      ]);
      
      if (statsRes.ok) setStats(await statsRes.json());
      if (activityRes.ok) setRecentActivity(await activityRes.json());
      if (insideRes.ok) setCurrentlyInside(await insideRes.json());
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-brand-textMuted">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  const quickActions = [
    { label: 'Add New Member', icon: UserPlus, href: '/admin/members/new' },
    { label: 'Manage Plans', icon: Dumbbell, href: '/admin/plans' },
    { label: 'Create Announcement', icon: Megaphone, href: '/admin/announcements' },
    { label: 'Generate Reports', icon: BarChart3, href: '/admin/reports' },
    { label: 'Gym QR Code', icon: QrCode, href: '/gym-qr' },
  ];
  
  const statCards = [
    { label: 'Total Members', value: stats?.totalMembers || 0, icon: Users, color: 'text-brand-accent', bg: 'bg-brand-accentBg', href: '/admin/members' },
    { label: 'Active Members', value: stats?.activeMembers || 0, icon: CheckCircle, color: 'text-brand-success', bg: 'bg-brand-successBg', href: '/admin/members?status=active' },
    { label: 'Pending Approvals', value: stats?.pendingApprovals || 0, icon: AlertCircle, color: 'text-brand-warning', bg: 'bg-brand-warningBg', href: '/admin/members?status=pending' },
    { label: 'Currently Inside', value: stats?.currentlyInside || 0, icon: DoorOpen, color: 'text-brand-accent', bg: 'bg-brand-accentBg', href: '/admin/attendance' },
    { label: 'Entries Today', value: stats?.entriesToday || 0, icon: TrendingUp, color: 'text-brand-success', bg: 'bg-brand-successBg', href: '/admin/attendance' },
    { label: 'Exits Today', value: stats?.exitsToday || 0, icon: DoorClosed, color: 'text-brand-textMuted', bg: 'bg-brand-border', href: '/admin/attendance' },
    { label: 'Expired Memberships', value: stats?.expiredMemberships || 0, icon: XCircle, color: 'text-brand-error', bg: 'bg-brand-errorBg', href: '/admin/members?status=expired' },
    { label: 'Pending Enquiries', value: stats?.pendingEnquiries || 0, icon: MessageSquare, color: 'text-brand-info', bg: 'bg-brand-infoBg', href: '/admin/enquiries' },
  ];
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-text">Dashboard</h1>
            <p className="text-brand-textMuted mt-1">Overview of gym operations</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/gym-qr">
              <Button className="gap-2">
                <QrCode className="h-4 w-4" />
                Gym QR Code
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8 gap-3 sm:gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href} className="card-hover block">
                <Card className="h-full">
                  <CardContent className="p-4 sm:p-6 h-full flex flex-col gap-3">
                    <div className={`${stat.bg} ${stat.color} p-2 rounded-lg w-fit`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-brand-textMuted">{stat.label}</p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-brand-text mt-1">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Currently Inside</CardTitle>
              <Link href="/admin/attendance" className="text-sm text-brand-accent hover:text-brand-accentHover flex items-center gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              {currentlyInside.length === 0 ? (
                <div className="text-center py-8 text-brand-textDim">
                  <DoorOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No members currently inside</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {currentlyInside.slice(0, 10).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center font-bold text-sm">
                          {member.memberCode.slice(-2)}
                        </div>
                        <div>
                          <p className="font-medium text-brand-text">{member.memberName}</p>
                          <p className="text-sm text-brand-textDim">{member.memberCode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-brand-text">{member.entryTime}</p>
                        <p className="text-sm text-brand-textMuted">{member.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Link href="/admin/attendance" className="text-sm text-brand-accent hover:text-brand-accentHover flex items-center gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-brand-textDim">
                  <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentActivity.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'ENTRY' ? 'bg-brand-successBg text-brand-success' : 'bg-brand-warningBg text-brand-warning'}`}>
                          {activity.type === 'ENTRY' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-brand-text">{activity.memberName}</p>
                          <p className="text-sm text-brand-textDim">{activity.memberCode} • {formatDate(activity.timestamp)} at {formatTime(activity.timestamp)}</p>
                        </div>
                      </div>
                      <Badge variant={activity.type === 'ENTRY' ? 'success' : 'warning'}>{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          <Card hover className="h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href}>
                    <Button variant="outline" className="w-full justify-start gap-2.5 group">
                      <span className="w-7 h-7 rounded-lg bg-brand-accentBg text-brand-accent flex items-center justify-center group-hover:bg-brand-accent group-hover:text-brand-bg transition-colors flex-shrink-0">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{action.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-successBg text-brand-success flex items-center justify-center">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-text">JSON Storage</p>
                    <p className="text-sm text-brand-textDim">Operational (demo mode)</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-accentBg text-brand-accent flex items-center justify-center">
                    <Settings className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-text">Authentication</p>
                    <p className="text-sm text-brand-textDim">JWT + HTTP-only cookies</p>
                  </div>
                </div>
                <Badge variant="info">Secured</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-warningBg text-brand-warning flex items-center justify-center">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-text">Data Persistence</p>
                    <p className="text-sm text-brand-textDim">Ephemeral on Render (demo)</p>
                  </div>
                </div>
                <Badge variant="warning">Temporary</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card hover className="h-full">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-brand-surface border border-brand-border rounded-xl text-center">
                  <p className="text-2xl font-extrabold text-brand-accent">{stats?.totalMembers || 0}</p>
                  <p className="text-sm text-brand-textMuted">Total Members</p>
                </div>
                <div className="p-4 bg-brand-surface border border-brand-border rounded-xl text-center">
                  <p className="text-2xl font-extrabold text-brand-success">{stats?.activeMembers || 0}</p>
                  <p className="text-sm text-brand-textMuted">Active</p>
                </div>
                <div className="p-4 bg-brand-surface border border-brand-border rounded-xl text-center">
                  <p className="text-2xl font-extrabold text-brand-warning">{stats?.pendingApprovals || 0}</p>
                  <p className="text-sm text-brand-textMuted">Pending</p>
                </div>
                <div className="p-4 bg-brand-surface border border-brand-border rounded-xl text-center">
                  <p className="text-2xl font-extrabold text-brand-error">{stats?.expiredMemberships || 0}</p>
                  <p className="text-sm text-brand-textMuted">Expired</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
