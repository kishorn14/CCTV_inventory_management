import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send, 
  Navigation
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';
import { sendLeadToGoogleSheets } from '../utils/googleSheets';
import { getPhoneValidationError } from '../utils/validation';

export const ContactSection: React.FC = () => {
  const { shopInfo } = useShop();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [message, setMessage] = useState('');

  const handleQuickInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    const phoneErr = getPhoneValidationError(phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    const text = `👋 *QUICK INQUIRY / CONTACT*
*Shop:* ${shopInfo.shopName}
-------------------------
👤 *Name:* ${name.trim()}
📞 *Phone:* ${phone.trim()}
💬 *Message:* ${message.trim()}
-------------------------`;

    // Log to Google Sheets
    sendLeadToGoogleSheets(shopInfo.googleSheetWebhookUrl, {
      customerName: name,
      phoneNumber: phone,
      address: 'Contact Section Form',
      category: 'Direct Inquiry',
      serviceType: 'Website Message',
      preferredTime: 'Anytime',
      notes: message,
      source: 'Contact Form',
      status: 'Pending ⏳'
    });

    window.open(createWhatsAppLink(text, shopInfo.whatsappPhone), '_blank');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <section id="contact" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '18px' }}>
          <div className="section-badge">
            <MapPin size={14} /> Visit Us or Get in Touch
          </div>
          <h2 className="section-title">
            Visit Our Shop or <span className="text-gradient">Contact Us</span>
          </h2>
          <p className="section-subtitle" style={{ fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
            We are open all 7 days for CCTV sales, on-site security surveys, and technical support service calls.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '18px',
          alignItems: 'start'
        }}>
          {/* Unified Compact Shop Information Card */}
          <div className="glass-card" style={{ 
            padding: '20px', 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
            borderRadius: '16px'
          }}>
            {/* 1. Address Row */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#eff6ff',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.03em' }}>
                  Shop Location
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px', marginBottom: '2px' }}>
                  {shopInfo.shopName}
                </div>
                <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.4 }}>
                  {shopInfo.address}, {shopInfo.city}
                </div>
                <a
                  href={shopInfo.googleMapsUrl || 'https://share.google/Qdy82hkQa2UO5Axtj'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#1d4ed8',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    marginTop: '6px'
                  }}
                >
                  <Navigation size={13} /> Get Google Maps Directions
                </a>
              </div>
            </div>

            <div style={{ height: '1px', background: '#f1f5f9', margin: '14px 0' }} />

            {/* 2. Timings Row */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.03em' }}>
                  Working Hours
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px', marginBottom: '1px' }}>
                  {shopInfo.workingHours}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                  {shopInfo.workingDays}
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#f1f5f9', margin: '14px 0' }} />

            {/* 3. Direct Helpline Row */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={20} />
              </div>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.03em' }}>
                  Direct Helpline
                </div>
                <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', marginTop: '2px', marginBottom: '8px' }}>
                  {shopInfo.phone}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a href={`tel:${shopInfo.phone}`} className="btn btn-call btn-sm" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                    <Phone size={13} /> Call Now
                  </a>
                  <a 
                    href={createWhatsAppLink(`Hello ${shopInfo.shopName}, I need help with an inquiry.`, shopInfo.whatsappPhone)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-whatsapp btn-sm"
                    style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Streamlined Quick Message / Query Form */}
          <div className="glass-card" style={{ 
            padding: '20px', 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
            borderRadius: '16px'
          }}>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a', marginBottom: '3px' }}>
              Send a Quick Query
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '14px' }}>
              Have a custom requirement or question? Type below to chat directly with us on WhatsApp.
            </p>

            <form onSubmit={handleQuickInquiry}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ padding: '9px 12px', fontSize: '14px' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span>Your Mobile Number</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>Min 10 digits</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) {
                      const err = getPhoneValidationError(e.target.value);
                      setPhoneError(err || '');
                    }
                  }}
                  onBlur={() => {
                    if (phone.trim()) {
                      const err = getPhoneValidationError(phone);
                      setPhoneError(err || '');
                    }
                  }}
                  style={{
                    padding: '9px 12px',
                    fontSize: '14px',
                    borderColor: phoneError ? '#ef4444' : undefined,
                    boxShadow: phoneError ? '0 0 0 1px #ef4444' : undefined
                  }}
                  required
                />
                {phoneError && (
                  <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                    <span>⚠️</span> {phoneError}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>How Can We Help You?</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Need price quotation for 4/8 CCTV cameras for residence, or warehouse system..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ padding: '9px 12px', fontSize: '14px' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                style={{ marginTop: '6px', minHeight: '42px', fontSize: '0.9rem' }}
              >
                <Send size={16} />
                Send Inquiry to Shop via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
