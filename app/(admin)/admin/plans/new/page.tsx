'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminNewPlanPage() {
  const router = useRouter();
  
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    price: '',
    durationDays: '',
    benefits: [''] as string[],
    isActive: true,
  });
  
  const setBenefit = (i: number, v: string) => {
    const next = [...form.benefits];
    next[i] = v;
    setForm({ ...form, benefits: next });
  };
  
  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Plan name is required';
    if (!form.price) next.price = 'Price is required';
    else if (Number(form.price) < 0) next.price = 'Price cannot be negative';
    if (!form.durationDays) next.durationDays = 'Duration is required';
    else if (Number(form.durationDays) < 1) next.durationDays = 'Duration must be at least 1 day';
    const clean = form.benefits.filter((b) => b.trim());
    if (clean.length === 0) next.benefits = 'Add at least one benefit';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          price: Number(form.price),
          durationDays: Number(form.durationDays),
          benefits: form.benefits.filter((b) => b.trim()),
          isActive: form.isActive,
        }),
      });
      
      if (res.ok) {
        toast.success('Plan created successfully');
        router.push('/admin/plans');
        router.refresh();
      } else {
        toast.error('Failed to create plan');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/plans">
            <Button variant="ghost" size="icon" aria-label="Back to plans">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-text">Add Membership Plan</h1>
            <p className="text-brand-textMuted">Create a new membership offering</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <Label htmlFor="name" required>Plan Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: '' }); }}
                    placeholder="Monthly Flex"
                    error={errors.name}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" required>Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      value={form.price}
                      onChange={(e) => { setForm({ ...form, price: e.target.value }); if (errors.price) setErrors({ ...errors, price: '' }); }}
                      placeholder="2999"
                      error={errors.price}
                    />
                  </div>
                  <div>
                    <Label htmlFor="durationDays" required>Duration (days)</Label>
                    <Input
                      id="durationDays"
                      type="number"
                      min={1}
                      value={form.durationDays}
                      onChange={(e) => { setForm({ ...form, durationDays: e.target.value }); if (errors.durationDays) setErrors({ ...errors, durationDays: '' }); }}
                      placeholder="30"
                      error={errors.durationDays}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {errors.benefits && <p className="text-sm text-brand-error">{errors.benefits}</p>}
                {form.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => { setBenefit(i, e.target.value); if (errors.benefits) setErrors({ ...errors, benefits: '' }); }}
                      placeholder="e.g. 24/7 Gym Access"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setForm({ ...form, benefits: form.benefits.filter((_, idx) => idx !== i) })}
                      aria-label={`Remove benefit ${i + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setForm({ ...form, benefits: [...form.benefits, ''] })}
                >
                  <Plus className="h-4 w-4" />
                  Add Benefit
                </Button>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Creating...' : 'Create Plan'}
              </Button>
              <Link href="/admin/plans">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}