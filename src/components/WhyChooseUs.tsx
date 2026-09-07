import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Award, 
  Headphones, 
  RotateCcw, 
  Banknote
} from 'lucide-react';
import { BRANDS } from '../data/shopData';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: ShieldCheck,
      title: '100% Genuine Authorized Brands',
      desc: 'Direct brand warranty cards and GST tax invoices with every battery, inverter, CCTV, and water purifier.'
    },
    {
      icon: Truck,
      title: 'Doorstep Delivery & Installation',
      desc: 'Our certified field technicians deliver and install genuine equipment right at your home or workplace.'
    },
    {
      icon: Award,
      title: 'Expert Certified Technicians',
      desc: 'Clean, professional wiring for CCTV and inverter systems without damaging your walls or aesthetics.'
    },
    {
      icon: Banknote,
      title: 'Best Old Scrap Exchange Value',
      desc: 'Get the highest trade-in cash discount for your old car/bike batteries and inverter scrap.'
    },
    {
      icon: Headphones,
      title: 'Dedicated After-Sales Support',
      desc: 'Free regular maintenance reminders, battery water top-up assistance, and rapid breakdown response.'
    },
    {
      icon: RotateCcw,
      title: 'Zero Advance Payment',
      desc: 'Pay safely via UPI, cash, or card only after service completion and your 100% satisfaction.'
    }
  ];

  return (
    <section id="why-us" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <ShieldCheck size={14} /> Trust & Excellence
          </div>
          <h2 className="section-title">
            Why Customers Trust <span className="text-gradient">Meksha Solutions</span>
          </h2>
          <p className="section-subtitle">
            Over 10+ years of dedicated service providing reliable security, automotive power, and clean energy solutions.
          </p>
        </div>

        {/* Reasons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="glass-card"
                style={{
                  padding: '26px',
                  display: 'flex',
                  gap: '18px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(16, 185, 129, 0.15) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                  flexShrink: 0
                }}>
                  <Icon size={24} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#9ca3af', lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Authorized Brands Marquee / Grid */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '20px',
          padding: '36px 28px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#93c5fd',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '20px'
          }}>
            Authorized Sales & Service Brands
          </h3>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            {BRANDS.map((brand, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#ffffff'
                }}
              >
                <span>{brand.name}</span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  background: 'rgba(37, 99, 235, 0.3)',
                  color: '#93c5fd'
                }}>
                  {brand.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
