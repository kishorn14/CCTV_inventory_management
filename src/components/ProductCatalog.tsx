import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  MessageCircle, 
  Check, 
  Tag, 
  Sparkles,
  Camera,
  BatteryCharging,
  Zap,
  Droplets,
  Sun,
  Eye
} from 'lucide-react';
import { Product, CategoryType } from '../types';
import { CATEGORIES } from '../data/shopData';
import { useShop } from '../context/ShopContext';
import { formatProductInquiry, createWhatsAppLink } from '../utils/whatsapp';

interface ProductCatalogProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onViewProduct: (product: Product) => void;
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
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'cctv': return Camera;
      case 'battery': return BatteryCharging;
      case 'inverter': return Zap;
      case 'water_purifier': return Droplets;
      case 'solar_heater': return Sun;
      default: return Sparkles;
    }
  };

  return (
    <section id="products" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Tag size={14} /> Genuine Products & Authorized Warranties
          </div>
          <h2 className="section-title">
            Explore Our <span className="text-gradient">Products & Solutions</span>
          </h2>
          <p className="section-subtitle">
            Browse bestselling CCTV cameras, vehicle batteries, home inverters, RO water purifiers, and solar heaters. Click to inquire or order directly via WhatsApp.
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
              color="#9ca3af" 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              placeholder="Search by product name, brand (Amaron, Hikvision, Kent, Luminous...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                padding: '14px 20px 14px 48px',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
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
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
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
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isSelected 
                      ? '1px solid #3b82f6' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(29, 78, 216, 0.95) 100%)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#ffffff' : '#d1d5db',
                    boxShadow: isSelected ? '0 4px 15px rgba(37, 99, 235, 0.4)' : 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={16} color={isSelected ? '#ffffff' : '#60a5fa'} />
                  {cat.label}
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                    color: isSelected ? '#ffffff' : '#9ca3af'
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
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '1.1rem', color: '#9ca3af', marginBottom: '16px' }}>
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
                    height: '100%'
                  }}
                >
                  <div>
                    {/* Image Header with Badges */}
                    <div style={{ position: 'relative', width: '100%', height: '210px', overflow: 'hidden' }}>
                      <img 
                        src={product.image} 
                        alt={product.name}
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
                        background: 'linear-gradient(to top, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.2) 60%, rgba(0,0,0,0) 100%)'
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
                          background: 'rgba(37, 99, 235, 0.85)',
                          backdropFilter: 'blur(8px)',
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          textTransform: 'uppercase'
                        }}>
                          {product.brand}
                        </span>
                        {product.badge && (
                          <span style={{
                            background: 'rgba(245, 158, 11, 0.9)',
                            backdropFilter: 'blur(8px)',
                            color: '#111827',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '9999px'
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
                        color: '#ffffff',
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
                        color: '#34d399',
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
                        {product.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            fontSize: '0.82rem',
                            color: '#9ca3af',
                            lineHeight: 1.4
                          }}>
                            <Check size={14} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Price Guide */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '18px'
                      }}>
                        <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Price Guide:</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#60a5fa' }}>
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
