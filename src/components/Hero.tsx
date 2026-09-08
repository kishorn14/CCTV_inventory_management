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
      color: '#1d4ed8',
      bgGlow: '#eff6ff',
      status: 'Active • Doorstep Service',
      active: true
    },
    {
      id: 'battery' as CategoryType,
      title: 'Vehicle Batteries',
      tagline: 'Car & Bike Batteries',
      icon: BatteryCharging,
      color: '#059669',
      bgGlow: '#ecfdf5',
      status: 'Coming Soon 🚀',
      active: false
    },
    {
      id: 'inverter' as CategoryType,
      title: 'UPS & Inverters',
      tagline: 'Sine Wave & Battery Combos',
      icon: Zap,
      color: '#d97706',
      bgGlow: '#fffbeb',
      status: 'Coming Soon 🚀',
      active: false
    },
    {
      id: 'water_purifier' as CategoryType,
      title: 'RO Purifiers',
      tagline: 'Filter Change & TDS Service',
      icon: Droplets,
      color: '#0284c7',
      bgGlow: '#f0f9ff',
      status: 'Coming Soon 🚀',
      active: false
    },
    {
      id: 'solar_heater' as CategoryType,
      title: 'Solar Heaters',
      tagline: 'ETC / FPC Solar Systems',
      icon: Sun,
      color: '#ea580c',
      bgGlow: '#fff7ed',
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
        background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.12) 0%, rgba(16, 185, 129, 0.06) 50%, rgba(255,255,255,0) 80%)',
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
              backgroundColor: '#10b981',
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
            color: '#0f172a',
            marginBottom: '16px'
          }}>
            Smart Security & CCTV Solutions with{' '}
            <span className="text-gradient">Meksha Solutions</span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(0.95rem, 3.5vw, 1.15rem)',
            color: '#475569',
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
          gap: '14px',
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
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
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
                  <ChevronRight size={18} color="#94a3af" />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h2 style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#0f172a',
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
                    background: tile.active ? '#eff6ff' : '#fffbeb',
                    color: tile.active ? '#1d4ed8' : '#b45309',
                    border: tile.active ? '1px solid #bfdbfe' : '1px solid #fde68a'
                  }}>
                    {tile.status}
                  </div>
                  <p style={{
                    fontSize: '0.82rem',
                    color: '#64748b',
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
    </section>
  );
};
