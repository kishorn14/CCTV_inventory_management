import React, { useState } from 'react';
import { Plus, Edit2, Trash2, RotateCcw, Check, X, Award, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BrandPartner } from '../../types';

// Preset sample images for quick 1-click selection
const PRESET_BRAND_IMAGES = [
  { label: 'Exide Battery', category: 'battery', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80' },
  { label: 'Amaron Battery', category: 'battery', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80' },
  { label: 'Luminous Inverter', category: 'battery', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Heavy Duty Commercial', category: 'battery', url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80' },
  { label: 'CP PLUS Smart Cam', category: 'cctv', url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80' },
  { label: 'Hikvision Dome Cam', category: 'cctv', url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80' },
  { label: 'Dahua Multi Camera', category: 'cctv', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80' },
  { label: 'UNV Outdoor Cam', category: 'cctv', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80' },
];

export const AdminBrands: React.FC = () => {
  const { brands, addBrand, updateBrand, deleteBrand, resetBrands } = useShop();

  const [activeCategory, setActiveCategory] = useState<'all' | 'battery' | 'cctv'>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<BrandPartner | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    tagline: string;
    category: 'battery' | 'cctv';
    image: string;
    badge: string;
  }>({
    name: '',
    tagline: '',
    category: 'battery',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    badge: ''
  });

  const filteredBrands = brands.filter(b => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  const openAddModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      tagline: '',
      category: activeCategory === 'cctv' ? 'cctv' : 'battery',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
      badge: 'Authorized Dealer'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (brand: BrandPartner) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      tagline: brand.tagline,
      category: brand.category,
      image: brand.image,
      badge: brand.badge || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingBrand) {
      updateBrand(editingBrand.id, {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        category: formData.category,
        image: formData.image.trim(),
        badge: formData.badge.trim() || undefined
      });
    } else {
      addBrand({
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        category: formData.category,
        image: formData.image.trim(),
        badge: formData.badge.trim() || undefined
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete brand "${name}"?`)) {
      deleteBrand(id);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all brand partners to default seed (Exide, Amaron, Luminous, CP Plus, Hikvision, Dahua, UNV)?')) {
      resetBrands();
    }
  };

  return (
    <div>
      {/* Top Header Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Award size={22} color="#d97706" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              Trusted Brand Partners &amp; Logos
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.86rem' }}>
            Customize the official brand showcase for Batteries (Exide, Amaron, Luminous) and CCTV (CP Plus, Hikvision, Dahua, etc.).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleReset}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={15} /> Reset Defaults
          </button>

          <button
            onClick={openAddModal}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add Brand
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'all' as const, label: `All Brands (${brands.length})` },
          { id: 'battery' as const, label: `Battery & Inverters (${brands.filter(b => b.category === 'battery').length})` },
          { id: 'cctv' as const, label: `CCTV Security (${brands.filter(b => b.category === 'cctv').length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: activeCategory === tab.id ? '1.5px solid #1d4ed8' : '1px solid #e2e8f0',
              background: activeCategory === tab.id ? '#eff6ff' : '#ffffff',
              color: activeCategory === tab.id ? '#1d4ed8' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Brands Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '18px'
      }}>
        {filteredBrands.map(brand => (
          <div
            key={brand.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Image Preview Area */}
            <div style={{
              height: '140px',
              background: '#f8fafc',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px'
            }}>
              <img
                src={brand.image}
                alt={brand.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px'
                }}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <span style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                background: brand.category === 'battery' ? '#ecfdf5' : '#eff6ff',
                color: brand.category === 'battery' ? '#059669' : '#1d4ed8',
                border: `1px solid ${brand.category === 'battery' ? '#a7f3d0' : '#bfdbfe'}`
              }}>
                {brand.category === 'battery' ? 'Battery / Inverter' : 'CCTV Security'}
              </span>

              {brand.badge && (
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#ffffff',
                  backdropFilter: 'blur(4px)'
                }}>
                  {brand.badge}
                </span>
              )}
            </div>

            {/* Content Details */}
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  {brand.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4, marginBottom: '14px' }}>
                  {brand.tagline}
                </p>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '12px'
              }}>
                <button
                  onClick={() => openEditModal(brand)}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(brand.id, brand.name)}
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer'
                  }}
                  title="Delete Brand"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Brand Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '580px', padding: '24px', background: '#ffffff', color: '#0f172a' }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '12px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {editingBrand ? `Edit Brand: ${editingBrand.name}` : 'Add New Trusted Brand'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                {/* Brand Name */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Brand Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Exide / CP Plus"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Category */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Brand Category *</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as 'battery' | 'cctv' })}
                  >
                    <option value="battery">🔋 Battery &amp; Inverters</option>
                    <option value="cctv">📹 CCTV Security</option>
                  </select>
                </div>
              </div>

              {/* Tagline */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Tagline / Highlight *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Power That Lasts / Security Simplified"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  required
                />
              </div>

              {/* Badge */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Badge Label (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Authorized Dealer / Best Seller"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                />
              </div>

              {/* Image URL with live preview */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={14} color="#1d4ed8" /> Image URL *
                </label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>

              {/* Preset Image Selector */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <Sparkles size={12} color="#d97706" /> Or Pick a High-Resolution Preset Image:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                  {PRESET_BRAND_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: formData.image === preset.url ? '1.5px solid #1d4ed8' : '1px solid #e2e8f0',
                        background: formData.image === preset.url ? '#eff6ff' : '#f8fafc',
                        color: formData.image === preset.url ? '#1d4ed8' : '#475569',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: preset.category === 'battery' ? '#10b981' : '#3b82f6', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Box */}
              {formData.image && (
                <div style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Image Live Preview:</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{formData.name || 'Brand Name'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formData.tagline || 'Tagline'}</div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Check size={16} /> Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
