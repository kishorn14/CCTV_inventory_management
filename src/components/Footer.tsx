import React from 'react';
import { Shield, Phone, MessageCircle, Mail, MapPin, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';
import { CategoryType } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CategoryType) => void;
  onOpenBooking: () => void;
  onGoToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenBooking, onGoToAdmin }) => {
  const { shopInfo } = useShop();

  return (
    <footer style={{
      background: '#070b14',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: '60px',
      paddingBottom: '30px',
      color: '#9ca3af',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Col 1: Brand Summary */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Shield size={20} />
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {shopInfo.shopName.split(' ')[0]} <span className="text-gradient">{shopInfo.shopName.split(' ').slice(1).join(' ') || 'SOLUTIONS'}</span>
              </div>
            </div>
            <p style={{ lineHeight: 1.6, marginBottom: '20px', color: '#9ca3af' }}>
              Your trusted partner for CCTV Security, Automotive Car/Bike Batteries, Home Inverter UPS, RO Water Purifiers, and Solar Water Heaters.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={createWhatsAppLink(`Hello ${shopInfo.shopName}!`, shopInfo.whatsappPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a href={`tel:${shopInfo.phone}`} className="btn btn-call btn-sm">
                <Phone size={15} /> Call Shop
              </a>
            </div>
          </div>

          {/* Col 2: Solutions & Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
              Products & Solutions
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'CCTV Security Systems', id: 'cctv' as CategoryType },
                { label: 'Vehicle Batteries (Car & Bike)', id: 'battery' as CategoryType },
                { label: 'UPS & Pure Sine Wave Inverters', id: 'inverter' as CategoryType },
                { label: 'RO & Alkaline Water Purifiers', id: 'water_purifier' as CategoryType },
                { label: 'Solar Water Heaters (ETC/FPC)', id: 'solar_heater' as CategoryType },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href="#products"
                    onClick={() => onSelectCategory(item.id)}
                    style={{ color: '#9ca3af', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
                  >
                    • {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services & Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
              Quick Services
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button onClick={onOpenBooking} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  • Doorstep Battery Fitment
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  • CCTV Installation & Mobile View
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  • Inverter Repair & Water Topup
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  • RO Purifier Filter Replacement
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  • Solar Tank Chemical Descaling
                </button>
              </li>
              <li>
                <a href="#estimator" style={{ color: '#9ca3af' }}>• Interactive Cost Estimator</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Shop Timings & Address */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
              Store Hours & Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{shopInfo.address}, {shopInfo.city}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} color="#34d399" style={{ flexShrink: 0 }} />
                <a href={`tel:${shopInfo.phone}`} style={{ color: '#ffffff', fontWeight: 600 }}>{shopInfo.phone}</a>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                <span>{shopInfo.email}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#a7f3d0', marginTop: '4px' }}>
                🕒 {shopInfo.workingHours} ({shopInfo.workingDays})
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem'
        }}>
          <div>
            © {new Date().getFullYear()} {shopInfo.shopName}. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Genuine Authorized Brands • 100% Doorstep Satisfaction</span>
            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#93c5fd'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                title="Shop Owner Admin Portal"
              >
                <Lock size={12} /> Admin Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
