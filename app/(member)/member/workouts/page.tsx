'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Dumbbell, User, CalendarCheck, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string;
  restSeconds: number;
  instructions?: string;
  order: number;
}

interface WorkoutDay {
  day: number;
  name: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  days: WorkoutDay[];
  isActive: boolean;
  createdAt: string;
}

interface Trainer {
  id: string;
  name: string;
  specialization: string[];
}

export default function MemberWorkoutsPage() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      setLoading(true);
      try {
        const [planRes, trainersRes] = await Promise.all([
          fetch('/api/members/me/workoutplan'),
          fetch('/api/trainers'),
        ]);
        
        const plan = planRes.ok ? await planRes.json() : null;
        const trainers = trainersRes.ok ? await trainersRes.json() : [];
        
        if (cancelled) return;
        
        setWorkoutPlan(plan || null);
        
        if (plan) {
          const found = (trainers as Trainer[]).find((t) => t.id === plan.trainerId);
          setTrainer(found || null);
        }
      } catch {
        if (!cancelled) toast.error('Failed to load workout plan');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  
  if (loading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-brand-accent animate-spin" />
        </div>
      </MemberLayout>
    );
  }
  
  return (
    <MemberLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-text">My Workout Plan</h1>
            <p className="text-brand-textMuted">Your personalized training program</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/member">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-3 w-3" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        {!workoutPlan ? (
          <Card>
            <CardContent className="p-12 text-center text-brand-textDim">
              <Dumbbell className="h-16 w-16 mx-auto mb-4" />
              <p>No workout plan assigned</p>
              <p className="text-sm mt-2">
                Contact your trainer or visit the front desk to get a personalized workout plan
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Workout Plan Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-5 w-5 text-brand-accent flex-shrink-0" />
                  <div>
                    <p className="font-medium text-brand-text">{workoutPlan.name}</p>
                    <p className="text-sm text-brand-textMuted">{workoutPlan.description}</p>
                  </div>
                </div>
                {trainer && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-brand-text">Assigned Trainer</p>
                      <p className="text-sm text-brand-textMuted">
                        {trainer.name}
                        {trainer.specialization.length > 0 && ` - ${trainer.specialization.join(', ')}`}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-5 w-5 text-brand-accent flex-shrink-0" />
                  <div>
                    <p className="font-medium text-brand-text">Created</p>
                    <p className="text-sm text-brand-textMuted">
                      {new Date(workoutPlan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-brand-surface border border-brand-border rounded-xl text-center">
                    <p className="text-xl font-extrabold text-brand-accent">{workoutPlan.days.length}</p>
                    <p className="text-sm text-brand-textMuted">Training Days</p>
                  </div>
                  <div className="p-3 bg-brand-surface border border-brand-border rounded-xl text-center">
                    <p className="text-xl font-extrabold text-brand-accent">
                      {workoutPlan.days.reduce((sum, d) => sum + d.exercises.length, 0)}
                    </p>
                    <p className="text-sm text-brand-textMuted">Total Exercises</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              {workoutPlan.days.map((day) => (
                <Card key={day.day}>
                  <CardHeader>
                    <CardTitle>
                      Day {day.day}: {day.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {day.exercises.map((exercise) => (
                      <div key={exercise.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 pt-0.5">
                          <p className="font-medium text-sm text-brand-accent">{exercise.order}.</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-brand-text">{exercise.name}</p>
                          <p className="text-sm text-brand-textMuted">
                            {exercise.sets} sets x {exercise.reps} reps
                          </p>
                          {exercise.restSeconds > 0 && (
                            <p className="text-xs text-brand-textDim">
                              Rest: {exercise.restSeconds} seconds between sets
                            </p>
                          )}
                          {exercise.instructions && (
                            <p className="text-xs text-brand-textDim mt-1">{exercise.instructions}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </MemberLayout>
  );
}