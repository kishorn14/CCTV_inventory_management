import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check,
  Lock,
  Video,
  Compass
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, CategoryType } from '../../types';
import { CATEGORIES } from '../../data/shopData';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

const PRESET_IMAGES: Record<CategoryType, string[]> = {
  all: [],
  cctv: [
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
  ],
  kits: [
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80'
  ],
  wifi: [
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80'
  ],
  ip_nvr: [
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
  ],
  solar_4g: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
  ],
  wifi_4g: [
    'https://dms.mydukaan.io/original/jpeg/download-and-upload/d4579b9c-357c-402a-b1f0-863495f37583.png',
    'https://dms.mydukaan.io/original/jpeg/download-and-upload/6a31cb86-553b-4a3f-a63a-157236a306dd.png'
  ],
  ip_cameras: [
    'https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png',
    'https://dms.mydukaan.io/original/jpeg/download-and-upload/7e13a7bd-368f-4d00-9e74-411262b2b98c.png'
  ],
  hd_analog: [
    'https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png'
  ],
  dvr_nvr: [
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
  ],
  solar: [
    'https://dms.mydukaan.io/original/jpeg/media/476bc181-01e5-44a8-9872-bcca3baa81a3.png'
  ],
  storage: [
    'https://dms.mydukaan.io/original/jpeg/download-and-upload/b7a7fdc5-2cf3-44c3-9ae0-859b2ba9e3b1.png'
  ],
  networking: [
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
  ],
  cables_power: [
    'https://dms.mydukaan.io/original/jpeg/download-and-upload/d5234608-3eb1-476b-956c-d0455253b5c2.png'
  ],
  racks_accessories: [
    'https://dms.mydukaan.io/original/jpeg/download-and-upload/7691d991-ca0c-419b-95bb-09a18a0c1ecb.png'
  ]
};

