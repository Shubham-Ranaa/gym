'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Dumbbell, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16 flex-1 flex items-center justify-center py-12 px-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-brand-accent animate-spin" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

/**
 * Only same-origin relative paths are honoured as redirect targets, so a
 * crafted callbackUrl cannot bounce a member to an external site.
 * Callbacks the role is not allowed to enter fall back to their own home.
 */
function resolveRedirect(role: string, callbackUrl: string): string {
  const home = role === 'admin' ? '/admin' : '/member';
  
  if (!callbackUrl || callbackUrl === '/' || callbackUrl === home) return home;
  
  // Reject absolute URLs, protocol-relative URLs and backslashes.
  if (!callbackUrl.startsWith('/') || callbackUrl.startsWith('//') || callbackUrl.includes('\\')) {
    return home;
  }
  
  // Role-specific areas are not valid cross-role targets.
  if (role === 'admin' && callbackUrl.startsWith('/member')) return home;
  if (role === 'member' && callbackUrl.startsWith('/admin')) return home;
  
  return callbackUrl;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Welcome back, ${data.user.name}!`);
        router.push(resolveRedirect(data.user.role, callbackUrl));
        router.refresh();
      } else {
        setErrors({ form: data.message || 'Invalid credentials' });
        toast.error(data.message || 'Invalid credentials');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (errors.form) setErrors(prev => ({ ...prev, form: '' }));
  };
  
  const demoAccounts = [
    { role: 'Admin', email: 'admin@fitforge.com', password: 'admin123' },
    { role: 'Member', email: 'john@fitforge.com', password: 'member123' },
    { role: 'Member', email: 'sarah@fitforge.com', password: 'member123' },
  ];
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16 flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Dumbbell className="h-10 w-10 text-brand-accent" />
              <span className="text-2xl font-bold text-brand-text">FitForge</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-brand-text mb-2">Welcome Back</h1>
            <p className="text-brand-textMuted">Sign in to access your account</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-5">
              <form onSubmit={handleSubmit} noValidate>
                {errors.form && (
                  <div className="flex items-center gap-2 text-brand-error bg-brand-errorBg/50 border border-brand-error/30 px-4 py-3 rounded-xl text-sm">
                    <AlertCircle className="h-5 w-5" />
                    <span>{errors.form}</span>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textDim" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      error={errors.email}
                      disabled={isSubmitting}
                      className="pl-12"
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textDim" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      error={errors.password}
                      disabled={isSubmitting}
                      className="pl-12 pr-12"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-textDim hover:text-brand-text transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-brand-surface text-brand-textDim">Demo Accounts</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => {
                      setFormData({ email: account.email, password: account.password });
                      setErrors({});
                    }}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 text-left rounded-xl bg-brand-surface border border-brand-border text-brand-textMuted hover:text-brand-text hover:border-brand-borderHover hover:bg-brand-surfaceHover transition-all disabled:opacity-50"
                  >
                    <div className="font-medium text-brand-text">{account.role}</div>
                    <div className="text-xs text-brand-textDim">{account.email}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center text-brand-textMuted mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="link font-medium">Create one</Link>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}