import React, { useState, useRef } from 'react';
import { 
  MapPin, 
  Camera, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Video, 
  X, 
  Lock, 
  Eye,
  EyeOff,
  LogOut, 
  ArrowLeft, 
  ExternalLink,
  Plus,
  Compass,
  ClipboardList
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SiteVisit } from '../../types';
import { compressImageFile } from '../../utils/imageCompressor';

interface SiteVisitAppProps {
  onGoToStore?: () => void;
  onGoToAdmin?: () => void;
}

const PROPERTY_TYPES = [
  'Home / Villa',
  'Shop / Retail Store',
  'Office / Commercial',
  'Warehouse / Godown',
  'Factory / Industrial',
  'Farm / Agriculture Plot',
  'School / Institution',
  'Apartment / Building'
];

const SYSTEM_TYPES = [
  'PoE IP Smart Cameras',
  'HD Analog Cameras',
  '4G Solar PTZ / SIM Cameras',
  'Wireless Wi-Fi 360° Cameras',
  'DVR / NVR Upgrade & HDD',
  'Service, Repair & AMC'
];

const CAMERA_COUNTS = ['2 Cameras', '4 Cameras', '6 Cameras', '8 Cameras', '16 Cameras', '32+ Cameras'];

export const SiteVisitApp: React.FC<SiteVisitAppProps> = ({ onGoToStore, onGoToAdmin }) => {
  const { shopInfo, addSiteVisit, siteVisits } = useShop();

  // Authentication: Password is "admin@2026"
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('meksha_site_visit_auth') === 'true' ||
           localStorage.getItem('meksha_site_visit_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Form State
  const [technicianName, setTechnicianName] = useState(() => {
    return localStorage.getItem('meksha_tech_name') || '';
  });
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [propertyType, setPropertyType] = useState('Home / Villa');
  const [enquiredSystem, setEnquiredSystem] = useState('PoE IP Smart Cameras');
  const [cameraCount, setCameraCount] = useState('4 Cameras');
  const [enquiryNotes, setEnquiryNotes] = useState('');

  // GPS Location State
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [gpsData, setGpsData] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    mapUrl: string;
  } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [manualMapUrl, setManualMapUrl] = useState('');

  // Photos State
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCompressingPhotos, setIsCompressingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success Submission Modal
  const [submittedVisit, setSubmittedVisit] = useState<SiteVisit | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab View for Technician: New Inspection vs Recent Visits
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  // Handle Login - Case-insensitive and trimmed to handle mobile keyboard autocorrect
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = passwordInput.trim().toLowerCase();
    if (cleaned === 'admin@2026') {
      sessionStorage.setItem('meksha_site_visit_auth', 'true');
      localStorage.setItem('meksha_site_visit_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect password. Please verify and try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('meksha_site_visit_auth');
    localStorage.removeItem('meksha_site_visit_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Fetch GPS Coordinates from Mobile Device
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser or device.');
      return;
    }

    setIsFetchingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);
        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        setGpsData({
          lat,
          lng,
          accuracy,
          mapUrl
        });
        setIsFetchingGps(false);
      },
      (error) => {
        setIsFetchingGps(false);
        console.warn('Geolocation error:', error);
        if (error.code === 1) {
          setGpsError('Location permission denied. Please enable Location in browser settings or paste Google Maps link.');
        } else if (error.code === 2) {
          setGpsError('GPS signal unavailable. Please ensure device Location is turned on.');
        } else {
          setGpsError('Could not fetch GPS. Please paste landmark or Google Maps link below.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );
  };

  // Handle Multiple Site Photo Capture & Compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressingPhotos(true);
    const newPhotos: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          // Compress to max 1200x1200px and 80% quality (~80KB)
          const compressed = await compressImageFile(file, 1200, 1200, 0.80);
          newPhotos.push(compressed);
        } catch (err) {
          console.error('Error compressing site photo:', err);
        }
      }
    }

    setPhotos(prev => [...prev, ...newPhotos]);
    setIsCompressingPhotos(false);
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Generate & Dispatch WhatsApp Report to Shop
  const generateWhatsAppMessage = (visit: SiteVisit): string => {
    const locationStr = visit.gpsLocation?.mapUrl 
      ? `📍 *Google Maps Location:*\n${visit.gpsLocation.mapUrl}`
      : visit.manualMapUrl 
        ? `📍 *Map / Location Link:*\n${visit.manualMapUrl}`
        : `📍 *Location:* ${visit.customerAddress} (${visit.landmark || 'No landmark specified'})`;

    return `📋 *MEKSHA CCTV - FIELD SITE INSPECTION REPORT*
🔢 *Visit Number:* *${visit.visitNumber}*
👨‍🔧 *Technician:* ${visit.technicianName}
📅 *Date & Time:* ${visit.formattedDate}

👤 *Customer Information:*
• *Name:* ${visit.customerName}
• *Phone:* ${visit.customerPhone}
• *Address:* ${visit.customerAddress}
${visit.landmark ? `• *Landmark:* ${visit.landmark}\n` : ''}
${locationStr}

📹 *Customer Enquiry & Requirements:*
• *Property Type:* ${visit.propertyType || 'N/A'}
• *System Required:* ${visit.enquiredSystem || 'N/A'}
• *Estimated Cameras:* ${visit.cameraCount || 'N/A'}

📝 *Inspection Findings & Notes:*
${visit.enquiryNotes || 'No special notes recorded.'}

📸 *Site Photos Captured:* ${visit.photos.length} photo(s) saved in Meksha Admin Portal.

✅ *Inspection completed on site by ${visit.technicianName}. Please review and prepare quotation.*`;
  };

  const handleSendToWhatsApp = (visit: SiteVisit) => {
    const message = generateWhatsAppMessage(visit);
    const whatsappNum = shopInfo.whatsappPhone?.replace(/[^0-9]/g, '') || '919482594191';
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Form Submit Handler
  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();

    if (!technicianName.trim()) {
      alert('Please enter your Technician / Employee Name.');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter Customer Name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 10) {
      alert('Please enter a valid 10-digit Customer Phone Number.');
      return;
    }
    if (!customerAddress.trim()) {
      alert('Please enter Site Address / Area.');
      return;
    }

    setIsSubmitting(true);

    // Save technician name for future visits
    localStorage.setItem('meksha_tech_name', technicianName.trim());

    // Create SiteVisit record
    const newVisit = addSiteVisit({
      technicianName: technicianName.trim(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      landmark: landmark.trim() || undefined,
      city: 'Davanagere',
      gpsLocation: gpsData || undefined,
      manualMapUrl: manualMapUrl.trim() || undefined,
      propertyType,
      enquiredSystem,
      cameraCount,
      enquiryNotes: enquiryNotes.trim(),
      photos,
      status: 'New'
    });

    setIsSubmitting(false);
    setSubmittedVisit(newVisit);

    // Automatically trigger WhatsApp report
    handleSendToWhatsApp(newVisit);
  };

  // Reset form for next site visit
  const handleResetForNextVisit = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setLandmark('');
    setEnquiryNotes('');
    setGpsData(null);
    setManualMapUrl('');
    setPhotos([]);
    setSubmittedVisit(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- 1. LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px 20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          color: '#0f172a',
          textAlign: 'center'
        }}>
          {/* Logo & Header */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#eff6ff',
            border: '2px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            color: '#2563eb'
          }}>
            <MapPin size={32} />
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
            MEKSHA CCTV
          </h2>
          <div style={{
            display: 'inline-block',
            background: '#dbeafe',
            color: '#1d4ed8',
            padding: '2px 10px',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '10px'
          }}>
            Field Site Inspection Portal
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 20px 0' }}>
            Enter your employee access password to conduct a site inspection, capture GPS location &amp; take photos.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Enter password"
                value={passwordInput}
                onChange={e => {
                  setPasswordInput(e.target.value);
                  if (loginError) setLoginError('');
                }}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '11px 40px 11px 36px',
                  borderRadius: '10px',
                  border: loginError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {loginError && (
              <div style={{
                color: '#dc2626',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                justifyContent: 'center'
              }}>
                <AlertCircle size={14} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
              }}
            >
              Sign In to Site Portal
            </button>
          </form>

          {/* Quick links to store */}
          <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', gap: '16px' }}>
            {onGoToStore && (
              <button
                type="button"
                onClick={onGoToStore}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ArrowLeft size={13} />
                <span>Back to Store</span>
              </button>
            )}
            {onGoToAdmin && (
              <button
                type="button"
                onClick={onGoToAdmin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Admin Portal →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- 2. MAIN MOBILE APP INTERFACE ---
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f1f5f9',
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      paddingBottom: '40px'
    }}>
      {/* Mobile-First Header Bar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '10px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MapPin size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#0f172a', lineHeight: 1.1 }}>
              MEKSHA CCTV
            </div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800 }}>
              📍 Field Site Inspection
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onGoToAdmin && (
            <button
              onClick={onGoToAdmin}
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Open Admin Dashboard"
            >
              Admin
            </button>
          )}

          <button
            onClick={handleLogout}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Log Out"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Pill Tabs: New Inspection vs History */}
      <div style={{ maxWidth: '640px', margin: '10px auto', padding: '0 12px' }}>
        <div style={{
          display: 'flex',
          background: '#e2e8f0',
          padding: '3px',
          borderRadius: '10px',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'form' ? '#ffffff' : 'transparent',
              color: activeTab === 'form' ? '#1d4ed8' : '#475569',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'form' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={15} />
            <span>New Inspection</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'history' ? '#ffffff' : 'transparent',
              color: activeTab === 'history' ? '#1d4ed8' : '#475569',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'history' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ClipboardList size={15} />
            <span>Site Visits ({siteVisits.length})</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '0 12px' }}>

        {/* TAB 1: NEW INSPECTION FORM */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmitInspection} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Section 1: Technician Identity */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <User size={16} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  1. Technician / Inspector
                </h3>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                  Who is conducting this site visit? *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kiran Kumar / Ramesh"
                  value={technicianName}
                  onChange={e => setTechnicianName(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                />
              </div>
            </div>

            {/* Section 2: Customer Details */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Phone size={16} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  2. Customer Details
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Rajesh Patel"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                    Phone Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9886012345"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                    Site / Building Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. #45, 3rd Cross, MCC 'B' Block, Davanagere"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opp. Bapuji Hospital / Near Water Tank"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: GPS Location Capture */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '16px',
              border: gpsData ? '2px solid #16a34a' : '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="#16a34a" />
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                    3. Exact Site GPS Location
                  </h3>
                </div>
                {gpsData && (
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800, background: '#dcfce7', padding: '2px 8px', borderRadius: '9999px' }}>
                    ✓ Locked
                  </span>
                )}
              </div>

              <p style={{ margin: '0 0 12px 0', fontSize: '0.76rem', color: '#64748b' }}>
                Tap the button below to fetch exact GPS satellite coordinates of this installation site.
              </p>

              {/* GPS Fetch Button */}
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isFetchingGps}
                style={{
                  width: '100%',
                  background: gpsData ? '#f0fdf4' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  border: gpsData ? '1.5px solid #16a34a' : 'none',
                  color: gpsData ? '#15803d' : '#ffffff',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: isFetchingGps ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: gpsData ? 'none' : '0 4px 12px rgba(5, 150, 105, 0.25)'
                }}
              >
                <Compass size={18} />
                <span>
                  {isFetchingGps 
                    ? '📡 Acquiring GPS Coordinates...' 
                    : gpsData 
                      ? '🔄 Update Current GPS Location' 
                      : '📍 Tap to Capture Current GPS Location'}
                </span>
              </button>

              {/* GPS Success Feedback Box */}
              {gpsData && (
                <div style={{
                  marginTop: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 700 }}>
                      Lat: {gpsData.lat.toFixed(5)}, Lng: {gpsData.lng.toFixed(5)}
                    </span>
                    {gpsData.accuracy && (
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Accurate to ±{gpsData.accuracy}m
                      </span>
                    )}
                  </div>
                  <a
                    href={gpsData.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.78rem',
                      color: '#2563eb',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none'
                    }}
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* GPS Error Message */}
              {gpsError && (
                <div style={{
                  marginTop: '10px',
                  color: '#dc2626',
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fef2f2',
                  padding: '8px 10px',
                  borderRadius: '6px'
                }}>
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{gpsError}</span>
                </div>
              )}

              {/* Manual Maps Link Fallback */}
              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', marginBottom: '4px' }}>
                  Or paste Google Maps link manually:
                </label>
                <input
                  type="url"
                  placeholder="https://maps.app.goo.gl/..."
                  value={manualMapUrl}
                  onChange={e => setManualMapUrl(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem'
                  }}
                />
              </div>
            </div>

            {/* Section 4: Customer Enquiry & Requirements */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Video size={16} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  4. Customer Enquiry &amp; Requirements
                </h3>
              </div>

              {/* Property Type Pills */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  Property Type
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {PROPERTY_TYPES.map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setPropertyType(type)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: propertyType === type ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                        background: propertyType === type ? '#eff6ff' : '#f8fafc',
                        color: propertyType === type ? '#1d4ed8' : '#334155',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Enquired Pills */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  System / CCTV Type Enquired
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {SYSTEM_TYPES.map(sys => (
                    <button
                      type="button"
                      key={sys}
                      onClick={() => setEnquiredSystem(sys)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: enquiredSystem === sys ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                        background: enquiredSystem === sys ? '#eff6ff' : '#f8fafc',
                        color: enquiredSystem === sys ? '#1d4ed8' : '#334155',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {sys}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Count */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  Estimated Camera Quantity
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {CAMERA_COUNTS.map(count => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => setCameraCount(count)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: cameraCount === count ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                        background: cameraCount === count ? '#eff6ff' : '#f8fafc',
                        color: cameraCount === count ? '#1d4ed8' : '#334155',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enquiry Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                  Inspection Findings &amp; Customer Notes *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Needs 2 outdoor bullet cameras for front gate, 2 indoor domes for billing counter. DVR to be placed on 1st floor office. Cabling length ~90m. Customer requested 2 years brand warranty."
                  value={enquiryNotes}
                  onChange={e => setEnquiryNotes(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.86rem',
                    fontFamily: 'inherit',
                    lineHeight: 1.4
                  }}
                />
              </div>
            </div>

            {/* Section 5: Site Photos Capture */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={16} color="#2563eb" />
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                    5. Site Inspection Photos ({photos.length})
                  </h3>
                </div>
                {photos.length > 0 && (
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800, background: '#dcfce7', padding: '2px 8px', borderRadius: '9999px' }}>
                    {photos.length} Captured
                  </span>
                )}
              </div>

              <p style={{ margin: '0 0 12px 0', fontSize: '0.76rem', color: '#64748b' }}>
                Take photos of the gate, entrance, DVR placement wall, and power points. Photos are compressed automatically.
              </p>

              {/* Photo Input Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressingPhotos}
                style={{
                  width: '100%',
                  background: '#eff6ff',
                  border: '2px dashed #93c5fd',
                  color: '#1d4ed8',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: isCompressingPhotos ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}
              >
                <Camera size={18} />
                <span>{isCompressingPhotos ? '⏳ Compressing Photos...' : '📸 Take Photo / Select from Gallery'}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />

              {/* Photos Thumbnail Grid */}
              {photos.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))',
                  gap: '8px'
                }}>
                  {photos.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      style={{
                        position: 'relative',
                        aspectRatio: '1/1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      <img
                        src={photo}
                        alt={`Site ${pIdx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(pIdx)}
                        style={{
                          position: 'absolute',
                          top: '3px',
                          right: '3px',
                          background: 'rgba(0,0,0,0.65)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Remove photo"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit & Dispatch Button */}
            <div style={{ position: 'sticky', bottom: '12px', zIndex: 40 }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 900,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  letterSpacing: '0.01em'
                }}
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Saving Inspection...' : '💾 Save & Send Report to Shop WhatsApp'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: RECENT SITE VISITS HISTORY */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                Recent Field Inspections ({siteVisits.length})
              </h3>
              <button
                onClick={() => setActiveTab('form')}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={13} />
                <span>New Visit</span>
              </button>
            </div>

            {siteVisits.length === 0 ? (
              <div style={{
                background: '#ffffff',
                padding: '30px 20px',
                borderRadius: '14px',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
                color: '#64748b'
              }}>
                <MapPin size={36} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>No site visits recorded yet</div>
                <p style={{ fontSize: '0.8rem', margin: '6px 0 16px 0' }}>
                  Tap "New Inspection" to log your first field customer visit.
                </p>
                <button
                  onClick={() => setActiveTab('form')}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Start First Inspection
                </button>
              </div>
            ) : (
              siteVisits.map((visit) => (
                <div
                  key={visit.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  {/* Top Bar: Visit # & Date */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 800
                    }}>
                      {visit.visitNumber}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {visit.formattedDate}
                    </span>
                  </div>

                  {/* Customer & Technician */}
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                      {visit.customerName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      📞 {visit.customerPhone} • 📍 {visit.customerAddress}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                      👨‍🔧 Visited by: {visit.technicianName}
                    </div>
                  </div>

                  {/* Enquiry Summary */}
                  <div style={{
                    background: '#f8fafc',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    color: '#334155'
                  }}>
                    <div><strong>Requirement:</strong> {visit.enquiredSystem} ({visit.cameraCount})</div>
                    {visit.enquiryNotes && (
                      <div style={{ marginTop: '3px', color: '#475569' }}>
                        <em>"{visit.enquiryNotes}"</em>
                      </div>
                    )}
                  </div>

                  {/* Actions: Map & WhatsApp */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {visit.gpsLocation?.mapUrl && (
                      <a
                        href={visit.gpsLocation.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          padding: '7px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#2563eb',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <MapPin size={13} />
                        <span>Open Map</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSendToWhatsApp(visit)}
                      style={{
                        flex: 1,
                        padding: '7px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#10b981',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <Send size={13} />
                      <span>Send WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* --- SUCCESS MODAL: REPORT SAVED & WHATSAPP DISPATCHED --- */}
      {submittedVisit && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '440px',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px 20px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#dcfce7',
              border: '2px solid #86efac',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: '#16a34a'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <span style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              padding: '3px 12px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'inline-block',
              marginBottom: '8px'
            }}>
              VISIT NUMBER: {submittedVisit.visitNumber}
            </span>

            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
              Site Inspection Saved!
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px 0' }}>
              The report was recorded in the Admin Dashboard and prepared for WhatsApp.
            </p>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'left',
              fontSize: '0.8rem',
              marginBottom: '16px',
              lineHeight: 1.5
            }}>
              <div><strong>Customer:</strong> {submittedVisit.customerName} ({submittedVisit.customerPhone})</div>
              <div><strong>Technician:</strong> {submittedVisit.technicianName}</div>
              <div><strong>Requirement:</strong> {submittedVisit.enquiredSystem}</div>
              <div><strong>Photos:</strong> {submittedVisit.photos.length} captured</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleSendToWhatsApp(submittedVisit)}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Send size={15} />
                <span>Re-send to Shop WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleResetForNextVisit}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                + Start Next Site Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
