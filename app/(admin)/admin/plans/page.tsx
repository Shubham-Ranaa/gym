'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Dumbbell, Download, Edit, Trash2, Plus, Loader2, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  benefits: string[];
  isActive: boolean;
  createdAt: string;
  memberCount?: number;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetchPlans();
  }, [search]);
  
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/plans');
      if (res.ok) {
        const data: MembershipPlan[] = await res.json();
        const filtered = search
          ? data.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
          : data;
        setPlans(filtered);
      } else {
        toast.error('Failed to load plans');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        toast.success(`Plan ${!currentStatus ? 'activated' : 'deactivated'}`);
        fetchPlans();
      } else {
        toast.error('Failed to update plan status');
      }
    } catch {
      toast.error('Network error');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Plan deleted');
        fetchPlans();
      } else {
        toast.error('Failed to delete plan');
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
            <h1 className="text-2xl font-bold text-brand-text">Membership Plans</h1>
            <p className="text-brand-textMuted">Manage gym membership plans and pricing</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/admin/plans/new">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Plan
              </Button>
            </Link>
            <Button onClick={() => toast('CSV export coming soon')} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <Card>
          <div className="p-4 border-b border-brand-border">
            <label className="sr-only" htmlFor="search">
              Search plans
            </label>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-textDim" />
              <Input
                id="search"
                placeholder="Search by plan name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="p-4">
            {plans.length === 0 ? (
              <div className="text-center py-12 text-brand-textDim">
                <Dumbbell className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No plans found</p>
                {search && <p className="text-sm mt-2">Try adjusting your search</p>}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <Card key={plan.id} className="border-brand-border">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-brand-text">{plan.name}</h3>
                          <p className="text-2xl font-extrabold text-brand-accent mt-1">
                            {formatCurrency(plan.price)}
                            <span className="text-sm font-medium text-brand-textMuted">
                              {' '}
                              / {plan.durationDays} days
                            </span>
                          </p>
                        </div>
                        <Badge variant={plan.isActive ? 'success' : 'error'}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-brand-textMuted mt-1">
                        {plan.memberCount ?? 0} member{(plan.memberCount ?? 0) === 1 ? '' : 's'} assigned
                      </p>
                      
                      <div className="text-sm text-brand-textMuted">
                        <p className="font-medium text-brand-text mb-1">{plan.benefits.length} benefits included</p>
                        <ul className="space-y-1">
                          {plan.benefits.slice(0, 4).map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-brand-accent flex-shrink-0">&#8226;</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                          {plan.benefits.length > 4 && (
                            <li className="text-brand-textDim">+{plan.benefits.length - 4} more</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-brand-border">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                        >
                          {plan.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Link href={`/admin/plans/${plan.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(plan.id)}
                          className="text-brand-error hover:bg-brand-errorBg/20 gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}