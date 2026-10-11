'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useState, useEffect } from 'react';
import { CalendarCheck, CheckCircle, XCircle, Download, RefreshCw, Loader2, DoorOpen } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AttendanceEvent {
  id: string;
  visitId: string;
  memberId: string;
  type: 'ENTRY' | 'EXIT';
  timestamp: string;
  gymLocalDate: string;
}

interface Member {
  id: string;
  memberCode: string;
  name: string;
}

export default function AdminAttendancePage() {
  const [events, setEvents] = useState<AttendanceEvent[]>([]);
  const [membersMap, setMembersMap] = useState<Map<string, Member>>(new Map());
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  useEffect(() => {
    fetchData();
  }, [dateFilter, typeFilter]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, membersRes] = await Promise.all([
        fetch('/api/attendance/events'),
        fetch('/api/members'),
      ]);
      
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (membersRes.ok) {
        const members: Member[] = await membersRes.json();
        setMembersMap(new Map(members.map((m) => [m.id, m])));
      }
    } catch {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };
  
  const today = new Date().toISOString().split('T')[0];
  
  const filteredEvents = events.filter((e) => {
    const matchesDate = !dateFilter || e.timestamp.startsWith(dateFilter);
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    return matchesDate && matchesType;
  });
  
  const todayEvents = filteredEvents.filter((e) => e.gymLocalDate === today);
  const entriesToday = todayEvents.filter((e) => e.type === 'ENTRY').length;
  const exitsToday = todayEvents.filter((e) => e.type === 'EXIT').length;
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-brand-accent animate-spin" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-text">Attendance Records</h1>
            <p className="text-brand-textMuted">View all member check-ins and check-outs</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={fetchData} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => toast('CSV export coming soon')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="p-4 text-center">
              <p className="text-3xl font-extrabold text-brand-success mt-1">{entriesToday}</p>
              <p className="text-sm text-brand-textMuted">Check-Ins Today</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-3xl font-extrabold text-brand-textMuted mt-1">{exitsToday}</p>
              <p className="text-sm text-brand-textMuted">Check-Outs Today</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-3xl font-extrabold text-brand-accent mt-1">
                {Math.max(entriesToday - exitsToday, 0)}
              </p>
              <p className="text-sm text-brand-textMuted">Net Inside</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-3xl font-extrabold text-brand-text mt-1">{filteredEvents.length}</p>
              <p className="text-sm text-brand-textMuted">Total Events</p>
            </div>
          </Card>
        </div>
        
        <Card>
          <div className="p-4 border-b border-brand-border flex flex-col sm:flex-row gap-3">
            <label className="sr-only" htmlFor="date">
              Filter by date
            </label>
            <input
              id="date"
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
              }}
              className="px-4 py-3 bg-brand-surface border border-brand-border text-brand-text rounded-xl w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-brand-surface border border-brand-border text-brand-text rounded-xl w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
              aria-label="Filter by event type"
            >
              <option value="all">All Type</option>
              <option value="ENTRY">Check-Ins</option>
              <option value="EXIT">Check-Outs</option>
            </select>
          </div>
          
          <div className="p-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-brand-textDim">
                <CalendarCheck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No attendance records found</p>
                {(dateFilter || typeFilter !== 'all') && (
                  <p className="text-sm mt-2">Try adjusting your filters</p>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredEvents
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((event) => {
                    const member = membersMap.get(event.memberId);
                    return (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              event.type === 'ENTRY'
                                ? 'bg-brand-successBg text-brand-success'
                                : 'bg-brand-warningBg text-brand-warning'
                            }`}
                          >
                            {event.type === 'ENTRY' ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-brand-text truncate">
                              {member?.name || 'Unknown Member'}
                            </p>
                            <p className="text-sm text-brand-textMuted">
                              {member?.memberCode || 'N/A'} &bull; {formatDate(event.timestamp)} at{' '}
                              {formatTime(event.timestamp)}
                            </p>
                          </div>
                        </div>
                        <Badge variant={event.type === 'ENTRY' ? 'success' : 'warning'}>
                          {event.type === 'ENTRY' ? 'Entry' : 'Exit'}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}