'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface Announcement {
  id: string;
  title: string;
  message: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

interface AnnouncementForm {
  title: string;
  message: string;
  status: 'draft' | 'published';
}

const EMPTY_FORM: AnnouncementForm = { title: '', message: '', status: 'draft' };

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AnnouncementForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) setAnnouncements(await res.json());
      else toast.error('Failed to load announcements');
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };
  
  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Title is required';
    else if (form.title.trim().length < 3) next.title = 'Title must be at least 3 characters';
    if (!form.message.trim()) next.message = 'Message is required';
    else if (form.message.trim().length < 10) next.message = 'Message must be at least 10 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        toast.success(
          form.status === 'published'
            ? 'Announcement published for members'
            : 'Announcement saved as draft'
        );
        setForm(EMPTY_FORM);
        setShowForm(false);
        fetchAnnouncements();
      } else {
        toast.error('Failed to create announcement');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });
      if (res.ok) {
        toast.success('Announcement published');
        fetchAnnouncements();
      } else {
        toast.error('Failed to publish announcement');
      }
    } catch {
      toast.error('Network error');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Announcement deleted');
        fetchAnnouncements();
      } else {
        toast.error('Failed to delete announcement');
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
            <h1 className="text-2xl font-bold text-brand-text">Announcements</h1>
            <p className="text-brand-textMuted">Publish updates visible to members</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            {showForm ? 'Cancel' : 'New Announcement'}
          </Button>
        </div>
        
        {showForm && (
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <h3 className="font-medium text-brand-text">Create Announcement</h3>
                <div>
                  <Label htmlFor="title" required>
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => {
                      setForm({ ...form, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: '' });
                    }}
                    placeholder="Announcement title"
                    error={errors.title}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label htmlFor="message" required>
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    placeholder="Write the announcement for members..."
                    rows={4}
                    error={errors.message}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={form.status}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm({ ...form, status: value === 'published' ? 'published' : 'draft' });
                    }}
                    disabled={submitting}
                  >
                    <option value="draft">Draft (not visible to members)</option>
                    <option value="published">Published (visible immediately)</option>
                  </Select>
                </div>
                <Button type="submit" disabled={submitting} className="gap-2">
                  <Send className="h-4 w-4" />
                  {submitting ? 'Saving...' : 'Save Announcement'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-brand-success mt-1">
                {announcements.filter((a) => a.status === 'published').length}
              </p>
              <p className="text-sm text-brand-textMuted">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-brand-warning mt-1">
                {announcements.filter((a) => a.status === 'draft').length}
              </p>
              <p className="text-sm text-brand-textMuted">Drafts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-brand-textMuted mt-1">
                {announcements.filter((a) => a.status === 'archived').length}
              </p>
              <p className="text-sm text-brand-textMuted">Archived</p>
            </CardContent>
          </Card>
        </div>
        
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-brand-textDim">
              <Megaphone className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No announcements yet</p>
              <p className="text-sm mt-2">Create your first announcement to notify members</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {announcements.map((ann) => (
              <Card key={ann.id} className="border-brand-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-brand-text">{ann.title}</h3>
                        <Badge
                          variant={
                            ann.status === 'published'
                              ? 'success'
                              : ann.status === 'draft'
                                ? 'warning'
                                : 'outline'
                          }
                        >
                          {ann.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-brand-textMuted mt-2">{ann.message}</p>
                      <p className="text-xs text-brand-textDim mt-2">
                        {ann.publishedAt
                          ? `Published ${new Date(ann.publishedAt).toLocaleDateString()}`
                          : `Created ${new Date(ann.createdAt).toLocaleDateString()}`}
                        {ann.expiresAt && ` - expires ${new Date(ann.expiresAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {ann.status !== 'published' && (
                        <Button variant="outline" size="sm" onClick={() => handlePublish(ann.id)}>
                          Publish
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-brand-error hover:bg-brand-errorBg/20"
                        onClick={() => handleDelete(ann.id)}
                        aria-label={`Delete ${ann.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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