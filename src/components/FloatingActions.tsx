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
      setShowScrollTop(window.scrollY > 80);
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
    <>
      <style>{`
        @keyframes waPulseRing {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6), 0 4px 12px rgba(0,0,0,0.18);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(37, 211, 102, 0), 0 4px 12px rgba(0,0,0,0.18);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0), 0 4px 12px rgba(0,0,0,0.18);
          }
        }
        .floating-action-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          text-decoration: none;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background-color 0.2s ease;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
          flex-shrink: 0;
          color: #ffffff;
        }
        .floating-action-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }
        .floating-action-btn:active {
          transform: scale(0.94);
        }
        .wa-floating-btn {
          background: #25d366;
          outline: 2px solid rgba(74, 222, 128, 0.45);
          outline-offset: 3px;
          animation: waPulseRing 2.2s infinite;
        }
        .call-floating-btn {
          background: #0284a8;
        }
        .call-floating-btn:hover {
          background: #036f8d;
        }
        .ig-floating-btn {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
        }
        .top-floating-btn {
          background: #0284a8;
        }
        .top-floating-btn:hover {
          background: #036f8d;
        }
      `}</style>

      <aside
        aria-label="Quick Floating Actions"
        style={{
          position: 'fixed',
          right: '14px',
          bottom: '18px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
          pointerEvents: 'auto'
        }}
      >
        {/* 1. WhatsApp Button */}
        <a
          href={defaultWaLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Us"
          title="WhatsApp Us"
          className="floating-action-btn wa-floating-btn"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>

        {/* 2. Phone Call Button */}
        <a
          href={`tel:${shopInfo.phone}`}
          aria-label="Call Shop"
          title="Call Shop"
          className="floating-action-btn call-floating-btn"
        >
          <Phone size={19} strokeWidth={2.2} />
        </a>

        {/* 3. Instagram Button */}
        <a
          href={shopInfo.instagramUrl || "https://www.instagram.com/mekhasolutions?stkn=MWFlcnhkbzlpZmEybg=="}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Profile"
          title="Instagram Profile"
          className="floating-action-btn ig-floating-btn"
        >
          <Instagram size={20} strokeWidth={2.2} />
        </a>

        {/* 4. Scroll to Top Button */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="floating-action-btn top-floating-btn"
          style={{
            opacity: showScrollTop ? 1 : 0.85
          }}
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      </aside>
    </>
  );
};
