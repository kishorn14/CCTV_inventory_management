import React, { useState, useEffect } from 'react';
import { Phone, Instagram, ArrowUp } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';

interface FloatingActionsProps {
  onOpenBooking?: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = () => {
  const { shopInfo } = useShop();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultWaLink = createWhatsAppLink(
    `Hello ${shopInfo.shopName}! I am visiting your website and have an inquiry.`,
    shopInfo.whatsappPhone
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <aside
      aria-label="Quick Actions"
      style={{
        position: 'fixed',
        right: '16px',
        bottom: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
        pointerEvents: 'auto'
      }}
    >
      {/* 1. WhatsApp Button (Green with soft pulse aura) */}
      <a
        href={defaultWaLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.45), 0 0 0 4px rgba(37, 211, 102, 0.18)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          textDecoration: 'none',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.55), 0 0 0 6px rgba(37, 211, 102, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 211, 102, 0.45), 0 0 0 4px rgba(37, 211, 102, 0.18)';
        }}
      >
        <svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>

      {/* 2. Phone Call Button (Teal Blue) */}
      <a
        href={`tel:${shopInfo.phone}`}
        aria-label="Call Helpline"
        title="Call Helpline"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: '#04647a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(4, 100, 122, 0.35)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
          e.currentTarget.style.background = '#035264';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(4, 100, 122, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.background = '#04647a';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(4, 100, 122, 0.35)';
        }}
      >
        <Phone size={20} />
      </a>

      {/* 3. Instagram Button (Vibrant Signature Gradient) */}
      <a
        href={shopInfo.instagramUrl || "https://www.instagram.com/mekhasolutions?stkn=MWFlcnhkbzlpZmEybg=="}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Instagram"
        title="Visit Instagram"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(220, 39, 67, 0.38)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(220, 39, 67, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(220, 39, 67, 0.38)';
        }}
      >
        <Instagram size={21} />
      </a>

      {/* 4. Scroll to Top Button (Teal Blue) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: '#04647a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(4, 100, 122, 0.35)',
          cursor: 'pointer',
          border: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: showScrollTop ? 1 : 0.85
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
          e.currentTarget.style.background = '#035264';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(4, 100, 122, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.background = '#04647a';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(4, 100, 122, 0.35)';
        }}
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>
    </aside>
  );
};
