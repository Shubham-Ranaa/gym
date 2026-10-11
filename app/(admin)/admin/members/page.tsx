'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Download,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Member {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  approvalStatus: string;
  membershipStatus: string;
  membershipPlanId: string | null;
  membershipStartDate: string | null;
  membershipEndDate: string | null;
  createdAt: string;
}

function statusVariant(status: string): 'success' | 'warning' | 'error' | 'outline' {
  switch (status) {
    case 'approved':
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
    case 'expired':
      return 'error';
    default:
      return 'outline';
  }
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchMembers();
  }, [search, statusFilter, sortBy, sortOrder, page]);
  
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter === 'all' ? '' : statusFilter,
        sortBy,
        sortOrder,
        page: page.toString(),
        limit: '20',
      });
      
      const res = await fetch(`/api/members?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.data);
        setTotalPages(data.totalPages);
      } else {
        toast.error('Failed to load members');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: 'approved' }),
      });
      if (res.ok) {
        toast.success('Member approved');
        fetchMembers();
      } else {
        toast.error('Failed to approve member');
      }
    } catch {
      toast.error('Network error');
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: 'rejected' }),
      });
      if (res.ok) {
        toast.success('Member rejected');
        fetchMembers();
      } else {
        toast.error('Failed to reject member');
      }
    } catch {
      toast.error('Network error');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Member deleted');
        fetchMembers();
      } else {
        toast.error('Failed to delete member');
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
            <h1 className="text-2xl font-bold text-brand-text">Members Management</h1>
            <p className="text-brand-textMuted">Manage all gym members and their memberships</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/admin/members/new">
              <Button variant="outline" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add New Member
              </Button>
            </Link>
            <Button onClick={() => toast('CSV export coming soon')} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <Card>
          <div className="p-4 border-b border-brand-border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Label htmlFor="search" className="sr-only">
                  Search members
                </Label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-textDim" />
                <Input
                  id="search"
                  placeholder="Search by name, email or member code..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <div>
                <Label htmlFor="status" className="sr-only">
                  Filter by status
                </Label>
                <Select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending Approval</option>
                  <option value="rejected">Rejected</option>
                  <option value="active">Active Membership</option>
                  <option value="expired">Expired Membership</option>
                  <option value="inactive">Inactive Membership</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="sortBy" className="sr-only">
                  Sort by
                </Label>
                <Select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="createdAt">Join Date</option>
                  <option value="membershipStatus">Membership Status</option>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-sm text-brand-textMuted">
                Showing {members.length} member{members.length === 1 ? '' : 's'}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-brand-textMuted px-2">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  Sort {sortOrder.toUpperCase()}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {members.length === 0 ? (
              <div className="text-center py-12 text-brand-textDim">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No members found</p>
                {(search || statusFilter !== 'all') && (
                  <p className="text-sm mt-2">Try adjusting your search or filters</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <Card key={member.id} className="border-brand-border">
                    <div className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {member.memberCode.slice(-2)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-brand-text truncate">{member.name}</p>
                          <p className="text-sm text-brand-textMuted truncate">{member.email}</p>
                          <p className="text-xs text-brand-textDim">{member.memberCode}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-1">
                        <Badge variant="outline">
                          {member.role === 'admin' ? 'Admin' : 'Member'}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-brand-textMuted">Approval:</span>
                          <Badge variant={statusVariant(member.approvalStatus)}>
                            {member.approvalStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-brand-textMuted">Membership:</span>
                          <Badge variant={statusVariant(member.membershipStatus)}>
                            {member.membershipStatus}
                          </Badge>
                        </div>
                        {member.membershipStartDate && member.membershipEndDate && (
                          <span className="text-xs text-brand-textMuted">
                            {new Date(member.membershipStartDate).toLocaleDateString()} -{' '}
                            {new Date(member.membershipEndDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {member.approvalStatus === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(member.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(member.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Link href={`/admin/members/${member.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                          className="text-brand-error hover:bg-brand-errorBg/20"
                          aria-label={`Delete ${member.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
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