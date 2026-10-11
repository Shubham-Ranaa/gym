'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Dumbbell, Clock, CheckCircle, XCircle, AlertCircle, Loader2,
  DoorOpen, DoorClosed, ScanLine, ShieldAlert, RefreshCw, ArrowRight,
} from 'lucide-react';

interface AttendanceStatus {
  isInside: boolean;
  currentVisit: { entryTimestamp: string; gymLocalDate: string } | null;
  todayEvents: { type: string; timestamp: string }[];
  completedToday: boolean;
  lastEntry: string | null;
  lastExit: string | null;
}

interface CheckInResult {
  success: boolean;
  message: string;
  errorCode?: string;
  event?: { type: string; timestamp: string };
  visit?: { status: string; durationSeconds: number | null; entryTimestamp: string };
}

type Phase = 'scanning' | 'entry' | 'exit' | 'rejected' | 'ineligible' | 'error';

const INELIGIBLE: Record<string, string> = {
  MEMBER_NOT_APPROVED: 'Your membership is pending approval. Please contact the front desk.',
  MEMBER_INACTIVE: 'Your membership is not active. Please contact the front desk.',
  MEMBERSHIP_EXPIRED: 'Your membership has expired. Please renew to continue.',
  MEMBERSHIP_INVALID: 'No valid membership plan is assigned. Please contact the front desk.',
};

