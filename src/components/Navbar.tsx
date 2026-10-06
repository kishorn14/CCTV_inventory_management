import React, { useState } from 'react';
import { 
  MessageCircle, 
  Menu, 
  X, 
  Phone, 
  FileText,
  MapPin,
  Clock,
  ShieldCheck,
  Calculator
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenProducts?: () => void;
  onOpenEstimator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenProducts, onOpenEstimator }) => {
  const { shopInfo } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* 1. TOP STICKY CONTACT BAR (Identical to reference site cctvsurveillancecameras.in) */}
      <div className="top-contact-bar">
        <div className="top-contact-wrapper">
          {/* Store Location */}
          <div className="top-contact-item top-store-tag">
            <MapPin size={15} color="#60a5fa" />
            <span>MEKSHA CCTV SOLUTIONS — Mittlakatte Road, Davanagere</span>
          </div>

          {/* Quick Action Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a 
              href={`tel:${shopInfo.phone}`} 
              className="top-phone-badge"
              title="Call shop now"
            >
              <Phone size={15} />
              <span>+91 63664 06305</span>
            </a>

            <a 
              href={createWhatsAppLink("Hello Meksha CCTV Solutions, I would like to request a quotation for CCTV cameras.", shopInfo.whatsappPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="top-whatsapp-badge"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Quote</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Clean White & Sticky) */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '68px'
        }}>
          {/* Logo & Store Branding */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img
              src="/logo.jpg"
              alt={shopInfo.shopName}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                objectFit: 'cover',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            />
            <div>
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                lineHeight: 1.15
              }}>
                MEKSHA <span style={{ color: '#2563eb' }}>CCTV SOLUTIONS</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                Authorized CCTV Cameras &amp; Security Systems Store
              </div>
            </div>
          </a>

          {/* Header Action Buttons (Desktop) */}
          <div style={{ display: 'none', alignItems: 'center', gap: '12px' }} className="desktop-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#059669', fontWeight: 700, marginRight: '8px' }}>
              <ShieldCheck size={16} /> 100% Genuine Brands
            </div>

            <button
              onClick={() => {
                if (onOpenEstimator) onOpenEstimator();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#1d4ed8',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                fontSize: '0.86rem',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Calculator size={15} />
              Cost Estimator
            </button>

            <a
              href="#products"
              onClick={onOpenProducts}
              style={{
                color: '#334155',
                fontSize: '0.88rem',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Browse Catalog (50)
            </a>

            <button
              onClick={onOpenBooking}
              className="btn btn-primary btn-sm"
              style={{ gap: '6px', fontSize: '0.86rem' }}
            >
              <FileText size={15} />
              Request Quotation
            </button>

            <a
              href={`tel:${shopInfo.phone}`}
              className="btn btn-call btn-sm"
              style={{ gap: '6px', fontSize: '0.86rem' }}
            >
              <Phone size={15} />
              Call 6366406305
            </a>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '7px',
              color: '#0f172a',
              cursor: 'pointer'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Open Mon - Sun: 9:00 AM - 9:00 PM
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <MapPin size={14} /> Mittlakatte Road, Davanagere - 577004
              </div>
            </div>

            <a
              href="#cctv-cost-estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-outline btn-sm btn-block"
              style={{ color: '#1d4ed8', borderColor: '#bfdbfe', background: '#eff6ff' }}
            >
              <Calculator size={16} /> Instant Cost Estimator
            </a>

            <a
              href="#products"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenProducts) onOpenProducts();
              }}
              className="btn btn-outline btn-sm btn-block"
            >
              Browse All 50 Products
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="btn btn-primary btn-sm btn-block"
            >
              <FileText size={16} /> Request Custom Quotation
            </button>

            <a
              href={`tel:${shopInfo.phone}`}
              className="btn btn-call btn-sm btn-block"
            >
              <Phone size={16} /> Call +91 63664 06305
            </a>
          </div>
        )}
      </header>
    </>
  );
};
