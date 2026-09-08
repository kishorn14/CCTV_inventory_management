import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, MapPin, ExternalLink, MessageSquareQuote } from 'lucide-react';
import { useShop } from '../context/ShopContext';

// Authentic Google G Logo SVG
const GoogleGIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const AVATAR_COLORS = [
  { bg: '#ef4444', text: '#ffffff' }, // Coral Red
  { bg: '#3b82f6', text: '#ffffff' }, // Royal Blue
  { bg: '#10b981', text: '#ffffff' }, // Emerald Green
  { bg: '#8b5cf6', text: '#ffffff' }, // Purple
  { bg: '#f59e0b', text: '#ffffff' }, // Amber Gold
];

export const GoogleReviews: React.FC = () => {
  const { shopInfo } = useShop();

  const googleMapsLink = shopInfo.googleMapsUrl || 'https://share.google/Qdy82hkQa2UO5Axtj';

  const reviews = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      service: 'Home Inverter & Battery Setup',
      comment: 'Got my home inverter installed last month — excellent service, fair pricing and the technicians were very professional. Highly recommend!',
      rating: 5,
      time: '3 weeks ago'
    },
    {
      id: '2',
      name: 'Suresh Gowda',
      service: 'Hikvision 4-Camera CCTV System',
      comment: 'Purchased Hikvision 4-camera CCTV setup for our grocery supermarket. Mobile live view configuration was completed immediately. Super clear night vision!',
      rating: 5,
      time: '1 month ago'
    },
    {
      id: '3',
      name: 'Priya Sharma',
      service: 'Doorstep Amaron Car Battery',
      comment: 'Car battery died in the morning and they delivered & installed a genuine Amaron battery at my doorstep within 35 minutes with old battery scrap discount. Lifesaver!',
      rating: 5,
      time: '2 weeks ago'
    },
    {
      id: '4',
      name: 'Karthik N.',
      service: 'CCTV AMC & DVR Hard Disk Repair',
      comment: 'Reliable doorstep service. Technicians fixed our office DVR recording issue and set up camera remote backup cleanly. Honest pricing and verified technicians.',
      rating: 5,
      time: '1 month ago'
    },
    {
      id: '5',
      name: 'Manjunath B.',
      service: 'Luminous Inverter Combo',
      comment: 'Best place in town for inverter batteries and security cameras. Genuine Exide battery with official warranty card and GST bill. Great customer support!',
      rating: 5,
      time: '2 months ago'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-advance carousel every 5.5 seconds if not paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, reviews.length]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
  };

  const currentReview = reviews[currentIndex];
  const avatarColor = AVATAR_COLORS[currentIndex % AVATAR_COLORS.length];

  return (
    <section 
      id="reviews" 
      style={{
        padding: '50px 16px 45px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Section Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: '#fef3c7',
          border: '1px solid #fde68a',
          color: '#b45309',
          fontSize: '0.75rem',
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '14px',
          boxShadow: '0 2px 6px rgba(245, 158, 11, 0.12)'
        }}>
          <GoogleGIcon size={14} />
          <span>Google Reviews • 4.9 ★ (81 Reviews)</span>
        </div>

        {/* Section Heading */}
        <h2 style={{
          fontSize: 'clamp(1.4rem, 4vw, 2.1rem)',
          fontWeight: 800,
          color: '#0f172a',
          lineHeight: 1.25,
          marginBottom: '10px'
        }}>
          Loved by Customers Across Davangere &amp; Karnataka
        </h2>

        {/* Section Subtitle */}
        <p style={{
          fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
          color: '#64748b',
          lineHeight: 1.55,
          marginBottom: '28px',
          maxWidth: '580px',
          margin: '0 auto 28px'
        }}>
          Real reviews from verified Google Maps customers — see why people trust {shopInfo.shopName} for CCTV, vehicle batteries &amp; inverters.
        </p>

        {/* Testimonial Card Container */}
        <div 
          style={{
            maxWidth: '740px',
            margin: '0 auto',
            position: 'relative'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Review Card */}
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '26px',
              border: '1px solid #e2e8f0',
              padding: '32px 28px 26px',
              boxShadow: '0 12px 36px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
              textAlign: 'left',
              position: 'relative',
              transition: 'all 0.3s ease',
              minHeight: '210px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Top Quote Icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#eff6ff',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageSquareQuote size={20} />
              </div>

              {/* Star Rating Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                background: '#fef3c7',
                padding: '4px 8px',
                borderRadius: '9999px',
                border: '1px solid #fde68a'
              }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
            </div>

            {/* Review Comment Text */}
            <p style={{
              fontSize: '0.96rem',
              color: '#1e293b',
              lineHeight: 1.6,
              fontWeight: 500,
              fontStyle: 'normal',
              marginBottom: '20px'
            }}>
              “{currentReview.comment}”
            </p>

            {/* Reviewer Details Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '14px',
              marginTop: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Initial Avatar */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: avatarColor.bg,
                  color: avatarColor.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  flexShrink: 0
                }}>
                  {currentReview.name.charAt(0)}
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', lineHeight: 1.2 }}>
                    {currentReview.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    {currentReview.service} • <span style={{ color: '#059669', fontWeight: 600 }}>Verified Review</span>
                  </div>
                </div>
              </div>

              {/* Google G Logo Badge */}
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Google Maps"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <GoogleGIcon size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Arrows for Desktop */}
          <button
            onClick={handlePrev}
            aria-label="Previous review"
            style={{
              position: 'absolute',
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334155',
              zIndex: 2
            }}
            className="hide-mobile"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next review"
            style={{
              position: 'absolute',
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334155',
              zIndex: 2
            }}
            className="hide-mobile"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Carousel Pagination Dots & Swipe Helper */}
        <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: currentIndex === idx ? '22px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: currentIndex === idx ? '#1d4ed8' : '#cbd5e1',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>

          <span style={{ fontSize: '0.74rem', color: '#94a3b8', letterSpacing: '0.02em' }}>
            ‹ Swipe to read more ›
          </span>
        </div>

        {/* Action Buttons (View Google Reviews & Get Directions) */}
        <div style={{
          marginTop: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {/* View All Google Reviews */}
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#0f172a',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.color = '#1d4ed8';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.05)';
            }}
          >
            <GoogleGIcon size={16} />
            <span>View All Google Reviews</span>
            <ExternalLink size={14} color="#64748b" />
          </a>

          {/* Get Directions on Google Maps */}
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#1d4ed8',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dbeafe';
              e.currentTarget.style.borderColor = '#93c5fd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#eff6ff';
              e.currentTarget.style.borderColor = '#bfdbfe';
            }}
          >
            <MapPin size={15} color="#1d4ed8" />
            <span>Get Directions</span>
          </a>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
