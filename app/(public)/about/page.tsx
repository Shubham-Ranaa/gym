'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dumbbell, Target, Heart, Users, Clock, Shield, MapPin, Phone, Mail } from 'lucide-react';
import { Reveal, SectionHeader, Stagger, StaggerItem } from '@/components/ui/Reveal';

const values = [
  { icon: Target, title: 'Excellence', desc: 'We pursue excellence in every rep, every set, every session. Mediocrity is not an option.' },
  { icon: Heart, title: 'Community', desc: 'We lift each other up. Your success is our success. Together we achieve more.' },
  { icon: Users, title: 'Integrity', desc: 'Honest guidance, transparent pricing, real results. No gimmicks, no shortcuts.' },
  { icon: Shield, title: 'Safety First', desc: 'Proper form, progressive overload, injury prevention. Your longevity matters.' },
];

const facilities = [
  { name: 'Main Training Floor', desc: '5,000 sq ft of premium equipment including plate-loaded machines, cable stations, and 150+ dumbbells.', icon: Dumbbell },
  { name: 'Functional Training Zone', desc: 'Battle ropes, sleds, kettlebells, plyo boxes, and open turf for dynamic movement training.', icon: Target },
  { name: 'Cardio Theater', desc: '30+ pieces of cardio equipment with personal screens, streaming, and virtual trails.', icon: Heart },
  { name: 'Group Studio', desc: 'Two studios hosting 40+ weekly classes: HIIT, Yoga, Spin, Strength, and Mobility.', icon: Users },
  { name: 'Recovery Lounge', desc: 'Massage chairs, compression therapy, foam rolling area, and guided stretching sessions.', icon: Shield },
  { name: 'Nutrition Bar', desc: 'Protein shakes, healthy meals, supplements, and nutrition coaching available on-site.', icon: Clock },
];

const hours = [
  { day: 'Monday - Friday', open: '5:00 AM', close: '11:00 PM', staffed: '6:00 AM - 10:00 PM' },
  { day: 'Saturday', open: '7:00 AM', close: '9:00 PM', staffed: '8:00 AM - 8:00 PM' },
  { day: 'Sunday', open: '7:00 AM', close: '9:00 PM', staffed: '8:00 AM - 6:00 PM' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-brand-surface/50 to-brand-bg" />
          <div className="absolute inset-0 bg-brand-bg/40" />
          <div className="relative container-main">
            <div className="max-w-3xl">
              <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent mb-3">Our Story</span>
            <h1 className="text-display-sm sm:text-display-md font-extrabold tracking-tight text-balance text-brand-text mb-6">About FitForge</h1>
              <p className="text-body-lg text-brand-textMuted mb-8">
                Founded in 2019, FitForge was born from a simple belief: everyone deserves access to 
                world-class fitness facilities and expert guidance, regardless of their starting point.
              </p>
              <p className="text-body text-brand-textMuted">
                What started as a 2,000 sq ft garage gym has grown into a 15,000 sq ft premium facility 
                serving over 500 members. But our mission remains unchanged: to help you become the 
                strongest version of yourself — physically and mentally.
              </p>
            </div>
          </div>
        </section>
        
        <section className="section">
          <div className="container-main">
            <SectionHeader
              eyebrow="Our Values"
              title="What We Stand For"
              description="The principles that guide everything we do."
            />
            
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <StaggerItem key={value.title}>
                    <Card hover className="group h-full">
                      <CardContent className="p-6 text-center h-full flex flex-col">
                        <div className="w-14 h-14 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-brand-bg transition-all duration-300">
                          <Icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-lg font-bold text-brand-text mb-2">{value.title}</h3>
                        <p className="text-brand-textMuted text-sm">{value.desc}</p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>
        
        <section className="section bg-brand-surface/30">
          <div className="container-main">
            <SectionHeader
              eyebrow="Facilities"
              title="15,000 Sq Ft Built For Results"
              description="Every zone designed with purpose, from free weights to recovery."
            />
            
            <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {facilities.map((facility) => {
                const Icon = facility.icon;
                return (
                  <StaggerItem key={facility.name}>
                    <Card hover className="group h-full">
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-brand-text mb-2">{facility.name}</h3>
                        <p className="text-brand-textMuted text-sm">{facility.desc}</p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>
        
        <section className="section">
          <div className="container-main">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-heading-xl sm:text-display-sm font-bold text-brand-text mb-6">Training Philosophy</h2>
                <div className="space-y-4 text-brand-textMuted">
                  <p>We believe in evidence-based training that prioritizes progressive overload, proper movement patterns, and sustainable progression.</p>
                  <p>Our programs are built on three pillars: Strength, Mobility, and Conditioning. Whether your goal is building muscle, losing fat, improving athletic performance, or simply feeling better in daily life — our methodology adapts to you.</p>
                  <p>Every member receives a comprehensive movement assessment and personalized program design included with membership. No cookie-cutter templates.</p>
                </div>
              </div>
              <div>
                <h2 className="text-heading-xl sm:text-display-sm font-bold text-brand-text mb-6">Opening Hours</h2>
                <div className="space-y-4">
                  {hours.map((hour) => (
                    <Card key={hour.day} className="bg-brand-surface/50">
                      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="font-medium text-brand-text">{hour.day}</div>
                        <div className="flex items-center gap-4 text-sm text-brand-textMuted">
                          <span>Access: {hour.open} - {hour.close}</span>
                          <span>Staffed: {hour.staffed}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section bg-brand-surface/30">
          <div className="container-main">
            <h2 className="text-heading-xl sm:text-display-sm font-bold text-brand-text text-center mb-12">Contact & Location</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="h-10 w-10 text-brand-accent mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-brand-text mb-2">Visit Us</h3>
                  <p className="text-brand-textMuted">123 Fitness Street<br/>Gym City, GC 12345</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="h-10 w-10 text-brand-accent mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-brand-text mb-2">Call Us</h3>
                  <p className="text-brand-textMuted">+1 (555) 123-4567<br/>Mon-Fri: 9AM-6PM</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="h-10 w-10 text-brand-accent mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-brand-text mb-2">Email Us</h3>
                  <p className="text-brand-textMuted">hello@fitforge.com<br/>support@fitforge.com</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}