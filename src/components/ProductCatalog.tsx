import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  MessageCircle, 
  Check, 
  Tag, 
  Sparkles,
  Camera,
  Wifi,
  Shield,
  Sun,
  Eye,
  X
} from 'lucide-react';
import { Product, CategoryType } from '../types';
import { CATEGORIES } from '../data/shopData';
import { useShop } from '../context/ShopContext';
import { formatProductInquiry, createWhatsAppLink } from '../utils/whatsapp';

interface ProductCatalogProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onViewProduct: (product: Product) => void;
  onClose?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedCategory,
  onSelectCategory,
  onViewProduct,
  onClose
}) => {
  const { products, shopInfo } = useShop();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory || selectedCategory === 'cctv';
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch = 
      (product.name || '').toLowerCase().includes(q) ||
      (product.brand || '').toLowerCase().includes(q) ||
      (product.description || '').toLowerCase().includes(q) ||
      (Array.isArray(product.features) ? product.features.some(f => (f || '').toLowerCase().includes(q)) : false);

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'kits': return Camera;
      case 'wifi': return Wifi;
      case 'ip_nvr': return Shield;
      case 'solar_4g': return Sun;
      case 'cctv': return Camera;
      default: return Sparkles;
    }
  };

  return (
    <section id="products" className="section-padding" style={{ position: 'relative', scrollMarginTop: '80px' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ position: 'relative' }}>
          {onClose && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '10px'
            }}>
              <button
                onClick={onClose}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e2e8f0';
                  e.currentTarget.style.color = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#475569';
                }}
              >
                <X size={15} />
                <span>Hide Catalog</span>
              </button>
            </div>
          )}

          <div className="section-badge">
            <Tag size={14} /> Genuine Products &amp; Authorized Warranties
          </div>
          <h2 className="section-title">
            Explore Our <span className="text-gradient">CCTV Cameras &amp; Packages</span>
          </h2>
          <p className="section-subtitle">
            Browse bestselling HD dome/bullet kits, smart 360° Wi-Fi cameras, 4K commercial IP systems, and 4G solar solutions. Click to inquire or order directly via WhatsApp.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div style={{ marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Search Bar */}
          <div style={{
            position: 'relative',
            maxWidth: '560px',
            margin: '0 auto',
            width: '100%'
          }}>
            <Search 
              size={20} 
              color="#64748b" 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              placeholder="Search by camera model, brand (Hikvision, CP PLUS, Dahua, Imou...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '9999px',
                padding: '14px 20px 14px 48px',
                color: '#0f172a',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.05)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills Bar - Horizontally swipeable on mobile */}
          <div className="scroll-pills" style={{ justifyContent: 'flex-start' }}>
            {CATEGORIES.map((cat) => {
              const Icon = getCategoryIcon(cat.id);
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === 'all' 
                ? products.length 
                : products.filter(p => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id as CategoryType)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isSelected 
                      ? '1px solid #1d4ed8' 
                      : '1px solid #e2e8f0',
                    background: isSelected 
                      ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)' 
                      : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    boxShadow: isSelected ? '0 4px 14px rgba(29, 78, 216, 0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={16} color={isSelected ? '#ffffff' : '#2563eb'} />
                  {cat.label}
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#64748b'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1'
          }}>
            <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '16px' }}>
              No products found matching "{searchQuery}".
            </p>
            <button 
              onClick={() => { setSearchQuery(''); onSelectCategory('all'); }}
              className="btn btn-primary btn-sm"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: '20px'
          }}>
            {filteredProducts.map((product) => {
              const waLink = createWhatsAppLink(formatProductInquiry(product), shopInfo.whatsappPhone);

              return (
                <div 
                  key={product.id} 
                  className="glass-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)'
                  }}
                >
                  <div>
                    {/* Image Header with Badges */}
                    <div style={{ position: 'relative', width: '100%', height: '210px', overflow: 'hidden', background: '#f8fafc' }}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0) 50%)'
                      }} />

                      {/* Top Badges */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        display: 'flex',
                        gap: '6px'
                      }}>
                        <span style={{
                          background: '#1d4ed8',
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          textTransform: 'uppercase',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}>
                          {product.brand}
                        </span>
                        {product.badge && (
                          <span style={{
                            background: '#f59e0b',
                            color: '#ffffff',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }}>
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '20px' }}>
                      <h3 style={{
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '8px',
                        lineHeight: 1.35
                      }}>
                        {product.name}
                      </h3>

                      {/* Warranty Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#059669',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '12px'
                      }}>
                        <ShieldCheck size={16} /> {product.warranty}
                      </div>

                      {/* Features List */}
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        marginBottom: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        {(product.features || []).slice(0, 3).map((feat, idx) => (
                          <li key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            fontSize: '0.82rem',
                            color: '#475569',
                            lineHeight: 1.4
                          }}>
                            <Check size={14} color="#1d4ed8" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Price Guide */}
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '18px'
                      }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Price Guide:</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1d4ed8' }}>
                          {product.priceRange}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div style={{
                    padding: '0 20px 20px 20px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '10px'
                  }}>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm"
                      style={{ width: '100%' }}
                    >
                      <MessageCircle size={16} /> {product.comingSoon ? 'Pre-Inquire on WhatsApp' : 'Inquire on WhatsApp'}
                    </a>

                    <button
                      onClick={() => onViewProduct(product)}
                      className="btn btn-outline btn-sm"
                      title="View full specs"
                      style={{ padding: '8px 12px' }}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
