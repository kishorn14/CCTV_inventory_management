import React from 'react';
import { 
  X, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Phone,
  Truck
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatProductInquiry, createWhatsAppLink } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { shopInfo } = useShop();
  if (!product) return null;

  const waLink = createWhatsAppLink(formatProductInquiry(product), shopInfo.whatsappPhone);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', padding: '0' }}
      >
        {/* Product Image Header */}
        <div style={{ position: 'relative', height: '260px', width: '100%', overflow: 'hidden' }}>
          <img 
            src={product.image} 
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.4) 60%, rgba(0,0,0,0.3) 100%)'
          }} />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0, 0, 0, 0.6)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <X size={20} />
          </button>

          {/* Badges on image */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '20px',
            display: 'flex',
            gap: '8px'
          }}>
            <span style={{
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '9999px',
              textTransform: 'uppercase'
            }}>
              {product.brand}
            </span>
            {product.badge && (
              <span style={{
                background: '#f59e0b',
                color: '#111827',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '9999px'
              }}>
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px', lineHeight: 1.3 }}>
            {product.name}
          </h2>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '18px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>
              <ShieldCheck size={18} /> {product.warranty}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontWeight: 600, fontSize: '0.9rem' }}>
              <Truck size={18} /> Free Installation / Delivery
            </div>
          </div>

          <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
            {product.description}
          </p>

          {/* Key Specifications */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              Key Highlights & Specifications:
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: '10px'
            }}>
              {product.features.map((feat, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.85rem',
                  color: '#e5e7eb'
                }}>
                  <CheckCircle2 size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estimated Price / Range
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                {product.priceRange}
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#a7f3d0' }}>
              ✓ Inclusive of GST & Warranty Bill
            </div>
          </div>

          {/* Direct WhatsApp Call-to-action */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '12px'
          }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
              style={{ width: '100%' }}
            >
              <MessageCircle size={20} /> Inquire on WhatsApp
            </a>

            <a
              href={`tel:${shopInfo.phone}`}
              className="btn btn-call btn-lg"
              style={{ width: '100%' }}
            >
              <Phone size={20} /> Call: {shopInfo.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
