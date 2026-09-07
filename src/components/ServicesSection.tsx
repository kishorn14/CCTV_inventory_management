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
      case 'cctv': return '#3b82f6';
      case 'battery': return '#10b981';
      case 'inverter': return '#f59e0b';
      case 'water_purifier': return '#06b6d4';
      case 'solar_heater': return '#fb923c';
      default: return '#3b82f6';
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

            return (
              <div 
                key={srv.id} 
                className="glass-card"
                style={{
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `3px solid ${accentColor}`
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
                      background: `rgba(${accentColor === '#3b82f6' ? '59, 130, 246' : accentColor === '#10b981' ? '16, 185, 129' : accentColor === '#f59e0b' ? '245, 158, 11' : '6, 182, 212'}, 0.15)`,
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
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#d1d5db'
                    }}>
                      <Clock size={13} color="#60a5fa" />
                      {srv.responseTime}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '10px',
                    lineHeight: 1.3
                  }}>
                    {srv.title}
                  </h3>

                  <p style={{
                    fontSize: '0.88rem',
                    color: '#9ca3af',
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
                        color: '#e5e7eb'
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
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  {srv.startingPrice && (
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase' }}>Pricing</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                        {srv.startingPrice}
                      </div>
                    </div>
                  )}

                  {srv.comingSoon ? (
                    <button
                      onClick={() => onOpenBooking(srv.category)}
                      className="btn btn-outline btn-sm"
                      style={{ marginLeft: 'auto', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
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
