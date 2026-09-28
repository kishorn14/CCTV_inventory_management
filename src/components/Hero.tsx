import React, { useState } from 'react';
import { 
  Sparkles,
  MessageCircle, 
  Phone,
  ArrowRight,
  ShieldCheck, 
  Clock, 
  Check, 
  Star, 
  Users,
  HardHat,
  Headphones,
  Calculator,
  Video,
  Camera
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';
import { CategoryType } from '../types';
import { CctvEstimatorModal } from './CctvEstimatorModal';

interface HeroProps {
  onOpenBooking: (category?: CategoryType) => void;
  onOpenQuote?: () => void;
  onSelectCategory: (category: CategoryType) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenQuote, onSelectCategory }) => {
  const { shopInfo } = useShop();
  const [isCctvEstimatorOpen, setIsCctvEstimatorOpen] = useState<boolean>(false);

  const rangeCards = [
    {
      id: 'kits' as CategoryType,
      title: 'HD Dome & Bullet Kits',
      subtitle: 'Complete 4 & 8 Camera Packages with DVR, 1TB HDD & Cabling',
      image: '/range-cctv.jpg',
      icon: Video,
      btnText: 'Explore Kits'
    },
    {
      id: 'wifi' as CategoryType,
      title: 'Smart Wi-Fi & PTZ',
      subtitle: '360° Pan-Tilt, Two-Way Audio & AI Human Tracking for Homes & Shops',
      image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
      icon: Camera,
      btnText: 'Explore Wi-Fi Cams'
    },
    {
      id: 'ip_nvr' as CategoryType,
      title: '4K IP & Commercial NVR',
      subtitle: 'Enterprise PoE AI Video Surveillance for Offices, Warehouses & Retail',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      icon: ShieldCheck,
      btnText: 'Explore Commercial'
    }
  ];

  return (
    <section style={{
      position: 'relative',
      paddingTop: '24px',
      paddingBottom: '50px',
      overflow: 'hidden'
    }}>
      {/* Soft Ambient Background Highlights - Dual Blue & Gold Glow */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-5%',
        width: '650px',
        height: '650px',
        background: 'radial-gradient(circle, rgba(191, 219, 254, 0.6) 0%, rgba(224, 242, 254, 0.25) 45%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(254, 240, 138, 0.5) 0%, rgba(254, 243, 199, 0.25) 45%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <div className="container">
        {/* Main 2-Column Hero Split (Desktop Side-by-Side, Mobile Stacked) */}
        <div className="hero-main-split">
          {/* LEFT COLUMN: Badge, H1 Title, Subtitle, CTA Buttons, Trust Badges */}
          <div className="hero-main-left">
            {/* 1. Top Trust Badge */}
            <div className="section-badge" style={{
              background: 'rgba(239, 246, 255, 0.95)',
              border: '1px solid #bfdbfe',
              color: '#0284c7',
              fontWeight: 700,
              fontSize: '0.82rem',
              padding: '5px 15px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)',
              marginBottom: '16px'
            }}>
              <Sparkles size={14} color="#0284c7" />
              <span>Authorized Dealer · Trusted Since Years</span>
            </div>

            {/* 2. Main Heading */}
            <h1 style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#0f172a',
              marginBottom: '16px',
              letterSpacing: '-0.025em'
            }}>
              High-Definition &amp;{' '}
              <span style={{ position: 'relative', display: 'inline-block', color: '#0284c7' }}>
                Smart CCTV Security
                <svg
                  viewBox="0 0 250 20"
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: '-6px',
                    width: '100%',
                    height: '14px',
                    overflow: 'visible',
                    pointerEvents: 'none'
                  }}
                >
                  <path
                    d="M 4 13 Q 125 1 246 11"
                    fill="transparent"
                    stroke="#eab308"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              Solutions for Every Home &amp; Business
            </h1>
            
            {/* 3. Subtitle */}
            <p style={{
              fontSize: 'clamp(0.96rem, 1.8vw, 1.06rem)',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '560px',
              marginBottom: '26px'
            }}>
              Authorized dealer for Hikvision, CP PLUS, and Dahua cameras. We deliver crystal-clear 1080P &amp; 4K surveillance, AI motion alerts, and certified doorstep installation with dependable after-sales care.
            </p>

            {/* 4. Action Buttons (Horizontal Row on Desktop, Full Width Stack on Mobile) */}
            <div className="hero-cta-buttons">
              {/* Button 1: Get Free Quote */}
              <button
                onClick={() => onOpenQuote ? onOpenQuote() : onOpenBooking('cctv')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#04647a',
                  color: '#ffffff',
                  padding: '13px 26px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(4, 100, 122, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = '#035264';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#04647a';
                }}
              >
                <span>Get Free Quote</span>
                <ArrowRight size={17} />
              </button>

              {/* Button 2: WhatsApp Now */}
              <a
                href={createWhatsAppLink(`Hello ${shopInfo.shopName}, I would like to get a free quote for CCTV cameras and security installation.`, shopInfo.whatsappPhone)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#22c55e',
                  color: '#ffffff',
                  padding: '13px 26px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.24)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = '#16a34a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#22c55e';
                }}
              >
                <MessageCircle size={18} />
                <span>WhatsApp Now</span>
              </a>

              {/* Button 3: Call Now */}
              <a
                href={`tel:${shopInfo.phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '13px 24px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                <Phone size={16} color="#0f172a" />
                <span>Call Now</span>
              </a>
            </div>

            {/* 5. Trust Badges Row */}
            <div className="hero-trust-badges">
              {[
                'Genuine Products',
                'Expert Installation',
                'Warranty Support',
                'Fast Service',
                'Trusted Brands'
              ].map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.86rem'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Check size={12} strokeWidth={3.5} />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Smart Home Showcase Card */}
          <div className="hero-main-right" style={{ width: '100%' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              borderRadius: '28px',
              padding: '16px',
              position: 'relative',
              boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 4px 16px rgba(15, 23, 42, 0.04)',
              overflow: 'hidden'
            }}>
              {/* Top Right Rating Badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '10px',
                paddingRight: '4px'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  color: '#b45309',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(245, 158, 11, 0.1)'
                }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ color: '#0f172a' }}>4.9 / 5 Rated</span>
                </div>
              </div>

              {/* 3D Smart Home Illustration Image Container */}
              <div style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src="/hero-smart-home.jpg"
                  alt="Smart CCTV Security & 24x7 HD Surveillance Solutions"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '20px',
                    objectFit: 'cover'
                  }}
                />

                {/* Floating Badge 1 - Top Left: 24x7 Surveillance */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  borderRadius: '16px',
                  padding: '8px 14px 8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 22px rgba(15, 23, 42, 0.14)',
                  animation: 'floatSlow 4s ease-in-out infinite'
                }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Camera size={18} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
                      24×7 Surveillance
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 800, marginTop: '3px', lineHeight: 1.1 }}>
                      Continuous Recording
                    </div>
                  </div>
                </div>

                {/* Floating Badge 2 - Bottom Right: Secured / HD CCTV Live */}
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  borderRadius: '16px',
                  padding: '8px 14px 8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 22px rgba(15, 23, 42, 0.14)',
                  animation: 'floatSlow 4s ease-in-out infinite 2s'
                }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
                      Mobile Live View
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 800, marginTop: '3px', lineHeight: 1.1 }}>
                      HD Video Anywhere
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* "WHAT WE DO" - Showcase (3-Column Grid on Desktop, Swipe Track on Mobile) */}
        <div className="hero-showcase-container">
            {/* Section Badge */}
            <div style={{
              display: 'inline-block',
              background: '#fef9c3',
              border: '1px solid #fef08a',
              color: '#854d0e',
              fontWeight: 800,
              fontSize: '0.74rem',
              letterSpacing: '0.08em',
              padding: '4px 14px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              What We Do
            </div>

            {/* Main Title */}
            <h2 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '10px',
              letterSpacing: '-0.02em'
            }}>
              Advanced Security &amp; CCTV Surveillance, Under One Roof
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: '0.95rem',
              color: '#475569',
              lineHeight: 1.55,
              maxWidth: '620px',
              margin: '0 auto 20px auto'
            }}>
              World-leading camera brands, certified cabling, mobile app integration, and lifetime service support.
            </p>

            {/* Swipe indicator for mobile */}
            <div className="hero-swipe-hint">
              <span>Swipe to explore</span>
              <ArrowRight size={14} />
            </div>

            {/* Showcase Track (Grid on Desktop, Horizontal Scroll on Mobile) */}
            <div className="hero-cards-track">
              {rangeCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className="hero-card-item"
                  >
                    {/* Background Product Image */}
                    <img
                      src={card.image}
                      alt={card.title}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />

                    {/* Dark Gradient Overlay for Readability */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.72) 40%, rgba(15, 23, 42, 0.15) 75%, transparent 100%)'
                    }} />

                    {/* Top-Left Circular Category Icon */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#04647a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <Icon size={20} />
                    </div>

                    {/* Bottom Text Content & Action Button */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '22px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <h3 style={{
                        fontSize: '1.45rem',
                        fontWeight: 800,
                        color: '#facc15',
                        margin: 0,
                        lineHeight: 1.15,
                        letterSpacing: '-0.01em',
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                      }}>
                        {card.title}
                      </h3>
                      <p style={{
                        fontSize: '0.84rem',
                        color: '#f8fafc',
                        lineHeight: 1.35,
                        margin: '0 0 12px 0',
                        opacity: 0.95,
                        fontWeight: 500
                      }}>
                        {card.subtitle}
                      </p>

                      <a
                        href="#products"
                        onClick={() => onSelectCategory(card.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: 'rgba(0, 0, 0, 0.4)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '1.5px solid #eab308',
                          color: '#fef08a',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          padding: '10px 18px',
                          borderRadius: '9999px',
                          textDecoration: 'none',
                          width: 'fit-content',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#eab308';
                          e.currentTarget.style.color = '#0f172a';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                          e.currentTarget.style.color = '#fef08a';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span>{card.btnText}</span>
                        <ArrowRight size={15} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Planners Banner: Interactive CCTV Package Cost Estimator */}
            <div className="hero-planners-grid">
              <div 
                onClick={() => setIsCctvEstimatorOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #024b86 0%, #03667c 100%)',
                  borderRadius: '24px',
                  padding: '22px 20px',
                  color: '#ffffff',
                  boxShadow: '0 10px 28px rgba(2, 75, 134, 0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 14px 32px rgba(2, 75, 134, 0.28)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(2, 75, 134, 0.2)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Calculator size={24} color="#fde047" />
                  </div>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#fde047',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}>
                      <Video size={13} />
                      <span>Instant CCTV Estimator</span>
                    </div>
                    <h3 style={{
                      fontSize: '1.08rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.25,
                      margin: '0 0 4px 0',
                      letterSpacing: '-0.01em'
                    }}>
                      Want to estimate your CCTV setup cost?
                    </h3>
                    <p style={{
                      fontSize: '0.78rem',
                      color: '#e2e8f0',
                      lineHeight: 1.35,
                      margin: 0,
                      opacity: 0.9
                    }}>
                      Use our interactive price calculator — pick cameras, resolution &amp; DVR storage for an instant quotation.
                    </p>
                  </div>
                </div>

                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#eab308',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(234, 179, 8, 0.35)'
                }}>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>



          {/* Why Meksha Solutions - Built on Trust, Backed by Expertise (Responsive 2-Column Split on Desktop) */}
          <div className="hero-why-split-section">
            {/* Pill Badge */}
            <div style={{
              display: 'inline-block',
              background: '#fef9c3',
              border: '1px solid #fef08a',
              color: '#854d0e',
              fontWeight: 800,
              fontSize: '0.74rem',
              letterSpacing: '0.08em',
              padding: '4px 14px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              Why {shopInfo.shopName}
            </div>

            {/* Main Title */}
            <h2 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '10px',
              letterSpacing: '-0.02em'
            }}>
              Built on Trust, Backed by Expertise
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: '0.95rem',
              color: '#475569',
              lineHeight: 1.55,
              maxWidth: '620px',
              margin: '0 auto 24px auto'
            }}>
              Eight reasons our customers — homes, offices, shops and institutions — keep choosing us.
            </p>

            {/* 2-Column Grid for Desktop (Image Banner Left, 4-Pillars Matrix Right) */}
            <div className="hero-why-split-grid">
              {/* Left Card: 3D Banner & Dual Trust Badges */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '26px',
                padding: '14px',
                boxShadow: '0 12px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                {/* 3D Product Banner Image */}
                <div style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: '#0f172a',
                  position: 'relative'
                }}>
                  <img
                    src="/why-trust-banner.jpg"
                    alt="Built on Trust, Backed by Expertise - CCTV Security Solutions"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '18px',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Bottom Dual Trust Highlights Bar */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                  padding: '16px 8px 6px 8px',
                  alignItems: 'center'
                }}>
                  {/* Left Highlight */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#fef3c7',
                      border: '1px solid #fde68a',
                      color: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                        Trusted by Thousands
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.35, marginTop: '2px' }}>
                        Delivering reliable power and security solutions across Karnataka.
                      </div>
                    </div>
                  </div>

                  {/* Right Highlight */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderLeft: '1px solid #f1f5f9',
                    paddingLeft: '12px'
                  }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Users size={19} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600, lineHeight: 1.35 }}>
                      Complete solutions with expert service and dependable after-sales care.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Card: 4-Pillars Trust Matrix Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '26px',
                padding: '24px 20px',
                boxShadow: '0 12px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                textAlign: 'left'
              }}>
                {[
                  {
                    icon: ShieldCheck,
                    title: '100% Genuine',
                    subtitle: 'Official brand products with authentic warranties & GST bills.',
                    bg: '#ecfdf5',
                    border: '#a7f3d0',
                    color: '#059669'
                  },
                  {
                    icon: HardHat,
                    title: 'Expert Installation',
                    subtitle: 'Certified technicians with clean concealed wiring & setup.',
                    bg: '#eff6ff',
                    border: '#bfdbfe',
                    color: '#1d4ed8'
                  },
                  {
                    icon: Clock,
                    title: 'Quick Response',
                    subtitle: 'Prompt doorstep technician visits for repairs, offline cameras, and AMC.',
                    bg: '#fffbeb',
                    border: '#fde68a',
                    color: '#d97706'
                  },
                  {
                    icon: Headphones,
                    title: 'After–Sales Care',
                    subtitle: 'Dedicated phone & WhatsApp support open all 7 days.',
                    bg: '#f0fdf4',
                    border: '#bbf7d0',
                    color: '#16a34a'
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '18px',
                        padding: '18px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: item.bg,
                        border: `1px solid ${item.border}`,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '1.02rem',
                          fontWeight: 800,
                          color: '#0f172a',
                          lineHeight: 1.2,
                          marginBottom: '4px'
                        }}>
                          {item.title}
                        </div>
                        <div style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          lineHeight: 1.4
                        }}>
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      {/* Interactive CCTV Security Package Cost Estimator Modal */}
      <CctvEstimatorModal
        isOpen={isCctvEstimatorOpen}
        onClose={() => setIsCctvEstimatorOpen(false)}
      />
    </section>
  );
};