export default function CheckInPage() {
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [phase, setPhase] = useState<Phase>('scanning');
  const [result, setResult] = useState<CheckInResult | null>(null);
  
  // Guards against the effect firing twice (React StrictMode / fast refresh)
  const submitted = useRef(false);
  const reduce = useReducedMotion();
  
  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;
    runScan();
  }, []);
  
  async function runScan() {
    setPhase('scanning');
    
    try {
      // Load current state first so the UI can greet by name
      const statusRes = await fetch('/api/attendance/status');
      if (statusRes.ok) {
        const data = await statusRes.json();
        setStatus(data);
      }
    } catch {
      // Non-fatal: the POST below is the authoritative action
    }
    
    await submitAttendance();
  }
  
  async function submitAttendance() {
    try {
      const res = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data: CheckInResult = await res.json();
      setResult(data);
      
      if (data.success) {
        const type = data.event?.type || (status?.isInside ? 'EXIT' : 'ENTRY');
        setPhase(type === 'EXIT' ? 'exit' : 'entry');
        // Refresh status so a subsequent scan in the same session is correct
        const refreshed = await fetch('/api/attendance/status');
        if (refreshed.ok) setStatus(await refreshed.json());
        return;
      }
      
      if (data.errorCode && INELIGIBLE[data.errorCode]) {
        setPhase('ineligible');
        return;
      }
      
      setPhase('rejected');
    } catch {
      setPhase('error');
    }
  }
  
  const memberGreeting = status?.isInside ? 'Checked Out' : status?.completedToday ? 'Completed Today' : 'Checked In';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="FitForge Home">
              <Dumbbell className="h-10 w-10 text-brand-accent" />
              <span className="text-2xl font-bold text-brand-text">FitForge</span>
            </Link>
          </div>
          
          <AnimatePresence mode="wait">
            {/* ---------- SCANNING ---------- */}
            {phase === 'scanning' && (
              <motion.div
                key="scanning"
                initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <Card>
                  <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <span className="absolute inset-0 rounded-full border-2 border-brand-accent/20" />
                      {!reduce && (
                        <>
                          <motion.span
                            className="absolute inset-0 rounded-full border-2 border-brand-accent"
                            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                          />
                          <motion.span
                            className="absolute inset-0 rounded-full border-2 border-brand-accent"
                            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                          />
                        </>
                      )}
                      <ScanLine className="h-12 w-12 text-brand-accent" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-extrabold text-brand-text">Scanning</h1>
                      <p className="text-brand-textMuted mt-2">Recording your attendance...</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-brand-textDim">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please stay on this screen
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* ---------- SUCCESS: ENTRY / EXIT ---------- */}
            {(phase === 'entry' || phase === 'exit') && (
              <motion.div
                key={phase === 'entry' ? 'entry' : 'exit'}
                initial={reduce ? undefined : { opacity: 0, scale: 0.9, y: 12 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <Card
                  className={
                    phase === 'entry'
                      ? 'border-brand-success/40 ring-1 ring-brand-success/20'
                      : 'border-brand-accent/40 ring-1 ring-brand-accent/20'
                  }
                >
                  <CardContent className="p-8 flex flex-col items-center text-center gap-5">
                    <motion.div
                      className={`w-24 h-24 rounded-full flex items-center justify-center ${
                        phase === 'entry' ? 'bg-brand-successBg text-brand-success' : 'bg-brand-accentBg text-brand-accent'
                      }`}
                      initial={reduce ? undefined : { scale: 0.4, rotate: -25 }}
                      animate={reduce ? undefined : { scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.08 }}
                    >
                      {phase === 'entry' ? <DoorOpen className="h-12 w-12" /> : <DoorClosed className="h-12 w-12" />}
                    </motion.div>
                    
                    <div>
                      <motion.h1
                        className={`text-3xl font-extrabold tracking-tight ${
                          phase === 'entry' ? 'text-brand-success' : 'text-brand-accent'
                        }`}
                        initial={reduce ? undefined : { opacity: 0, y: 8 }}
                        animate={reduce ? undefined : { opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                      >
                        {memberGreeting}
                      </motion.h1>
                      <p className="text-brand-textMuted mt-2">
                        {phase === 'entry'
                          ? `You are now inside the gym`
                          : `Your visit has been recorded`}
                      </p>
                    </div>
                    
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl text-sm">
                        <span className="text-brand-textMuted">
                          {phase === 'entry' ? 'Entry time' : 'Exit time'}
                        </span>
                        <span className="font-medium text-brand-text">
                          {result?.event?.timestamp
                            ? new Date(result.event.timestamp).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                            : '--'}
                        </span>
                      </div>
                      {phase === 'exit' && result?.visit?.durationSeconds != null && (
                        <div className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl text-sm">
                          <span className="text-brand-textMuted">Duration</span>
                          <span className="font-medium text-brand-accent">
                            {Math.floor(result.visit.durationSeconds / 60)}m {result.visit.durationSeconds % 60}s
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Badge variant={phase === 'entry' ? 'success' : 'info'} className="self-center">
                      {phase === 'entry' ? 'ENTRY RECORDED' : 'EXIT RECORDED'}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* ---------- REJECTED (3rd scan) ---------- */}
            {phase === 'rejected' && (
              <motion.div
                key="rejected"
                initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              >
                <Card className="border-brand-warning/40 ring-1 ring-brand-warning/20">
                  <CardContent className="p-8 flex flex-col items-center text-center gap-5">
                    <motion.div
                      className="w-24 h-24 rounded-full bg-brand-warningBg text-brand-warning flex items-center justify-center"
                      animate={reduce ? undefined : { rotate: [0, -8, 8, -8, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <AlertCircle className="h-12 w-12" />
                    </motion.div>
                    <div>
                      <h1 className="text-2xl font-extrabold text-brand-warning">Already Completed</h1>
                      <p className="text-brand-textMuted mt-2">{result?.message}</p>
                    </div>
                    <div className="w-full p-3 bg-brand-surface border border-brand-border rounded-xl text-sm text-brand-textMuted">
                      You have already completed your gym attendance for today. You can check in again tomorrow.
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* ---------- INELIGIBLE ---------- */}
            {phase === 'ineligible' && (
              <motion.div
                key="ineligible"
                initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="border-brand-error/40 ring-1 ring-brand-error/20">
                  <CardContent className="p-8 flex flex-col items-center text-center gap-5">
                    <div className="w-24 h-24 rounded-full bg-brand-errorBg text-brand-error flex items-center justify-center">
                      <ShieldAlert className="h-12 w-12" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-extrabold text-brand-error">Cannot Check In</h1>
                      <p className="text-brand-textMuted mt-2">
                        {result?.errorCode
                          ? INELIGIBLE[result.errorCode]
                          : 'Your membership is not eligible for check-in.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* ---------- ERROR ---------- */}
            {phase === 'error' && (
              <motion.div
                key="error"
                initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="border-brand-border">
                  <CardContent className="p-8 flex flex-col items-center text-center gap-5">
                    <div className="w-24 h-24 rounded-full bg-brand-border text-brand-textMuted flex items-center justify-center">
                      <XCircle className="h-12 w-12" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-extrabold text-brand-text">Connection Problem</h1>
                      <p className="text-brand-textMuted mt-2">
                        We could not reach the server. Please check your connection and try again.
                      </p>
                    </div>
                    <Button onClick={() => { submitted.current = false; runScan(); }} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Persistent guidance so a member scanning repeatedly understands the rule */}
          {phase !== 'scanning' && (
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-brand-surface border border-brand-border rounded-xl text-center">
                <div className="text-[10px] uppercase tracking-wider text-brand-textDim">1st scan</div>
                <div className="text-xs font-semibold text-brand-success">Check In</div>
              </div>
              <div className="p-2.5 bg-brand-surface border border-brand-border rounded-xl text-center">
                <div className="text-[10px] uppercase tracking-wider text-brand-textDim">2nd scan</div>
                <div className="text-xs font-semibold text-brand-warning">Check Out</div>
              </div>
              <div className="p-2.5 bg-brand-surface border border-brand-border rounded-xl text-center">
                <div className="text-[10px] uppercase tracking-wider text-brand-textDim">3rd scan</div>
                <div className="text-xs font-semibold text-brand-error">Invalid</div>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link href="/member" className="inline-flex items-center gap-1.5 text-sm text-brand-textMuted hover:text-brand-accent transition-colors">
              Go to Member Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}