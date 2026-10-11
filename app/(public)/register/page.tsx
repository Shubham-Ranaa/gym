'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Dumbbell, Mail, Lock, User, Phone, AlertCircle, Loader2, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Account created! Your membership is pending approval.');
        router.push('/login?registered=true');
      } else {
        setErrors({ form: data.message || 'Registration failed' });
        toast.error(data.message || 'Registration failed');
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
  
  const passwordRequirements = [
    { label: 'At least 8 characters', test: formData.password.length >= 8 },
    { label: 'One uppercase letter', test: /[A-Z]/.test(formData.password) },
    { label: 'One lowercase letter', test: /[a-z]/.test(formData.password) },
    { label: 'One number', test: /[0-9]/.test(formData.password) },
  ];
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16 flex-1 py-12 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Dumbbell className="h-10 w-10 text-brand-accent" />
              <span className="text-2xl font-bold text-brand-text">FitForge</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-brand-text mb-2">Create Your Account</h1>
            <p className="text-brand-textMuted">Start your fitness journey today</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Join FitForge</CardTitle>
              <CardDescription>Fill in your details to get started. Membership requires admin approval.</CardDescription>
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
                  <Label htmlFor="name" required>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textDim" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      error={errors.name}
                      disabled={isSubmitting}
                      className="pl-12"
                      autoComplete="name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" required>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textDim" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      error={errors.email}
                      disabled={isSubmitting}
                      className="pl-12"
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone" required>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textDim" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      error={errors.phone}
                      disabled={isSubmitting}
                      className="pl-12"
                      autoComplete="tel"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password" required>Password</Label>
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
                      autoComplete="new-password"
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
                  
                  {formData.password && (
                    <div className="mt-3 space-y-1.5">
                      {passwordRequirements.map((req) => (
                        <div key={req.label} className="flex items-center gap-2 text-xs">
                          {req.test ? (
                            <CheckCircle className="h-4 w-4 text-brand-success" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-brand-border" />
                          )}
                          <span className={req.test ? 'text-brand-success' : 'text-brand-textDim'}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword" required>Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textDim" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      error={errors.confirmPassword}
                      disabled={isSubmitting}
                      className="pl-12 pr-12"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-textDim hover:text-brand-text transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-brand-accentBg/50 border border-brand-accent/30 rounded-xl">
                  <Shield className="h-5 w-5 text-brand-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-brand-textMuted">
                    <span className="font-medium text-brand-text">Demo Notice:</span> This is a prototype. Registration creates a demo account pending admin approval. No real payments or commitments.
                  </div>
                </div>
                
                <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <p className="text-center text-brand-textMuted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="link font-medium">Sign in</Link>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}