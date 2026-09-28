import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, MapPin, ExternalLink, MessageSquareQuote, CheckCircle2, Image as ImageIcon, X, PenSquare } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { REAL_GOOGLE_REVIEWS } from '../data/shopData';

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
  { bg: '#ef4444', text: '#ffffff' }, // Red
  { bg: '#2563eb', text: '#ffffff' }, // Royal Blue
  { bg: '#059669', text: '#ffffff' }, // Emerald
  { bg: '#7c3aed', text: '#ffffff' }, // Violet
  { bg: '#d97706', text: '#ffffff' }, // Amber
  { bg: '#0891b2', text: '#ffffff' }, // Cyan
];

export const GoogleReviews: React.FC = () => {
  const { shopInfo } = useShop();

  const googleMapsLink = shopInfo.googleMapsUrl || 'https://www.google.com/search?q=Meksha+CCTV+Solutions+%26+Services+Davangere&kgmid=/g/11n09cskt5';
  const writeReviewLink = 'https://www.google.com/search?q=Meksha+CCTV+Solutions+%26+Services+Davangere&kgmid=/g/11n09cskt5#lrd=0x3bba257406a44d2d:0xc752ee16d1ba5293,3,,,';

  const reviews = REAL_GOOGLE_REVIEWS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-advance carousel every 6 seconds if not paused and lightbox closed
  useEffect(() => {
    if (isPaused || previewImage) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, previewImage, reviews.length]);

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
        padding: '55px 16px 50px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Google Reviews Live Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
          marginBottom: '14px'
        }}>
          <GoogleGIcon size={18} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
            Google Rating 4.9
          </span>
          <div style={{ display: 'flex', gap: '1px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            (82 Verified Reviews)
          </span>
        </div>

        {/* Section Heading */}
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
          fontWeight: 800,
          color: '#0f172a',
          lineHeight: 1.25,
          marginBottom: '10px'
        }}>
          Real Reviews from Davangere Customers
        </h2>

        {/* Section Subtitle */}
        <p style={{
          fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
          color: '#64748b',
          lineHeight: 1.55,
          maxWidth: '620px',
          margin: '0 auto 28px'
        }}>
          Directly from our verified <strong>Google Business Profile</strong> — see genuine customer feedback, farm installations, and home CCTV setups across Davangere &amp; Karnataka.
        </p>

        {/* Quick Reviewer Switcher Chips */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          {reviews.map((rev, idx) => (
            <button
              key={rev.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: currentIndex === idx ? 800 : 600,
                background: currentIndex === idx ? '#0f172a' : '#ffffff',
                color: currentIndex === idx ? '#ffffff' : '#475569',
                border: currentIndex === idx ? '1px solid #0f172a' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: currentIndex === idx ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
              }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: currentIndex === idx ? '#38bdf8' : '#cbd5e1'
              }} />
              <span>{rev.name}</span>
              {rev.photos && rev.photos.length > 0 && (
                <ImageIcon size={11} color={currentIndex === idx ? '#38bdf8' : '#94a3b8'} />
              )}
            </button>
          ))}
        </div>

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
              borderRadius: '24px',
              border: '1.5px solid #e2e8f0',
              padding: '28px 26px 24px',
              boxShadow: '0 14px 38px -10px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
              textAlign: 'left',
              position: 'relative',
              transition: 'all 0.3s ease',
              minHeight: '230px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Top Bar: Quote + Stars + Service Tag */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MessageSquareQuote size={20} />
                </div>
                <div style={{
                  background: '#f1f5f9',
                  color: '#0f172a',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700
                }}>
                  {currentReview.service}
                </div>
              </div>

              {/* Star Rating Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                background: '#fef3c7',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: '1px solid #fde68a'
              }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
            </div>

            {/* Review Comment Text */}
            <p style={{
              fontSize: '0.96rem',
              color: '#1e293b',
              lineHeight: 1.65,
              fontWeight: 500,
              fontStyle: 'normal',
              marginBottom: currentReview.photos && currentReview.photos.length > 0 ? '14px' : '20px'
            }}>
              “{currentReview.comment}”
            </p>

            {/* Customer Installation Photos Attached to Review */}
            {currentReview.photos && currentReview.photos.length > 0 && (
              <div style={{
                marginBottom: '18px',
                padding: '12px 14px',
                borderRadius: '14px',
                background: '#f8fafc',
                border: '1px dashed #cbd5e1'
              }}>
                <div style={{
                  fontSize: '0.72rem',
                  color: '#475569',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <ImageIcon size={13} color="#2563eb" />
                  <span>Real Installation Photos ({currentReview.photos.length}) • Click to Enlarge</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {currentReview.photos.map((photo, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setPreviewImage(photo)}
                      title="Click to view full photo"
                      style={{
                        position: 'relative',
                        width: '74px',
                        height: '74px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid #ffffff',
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)',
                        padding: 0,
                        background: '#0f172a',
                        cursor: 'pointer',
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.08)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.12)';
                      }}
                    >
                      <img
                        src={photo}
                        alt={`${currentReview.name} CCTV installation photo`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  {currentReview.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', lineHeight: 1.2 }}>
                      {currentReview.name}
                    </span>
                    {currentReview.badge?.includes('Local Guide') && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        background: '#fff7ed',
                        border: '1px solid #fed7aa',
                        color: '#c2410c',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700
                      }}>
                        ★ Local Guide
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {currentReview.badge && <span>{currentReview.badge}</span>}
                    <span>•</span>
                    <span style={{ color: '#475569' }}>{currentReview.time || currentReview.date}</span>
                    <span>•</span>
                    <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle2 size={12} color="#059669" /> Verified Google Review
                    </span>
                  </div>
                </div>
              </div>

              {/* Google G Logo Badge */}
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                title="View verified review on Google"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.borderColor = '#4285F4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
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
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1e293b',
              zIndex: 2,
              transition: 'all 0.15s ease'
            }}
            className="hide-mobile"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next review"
            style={{
              position: 'absolute',
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1e293b',
              zIndex: 2,
              transition: 'all 0.15s ease'
            }}
            className="hide-mobile"
          >
            <ChevronRight size={20} />
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
                aria-label={`Go to review ${idx + 1}`}
                style={{
                  width: currentIndex === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: currentIndex === idx ? '#2563eb' : '#cbd5e1',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>

          <span style={{ fontSize: '0.74rem', color: '#94a3b8', letterSpacing: '0.02em' }}>
            ‹ Swipe to see more verified reviews ›
          </span>
        </div>

        {/* Action Buttons: View All Reviews, Write a Review, Get Directions */}
        <div style={{
          marginTop: '24px',
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
              e.currentTarget.style.borderColor = '#4285F4';
              e.currentTarget.style.color = '#2563eb';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.05)';
            }}
          >
            <GoogleGIcon size={16} />
            <span>View All 82 Google Reviews</span>
            <ExternalLink size={14} color="#64748b" />
          </a>

          {/* Write a Review on Google */}
          <a
            href={writeReviewLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              padding: '10px 18px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#334155',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#eff6ff';
              e.currentTarget.style.borderColor = '#bfdbfe';
              e.currentTarget.style.color = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#334155';
            }}
          >
            <PenSquare size={15} color="#2563eb" />
            <span>Write a Review</span>
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
            <span>Davangere Store</span>
          </a>
        </div>

      </div>

      {/* Full-size Photo Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 99999
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '85vh',
              background: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <button
              onClick={() => setPreviewImage(null)}
              aria-label="Close photo preview"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
                transition: 'background 0.2s ease'
              }}
            >
              <X size={20} />
            </button>
            <img
              src={previewImage}
              alt="Customer Installation CCTV Photo"
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      )}

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
