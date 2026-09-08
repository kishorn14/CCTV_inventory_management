import React, { useRef } from 'react';
import { Award, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';

export const TrustedBrands: React.FC = () => {
  const { brands, shopInfo } = useShop();

  const batteryScrollRef = useRef<HTMLDivElement>(null);
  const cctvScrollRef = useRef<HTMLDivElement>(null);

  const batteryBrands = brands.filter(b => b.category === 'battery');
  const cctvBrands = brands.filter(b => b.category === 'cctv');

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleBrandInquiry = (brandName: string, category: 'battery' | 'cctv') => {
    const typeLabel = category === 'battery' ? 'Battery & Inverter' : 'CCTV Surveillance';
    const message = `Hello ${shopInfo.shopName}, I would like to inquire about *${brandName}* (${typeLabel}) products and best price quotes available.`;
    window.open(createWhatsAppLink(message, shopInfo.whatsappPhone), '_blank');
  };

  return (
    <section 
      id="brands" 
      style={{
        padding: '50px 16px 36px',
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
            <span>Trusted Brands</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.4rem, 4vw, 2.1rem)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.25,
            marginBottom: '10px'
          }}>
            Authorized Dealer for India's Leading Brands
          </h2>

          <p style={{
            fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
            color: '#64748b',
            lineHeight: 1.55
          }}>
            We partner only with manufacturers known for reliability, performance and after-sales support.
          </p>
        </div>

        {/* Brand Categories Container Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 1. BATTERY BRANDS */}
          {batteryBrands.length > 0 && (
            <div style={{
              background: '#ffffff',
              borderRadius: '22px',
              border: '1px solid #e2e8f0',
              padding: '22px 18px 20px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              position: 'relative'
            }}>
              {/* Category Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }}>
                  <div style={{ height: '1px', width: '32px', background: '#cbd5e1' }} />
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: '#475569',
                    textTransform: 'uppercase'
                  }}>
                    Battery Brands
                  </span>
                  <div style={{ height: '1px', width: '32px', background: '#cbd5e1' }} />
                </div>

                {/* Desktop navigation arrows */}
                <div className="brand-scroll-arrows" style={{ display: 'none', position: 'absolute', right: '18px', gap: '6px' }}>
                  <button
                    onClick={() => scroll(batteryScrollRef, 'left')}
                    aria-label="Scroll left"
                    style={{
                      width: '30px',
                      height: '30px',
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
                    onClick={() => scroll(batteryScrollRef, 'right')}
                    aria-label="Scroll right"
                    style={{
                      width: '30px',
                      height: '30px',
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
                ref={batteryScrollRef}
                className="hide-scrollbar"
                style={{
                  display: 'flex',
                  gap: '14px',
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  padding: '4px 2px 10px',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {batteryBrands.map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => handleBrandInquiry(brand.name, 'battery')}
                    style={{
                      flex: '0 0 calc(50% - 10px)',
                      minWidth: '150px',
                      maxWidth: '220px',
                      scrollSnapAlign: 'start',
                      background: '#ffffff',
                      borderRadius: '16px',
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
                      height: '115px',
                      background: 'radial-gradient(circle, #f8fafc 0%, #f1f5f9 100%)',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px'
                    }}>
                      <img
                        src={brand.image}
                        alt={brand.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '10px'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      {brand.badge && (
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          color: '#ffffff',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backdropFilter: 'blur(4px)'
                        }}>
                          {brand.badge}
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div style={{
                      padding: '12px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      flex: 1,
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          color: '#0f172a',
                          lineHeight: 1.2,
                          marginBottom: '3px'
                        }}>
                          {brand.name}
                        </div>
                        <div style={{
                          fontSize: '0.72rem',
                          color: '#64748b',
                          lineHeight: 1.3,
                          fontWeight: 500
                        }}>
                          {brand.tagline}
                        </div>
                      </div>

                      <div style={{
                        marginTop: '8px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#1d4ed8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <MessageCircle size={11} />
                        <span>Inquire</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. CCTV BRANDS */}
          {cctvBrands.length > 0 && (
            <div style={{
              background: '#ffffff',
              borderRadius: '22px',
              border: '1px solid #e2e8f0',
              padding: '22px 18px 20px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              position: 'relative'
            }}>
              {/* Category Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }}>
                  <div style={{ height: '1px', width: '32px', background: '#cbd5e1' }} />
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: '#475569',
                    textTransform: 'uppercase'
                  }}>
                    CCTV Brands
                  </span>
                  <div style={{ height: '1px', width: '32px', background: '#cbd5e1' }} />
                </div>

                {/* Desktop navigation arrows */}
                <div className="brand-scroll-arrows" style={{ display: 'none', position: 'absolute', right: '18px', gap: '6px' }}>
                  <button
                    onClick={() => scroll(cctvScrollRef, 'left')}
                    aria-label="Scroll left"
                    style={{
                      width: '30px',
                      height: '30px',
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
                    onClick={() => scroll(cctvScrollRef, 'right')}
                    aria-label="Scroll right"
                    style={{
                      width: '30px',
                      height: '30px',
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
                  gap: '14px',
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  padding: '4px 2px 10px',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {cctvBrands.map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => handleBrandInquiry(brand.name, 'cctv')}
                    style={{
                      flex: '0 0 calc(50% - 10px)',
                      minWidth: '150px',
                      maxWidth: '220px',
                      scrollSnapAlign: 'start',
                      background: '#ffffff',
                      borderRadius: '16px',
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
                      height: '115px',
                      background: 'radial-gradient(circle, #f8fafc 0%, #f1f5f9 100%)',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px'
                    }}>
                      <img
                        src={brand.image}
                        alt={brand.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '10px'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      {brand.badge && (
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          color: '#ffffff',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backdropFilter: 'blur(4px)'
                        }}>
                          {brand.badge}
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div style={{
                      padding: '12px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      flex: 1,
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          color: '#0f172a',
                          lineHeight: 1.2,
                          marginBottom: '3px'
                        }}>
                          {brand.name}
                        </div>
                        <div style={{
                          fontSize: '0.72rem',
                          color: '#64748b',
                          lineHeight: 1.3,
                          fontWeight: 500
                        }}>
                          {brand.tagline}
                        </div>
                      </div>

                      <div style={{
                        marginTop: '8px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#1d4ed8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <MessageCircle size={11} />
                        <span>Inquire</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Additional Brands Card */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
            border: '1px dashed #bfdbfe',
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
              We also deal in several other leading battery, inverter, CCTV and solar brands.
            </span>
            <button
              onClick={() => {
                const message = `Hello ${shopInfo.shopName}, I would like to inquire about battery/inverter/CCTV brand options and availability.`;
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
              <span>Ask for Any Brand</span>
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
