import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCategory } from '../../types';

interface AdminCategoriesProps {
  onGoToProducts?: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ onGoToProducts }) => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useShop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    orderNumber: 1,
    description: ''
  });

  const sortedCategories = [...categories].sort((a, b) => a.orderNumber - b.orderNumber);

  const openAddModal = () => {
    // Next order number is max + 1
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.orderNumber), 0);
    setEditingCategory(null);
    setFormData({
      name: '',
      orderNumber: maxOrder + 1,
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      orderNumber: cat.orderNumber,
      description: cat.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name.trim(),
        orderNumber: Number(formData.orderNumber) || 1,
        description: formData.description.trim() || undefined
      });
    } else {
      addCategory({
        name: formData.name.trim(),
        orderNumber: Number(formData.orderNumber) || 1,
        description: formData.description.trim() || undefined
      });
    }

    setIsModalOpen(false);
  };

  const handleMove = (cat: ProductCategory, direction: 'up' | 'down') => {
    const currentIndex = sortedCategories.findIndex(c => c.id === cat.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sortedCategories.length) return;

    const targetCat = sortedCategories[targetIndex];
    // Swap order numbers
    const tempOrder = cat.orderNumber;
    updateCategory(cat.id, { orderNumber: targetCat.orderNumber });
    updateCategory(targetCat.id, { orderNumber: tempOrder });
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  return (
    <div>
      {/* Header Info Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '22px 24px',
        marginBottom: '24px',
        border: '1px solid #334155',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.25)', color: '#93c5fd', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <Layers size={14} /> Storefront Category Sequencing
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff' }}>
            Manage Product Categories &amp; Horizontal Rows
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
            Give each category a number (1, 2, 3...). <strong>Category 1</strong> appears first at the top of your shop, <strong>Category 2</strong> appears below 1, and so on. Products in each category scroll horizontally.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={openAddModal}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <Plus size={18} /> Add New Category
          </button>
          {onGoToProducts && (
            <button
              onClick={onGoToProducts}
              className="btn btn-outline"
              style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Assign to Products</span> <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Categories Table / Card Grid */}
      <div className="glass-card" style={{ padding: '0', overflowX: 'auto', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)', borderRadius: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700 }}>
              <th style={{ padding: '14px 20px', width: '110px' }}>Order No.</th>
              <th style={{ padding: '14px 20px' }}>Category Name (Displayed on Shop)</th>
              <th style={{ padding: '14px 20px', width: '160px' }}>Assigned Products</th>
              <th style={{ padding: '14px 20px', width: '130px', textAlign: 'center' }}>Reorder</th>
              <th style={{ padding: '14px 20px', textAlign: 'right', width: '130px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                  No categories created yet. Click "Add New Category" above to create your first category.
                </td>
              </tr>
            ) : (
              sortedCategories.map((cat, idx) => {
                const assignedCount = products.filter(p => p.categoryNumber === cat.orderNumber).length;
                const isFirst = idx === 0;
                const isLast = idx === sortedCategories.length - 1;

                return (
                  <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontWeight: 900,
                        fontSize: '1rem',
                        border: '1.5px solid #bfdbfe'
                      }}>
                        {cat.orderNumber}
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>
                        {cat.name}
                      </div>
                      {cat.description && (
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                          {cat.description}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: assignedCount > 0 ? '#ecfdf5' : '#f1f5f9',
                        color: assignedCount > 0 ? '#059669' : '#64748b',
                        border: assignedCount > 0 ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                      }}>
                        <Package size={13} />
                        {assignedCount} Product{assignedCount === 1 ? '' : 's'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          onClick={() => handleMove(cat, 'up')}
                          disabled={isFirst}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: isFirst ? '#f8fafc' : '#ffffff',
                            color: isFirst ? '#cbd5e1' : '#1e293b',
                            cursor: isFirst ? 'not-allowed' : 'pointer'
                          }}
                          title="Move Up (Appear Earlier)"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          onClick={() => handleMove(cat, 'down')}
                          disabled={isLast}
                          style={{
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: isLast ? '#f8fafc' : '#ffffff',
                            color: isLast ? '#cbd5e1' : '#1e293b',
                            cursor: isLast ? 'not-allowed' : 'pointer'
                          }}
                          title="Move Down (Appear Below)"
                        >
                          <ArrowDown size={15} />
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => openEditModal(cat)}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            cursor: 'pointer'
                          }}
                          title="Edit Category"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(cat)}
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#b91c1c',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            cursor: 'pointer'
                          }}
                          title="Delete Category"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Helper Tip Card */}
      <div style={{
        marginTop: '20px',
        padding: '16px 20px',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        fontSize: '0.86rem',
        color: '#1e40af',
        lineHeight: 1.5
      }}>
        <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#2563eb' }} />
        <div>
          <strong>Next Step:</strong> Open the <strong>Products &amp; Pricing</strong> tab. Beside each product you will find an input box to fill the Category Number (e.g. <code>1</code> for Wi-Fi cams, <code>2</code> for IP cams). When you fill that number, the product will automatically appear under that category on your live website!
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '480px', padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '6px', display: 'block', color: '#0f172a' }}>
                  Category Order Number *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={formData.orderNumber}
                    onChange={e => setFormData({ ...formData, orderNumber: parseInt(e.target.value, 10) || 1 })}
                    required
                    style={{ width: '100px', fontWeight: 700, fontSize: '1.05rem', textAlign: 'center' }}
                  />
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    (1 comes first at the top, 2 below 1, etc.)
                  </span>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '6px', display: 'block', color: '#0f172a' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Smart Wi-Fi Cameras, Hard Disks, DVR / NVR"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: '6px', display: 'block', color: '#0f172a' }}>
                  Subtitle / Description (Optional)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Standalone rotating 360° cameras with siren & night vision"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="modal-overlay" onClick={() => setCategoryToDelete(null)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '440px', padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#b91c1c', marginBottom: '14px' }}>
              <AlertCircle size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Delete Category #{categoryToDelete.orderNumber}?
              </h3>
            </div>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Are you sure you want to delete category <strong>"{categoryToDelete.name}"</strong>? Products assigned to category #{categoryToDelete.orderNumber} will not be deleted, but will appear as unassigned until you give them a new category number.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setCategoryToDelete(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
