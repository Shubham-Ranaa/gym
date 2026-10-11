'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Dumbbell, QrCode, Download, Copy, Check, AlertCircle, Loader2, Smartphone, Printer, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRData {
  dataUrl: string;
  svg: string;
  checkInUrl: string;
}

export default function GymQRPage() {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appUrl, setAppUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchQR();
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setAppUrl(data.appUrl || '');
      }
    } catch {}
  };
  
  const fetchQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/qr/generate');
      if (res.ok) {
        const data = await res.json();
        setQrData(data);
      } else {
        const err = await res.json();
        setError(err.message || 'Failed to generate QR code');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/qr/generate');
      if (res.ok) {
        const data = await res.json();
        setQrData(data);
        toast.success('QR code regenerated');
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to regenerate');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setGenerating(false);
    }
  };
  
  const handleDownload = () => {
    if (!qrData) return;
    const link = document.createElement('a');
    link.href = qrData.dataUrl;
    link.download = 'fitforge-gym-qr.png';
    link.click();
    toast.success('QR code downloaded');
  };
  
  const handleCopyUrl = async () => {
    if (!qrData) return;
    await navigator.clipboard.writeText(qrData.checkInUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('URL copied to clipboard');
  };
  
  const handlePrint = () => {
    if (!qrData) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>FitForge Gym QR Code</title>
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 40px; background: #0a0a0a; color: #fafafa; }
            .container { max-width: 400px; margin: 0 auto; }
            h1 { color: #a3e635; margin-bottom: 8px; }
            .subtitle { color: #a3a3a3; margin-bottom: 24px; }
            .qr-img { max-width: 100%; height: auto; border: 2px solid #2a2a2a; border-radius: 12px; }
            .instructions { margin-top: 24px; text-align: left; background: #141414; padding: 16px; border-radius: 12px; border: 1px solid #2a2a2a; }
            .instructions h3 { color: #a3e635; margin-bottom: 12px; }
            .instructions ol { padding-left: 20px; }
            .instructions li { margin-bottom: 8px; color: #a3a3a3; }
            .url { margin-top: 16px; padding: 12px; background: #1a1a1a; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 12px; color: #a3e635; }
            @media print { body { background: white; color: black; } .subtitle { color: #666; } .qr-img { border-color: #ccc; } .instructions { background: #f5f5f5; border-color: #ddd; } .url { background: #f0f0f0; color: #65a30d; } }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>FitForge</h1>
            <p class="subtitle">Gym Entrance QR Code</p>
            <img src="${qrData.dataUrl}" alt="FitForge Gym Check-In QR Code" class="qr-img" />
            <div class="instructions">
              <h3>How to Use</h3>
              <ol>
                <li>Scan this QR code with your phone camera</li>
                <li>Tap the notification to open FitForge</li>
                <li>Log in with your member account</li>
                <li>Tap "Check In" to confirm attendance</li>
                <li>Tap "Check In" again when leaving to check out</li>
              </ol>
              <div class="url">${qrData.checkInUrl}</div>
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-brand-text mb-2">Gym QR Code</h1>
          <p className="text-brand-textMuted">Fixed QR code for member check-in at the gym entrance</p>
        </div>
        
        {error && (
          <Card className="mb-6 border-brand-error/30 bg-brand-errorBg/30">
            <CardContent className="p-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-brand-error" />
              <div>
                <p className="font-medium text-brand-error">Configuration Issue</p>
                <p className="text-brand-textMuted text-sm">{error}</p>
                <p className="text-brand-textDim text-sm mt-1">Set APP_URL environment variable or configure in Settings</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <CardDescription>High-resolution QR code for printing</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {qrData ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-4 p-4 sm:p-6 bg-brand-bg rounded-xl border border-brand-border w-full">
                    <img 
                      src={qrData.dataUrl} 
                      alt="FitForge Gym Check-In QR Code" 
                      className="w-full max-w-[260px] sm:max-w-[320px] h-auto rounded-lg border border-brand-border"
                    />
                    <div className="text-center">
                      <p className="font-bold text-brand-text">FitForge</p>
                      <p className="text-sm text-brand-textMuted">Gym Entrance Check-In</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button onClick={handleDownload} variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download PNG
                    </Button>
                    <Button onClick={handlePrint} variant="outline" className="gap-2">
                      <Printer className="h-4 w-4" />
                      Print Friendly
                    </Button>
                    <Button onClick={handleRegenerate} variant="secondary" className="gap-2" loading={generating}>
                      <Loader2 className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-brand-textDim">
                  <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Unable to generate QR code</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Check-In URL</CardTitle>
              <CardDescription>The URL members will be directed to</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="p-4 bg-brand-bg rounded-xl border border-brand-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-brand-textMuted">Check-In URL</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyUrl} className="gap-1">
                    {copied ? <Check className="h-4 w-4 text-brand-success" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <code className="text-sm text-brand-accent font-mono break-all block">{qrData?.checkInUrl || 'Not configured'}</code>
              </div>
              
              <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
                <h4 className="font-medium text-brand-text mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-brand-accent" />
                  Mobile Experience
                </h4>
                <div className="space-y-3 text-sm text-brand-textMuted">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-accentBg text-brand-accent flex items-center justify-center text-xs font-bold">1</div>
                    <span>Member scans the QR code at the entrance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-accentBg text-brand-accent flex items-center justify-center text-xs font-bold">2</div>
                    <span>Phone opens {qrData ? new URL(qrData.checkInUrl).hostname : 'FitForge'}/check-in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-accentBg text-brand-accent flex items-center justify-center text-xs font-bold">3</div>
                    <span>Member logs in once (session then stays valid)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-accentBg text-brand-accent flex items-center justify-center text-xs font-bold">4</div>
                    <span>1st scan records ENTRY, 2nd scan records EXIT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-accentBg text-brand-accent flex items-center justify-center text-xs font-bold">5</div>
                    <span>3rd scan the same day is rejected as invalid</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-brand-accentBg/50 border border-brand-accent/30 rounded-xl">
                <h4 className="font-medium text-brand-accent mb-2 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Important Notes
                </h4>
                <ul className="text-sm text-brand-textMuted space-y-1">
                  <li>• QR code points to <strong>{qrData ? new URL(qrData.checkInUrl).hostname : 'your-domain'}</strong></li>
                  <li>• Uses APP_URL environment variable</li>
                  <li>• Same QR code works for all members</li>
                  <li>• Attendance tracked per member via login</li>
                  <li>• Demo mode: data stored in JSON files</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Print Instructions</CardTitle>
            <CardDescription>Best practices for printing and displaying the QR code</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center mb-3">
                  <QrCode className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-brand-text mb-2">Size & Quality</h4>
                <ul className="text-sm text-brand-textMuted space-y-1">
                  <li>• Minimum 4×4 inches (10×10 cm)</li>
                  <li>• Print at 300 DPI for clarity</li>
                  <li>• Use matte finish to reduce glare</li>
                  <li>• Test scan before mounting</li>
                </ul>
              </div>
              <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center mb-3">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-brand-text mb-2">Placement</h4>
                <ul className="text-sm text-brand-textMuted space-y-1">
                  <li>• Eye level at entrance</li>
                  <li>• Good lighting, no shadows</li>
                  <li>• Away from direct sunlight</li>
                  <li>• Clear scan path for members</li>
                </ul>
              </div>
              <div className="p-4 bg-brand-surface border border-brand-border rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center mb-3">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-brand-text mb-2">Member Instructions</h4>
                <ul className="text-sm text-brand-textMuted space-y-1">
                  <li>• Add signage: "Scan to Check In"</li>
                  <li>• Show login required message</li>
                  <li>• Indicate check-out on exit</li>
                  <li>• Staff assistance available</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}