'use client';

import Link from 'next/link';
import { Dumbbell, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    Company: [
      { href: '/about', label: 'About Us' },
      { href: '/trainers', label: 'Our Trainers' },
      { href: '/membership', label: 'Membership' },
      { href: '/gallery', label: 'Gallery' },
    ],
    Support: [
      { href: '/contact', label: 'Contact Us' },
      { href: '/faq', label: 'FAQ' },
      { href: '/login', label: 'Member Login' },
      { href: '/register', label: 'Register' },
    ],
    Legal: [
      { href: '#', label: 'Privacy Policy' },
      { href: '#', label: 'Terms of Service' },
      { href: '#', label: 'Cookie Policy' },
    ],
  };
  
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];
  
  const contactInfo = [
    { icon: MapPin, text: '123 Fitness Street, Gym City, GC 12345' },
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: Mail, text: 'hello@fitforge.com' },
    { icon: Clock, text: 'Mon-Fri: 5AM-11PM | Sat-Sun: 7AM-9PM' },
  ];
  
  return (
    <footer className="bg-brand-bg border-t border-brand-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6" aria-label="FitForge Home">
              <Dumbbell className="h-10 w-10 text-brand-accent" />
              <span className="text-2xl font-bold text-brand-text">FitForge</span>
            </Link>
            <p className="text-brand-textMuted max-w-xs mb-6">
              Transform your body, elevate your mind. Premium fitness experience with world-class trainers and state-of-the-art equipment.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2 rounded-xl bg-brand-surface border border-brand-border text-brand-textMuted hover:text-brand-accent hover:border-brand-accent transition-all"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-brand-text mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.Company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-textMuted hover:text-brand-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-brand-text mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.Support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-textMuted hover:text-brand-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-brand-text mb-4">Contact</h4>
            <ul className="space-y-3">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-brand-textMuted">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-brand-accent" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-brand-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-brand-textDim text-sm">
            © {new Date().getFullYear()} FitForge. All rights reserved. Demo application for educational purposes.
          </p>
          <p className="text-brand-textDim text-sm">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}