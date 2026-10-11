'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { X, ChevronLeft, ChevronRight, Expand, Camera, Dumbbell, Users, Flame, Heart } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import Image from 'next/image';

const categories = ['All', 'Facility', 'Equipment', 'Classes', 'Community', 'Events'];

const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop', alt: 'Main training floor', category: 'Facility' },
  { id: 2, src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', alt: 'Free weights area', category: 'Equipment' },
  { id: 3, src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop', alt: 'Yoga class', category: 'Classes' },
  { id: 4, src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop', alt: 'Cardio equipment', category: 'Equipment' },
  { id: 5, src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop', alt: 'Group training', category: 'Classes' },
  { id: 6, src: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop', alt: 'Member community', category: 'Community' },
  { id: 7, src: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&h=600&fit=crop', alt: 'Strength training', category: 'Equipment' },
  { id: 8, src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop', alt: 'Functional training zone', category: 'Facility' },
  { id: 9, src: 'https://images.unsplash.com/photo-1599901860904-17e6ed79d3b7?w=800&h=600&fit=crop', alt: 'Fitness event', category: 'Events' },
  { id: 10, src: 'https://images.unsplash.com/photo-1566251577-5c7d8b5e6e8d?w=800&h=600&fit=crop', alt: 'Personal training', category: 'Community' },
  { id: 11, src: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=600&fit=crop', alt: 'Recovery area', category: 'Facility' },
  { id: 12, src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1c?w=800&h=600&fit=crop', alt: 'Olympic lifting', category: 'Classes' },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);
  
  const handleLightboxOpen = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const handleLightboxClose = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') handleLightboxClose();
    if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
    if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev + 1) % filteredImages.length);
  };
  
  return (
    <div className="min-h-screen" onKeyDown={handleKeyDown}>
      <Navbar />
      
      <main className="pt-16">
        <section className="relative py-20 lg:py-28 bg-brand-surface/30 overflow-hidden">`n          <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-accent/[0.06] blur-[110px]" aria-hidden="true" />
          <div className="container-main text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent mb-3">Inside FitForge</span>
            <h1 className="text-display-sm sm:text-display-md font-extrabold tracking-tight text-balance text-brand-text mb-6">Gallery</h1>
            <p className="text-body-lg text-brand-textMuted">
              Explore our facility, community, and the FitForge experience through our curated collection.
            </p>
          </div>
        </section>
        
        <section className="section">
          <div className="container-main">
            <div className="flex flex-wrap gap-2 justify-center mb-8 lg:mb-10">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className={activeCategory === cat ? '' : 'opacity-70 hover:opacity-100'}
                >
                  {cat}
                </Button>
              ))}
            </div>
            
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <StaggerItem key={image.id}>
                  <div
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
                    onClick={() => handleLightboxOpen(index)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/85 via-brand-bg/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-brand-text font-medium text-sm truncate">{image.alt}</p>
                          <Badge variant="outline" className="text-xs mt-1">{image.category}</Badge>
                        </div>
                        <Expand className="h-5 w-5 text-brand-accent flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            
            {filteredImages.length === 0 && (
              <div className="text-center py-20">
                <Camera className="h-16 w-16 text-brand-textDim mx-auto mb-4" />
                <p className="text-brand-textMuted">No images in this category yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={handleLightboxClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-brand-surface/50 hover:bg-brand-surface text-brand-text transition-colors"
            onClick={(e) => { e.stopPropagation(); handleLightboxClose(); }}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          
          <button
            className="absolute left-6 p-2 rounded-full bg-brand-surface/50 hover:bg-brand-surface text-brand-text transition-colors hidden sm:block"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            className="absolute right-6 p-2 rounded-full bg-brand-surface/50 hover:bg-brand-surface text-brand-text transition-colors hidden sm:block"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % filteredImages.length); }}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          <div className="relative max-w-5xl max-h-[90vh] w-full px-4">
            <Image
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].alt}
              width={1200}
              height={900}
              className="rounded-xl"
              priority
            />
            <div className="mt-4 text-center text-brand-textMuted">
              <p className="font-medium">{filteredImages[lightboxIndex].alt}</p>
              <Badge variant="outline" className="ml-2">{filteredImages[lightboxIndex].category}</Badge>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:hidden">
            <button
              className="p-2 rounded-full bg-brand-surface/50 hover:bg-brand-surface text-brand-text"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length); }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="p-2 rounded-full bg-brand-surface/50 hover:bg-brand-surface text-brand-text"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % filteredImages.length); }}
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
