'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const faqCategories = [
  {
    id: 'membership',
    title: 'Membership & Billing',
    icon: HelpCircle,
    faqs: [
      { q: 'What membership plans do you offer?', a: 'We offer Monthly (₹2,999/mo), Quarterly (₹7,999/3mo), Half-Yearly (₹14,999/6mo), and Yearly (₹26,999/yr) plans. All include 24/7 access, group classes, and a free fitness assessment.' },
      { q: 'Can I try before I commit?', a: 'Yes! We offer a free 3-day trial pass. Visit our front desk or sign up online to activate your trial. No credit card required.' },
      { q: 'Can I upgrade or downgrade my plan?', a: 'Absolutely. Upgrades take effect immediately with prorated billing. Downgrades take effect at your next billing cycle. No change fees.' },
      { q: 'What is your cancellation policy?', a: 'Monthly plans can be cancelled anytime with no fee. Quarterly, Half-Yearly, and Yearly plans require 30 days notice — no penalties, just pay for time used.' },
      { q: 'Do you offer refunds?', a: 'We don\'t offer refunds for unused time, but you can cancel before your next billing cycle. Medical situations are reviewed case-by-case with documentation.' },
      { q: 'Are there any hidden fees?', a: 'No hidden fees. No enrollment fees, no maintenance fees, no cancellation fees. The price you see is the price you pay.' },
      { q: 'Do you offer student or corporate discounts?', a: 'Yes! Students get 15% off with valid ID. Corporate partnerships (10+ employees) get 20% off. Contact us for details.' },
      { q: 'Can I freeze my membership?', a: 'Yearly members can freeze for up to 2 weeks/year. Other plans can purchase a freeze add-on (₹499/mo). Medical freezes require documentation.' },
    ],
  },
  {
    id: 'facility',
    title: 'Facility & Access',
    icon: HelpCircle,
    faqs: [
      { q: 'What are your hours?', a: '24/7 member access. Staffed hours: Mon-Fri 6AM-10PM, Sat 8AM-8PM, Sun 8AM-6PM. Front desk assistance available during staffed hours.' },
      { q: 'Is parking available?', a: 'Yes, we have a dedicated lot with 100+ spaces and 4 EV charging stations. Street parking also available on Fitness Street.' },
      { q: 'Do you have showers and lockers?', a: 'Premium locker rooms with showers, sauna, towel service, and secure digital lockers included with every membership.' },
      { q: 'Is there WiFi?', a: 'High-speed WiFi throughout the facility. Network: FitForge_Member, password provided at check-in.' },
      { q: 'Can I bring a guest?', a: 'Monthly: 2 guest passes/month. Quarterly: 4/month. Half-Yearly: 6/month. Yearly: Unlimited. Guests must sign waiver and be 18+.' },
      { q: 'What equipment do you have?', a: '150+ dumbbells (5-150lbs), 30+ plate-loaded machines, 20+ cable stations, 30+ cardio pieces, functional turf, Olympic platforms, and more.' },
      { q: 'Is the gym wheelchair accessible?', a: 'Yes, fully ADA compliant with ramp access, elevator, accessible equipment, and adaptive training programs available.' },
    ],
  },
  {
    id: 'training',
    title: 'Training & Classes',
    icon: HelpCircle,
    faqs: [
      { q: 'Are group classes included?', a: 'Yes! 40+ weekly classes (HIIT, Yoga, Spin, Strength, Mobility, Pilates) are included in all memberships. No extra fees.' },
      { q: 'Do I need to book classes?', a: 'Popular classes (Spin, HIIT) require booking via our app. Yoga and Mobility are first-come, first-served. Book up to 7 days ahead.' },
      { q: 'How does personal training work?', a: 'Certified trainers available for 1-on-1 sessions. Packages start at ₹3,499/session. Includes assessment, custom program, nutrition guidance, and progress tracking.' },
      { q: 'Can I get a custom workout plan?', a: 'Yes! Every member receives a free fitness assessment and personalized program design with membership. Updated quarterly.' },
      { q: 'What if I\'m a beginner?', a: 'Perfect! We specialize in beginners. Free onboarding session, beginner-friendly classes, and trainers always available for form checks.' },
      { q: 'Do you offer nutrition coaching?', a: 'Monthly nutrition check-ins included in Half-Yearly/Yearly plans. Standalone nutrition coaching: ₹2,999/month with Precision Nutrition certified coaches.' },
    ],
  },
  {
    id: 'general',
    title: 'General',
    icon: HelpCircle,
    faqs: [
      { q: 'What should I bring for my first visit?', a: 'Comfortable workout clothes, athletic shoes, water bottle, and a towel. We provide lockers, towels, and toiletries.' },
      { q: 'Is there an age requirement?', a: 'Minimum age is 16 with parental consent. 18+ for independent membership. Youth programs available for ages 12-15 with trainer supervision.' },
      { q: 'Do you have a dress code?', a: 'Athletic wear and closed-toe athletic shoes required. No jeans, boots, sandals, or offensive clothing. Shirts must be worn at all times.' },
      { q: 'Can I use chalk?', a: 'Liquid chalk only. Powder chalk creates cleanup issues and affects air quality. Liquid chalk stations available near lifting platforms.' },
      { q: 'What\'s your COVID/safety policy?', a: 'Enhanced cleaning protocols, hand sanitizer stations throughout, equipment spaced for comfort. Masks optional. Stay home if unwell.' },
      { q: 'How do I update my account info?', a: 'Log into the member portal at /member/profile or visit the front desk during staffed hours. Email/phone changes require verification.' },
      { q: 'What is the QR check-in system?', a: 'Scan the QR code at the entrance with your phone, log in, and tap "Check In". The system records your entry/exit automatically. Demo feature.' },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('membership');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const currentCategory = faqCategories.find(c => c.id === activeCategory)!;
  const filteredFAQs = currentCategory.faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const toggleExpand = (question: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(question)) next.delete(question);
      else next.add(question);
      return next;
    });
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        <section className="relative py-20 lg:py-28 bg-brand-surface/30 overflow-hidden">`n          <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-accent/[0.06] blur-[110px]" aria-hidden="true" />
          <div className="container-main text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent mb-3">Help Center</span>
            <h1 className="text-display-sm sm:text-display-md font-extrabold tracking-tight text-balance text-brand-text mb-6">Frequently Asked Questions</h1>
            <p className="text-body-lg text-brand-textMuted">
              Quick answers to common questions. Can't find what you're looking for? <a href="/contact" className="link">Contact us</a>
            </p>
          </div>
        </section>
        
        <section className="section">
          <div className="container-main">
            <div className="grid lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textDim" />
                      <input
                        type="search"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-brand-border text-brand-text placeholder-brand-textDim rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
                      />
                    </div>
                    
                    <nav aria-label="FAQ categories">
                      <ul className="space-y-1">
                        {faqCategories.map((cat) => (
                          <li key={cat.id}>
                            <button
                              onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                              className={`
                                w-full text-left px-4 py-3 rounded-xl font-medium transition-all
                                ${activeCategory === cat.id
                                  ? 'bg-brand-accentBg text-brand-accent border border-brand-accent/30'
                                  : 'text-brand-textMuted hover:text-brand-text hover:bg-brand-surfaceHover'
                                }
                              `}
                            >
                              {cat.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </CardContent>
                </Card>
              </aside>
              
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => {
                    const isExpanded = expandedItems.has(faq.q);
                    return (
                      <Card key={faq.q} className={isExpanded ? 'border-brand-accent/30 ring-1 ring-brand-accent/20' : ''}>
                        <CardContent className="p-0">
                          <details className={isExpanded ? 'open' : ''}>
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                              <span className="font-medium text-brand-text pr-4">{faq.q}</span>
                              <ChevronDown className={`h-5 w-5 text-brand-textMuted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </summary>
                            <div className="px-6 pb-6 text-brand-textMuted animate-slide-down border-t border-brand-border">
                              {faq.a}
                            </div>
                          </details>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {filteredFAQs.length === 0 && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <HelpCircle className="h-12 w-12 text-brand-textDim mx-auto mb-4" />
                        <p className="text-brand-textMuted">No matching questions found. Try a different search term or category.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="mt-12 text-center">
                  <p className="text-brand-textMuted mb-4">Still have questions?</p>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}