import React from 'react';
import { MessageCircle, Phone, Wrench } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';

interface FloatingActionsProps {
  onOpenBooking: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenBooking }) => {
  const { shopInfo } = useShop();
  const defaultWaLink = createWhatsAppLink(`Hello ${shopInfo.shopName}! I am visiting your website and have an inquiry.`, shopInfo.whatsappPhone);

  return (
    <>
      {/* Floating Desktop / General WhatsApp Bubble */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 950,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
        className="floating-desktop-bubble"
      >
        {/* Tooltip */}
        <div
          style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            padding: '8px 14px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
          Chat with Shop on WhatsApp
        </div>

        <a
          href={defaultWaLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Chat"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.5)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            textDecoration: 'none'
          }}
          className="pulse-animation"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <MessageCircle size={32} />
        </a>
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div
        className="mobile-sticky-bar"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 990,
          background: 'rgba(10, 15, 29, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '10px 16px',
          gap: '10px'
        }}
      >
        <a
          href={`tel:${shopInfo.phone}`}
          className="btn btn-call btn-sm"
          style={{ flex: 1, padding: '12px 10px', fontSize: '0.9rem' }}
        >
          <Phone size={18} /> Call Now
        </a>

        <button
          onClick={onOpenBooking}
          className="btn btn-primary btn-sm"
          style={{ flex: 1.3, padding: '12px 10px', fontSize: '0.9rem' }}
        >
          <Wrench size={18} /> Book Service
        </button>

        <a
          href={defaultWaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp btn-sm"
          style={{ padding: '12px 14px' }}
          aria-label="WhatsApp"
        >
          <MessageCircle size={20} />
        </a>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .floating-desktop-bubble {
            display: none !important;
          }
          .mobile-sticky-bar {
            display: flex !important;
          }
          body {
            padding-bottom: 74px;
          }
        }
      `}</style>
    </>
  );
};
