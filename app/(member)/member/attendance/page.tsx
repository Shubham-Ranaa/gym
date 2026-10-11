'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CalendarCheck, Clock, ArrowRight, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { formatDate, formatTime, formatDuration } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Visit {
  id: string;
  entryEventId: string;
  exitEventId: string | null;
  entryTimestamp: string;
  exitTimestamp: string | null;
  durationSeconds: number | null;
  gymLocalDate: string;
  status: 'OPEN' | 'COMPLETED';
}

export default function MemberAttendancePage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchVisits();
  }, []);
  
  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/members/me/attendance');
      if (res.ok) {
        const data = await res.json();
        setVisits(data);
      } else if (res.status === 401) {
        window.location.href = '/login?callbackUrl=/member/attendance';
      }
    } catch {
      toast.error('Failed to load attendance history');
    } finally {
      setLoading(false);
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
  
  const totalVisits = visits.filter(v => v.status === 'COMPLETED').length;
  
  return (
    <MemberLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-text">My Attendance History</h1>
            <p className="text-brand-textMuted">View all your gym check-ins and check-outs</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/check-in">
              <Button variant="outline" className="gap-2">
                <CalendarCheck className="h-4 w-4" />
                Check In / Out
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-brand-text mt-1">{totalVisits}</p>
              <p className="text-sm text-brand-textMuted">Total Visits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-brand-text mt-1">
                {visits.filter(v => v.durationSeconds && v.durationSeconds > 3600).length}
              </p>
              <p className="text-sm text-brand-textMuted">Long Sessions (1h+)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-brand-text mt-1">
                {visits.filter(v => v.status === 'OPEN').length}
              </p>
              <p className="text-sm text-brand-textMuted">Incomplete Visits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-brand-text mt-1">
                {visits.filter(v => v.gymLocalDate === new Date().toISOString().split('T')[0]).length}
              </p>
              <p className="text-sm text-brand-textMuted">Visits Today</p>
            </CardContent>
          </Card>
        </div>
        
        {visits.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-brand-textDim">
              <CalendarCheck className="h-16 w-16 mx-auto mb-4" />
              <p>No attendance records found</p>
              <p className="text-sm mt-2">Your first check-in will appear here after you visit the gym</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-4">
                {visits
                  .sort((a, b) => new Date(b.entryTimestamp).getTime() - new Date(a.entryTimestamp).getTime())
                  .map((visit) => (
                    <div
                      key={visit.id}
                      className="border-b border-brand-border pb-4 last:pb-0 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              visit.status === 'COMPLETED'
                                ? 'bg-brand-successBg text-brand-success'
                                : 'bg-brand-accentBg text-brand-accent'
                            }`}
                          >
                            {visit.status === 'COMPLETED' ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <Clock className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-brand-text">{formatDate(visit.entryTimestamp)}</p>
                            <p className="text-sm text-brand-textMuted">
                              {formatTime(visit.entryTimestamp)} -{' '}
                              {visit.exitTimestamp ? formatTime(visit.exitTimestamp) : 'In progress'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {visit.durationSeconds && (
                            <Badge variant="outline" className="text-xs">
                              {formatDuration(visit.durationSeconds)}
                            </Badge>
                          )}
                          {visit.status === 'OPEN' && (
                            <Badge variant="warning" className="text-xs">
                              Incomplete
                            </Badge>
                          )}
                        </div>
                      </div>
                      {visit.status === 'OPEN' && (
                        <div className="mt-2 flex items-center gap-2 text-brand-warning">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">
                            This visit has not been closed yet. Please check out when you leave.
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MemberLayout>
  );
}