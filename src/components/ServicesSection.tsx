import React from 'react';
import { 
  Camera, 
  BatteryCharging, 
  Zap, 
  Droplets, 
  Sun, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryType } from '../types';

interface ServicesSectionProps {
  onOpenBooking: (category: CategoryType) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking }) => {
  const { services } = useShop();

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'cctv': return Camera;
      case 'battery': return BatteryCharging;
      case 'inverter': return Zap;
      case 'water_purifier': return Droplets;
      case 'solar_heater': return Sun;
      default: return Wrench;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cctv': return '#1d4ed8';
      case 'battery': return '#059669';
      case 'inverter': return '#d97706';
      case 'water_purifier': return '#0284c7';
      case 'solar_heater': return '#ea580c';
      default: return '#1d4ed8';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'cctv': return '#eff6ff';
      case 'battery': return '#ecfdf5';
      case 'inverter': return '#fffbeb';
      case 'water_purifier': return '#f0f9ff';
      case 'solar_heater': return '#fff7ed';
      default: return '#eff6ff';
    }
  };

  return (
    <section id="services" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Wrench size={14} /> Doorstep Repair, Maintenance & Setup
          </div>
          <h2 className="section-title">
            Our Professional <span className="text-gradient">Service Offerings</span>
          </h2>
          <p className="section-subtitle">
            Trained technicians, transparent pricing, and genuine spare parts. Book a doorstep visit in seconds with zero advance payment.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: '20px'
        }}>
          {services.map((srv) => {
            const Icon = getServiceIcon(srv.category);
            const accentColor = getCategoryColor(srv.category);
            const iconBg = getCategoryBg(srv.category);

            return (
              <div 
                key={srv.id} 
                className="glass-card"
                style={{
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${accentColor}`,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderTopColor: accentColor,
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)'
                }}
              >
                <div>
                  {/* Icon & Response Time Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px'
                  }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: accentColor
                    }}>
                      <Icon size={26} />
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      <Clock size={13} color="#2563eb" />
                      {srv.responseTime}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '10px',
                    lineHeight: 1.3
                  }}>
                    {srv.title}
                  </h3>

                  <p style={{
                    fontSize: '0.88rem',
                    color: '#64748b',
                    lineHeight: 1.55,
                    marginBottom: '20px'
                  }}>
                    {srv.shortDesc}
                  </p>

                  {/* Bullet points */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginBottom: '24px'
                  }}>
                    {srv.bulletPoints.map((point, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '0.84rem',
                        color: '#334155'
                      }}>
                        <CheckCircle2 size={16} color={accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with Price & Booking button */}
                <div style={{
                  paddingTop: '18px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  {srv.startingPrice && (
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Pricing</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        {srv.startingPrice}
                      </div>
                    </div>
                  )}

                  {srv.comingSoon ? (
                    <button
                      onClick={() => onOpenBooking(srv.category)}
                      className="btn btn-outline btn-sm"
                      style={{ marginLeft: 'auto', border: '1px solid #fde68a', background: '#fffbeb', color: '#b45309' }}
                    >
                      Pre-Inquire on WhatsApp <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenBooking(srv.category)}
                      className="btn btn-primary btn-sm"
                      style={{ marginLeft: 'auto' }}
                    >
                      Book Doorstep Visit <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
