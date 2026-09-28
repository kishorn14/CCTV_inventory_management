import React from 'react';
import { Phone, MessageCircle, Instagram, Mail, MapPin, Lock } from 'lucide-react';
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/logo.jpg"
                alt={shopInfo.shopName}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              />
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {shopInfo.shopName.split(' ')[0]} <span className="text-gradient">{shopInfo.shopName.split(' ').slice(1).join(' ') || 'SOLUTIONS'}</span>
              </div>
            </div>
            <p style={{ lineHeight: 1.6, marginBottom: '20px', color: '#9ca3af' }}>
              Your trusted authorized partner for high-definition CCTV security surveillance, smart AI cameras, and commercial NVR installations.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
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
              <a
                href={shopInfo.instagramUrl || "https://www.instagram.com/mekhasolutions?stkn=MWFlcnhkbzlpZmEybg=="}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(45deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(220, 39, 67, 0.3)'
                }}
              >
                <Instagram size={15} /> Instagram
              </a>
            </div>
          </div>

          {/* Col 2: Solutions & Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
              CCTV Cameras &amp; Kits
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'HD Dome & Bullet Kits', id: 'kits' as CategoryType },
                { label: 'Smart Wi-Fi & PTZ Cameras', id: 'wifi' as CategoryType },
                { label: '4K IP & Commercial NVR', id: 'ip_nvr' as CategoryType },
                { label: '4G SIM & Solar Cameras', id: 'solar_4g' as CategoryType },
                { label: 'All CCTV Packages', id: 'cctv' as CategoryType },
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
              Installation &amp; Repair
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button onClick={onOpenBooking} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  • CCTV Camera Installation &amp; Wiring
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  • Mobile App Remote Live View Setup
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  • Offline Camera &amp; DVR Hard Disk Repair
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  • Annual Maintenance Contracts (AMC)
                </button>
              </li>
              <li>
                <a href="#estimator" style={{ color: '#9ca3af' }}>• Interactive CCTV Cost Estimator</a>
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
                <a 
                  href={shopInfo.googleMapsUrl || 'https://share.google/Qdy82hkQa2UO5Axtj'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#9ca3af', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  {shopInfo.address}, {shopInfo.city} ↗
                </a>
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
