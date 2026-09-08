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
        style={{ maxWidth: '680px', padding: '0', background: '#ffffff', color: '#0f172a' }}
      >
        {/* Product Image Header */}
        <div style={{ position: 'relative', height: '260px', width: '100%', overflow: 'hidden', background: '#f8fafc' }}>
          <img 
            src={product.image} 
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.1) 60%, rgba(0,0,0,0) 100%)'
          }} />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.85)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
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
              background: '#1d4ed8',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}>
              {product.brand}
            </span>
            {product.badge && (
              <span style={{
                background: '#f59e0b',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '9999px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
            {product.name}
          </h2>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '18px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 700, fontSize: '0.9rem' }}>
              <ShieldCheck size={18} /> {product.warranty}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1d4ed8', fontWeight: 700, fontSize: '0.9rem' }}>
              <Truck size={18} /> Free Installation / Delivery
            </div>
          </div>

          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
            {product.description}
          </p>

          {/* Key Specifications */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
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
                  background: '#f8fafc',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.85rem',
                  color: '#334155'
                }}>
                  <CheckCircle2 size={16} color="#1d4ed8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Box */}
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #ecfdf5 100%)',
            border: '1px solid #bfdbfe',
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
              <div style={{ fontSize: '0.8rem', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Estimated Price / Range
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                {product.priceRange}
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#065f46', fontWeight: 600 }}>
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
