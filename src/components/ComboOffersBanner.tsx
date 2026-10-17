import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, ChevronLeft, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ComboOffer } from '../types';

interface ComboOffersBannerProps {
  onOpenEstimator?: () => void;
}

export const ComboOffersBanner: React.FC<ComboOffersBannerProps> = ({ onOpenEstimator }) => {
  const { comboOffers, shopInfo } = useShop();
  const activeOffers = comboOffers.filter(offer => offer.active);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (activeOffers.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeOffers.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [activeOffers.length, isPaused]);

  // Sync scroll position when index changes
  useEffect(() => {
    if (sliderRef.current && sliderRef.current.children[currentIndex]) {
      const targetChild = sliderRef.current.children[currentIndex] as HTMLElement;
      targetChild.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentIndex]);

  if (!activeOffers || activeOffers.length === 0) {
    return null;
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + activeOffers.length) % activeOffers.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % activeOffers.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // Swiped left -> next
      setCurrentIndex(prev => (prev + 1) % activeOffers.length);
    } else if (diff < -50) {
      // Swiped right -> prev
      setCurrentIndex(prev => (prev - 1 + activeOffers.length) % activeOffers.length);
    }
    setTimeout(() => setIsPaused(false), 2500);
  };

  const handleOrderComboWhatsApp = (combo: ComboOffer) => {
    const savings = combo.regularPrice - combo.offerPrice;
    const message = `👋 Hello Meksha CCTV Solutions,\n\nI want to order this special combo package:\n🌟 *${combo.title}*\n💰 *Offer Price: ₹${combo.offerPrice.toLocaleString('en-IN')}* (Regular: ~₹${combo.regularPrice.toLocaleString('en-IN')}~, Save ₹${savings.toLocaleString('en-IN')})\n\n📦 *Package Includes:*\n${combo.items.map(item => `• ${item}`).join('\n')}\n\nPlease share availability and setup timeline for Davanagere. Thank you!`;
    
    const whatsappNum = shopInfo.whatsappPhone?.replace(/[^0-9]/g, '') || '919482594191';
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getGradientStyle = (theme?: string) => {
    switch (theme) {
      case 'purple':
        return {
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #1e1b4b 100%)',
          accent: '#c084fc',
          badgeBg: 'rgba(192, 132, 252, 0.18)',
          badgeBorder: 'rgba(192, 132, 252, 0.4)',
          btnBg: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
          btnShadow: '0 4px 14px rgba(168, 85, 247, 0.4)'
        };
      case 'emerald':
        return {
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #022c22 100%)',
          accent: '#34d399',
          badgeBg: 'rgba(52, 211, 153, 0.18)',
          badgeBorder: 'rgba(52, 211, 153, 0.4)',
          btnBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          btnShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
        };
      case 'amber':
        return {
          background: 'linear-gradient(135deg, #451a03 0%, #78350f 60%, #311302 100%)',
          accent: '#fbbf24',
          badgeBg: 'rgba(251, 191, 36, 0.18)',
          badgeBorder: 'rgba(251, 191, 36, 0.4)',
          btnBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          btnShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
        };
      case 'blue':
      default:
        return {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #172554 100%)',
          accent: '#60a5fa',
          badgeBg: 'rgba(96, 165, 250, 0.18)',
          badgeBorder: 'rgba(96, 165, 250, 0.4)',
          btnBg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          btnShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
        };
    }
  };

  return (
    <div 
      style={{ 
        marginBottom: '10px', 
        marginTop: '2px',
        position: 'relative',
        userSelect: 'none'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container with Horizontal Sliding */}
      <div 
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          gap: '12px',
          borderRadius: '16px'
        }}
      >
        {activeOffers.map((combo, index) => {
          const theme = getGradientStyle(combo.gradientTheme);
          const savings = combo.regularPrice - combo.offerPrice;
          const discountPercent = combo.regularPrice > 0 
            ? Math.round((savings / combo.regularPrice) * 100) 
            : 0;

          return (
            <div
              key={combo.id}
              style={{
                flex: '0 0 100%',
                scrollSnapAlign: 'center',
                background: theme.background,
                borderRadius: '16px',
                padding: '16px 18px',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              {/* Subtle background glow effect */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: theme.accent,
                  opacity: 0.12,
                  filter: 'blur(40px)',
                  pointerEvents: 'none'
                }} 
              />

              {/* Top Row: Badge + Combo Number / Auto Timer Pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: theme.badgeBg,
                  border: `1px solid ${theme.badgeBorder}`,
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}>
                  <Sparkles size={12} color={theme.accent} />
                  <span>{combo.badge || 'HOT COMBO DEAL'}</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.7)',
                  background: 'rgba(0,0,0,0.25)',
                  padding: '3px 9px',
                  borderRadius: '9999px'
                }}>
                  <span>Combo {index + 1} of {activeOffers.length}</span>
                  <span style={{ color: theme.accent }}>•</span>
                  <span>Auto-Slides 3s</span>
                </div>
              </div>

              {/* Main Content Layout: Left Details, Right Product Image/Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '14px',
                alignItems: 'center'
              }}>
                {/* Left Side: Title, Included Products, Pricing */}
                <div>
                  <h3 style={{
                    fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)',
                    fontWeight: 900,
                    lineHeight: 1.25,
                    marginBottom: '8px',
                    color: '#ffffff',
                    letterSpacing: '-0.01em'
                  }}>
                    {combo.title}
                  </h3>

                  {/* Included Items Checklist */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    marginBottom: '12px'
                  }}>
                    {combo.items.map((item, itemIdx) => (
                      <div 
                        key={itemIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px',
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.9)',
                          lineHeight: 1.3
                        }}
                      >
                        <CheckCircle2 size={14} color={theme.accent} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Comparison Box */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                    gap: '10px',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
                        Regular Price
                      </span>
                      <del style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'rgba(255, 255, 255, 0.55)',
                        textDecoration: 'line-through'
                      }}>
                        ₹{combo.regularPrice.toLocaleString('en-IN')}
                      </del>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: theme.accent, fontWeight: 800 }}>
                        Special Offer Price
                      </span>
                      <span style={{
                        fontSize: 'clamp(1.35rem, 3.5vw, 1.7rem)',
                        fontWeight: 900,
                        color: '#ffffff',
                        lineHeight: 1
                      }}>
                        ₹{combo.offerPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {savings > 0 && (
                      <div style={{
                        marginLeft: 'auto',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                      }}>
                        SAVE ₹{savings.toLocaleString('en-IN')} ({discountPercent}% OFF)
                      </div>
                    )}
                  </div>

                  {/* Actions Row: WhatsApp Order + Estimator Link */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleOrderComboWhatsApp(combo)}
                      style={{
                        background: theme.btnBg,
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '9999px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: theme.btnShadow,
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <span>Book Combo on WhatsApp</span>
                      <ArrowRight size={15} />
                    </button>

                    {onOpenEstimator && (
                      <button
                        onClick={onOpenEstimator}
                        style={{
                          background: 'rgba(255, 255, 255, 0.12)',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          color: '#ffffff',
                          padding: '10px 14px',
                          borderRadius: '9999px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background 0.2s'
                        }}
                      >
                        <ShieldCheck size={14} color={theme.accent} />
                        <span>Customize in Estimator</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Side: Product Showcase / Image */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative'
                }}>
                  <img
                    src={combo.image}
                    alt={combo.title}
                    style={{
                      maxHeight: '150px',
                      width: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.35))'
                    }}
                    onError={(e) => {
                      // Fallback image if remote url fails
                      e.currentTarget.src = '/logo.jpg';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#ffffff'
                  }}>
                    Full Kit + Fitting
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Prev / Next Arrow Controls */}
      {activeOffers.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous combo offer"
            style={{
              position: 'absolute',
              left: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next combo offer"
            style={{
              position: 'absolute',
              right: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {activeOffers.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          marginTop: '6px',
          marginBottom: '2px'
        }}>
          {activeOffers.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to combo ${dotIdx + 1}`}
              style={{
                width: currentIndex === dotIdx ? '22px' : '7px',
                height: '7px',
                borderRadius: '9999px',
                background: currentIndex === dotIdx ? '#2563eb' : '#cbd5e1',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
