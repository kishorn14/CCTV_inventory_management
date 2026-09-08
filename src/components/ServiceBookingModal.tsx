import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Camera, 
  BatteryCharging, 
  Zap, 
  Wrench, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Phone, 
  User,
  ChevronDown,
  Check,
  Locate,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { CategoryType } from '../types';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';
import { sendLeadToGoogleSheets } from '../utils/googleSheets';
import { getPhoneValidationError } from '../utils/validation';

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: CategoryType;
}

const DEFAULT_SERVICE_OPTIONS: Record<CategoryType, string[]> = {
  all: [
    'General Site Inspection & Consultation',
    'Multi-Equipment Service & AMC',
    'Emergency Breakdown Service'
  ],
  cctv: [
    'New CCTV System Installation',
    'Camera Offline / Black Screen Fix',
    'Mobile Live Viewing Configuration',
    'DVR / NVR Hard Disk & Recording Repair',
    'Cable Fault & Power Supply Repair',
    'Annual Maintenance Contract (AMC)'
  ],
  battery: [
    'Car Battery Replacement & Doorstep Fitment',
    'Bike & Scooter Battery Replacement',
    'Commercial Vehicle & Tractor Battery Service',
    'Emergency Vehicle Jumpstart Support',
    'Free Battery & Alternator Health Check'
  ],
  inverter: [
    'Home Inverter & Tall Tubular Battery Setup',
    'Mini DC UPS for Wi-Fi Router & Modem',
    'CCTV Centralized UPS Power Backup',
    'Inverter Beeping / PCB Repair',
    'Battery Distilled Water Top-Up & Descaling',
    'Commercial Office UPS Maintenance'
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
  const [phoneError, setPhoneError] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('⚡ As soon as possible / Urgent');
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState<boolean>(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState<boolean>(false);

  // GPS Location State
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

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

  // Detect Live GPS Location
  const handleDetectLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocationError(null);

    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser. Please type your address manually.');
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setGpsCoordinates({ lat, lng });
        setIsDetectingLocation(false);

        // Try reverse geocoding via Nominatim OpenStreetMap API
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'Accept-Language': 'en' }
          });
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress(`📍 Live GPS Site Location (Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)})`);
          }
        } catch {
          setAddress(`📍 Live GPS Site Location (Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)})`);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please allow location access in your browser or type your address.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocationError('Location information is unavailable. Please type your address.');
        } else if (err.code === err.TIMEOUT) {
          setLocationError('Location request timed out. Please try again or type your address.');
        } else {
          setLocationError('Unable to detect location. Please type your address.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
      alert('Please fill in your Name, Phone Number, and Address.');
      return;
    }

    const phoneErr = getPhoneValidationError(phoneNumber);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    const categoryLabels: Record<string, string> = {
      cctv: '📹 CCTV Surveillance System',
      battery: '🔋 Vehicle / Automotive Battery',
      inverter: '⚡ UPS & Inverter Power System',
      all: '🛠️ General Inquiry / Multi-Service'
    };

    const categoryName = categoryLabels[category] || category;
    const mapsLink = gpsCoordinates ? `https://maps.google.com/?q=${gpsCoordinates.lat},${gpsCoordinates.lng}` : null;

    const message = `🛠️ *NEW SERVICE / INSTALLATION BOOKING*
*Shop:* ${shopInfo.shopName}
---------------------------------
👤 *Customer Name:* ${customerName}
📞 *Phone Number:* ${phoneNumber}
📍 *Service Address / Landmark:* ${address}
${mapsLink ? `🗺️ *Live GPS Map Link:* ${mapsLink}` : `📌 _(Tip: You can also tap 📎 > 'Location' in WhatsApp to send your live pin)_`}
🏷️ *Service Category:* ${categoryName}
🔧 *Service Type:* ${serviceType}
⏰ *Preferred Date / Time:* ${preferredTime || 'As soon as possible'}
${notes ? `📝 *Special Notes:* ${notes}` : ''}
---------------------------------
_Sent via ${shopInfo.shopName} Doorstep Portal_`;

    const waUrl = createWhatsAppLink(message, shopInfo.whatsappPhone);

    // Send lead to Google Sheets in background if configured
    sendLeadToGoogleSheets(shopInfo.googleSheetWebhookUrl, {
      customerName,
      phoneNumber,
      address: mapsLink ? `${address} [GPS: ${mapsLink}]` : address,
      category: categoryName,
      serviceType,
      preferredTime: preferredTime || 'As soon as possible',
      notes: notes ? (mapsLink ? `${notes} (GPS: ${mapsLink})` : notes) : (mapsLink ? `GPS: ${mapsLink}` : undefined),
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
        onClick={(e) => {
          e.stopPropagation();
          setIsServiceDropdownOpen(false);
          setIsTimeDropdownOpen(false);
        }}
        style={{ background: '#ffffff', color: '#0f172a' }}
      >
        <div className="modal-drag-handle" />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#eff6ff',
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Wrench size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                Book Doorstep Service
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Fast technician dispatch & verified service
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
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
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              WhatsApp Opened!
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
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
                  { id: 'cctv' as CategoryType, label: 'CCTV Security', icon: Camera },
                  { id: 'battery' as CategoryType, label: 'Vehicle Battery', icon: BatteryCharging },
                  { id: 'inverter' as CategoryType, label: 'Inverter & UPS', icon: Zap },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = category === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategory(item.id);
                        setIsServiceDropdownOpen(false);
                        setIsTimeDropdownOpen(false);
                      }}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid #1d4ed8' : '1px solid #e2e8f0',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        color: isSelected ? '#1d4ed8' : '#475569',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(29, 78, 216, 0.12)' : 'none'
                      }}
                    >
                      <Icon size={18} color={isSelected ? '#1d4ed8' : '#64748b'} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Service Type Dropdown - 100% Contained inside modal */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Specific Service Needed *</label>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsServiceDropdownOpen(!isServiceDropdownOpen);
                  setIsTimeDropdownOpen(false);
                }}
                className="form-input"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: '#ffffff',
                  border: isServiceDropdownOpen ? '1.5px solid #1d4ed8' : '1px solid #cbd5e1',
                  boxShadow: isServiceDropdownOpen ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none',
                  padding: '11px 14px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', paddingRight: '8px' }}>
                  {serviceType || 'Select a service'}
                </span>
                <ChevronDown 
                  size={18} 
                  color={isServiceDropdownOpen ? '#1d4ed8' : '#64748b'} 
                  style={{
                    transform: isServiceDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0
                  }}
                />
              </button>

              {/* Contained Dropdown Popup */}
              {isServiceDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  width: '100%',
                  boxSizing: 'border-box',
                  zIndex: 100,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.16), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  padding: '4px 0'
                }}>
                  {(DEFAULT_SERVICE_OPTIONS[category] || DEFAULT_SERVICE_OPTIONS.all).map((opt, i) => {
                    const isSelected = serviceType === opt;
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setServiceType(opt);
                          setIsServiceDropdownOpen(false);
                        }}
                        style={{
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#1d4ed8' : '#1e293b',
                          background: isSelected ? '#eff6ff' : 'transparent',
                          transition: 'background 0.15s ease',
                          borderBottom: i === (DEFAULT_SERVICE_OPTIONS[category] || []).length - 1 ? 'none' : '1px solid #f1f5f9'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span style={{ lineHeight: 1.35 }}>{opt}</span>
                        {isSelected && <Check size={16} color="#1d4ed8" style={{ flexShrink: 0, marginLeft: '8px' }} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Name & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={14} color="#1d4ed8" /> Your Name *
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: 0 }}>
                    <Phone size={14} color="#059669" /> Phone / Mobile *
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>Min 10 digits</span>
                </div>
                <input
                  type="tel"
                  inputMode="tel"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (phoneError) {
                      const err = getPhoneValidationError(e.target.value);
                      setPhoneError(err || '');
                    }
                  }}
                  onBlur={() => {
                    if (phoneNumber.trim()) {
                      const err = getPhoneValidationError(phoneNumber);
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
                  <div style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                    <span>⚠️</span> {phoneError}
                  </div>
                )}
              </div>
            </div>

            {/* Address & Landmark with Live GPS Auto-Detect */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: 0 }}>
                  <MapPin size={14} color="#d97706" /> Service Address / Area Landmark *
                </label>

                {/* GPS Auto-Detect Button */}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  style={{
                    background: gpsCoordinates ? '#ecfdf5' : '#eff6ff',
                    border: gpsCoordinates ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                    color: gpsCoordinates ? '#059669' : '#1d4ed8',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: isDetectingLocation ? 'wait' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                  title="Detect and attach your current GPS coordinates to the WhatsApp message"
                >
                  {isDetectingLocation ? (
                    <>
                      <Loader2 size={12} className="spin" />
                      <span>Detecting GPS...</span>
                    </>
                  ) : gpsCoordinates ? (
                    <>
                      <CheckCircle2 size={12} color="#059669" />
                      <span>GPS Attached ✅</span>
                    </>
                  ) : (
                    <>
                      <Locate size={12} color="#1d4ed8" />
                      <span>📍 Use Live GPS</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="text"
                className="form-input"
                placeholder="e.g. #45, 2nd Main, Near Post Office (or click 'Use Live GPS')"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              {/* GPS Confirmation Card */}
              {gpsCoordinates && (
                <div style={{
                  marginTop: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.76rem',
                  color: '#065f46'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Navigation size={13} color="#059669" />
                    <span>
                      <strong>GPS Location Attached:</strong> ({gpsCoordinates.lat.toFixed(4)}, {gpsCoordinates.lng.toFixed(4)})
                    </span>
                  </div>
                  <a 
                    href={`https://maps.google.com/?q=${gpsCoordinates.lat},${gpsCoordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#047857',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      background: '#d1fae5',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    <span>Test Map Pin</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              )}

              {/* Location Error Message */}
              {locationError && (
                <div style={{
                  marginTop: '6px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  fontSize: '0.74rem',
                  color: '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={14} color="#dc2626" style={{ flexShrink: 0 }} />
                  <span>{locationError}</span>
                </div>
              )}
            </div>

            {/* Preferred Time Custom Dropdown - 100% Contained */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} color="#0284c7" /> Preferred Date / Time Slot
              </label>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTimeDropdownOpen(!isTimeDropdownOpen);
                  setIsServiceDropdownOpen(false);
                }}
                className="form-input"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: '#ffffff',
                  border: isTimeDropdownOpen ? '1.5px solid #1d4ed8' : '1px solid #cbd5e1',
                  boxShadow: isTimeDropdownOpen ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none',
                  padding: '11px 14px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', paddingRight: '8px' }}>
                  {preferredTime}
                </span>
                <ChevronDown 
                  size={18} 
                  color={isTimeDropdownOpen ? '#1d4ed8' : '#64748b'} 
                  style={{
                    transform: isTimeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0
                  }}
                />
              </button>

              {isTimeDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  width: '100%',
                  boxSizing: 'border-box',
                  zIndex: 100,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.16), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '4px 0'
                }}>
                  {[
                    '⚡ As soon as possible / Urgent',
                    'Today Morning (9:00 AM - 1:00 PM)',
                    'Today Afternoon (1:00 PM - 5:00 PM)',
                    'Today Evening (5:00 PM - 9:00 PM)',
                    'Tomorrow (Anytime)',
                    'Weekend Appointment (Sat / Sun)'
                  ].map((timeOpt, i) => {
                    const isSelected = preferredTime === timeOpt;
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setPreferredTime(timeOpt);
                          setIsTimeDropdownOpen(false);
                        }}
                        style={{
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#1d4ed8' : '#1e293b',
                          background: isSelected ? '#eff6ff' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span>{timeOpt}</span>
                        {isSelected && <Check size={16} color="#1d4ed8" style={{ flexShrink: 0, marginLeft: '8px' }} />}
                      </div>
                    );
                  })}
                </div>
              )}
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
              color: '#64748b',
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
