import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Camera, 
  Smartphone,
  Wrench, 
  ShieldCheck,
  CheckCircle, 
  MapPin, 
  Calendar, 
  Phone, 
  User, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
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

export interface ServicePackage {
  id: string;
  title: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  shortDesc: string;
  features: string[];
}

export const CORE_CCTV_SERVICES: ServicePackage[] = [
  {
    id: 'installation',
    title: 'CCTV Camera Installation & Wiring',
    badge: 'Most Popular',
    badgeBg: '#eff6ff',
    badgeColor: '#1d4ed8',
    icon: Camera,
    iconBg: '#dbeafe',
    iconColor: '#1d4ed8',
    shortDesc: 'New CCTV installation, concealed wiring, DVR/NVR setup & angle optimization for homes, villas & shops.',
    features: [
      'New CCTV System Installation (Home / Villa / Shop)',
      'Commercial 4K IP Camera & Multi-Channel NVR Setup',
      'Concealed Conduit Cabling & PVC Casing/Capping Fitting',
      'Existing CCTV Camera Shifting & Re-Installation',
      'Additional Camera Extension to Existing Setup'
    ]
  },
  {
    id: 'mobile_view',
    title: 'Mobile App Remote Live View Setup',
    badge: 'Instant Setup',
    badgeBg: '#f0fdf4',
    badgeColor: '#15803d',
    icon: Smartphone,
    iconBg: '#dcfce7',
    iconColor: '#15803d',
    shortDesc: 'Connect CCTV to your smartphone for instant live streaming, playback and security alerts from anywhere.',
    features: [
      'Hik-Connect / Hikvision App Remote Live Setup',
      'CP PLUS (gCMOB / Easy4IP) Mobile Streaming Setup',
      'Dahua (DMSS) Remote Live View & Playback Setup',
      'Multi-User & Family Smartphone Sharing / Password Reset',
      'Smart Motion Alerts & Notification Configuration'
    ]
  },
  {
    id: 'repair',
    title: 'Offline Camera & DVR Hard Disk Repair',
    badge: 'Same Day Fix',
    badgeBg: '#fef2f2',
    badgeColor: '#b91c1c',
    icon: Wrench,
    iconBg: '#fee2e2',
    iconColor: '#b91c1c',
    shortDesc: 'Fast doorstep troubleshooting for black screens, video loss, recording errors and power supply faults.',
    features: [
      'Camera Showing "No Video" / Blank Screen / Offline',
      'DVR / NVR Hard Disk Error / Recording Stopped / Beeping',
      'Power Supply (SMPS) & BNC/DC Connector Replacement',
      'Night Vision / IR LED / Dual-Light Failure Repair',
      'DVR / NVR Forgotten Password Reset & Firmware Update'
    ]
  },
  {
    id: 'amc',
    title: 'Annual Maintenance Contracts (AMC)',
    badge: 'Total Peace of Mind',
    badgeBg: '#faf5ff',
    badgeColor: '#7e22ce',
    icon: ShieldCheck,
    iconBg: '#f3e8ff',
    iconColor: '#7e22ce',
    shortDesc: 'Scheduled preventative servicing, quarterly lens cleaning, hard disk storage audits & priority visits.',
    features: [
      'Annual CCTV Maintenance Contract for Homes & Apartments',
      'Commercial / Shop / Warehouse CCTV AMC Package',
      'Quarterly Camera Lens Cleaning & Angle Alignment Visit',
      'Storage & Hard Disk Recording Health Verification',
      'Emergency Priority Technician Visit & Same-Day Troubleshooting'
    ]
  }
];

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: CategoryType;
  initialServiceId?: string;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId
}) => {
  const { shopInfo } = useShop();

  // Active selected service ID (null = Step 1: 4 service cards; string = Step 2: specific features & booking form)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string>('');

  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('⚡ As soon as possible / Urgent');
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState<boolean>(false);

  // GPS Location State
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialServiceId) {
        const found = CORE_CCTV_SERVICES.find(s => s.id === initialServiceId);
        if (found) {
          setSelectedServiceId(found.id);
          setSelectedFeature(found.features[0]);
          return;
        }
      }
      setSelectedServiceId(null);
      setSelectedFeature('');
    }
  }, [isOpen, initialServiceId]);

  // Current active service package
  const currentService = CORE_CCTV_SERVICES.find(s => s.id === selectedServiceId) || null;

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

    const serviceTitle = currentService?.title || 'CCTV Service Request';
    const featureText = selectedFeature || currentService?.features[0] || 'General Inquiry';
    const mapsLink = gpsCoordinates ? `https://maps.google.com/?q=${gpsCoordinates.lat},${gpsCoordinates.lng}` : null;

    const message = `🛠️ *NEW CCTV SERVICE REQUEST*
*Shop:* ${shopInfo.shopName}
---------------------------------
🎯 *Service Category:* ${serviceTitle}
🔧 *Specific Feature/Need:* ${featureText}
👤 *Customer Name:* ${customerName}
📞 *Phone Number:* ${phoneNumber}
📍 *Service Address:* ${address}
${mapsLink ? `🗺️ *Live GPS Map Link:* ${mapsLink}` : `📌 _(Tip: You can also tap 📎 > 'Location' in WhatsApp to send your live pin)_`}
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
      category: serviceTitle,
      serviceType: featureText,
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
    setSelectedServiceId(null);
    setSelectedFeature('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => {
          e.stopPropagation();
          setIsTimeDropdownOpen(false);
        }}
        style={{ 
          background: '#ffffff', 
          color: '#0f172a',
          maxWidth: selectedServiceId ? '540px' : '620px',
          width: '94%',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '16px',
          padding: '20px'
        }}
      >
        <div className="modal-drag-handle" />

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px'
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
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: 0 }}>
                {submitted ? 'Booking Confirmation' : selectedServiceId ? 'Book Doorstep Service' : 'Request CCTV Service'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {submitted 
                  ? 'Request generated successfully' 
                  : selectedServiceId 
                    ? 'Step 2: Choose specific feature & enter details' 
                    : 'Step 1: Choose from our 4 specialized service options'}
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
          /* Confirmation Screen */
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
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              WhatsApp Opened!
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Your service request details have been prepared. Please click <strong>Send</strong> on WhatsApp to connect with our technician team immediately.
            </p>
            <button onClick={resetForm} className="btn btn-primary btn-block">
              Done &amp; Close
            </button>
          </div>
        ) : !selectedServiceId ? (
          /* Step 1: 4 Core Service Options Grid */
          <div>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '14px',
              fontSize: '0.82rem',
              color: '#475569',
              lineHeight: 1.4
            }}>
              <strong>Which service do you need?</strong> Tap on any of our 4 specialized options below to see included features and schedule a technician.
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px'
            }}>
              {CORE_CCTV_SERVICES.map((srv) => {
                const IconComponent = srv.icon;
                return (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setSelectedServiceId(srv.id);
                      setSelectedFeature(srv.features[0]);
                    }}
                    style={{
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px',
                      background: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563eb';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: srv.iconBg,
                          color: srv.iconColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <IconComponent size={20} />
                        </div>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '10px',
                          background: srv.badgeBg,
                          color: srv.badgeColor
                        }}>
                          {srv.badge}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', lineHeight: 1.3 }}>
                        {srv.title}
                      </h3>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                        {srv.shortDesc}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '8px',
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#2563eb'
                    }}>
                      <span>Select &amp; View {srv.features.length} Features</span>
                      <ChevronRight size={15} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Step 2: Feature Selection & Booking Form */
          <form onSubmit={handleSubmit}>
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setSelectedServiceId(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0 0 8px 0',
                marginBottom: '4px'
              }}
            >
              <ChevronLeft size={16} />
              <span>&larr; Back to All 4 Services</span>
            </button>

            {/* Selected Service Card Header */}
            {currentService && (
              <div style={{
                background: currentService.iconBg,
                border: `1.5px solid ${currentService.badgeColor}33`,
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <currentService.icon size={20} color={currentService.iconColor} />
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: currentService.badgeColor, textTransform: 'uppercase' }}>
                      Selected Service
                    </span>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                      {currentService.title}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedServiceId(null)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#1e293b',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Change
                </button>
              </div>
            )}

            {/* Which feature / task do you need? */}
            {currentService && (
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.86rem', marginBottom: '8px' }}>
                  Which feature comes in your requirement? *
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentService.features.map((feature, idx) => {
                    const isSelected = selectedFeature === feature;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedFeature(feature)}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            border: isSelected ? '4px solid #2563eb' : '1.5px solid #cbd5e1',
                            background: '#ffffff',
                            flexShrink: 0
                          }} />
                          <span style={{
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#1e3a8a' : '#334155',
                            lineHeight: 1.3
                          }}>
                            {feature}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customer Details Form */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={13} color="#1d4ed8" /> Your Name *
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
                    <Phone size={13} color="#059669" /> Mobile Number *
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>Min 10 digits</span>
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
                  <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                    <span>⚠️</span> {phoneError}
                  </div>
                )}
              </div>
            </div>

            {/* Address with Live GPS Auto-Detect */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: 0 }}>
                  <MapPin size={13} color="#d97706" /> Service Address / Area Landmark *
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
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: isDetectingLocation ? 'wait' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  title="Detect and attach current GPS coordinates to WhatsApp message"
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
                placeholder="e.g. #45, 2nd Main, MCC B Block, Davanagere"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              {/* GPS Confirmation Card */}
              {gpsCoordinates && (
                <div style={{
                  marginTop: '6px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.74rem',
                  color: '#065f46'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Navigation size={12} color="#059669" />
                    <span>
                      <strong>GPS Location:</strong> ({gpsCoordinates.lat.toFixed(4)}, {gpsCoordinates.lng.toFixed(4)})
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
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    <span>Test Map</span>
                    <ExternalLink size={9} />
                  </a>
                </div>
              )}

              {/* Location Error Message */}
              {locationError && (
                <div style={{
                  marginTop: '6px',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  fontSize: '0.72rem',
                  color: '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={13} color="#dc2626" style={{ flexShrink: 0 }} />
                  <span>{locationError}</span>
                </div>
              )}
            </div>

            {/* Preferred Time Dropdown */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} color="#0284c7" /> Preferred Date / Time Slot
              </label>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTimeDropdownOpen(!isTimeDropdownOpen);
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
                  padding: '9px 12px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  color: '#0f172a',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', paddingRight: '8px' }}>
                  {preferredTime}
                </span>
                <ChevronDown 
                  size={16} 
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
                  boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.16)',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  padding: '4px 0'
                }}>
                  {[
                    '⚡ As soon as possible / Urgent',
                    'Today Morning (9:00 AM - 1:00 PM)',
                    'Today Afternoon (1:00 PM - 5:00 PM)',
                    'Today Evening (5:00 PM - 8:00 PM)',
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
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
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
                        {isSelected && <Check size={15} color="#1d4ed8" style={{ flexShrink: 0, marginLeft: '8px' }} />}
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
                placeholder="e.g. Need quotation for 4 camera installation or fix offline DVR..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Submit via WhatsApp */}
            <button
              type="submit"
              className="btn btn-whatsapp btn-block btn-lg"
              style={{ marginTop: '8px', padding: '12px', fontSize: '0.95rem', fontWeight: 700 }}
            >
              <MessageCircle size={18} />
              Book Service via WhatsApp
            </button>

            <p style={{
              fontSize: '0.72rem',
              color: '#64748b',
              textAlign: 'center',
              marginTop: '8px',
              marginBottom: 0
            }}>
              🔒 No advance payment needed. Pay only after service completion.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
