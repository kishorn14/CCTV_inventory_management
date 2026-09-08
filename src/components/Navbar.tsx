import React, { useState } from 'react';
import { 
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
      {/* Main Sticky Navbar (Clean White & Crisp Light Style) */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 14px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.3s ease'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '66px'
        }}>
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(29, 78, 216, 0.3)',
              color: '#ffffff'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                lineHeight: 1.1
              }}>
                {shopInfo.shopName.split(' ')[0]} <span className="text-gradient">{shopInfo.shopName.split(' ').slice(1).join(' ') || 'SOLUTIONS'}</span>
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
                  color: '#334155',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  transition: 'color 0.2s ease',
                  padding: '6px 0'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#334155')}
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
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '8px',
              color: '#0f172a',
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
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
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
                    color: '#0f172a',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <Icon size={18} color="#1d4ed8" />
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
