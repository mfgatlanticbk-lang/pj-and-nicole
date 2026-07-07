'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSiteConfig } from '@/hooks/use-site-config';
import Image from 'next/image';

interface HeroProps {
  onOpen: () => void;
  visible: boolean;
}

// Palette mapped directly to the motif CSS vars defined in globals.css
// --color-motif-deep    #A6846A  warm brown — headings / strong accents
// --color-motif-medium  #C2A489  classic beige — body / mid tones
// --color-motif-accent  #E5CFA7  champagne gold — buttons / highlights
// --color-motif-cream   #F7F3EE  soft ivory — background / text on dark
// --color-motif-soft    #EADBC8  light beige — cards / subtle fills
// --color-motif-silver  #EDE6DD  neutral divider — borders / ghost tones
const palette = {
  deep:    'var(--color-motif-deep)',    // #A6846A
  medium:  'var(--color-motif-medium)',  // #C2A489
  accent:  'var(--color-motif-accent)',  // #E5CFA7
  cream:   'var(--color-motif-cream)',   // #F7F3EE
  soft:    'var(--color-motif-soft)',    // #EADBC8
  silver:  'var(--color-motif-silver)',  // #EDE6DD
};

// Raw hex values for use inside rgba() where CSS vars cannot be used
const hex = {
  deep:   '166, 132, 106',  // #A6846A
  medium: '194, 164, 137',  // #C2A489
  accent: '229, 207, 167',  // #E5CFA7
  cream:  '247, 243, 238',  // #F7F3EE
  soft:   '234, 219, 200',  // #EADBC8
  silver: '237, 230, 221',  // #EDE6DD
};


const desktopImages: string[] = [
  '/desktop_slide/couple 1.jpg',
  '/desktop_slide/couple 2.jpg',
  '/desktop_slide/couple 3.jpg',
  '/desktop_slide/couple 4.jpg',
  '/desktop_slide/couple 5.jpg',
  '/desktop_slide/couple 6.jpg',
  '/desktop_slide/couple 7.jpg',
];

const mobileImages: string[] = [
'/mobile_slide/couple 1.jpg',
'/mobile_slide/couple 2.jpg',
'/mobile_slide/couple 3.jpg',
'/mobile_slide/couple 4.jpg',
'/mobile_slide/couple 5.jpg',
'/mobile_slide/couple 6.jpg',
'/mobile_slide/couple 7.jpg',
];

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {
  const siteConfig = useSiteConfig();
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(max-width: 768px)');
    const handleChange = () => setIsMobile(media.matches);
    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % 5);
    }, 5500);
    return () => clearInterval(timer);
  }, [mounted]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setContentVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gentleFloat {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-8px);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const images = useMemo(() => (isMobile ? mobileImages : desktopImages), [isMobile]);

  return (
      <div className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
            style={{
              transform: i === index ? 'scale(1)' : 'scale(1.05)',
              transition: 'opacity 1s ease-in-out, transform 1s ease-in-out'
            }}
          >
            <Image
              src={src}
              alt="Couple"
              fill
              quality={90}
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
        
        {/* Top warm veil — deep warm brown fades into champagne gold, then clears */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(${hex.deep}, 0.30) 0%,
              rgba(${hex.accent}, 0.12) 35%,
              transparent 60%
            )`
          }}
        />

        {/* Bottom ivory lift — cream rises from below to keep text legible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              to top,
              rgba(${hex.deep}, 0.72) 0%,
              rgba(${hex.medium}, 0.38) 30%,
              rgba(${hex.deep}, 0.10) 55%,
              transparent 70%
            )`
          }}
        />

        {/* Vignette — warm-beige edges draw the eye to the centre */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse at center,
              transparent 30%,
              rgba(${hex.medium}, 0.18) 65%,
              rgba(${hex.deep}, 0.32) 100%
            )`
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 w-full max-w-md mx-auto h-full">
        
        {/* Top Logo/Monogram */}
        <div 
          className={`mb-auto mt-8 transition-all duration-1000 ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
            {/* Monogram Image with subtle animation */}
            <div 
              className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 transition-transform duration-700 ease-out hover:scale-105"
              style={{
                animation: contentVisible ? 'gentleFloat 3s ease-in-out infinite' : 'none'
              }}
            >
              <Image
                src={siteConfig.couple.monogram}
                alt="Monogram"
                fill
                className="object-contain"
                priority
                style={{
                  filter: `brightness(0) saturate(100%) invert(100%) drop-shadow(0 8px 20px rgba(${hex.accent}, 0.70))`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-center justify-end w-full gap-5 sm:gap-6 pb-14 sm:pb-16 md:pb-20">
          <h2
            className={`text-6xl md:text-8xl transform -rotate-6 transition-all duration-1000 ease-out delay-200 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontWeight: 400,
              color: palette.cream,
              textShadow: `0 0 18px rgba(${hex.cream}, 0.9), 0 2px 8px rgba(${hex.deep}, 0.4)`,
            }}
          >
            You are
          </h2>
          
          <h1
            className={`text-5xl md:text-7xl font-bold tracking-wider uppercase transition-all duration-1000 ease-out delay-300 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              color: palette.cream,
              textShadow: `0 0 22px rgba(${hex.cream}, 0.95), 0 3px 12px rgba(${hex.deep}, 0.45)`,
              letterSpacing: '0.05em',
            }}
          >
            Invited!
          </h1>

          <button 
            onClick={() => {
              onOpen();
            }}
            className={`px-10 py-4 font-serif text-sm tracking-[0.2em] uppercase rounded-sm border transition-all duration-500 ease-out delay-500 shadow-lg hover:shadow-xl ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              backgroundColor: palette.deep,   // champagne gold
              borderColor: palette.medium,        // classic beige border
              color: palette.cream,                // warm brown text
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = palette.soft;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = palette.deep;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = palette.accent;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = palette.medium;
            }}
          >
            <span
              style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, color: palette.cream, letterSpacing: '0.18em' }}
            >
              Open Invitation
            </span>
          </button>
        </div>

        {/* Bottom Spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
};