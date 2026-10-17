import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, X, ExternalLink } from 'lucide-react';
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
  const [selectedComboForModal, setSelectedComboForModal] = useState<ComboOffer | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-slide every 3 seconds (pauses on hover or when modal is open)
  useEffect(() => {
    if (activeOffers.length <= 1 || isPaused || selectedComboForModal) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeOffers.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [activeOffers.length, isPaused, selectedComboForModal]);

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

  // Lock body scroll when combo details modal is open & handle Escape key
  useEffect(() => {
    if (!selectedComboForModal) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedComboForModal(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedComboForModal]);

  if (!activeOffers || activeOffers.length === 0) {
    return null;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      setCurrentIndex(prev => (prev + 1) % activeOffers.length);
    } else if (diff < -40) {
      setCurrentIndex(prev => (prev - 1 + activeOffers.length) % activeOffers.length);
    }
    setTimeout(() => setIsPaused(false), 2500);
  };

  const handleOrderComboWhatsApp = (combo: ComboOffer, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
          btnShadow: '0 4px 14px rgba(168, 85, 247, 0.35)'
        };
      case 'emerald':
        return {
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #022c22 100%)',
          accent: '#34d399',
          badgeBg: 'rgba(52, 211, 153, 0.18)',
          badgeBorder: 'rgba(52, 211, 153, 0.4)',
          btnBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          btnShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
        };
      case 'amber':
        return {
          background: 'linear-gradient(135deg, #451a03 0%, #78350f 60%, #311302 100%)',
          accent: '#fbbf24',
          badgeBg: 'rgba(251, 191, 36, 0.18)',
          badgeBorder: 'rgba(251, 191, 36, 0.4)',
          btnBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          btnShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
        };
      case 'blue':
      default:
        return {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #172554 100%)',
          accent: '#60a5fa',
          badgeBg: 'rgba(96, 165, 250, 0.18)',
          badgeBorder: 'rgba(96, 165, 250, 0.4)',
          btnBg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          btnShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
        };
    }
  };

  return (
    <div 
      style={{ 
        marginBottom: '8px', 
        marginTop: '2px',
        position: 'relative',
        userSelect: 'none'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 30% Compact Height Banner Slider Strip */}
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
          gap: '10px',
          borderRadius: '12px'
        }}
      >
        {activeOffers.map((combo) => {
          const theme = getGradientStyle(combo.gradientTheme);
          const savings = combo.regularPrice - combo.offerPrice;
          const discountPercent = combo.regularPrice > 0 
            ? Math.round((savings / combo.regularPrice) * 100) 
            : 0;

          return (
            <div
              key={combo.id}
              onClick={() => setSelectedComboForModal(combo)}
              style={{
                flex: '0 0 100%',
                scrollSnapAlign: 'center',
                background: `linear-gradient(90deg, rgba(8, 14, 28, 0.94) 0%, rgba(8, 14, 28, 0.84) 42%, rgba(8, 14, 28, 0.38) 75%, rgba(8, 14, 28, 0.1) 100%), url(${combo.image}) right center / cover no-repeat`,
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.14)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                minHeight: '88px',
                maxHeight: '115px',
                transition: 'transform 0.15s ease'
              }}
              title="Click to view full combo details and package specifications"
            >
              {/* Content: Title, Badge & Pricing */}
              <div style={{ flex: 1, minWidth: 0, zIndex: 2, maxWidth: '78%' }}>
                {/* Top Row: Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: theme.badgeBg,
                    border: `1px solid ${theme.badgeBorder}`,
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    <Sparkles size={10} color={theme.accent} />
                    <span>{combo.badge || 'SPECIAL DEAL'}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: 'clamp(0.85rem, 2.2vw, 1rem)',
                  fontWeight: 800,
                  lineHeight: 1.25,
                  margin: '0 0 5px 0',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.85)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {combo.title}
                </h3>

                {/* Pricing & Savings */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 'clamp(1.05rem, 3vw, 1.25rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.85)',
                    lineHeight: 1
                  }}>
                    ₹{combo.offerPrice.toLocaleString('en-IN')}
                  </span>

                  <del style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.65)',
                    textDecoration: 'line-through'
                  }}>
                    ₹{combo.regularPrice.toLocaleString('en-IN')}
                  </del>

                  {savings > 0 && (
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.28)',
                      border: '1px solid rgba(52, 211, 153, 0.45)',
                      color: '#a7f3d0',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      Save ₹{savings.toLocaleString('en-IN')} ({discountPercent}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicator Dots */}
      {activeOffers.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5px',
          marginTop: '4px',
          marginBottom: '2px'
        }}>
          {activeOffers.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to combo ${dotIdx + 1}`}
              style={{
                width: currentIndex === dotIdx ? '16px' : '6px',
                height: '6px',
                borderRadius: '9999px',
                background: currentIndex === dotIdx ? '#2563eb' : '#cbd5e1',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>
      )}

      {/* FULL DETAILS MODAL: Opens when user clicks the banner */}
      {selectedComboForModal && (
        <div
          onClick={() => setSelectedComboForModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.18s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '92vh',
              overflowY: 'auto',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Top Header with theme background */}
            <div style={{
              background: getGradientStyle(selectedComboForModal.gradientTheme).background,
              color: '#ffffff',
              padding: '18px 20px',
              borderRadius: '16px 16px 0 0',
              position: 'relative'
            }}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedComboForModal(null)}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.16)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Sparkles size={12} color="#fbbf24" />
                  <span>{selectedComboForModal.badge || 'HOT COMBO DEAL'}</span>
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
                fontWeight: 900,
                lineHeight: 1.25,
                margin: 0,
                color: '#ffffff',
                paddingRight: '36px'
              }}>
                {selectedComboForModal.title}
              </h3>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Pricing Callout Box */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Regular Price
                  </div>
                  <del style={{ fontSize: '1rem', fontWeight: 700, color: '#94a3b8' }}>
                    ₹{selectedComboForModal.regularPrice.toLocaleString('en-IN')}
                  </del>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: 800, textTransform: 'uppercase' }}>
                    Combo Offer Price
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>
                    ₹{selectedComboForModal.offerPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                {selectedComboForModal.regularPrice > selectedComboForModal.offerPrice && (
                  <div style={{
                    background: '#dcfce7',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800
                  }}>
                    SAVE ₹{(selectedComboForModal.regularPrice - selectedComboForModal.offerPrice).toLocaleString('en-IN')} (
                    {Math.round(((selectedComboForModal.regularPrice - selectedComboForModal.offerPrice) / selectedComboForModal.regularPrice) * 100)}% OFF)
                  </div>
                )}
              </div>

              {/* Image & Included Items Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                alignItems: 'start'
              }}>
                {/* Product Showcase Image */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '180px'
                }}>
                  <img
                    src={selectedComboForModal.image}
                    alt={selectedComboForModal.title}
                    style={{
                      maxHeight: '160px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => { e.currentTarget.src = '/logo.jpg'; }}
                  />
                  <span style={{
                    marginTop: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#475569',
                    background: '#e2e8f0',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    Complete Hardware &amp; Installation Kit
                  </span>
                </div>

                {/* Included Items Checklist */}
                <div>
                  <h4 style={{
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>Included in this Combo Package:</span>
                    <span style={{ fontSize: '0.72rem', color: '#1d4ed8' }}>({selectedComboForModal.items.length} items)</span>
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedComboForModal.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
                        <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ lineHeight: 1.35 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '16px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginTop: '8px'
              }}>
                <button
                  onClick={(e) => handleOrderComboWhatsApp(selectedComboForModal, e)}
                  style={{
                    flex: '1 1 240px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                  }}
                >
                  <span>Book Combo on WhatsApp</span>
                  <ExternalLink size={16} />
                </button>

                {onOpenEstimator && (
                  <button
                    onClick={() => {
                      setSelectedComboForModal(null);
                      onOpenEstimator();
                    }}
                    style={{
                      flex: '1 1 180px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <ShieldCheck size={16} color="#2563eb" />
                    <span>Customize in Estimator</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
