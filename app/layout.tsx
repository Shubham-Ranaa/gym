import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'FitForge - Premium Fitness & Gym Management',
    template: '%s | FitForge',
  },
  description: 'Transform your body, elevate your mind. Premium fitness experience with world-class trainers, state-of-the-art equipment, and personalized training programs.',
  keywords: ['gym', 'fitness', 'workout', 'training', 'health', 'wellness', 'membership', 'personal trainer'],
  authors: [{ name: 'FitForge' }],
  creator: 'FitForge',
  publisher: 'FitForge',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fitforge.com',
    siteName: 'FitForge',
    title: 'FitForge - Premium Fitness & Gym Management',
    description: 'Transform your body, elevate your mind. Premium fitness experience.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FitForge Gym',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitForge - Premium Fitness & Gym Management',
    description: 'Transform your body, elevate your mind.',
    images: ['/images/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  metadataBase: new URL(process.env.APP_URL || 'https://fitforge.com'),
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}