import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { Product, CategoryType } from '../types';
import { useShop } from '../context/ShopContext';
import { isCameraProduct } from '../data/cameraFootageData';

interface ProductCatalogProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onViewProduct: (product: Product) => void;
  onOpenFootageModal?: (product: Product) => void;
  onClose?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedCategory,
  onSelectCategory,
  onViewProduct,
  onOpenFootageModal
}) => {
  const { 
    products, 
    categories, 
    cart, 
    addToCart, 
    updateCartQuantity, 
    clearCart,
    shopInfo 
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryPill, setActiveCategoryPill] = useState<string>('all');

  // Sort categories strictly by orderNumber (1 comes first, 2 below 1, etc.)
  const sortedCategories = [...categories].sort((a, b) => a.orderNumber - b.orderNumber);

  // Search filter helper
  const searchFilter = (product: Product) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (product.name || '').toLowerCase().includes(q) ||
      (product.brand || '').toLowerCase().includes(q) ||
      (product.description || '').toLowerCase().includes(q) ||
      (Array.isArray(product.features) ? product.features.some(f => (f || '').toLowerCase().includes(q)) : false)
    );
  };

  // Group products by category orderNumber
  const categorizedGroups = sortedCategories.map(cat => {
    const catProducts = products
      .filter(p => p.categoryNumber === cat.orderNumber)
      .filter(searchFilter);
    return {
      category: cat,
      products: catProducts
    };
  });

  // Any uncategorized products (no categoryNumber or categoryNumber doesn't match any category)
  const uncategorizedProducts = products
    .filter(p => !sortedCategories.some(c => c.orderNumber === p.categoryNumber))
    .filter(searchFilter);

  // Calculate total matching products
  const totalMatchingProducts = categorizedGroups.reduce((acc, g) => acc + g.products.length, 0) + uncategorizedProducts.length;

  // Cart summary calculations
  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const prod = products.find(p => p.id === id);
      return prod ? { product: prod, qty } : null;
    })
    .filter((entry): entry is { product: Product; qty: number } => entry !== null && entry.qty > 0);

  const totalCartCount = cartEntries.reduce((sum, item) => sum + item.qty, 0);
  const totalCartPrice = cartEntries.reduce((sum, item) => sum + (item.product.price || 0) * item.qty, 0);

  // WhatsApp formatted cart message
  const generateWhatsAppCartUrl = () => {
    const whatsappNum = (shopInfo.whatsappPhone || '916366406305').replace(/[^0-9]/g, '');
    const itemsList = cartEntries.map(item => {
      const p = item.product;
      const priceText = p.price ? `₹${(p.price * item.qty).toLocaleString('en-IN')}` : 'Price on request';
      return `• ${p.name} (Qty: ${item.qty}) - ${priceText}`;
    }).join('\n');

    const message = `Hello ${shopInfo.shopName || 'Mekha CCTV Solutions'},\nI would like to place an order for the following items:\n\n${itemsList}\n\n*Total Estimated:* ₹${totalCartPrice.toLocaleString('en-IN')}\n\nPlease confirm stock availability and installation in Davanagere.`;
    return `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
  };

  // Smooth scroll helper for horizontal tracks
  const scrollRow = (trackId: string, direction: 'left' | 'right') => {
    const track = document.getElementById(trackId);
    if (track) {
      const scrollDistance = track.clientWidth * 0.75;
      track.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  // Smooth scroll helper to jump to a specific category section
  const scrollToCategorySection = (catId: string) => {
    setActiveCategoryPill(catId);
    if (onSelectCategory) {
      onSelectCategory(catId as CategoryType);
    }
    if (catId === 'all') {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const el = document.getElementById(`cat-row-${catId}`);
      if (el) {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // React to parent category selection changes (from navbar or footer)
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const matched = categories.find(c => c.id === selectedCategory);
      if (matched) {
        setActiveCategoryPill(matched.id);
        const el = document.getElementById(`cat-row-${matched.id}`);
        if (el) {
          const yOffset = -90;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }
  }, [selectedCategory, categories]);

  return (
    <section id="products" style={{ position: 'relative', scrollMarginTop: '80px', padding: '6px 0 0 0' }}>
      <div className="container">
        
        {/* Compact, Clean Search Bar */}
        <div style={{ maxWidth: '640px', margin: '0 auto 8px auto', position: 'relative' }}>
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

        {/* Dynamic Category Navigation Pills (Ordered by orderNumber 1, 2, 3...) */}
        <div 
          className="scroll-pills" 
          style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: '8px', 
            padding: '2px 2px 2px 2px', 
            marginBottom: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* All Categories Pill */}
          <button
            onClick={() => scrollToCategorySection('all')}
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
              border: activeCategoryPill === 'all' ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
              background: activeCategoryPill === 'all' 
                ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)' 
                : '#ffffff',
              color: activeCategoryPill === 'all' ? '#ffffff' : '#334155',
              boxShadow: activeCategoryPill === 'all' 
                ? '0 3px 12px rgba(29, 78, 216, 0.28)' 
                : '0 1px 3px rgba(0,0,0,0.03)',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Sparkles size={15} color={activeCategoryPill === 'all' ? '#ffffff' : '#2563eb'} />
            <span>All Categories ({products.length})</span>
          </button>

          {/* Individual Category Pills in 1, 2, 3... Sequence */}
          {sortedCategories.map((cat) => {
            const isSelected = activeCategoryPill === cat.id;
            const count = products.filter(p => p.categoryNumber === cat.orderNumber).length;

            return (
              <button
                key={cat.id}
                onClick={() => scrollToCategorySection(cat.id)}
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
                <span>{cat.name}</span>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.2)' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#64748b'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>


        {/* Empty State if No Matching Products */}
        {totalMatchingProducts === 0 ? (
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
              onClick={() => { setSearchQuery(''); scrollToCategorySection('all'); }}
              className="btn btn-primary btn-sm"
            >
              Reset Search &amp; View All Products ({products.length})
            </button>
          </div>
        ) : (
          /* Stacked Category Rows Ordered 1, 2, 3... */
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {categorizedGroups.map(({ category: cat, products: catProducts }, index) => {
              // Hide category row if search filtered out all items in this category
              if (catProducts.length === 0) return null;

              const trackId = `track-cat-${cat.id}`;
              const isLast = index === categorizedGroups.length - 1 && uncategorizedProducts.length === 0;

              return (
                <div 
                  key={cat.id} 
                  id={`cat-row-${cat.id}`}
                  className="category-horizontal-section"
                  style={isLast ? { marginBottom: 0 } : undefined}
                >
                  {/* Category Name Displayed Prominently Above the Products */}
                  <div className="category-section-header">
                    <div className="category-title-wrap">
                      <h2 className="category-title-text">
                        {cat.name}
                      </h2>
                      <span className="category-item-count">
                        {catProducts.length} product{catProducts.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Desktop Left / Right Scroll Navigation Arrows */}
                    <div className="category-scroll-arrows">
                      <button 
                        onClick={() => scrollRow(trackId, 'left')}
                        className="category-scroll-arrow-btn"
                        title="Scroll Left"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={() => scrollRow(trackId, 'right')}
                        className="category-scroll-arrow-btn"
                        title="Scroll Right"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scroll Track (Matching Reference Screenshot) */}
                  <div id={trackId} className="horizontal-product-track">
                    {catProducts.map((product) => {
                      const sellingPrice = product.price || 0;
                      const mrp = product.mrp || 0;
                      const hasDiscount = mrp > sellingPrice && sellingPrice > 0;
                      const discountPercent = hasDiscount ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
                      const qty = cart[product.id] || 0;

                      return (
                        <div 
                          key={product.id}
                          className="horizontal-product-card"
                        >
                          {/* Image Box with Badges */}
                          <div 
                            className="horizontal-card-img-wrap"
                            onClick={() => onViewProduct(product)}
                            title={`Click to view details of ${product.name}`}
                          >
                            {/* Brand Badge */}
                            {product.brand?.trim() && (
                              <span className="horizontal-brand-tag">
                                {product.brand}
                              </span>
                            )}

                            {/* Green Discount Tag */}
                            {discountPercent > 0 && (
                              <span className="horizontal-discount-badge-top">
                                {discountPercent}% OFF
                              </span>
                            )}

                            {/* Eye Symbol for Camera Products (Watch Footage) */}
                            {isCameraProduct(product) && onOpenFootageModal && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenFootageModal(product);
                                }}
                                className="horizontal-footage-eye-btn"
                                title="Watch Recorded Video Footage (Day & Night Vision)"
                              >
                                <Eye size={17} />
                              </button>
                            )}

                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="horizontal-card-img"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = 'https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png';
                              }}
                            />
                          </div>

                          {/* Card Content */}
                          <div className="horizontal-card-body">
                            {/* Stock & Warranty Badge */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '6px' }}>
                              <span style={{ fontSize: '0.70rem', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '1px 6px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                                ⚡ In Stock
                              </span>
                              {product.warranty && product.warranty.trim() !== '' && (
                                <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>
                                  🛡️ {product.warranty}
                                </span>
                              )}
                            </div>

                            {/* Title (2 Lines Ellipsis) */}
                            <h3 
                              onClick={() => onViewProduct(product)}
                              className="horizontal-card-title"
                              title={product.name}
                            >
                              {product.name}
                            </h3>

                            {/* Price Row: Selling Price, MRP strikethrough, (XX% OFF) green */}
                            <div className="horizontal-card-price-row">
                              {sellingPrice > 0 ? (
                                <>
                                  <span className="horizontal-selling-price">
                                    ₹{sellingPrice.toLocaleString('en-IN')}
                                  </span>
                                  {mrp > sellingPrice && (
                                    <span className="horizontal-mrp-price">
                                      ₹{mrp.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                  {discountPercent > 0 && (
                                    <span className="horizontal-discount-text">
                                      ({discountPercent}% OFF)
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1d4ed8' }}>
                                  {product.priceRange || 'Enquire for Price'}
                                </span>
                              )}
                            </div>

                            {/* Action Buttons: ADD TO CART / - 1 + Quantity Controls */}
                            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                              {qty === 0 ? (
                                <button
                                  onClick={() => addToCart(product.id)}
                                  className="horizontal-add-cart-btn"
                                >
                                  ADD TO CART
                                </button>
                              ) : (
                                <div className="horizontal-qty-box">
                                  <button
                                    onClick={() => updateCartQuantity(product.id, qty - 1)}
                                    className="horizontal-qty-btn"
                                    title="Decrease quantity"
                                  >
                                    –
                                  </button>
                                  <span className="horizontal-qty-num">
                                    {qty}
                                  </span>
                                  <button
                                    onClick={() => updateCartQuantity(product.id, qty + 1)}
                                    className="horizontal-qty-btn"
                                    title="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                              )}

                              {/* View Full Specs text link */}
                              <button
                                onClick={() => onViewProduct(product)}
                                style={{
                                  width: '100%',
                                  marginTop: '6px',
                                  background: 'none',
                                  border: 'none',
                                  color: '#64748b',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textAlign: 'center',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px'
                                }}
                              >
                                <FileText size={12} />
                                <span>View Full Specs</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Uncategorized Products Row (If any products have no assigned category) */}
            {uncategorizedProducts.length > 0 && (
              <div 
                id="cat-row-uncategorized"
                className="category-horizontal-section"
                style={{ marginBottom: 0 }}
              >
                <div className="category-section-header">
                  <div className="category-title-wrap">
                    <h2 className="category-title-text">
                      Additional CCTV Accessories &amp; Components
                    </h2>
                    <span className="category-item-count">
                      {uncategorizedProducts.length} products
                    </span>
                  </div>

                  <div className="category-scroll-arrows">
                    <button 
                      onClick={() => scrollRow('track-cat-uncategorized', 'left')}
                      className="category-scroll-arrow-btn"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => scrollRow('track-cat-uncategorized', 'right')}
                      className="category-scroll-arrow-btn"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div id="track-cat-uncategorized" className="horizontal-product-track">
                  {uncategorizedProducts.map((product) => {
                    const sellingPrice = product.price || 0;
                    const mrp = product.mrp || 0;
                    const hasDiscount = mrp > sellingPrice && sellingPrice > 0;
                    const discountPercent = hasDiscount ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
                    const qty = cart[product.id] || 0;

                    return (
                      <div 
                        key={product.id}
                        className="horizontal-product-card"
                      >
                        <div 
                          className="horizontal-card-img-wrap"
                          onClick={() => onViewProduct(product)}
                        >
                          {product.brand?.trim() && (
                            <span className="horizontal-brand-tag">
                              {product.brand}
                            </span>
                          )}

                          {discountPercent > 0 && (
                            <span className="horizontal-discount-badge-top">
                              {discountPercent}% OFF
                            </span>
                          )}

                          {isCameraProduct(product) && onOpenFootageModal && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenFootageModal(product);
                              }}
                              className="horizontal-footage-eye-btn"
                            >
                              <Eye size={17} />
                            </button>
                          )}

                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="horizontal-card-img"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png';
                            }}
                          />
                        </div>

                        <div className="horizontal-card-body">
                          <h3 
                            onClick={() => onViewProduct(product)}
                            className="horizontal-card-title"
                            title={product.name}
                          >
                            {product.name}
                          </h3>

                          <div className="horizontal-card-price-row">
                            {sellingPrice > 0 ? (
                              <>
                                <span className="horizontal-selling-price">
                                  ₹{sellingPrice.toLocaleString('en-IN')}
                                </span>
                                {mrp > sellingPrice && (
                                  <span className="horizontal-mrp-price">
                                    ₹{mrp.toLocaleString('en-IN')}
                                  </span>
                                )}
                                {discountPercent > 0 && (
                                  <span className="horizontal-discount-text">
                                    ({discountPercent}% OFF)
                                  </span>
                                )}
                              </>
                            ) : (
                              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1d4ed8' }}>
                                {product.priceRange || 'Enquire for Price'}
                              </span>
                            )}
                          </div>

                          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                            {qty === 0 ? (
                              <button
                                onClick={() => addToCart(product.id)}
                                className="horizontal-add-cart-btn"
                              >
                                ADD TO CART
                              </button>
                            ) : (
                              <div className="horizontal-qty-box">
                                <button
                                  onClick={() => updateCartQuantity(product.id, qty - 1)}
                                  className="horizontal-qty-btn"
                                >
                                  –
                                </button>
                                <span className="horizontal-qty-num">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(product.id, qty + 1)}
                                  className="horizontal-qty-btn"
                                >
                                  +
                                </button>
                              </div>
                            )}

                            <button
                              onClick={() => onViewProduct(product)}
                              style={{
                                width: '100%',
                                marginTop: '6px',
                                background: 'none',
                                border: 'none',
                                color: '#64748b',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              <FileText size={12} />
                              <span>View Full Specs</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Floating Sticky Cart Bar when items are selected */}
      {totalCartCount > 0 && (
        <div className="sticky-cart-bar">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                border: '1.5px solid #bfdbfe'
              }}>
                🛒
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>
                  {totalCartCount} item{totalCartCount > 1 ? 's' : ''} in Cart: <span style={{ color: '#16a34a', fontWeight: 900 }}>₹{totalCartPrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Davanagere wholesale rates with genuine brand warranty
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={clearCart}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#64748b',
                  borderRadius: '8px',
                  padding: '9px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Clear Cart
              </button>

              <a
                href={generateWhatsAppCartUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <MessageCircle size={18} />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
