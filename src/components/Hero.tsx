import React from 'react';
import { 
  Camera, 
  BatteryCharging, 
  Zap, 
  Droplets, 
  Sun, 
  MessageCircle, 
  Wrench, 
  ShieldCheck, 
  Truck, 
  Award, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import { createWhatsAppLink } from '../utils/whatsapp';
import { CategoryType } from '../types';

interface HeroProps {
  onOpenBooking: (category?: CategoryType) => void;
  onSelectCategory: (category: CategoryType) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onSelectCategory }) => {
  const categoryTiles = [
    {
      id: 'cctv' as CategoryType,
      title: 'CCTV Security',
      tagline: 'HD / 4K & Mobile Live View',
      icon: Camera,
      color: '#3b82f6',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
      status: 'Active • Doorstep Service',
      active: true
    },
    {
      id: 'battery' as CategoryType,
      title: 'Vehicle Batteries',
      tagline: 'Car & Bike Batteries',
      icon: BatteryCharging,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      status: 'Coming Soon 🚀',
      active: false
    },
    {
      id: 'inverter' as CategoryType,
      title: 'UPS & Inverters',
      tagline: 'Sine Wave & Battery Combos',
      icon: Zap,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      status: 'Coming Soon 🚀',
      active: false
    },
    {
      id: 'water_purifier' as CategoryType,
      title: 'RO Purifiers',
      tagline: 'Filter Change & TDS Service',
      icon: Droplets,
      color: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      status: 'Coming Soon 🚀',
      active: false
    },
    {
      id: 'solar_heater' as CategoryType,
      title: 'Solar Heaters',
      tagline: 'ETC / FPC Solar Systems',
      icon: Sun,
      color: '#fb923c',
      bgGlow: 'rgba(251, 146, 60, 0.15)',
      status: 'Coming Soon 🚀',
      active: false
    },
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
      paddingTop: '60px',
      paddingBottom: '70px',
      overflow: 'hidden'
    }}>
      {/* Background ambient lighting effects */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '700px',
        height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.22) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(0,0,0,0) 80%)',
        filter: 'blur(70px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <div className="container">
        {/* Top Trust Badge */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="section-badge">
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#34d399',
              display: 'inline-block' 
            }} />
            Authorized Sales, Doorstep Installation & Repair Specialist
          </div>
        </div>

        {/* Hero Main Heading & Description */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 30px auto' }}>
          <h1 style={{
            fontSize: 'clamp(1.95rem, 6.5vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            color: '#ffffff',
            marginBottom: '16px'
          }}>
            Smart Security & CCTV Solutions with{' '}
            <span className="text-gradient">Meksha Solutions</span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(0.95rem, 3.5vw, 1.15rem)',
            color: '#9ca3af',
            lineHeight: 1.55,
            maxWidth: '680px',
            margin: '0 auto 28px auto'
          }}>
            Authorized CCTV camera sales, neat concealed installation, and fast doorstep service for homes, shops, and offices.
          </p>

          {/* Action Buttons - Mobile friendly */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            maxWidth: '560px',
            margin: '0 auto'
          }}>
            <button
              onClick={() => onOpenBooking()}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <Wrench size={18} />
              Book CCTV Service
            </button>

            <a
              href={createWhatsAppLink("Hello Meksha Solutions, I would like to inquire about CCTV cameras & pricing.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
              style={{ width: '100%' }}
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* 5 Quick Category Interactive Tiles - 2 column grid on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
          gap: '12px',
          marginTop: '36px',
          marginBottom: '36px'
        }}>
          {categoryTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.id}
                onClick={() => {
                  onSelectCategory(tile.id);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-card"
                style={{
                  padding: '22px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'rgba(17, 24, 39, 0.85)',
                  border: `1px solid rgba(255, 255, 255, 0.08)`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: tile.bgGlow,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tile.color
                  }}>
                    <Icon size={24} />
                  </div>
                  <ChevronRight size={18} color="#6b7280" />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h2 style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      margin: 0
                    }}>
                      {tile.title}
                    </h2>
                  </div>
                  <div style={{
                    display: 'inline-block',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    marginBottom: '6px',
                    background: tile.active ? 'rgba(37, 99, 235, 0.3)' : 'rgba(245, 158, 11, 0.2)',
                    color: tile.active ? '#93c5fd' : '#fbbf24',
                    border: tile.active ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                  }}>
                    {tile.status}
                  </div>
                  <p style={{
                    fontSize: '0.82rem',
                    color: '#9ca3af',
                    lineHeight: 1.4
                  }}>
                    {tile.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Trust Highlights Strip */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(37, 99, 235, 0.15)',
                  color: '#60a5fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
