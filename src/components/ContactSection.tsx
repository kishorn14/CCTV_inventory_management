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

export const ContactSection: React.FC = () => {
  const { shopInfo } = useShop();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleQuickInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      alert('Please fill out all fields.');
      return;
    }

    const text = `👋 *QUICK INQUIRY / CONTACT*
*Shop:* ${shopInfo.shopName}
-------------------------
👤 *Name:* ${name}
📞 *Phone:* ${phone}
💬 *Message:* ${message}
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
            <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(37, 99, 235, 0.2)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>
                  Shop Location
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginTop: '2px', marginBottom: '4px' }}>
                  {shopInfo.shopName}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.4 }}>
                  {shopInfo.address}, {shopInfo.city}
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(shopInfo.shopName + ' ' + shopInfo.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#60a5fa',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginTop: '8px'
                  }}
                >
                  <Navigation size={14} /> Get Google Maps Directions
                </a>
              </div>
            </div>

            {/* Timings Card */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>
                  Working Hours
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginTop: '2px', marginBottom: '2px' }}>
                  {shopInfo.workingHours}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#34d399' }}>
                  {shopInfo.workingDays}
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp Callouts */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={24} />
              </div>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>
                  Direct Helpline
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginTop: '2px', marginBottom: '10px' }}>
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
          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              Send a Quick Query
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#9ca3af', marginBottom: '22px' }}>
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
                <label className="form-label">Your Mobile Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
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
