'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Dumbbell, Trophy, Users, Clock, Star, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Reveal, SectionHeader, Stagger, StaggerItem } from '@/components/ui/Reveal';

const stats = [
  { value: '500+', label: 'Active Members' },
  { value: '15+', label: 'Expert Trainers' },
  { value: '200+', label: 'Equipment Units' },
  { value: '24/7', label: 'Access Hours' },
];

const features = [
  { icon: Trophy, title: 'World-Class Trainers', desc: 'Certified professionals with years of experience guiding you to your goals.' },
  { icon: Users, title: 'Community Driven', desc: 'Join a supportive community that motivates and celebrates every milestone.' },
  { icon: Clock, title: 'Flexible Hours', desc: 'Open 24/7 with staffed hours to fit your schedule, not the other way around.' },
  { icon: Shield, title: 'Premium Equipment', desc: 'State-of-the-art machines and free weights from top global brands.' },
  { icon: Star, title: 'Personalized Plans', desc: 'Custom workout and nutrition programs tailored to your unique goals.' },
  { icon: CheckCircle, title: 'Results Guaranteed', desc: 'Track progress with advanced metrics and regular assessments.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Software Engineer', content: 'FitForge transformed my fitness journey. The trainers are incredible and the community keeps me accountable. Best decision I made this year!', avatar: 'SC' },
  { name: 'Marcus Johnson', role: 'Entrepreneur', content: 'The 24/7 access is a game changer for my schedule. Equipment is top-tier and never crowded. The app makes tracking progress effortless.', avatar: 'MJ' },
  { name: 'Emily Rodriguez', role: 'Marketing Manager', content: 'Started as a beginner and now I\'m competing in powerlifting. The personalized programming and trainer support made all the difference.', avatar: 'ER' },
];

const faqs = [
  { q: 'What are the membership options?', a: 'We offer Monthly, Quarterly, Half-Yearly, and Yearly plans. All include 24/7 access, all classes, and a free fitness assessment.' },
  { q: 'Can I try before I commit?', a: 'Absolutely! We offer a free 3-day trial pass. Come experience our facilities, meet trainers, and try a class on us.' },
  { q: 'Are personal trainers included?', a: 'Group classes are included in all memberships. Personal training sessions are available as an add-on with certified trainers.' },
  { q: 'What if I need to cancel?', a: 'No long-term contracts on monthly plans. Annual plans can be cancelled with 30 days notice. We\'re flexible because life happens.' },
  { q: 'Is there parking available?', a: 'Yes, we have a dedicated parking lot with 100+ spaces and EV charging stations. Street parking also available.' },
  { q: 'Do you have showers and lockers?', a: 'Premium locker rooms with showers, sauna, towel service, and secure digital lockers are included with every membership.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-brand-surface to-brand-bg" />
            <div className="absolute inset-0 bg-brand-bg/40" />
          </div>
          
          <div className="relative z-10 container-main py-20 lg:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accentBg text-brand-accent border border-brand-accent/30 text-sm font-medium mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                </span>
                Now Open: 24/7 Access for All Members
              </div>
              
              <h1 className="text-display-sm sm:text-display-md lg:text-display-xl font-extrabold tracking-tight text-balance text-brand-text mb-6 animate-slide-up">
                Transform Your Body,{' '}
                <span className="text-gradient">Elevate Your Mind</span>
              </h1>
              
              <p className="text-base sm:text-body-lg text-brand-textMuted max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
                Premium fitness experience with world-class trainers, state-of-the-art equipment, 
                and a community that pushes you further. Your strongest self starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="xl" className="gap-2 w-full sm:w-auto hover:scale-[1.03] active:scale-100 transition-transform">
                    Join the Gym
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/membership" className="w-full sm:w-auto">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto hover:scale-[1.03] active:scale-100 transition-transform">
                    Explore Memberships
                  </Button>
                </Link>
              </div>
              
              <div className="mt-14 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
                {stats.map((stat, i) => (
                  <div key={stat.label} className="text-center relative">
                    {i > 0 && <div className="hidden md:block absolute left-0 top-2 bottom-2 w-px bg-brand-border" aria-hidden="true" />}
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-accent tracking-tight leading-none">{stat.value}</div>
                    <div className="text-brand-textMuted text-xs sm:text-sm font-medium uppercase tracking-wider mt-2 sm:mt-3">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-bg to-transparent z-10 pointer-events-none" />
        </section>
        
        <section className="section bg-brand-surface/30">
          <div className="container-main">
            <SectionHeader
              eyebrow="Why FitForge"
              title="Everything You Need To Win"
              description="A complete fitness ecosystem designed around one goal: your results."
            />
            
            <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <StaggerItem key={feature.title}>
                    <Card hover className="group h-full">
                      <CardContent className="p-6 sm:p-7 h-full flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-brand-accentBg text-brand-accent flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-brand-bg transition-all duration-300">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-brand-text mb-2">{feature.title}</h3>
                        <p className="text-brand-textMuted text-sm">{feature.desc}</p>
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
            <SectionHeader
              eyebrow="Testimonials"
              title="Real Results From Real People"
              description="Members who transformed their fitness journey with us."
            />
            
            <Stagger className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <StaggerItem key={testimonial.name}>
                  <Card hover className="h-full">
                    <CardContent className="p-6 sm:p-7 flex flex-col h-full">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-brand-accent text-brand-accent" />
                        ))}
                      </div>
                      <p className="text-brand-textMuted mb-6 flex-1 text-body-sm">&ldquo;{testimonial.content}&rdquo;</p>
                      <div className="flex items-center gap-3 pt-4 border-t border-brand-border">
                        <div className="w-11 h-11 rounded-full bg-brand-accentBg text-brand-accent flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {testimonial.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-brand-text truncate">{testimonial.name}</div>
                          <div className="text-sm text-brand-textDim truncate">{testimonial.role}</div>
                        </div>
                      </div>
                      <p className="text-xs text-brand-textDim mt-4">* Demo testimonial for demonstration purposes</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
        
        <section className="section bg-brand-surface/30">
          <div className="container-main">
            <SectionHeader
              eyebrow="FAQ"
              title="Frequently Asked Questions"
              description="Quick answers to common questions about our gym."
            />
            
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 0.05} y={16}>
                  <Card hover>
                    <CardContent className="p-5 sm:p-6">
                      <details className="group">
                        <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-brand-text">
                          {faq.q}
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accentBg text-brand-accent flex items-center justify-center transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                            </svg>
                          </span>
                        </summary>
                        <div className="mt-4 pt-4 border-t border-brand-border text-brand-textMuted text-body-sm animate-slide-down">{faq.a}</div>
                      </details>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        
        <section className="section">
          <div className="container-main">
            <Reveal>
              <Card className="relative overflow-hidden bg-gradient-to-br from-brand-accentBg via-brand-surface to-brand-bg border-brand-accent/30">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-accent/10 blur-3xl" aria-hidden="true" />
                <CardContent className="relative p-8 sm:p-12 lg:p-16 text-center">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-heading-xl sm:text-display-sm font-extrabold tracking-tight text-balance text-brand-text mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-base sm:text-body-lg text-brand-textMuted mb-8">Join 500+ members achieving their fitness goals. No commitment trial available.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link href="/register" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto gap-2 hover:scale-[1.03] active:scale-100 transition-transform">
                          Start Free Trial
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                      <Link href="/contact" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-brand-accent text-brand-accent hover:bg-brand-accentBg">Contact Us</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
