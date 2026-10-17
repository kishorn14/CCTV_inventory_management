import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff,
  Search,
  Package,
  Minus
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ComboOffer, Product } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

const PRESET_COMBO_IMAGES = [
  { label: 'Trueview HD Analog Banner', url: '/combos/analog_combo_banner.png' },
  { label: 'CP PLUS IP Camera Banner', url: '/combos/ip_combo_banner.jpg' },
  { label: 'EYEQUBE 4G Solar PTZ Banner', url: '/combos/solar_combo_banner.jpg' },
  { label: 'Wi-Fi Smart 360° Cam', url: '/products/cpplus_e34a.jpg' }
];

export const AdminComboOffers: React.FC = () => {
  const { comboOffers, addComboOffer, updateComboOffer, deleteComboOffer, products } = useShop();

  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const [customItemInput, setCustomItemInput] = useState('');
  const [itemsViewMode, setItemsViewMode] = useState<'picker' | 'text'>('picker');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<ComboOffer | null>(null);
  const [comboToDelete, setComboToDelete] = useState<ComboOffer | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    badge: string;
    regularPrice: number;
    offerPrice: number;
    itemsText: string;
    image: string;
    gradientTheme: 'blue' | 'purple' | 'emerald' | 'amber';
    active: boolean;
    orderNumber: number;
  }>({
    title: '',
    badge: '',
    regularPrice: 25000,
    offerPrice: 19000,
    itemsText: '',
    image: PRESET_COMBO_IMAGES[0].url,
    gradientTheme: 'blue',
    active: true,
    orderNumber: 1
  });

  // Current items as array
  const currentItemsList = useMemo(() => {
    return formData.itemsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }, [formData.itemsText]);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategoryFilter !== 'all') {
      if (selectedCategoryFilter === 'cameras') {
        list = list.filter(p => 
          p.category === 'ip_cameras' || 
          p.category === 'hd_analog' || 
          p.category === 'wifi_4g' || 
          p.category === 'solar'
        );
      } else {
        list = list.filter(p => p.category === selectedCategoryFilter || p.categoryId === selectedCategoryFilter);
      }
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }
    return list;
  }, [products, selectedCategoryFilter, productSearch]);

  // Calculate total catalog value from selected products
  const estimatedCatalogValue = useMemo(() => {
    let total = 0;
    const lines = formData.itemsText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    lines.forEach(line => {
      const matched = products.find(p => line.includes(p.name));
      if (matched && matched.price) {
        const match = line.match(/^(\d+)x\s/i);
        const qty = match ? parseInt(match[1]) : 1;
        total += matched.price * qty;
      }
    });
    return total;
  }, [formData.itemsText, products]);

  // Add a product from catalog to combo items
  const handleAddProductToCombo = (product: Product) => {
    const qty = productQuantities[product.id] || 1;
    const itemString = `${qty > 1 ? `${qty}x ` : '1x '}${product.name}`;
    
    const lines = formData.itemsText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const existingIndex = lines.findIndex(l => l.includes(product.name));
    if (existingIndex >= 0) {
      lines[existingIndex] = itemString;
    } else {
      lines.push(itemString);
    }

    setFormData(prev => ({
      ...prev,
      itemsText: lines.join('\n')
    }));
  };

  // Remove an item by index
  const handleRemoveItem = (indexToRemove: number) => {
    const lines = formData.itemsText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    lines.splice(indexToRemove, 1);
    setFormData(prev => ({
      ...prev,
      itemsText: lines.join('\n')
    }));
  };

  // Add custom perk (e.g. Free installation or cabling)
  const handleAddCustomItem = () => {
    if (!customItemInput.trim()) return;
    const lines = formData.itemsText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    lines.push(customItemInput.trim());
    setFormData(prev => ({
      ...prev,
      itemsText: lines.join('\n')
    }));
    setCustomItemInput('');
  };

  // Set quantity for a product in picker
  const setPickerQty = (productId: string, qty: number) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, Math.min(32, qty))
    }));
  };

  const openAddModal = () => {
    setEditingCombo(null);
    setProductSearch('');
    setSelectedCategoryFilter('all');
    setCustomItemInput('');
    setItemsViewMode('picker');
    setFormData({
      title: '',
      badge: '🔥 SPECIAL DEAL',
      regularPrice: 25000,
      offerPrice: 19000,
      itemsText: '4x CP PLUS Cameras with Audio Mic\n1x 4-Channel Network Recorder\n1x 1TB Surveillance Hard Disk\n50m Copper Cable Roll & Connectors\nFree Installation & Mobile App Setup',
      image: PRESET_COMBO_IMAGES[0].url,
      gradientTheme: 'blue',
      active: true,
      orderNumber: comboOffers.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (combo: ComboOffer) => {
    setEditingCombo(combo);
    setProductSearch('');
    setSelectedCategoryFilter('all');
    setCustomItemInput('');
    setItemsViewMode('picker');
    setFormData({
      title: combo.title,
      badge: combo.badge || '',
      regularPrice: combo.regularPrice,
      offerPrice: combo.offerPrice,
      itemsText: combo.items.join('\n'),
      image: combo.image,
      gradientTheme: combo.gradientTheme || 'blue',
      active: combo.active,
      orderNumber: combo.orderNumber ?? 1
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = (combo: ComboOffer) => {
    updateComboOffer(combo.id, { active: !combo.active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a Combo Title');
      return;
    }

    if (formData.offerPrice <= 0 || formData.regularPrice <= 0) {
      alert('Please enter valid Regular and Offer prices');
      return;
    }

    // Split multiline string into clean items array
    const items = formData.itemsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (items.length === 0) {
      alert('Please enter at least one product included in this combo deal');
      return;
    }

    if (editingCombo) {
      updateComboOffer(editingCombo.id, {
        title: formData.title.trim(),
        badge: formData.badge.trim() || undefined,
        regularPrice: Number(formData.regularPrice),
        offerPrice: Number(formData.offerPrice),
        items,
        image: formData.image.trim(),
        gradientTheme: formData.gradientTheme,
        active: formData.active,
        orderNumber: Number(formData.orderNumber)
      });
    } else {
      addComboOffer({
        title: formData.title.trim(),
        badge: formData.badge.trim() || undefined,
        regularPrice: Number(formData.regularPrice),
        offerPrice: Number(formData.offerPrice),
        items,
        image: formData.image.trim(),
        gradientTheme: formData.gradientTheme,
        active: formData.active,
        orderNumber: Number(formData.orderNumber)
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (comboToDelete) {
      deleteComboOffer(comboToDelete.id);
      setComboToDelete(null);
    }
  };

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              padding: '6px 10px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 800,
              fontSize: '0.8rem'
            }}>
              <Sparkles size={15} style={{ marginRight: '6px' }} />
              TOP HERO SLIDER
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Combo Packages &amp; Sliding Banners ({comboOffers.length})
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, maxWidth: '750px', lineHeight: 1.4 }}>
            These promotional combo packages slide automatically every <strong>3 seconds</strong> above the product categories.
            Edit their regular prices, offer prices, and included products, or add new combos for seasonal sales.
          </p>
        </div>

        <button
          onClick={openAddModal}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Plus size={18} />
          <span>Add New Combo Deal</span>
        </button>
      </div>

      {/* Combo Offers Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '18px'
      }}>
        {comboOffers.map((combo, idx) => {
          const savings = combo.regularPrice - combo.offerPrice;
          const discountPct = combo.regularPrice > 0 
            ? Math.round((savings / combo.regularPrice) * 100) 
            : 0;

          return (
            <div
              key={combo.id}
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: combo.active ? '1px solid #cbd5e1' : '1px dashed #94a3b8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                opacity: combo.active ? 1 : 0.65,
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {/* Header Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    #{combo.orderNumber ?? (idx + 1)}
                  </span>

                  <span style={{
                    background: combo.gradientTheme === 'purple' ? '#f5f3ff' : combo.gradientTheme === 'emerald' ? '#ecfdf5' : '#eff6ff',
                    color: combo.gradientTheme === 'purple' ? '#7c3aed' : combo.gradientTheme === 'emerald' ? '#059669' : '#1d4ed8',
                    border: '1px solid currentColor',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {combo.gradientTheme || 'blue'} Theme
                  </span>
                </div>

                {/* Active Toggle Button */}
                <button
                  onClick={() => handleToggleActive(combo)}
                  style={{
                    background: combo.active ? '#dcfce7' : '#f1f5f9',
                    color: combo.active ? '#15803d' : '#64748b',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title={combo.active ? 'Visible on storefront' : 'Hidden from storefront'}
                >
                  {combo.active ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{combo.active ? 'Active' : 'Inactive'}</span>
                </button>
              </div>

              {/* Combo Image + Title */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
                <img
                  src={combo.image}
                  alt={combo.title}
                  style={{
                    width: '74px',
                    height: '74px',
                    objectFit: 'contain',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '4px',
                    flexShrink: 0
                  }}
                  onError={e => (e.currentTarget.src = '/logo.jpg')}
                />
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.3,
                    margin: '0 0 6px 0'
                  }}>
                    {combo.title}
                  </h4>
                  {combo.badge && (
                    <div style={{
                      display: 'inline-block',
                      background: '#fef3c7',
                      color: '#b45309',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 800
                    }}>
                      {combo.badge}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown Card */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Regular Price</div>
                  <del style={{ fontSize: '0.95rem', fontWeight: 700, color: '#94a3b8' }}>
                    ₹{combo.regularPrice.toLocaleString('en-IN')}
                  </del>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 800 }}>Deal Offer Price</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>
                    ₹{combo.offerPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                {savings > 0 && (
                  <div style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    Save ₹{savings.toLocaleString('en-IN')} ({discountPct}%)
                  </div>
                )}
              </div>

              {/* Included Products List Preview */}
              <div style={{ flex: 1, marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                  Included Products ({combo.items.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {combo.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.78rem', color: '#334155' }}>
                      <Check size={13} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ lineHeight: 1.25 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions: Edit & Delete */}
              <div style={{
                display: 'flex',
                gap: '8px',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '12px',
                marginTop: 'auto'
              }}>
                <button
                  onClick={() => openEditModal(combo)}
                  style={{
                    flex: 1,
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit2 size={14} />
                  <span>Edit Combo &amp; Prices</span>
                </button>

                <button
                  onClick={() => setComboToDelete(combo)}
                  style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    color: '#e11d48',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Delete Combo Deal"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  {editingCombo ? 'Edit Combo Offer & Pricing' : 'Add New Combo Offer'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Combo Title */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Combo Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 4-Camera 4MP PoE IP Network Camera Complete Combo"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Badge & Order */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Banner Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. 🔥 24% OFF - BEST SELLER"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Display Order #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.orderNumber}
                    onChange={e => setFormData({ ...formData, orderNumber: parseInt(e.target.value) || 1 })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              {/* Regular Price & Offer Price */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Regular Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.regularPrice}
                      onChange={e => setFormData({ ...formData, regularPrice: Number(e.target.value) })}
                      placeholder="25000"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '1rem',
                        fontWeight: 700
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Original / Strikethrough price</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>
                      Offer Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.offerPrice}
                      onChange={e => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
                      placeholder="19000"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #16a34a',
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#16a34a'
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                      Discount: ₹{(formData.regularPrice - formData.offerPrice).toLocaleString('en-IN')} (
                      {formData.regularPrice > 0 ? Math.round(((formData.regularPrice - formData.offerPrice) / formData.regularPrice) * 100) : 0}% OFF)
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Catalog Picker & Included Products Manager */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #bfdbfe',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '16px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.05)'
              }}>
                {/* Header with Switcher */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={17} color="#2563eb" />
                      <span>Select Products Included in this Combo *</span>
                    </label>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Select which products from your store catalog will be given in this package
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setItemsViewMode(itemsViewMode === 'picker' ? 'text' : 'picker')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#475569',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {itemsViewMode === 'picker' ? '✏️ Edit as Text' : '📦 Select from Catalog'}
                  </button>
                </div>

                {itemsViewMode === 'picker' ? (
                  <>
                    {/* Search & Category Filter Pills */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative', flex: '1 1 200px' }}>
                        <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          placeholder="Search your products by model, brand, or type..."
                          value={productSearch}
                          onChange={e => setProductSearch(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '7px 10px 7px 30px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem'
                          }}
                        />
                        {productSearch && (
                          <button
                            type="button"
                            onClick={() => setProductSearch('')}
                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Category Pills */}
                      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
                        {[
                          { id: 'all', label: 'All Products' },
                          { id: 'cameras', label: 'Cameras' },
                          { id: 'dvr_nvr', label: 'DVR & NVR' },
                          { id: 'storage', label: 'Hard Disks' },
                          { id: 'networking', label: 'PoE Switches' },
                          { id: 'cables_power', label: 'Cables & Power' },
                          { id: 'racks_accessories', label: 'Racks' },
                        ].map(cat => (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setSelectedCategoryFilter(cat.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              border: selectedCategoryFilter === cat.id ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                              background: selectedCategoryFilter === cat.id ? '#eff6ff' : '#f8fafc',
                              color: selectedCategoryFilter === cat.id ? '#1d4ed8' : '#64748b',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Catalog Products List */}
                    <div style={{
                      maxHeight: '190px',
                      overflowY: 'auto',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      marginBottom: '12px'
                    }}>
                      {filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '16px', color: '#94a3b8', fontSize: '0.8rem' }}>
                          No products found matching "{productSearch}"
                        </div>
                      ) : (
                        filteredProducts.map(p => {
                          const isAlreadyAdded = currentItemsList.some(item => item.includes(p.name));
                          const currentQty = productQuantities[p.id] || 1;

                          return (
                            <div
                              key={p.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: isAlreadyAdded ? '#f0fdf4' : '#ffffff',
                                border: isAlreadyAdded ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                                gap: '10px'
                              }}
                            >
                              {/* Left: Thumbnail & Name */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '4px',
                                    objectFit: 'contain',
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    flexShrink: 0
                                  }}
                                  onError={e => (e.currentTarget.src = '/logo.jpg')}
                                />
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {p.name}
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 800, color: '#16a34a' }}>₹{(p.price || 0).toLocaleString('en-IN')}</span>
                                    {p.brand && <span style={{ color: '#475569' }}>• {p.brand}</span>}
                                    {p.badge && <span style={{ background: '#f1f5f9', padding: '0 4px', borderRadius: '3px' }}>{p.badge}</span>}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Quantity & Add Button */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                <button
                                  type="button"
                                  title="Use this product picture as the Combo Banner photo"
                                  onClick={() => setFormData(prev => ({ ...prev, image: p.image }))}
                                  style={{
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    border: '1px solid #cbd5e1',
                                    background: '#ffffff',
                                    color: '#475569',
                                    fontSize: '0.68rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  📸 Use Photo
                                </button>

                                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
                                  <button
                                    type="button"
                                    onClick={() => setPickerQty(p.id, currentQty - 1)}
                                    style={{ border: 'none', background: 'transparent', padding: '3px 6px', cursor: 'pointer', color: '#475569' }}
                                  >
                                    <Minus size={11} />
                                  </button>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0 4px', minWidth: '18px', textAlign: 'center' }}>
                                    {currentQty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setPickerQty(p.id, currentQty + 1)}
                                    style={{ border: 'none', background: 'transparent', padding: '3px 6px', cursor: 'pointer', color: '#475569' }}
                                  >
                                    <Plus size={11} />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleAddProductToCombo(p)}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: isAlreadyAdded ? '#15803d' : '#2563eb',
                                    color: '#ffffff',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  {isAlreadyAdded ? <Check size={12} /> : <Plus size={12} />}
                                  <span>{isAlreadyAdded ? 'Update' : '+ Add to Combo'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                ) : (
                  /* Raw Textarea Mode */
                  <div style={{ marginBottom: '10px' }}>
                    <textarea
                      rows={6}
                      required
                      value={formData.itemsText}
                      onChange={e => setFormData({ ...formData, itemsText: e.target.value })}
                      placeholder={`4x CP PLUS 4MP High-Definition IP Cameras (Audio with Mic)\n1x CP PLUS 4-Channel 4K Ultra PoE NVR Recorder\n1x 1TB Seagate SkyHawk 24/7 Surveillance Hard Disk\n1x High-Speed Cat6 Pure Copper Cable Roll (50m) & RJ45\nFree Mobile App Live View Setup & Professional Fitting`}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit',
                        lineHeight: 1.4
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Each line will show as an individual bullet on the storefront banner and details popup.
                    </span>
                  </div>
                )}

                {/* Included Items in Combo Preview / Manager */}
                <div style={{
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '10px',
                  marginTop: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>
                      Included in this Combo ({currentItemsList.length} items):
                    </span>
                    {estimatedCatalogValue > 0 && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, regularPrice: estimatedCatalogValue }))}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid #bbf7d0',
                          background: '#f0fdf4',
                          color: '#15803d',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                        title="Click to auto-fill Regular Price with the sum of selected products"
                      >
                        ⚡ Set Regular Price: ₹{estimatedCatalogValue.toLocaleString('en-IN')}
                      </button>
                    )}
                  </div>

                  {currentItemsList.length === 0 ? (
                    <div style={{ fontSize: '0.78rem', color: '#dc2626', fontStyle: 'italic', padding: '6px 0' }}>
                      No products added yet. Click "+ Add to Combo" on any product above or type custom perks below.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
                      {currentItemsList.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.8rem',
                            color: '#1e293b'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                            <span style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: '#eff6ff',
                              color: '#2563eb',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {idx + 1}
                            </span>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.25 }}>
                              {item}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#ef4444',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              flexShrink: 0,
                              fontSize: '0.85rem',
                              fontWeight: 700
                            }}
                            title="Remove this item from combo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Custom Line / Perk Input */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    <input
                      type="text"
                      placeholder="Add custom perk (e.g. Free Doorstep Fitting & Setup, 3-Yr Warranty)..."
                      value={customItemInput}
                      onChange={e => setCustomItemInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomItem();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.78rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomItem}
                      disabled={!customItemInput.trim()}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: customItemInput.trim() ? '#2563eb' : '#94a3b8',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: customItemInput.trim() ? 'pointer' : 'not-allowed'
                      }}
                    >
                      + Add Perk
                    </button>
                  </div>
                </div>
              </div>

              {/* Image URL & Quick Presets */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Product Showcase Image URL
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or /products/..."
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem'
                    }}
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{
                        width: '42px',
                        height: '42px',
                        objectFit: 'contain',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc'
                      }}
                      onError={e => (e.currentTarget.src = '/logo.jpg')}
                    />
                  )}
                </div>

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {PRESET_COMBO_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      style={{
                        background: formData.image === preset.url ? '#eff6ff' : '#f1f5f9',
                        border: formData.image === preset.url ? '1px solid #2563eb' : '1px solid #e2e8f0',
                        color: formData.image === preset.url ? '#1d4ed8' : '#475569',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme & Active Switch */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Color Gradient Theme
                  </label>
                  <select
                    value={formData.gradientTheme}
                    onChange={e => setFormData({ ...formData, gradientTheme: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="blue">Blue (Sapphire &amp; Navy)</option>
                    <option value="purple">Purple (Royal Violet)</option>
                    <option value="emerald">Emerald (Forest Green)</option>
                    <option value="amber">Amber (Golden Bronze)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Storefront Status
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: formData.active ? '#f0fdf4' : '#f8fafc',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => setFormData({ ...formData, active: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: formData.active ? '#15803d' : '#64748b' }}>
                      {formData.active ? 'Active (Visible on Store)' : 'Inactive (Hidden)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  {editingCombo ? 'Save Changes' : 'Create Combo Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {comboToDelete && (
        <ConfirmDeleteModal
          isOpen={true}
          onClose={() => setComboToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Combo Offer"
          subtitle={`Are you sure you want to remove "${comboToDelete.title}"?`}
          warningNote="This combo banner will be permanently removed from the storefront hero slider."
          confirmLabel="Delete Combo"
          item={{
            title: comboToDelete.title,
            image: comboToDelete.image,
            price: `₹${comboToDelete.offerPrice.toLocaleString('en-IN')}`,
            badge: comboToDelete.badge
          }}
        />
      )}
    </div>
  );
};
