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
                  alignItems: 'flex-start',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #eff6ff 0%, #ecfdf5 100%)',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1d4ed8',
                  flexShrink: 0
                }}>
                  <Icon size={24} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Authorized Brands Marquee / Grid */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 800,
            color: '#1d4ed8',
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
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <span>{brand.name}</span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe'
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
