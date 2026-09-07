import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Camera, 
  BatteryCharging, 
  Zap, 
  Droplets, 
  Sun, 
  Wrench,
  CheckCircle,
  MapPin,
  Calendar,
  Phone,
  User
} from 'lucide-react';
import { CategoryType } from '../types';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';
import { sendLeadToGoogleSheets } from '../utils/googleSheets';

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: CategoryType;
}

const DEFAULT_SERVICE_OPTIONS: Record<CategoryType, string[]> = {
  all: [
    'General Site Inspection / Consultation',
    'Multiple Equipment Service & AMC',
    'Emergency Breakdown Repair'
  ],
  cctv: [
    'New CCTV System Installation (Home / Shop / Factory)',
    'Camera Offline / No Display / Black Screen Fix',
    'Mobile Live Viewing App Configuration',
    'DVR / NVR Hard Disk & Recording Repair',
    'Cable Fault & Power Supply Troubleshooting',
    'Annual Maintenance Contract (AMC)'
  ],
  battery: [
    'Doorstep Car Battery Replacement',
    'Two-Wheeler / Bike Battery Replacement',
    'Emergency Car Jumpstart Breakdown Service',
    'Free Battery Health & Alternator Voltage Check',
    'Commercial Truck / Tractor Battery Service'
  ],
  inverter: [
    'New Home Inverter & Tubular Battery Installation',
    'Inverter Beeping / Not Charging / PCB Repair',
    'Battery Distilled Water Top-Up & Maintenance',
    'Old Battery Replacement & High-Backup Upgrade',
    'Office High-Capacity UPS Maintenance'
  ],
  water_purifier: [
    'Complete RO Service & Filter Replacement',
    'RO Membrane Replacement & TDS Adjustment',
    'Water Leakage / Booster Pump Repair',
    'New RO Purifier Installation / Uninstallation',
    'Commercial 50 LPH / 100 LPH Plant Service'
  ],
  solar_heater: [
    'New Rooftop Solar Water Heater Installation',
    'Chemical Descaling & Hard-Water Salt Removal',
    'Broken ETC Glass Tube / Tank Leakage Repair',
    'Electric Backup Element & Thermostat Fix',
    'Rooftop Plumbing & Pressure Pump Setup'
  ]
};

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'cctv'
}) => {
  const { shopInfo } = useShop();
  const [category, setCategory] = useState<CategoryType>(initialCategory);
  const [serviceType, setServiceType] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('As soon as possible (Today)');
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
      setServiceType(DEFAULT_SERVICE_OPTIONS[initialCategory]?.[0] || 'General Service');
    }
  }, [initialCategory, isOpen]);

  useEffect(() => {
    if (DEFAULT_SERVICE_OPTIONS[category]) {
      setServiceType(DEFAULT_SERVICE_OPTIONS[category][0]);
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !address) {
      alert('Please fill in your Name, Phone Number, and Address.');
      return;
    }

    const categoryLabels: Record<string, string> = {
      cctv: '📹 CCTV Surveillance System',
      battery: '🔋 Vehicle / Automotive Battery',
      inverter: '⚡ UPS & Inverter Power System',
      water_purifier: '💧 Water Purifier / RO System',
      solar_heater: '☀️ Solar Water Heater',
      all: '🛠️ General Inquiry / Multi-Service'
    };

    const categoryName = categoryLabels[category] || category;

    const message = `🛠️ *NEW SERVICE / INSTALLATION BOOKING*
*Shop:* ${shopInfo.shopName}
---------------------------------
👤 *Customer Name:* ${customerName}
📞 *Phone Number:* ${phoneNumber}
📍 *Location / Address:* ${address}
🏷️ *Service Category:* ${categoryName}
🔧 *Service Type:* ${serviceType}
⏰ *Preferred Date / Time:* ${preferredTime || 'As soon as possible'}
${notes ? `📝 *Special Notes:* ${notes}` : ''}
---------------------------------
_Sent via ${shopInfo.shopName} Online Portal_`;

    const waUrl = createWhatsAppLink(message, shopInfo.whatsappPhone);

    // Send lead to Google Sheets in background if configured
    sendLeadToGoogleSheets(shopInfo.googleSheetWebhookUrl, {
      customerName,
      phoneNumber,
      address,
      category: categoryName,
      serviceType,
      preferredTime: preferredTime || 'As soon as possible',
      notes,
      source: 'Doorstep Service Booking Form',
      status: 'Pending ⏳'
    });

    // Open WhatsApp
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-drag-handle" />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(37, 99, 235, 0.2)',
              color: '#60a5fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Wrench size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                Book Doorstep Service
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                Fast technician dispatch & verified service
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              WhatsApp Opened!
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Your booking details have been generated. Click send on WhatsApp and our team will immediately confirm your service slot.
            </p>
            <button onClick={resetForm} className="btn btn-primary btn-block">
              Done & Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Category Selector Tabs */}
            <div className="form-group">
              <label className="form-label">Select Equipment / Category *</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                gap: '8px',
                marginTop: '6px'
              }}>
                {[
                  { id: 'cctv' as CategoryType, label: 'CCTV (Active)', icon: Camera },
                  { id: 'battery' as CategoryType, label: 'Battery (Soon)', icon: BatteryCharging },
                  { id: 'inverter' as CategoryType, label: 'Inverter (Soon)', icon: Zap },
                  { id: 'water_purifier' as CategoryType, label: 'RO (Soon)', icon: Droplets },
                  { id: 'solar_heater' as CategoryType, label: 'Solar (Soon)', icon: Sun },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = category === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setCategory(item.id)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isSelected ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected ? '#ffffff' : '#9ca3af',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Icon size={18} color={isSelected ? '#60a5fa' : '#9ca3af'} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              {category !== 'cctv' && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '0.78rem',
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '6px',
                  padding: '6px 10px'
                }}>
                  ℹ️ This service is launching soon. Submitting this form sends a pre-inquiry directly to our shop via WhatsApp.
                </div>
              )}
            </div>

            {/* Service Type Dropdown */}
            <div className="form-group">
              <label className="form-label">Specific Service Needed *</label>
              <select
                className="form-select"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
              >
                {(DEFAULT_SERVICE_OPTIONS[category] || DEFAULT_SERVICE_OPTIONS.all).map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Name & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={14} color="#60a5fa" /> Your Name *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rajesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} color="#34d399" /> Phone / Mobile *
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Address & Landmark */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#f59e0b" /> Service Address / Area Landmark *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. #45, 2nd Main, Near Post Office"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Preferred Time */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} color="#06b6d4" /> Preferred Date / Time Slot
              </label>
              <select
                className="form-select"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              >
                <option value="As soon as possible / Urgent">⚡ As soon as possible / Urgent</option>
                <option value="Today Morning (9 AM - 1 PM)">Today Morning (9 AM - 1 PM)</option>
                <option value="Today Afternoon (1 PM - 5 PM)">Today Afternoon (1 PM - 5 PM)</option>
                <option value="Today Evening (5 PM - 8 PM)">Today Evening (5 PM - 8 PM)</option>
                <option value="Tomorrow Any Time">Tomorrow Any Time</option>
                <option value="Weekend Appointment">Weekend Appointment</option>
              </select>
            </div>

            {/* Additional Notes */}
            <div className="form-group">
              <label className="form-label">Describe Issue / Requirement (Optional)</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. Need urgent battery replacement or CCTV mobile view setup..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Submit via WhatsApp */}
            <button
              type="submit"
              className="btn btn-whatsapp btn-block btn-lg"
              style={{ marginTop: '10px' }}
            >
              <MessageCircle size={20} />
              Book Service via WhatsApp
            </button>

            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textAlign: 'center',
              marginTop: '10px'
            }}>
              🔒 No advance payment needed. Pay only after service completion.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
