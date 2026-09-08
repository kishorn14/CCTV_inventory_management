import React, { useState } from 'react';
import { 
  Video, 
  Save, 
  RotateCcw, 
  Check, 
  HardDrive, 
  Server, 
  Cable, 
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CctvPricingConfig, DEFAULT_CCTV_PRICING } from '../../types';

export const AdminCctvPricing: React.FC = () => {
  const { cctvPricing, updateCctvPricing, resetCctvPricing } = useShop();

  const [formData, setFormData] = useState<CctvPricingConfig>({ ...cctvPricing });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleInputChange = (field: keyof CctvPricingConfig, value: string) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setFormData(prev => ({ ...prev, [field]: num }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCctvPricing(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all CCTV Estimator prices to factory default recommended rates?')) {
      resetCctvPricing();
      setFormData({ ...DEFAULT_CCTV_PRICING });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Sample quick calculator preview
  const sampleCameras = (formData.hd2mpDome * 2) + (formData.hd2mpBullet * 2);
  const sampleDvr = formData.dvr4Channel;
  const sampleHdd = formData.hdd1TB;
  const sampleAcc = formData.powerSupply4Port + (formData.cablePerCamera * 4);
  const sampleLabor = formData.installationPerCamera * 4;
  const sampleTotal = sampleCameras + sampleDvr + sampleHdd + sampleAcc + sampleLabor;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Title & Action Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        padding: '20px 24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#04647a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(4, 100, 122, 0.25)'
          }}>
            <Video size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              CCTV Estimator Pricing Control
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Set unit prices for cameras, DVR/NVR channels, hard drives, cabling and installation charges.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <RotateCcw size={15} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 22px',
              borderRadius: '10px',
              border: 'none',
              background: saveSuccess ? '#16a34a' : '#1d4ed8',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(29, 78, 216, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            {saveSuccess ? <Check size={16} /> : <Save size={16} />}
            <span>{saveSuccess ? 'Prices Saved!' : 'Save Pricing'}</span>
          </button>
        </div>
      </div>

      {/* Live Sample Kit Calculator Card */}
      <div style={{
        background: 'linear-gradient(135deg, #024b86 0%, #03667c 100%)',
        borderRadius: '18px',
        padding: '20px 24px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 8px 24px rgba(2, 75, 134, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={22} color="#fde047" />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#fde047', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Estimator Preview
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              Standard 4-Camera HD Setup (2 Dome + 2 Bullet + 4CH DVR + 1TB HDD + Cable + Setup)
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Calculated Package Rate</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fde047', letterSpacing: '-0.02em' }}>
            ₹{sampleTotal.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* SECTION 1: Camera Unit Prices */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          padding: '22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                1. Camera Unit Prices (Per Camera Rate)
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                Enter individual camera selling price (HD Analog, IP Smart PoE &amp; WiFi)
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* HD 2MP Dome */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                HD 2MP Indoor Dome Camera (₹)
              </label>
              <input
                type="number"
                value={formData.hd2mpDome}
                onChange={(e) => handleInputChange('hd2mpDome', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* HD 2MP Bullet */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                HD 2MP Outdoor Bullet Camera (₹)
              </label>
              <input
                type="number"
                value={formData.hd2mpBullet}
                onChange={(e) => handleInputChange('hd2mpBullet', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* HD 5MP Dome */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                HD 5MP Super-HD Indoor Dome (₹)
              </label>
              <input
                type="number"
                value={formData.hd5mpDome}
                onChange={(e) => handleInputChange('hd5mpDome', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* HD 5MP Bullet */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                HD 5MP Super-HD Outdoor Bullet (₹)
              </label>
              <input
                type="number"
                value={formData.hd5mpBullet}
                onChange={(e) => handleInputChange('hd5mpBullet', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* IP 2MP Dome */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                IP 2MP Smart PoE Indoor Dome (₹)
              </label>
              <input
                type="number"
                value={formData.ip2mpDome}
                onChange={(e) => handleInputChange('ip2mpDome', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* IP 2MP Bullet */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                IP 2MP Smart PoE Outdoor Bullet (₹)
              </label>
              <input
                type="number"
                value={formData.ip2mpBullet}
                onChange={(e) => handleInputChange('ip2mpBullet', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* IP 4MP ColorVu */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                IP 4MP 24/7 ColorVu Full-Color Camera (₹)
              </label>
              <input
                type="number"
                value={formData.ip4mpColorVu}
                onChange={(e) => handleInputChange('ip4mpColorVu', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* WiFi 360 */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                WiFi 360° Wireless Smart PTZ Camera (₹)
              </label>
              <input
                type="number"
                value={formData.wifi360Camera}
                onChange={(e) => handleInputChange('wifi360Camera', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DVR & NVR Video Recorders */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          padding: '22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Server size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                2. DVR &amp; NVR Digital Recorders
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                Prices for 4, 8 and 16 channel standalone recorder units
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* DVR 4CH */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                4 Channel HD DVR (₹)
              </label>
              <input
                type="number"
                value={formData.dvr4Channel}
                onChange={(e) => handleInputChange('dvr4Channel', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* DVR 8CH */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                8 Channel HD DVR (₹)
              </label>
              <input
                type="number"
                value={formData.dvr8Channel}
                onChange={(e) => handleInputChange('dvr8Channel', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* DVR 16CH */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                16 Channel HD DVR (₹)
              </label>
              <input
                type="number"
                value={formData.dvr16Channel}
                onChange={(e) => handleInputChange('dvr16Channel', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* NVR 4CH */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                4 Channel PoE NVR (₹)
              </label>
              <input
                type="number"
                value={formData.nvr4Channel}
                onChange={(e) => handleInputChange('nvr4Channel', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* NVR 8CH */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                8 Channel PoE NVR (₹)
              </label>
              <input
                type="number"
                value={formData.nvr8Channel}
                onChange={(e) => handleInputChange('nvr8Channel', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* NVR 16CH */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                16 Channel PoE NVR (₹)
              </label>
              <input
                type="number"
                value={formData.nvr16Channel}
                onChange={(e) => handleInputChange('nvr16Channel', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Hard Disk Storage */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          padding: '22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HardDrive size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                3. Surveillance Hard Disk Storage
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                High endurance 24×7 video recording hard disks (Seagate SkyHawk / WD Purple)
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* 500GB */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                500 GB Surveillance HDD (₹)
              </label>
              <input
                type="number"
                value={formData.hdd500GB}
                onChange={(e) => handleInputChange('hdd500GB', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* 1TB */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                1 TB Surveillance HDD (₹)
              </label>
              <input
                type="number"
                value={formData.hdd1TB}
                onChange={(e) => handleInputChange('hdd1TB', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* 2TB */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                2 TB Surveillance HDD (₹)
              </label>
              <input
                type="number"
                value={formData.hdd2TB}
                onChange={(e) => handleInputChange('hdd2TB', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* 4TB */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                4 TB Surveillance HDD (₹)
              </label>
              <input
                type="number"
                value={formData.hdd4TB}
                onChange={(e) => handleInputChange('hdd4TB', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Power Supplies, Cabling & Installation Labor */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          padding: '22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cable size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                4. Accessories, Power Supplies &amp; Installation
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                SMPS power adapters, cable bundle cost per point &amp; certified technician labor charge
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* Power Supply 4 Port */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                4-Port SMPS Power Adapter (₹)
              </label>
              <input
                type="number"
                value={formData.powerSupply4Port}
                onChange={(e) => handleInputChange('powerSupply4Port', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* Power Supply 8 Port */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                8-Port SMPS Power Adapter (₹)
              </label>
              <input
                type="number"
                value={formData.powerSupply8Port}
                onChange={(e) => handleInputChange('powerSupply8Port', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* Power Supply 16 Port */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                16-Port SMPS Power Adapter (₹)
              </label>
              <input
                type="number"
                value={formData.powerSupply16Port}
                onChange={(e) => handleInputChange('powerSupply16Port', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* Cable per camera */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Cable + BNC/DC Pins per Camera (₹)
              </label>
              <input
                type="number"
                value={formData.cablePerCamera}
                onChange={(e) => handleInputChange('cablePerCamera', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>

            {/* Installation per camera */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Doorstep Installation &amp; Setup per Camera (₹)
              </label>
              <input
                type="number"
                value={formData.installationPerCamera}
                onChange={(e) => handleInputChange('installationPerCamera', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 30px',
              borderRadius: '10px',
              border: 'none',
              background: saveSuccess ? '#16a34a' : '#1d4ed8',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(29, 78, 216, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            {saveSuccess ? <Check size={18} /> : <Save size={18} />}
            <span>{saveSuccess ? 'All Prices Saved Successfully!' : 'Save CCTV Pricing Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
