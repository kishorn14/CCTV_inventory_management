import React, { useState } from 'react';
import { 
  Calculator, 
  MessageCircle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  AlertCircle,
  Video,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatEstimateMessage, createWhatsAppLink } from '../utils/whatsapp';
import { sendLeadToGoogleSheets } from '../utils/googleSheets';
import { CctvEstimatorModal } from './CctvEstimatorModal';

export const EstimatorCalculator: React.FC = () => {
  const { products, shopInfo } = useShop();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // Only take CCTV products added by admin
  const cctvProducts = products.filter(p => p.category === 'cctv');

  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    return cctvProducts[0]?.id || '';
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [premisesType, setPremisesType] = useState<string>('Home / Residential Villa');
  const [needInstallation, setNeedInstallation] = useState<boolean>(true);

  // Get active selected product
  const selectedProduct = cctvProducts.find(p => p.id === selectedProductId) || cctvProducts[0];

  // Helper to compute total based on admin price string
  const calculateTotalEstimate = () => {
    if (!selectedProduct) return null;

    // Extract numbers from admin price string (e.g. "₹12,500 - ₹15,500" -> [12500, 15500])
    const numbers = selectedProduct.priceRange
      .replace(/,/g, '')
      .match(/\d+/g)
      ?.map(Number);

    if (numbers && numbers.length >= 2) {
      const min = numbers[0] * quantity;
      const max = numbers[1] * quantity;
      return `₹${min.toLocaleString('en-IN')} – ₹${max.toLocaleString('en-IN')}`;
    } else if (numbers && numbers.length === 1) {
      const total = numbers[0] * quantity;
      return `₹${total.toLocaleString('en-IN')}`;
    }

    // If text like "Contact for Price" or "Pre-Inquire", return direct admin text
    return selectedProduct.priceRange;
  };

  const handleSendWhatsApp = () => {
    if (!selectedProduct) {
      const fallbackMsg = formatEstimateMessage(`CCTV Security Estimate Request`, [
        `Premises: ${premisesType}`,
        `Please share your available CCTV camera models and exact price quotation.`
      ]);
      window.open(createWhatsAppLink(fallbackMsg, shopInfo.whatsappPhone), '_blank');
      return;
    }

    const totalEstimate = calculateTotalEstimate();

    const details = [
      `Selected CCTV Model: ${selectedProduct.name}`,
      `Brand: ${selectedProduct.brand}`,
      `Quantity: ${quantity} Unit(s)`,
      `Premises Type: ${premisesType}`,
      `Installation: ${needInstallation ? 'Professional Doorstep Installation Required' : 'Equipment Delivery Only'}`,
      `Admin Price: ${selectedProduct.priceRange} each`,
      `Estimated Total: ${totalEstimate}`,
      `Warranty: ${selectedProduct.warranty}`
    ];

    const message = formatEstimateMessage(`CCTV Security Package Estimate (${selectedProduct.name})`, details);

    // Send quotation request to Google Sheets in background
    sendLeadToGoogleSheets(shopInfo.googleSheetWebhookUrl, {
      customerName: 'WhatsApp Estimate Request',
      phoneNumber: 'Via WhatsApp',
      address: premisesType,
      category: 'CCTV Security',
      serviceType: `${selectedProduct.name} (${quantity} Units) - ${totalEstimate}`,
      preferredTime: needInstallation ? 'Installation Required' : 'Equipment Only',
      notes: `Brand: ${selectedProduct.brand} | Warranty: ${selectedProduct.warranty}`,
      source: 'CCTV Package Estimator',
      status: 'Pending ⏳'
    });

    window.open(createWhatsAppLink(message, shopInfo.whatsappPhone), '_blank');
  };

  return (
    <section id="estimator" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Calculator size={14} /> Dynamic CCTV Package Planner
          </div>
          <h2 className="section-title">
            Calculate Your <span className="text-gradient">CCTV Requirement &amp; Cost</span>
          </h2>
          <p className="section-subtitle">
            Configure custom camera types, DVR/NVR channels &amp; hard disk storage, or select ready-made packages from our catalog.
          </p>
        </div>

        {/* Custom Component Builder Trigger Banner */}
        <div 
          onClick={() => setIsCustomModalOpen(true)}
          style={{
            maxWidth: '900px',
            margin: '0 auto 28px auto',
            background: 'linear-gradient(135deg, #04647a 0%, #064e3b 100%)',
            borderRadius: '20px',
            padding: '20px 24px',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(4, 100, 122, 0.22)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(4, 100, 122, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(4, 100, 122, 0.22)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Video size={24} color="#67e8f9" />
            </div>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#67e8f9',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '4px'
              }}>
                <Sparkles size={13} />
                <span>Interactive Custom System Builder</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 2px 0' }}>
                Build a Custom Setup: Select Cameras, DVR/NVR &amp; Hard Disk
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#e2e8f0', margin: 0, opacity: 0.9 }}>
                Customize indoor/outdoor cameras (HD/IP/WiFi), 4CH/8CH/16CH channels &amp; 1TB/2TB/4TB storage with real-time price estimation.
              </p>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#eab308',
            color: '#0f172a',
            fontWeight: 800,
            fontSize: '0.88rem',
            padding: '10px 20px',
            borderRadius: '9999px',
            boxShadow: '0 4px 12px rgba(234, 179, 8, 0.35)'
          }}>
            <span>Open Custom Builder</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </div>
        </div>

        {/* Empty State if Admin has not added CCTV products yet */}
        {cctvProducts.length === 0 ? (
          <div className="glass-card" style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              CCTV Products Being Configured by Shop
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: '24px' }}>
              Our shop admin is currently updating CCTV models and pricing in the system. You can request a custom quote directly on WhatsApp.
            </p>
            <button onClick={handleSendWhatsApp} className="btn btn-whatsapp btn-lg">
              <MessageCircle size={20} /> Request Custom Quote on WhatsApp
            </button>
          </div>
        ) : (
          /* Active Estimator Using Only Admin-Configured Products */
          <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)' }}>
            {/* Step 1: Select Camera Model from Admin Inventory */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                <span>1. Select Camera / Security Package:</span>
                <span style={{ color: '#1d4ed8', fontSize: '0.8rem', fontWeight: 700 }}>
                  {cctvProducts.length} Models Available
                </span>
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                gap: '12px',
                marginTop: '10px'
              }}>
                {cctvProducts.map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProductId(prod.id)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isSelected 
                          ? '2px solid #1d4ed8' 
                          : '1px solid #e2e8f0',
                        background: isSelected 
                          ? '#eff6ff' 
                          : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isSelected ? '0 4px 14px rgba(29, 78, 216, 0.15)' : '0 1px 3px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: isSelected ? '#1d4ed8' : '#f1f5f9',
                            color: isSelected ? '#ffffff' : '#475569',
                            textTransform: 'uppercase'
                          }}>
                            {prod.brand}
                          </span>
                          {prod.badge && (
                            <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700 }}>
                              ★ {prod.badge}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: '6px' }}>
                          {prod.name}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, marginBottom: '10px' }}>
                          🛡️ {prod.warranty}
                        </div>
                      </div>

                      <div style={{
                        paddingTop: '8px',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Price:</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1d4ed8' }}>
                          {prod.priceRange}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Quantity & Premises Type */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '18px',
              marginBottom: '24px'
            }}>
              {/* Quantity */}
              <div className="form-group">
                <label className="form-label">2. Quantity / Number of Cameras:</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  width: 'fit-content'
                }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Minus size={16} />
                  </button>

                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', minWidth: '40px', textAlign: 'center' }}>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Premises Type */}
              <div className="form-group">
                <label className="form-label">3. Premises / Site Type:</label>
                <select
                  className="form-select"
                  value={premisesType}
                  onChange={(e) => setPremisesType(e.target.value)}
                >
                  <option value="Home / Residential Villa">Home / Residential Villa</option>
                  <option value="Retail Shop / Store">Retail Shop / Commercial Store</option>
                  <option value="Office / Workspace">Office / Workspace</option>
                  <option value="Factory / Warehouse / Open Plot">Factory / Warehouse / Open Plot</option>
                </select>
              </div>
            </div>

            {/* Step 4: Installation Option */}
            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label">4. Installation & Fitting:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setNeedInstallation(true)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: needInstallation ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                    background: needInstallation ? '#ecfdf5' : '#ffffff',
                    color: needInstallation ? '#065f46' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: needInstallation ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none'
                  }}
                >
                  <CheckCircle2 size={18} color={needInstallation ? '#10b981' : '#94a3af'} style={{ flexShrink: 0 }} />
                  <span>Doorstep Installation Included</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNeedInstallation(false)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: !needInstallation ? '1.5px solid #1d4ed8' : '1px solid #e2e8f0',
                    background: !needInstallation ? '#eff6ff' : '#ffffff',
                    color: !needInstallation ? '#1e40af' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: !needInstallation ? '0 2px 8px rgba(37, 99, 235, 0.15)' : 'none'
                  }}
                >
                  <CheckCircle2 size={18} color={!needInstallation ? '#1d4ed8' : '#94a3af'} style={{ flexShrink: 0 }} />
                  <span>Equipment Only (Self-Fit)</span>
                </button>
              </div>
            </div>

            {/* Total Calculation Output Based Solely on Admin Product */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #ecfdf5 100%)',
              border: '1px solid #bfdbfe',
              borderRadius: '16px',
              padding: '22px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '18px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)'
            }}>
              {selectedProduct && (
                <div style={{ width: '100%' }}>
                  <div style={{ fontSize: '0.8rem', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                    Selected Model: {selectedProduct.name} ({quantity} {quantity > 1 ? 'Units' : 'Unit'})
                  </div>
                  <div style={{ fontSize: 'clamp(1.7rem, 5vw, 2.2rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: '6px 0' }}>
                    {calculateTotalEstimate()}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem', color: '#065f46', fontWeight: 600, marginTop: '6px' }}>
                    <span>🛡️ {selectedProduct.warranty}</span>
                    <span>✓ Genuine Product</span>
                    {needInstallation && <span>⚡ Doorstep Fitting</span>}
                  </div>
                </div>
              )}

              <button
                onClick={handleSendWhatsApp}
                className="btn btn-whatsapp btn-lg btn-block"
                style={{ width: '100%' }}
              >
                <MessageCircle size={20} />
                Send Quote to WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Custom CCTV System Builder Modal */}
      <CctvEstimatorModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />
    </section>
  );
};
