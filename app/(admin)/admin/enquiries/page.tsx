'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  notes: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'closed'] as const;

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    fetchEnquiries();
  }, []);
  
  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) setEnquiries(await res.json());
      else toast.error('Failed to load enquiries');
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Enquiry status updated');
        fetchEnquiries();
      } else {
        toast.error('Failed to update enquiry');
      }
    } catch {
      toast.error('Network error');
    }
  };
  
  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-brand-text">Enquiries</h1>
          <p className="text-brand-textMuted">Leads submitted through the public contact form</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUS_OPTIONS.map((status) => (
            <Card key={status}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-extrabold text-brand-text mt-1">
                  {enquiries.filter((e) => e.status === status).length}
                </p>
                <p className="text-sm text-brand-textMuted capitalize">{status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="sr-only" htmlFor="search">
            Search enquiries
          </label>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-textDim" />
            <input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or subject..."
              className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-brand-border text-brand-text placeholder-brand-textDim rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="px-4 py-3 bg-brand-surface border border-brand-border text-brand-text rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-brand-textDim">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No enquiries found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((enquiry) => (
              <Card key={enquiry.id} className="border-brand-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-brand-text">{enquiry.name}</h3>
                        <Badge
                          variant={
                            enquiry.status === 'new'
                              ? 'warning'
                              : enquiry.status === 'converted'
                                ? 'success'
                                : enquiry.status === 'closed'
                                  ? 'outline'
                                  : 'info'
                          }
                        >
                          {enquiry.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-brand-textMuted mt-1">{enquiry.subject}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-brand-textMuted">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4" />
                          {enquiry.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4" />
                          {enquiry.phone}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-brand-textDim">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-brand-textMuted border-t border-brand-border pt-3">
                    {enquiry.message}
                  </p>
                  
                  {enquiry.notes && (
                    <p className="text-xs text-brand-textDim border-t border-brand-border pt-2">
                      Note: {enquiry.notes}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 border-t border-brand-border pt-3">
                    <span className="text-sm text-brand-textMuted">Mark as:</span>
                    {STATUS_OPTIONS.map((status) => (
                      <Button
                        key={status}
                        variant={enquiry.status === status ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(enquiry.id, status)}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
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