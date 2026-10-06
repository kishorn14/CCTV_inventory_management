import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Sparkles,
  Camera,
  Wifi,
  Shield,
  Sun,
  HardDrive,
  Network,
  Zap,
  Box,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Product, CategoryType } from '../types';
import { CATEGORIES } from '../data/shopData';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';

interface ProductCatalogProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onViewProduct: (product: Product) => void;
  onClose?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedCategory,
  onSelectCategory,
  onViewProduct
}) => {
  const { products, shopInfo } = useShop();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
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
      case 'wifi_4g': return Wifi;
      case 'ip_cameras': return Shield;
      case 'hd_analog': return Camera;
      case 'dvr_nvr': return HardDrive;
      case 'solar': return Sun;
      case 'storage': return DatabaseIcon;
      case 'networking': return Network;
      case 'cables_power': return Zap;
      case 'racks_accessories': return Box;
      default: return Sparkles;
    }
  };

  const DatabaseIcon = HardDrive;

  return (
    <section id="products" style={{ position: 'relative', scrollMarginTop: '80px', padding: '24px 0 48px 0' }}>
      <div className="container">
        
        {/* Compact, Clean Search Bar */}
        <div style={{ maxWidth: '640px', margin: '0 auto 20px auto', position: 'relative' }}>
          <Search 
            size={18} 
            color="#64748b" 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            placeholder="Search cameras, DVR, NVR, cables, hard disks, accessories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '13px 20px 13px 46px',
              color: '#0f172a',
              fontSize: '0.94rem',
              fontWeight: 500,
              outline: 'none',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.12)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(15, 23, 42, 0.04)';
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
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills Bar (Horizontally scrollable) */}
        <div 
          className="scroll-pills" 
          style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: '8px', 
            padding: '4px 4px 18px 4px', 
            marginBottom: '20px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
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
                  gap: '7px',
                  padding: '9px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  border: isSelected ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)' 
                    : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  boxShadow: isSelected 
                    ? '0 3px 12px rgba(29, 78, 216, 0.28)' 
                    : '0 1px 3px rgba(0,0,0,0.03)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <Icon size={15} color={isSelected ? '#ffffff' : '#2563eb'} />
                <span>{cat.label}</span>
                <span style={{
                  fontSize: '0.72rem',
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

        {/* Results Info & Counter */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px',
          padding: '0 4px',
          fontSize: '0.86rem',
          color: '#64748b'
        }}>
          <div>
            Showing <strong style={{ color: '#0f172a' }}>{filteredProducts.length}</strong> items from shop catalog
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
            <CheckCircle2 size={15} /> All 100% Genuine with Brand Warranty
          </div>
        </div>

        {/* Products Grid (Dukaan / Reference Site Style) */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1'
          }}>
            <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '14px' }}>
              No items found matching "{searchQuery}".
            </p>
            <button 
              onClick={() => { setSearchQuery(''); onSelectCategory('all'); }}
              className="btn btn-primary btn-sm"
            >
              View All Products (50)
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))',
            gap: '18px'
          }}>
            {filteredProducts.map((product) => {
              const sellingPrice = product.price || 0;
              const mrp = product.mrp || 0;
              const hasDiscount = mrp > sellingPrice && sellingPrice > 0;
              const discountPercent = hasDiscount ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

              const inquiryText = sellingPrice > 0
                ? `Hello Meksha CCTV Solutions! I am interested in purchasing:\n\n*${product.name}*\nBrand: ${product.brand}\nSelling Price: ₹${sellingPrice.toLocaleString('en-IN')}\n\nPlease share availability, best quotation and delivery/installation details.`
                : `Hello Meksha CCTV Solutions! I want to enquire about the price and availability of:\n\n*${product.name}*\nBrand: ${product.brand}\n\nPlease share quotation.`;

              const waLink = createWhatsAppLink(inquiryText, shopInfo.whatsappPhone);

              return (
                <div 
                  key={product.id} 
                  className="dukaan-card"
                >
                  {/* Image Container with Badges */}
                  <div 
                    className="dukaan-card-img-wrap"
                    onClick={() => onViewProduct(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="dukaan-brand-tag">
                      {product.brand}
                    </span>

                    {discountPercent > 0 && (
                      <span className="dukaan-discount-tag">
                        {discountPercent}% OFF
                      </span>
                    )}

                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="dukaan-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png';
                      }}
                    />
                  </div>

                  {/* Product Details Body */}
                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      {/* Stock & Warranty Badge Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="dukaan-stock-badge">
                          ⚡ In Stock · Davanagere
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                          {product.unit ? `Unit: ${product.unit}` : ''}
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3 
                        onClick={() => onViewProduct(product)}
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          marginBottom: '10px',
                          lineHeight: 1.35,
                          height: '2.7em',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          cursor: 'pointer'
                        }}
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Price Section */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                        {sellingPrice > 0 ? (
                          <>
                            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111827', fontFamily: 'Outfit, sans-serif' }}>
                              ₹{sellingPrice.toLocaleString('en-IN')}
                            </span>
                            {mrp > sellingPrice && (
                              <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                ₹{mrp.toLocaleString('en-IN')}
                              </span>
                            )}
                          </>
                        ) : (
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1d4ed8' }}>
                            Enquire for Price
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: WhatsApp Quote + Direct Call */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '6px' }}>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp btn-sm"
                        style={{
                          fontSize: '0.8rem',
                          padding: '6px 10px',
                          gap: '5px',
                          borderRadius: '8px',
                          whiteSpace: 'nowrap'
                        }}
                        title="Request quotation on WhatsApp"
                      >
                        <MessageCircle size={15} />
                        <span>WhatsApp Quote</span>
                      </a>

                      <a
                        href={`tel:${shopInfo.phone}`}
                        className="btn btn-call btn-sm"
                        style={{
                          fontSize: '0.8rem',
                          padding: '6px 10px',
                          gap: '4px',
                          borderRadius: '8px'
                        }}
                        title="Call shop directly"
                      >
                        <Phone size={14} />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() => onViewProduct(product)}
                        className="btn btn-outline btn-sm"
                        style={{
                          padding: '6px 8px',
                          borderRadius: '8px',
                          color: '#475569'
                        }}
                        title="View details & specifications"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
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
