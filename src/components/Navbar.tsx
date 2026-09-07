import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  Shield, 
  Wrench, 
  ShoppingBag, 
  Calculator, 
  MapPin 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const { shopInfo } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Services', href: '#services', icon: Wrench },
    { label: 'Products', href: '#products', icon: ShoppingBag },
    { label: 'Cost Estimator', href: '#estimator', icon: Calculator },
    { label: 'Why Us', href: '#why-us', icon: Shield },
    { label: 'Contact', href: '#contact', icon: MapPin },
  ];

  return (
    <>
      {/* Top Notification / Emergency Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #1e3a8a 0%, #1d4ed8 50%, #047857 100%)',
        color: '#ffffff',
        fontSize: '0.82rem',
        padding: '7px 0',
        fontWeight: 500,
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#4ade80',
              animation: 'pulseGlow 1.5s infinite' 
            }} />
            <span>⚡ Professional CCTV Sales, Doorstep Installation & Repair Services</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a 
              href={`tel:${shopInfo.phone}`} 
              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fff', fontWeight: 600 }}
            >
              <Phone size={13} /> {shopInfo.phone}
            </a>
            <span style={{ opacity: 0.6 }}>|</span>
            <span>🕒 {shopInfo.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'rgba(10, 15, 29, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s ease'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '74px'
        }}>
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
              color: '#ffffff'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                lineHeight: 1.1
              }}>
                {shopInfo.shopName.split(' ')[0]} <span className="text-gradient">{shopInfo.shopName.split(' ').slice(1).join(' ') || 'SOLUTIONS'}</span>
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                {shopInfo.tagline}
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '28px' }} className="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  transition: 'color 0.2s ease',
                  padding: '6px 0'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons (Desktop) */}
          <div style={{ display: 'none', alignItems: 'center', gap: '12px' }} className="desktop-nav">
            <a
              href={createWhatsAppLink(`Hello ${shopInfo.shopName}! I would like to inquire about your products and services.`, shopInfo.whatsappPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>

            <button
              onClick={onOpenBooking}
              className="btn btn-primary btn-sm"
            >
              <Wrench size={16} />
              Book Service
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '8px',
              color: '#ffffff',
              cursor: 'pointer'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div style={{
            background: '#111827',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#ffffff',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <Icon size={18} color="#60a5fa" />
                  {link.label}
                </a>
              );
            })}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="btn btn-primary btn-block"
              >
                <Wrench size={18} /> Book a Service / Repair
              </button>

              <a
                href={createWhatsAppLink(`Hello ${shopInfo.shopName}! I would like to chat regarding your products.`, shopInfo.whatsappPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-block"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Inline styles for responsive visibility */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
};
