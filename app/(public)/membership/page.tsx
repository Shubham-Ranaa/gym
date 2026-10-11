'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, XCircle, Dumbbell, Users, Clock, Shield, Star, Heart, Flame, Trophy } from 'lucide-react';
import { Reveal, SectionHeader, Stagger, StaggerItem } from '@/components/ui/Reveal';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 2999,
    period: '/month',
    popular: false,
    features: [
      '24/7 Gym Access',
      'All Group Classes',
      'Free Fitness Assessment',
      'Locker Room Access',
      'Mobile App Access',
      'Guest Passes (2/month)',
    ],
    notIncluded: [
      'Personal Training Sessions',
      'Nutrition Coaching',
      'Body Composition Scans',
      'Priority Class Booking',
    ],
    cta: 'Start Monthly',
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 7999,
    period: '/3 months',
    popular: true,
    savings: 'Save 11%',
    features: [
      'Everything in Monthly',
      'Priority Class Booking',
      'Body Composition Scan (1/quarter)',
      'Guest Passes (4/month)',
      'Nutrition Guide Access',
      'Workout Program Library',
    ],
    notIncluded: [
      'Personal Training Sessions',
      '1-on-1 Nutrition Coaching',
      'Advanced Metabolic Testing',
    ],
    cta: 'Most Popular',
  },
  {
    id: 'half-yearly',
    name: 'Half Yearly',
    price: 14999,
    period: '/6 months',
    popular: false,
    savings: 'Save 17%',
    features: [
      'Everything in Quarterly',
      '1 Personal Training Session/month',
      'Monthly Body Composition Scan',
      'Custom Workout Program',
      'Guest Passes (6/month)',
      'Nutrition Coaching (monthly check-in)',
      'Advanced Recovery Access',
    ],
    notIncluded: [
      'Unlimited Personal Training',
      'Metabolic Testing',
      'Competition Prep Coaching',
    ],
    cta: 'Best Value',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 26999,
    period: '/year',
    popular: false,
    savings: 'Save 25%',
    features: [
      'Everything in Half Yearly',
      '2 Personal Training Sessions/month',
      'Bi-weekly Body Composition Scans',
      'Unlimited Nutrition Coaching',
      'Unlimited Guest Passes',
      'Metabolic Testing (quarterly)',
      'Competition Prep Support',
      'Exclusive Member Events',
      'Freeze Membership (2 weeks/year)',
    ],
    notIncluded: [],
    cta: 'Go All In',
  },
];

const faqs = [
  { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change plans at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the next billing cycle.' },
  { q: 'Is there a cancellation fee?', a: 'Monthly plans can be cancelled anytime with no fee. Quarterly, Half-Yearly, and Yearly plans can be cancelled with 30 days notice — no penalties, just pay for time used.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. Auto-pay is available for convenience.' },
  { q: 'Can I freeze my membership?', a: 'Yearly members can freeze for up to 2 weeks per year. Other plans can purchase a freeze add-on for ₹499/month. Medical freezes require documentation.' },
  { q: 'Are there any hidden fees?', a: 'No hidden fees. The price you see is the price you pay. No enrollment fees, no maintenance fees, no cancellation fees.' },
  { q: 'Do you offer student/corporate discounts?', a: 'Yes! Students get 15% off with valid ID. Corporate partnerships (10+ employees) get 20% off. Contact us for details.' },
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        <section className="relative py-20 lg:py-28 bg-brand-surface/30 overflow-hidden">
          <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-accent/[0.06] blur-[110px]" aria-hidden="true" />
          <div className="relative container-main text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent mb-3">Pricing</span>
            <h1 className="text-display-sm sm:text-display-md font-extrabold tracking-tight text-balance text-brand-text mb-6">Membership Plans</h1>
            <p className="text-base sm:text-body-lg text-brand-textMuted">
              Choose the plan that fits your goals. No hidden fees, no long-term contracts unless you want them.
            </p>
          </div>
        </section>
        
        <section className="section">
          <div className="container-main">
            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {plans.map((plan) => (
                <StaggerItem key={plan.id}>
                  <Card 
                    hover
                    className={`h-full flex flex-col ${plan.popular ? 'border-brand-accent/60 ring-1 ring-brand-accent/25 lg:scale-[1.02]' : ''}`}
                  >
                    {plan.popular && (
                      <div className="w-full bg-brand-accent border-b border-brand-accent px-6 py-1.5 text-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-bg">Most Popular</span>
                      </div>
                    )}
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-brand-text mb-3">{plan.name}</h3>
                      <div className="mb-3 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold tracking-tight text-brand-text">₹{plan.price.toLocaleString()}</span>
                        <span className="text-brand-textMuted text-sm">{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-brand-successBg text-brand-success border border-brand-success/30 text-xs font-semibold mb-5">
                          <CheckCircle className="h-3 w-3" />
                          {plan.savings}
                        </span>
                      )}
                      
                      <ul className="space-y-2.5 mb-2 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm text-brand-textMuted">
                            <CheckCircle className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {plan.notIncluded.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm text-brand-textDim">
                            <XCircle className="h-4 w-4 text-brand-textDim flex-shrink-0 mt-0.5" />
                            <span className="line-through">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? 'primary' : 'outline'}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
        
        <section className="section bg-brand-surface/30">
          <div className="container-main">
            <SectionHeader title="Membership FAQ" description="Everything you need to know before joining." />
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-brand-text">
                        {faq.q}
                        <svg className="h-5 w-5 text-brand-textMuted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-4 text-brand-textMuted animate-slide-down">{faq.a}</div>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="section">
          <div className="container-main">
            <Card className="bg-gradient-to-br from-brand-accentBg via-brand-surface to-brand-bg border-brand-accent/30">
              <CardContent className="p-8 md:p-12 lg:p-16 text-center">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-heading-xl sm:text-display-sm font-bold text-brand-text mb-4">Not Sure Which Plan?</h2>
                  <p className="text-body-lg text-brand-textMuted mb-8">Book a free consultation with our membership advisors. We'll help you find the perfect fit.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="w-full sm:w-auto gap-2" onClick={() => window.location.href = '/contact'}>
                      Book Free Consultation
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-brand-accent text-brand-accent hover:bg-brand-accentBg" onClick={() => window.location.href = '/register'}>
                      Try 3 Days Free
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}