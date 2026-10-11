'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dumbbell, LogIn, User, Clock, CheckCircle, XCircle, AlertCircle, Loader2, ArrowRight, DoorOpen, DoorClosed } from 'lucide-react';
import toast from 'react-hot-toast';

interface AttendanceStatus {
  isInside: boolean;
  currentVisit: { entryTimestamp: string; visitId: string } | null;
  todayEvents: { type: string; timestamp: string }[];
  completedToday: boolean;
  lastEntry: string | null;
  lastExit: string | null;
}

interface CheckInResult {
  success: boolean;
  message: string;
  errorCode?: string;
  event?: { timestamp: string };
  visit?: { durationSeconds: number };
}

export default function CheckInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/member';
  
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [memberName, setMemberName] = useState('');
  
  useEffect(() => {
    fetchStatus();
  }, []);
  
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/attendance/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        if (data.currentVisit) {
          setMemberName(data.currentVisit.entryTimestamp ? 'Member' : '');
        }
      } else if (res.status === 401) {
        router.push(`/login?callbackUrl=/check-in`);
      }
    } catch {
      toast.error('Failed to load attendance status');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckIn = async () => {
    setSubmitting(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data: CheckInResult = await res.json();
      setResult(data);
      
      if (data.success) {
        toast.success(data.message);
        fetchStatus();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
      setResult({ success: false, message: 'Network error. Please try again.', errorCode: 'NETWORK_ERROR' });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <Navbar />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-brand-accent animate-spin" />
          <p className="text-brand-textMuted">Loading attendance status...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  const isInside = status?.isInside || false;
  const completedToday = status?.completedToday || false;
  const currentVisit = status?.currentVisit;
  const lastEntry = status?.lastEntry;
  const lastExit = status?.lastExit;
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16 flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Dumbbell className="h-10 w-10 text-brand-accent" />
              <span className="text-2xl font-bold text-brand-text">FitForge</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-brand-text mb-2">Gym Check-In</h1>
            <p className="text-brand-textMuted">Scan, confirm, train. Simple as that.</p>
          </div>
          
          {result && (
            <Card className="mb-6" style={{ borderColor: result.success ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)' }}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${result.success ? 'bg-brand-successBg text-brand-success' : 'bg-brand-errorBg text-brand-error'}`}>
                    {result.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${result.success ? 'text-brand-success' : 'text-brand-error'}`}>
                      {result.success ? 'Success!' : 'Unable to Check In'}
                    </p>
                    <p className="text-brand-textMuted text-sm mt-1">{result.message}</p>
                    {result.visit?.durationSeconds && (
                      <p className="text-brand-accent text-sm font-medium mt-2">
                        Visit duration: {Math.floor(result.visit.durationSeconds / 60)}m {result.visit.durationSeconds % 60}s
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>How This QR Code Works</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-3 bg-brand-surface border border-brand-border rounded-xl text-center">
                  <div className="text-xs text-brand-textDim mb-1">1st scan</div>
                  <div className="font-medium text-brand-success text-sm">Check In</div>
                </div>
                <div className="p-3 bg-brand-surface border border-brand-border rounded-xl text-center">
                  <div className="text-xs text-brand-textDim mb-1">2nd scan</div>
                  <div className="font-medium text-brand-warning text-sm">Check Out</div>
                </div>
                <div className="p-3 bg-brand-surface border border-brand-border rounded-xl text-center">
                  <div className="text-xs text-brand-textDim mb-1">3rd scan</div>
                  <div className="font-medium text-brand-error text-sm">Invalid</div>
                </div>
              </div>
              <p className="text-sm text-brand-textMuted">
                One QR code at the gym entrance for everyone. The server decides what each
                scan does from your attendance record: the first scan records your entry, the
                second records your exit, and further scans the same day are rejected.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              <div className="text-center py-4">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${isInside ? 'bg-brand-successBg' : completedToday ? 'bg-brand-warningBg' : 'bg-brand-accentBg'}`}>
                  {isInside ? (
                    <DoorOpen className="h-10 w-10 text-brand-success" />
                  ) : completedToday ? (
                    <CheckCircle className="h-10 w-10 text-brand-warning" />
                  ) : (
                    <DoorClosed className="h-10 w-10 text-brand-accent" />
                  )}
                </div>
                <div className={`text-2xl font-bold ${isInside ? 'text-brand-success' : completedToday ? 'text-brand-warning' : 'text-brand-accent'}`}>
                  {isInside ? 'Checked In' : completedToday ? 'Completed Today' : 'Ready to Check In'}
                </div>
                <p className="text-brand-textMuted mt-1">
                  {isInside ? `Inside since ${lastEntry ? new Date(lastEntry).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'now'}` : completedToday ? 'You\'ve completed your visit for today' : 'Tap the button below to start your workout'}
                </p>
              </div>
              
              {currentVisit && (
                <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-brand-text">Current Visit</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-brand-textMuted">
                    <Clock className="h-4 w-4" />
                    <span>Entry: {new Date(currentVisit.entryTimestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              )}
              
              {(lastEntry || lastExit) && (
                <div className="grid grid-cols-2 gap-4">
                  {lastEntry && (
                    <div className="p-4 bg-brand-surface border border-brand-border rounded-xl text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-brand-textMuted mb-1">
                        <DoorOpen className="h-4 w-4" />
                        <span>Last Entry</span>
                      </div>
                      <div className="font-medium text-brand-text">{new Date(lastEntry).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-xs text-brand-textDim">{new Date(lastEntry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                    </div>
                  )}
                  {lastExit && (
                    <div className="p-4 bg-brand-surface border border-brand-border rounded-xl text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-brand-textMuted mb-1">
                        <DoorClosed className="h-4 w-4" />
                        <span>Last Exit</span>
                      </div>
                      <div className="font-medium text-brand-text">{new Date(lastExit).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-xs text-brand-textDim">{new Date(lastExit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                    </div>
                  )}
                </div>
              )}
              
              {completedToday && (
                <div className="p-4 bg-brand-warningBg/50 border border-brand-warning/30 rounded-xl">
                  <div className="flex items-center gap-2 text-brand-warning mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Attendance Complete</span>
                  </div>
                  <p className="text-brand-textMuted text-sm">You have already checked in and out today. You can check in again tomorrow.</p>
                </div>
              )}
              
              {/* The server decides ENTRY vs EXIT from the member's current
                  server-side state, so the button stays enabled while inside. */}
              {!completedToday && (
                <Button
                  onClick={handleCheckIn}
                  disabled={submitting}
                  className="w-full"
                  size="lg"
                  loading={submitting}
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
                      Check In
                    </>
                  )}
                </Button>
              )}
              
              <div className="pt-4 border-t border-brand-border">
                <Link href={callbackUrl} className="flex items-center justify-center gap-2 text-brand-accent hover:text-brand-accentHover font-medium text-sm">
                  <ArrowRight className="h-4 w-4" />
                  Go to Member Dashboard
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center text-brand-textDim text-xs mt-6">
            Demo mode: This records attendance to the shared JSON database. 
            <br />Admin can view all check-ins at <code className="text-brand-textMuted">/admin/attendance</code>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}