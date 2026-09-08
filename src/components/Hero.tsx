import React, { useState } from 'react';
import { 
  Sparkles,
  Zap, 
  MessageCircle, 
  Phone,
  ArrowRight,
  Wrench,
  ShieldCheck, 
  Truck, 
  Award, 
  Clock, 
  ChevronRight,
  Check,
  Star,
  Users,
  Heart,
  CheckCircle2,
  HardHat,
  Headphones,
  Calculator,
  Gauge
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';
import { CategoryType } from '../types';
import { PowerPlannerModal } from './PowerPlannerModal';

interface HeroProps {
  onOpenBooking: (category?: CategoryType) => void;
  onOpenQuote?: () => void;
  onSelectCategory: (category: CategoryType) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenQuote, onSelectCategory }) => {
  const { shopInfo } = useShop();
  const [activeRangeIndex, setActiveRangeIndex] = useState<number>(0);
  const [isPowerPlannerOpen, setIsPowerPlannerOpen] = useState<boolean>(false);

  const rangeData = [
    {
      id: 'cctv' as CategoryType,
      tabLabel: 'CCTV',
      counter: '01 / 03',
      title: 'Hikvision, CP PLUS & Dahua',
      image: '/range-cctv.jpg',
      points: [
        'Hikvision ColorVu & Turbo HD Bullet Cameras',
        'CP PLUS 360° Smart Wi-Fi PTZ Cameras',
        'Dahua 4K NVR Kits with Surveillance Storage'
      ],
      ctaText: 'Enquire about CCTV',
      inquiryMessage: `Hello ${shopInfo.shopName}, I would like to enquire about Hikvision, CP PLUS & Dahua CCTV Cameras & Setup.`
    },
    {
      id: 'battery' as CategoryType,
      tabLabel: 'Batteries',
      counter: '02 / 03',
      title: 'Amaron & Exide Batteries',
      image: '/range-batteries.jpg',
      points: [
        'Amaron Pro & Hi-Life Automotive Batteries',
        'Exide InvaRed & Mileage Tall Tubular Batteries',
        'Commercial Heavy-Duty & Tractor Batteries'
      ],
      ctaText: 'Enquire about Batteries',
      inquiryMessage: `Hello ${shopInfo.shopName}, I would like to enquire about Amaron & Exide Batteries (Car, Bike, and Inverter).`
    },
    {
      id: 'inverter' as CategoryType,
      tabLabel: 'Inverters',
      counter: '03 / 03',
      title: 'Inverters & UPS',
      image: '/range-inverters.jpg',
      points: [
        'Luminous & Microtek Pure Sine Wave Combos',
        'Mini DC UPS for Wi-Fi Modems & Routers',
        'CCTV Centralized Uninterrupted Power Backup'
      ],
      ctaText: 'Enquire about Inverters & UPS',
      inquiryMessage: `Hello ${shopInfo.shopName}, I would like to enquire about Inverters & UPS Power Backup systems.`
    }
  ];

  const highlights = [
    { icon: Truck, title: 'Doorstep Service', desc: 'Direct technician visit at your place' },
    { icon: ShieldCheck, title: '100% Genuine', desc: 'Direct brand warranties' },
    { icon: Award, title: 'Certified Techs', desc: 'Expert neat installation' },
    { icon: Clock, title: 'Reliable Support', desc: 'Prompt repair response' },
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
        {/* Top Trust Badge */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div className="section-badge" style={{
            background: 'rgba(239, 246, 255, 0.95)',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            fontWeight: 600,
            fontSize: '0.82rem',
            padding: '5px 15px',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(29, 78, 216, 0.05)',
            margin: 0
          }}>
            <Sparkles size={14} color="#2563eb" />
            <span>Authorized Dealer · Trusted Since Years</span>
          </div>
        </div>

        {/* Hero Main Heading & Description */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 24px auto' }}>
          <h1 style={{
            fontSize: 'clamp(2.1rem, 6.8vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#0f172a',
            marginBottom: '14px',
            letterSpacing: '-0.025em'
          }}>
            Reliable Power &amp;{' '}
            <span style={{ position: 'relative', display: 'inline-block', color: '#1d4ed8' }}>
              Smart Security
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
          
          <p style={{
            fontSize: 'clamp(0.96rem, 3.4vw, 1.12rem)',
            color: '#475569',
            lineHeight: 1.55,
            maxWidth: '680px',
            margin: '0 auto 22px auto'
          }}>
            We specialize in genuine batteries, inverters, and CCTV systems with professional installation and dependable after-sales support.
          </p>

          {/* Action Buttons - Hero Pill Buttons Group */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '420px',
            margin: '0 auto'
          }}>
            {/* Button 0: Book a Service */}
            <button
              onClick={() => onOpenBooking()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                color: '#ffffff',
                padding: '13px 28px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.98rem',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 4px 14px rgba(29, 78, 216, 0.28)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(29, 78, 216, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(29, 78, 216, 0.28)';
              }}
            >
              <Wrench size={18} />
              <span>Book a Service</span>
            </button>

            {/* Button 1: Get Free Quote */}
            <button
              onClick={() => onOpenQuote ? onOpenQuote() : onOpenBooking()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#04647a',
                color: '#ffffff',
                padding: '13px 28px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.98rem',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 4px 14px rgba(4, 100, 122, 0.22)',
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
              <ArrowRight size={18} />
            </button>

            {/* Button 2: WhatsApp Now */}
            <a
              href={createWhatsAppLink(`Hello ${shopInfo.shopName}, I would like to get a free quote for CCTV, batteries, or inverter systems.`, shopInfo.whatsappPhone)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#22c55e',
                color: '#ffffff',
                padding: '13px 28px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.98rem',
                textDecoration: 'none',
                width: '100%',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.22)',
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#ffffff',
                color: '#0f172a',
                padding: '13px 28px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.98rem',
                textDecoration: 'none',
                border: '1px solid #e2e8f0',
                width: '100%',
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
              <Phone size={17} color="#0f172a" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Trust Checklist & Smart Home Showcase Visual (Shakthi Agencies inspired) */}
          <div style={{
            maxWidth: '480px',
            margin: '32px auto 0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* 5 Checkmarks Trust Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px 14px',
              textAlign: 'left',
              padding: '0 6px'
            }}>
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.86rem'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Showcase Card with 3D Illustration & Floating Badges */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '14px',
              position: 'relative',
              boxShadow: '0 12px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
              overflow: 'hidden'
            }}>
              {/* Top Right Rating Badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '8px',
                paddingRight: '4px'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  color: '#b45309',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}>
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ color: '#0f172a' }}>4.9 / 5 Rated</span>
                </div>
              </div>

              {/* 3D Smart Home Illustration Image Container */}
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src="/hero-smart-home.jpg"
                  alt="Smart Home Security & Power Backup Solutions"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '16px',
                    objectFit: 'cover'
                  }}
                />

                {/* Floating Badge 1 - Top Left: Secured / HD CCTV Live (matches CCTV camera position) */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(226, 232, 240, 0.85)',
                  borderRadius: '14px',
                  padding: '6px 12px 6px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 18px rgba(15, 23, 42, 0.12)',
                  animation: 'floatSlow 4s ease-in-out infinite'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={16} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1 }}>
                      Secured
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 800, marginTop: '2px', lineHeight: 1.1 }}>
                      HD CCTV Live
                    </div>
                  </div>
                </div>

                {/* Floating Badge 2 - Bottom Right: Power Backup / 24x7 Uptime (matches Inverter battery position) */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(226, 232, 240, 0.85)',
                  borderRadius: '14px',
                  padding: '6px 12px 6px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 18px rgba(15, 23, 42, 0.12)',
                  animation: 'floatSlow 4s ease-in-out infinite 2s'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Zap size={16} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1 }}>
                      Power Backup
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 800, marginTop: '2px', lineHeight: 1.1 }}>
                      24×7 Uptime
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Meksha Solutions - Built on Trust, Backed by Expertise */}
          <div style={{
            maxWidth: '480px',
            margin: '40px auto 0 auto',
            textAlign: 'center'
          }}>
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
              fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
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
              fontSize: '0.9rem',
              color: '#475569',
              lineHeight: 1.55,
              marginBottom: '18px'
            }}>
              Eight reasons our customers — homes, offices, shops and institutions — keep choosing us.
            </p>

            {/* Showcase Card with 3D Banner & Dual Trust Badges */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '12px',
              boxShadow: '0 12px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
              textAlign: 'left'
            }}>
              {/* 3D Product Banner Image */}
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#0f172a',
                position: 'relative'
              }}>
                <img
                  src="/why-trust-banner.jpg"
                  alt="Built on Trust, Backed by Expertise - CCTV & Inverter Solutions"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '16px',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Bottom Dual Trust Highlights Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
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
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                      Trusted by Thousands
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.35, marginTop: '2px' }}>
                      Delivering reliable power and security solutions across homes, businesses and institutions.
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
                  <div style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600, lineHeight: 1.35 }}>
                    Complete solutions with expert service and dependable support.
                  </div>
                </div>
              </div>
            </div>

            {/* Eight Reasons List Card (Compact Shakthi Agencies aesthetic) */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '4px 6px',
              marginTop: '14px',
              boxShadow: '0 8px 24px -6px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.02)',
              textAlign: 'left'
            }}>
              {[
                { label: 'Genuine Products', icon: CheckCircle2 },
                { label: 'Trusted Brands', icon: Award },
                { label: 'Professional Installation', icon: Wrench },
                { label: 'Affordable Pricing', icon: Heart },
                { label: 'Warranty Support', icon: ShieldCheck },
                { label: 'Experienced Technicians', icon: Users },
                { label: 'Prompt Service', icon: Clock },
                { label: 'Customer Satisfaction', icon: Star },
              ].map((reason, idx, arr) => {
                const Icon = reason.icon;
                const isLast = idx === arr.length - 1;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 8px',
                      borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                      cursor: 'pointer',
                      borderRadius: '10px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#fef9c3',
                        border: '1px solid #fef08a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={14} color="#04647a" />
                      </div>
                      <span style={{
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        letterSpacing: '-0.01em'
                      }}>
                        {reason.label}
                      </span>
                    </div>
                    <ChevronRight size={15} color="#94a3b8" />
                  </div>
                );
              })}
            </div>

            {/* 4-Pillars Trust Matrix Card (100% Genuine, Expert Installation, Quick Service, After-Sales Support) */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '14px 12px',
              marginTop: '14px',
              boxShadow: '0 8px 24px -6px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.02)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px 14px',
              textAlign: 'left'
            }}>
              {[
                {
                  icon: ShieldCheck,
                  title: '100%',
                  subtitle: 'Genuine Products'
                },
                {
                  icon: HardHat,
                  title: 'Expert',
                  subtitle: 'Installation'
                },
                {
                  icon: Clock,
                  title: 'Quick',
                  subtitle: 'Service'
                },
                {
                  icon: Headphones,
                  title: 'After–Sales',
                  subtitle: 'Support'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 4px',
                      borderBottom: idx < 2 ? '1px solid #f1f5f9' : 'none'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#e0f2fe',
                      border: '1px solid #bae6fd',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1.15
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        fontSize: '0.74rem',
                        color: '#64748b',
                        lineHeight: 1.25,
                        marginTop: '2px'
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

        {/* "OUR RANGE" - Interactive Product Showcase (from shakthiagencies.in) */}
        <div style={{
          maxWidth: '480px',
          margin: '40px auto 0 auto',
          textAlign: 'center'
        }}>
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
            Our Range
          </div>

          {/* Main Title */}
          <h2 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: '10px',
            letterSpacing: '-0.02em'
          }}>
            Premium Products, Honest Pricing
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: '0.9rem',
            color: '#475569',
            lineHeight: 1.55,
            marginBottom: '20px'
          }}>
            Hand-picked from India's most trusted brands — for performance you can depend on.
          </p>

          {/* Category Filter Tabs (Pill Buttons) */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '9999px',
            marginBottom: '18px',
            boxShadow: 'inset 0 1px 3px rgba(15, 23, 42, 0.06)'
          }}>
            {rangeData.map((item, idx) => {
              const isActive = activeRangeIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveRangeIndex(idx);
                    onSelectCategory(item.id);
                  }}
                  style={{
                    background: isActive ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    padding: '7px 18px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 3px 10px rgba(202, 138, 4, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.tabLabel}
                </button>
              );
            })}
          </div>

          {/* Range Showcase Card */}
          {(() => {
            const current = rangeData[activeRangeIndex];
            return (
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 12px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
                textAlign: 'left'
              }}>
                {/* 3D Product Image with Counter & Title Overlay */}
                <div style={{
                  position: 'relative',
                  height: '240px',
                  width: '100%',
                  overflow: 'hidden',
                  background: '#0f172a'
                }}>
                  <img
                    src={current.image}
                    alt={current.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.1) 60%, rgba(0,0,0,0) 100%)'
                  }} />

                  {/* Top-Left Counter Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    {current.counter}
                  </div>

                  {/* Bottom-Left Title Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '18px',
                    color: '#ffffff',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    {current.title}
                  </div>
                </div>

                {/* Content Area with 3 Bullet Points & CTA Button */}
                <div style={{
                  padding: '18px 16px',
                  background: '#fefce8'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginBottom: '16px'
                  }}>
                    {current.points.map((pt, pIdx) => (
                      <div 
                        key={pIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          color: '#1e293b',
                          fontSize: '0.86rem',
                          fontWeight: 600
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: '#fef08a',
                          border: '1px solid #fde047',
                          color: '#854d0e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Enquire Button */}
                  <a
                    href={createWhatsAppLink(current.inquiryMessage, shopInfo.whatsappPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                      color: '#ffffff',
                      padding: '12px 20px',
                      borderRadius: '9999px',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      textDecoration: 'none',
                      width: '100%',
                      boxSizing: 'border-box',
                      boxShadow: '0 4px 14px rgba(202, 138, 4, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(202, 138, 4, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(202, 138, 4, 0.3)';
                    }}
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            );
          })()}

          {/* 3 Pagination Dots */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px',
            marginBottom: '32px'
          }}>
            {rangeData.map((_, dotIdx) => {
              const isSelected = activeRangeIndex === dotIdx;
              return (
                <button
                  key={dotIdx}
                  onClick={() => setActiveRangeIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  style={{
                    width: isSelected ? '22px' : '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    background: isSelected ? '#ca8a04' : '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.25s ease'
                  }}
                />
              );
            })}
          </div>

          {/* Power Planner Banner Card (Interactive Load Calculator Trigger) */}
          <div 
            onClick={() => setIsPowerPlannerOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #024b86 0%, #03667c 100%)',
              borderRadius: '24px',
              padding: '22px 18px',
              color: '#ffffff',
              boxShadow: '0 12px 30px rgba(2, 75, 134, 0.22)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              textAlign: 'left',
              marginBottom: '36px',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(2, 75, 134, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(2, 75, 134, 0.22)';
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
                  <Gauge size={13} />
                  <span>Power Planner</span>
                </div>
                <h3 style={{
                  fontSize: '1.12rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  margin: '0 0 4px 0',
                  letterSpacing: '-0.01em'
                }}>
                  Not sure what inverter size you need?
                </h3>
                <p style={{
                  fontSize: '0.8rem',
                  color: '#e2e8f0',
                  lineHeight: 1.35,
                  margin: 0,
                  opacity: 0.9
                }}>
                  Use our free Load Calculator — pick your appliances &amp; get an instant recommendation.
                </p>
              </div>
            </div>

            <div style={{
              width: '42px',
              height: '42px',
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

        {/* 4 Trust Highlights Strip */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)'
        }}>
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Power Planner / Inverter Load Calculator Modal */}
      <PowerPlannerModal
        isOpen={isPowerPlannerOpen}
        onClose={() => setIsPowerPlannerOpen(false)}
      />
    </section>
  );
};
