import React, { useState } from 'react';
import { Plus, Edit2, Trash2, RotateCcw, Check, X, Award, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BrandPartner } from '../../types';

// Preset sample images for quick 1-click selection
const PRESET_BRAND_IMAGES = [
  { label: 'Hikvision Dome Cam', category: 'cctv', url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80' },
  { label: 'CP PLUS Smart Cam', category: 'cctv', url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80' },
  { label: 'Dahua Multi Camera', category: 'cctv', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80' },
  { label: 'UNV Outdoor Cam', category: 'cctv', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80' },
  { label: 'Imou Wi-Fi Camera', category: 'cctv', url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80' },
  { label: 'Meksha 4G Solar Cam', category: 'cctv', url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80' },
];

export const AdminBrands: React.FC = () => {
  const { brands, addBrand, updateBrand, deleteBrand, resetBrands } = useShop();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<BrandPartner | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    tagline: string;
    category: 'cctv';
    image: string;
    badge: string;
  }>({
    name: '',
    tagline: '',
    category: 'cctv',
    image: PRESET_BRAND_IMAGES[0].url,
    badge: ''
  });

  const openAddModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      tagline: '',
      category: 'cctv',
      image: PRESET_BRAND_IMAGES[0].url,
      badge: 'Authorized Dealer'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (brand: BrandPartner) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      tagline: brand.tagline,
      category: 'cctv',
      image: brand.image,
      badge: brand.badge || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.image.trim()) {
      alert('Please fill in Brand Name and Image URL');
      return;
    }

    if (editingBrand) {
      updateBrand(editingBrand.id, {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        category: 'cctv',
        image: formData.image.trim(),
        badge: formData.badge.trim() || undefined
      });
    } else {
      addBrand({
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        category: 'cctv',
        image: formData.image.trim(),
        badge: formData.badge.trim() || undefined
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the brands list?`)) {
      deleteBrand(id);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all brand partners to original authorized CCTV brands (Hikvision, CP PLUS, Dahua, UNV, Imou, Meksha Pro)?')) {
      resetBrands();
    }
  };

  return (
    <div>
      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
            Authorized CCTV Brand Partners
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Manage leading camera manufacturers shown on the storefront homepage.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleReset}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Reset to default brand list"
          >
            <RotateCcw size={14} /> Reset Defaults
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

      {/* Brands Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '18px'
      }}>
        {brands.map(brand => (
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
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80';
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
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe'
              }}>
                CCTV Security
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
                  background: '#fef3c7',
                  color: '#b45309',
                  border: '1px solid #fde68a'
                }}>
                  {brand.badge}
                </span>
              )}
            </div>

            {/* Content Details */}
            <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  {brand.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                  {brand.tagline}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => openEditModal(brand)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(brand.id, brand.name)}
                  className="btn btn-outline btn-sm"
                  style={{
                    color: '#b91c1c',
                    borderColor: '#fecaca',
                    background: '#fef2f2',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 12px'
                  }}
                  title="Delete brand"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '520px', background: '#ffffff', color: '#0f172a' }}
          >
            <div className="modal-drag-handle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#1d4ed8" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  {editingBrand ? 'Edit CCTV Brand Partner' : 'Add New CCTV Brand Partner'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                {/* Brand Name */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Brand Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Hikvision / CP PLUS / Dahua"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Tagline / Key Highlight *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. World #1 in Surveillance / Smart AI Security"
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
                  placeholder="e.g. Authorized Dealer / Global #1 / Best Seller"
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
                  <Sparkles size={12} color="#d97706" /> Or Pick a High-Resolution CCTV Preset Image:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
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
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
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
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>IMAGE PREVIEW</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      {formData.name || 'Brand Name'}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
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
