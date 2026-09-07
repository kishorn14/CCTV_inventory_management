import { useState } from 'react';
import { Edit3, Check, X, CheckCircle2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ServiceItem } from '../../types';

export const AdminServices: React.FC = () => {
  const { services, updateService } = useShop();
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    startingPrice: '',
    responseTime: '',
    bulletsText: ''
  });

  const openEdit = (srv: ServiceItem) => {
    setEditingService(srv);
    setFormData({
      title: srv.title,
      shortDesc: srv.shortDesc,
      startingPrice: srv.startingPrice || '',
      responseTime: srv.responseTime,
      bulletsText: srv.bulletPoints.join('\n')
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const bullets = formData.bulletsText
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    updateService(editingService.id, {
      title: formData.title,
      shortDesc: formData.shortDesc,
      startingPrice: formData.startingPrice,
      responseTime: formData.responseTime,
      bulletPoints: bullets
    });

    setEditingService(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
          Service Packages & Repair Offerings
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
          Update service response time, doorstep visit charges, and inclusions for each category.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {services.map(srv => (
          <div key={srv.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                  {srv.title}
                </h3>
                <button
                  onClick={() => openEdit(srv)}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#93c5fd',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer'
                  }}
                  title="Edit Service Details"
                >
                  <Edit3 size={15} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '6px', color: '#93c5fd' }}>
                  🕒 {srv.responseTime}
                </span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', padding: '3px 8px', borderRadius: '6px', color: '#34d399', fontWeight: 600 }}>
                  💰 {srv.startingPrice}
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#9ca3af', lineHeight: 1.45, marginBottom: '14px' }}>
                {srv.shortDesc}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {srv.bulletPoints.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', fontSize: '0.78rem', color: '#d1d5db' }}>
                    <CheckCircle2 size={13} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="modal-overlay" onClick={() => setEditingService(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', padding: '26px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '12px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Edit Service Package
              </h3>
              <button
                onClick={() => setEditingService(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Service Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Starting Price Display</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.startingPrice}
                    onChange={e => setFormData({ ...formData, startingPrice: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Response Time</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.responseTime}
                    onChange={e => setFormData({ ...formData, responseTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Summary</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={formData.shortDesc}
                  onChange={e => setFormData({ ...formData, shortDesc: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Inclusions / Bullet Points (One per line)</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={formData.bulletsText}
                  onChange={e => setFormData({ ...formData, bulletsText: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setEditingService(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Check size={16} /> Save Service Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
