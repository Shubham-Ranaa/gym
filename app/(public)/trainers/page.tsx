'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, Calendar, Star, BadgeCheck, Users, Dumbbell } from 'lucide-react';
import { Reveal, SectionHeader, Stagger, StaggerItem } from '@/components/ui/Reveal';

const trainers = [
  {
    id: '1',
    name: 'Alex Morgan',
    specialization: ['Strength Training', 'Powerlifting', 'Athletic Performance'],
    experience: 12,
    certifications: ['NSCA CSCS', 'USAW Level 2', 'CF-L2'],
    bio: 'Former collegiate strength coach with a passion for building raw strength. Alex has coached 50+ national-level powerlifters and helps everyday athletes unlock their potential.',
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Jordan Rivera',
    specialization: ['HIIT', 'Functional Fitness', 'Weight Loss'],
    experience: 8,
    certifications: ['NASM CPT', 'CrossFit L2', 'Precision Nutrition L1'],
    bio: 'High-energy coach specializing in metabolic conditioning and body recomposition. Jordan\'s classes are famous for pushing limits while keeping it fun and accessible.',
    photo: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Dr. Sam Chen',
    specialization: ['Rehabilitation', 'Mobility', 'Corrective Exercise'],
    experience: 15,
    certifications: ['DPT', 'FMS Certified', 'DNS Practitioner', 'CSCS'],
    bio: 'Physical therapist turned performance coach. Sam bridges the gap between rehab and performance, helping members move pain-free and build resilient bodies.',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Maya Patel',
    specialization: ['Yoga', 'Pilates', 'Mind-Body Connection'],
    experience: 10,
    certifications: ['RYT-500', 'PMA-CPT', 'Yoga Therapy'],
    bio: 'Former dancer with a decade of teaching experience. Maya blends traditional yoga with modern movement science for mobility, recovery, and mental clarity.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '5',
    name: 'Chris Thompson',
    specialization: ['Bodybuilding', 'Hypertrophy', 'Nutrition'],
    experience: 11,
    certifications: ['IFBB Pro', 'ISSA Master Trainer', 'Precision Nutrition L2'],
    bio: 'Natural bodybuilding champion and nutrition expert. Chris designs science-backed hypertrophy programs and sustainable nutrition strategies for aesthetic goals.',
    photo: 'https://images.unsplash.com/photo-1566251577-5c7d8b5e6e8d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '6',
    name: 'Taylor Kim',
    specialization: ['Olympic Lifting', 'Sports Performance', 'Speed & Agility'],
    experience: 9,
    certifications: ['USAW Level 1', 'CSCS', 'EXOS XPS'],
    bio: 'Former track athlete turned Olympic lifting specialist. Taylor develops explosive power and speed for athletes across football, basketball, and track & field.',
    photo: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1c?w=400&h=400&fit=crop&crop=face',
  },
];

export default function TrainersPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        <section className="py-20 lg:py-28 bg-brand-surface/30 border-b border-brand-border/50">
          <div className="container-main text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent mb-3">The Team</span>
            <h1 className="text-display-sm sm:text-display-md font-extrabold tracking-tight text-balance text-brand-text mb-6">Meet Our Trainers</h1>
            <p className="text-base sm:text-body-lg text-brand-textMuted">
              Certified experts dedicated to your success. 75+ combined years of experience across every fitness discipline.
            </p>
          </div>
        </section>
        
        <section className="section">
          <div className="container-main">
            <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.map((trainer) => (
                <StaggerItem key={trainer.id}>
                  <Card hover className="group overflow-hidden h-full">
                    <div className="relative h-60 sm:h-64 overflow-hidden">
                      <img
                        src={trainer.photo}
                      alt={trainer.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent" />
                  </div>
                  <CardContent className="p-6 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-brand-text">{trainer.name}</h3>
                      <Badge variant="info">{trainer.experience}+ yrs</Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {trainer.specialization.map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                      ))}
                    </div>
                    
                    <p className="text-brand-textMuted text-sm mb-4 line-clamp-3">{trainer.bio}</p>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.certifications.map((cert) => (
                        <span key={cert} className="inline-flex items-center gap-1 text-xs text-brand-textDim px-2 py-1 rounded-lg bg-brand-bg/60 border border-brand-border/60">
                          <Award className="h-3 w-3 text-brand-accent" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
        
        <section className="section bg-brand-surface/30">
          <div className="container-main">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <Card>
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck className="h-7 w-7" />
                  </div>
                  <div className="text-4xl font-extrabold text-brand-accent mb-2">100%</div>
                  <div className="text-brand-textMuted">Certified Trainers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center mx-auto mb-4">
                    <Award className="h-7 w-7" />
                  </div>
                  <div className="text-4xl font-extrabold text-brand-accent mb-2">75+</div>
                  <div className="text-brand-textMuted">Years Experience</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center mx-auto mb-4">
                    <Users className="h-7 w-7" />
                  </div>
                  <div className="text-4xl font-extrabold text-brand-accent mb-2">500+</div>
                  <div className="text-brand-textMuted">Members Trained</div>
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