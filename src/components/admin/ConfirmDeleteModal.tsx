import React, { useEffect } from 'react';
import { Trash2, AlertCircle, X } from 'lucide-react';

export interface ConfirmDeleteItem {
  title: string;
  image?: string;
  category?: string;
  brand?: string;
  price?: string;
  badge?: string;
}

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  subtitle?: string;
  warningNote?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  item?: ConfirmDeleteItem | null;
  isLoading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  subtitle = 'Are you sure you want to delete this item? This action cannot be undone.',
  warningNote = 'This product will be permanently removed from your storefront and pricing catalog.',
  confirmLabel = 'Delete Product',
  cancelLabel = 'Cancel',
  item,
  isLoading = false
}) => {
  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        zIndex: 1050,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          padding: '0',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid #fecaca',
          boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.15), 0 20px 40px -15px rgba(15, 23, 42, 0.25)',
          background: '#ffffff'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
      >
        <div className="modal-drag-handle" style={{ marginTop: '12px', marginBottom: '4px' }} />

        {/* Top Header Banner with close button */}
        <div style={{
          padding: '24px 24px 16px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          position: 'relative'
        }}>
          {/* Animated red danger badge */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.15)'
          }}>
            <Trash2 size={24} color="#dc2626" />
          </div>

          <div style={{ flex: 1, paddingRight: '24px' }}>
            <h3 
              id="confirm-delete-title"
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 6px 0',
                letterSpacing: '-0.01em'
              }}
            >
              {title}
            </h3>
            <p style={{
              fontSize: '0.88rem',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.45
            }}>
              {subtitle}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '0 24px 20px 24px' }}>
          {/* Target Item Card Preview */}
          {item && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '14px',
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    flexShrink: 0
                  }}
                  onError={(e) => {
                    // Fallback on broken image
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  {item.brand && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe'
                    }}>
                      {item.brand}
                    </span>
                  )}
                  {item.category && (
                    <span style={{
                      fontSize: '0.72rem',
                      color: '#64748b',
                      textTransform: 'capitalize',
                      fontWeight: 600
                    }}>
                      {item.category.replace('_', ' ')}
                    </span>
                  )}
                  {item.badge && (
                    <span style={{
                      fontSize: '0.7rem',
                      color: '#b45309',
                      fontWeight: 700
                    }}>
                      ★ {item.badge}
                    </span>
                  )}
                </div>

                <div style={{
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  color: '#0f172a',
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.title}
                </div>

                {item.price && (
                  <div style={{
                    fontSize: '0.82rem',
                    color: '#059669',
                    fontWeight: 700,
                    marginTop: '4px'
                  }}>
                    {item.price}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warning Banner */}
          {warningNote && (
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.82rem',
              color: '#9f1239',
              lineHeight: 1.45
            }}>
              <AlertCircle size={18} color="#e11d48" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <strong style={{ fontWeight: 700 }}>Permanent Action: </strong>
                {warningNote}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          background: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#94a3b8';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: '#dc2626',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#b91c1c';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(220, 38, 38, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(220, 38, 38, 0.25)';
            }}
          >
            <Trash2 size={16} />
            {isLoading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
