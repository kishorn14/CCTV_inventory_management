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
        <div className="section-header">
          <div className="section-badge">
            <MapPin size={14} /> Visit Us or Get in Touch
          </div>
          <h2 className="section-title">
            Visit Our Shop or <span className="text-gradient">Contact Us</span>
          </h2>
          <p className="section-subtitle">
            We are open all 7 days for sales, customer support, doorstep battery fitments, and CCTV service calls.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {/* Shop Information Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Address Card */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#eff6ff',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Shop Location
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '2px', marginBottom: '4px' }}>
                  {shopInfo.shopName}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.4 }}>
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
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginTop: '8px'
                  }}
                >
                  <Navigation size={14} /> Get Google Maps Directions
                </a>
              </div>
            </div>

            {/* Timings Card */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Working Hours
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '2px', marginBottom: '2px' }}>
                  {shopInfo.workingHours}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
                  {shopInfo.workingDays}
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp Callouts */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={24} />
              </div>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Direct Helpline
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px', marginBottom: '10px' }}>
                  {shopInfo.phone}
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a href={`tel:${shopInfo.phone}`} className="btn btn-call btn-sm">
                    <Phone size={14} /> Call Now
                  </a>
                  <a 
                    href={createWhatsAppLink(`Hello ${shopInfo.shopName}, I need help with an inquiry.`, shopInfo.whatsappPhone)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-whatsapp btn-sm"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message / Query Form */}
          <div className="glass-card" style={{ padding: '30px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Send a Quick Query
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '22px' }}>
              Have a custom requirement or question? Type below to chat directly with us on WhatsApp.
            </p>

            <form onSubmit={handleQuickInquiry}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Your Mobile Number</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>Min 10 digits</span>
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
                    borderColor: phoneError ? '#ef4444' : undefined,
                    boxShadow: phoneError ? '0 0 0 1px #ef4444' : undefined
                  }}
                  required
                />
                {phoneError && (
                  <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
                    <span>⚠️</span> {phoneError}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">How Can We Help You?</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Need price for 150Ah Amaron Inverter Battery or 8 CCTV cameras for my factory..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                style={{ marginTop: '10px' }}
              >
                <Send size={18} />
                Send Inquiry to Shop via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
