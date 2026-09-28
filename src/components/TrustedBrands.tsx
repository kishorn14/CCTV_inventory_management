import React, { useRef } from 'react';
import { Award, ChevronLeft, ChevronRight, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';

export const TrustedBrands: React.FC = () => {
  const { brands, shopInfo } = useShop();
  const cctvScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (cctvScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      cctvScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleBrandInquiry = (brandName: string) => {
    const message = `Hello ${shopInfo.shopName}, I would like to inquire about *${brandName}* CCTV cameras, DVR/NVR packages, and best price quotes available.`;
    window.open(createWhatsAppLink(message, shopInfo.whatsappPhone), '_blank');
  };

  return (
    <section 
      id="brands" 
      style={{
        padding: '50px 16px 40px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '640px', margin: '0 auto 32px' }}>
          {/* Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
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
            <Award size={14} color="#d97706" />
            <span>Authorized Security Partners</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.4rem, 4vw, 2.1rem)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.25,
            marginBottom: '10px'
          }}>
            Authorized Dealer for India's Leading CCTV Brands
          </h2>

          <p style={{
            fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
            color: '#64748b',
            lineHeight: 1.55
          }}>
            We partner directly with world-class manufacturers known for crystal-clear optics, AI analytics, and official brand warranty support.
          </p>
        </div>

        {/* Brands Showcase Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '24px 20px 22px',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
          position: 'relative'
        }}>
          {/* Top Bar with Arrows */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#1d4ed8" />
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#1e293b',
                textTransform: 'uppercase'
              }}>
                100% Genuine Manufacturer Warranties
              </span>
            </div>

            {/* Desktop navigation arrows */}
            <div className="brand-scroll-arrows" style={{ display: 'none', gap: '6px' }}>
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Cards List */}
          <div
            ref={cctvScrollRef}
            className="hide-scrollbar"
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '6px 2px 14px',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {brands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => handleBrandInquiry(brand.name)}
                style={{
                  flex: '0 0 calc(50% - 10px)',
                  minWidth: '175px',
                  maxWidth: '240px',
                  scrollSnapAlign: 'start',
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(29, 78, 216, 0.12)';
                  e.currentTarget.style.borderColor = '#93c5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {/* Brand Showcase Image */}
                <div style={{
                  position: 'relative',
                  height: '110px',
                  background: '#f8fafc',
                  overflow: 'hidden'
                }}>
                  <img
                    src={brand.image}
                    alt={brand.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {brand.badge && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {brand.badge}
                    </div>
                  )}
                </div>

                {/* Brand Info */}
                <div style={{
                  padding: '14px 12px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '4px',
                      lineHeight: 1.2
                    }}>
                      {brand.name}
                    </h3>
                    <p style={{
                      fontSize: '0.74rem',
                      color: '#64748b',
                      lineHeight: 1.35,
                      marginBottom: '12px'
                    }}>
                      {brand.tagline}
                    </p>
                  </div>

                  {/* 1-Click WhatsApp Trigger */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: '1px solid #bfdbfe'
                  }}>
                    <MessageCircle size={13} color="#1d4ed8" />
                    <span>Inquire Best Price</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Custom Inquiry Bar */}
          <div style={{
            marginTop: '18px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            textAlign: 'center'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#dbeafe',
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              flexShrink: 0
            }}>
              +
            </div>
            <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
              Need a custom multi-camera package or specific CCTV model? We source, install &amp; configure all major security brands.
            </span>
            <button
              onClick={() => {
                const message = `Hello ${shopInfo.shopName}, I would like to inquire about a custom CCTV brand setup and price quotation.`;
                window.open(createWhatsAppLink(message, shopInfo.whatsappPhone), '_blank');
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#1d4ed8',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <Sparkles size={13} color="#2563eb" />
              <span>Ask for Any Model</span>
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .brand-scroll-arrows {
            display: flex !important;
          }
        }
      `}</style>
    </section>
  );
};
