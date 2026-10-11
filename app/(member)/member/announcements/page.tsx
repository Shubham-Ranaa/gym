'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Megaphone, ArrowRight, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Announcement {
  id: string;
  title: string;
  message: string;
  status: string;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export default function MemberAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/announcements/active');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      } else if (res.status === 401) {
        window.location.href = '/login?callbackUrl=/member/announcements';
      }
    } catch {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };
  
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
            <h1 className="text-2xl font-bold text-brand-text">Gym Announcements</h1>
            <p className="text-brand-textMuted">Important updates and notifications from FitForge</p>
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
        
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-brand-textDim">
              <Megaphone className="h-16 w-16 mx-auto mb-4" />
              <p>No active announcements</p>
              <p className="text-sm mt-2">Check back later for updates from the gym</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="border-b border-brand-border pb-4 last:pb-0 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Megaphone className="h-5 w-5 text-brand-accent flex-shrink-0" />
                      <div>
                        <p className="font-medium text-brand-text">{ann.title}</p>
                        <p className="text-sm text-brand-textMuted">
                          Published {ann.publishedAt ? formatDate(ann.publishedAt) : formatDate(ann.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-brand-textMuted mb-3">{ann.message}</p>
                    {ann.expiresAt && (
                      <div className="text-xs text-brand-textMuted text-right">
                        Expires: {formatDate(ann.expiresAt)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MemberLayout>
  );
}