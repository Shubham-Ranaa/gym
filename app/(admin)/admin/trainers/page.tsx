'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useState, useEffect } from 'react';
import { Dumbbell, Plus, Edit, Trash2, Award, Loader2, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experienceYears: number;
  certifications: string[];
  isActive: boolean;
}

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTrainers();
  }, []);
  
  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trainers');
      if (res.ok) {
        setTrainers(await res.json());
      } else {
        toast.error('Failed to load trainers');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/trainers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        toast.success(`Trainer ${!isActive ? 'activated' : 'deactivated'}`);
        fetchTrainers();
      } else {
        toast.error('Failed to update trainer');
      }
    } catch {
      toast.error('Network error');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;
    try {
      const res = await fetch(`/api/trainers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Trainer deleted');
        fetchTrainers();
      } else {
        toast.error('Failed to delete trainer');
      }
    } catch {
      toast.error('Network error');
    }
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
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-text">Trainers</h1>
            <p className="text-brand-textMuted">Manage your gym trainers and their profiles</p>
          </div>
          <Button onClick={() => toast('Trainer creation form coming soon')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Trainer
          </Button>
        </div>
        
        {trainers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-brand-textDim">
              <Dumbbell className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No trainers found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {trainers.map((trainer) => (
              <Card key={trainer.id} className="border-brand-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center font-bold flex-shrink-0">
                        {trainer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-brand-text truncate">{trainer.name}</p>
                        <p className="text-sm text-brand-textMuted">{trainer.experienceYears} years experience</p>
                      </div>
                    </div>
                    <Badge variant={trainer.isActive ? 'success' : 'error'}>
                      {trainer.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1.5 text-sm text-brand-textMuted">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{trainer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{trainer.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.specialization.map((spec) => (
                      <Badge key={spec} variant="info" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  
                  {trainer.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-brand-border">
                      {trainer.certifications.map((cert) => (
                        <span key={cert} className="inline-flex items-center gap-1 text-xs text-brand-textDim">
                          <Award className="h-3 w-3" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(trainer.id, trainer.isActive)}
                    >
                      {trainer.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-brand-error hover:bg-brand-errorBg/20 gap-1"
                      onClick={() => handleDelete(trainer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}