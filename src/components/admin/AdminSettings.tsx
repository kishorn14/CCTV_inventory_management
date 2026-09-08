import React, { useState } from 'react';
import { 
  Save, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  ExternalLink,
  Copy,
  Send,
  HelpCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { GOOGLE_APPS_SCRIPT_CODE, sendLeadToGoogleSheets } from '../../utils/googleSheets';

export const AdminSettings: React.FC = () => {
  const { shopInfo, updateShopInfo, adminPassword, updateAdminPassword } = useShop();

  const [formData, setFormData] = useState({
    shopName: shopInfo.shopName,
    tagline: shopInfo.tagline,
    phone: shopInfo.phone,
    whatsappPhone: shopInfo.whatsappPhone,
    email: shopInfo.email,
    address: shopInfo.address,
    city: shopInfo.city,
    workingHours: shopInfo.workingHours,
    workingDays: shopInfo.workingDays,
    googleSheetWebhookUrl: shopInfo.googleSheetWebhookUrl || '',
    googleSheetViewUrl: shopInfo.googleSheetViewUrl || '',
    currentPass: '',
    newPass: '',
    confirmPass: ''
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    updateShopInfo({
      shopName: formData.shopName,
      tagline: formData.tagline,
      phone: formData.phone,
      whatsappPhone: formData.whatsappPhone.replace(/[^0-9]/g, ''),
      email: formData.email,
      address: formData.address,
      city: formData.city,
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(formData.shopName + ' ' + formData.city)}`,
      workingHours: formData.workingHours,
      workingDays: formData.workingDays,
      googleSheetWebhookUrl: formData.googleSheetWebhookUrl.trim(),
      googleSheetViewUrl: formData.googleSheetViewUrl.trim()
    });

    setSuccessMsg('Settings updated successfully! Google Sheet webhook & shop details are saved.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleTestGoogleSheet = async () => {
    if (!formData.googleSheetWebhookUrl) {
      alert('Please enter your Google Web App URL first and click Save.');
      return;
    }
    setTestSending(true);
    setTestResult(null);

    const success = await sendLeadToGoogleSheets(formData.googleSheetWebhookUrl, {
      customerName: 'Test Customer (Meksha Admin)',
      phoneNumber: '9876543210',
      address: 'Shop Test Location',
      category: 'CCTV Security',
      serviceType: 'System Diagnostics & Test Row',
      preferredTime: 'Immediate',
      notes: 'Testing live Google Sheets integration from admin portal.',
      source: 'Admin Settings Test',
      status: 'Pending ⏳'
    });

    setTestSending(false);
    if (success) {
      setTestResult('✅ Test row sent! Check your Google Sheet to confirm.');
    } else {
      setTestResult('⚠️ Could not connect to the Google Sheet URL. Please verify the URL.');
    }
    setTimeout(() => setTestResult(null), 6000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setSuccessMsg('');

    if (formData.currentPass !== adminPassword) {
      setPassError('Current admin password is incorrect.');
      return;
    }

    if (formData.newPass.length < 4) {
      setPassError('New password must be at least 4 characters long.');
      return;
    }

    if (formData.newPass !== formData.confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    updateAdminPassword(formData.newPass);
    setFormData({ ...formData, currentPass: '', newPass: '', confirmPass: '' });
    setSuccessMsg('Admin password changed successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
          Shop & WhatsApp Contact Settings
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Update your phone number, WhatsApp receiving number, shop address, and admin credentials.
        </p>
      </div>

      {successMsg && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#065f46',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Shop Details Form */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '18px' }}>
          Store Contact & Display Information
        </h3>

        <form onSubmit={handleSaveInfo}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Shop Business Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.shopName}
                onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline / Subtitle</label>
              <input
                type="text"
                className="form-input"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#1d4ed8" /> Primary Call Helpline
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 98450 12345"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageCircle size={14} color="#059669" /> WhatsApp Number (For Leads & Bookings) *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="919845012345 (with country code, no + or spaces)"
                value={formData.whatsappPhone}
                onChange={e => setFormData({ ...formData, whatsappPhone: e.target.value })}
                required
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                All customer bookings and product quotes will be sent to this WhatsApp number.
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#d97706" /> Contact Email
              </label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#0284c7" /> Working Hours & Days
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.workingHours}
                onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#ea580c" /> Shop Address / Street
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">City & State</label>
              <input
                type="text"
                className="form-input"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            <Save size={16} /> Save Shop Information
          </button>
        </form>
      </div>

      {/* Google Sheets Lead Sync Card */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', background: '#ffffff', border: '1.5px solid #a7f3d0', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileSpreadsheet size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                Google Sheets Customer Lead Sync
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              Automatically log all customer bookings and estimate requests directly into your personal Google Sheet / Excel.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem', gap: '6px' }}
          >
            <HelpCircle size={15} /> {showGuide ? 'Hide Setup Steps' : 'View 1-Min Setup Guide'}
          </button>
        </div>

        {/* Setup Guide Accordion */}
        {showGuide && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '18px',
            marginBottom: '20px',
            fontSize: '0.88rem',
            lineHeight: 1.6,
            color: '#334155'
          }}>
            <h4 style={{ color: '#1d4ed8', marginBottom: '8px', fontWeight: 700 }}>
              🚀 Quick 3-Step Setup Instructions:
            </h4>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Create a new blank spreadsheet at <strong>sheets.google.com</strong>.</li>
              <li>In your Google Sheet top menu, click <strong>Extensions ➔ Apps Script</strong>.</li>
              <li>Delete any sample code, click the <strong>"Copy Script"</strong> button below, paste it into Apps Script, then click <strong>Deploy ➔ New deployment</strong>.</li>
              <li>Select type: <strong>Web app</strong>, set <em>"Who has access"</em> to <strong>"Anyone"</strong>, click <strong>Deploy</strong>, and copy your <strong>Web App URL</strong>!</li>
              <li>Paste that Web App URL into the field below and click <strong>"Send Test Row"</strong> to test.</li>
            </ol>
          </div>
        )}

        <form onSubmit={handleSaveInfo}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Google Apps Script Web App URL (For automatic row recording)</span>
              <button
                type="button"
                onClick={handleCopyScript}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedScript ? '#059669' : '#1d4ed8',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Copy size={13} /> {copiedScript ? '✓ Script Copied to Clipboard!' : 'Copy Apps Script Code'}
              </button>
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
              value={formData.googleSheetWebhookUrl}
              onChange={e => setFormData({ ...formData, googleSheetWebhookUrl: e.target.value })}
            />
            <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Every time a customer submits a service booking or quotation request, a row will be automatically appended to your sheet.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Google Sheet Direct Link (Optional - for quick 1-click opening)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://docs.google.com/spreadsheets/d/.../edit"
              value={formData.googleSheetViewUrl}
              onChange={e => setFormData({ ...formData, googleSheetViewUrl: e.target.value })}
            />
          </div>

          {testResult && (
            <div style={{
              background: testResult.includes('✅') ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${testResult.includes('✅') ? '#a7f3d0' : '#fecaca'}`,
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: testResult.includes('✅') ? '#065f46' : '#b91c1c',
              marginBottom: '14px'
            }}>
              {testResult}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={15} /> Save Google Sheet Settings
            </button>

            <button
              type="button"
              onClick={handleTestGoogleSheet}
              disabled={testSending}
              className="btn btn-outline btn-sm"
              style={{ borderColor: '#a7f3d0', background: '#ecfdf5', color: '#059669', fontWeight: 700 }}
            >
              <Send size={15} /> {testSending ? 'Sending Test...' : '🧪 Send Test Booking Row'}
            </button>

            {formData.googleSheetViewUrl && (
              <a
                href={formData.googleSheetViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ marginLeft: 'auto' }}
              >
                <ExternalLink size={15} /> Open Google Sheet
              </a>
            )}
          </div>
        </form>
      </div>

      {/* Password Management Card */}
      <div className="glass-card" style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          Change Admin Portal Password
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '18px' }}>
          Set a secure custom password to protect your store catalog and settings.
        </p>

        {passError && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            color: '#b91c1c',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px', marginBottom: '18px' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Current..."
                value={formData.currentPass}
                onChange={e => setFormData({ ...formData, currentPass: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="New..."
                value={formData.newPass}
                onChange={e => setFormData({ ...formData, newPass: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirm..."
                value={formData.confirmPass}
                onChange={e => setFormData({ ...formData, confirmPass: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-outline btn-sm" style={{ marginTop: '6px' }}>
            <Lock size={15} /> Update Admin Password
          </button>
        </form>
      </div>
    </div>
  );
};
