'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Reveal, SectionHeader, Stagger, StaggerItem } from '@/components/ui/Reveal';
import toast from 'react-hot-toast';

const subjects = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'membership', label: 'Membership Questions' },
  { value: 'training', label: 'Personal Training' },
  { value: 'partnership', label: 'Corporate/Partnership' },
  { value: 'feedback', label: 'Feedback/Complaint' },
  { value: 'other', label: 'Other' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSubmitStatus('success');
        toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
        setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch {
      setSubmitStatus('error');
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const contactInfo = [
    { icon: MapPin, title: 'Visit Us', details: '123 Fitness Street, Gym City, GC 12345' },
    { icon: Phone, title: 'Call Us', details: '+1 (555) 123-4567' },
    { icon: Mail, title: 'Email Us', details: 'hello@fitforge.com' },
    { icon: Clock, title: 'Hours', details: 'Mon-Fri: 5AM-11PM | Sat-Sun: 7AM-9PM' },
  ];
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        <section className="relative py-20 lg:py-28 bg-brand-surface/30 overflow-hidden">`n          <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-accent/[0.06] blur-[110px]" aria-hidden="true" />
          <div className="container-main text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent mb-3">Get In Touch</span>
            <h1 className="text-display-sm sm:text-display-md font-extrabold tracking-tight text-balance text-brand-text mb-6">Contact Us</h1>
            <p className="text-body-lg text-brand-textMuted">
              Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
            </p>
          </div>
        </section>
        
        <section className="section">
          <div className="container-main">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-1">
                <Stagger className="space-y-4">
                  {contactInfo.map((item) => (
                    <StaggerItem key={item.title}>
                      <Card hover className="h-full">
                        <CardContent className="p-5 sm:p-6 flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-brand-text mb-1">{item.title}</h3>
                            <p className="text-brand-textMuted text-sm">{item.details}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </Stagger>
                
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a href="/membership" className="flex items-center gap-2 text-brand-textMuted hover:text-brand-accent transition-colors">Membership Plans</a>
                    <a href="/trainers" className="flex items-center gap-2 text-brand-textMuted hover:text-brand-accent transition-colors">Meet Our Trainers</a>
                    <a href="/faq" className="flex items-center gap-2 text-brand-textMuted hover:text-brand-accent transition-colors">FAQ</a>
                    <a href="/register" className="flex items-center gap-2 text-brand-textMuted hover:text-brand-accent transition-colors">Free Trial Pass</a>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Us a Message</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" required>Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            error={errors.name}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" required>Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            error={errors.email}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" required>Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            error={errors.phone}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject" required>Subject</Label>
                          <Select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            error={errors.subject}
                            disabled={isSubmitting}
                          >
                            {subjects.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="message" required>Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help..."
                          rows={5}
                          error={errors.message}
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full sm:w-auto" size="lg" loading={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="h-5 w-5" />
                          </>
                        )}
                      </Button>
                      
                      {submitStatus === 'success' && (
                        <div className="flex items-center gap-2 text-brand-success bg-brand-successBg/50 border border-brand-success/30 px-4 py-3 rounded-xl">
                          <CheckCircle className="h-5 w-5" />
                          <span>Message sent successfully! We'll get back to you within 24 hours.</span>
                        </div>
                      )}
                      
                      {submitStatus === 'error' && (
                        <div className="flex items-center gap-2 text-brand-error bg-brand-errorBg/50 border border-brand-error/30 px-4 py-3 rounded-xl">
                          <AlertCircle className="h-5 w-5" />
                          <span>Failed to send message. Please try again or call us directly.</span>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}