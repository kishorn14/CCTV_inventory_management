import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, CategoryType } from '../../types';
import { CATEGORIES } from '../../data/shopData';

const PRESET_IMAGES: Record<CategoryType, string[]> = {
  all: [],
  cctv: [
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
  ],
  battery: [
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
  ],
  inverter: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80'
  ],
  water_purifier: [
    'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585842378019-5c6438add3fe?auto=format&fit=crop&w=800&q=80'
  ],
  solar_heater: [
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80'
  ]
};

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'cctv' as CategoryType,
    brand: '',
    image: PRESET_IMAGES.cctv[0],
    badge: '',
    priceRange: '',
    warranty: '',
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
      warranty: '2 Years Brand Warranty',
      featuresText: 'High Quality Build\nFree Doorstep Fitting\nGenuine Company Warranty',
      description: 'Brand new high performance model with full official warranty and express installation.',
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
      warranty: product.warranty,
      featuresText: product.features.join('\n'),
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
      warranty: formData.warranty,
      features: features.length > 0 ? features : ['100% Genuine Brand', 'Doorstep Service Support'],
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

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const filtered = products.filter(p => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
            Product & Inventory Catalog ({products.length})
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
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
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected ? 'rgba(37, 99, 235, 0.4)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#ffffff' : '#9ca3af',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Mobile Card List (Visible on < 768px) */}
      <div className="admin-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(product => (
          <div 
            key={product.id} 
            className="glass-card" 
            style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(37, 99, 235, 0.3)', color: '#93c5fd' }}>
                    {product.brand}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'capitalize' }}>
                    {product.category.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.3 }}>
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
              background: 'rgba(255, 255, 255, 0.03)',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Price: </span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>{product.priceRange}</span>
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>
                🛡️ {product.warranty}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => openEditModal(product)}
                className="btn btn-outline btn-sm"
                style={{ borderColor: 'rgba(59, 130, 246, 0.4)', color: '#93c5fd', minHeight: '38px' }}
              >
                <Edit3 size={15} /> Edit
              </button>
              <button
                onClick={() => handleDelete(product.id, product.name)}
                className="btn btn-outline btn-sm"
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5', minHeight: '38px' }}
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Products Table (Visible on >= 768px) */}
      <div className="admin-desktop-table glass-card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)', color: '#9ca3af' }}>
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
              <tr key={product.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: '#ffffff', maxWidth: '280px', lineHeight: 1.3 }}>
                      {product.name}
                    </div>
                    {product.badge && (
                      <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 600 }}>
                        ★ {product.badge}
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '14px 18px', color: '#93c5fd', textTransform: 'capitalize' }}>
                  {product.category.replace('_', ' ')}
                </td>
                <td style={{ padding: '14px 18px', color: '#ffffff', fontWeight: 600 }}>
                  {product.brand}
                </td>
                <td style={{ padding: '14px 18px', color: '#34d399', fontWeight: 700 }}>
                  {product.priceRange}
                </td>
                <td style={{ padding: '14px 18px', color: '#9ca3af', fontSize: '0.82rem' }}>
                  {product.warranty}
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(product)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        color: '#93c5fd',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        cursor: 'pointer'
                      }}
                      title="Edit Product"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#fca5a5',
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
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-drag-handle" />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '12px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Shop'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
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
                  <label className="form-label">Brand *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Amaron / Hikvision"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    required
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
                    <option value="cctv">CCTV</option>
                    <option value="battery">Vehicle Battery</option>
                    <option value="inverter">UPS & Inverter</option>
                    <option value="water_purifier">RO Water Purifier</option>
                    <option value="solar_heater">Solar Water Heater</option>
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
                  <label className="form-label">Warranty Details *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 66 Months Warranty"
                    value={formData.warranty}
                    onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                    required
                  />
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
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#93c5fd' }}>
                    Option 1: Upload from Phone / PC
                  </span>
                  <label style={{
                    background: 'rgba(37, 99, 235, 0.25)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
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
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>
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
                            border: formData.image === imgUrl ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: formData.image === imgUrl ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
                          }}
                        />
                      ))}
                      {/* Live Image Preview */}
                      {formData.image && (
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Active Preview:</span>
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
    </div>
  );
};
