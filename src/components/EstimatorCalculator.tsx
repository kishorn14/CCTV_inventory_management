import React, { useState } from 'react';
import { 
  Calculator, 
  MessageCircle, 
  CheckCircle2, 
  Plus, 
  Minus,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatEstimateMessage, createWhatsAppLink } from '../utils/whatsapp';
import { sendLeadToGoogleSheets } from '../utils/googleSheets';

export const EstimatorCalculator: React.FC = () => {
  const { products, shopInfo } = useShop();

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
            Calculate Your <span className="text-gradient">CCTV Requirement & Cost</span>
          </h2>
          <p className="section-subtitle">
            Prices are derived directly from verified products and packages in our catalog. Select your preferred camera model and quantity to get an instant quote.
          </p>
        </div>

        {/* Empty State if Admin has not added CCTV products yet */}
        {cctvProducts.length === 0 ? (
          <div className="glass-card" style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              CCTV Products Being Configured by Shop
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '24px' }}>
              Our shop admin is currently updating CCTV models and pricing in the system. You can request a custom quote directly on WhatsApp.
            </p>
            <button onClick={handleSendWhatsApp} className="btn btn-whatsapp btn-lg">
              <MessageCircle size={20} /> Request Custom Quote on WhatsApp
            </button>
          </div>
        ) : (
          /* Active Estimator Using Only Admin-Configured Products */
          <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '22px 18px' }}>
            {/* Step 1: Select Camera Model from Admin Inventory */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                <span>1. Select Camera / Security Package:</span>
                <span style={{ color: '#93c5fd', fontSize: '0.8rem', fontWeight: 600 }}>
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
                          ? '2px solid #3b82f6' 
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isSelected 
                          ? 'rgba(37, 99, 235, 0.22)' 
                          : 'rgba(255, 255, 255, 0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: isSelected ? '#2563eb' : 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            textTransform: 'uppercase'
                          }}>
                            {prod.brand}
                          </span>
                          {prod.badge && (
                            <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 600 }}>
                              ★ {prod.badge}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: '6px' }}>
                          {prod.name}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600, marginBottom: '10px' }}>
                          🛡️ {prod.warranty}
                        </div>
                      </div>

                      <div style={{
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Price:</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: isSelected ? '#60a5fa' : '#ffffff' }}>
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
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
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
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Minus size={16} />
                  </button>

                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', minWidth: '40px', textAlign: 'center' }}>
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
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
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
                    border: needInstallation ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: needInstallation ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: needInstallation ? '#ffffff' : '#9ca3af',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={18} color={needInstallation ? '#34d399' : '#9ca3af'} style={{ flexShrink: 0 }} />
                  <span>Doorstep Installation Included</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNeedInstallation(false)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: !needInstallation ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: !needInstallation ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: !needInstallation ? '#ffffff' : '#9ca3af',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CheckCircle2 size={18} color={!needInstallation ? '#60a5fa' : '#9ca3af'} style={{ flexShrink: 0 }} />
                  <span>Equipment Only (Self-Fit)</span>
                </button>
              </div>
            </div>

            {/* Total Calculation Output Based Solely on Admin Product */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(16, 185, 129, 0.18) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '16px',
              padding: '20px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '18px'
            }}>
              {selectedProduct && (
                <div style={{ width: '100%' }}>
                  <div style={{ fontSize: '0.8rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    Selected Model: {selectedProduct.name} ({quantity} {quantity > 1 ? 'Units' : 'Unit'})
                  </div>
                  <div style={{ fontSize: 'clamp(1.7rem, 5vw, 2.2rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, margin: '6px 0' }}>
                    {calculateTotalEstimate()}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.78rem', color: '#a7f3d0', marginTop: '6px' }}>
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
    </section>
  );
};