interface AdminProductsProps {
  onGoToEstimatorPricing?: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ onGoToEstimatorPricing }) => {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);


  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'cctv' as CategoryType,
    brand: '',
    image: PRESET_IMAGES.cctv[0],
    badge: '',
    priceRange: '',
    warranty: '',
    sampleVideoUrl: '',
    nightVideoUrl: '',
    is360Camera: false,
    featuresText: '',
    description: '',
    popular: false
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categoryFilter !== 'all' ? categoryFilter : 'cctv',
      brand: '',
      image: PRESET_IMAGES.cctv[0],
      badge: 'New Arrival',
      priceRange: '₹3,500 - ₹5,000',
      warranty: '',
      sampleVideoUrl: '',
      nightVideoUrl: '',
      is360Camera: false,
      featuresText: 'High Quality Build\nFree Doorstep Fitting\nGenuine Company Support',
      description: 'Brand new high performance model with express installation.',
      popular: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      image: product.image,
      badge: product.badge || '',
      priceRange: product.priceRange,
      warranty: product.warranty || '',
      sampleVideoUrl: product.sampleVideoUrl || '',
      nightVideoUrl: product.nightVideoUrl || '',
      is360Camera: !!product.is360Camera,
      featuresText: (product.features || []).join('\n'),
      description: product.description,
      popular: !!product.popular
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const features = formData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const productPayload = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      image: formData.image,
      badge: formData.badge ? formData.badge : undefined,
      priceRange: formData.priceRange,
      warranty: formData.warranty.trim() ? formData.warranty.trim() : undefined,
      sampleVideoUrl: formData.sampleVideoUrl.trim() ? formData.sampleVideoUrl.trim() : undefined,
      nightVideoUrl: formData.nightVideoUrl.trim() ? formData.nightVideoUrl.trim() : undefined,
      is360Camera: formData.is360Camera,
      features: features.length > 0 ? features : [formData.brand ? '100% Genuine Brand' : 'Tested & Verified Quality', 'Doorstep Service Support'],
      description: formData.description,
      popular: formData.popular
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const promptDelete = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      const deletedName = productToDelete.name;
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
      setNotification(`"${deletedName}" was removed from the inventory.`);
      setTimeout(() => {
        setNotification(prev => (prev?.includes(deletedName) ? null : prev));
      }, 4000);
    }
  };


  const filtered = products.filter(p => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Cost Estimator Distinction Banner */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '14px',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#dbeafe',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Lock size={17} />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e40af' }}>
              Cost Estimator Products (33 Non-Deletable Items)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#475569' }}>
              Looking for CCTV Cost Estimator components (Wired/Wi-Fi/Solar cameras, DVRs, HDDs, cables &amp; accessories)? They are protected from deletion and managed under the <strong>Cost Estimator Products (33)</strong> tab where you can safely set all prices.
            </div>
          </div>
        </div>

        {onGoToEstimatorPricing && (
          <button
            type="button"
            onClick={onGoToEstimatorPricing}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#1d4ed8',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Manage Estimator Rates (33) &rarr;</span>
          </button>
        )}
      </div>

      {/* Top Header & Add Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            Product & Inventory Catalog ({products.length})
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Add new items, update prices, change warranty details, or edit specifications.
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          <Plus size={18} /> + Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map(cat => {
            const isSelected = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as CategoryType)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
                  background: isSelected ? '#eff6ff' : '#ffffff',
                  color: isSelected ? '#1d4ed8' : '#64748b',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 2px 6px rgba(29, 78, 216, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ padding: '8px 12px 8px 36px', fontSize: '0.85rem', background: '#ffffff' }}
          />
        </div>
      </div>

      {/* Mobile Card List (Visible on < 768px) */}
      <div className="admin-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(product => (
          <div 
            key={product.id} 
            className="glass-card" 
            style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                  {product.brand?.trim() && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                      {product.brand}
                    </span>
                  )}
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'capitalize' }}>
                    {product.category.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', lineHeight: 1.3 }}>
                  {product.name}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Price: </span>
                <span style={{ color: '#1d4ed8', fontWeight: 700 }}>{product.priceRange}</span>
              </div>
              {product.warranty ? (
                <div style={{ color: '#059669', fontSize: '0.78rem', fontWeight: 600 }}>
                  🛡️ {product.warranty}
                </div>
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>
                  No warranty set
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => openEditModal(product)}
                className="btn btn-outline btn-sm"
                style={{ borderColor: '#bfdbfe', background: '#eff6ff', color: '#1d4ed8', minHeight: '38px' }}
              >
                <Edit3 size={15} /> Edit
              </button>
              <button
                onClick={() => promptDelete(product)}
                className="btn btn-outline btn-sm"
                style={{ borderColor: '#fecaca', background: '#fef2f2', color: '#b91c1c', minHeight: '38px' }}
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Products Table (Visible on >= 768px) */}
      <div className="admin-desktop-table glass-card" style={{ padding: '0', overflowX: 'auto', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700 }}>
              <th style={{ padding: '14px 18px' }}>Product</th>
              <th style={{ padding: '14px 18px' }}>Category</th>
              <th style={{ padding: '14px 18px' }}>Brand</th>
              <th style={{ padding: '14px 18px' }}>Price Range</th>
              <th style={{ padding: '14px 18px' }}>Warranty</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', maxWidth: '280px', lineHeight: 1.3 }}>
                      {product.name}
                    </div>
                    {product.badge && (
                      <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700 }}>
                        ★ {product.badge}
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '14px 18px', color: '#1d4ed8', textTransform: 'capitalize', fontWeight: 600 }}>
                  {product.category.replace('_', ' ')}
                </td>
                <td style={{ padding: '14px 18px', color: '#0f172a', fontWeight: 600 }}>
                  {product.brand?.trim() ? product.brand : <span style={{ color: '#94a3b8' }}>—</span>}
                </td>
                <td style={{ padding: '14px 18px', color: '#059669', fontWeight: 800 }}>
                  {product.priceRange}
                </td>
                <td style={{ padding: '14px 18px', fontSize: '0.82rem' }}>
                  {product.warranty ? (
                    <span style={{ color: '#059669', fontWeight: 600 }}>🛡️ {product.warranty}</span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No warranty set</span>
                  )}
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(product)}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#1d4ed8',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        cursor: 'pointer'
                      }}
                      title="Edit Product"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => promptDelete(product)}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#b91c1c',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        cursor: 'pointer'
                      }}
                      title="Delete Product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-cards { display: flex !important; }
          .admin-desktop-table { display: none !important; }
        }
      `}</style>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', background: '#ffffff', color: '#0f172a' }}>
            <div className="modal-drag-handle" />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '12px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Shop'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CP PLUS, Trueview (leave blank if unbranded)"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={e => {
                      const newCat = e.target.value as CategoryType;
                      setFormData({
                        ...formData,
                        category: newCat,
                        image: PRESET_IMAGES[newCat]?.[0] || formData.image
                      });
                    }}
                  >
                    <option value="kits">HD Kits &amp; DVR</option>
                    <option value="wifi">Smart Wi-Fi &amp; PTZ</option>
                    <option value="ip_nvr">4K IP &amp; NVR</option>
                    <option value="solar_4g">4G SIM &amp; Solar</option>
                    <option value="cctv">General CCTV</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price Range *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. ₹4,500 - ₹6,000"
                    value={formData.priceRange}
                    onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Warranty (Optional - leave blank if none)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2 Years Brand Warranty (Leave blank if none)"
                    value={formData.warranty}
                    onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Only products with warranty filled here will display a warranty badge on the customer store.
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Badge (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Best Seller, Top Rated"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Image Source</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Paste image web link (https://...)"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Photo Upload & Presets Section */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1d4ed8' }}>
                    Option 1: Upload from Phone / PC
                  </span>
                  <label style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    📁 Choose Photo File / Camera
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setFormData({ ...formData, image: reader.result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Preset Options */}
                {PRESET_IMAGES[formData.category] && (
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                      Option 2: Or select a ready-made category photo:
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', overflowX: 'auto', paddingBottom: '4px' }}>
                      {PRESET_IMAGES[formData.category].map((imgUrl, i) => (
                        <img
                          key={i}
                          src={imgUrl}
                          alt="preset"
                          onClick={() => setFormData({ ...formData, image: imgUrl })}
                          style={{
                            width: '58px',
                            height: '46px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: formData.image === imgUrl ? '2px solid #1d4ed8' : '1px solid #cbd5e1',
                            boxShadow: formData.image === imgUrl ? '0 0 10px rgba(29, 78, 216, 0.3)' : 'none'
                          }}
                        />
                      ))}
                      {/* Live Image Preview */}
                      {formData.image && (
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>Active Preview:</span>
                          <img
                            src={formData.image}
                            alt="preview"
                            style={{ width: '46px', height: '46px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #10b981' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Sample Footage & 360 Rotation Controls */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Video size={18} color="#16a34a" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#166534' }}>
                    Camera Sample Footage &amp; 360° Rotation (Customer Preview)
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: '#4b5563', margin: '0 0 12px 0' }}>
                  Change the sample CCTV video clip that plays when a customer clicks the eye icon. You can provide day and night clips, or upload an MP4 file.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>
                      ☀️ Day Sample Video URL (.mp4 / link)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. /videos/cctv_outdoor.mp4 or https://..."
                      value={formData.sampleVideoUrl}
                      onChange={e => setFormData({ ...formData, sampleVideoUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>
                      🌙 Night Sample Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. /videos/cctv_street.mp4 (Optional)"
                      value={formData.nightVideoUrl}
                      onChange={e => setFormData({ ...formData, nightVideoUrl: e.target.value })}
                    />
                  </div>
                </div>

                {/* Quick Presets & Video Upload */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Quick Presets:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sampleVideoUrl: '/videos/cctv_outdoor.mp4' })}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.72rem',
                        cursor: 'pointer'
                      }}
                    >
                      Outdoor Daytime
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sampleVideoUrl: '/videos/cctv_street.mp4' })}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.72rem',
                        cursor: 'pointer'
                      }}
                    >
                      Street Perimeter
                    </button>
                  </div>

                  <label style={{
                    background: '#ffffff',
                    border: '1px solid #86efac',
                    color: '#15803d',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    📁 Upload MP4 from Device
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setFormData({ ...formData, sampleVideoUrl: reader.result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* 360 Pan-Tilt Camera Toggle */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: formData.is360Camera ? '2px solid #22c55e' : '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.is360Camera}
                    onChange={e => setFormData({ ...formData, is360Camera: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#16a34a' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                      <Compass size={15} color="#16a34a" />
                      <span>360° / Pan-Tilt Rotation Camera Feature</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Enables interactive 360° video dragging, touch swipe rotation, and virtual PTZ joystick controls for customers while watching footage.
                    </div>
                  </div>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Key Features / Bullets (One per line)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.featuresText}
                  onChange={e => setFormData({ ...formData, featuresText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Check size={16} /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        subtitle="Are you sure you want to permanently delete this product? This action cannot be undone."
        warningNote="This item will immediately be removed from your store catalog and customers will not be able to order it."
        confirmLabel="Yes, Delete Product"
        cancelLabel="Cancel"
        item={productToDelete ? {
          title: productToDelete.name,
          image: productToDelete.image,
          category: productToDelete.category,
          brand: productToDelete.brand,
          price: productToDelete.priceRange,
          badge: productToDelete.badge
        } : null}
      />

      {/* Floating Status Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1100,
          background: '#0f172a',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '12px 18px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid #334155',
          animation: 'slideUp 0.25s ease-out'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Trash2 size={14} color="#ffffff" />
          </div>
          <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>
            {notification}
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              marginLeft: '6px',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

