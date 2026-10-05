import React, { useState, useMemo } from 'react';
import { 
  Video, 
  Save, 
  RotateCcw, 
  Check, 
  HardDrive, 
  Server, 
  Cable, 
  Sparkles,
  Wifi,
  Sun,
  Box,
  Wrench,
  Lock,
  Search,
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CctvPricingConfig, DEFAULT_CCTV_PRICING } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export interface EstimatorItemDef {
  id: keyof CctvPricingConfig;
  name: string;
  category: 'camera' | 'recorder' | 'storage' | 'smps' | 'cable' | 'accessory' | 'labor';
  categoryLabel: string;
  architecture: 'Wired CCTV' | 'Wi-Fi 360°' | 'Solar 4G' | 'All Systems' | 'Wi-Fi / Solar';
  unit: string;
  description: string;
  badge?: string;
}

export const ESTIMATOR_CATALOG: EstimatorItemDef[] = [
  // 1. CAMERAS (9)
  {
    id: 'hd2mpDome',
    name: 'HD 2MP Indoor Dome Camera',
    category: 'camera',
    categoryLabel: 'Cameras (Wired)',
    architecture: 'Wired CCTV',
    unit: '₹ / camera',
    description: '1080p Full HD night vision dome camera for indoor ceiling mounting.',
    badge: 'Popular'
  },
  {
    id: 'hd2mpBullet',
    name: 'HD 2MP Outdoor Bullet Camera',
    category: 'camera',
    categoryLabel: 'Cameras (Wired)',
    architecture: 'Wired CCTV',
    unit: '₹ / camera',
    description: '1080p IP66 weatherproof infrared bullet camera for outdoor gates & walls.',
    badge: 'Weatherproof'
  },
  {
    id: 'hd5mpDome',
    name: 'HD 5MP Super-HD Dome Camera',
    category: 'camera',
    categoryLabel: 'Cameras (Wired)',
    architecture: 'Wired CCTV',
    unit: '₹ / camera',
    description: '5 Megapixel super-high clarity dome camera for cash counters & fine details.'
  },
  {
    id: 'hd5mpBullet',
    name: 'HD 5MP Super-HD Bullet Camera',
    category: 'camera',
    categoryLabel: 'Cameras (Wired)',
    architecture: 'Wired CCTV',
    unit: '₹ / camera',
    description: '5 Megapixel long-range outdoor bullet camera for license plates & perimeter.'
  },
  {
    id: 'ip2mpDome',
    name: 'IP 2MP PoE Smart Dome Camera',
    category: 'camera',
    categoryLabel: 'Cameras (Wired)',
    architecture: 'Wired CCTV',
    unit: '₹ / camera',
    description: 'Network digital dome with 2-way audio & direct PoE network cable power.'
  },
  {
    id: 'ip2mpBullet',
    name: 'IP 2MP PoE Smart Bullet Camera',
    category: 'camera',
    categoryLabel: 'Cameras (Wired)',
    architecture: 'Wired CCTV',
    unit: '₹ / camera',
    description: 'Network digital bullet camera with AI motion detection & weatherproof PoE.'
  },
  {
    id: 'ip4mpColorVu',
    name: 'IP 4MP 24/7 ColorVu Camera',
    category: 'camera',
    categoryLabel: 'Cameras (Wired)',
    architecture: 'Wired CCTV',
    unit: '₹ / camera',
    description: 'Full-color night vision 24/7 in total darkness with smart AI human alerts.',
    badge: 'Night Color'
  },
  {
    id: 'wifi360Camera',
    name: 'Wi-Fi 360° Smart Wireless Camera',
    category: 'camera',
    categoryLabel: 'Cameras (Wireless)',
    architecture: 'Wi-Fi 360°',
    unit: '₹ / unit',
    description: 'Motorized pan/tilt 360° rotation, mobile phone control, 2-way talk & siren.',
    badge: 'Best Seller'
  },
  {
    id: 'solar4gCamera',
    name: 'Outdoor Solar 4G Standalone Bullet/PTZ',
    category: 'camera',
    categoryLabel: 'Cameras (Solar 4G)',
    architecture: 'Solar 4G',
    unit: '₹ / unit',
    description: '100% Wire-free with solar panel, built-in battery & 4G SIM slot. Zero electricity needed.',
    badge: '100% Wire-Free'
  },

  // 2. RECORDERS (6)
  {
    id: 'dvr4Channel',
    name: '4 Channel HD Digital Video Recorder (DVR)',
    category: 'recorder',
    categoryLabel: 'Recorders (DVR/NVR)',
    architecture: 'Wired CCTV',
    unit: '₹ / unit',
    description: 'Supports up to 4 HD analog cameras with HDMI/VGA & mobile app viewing.'
  },
  {
    id: 'dvr8Channel',
    name: '8 Channel HD Digital Video Recorder (DVR)',
    category: 'recorder',
    categoryLabel: 'Recorders (DVR/NVR)',
    architecture: 'Wired CCTV',
    unit: '₹ / unit',
    description: 'Supports up to 8 HD analog cameras with 24x7 continuous recording.'
  },
  {
    id: 'dvr16Channel',
    name: '16 Channel HD Digital Video Recorder (DVR)',
    category: 'recorder',
    categoryLabel: 'Recorders (DVR/NVR)',
    architecture: 'Wired CCTV',
    unit: '₹ / unit',
    description: 'Commercial grade 16-channel HD DVR for large properties and factories.'
  },
  {
    id: 'nvr4Channel',
    name: '4 Channel PoE Network Video Recorder (NVR)',
    category: 'recorder',
    categoryLabel: 'Recorders (DVR/NVR)',
    architecture: 'Wired CCTV',
    unit: '₹ / unit',
    description: 'Built-in 4-port PoE switch for direct IP camera plug-and-play.'
  },
  {
    id: 'nvr8Channel',
    name: '8 Channel PoE Network Video Recorder (NVR)',
    category: 'recorder',
    categoryLabel: 'Recorders (DVR/NVR)',
    architecture: 'Wired CCTV',
    unit: '₹ / unit',
    description: 'Built-in 8-port PoE switch for 8 IP digital cameras.'
  },
  {
    id: 'nvr16Channel',
    name: '16 Channel PoE Network Video Recorder (NVR)',
    category: 'recorder',
    categoryLabel: 'Recorders (DVR/NVR)',
    architecture: 'Wired CCTV',
    unit: '₹ / unit',
    description: 'Enterprise 16-channel PoE NVR supporting 4K Ultra HD resolution.'
  },

  // 3. STORAGE (6)
  {
    id: 'hdd500GB',
    name: '500 GB Surveillance Hard Disk Drive (HDD)',
    category: 'storage',
    categoryLabel: 'Surveillance Storage',
    architecture: 'Wired CCTV',
    unit: '₹ / drive',
    description: 'Specialized 24/7 continuous surveillance grade hard disk (~5-7 days for 4 cams).'
  },
  {
    id: 'hdd1TB',
    name: '1 TB Surveillance Hard Disk Drive (HDD)',
    category: 'storage',
    categoryLabel: 'Surveillance Storage',
    architecture: 'Wired CCTV',
    unit: '₹ / drive',
    description: 'Most popular 24/7 surveillance hard disk (~12-15 days for 4 cams).',
    badge: 'Popular'
  },
  {
    id: 'hdd2TB',
    name: '2 TB Surveillance Hard Disk Drive (HDD)',
    category: 'storage',
    categoryLabel: 'Surveillance Storage',
    architecture: 'Wired CCTV',
    unit: '₹ / drive',
    description: 'Extended storage for ~25-30 days continuous recording.'
  },
  {
    id: 'hdd4TB',
    name: '4 TB Surveillance Hard Disk Drive (HDD)',
    category: 'storage',
    categoryLabel: 'Surveillance Storage',
    architecture: 'Wired CCTV',
    unit: '₹ / drive',
    description: 'Maximum capacity surveillance storage for ~50-60 days recording.'
  },
  {
    id: 'sdCard64GB',
    name: '64 GB High-Endurance MicroSD Card',
    category: 'storage',
    categoryLabel: 'Surveillance Storage',
    architecture: 'Wi-Fi / Solar',
    unit: '₹ / card',
    description: 'High-endurance video card for Wi-Fi & Solar cameras (~7-10 days motion recording).'
  },
  {
    id: 'sdCard128GB',
    name: '128 GB High-Endurance MicroSD Card',
    category: 'storage',
    categoryLabel: 'Surveillance Storage',
    architecture: 'Wi-Fi / Solar',
    unit: '₹ / card',
    description: 'Extended high-endurance card for Wi-Fi & Solar cameras (~15-20 days motion recording).'
  },

  // 4. POWER SUPPLIES (3)
  {
    id: 'powerSupply4Port',
    name: '4-Port SMPS Centralized Power Adapter',
    category: 'smps',
    categoryLabel: 'Power Supplies (SMPS)',
    architecture: 'Wired CCTV',
    unit: '₹ / unit',
    description: 'Stabilized 12V 4-Port power supply with short circuit protection for up to 4 cameras.'
  },
  {
    id: 'powerSupply8Port',
    name: '8-Port SMPS Centralized Power Adapter',
    category: 'smps',
    categoryLabel: 'Power Supplies (SMPS)',
    architecture: 'Wired CCTV',
    unit: '₹ / unit',
    description: 'Heavy-duty 12V 8-Port centralized power supply for up to 8 cameras.'
  },
  {
    id: 'powerSupply16Port',
    name: '16-Port SMPS Centralized Power Adapter',
    category: 'smps',
    categoryLabel: 'Power Supplies (SMPS)',
    architecture: 'Wired CCTV',
    unit: '₹ / unit',
    description: 'Industrial 12V 16-Port power unit with surge protection for up to 16 cameras.'
  },

  // 5. CABLING & USAGE (2)
  {
    id: 'cablePricePerMeter',
    name: '3+1 Pure Copper Surveillance Cable (Per Meter)',
    category: 'cable',
    categoryLabel: 'Cables & Usage Rates',
    architecture: 'Wired CCTV',
    unit: '₹ / meter',
    description: 'Solid copper 3+1 surveillance cable with fire-resistant PVC insulation.'
  },
  {
    id: 'defaultCableMetersPerCam',
    name: 'Default Estimated Cable Length per Camera',
    category: 'cable',
    categoryLabel: 'Cables & Usage Rates',
    architecture: 'Wired CCTV',
    unit: 'Meters / camera',
    description: 'Default estimated cable length assigned per camera point in customer estimator (e.g. 20m).'
  },

  // 6. CONNECTORS & HARDWARE ACCESSORIES (4)
  {
    id: 'modularBoxPerCam',
    name: 'Weatherproof PVC Modular Junction Box',
    category: 'accessory',
    categoryLabel: 'Hardware Accessories',
    architecture: 'Wired CCTV',
    unit: '₹ / camera',
    description: 'IP65 waterproof junction box protecting camera wires, BNC & DC joints from water and dust.'
  },
  {
    id: 'bncConnectorsPerCam',
    name: 'Heavy-Duty BNC Connectors + DC Pins Set',
    category: 'accessory',
    categoryLabel: 'Hardware Accessories',
    architecture: 'Wired CCTV',
    unit: '₹ / camera',
    description: 'Gold-plated BNC connectors & copper DC power pin pair per camera point.'
  },
  {
    id: 'rack2U',
    name: '2U Wall Mount Lockable CCTV Rack',
    category: 'accessory',
    categoryLabel: 'Hardware Accessories',
    architecture: 'Wired CCTV',
    unit: '₹ / unit',
    description: 'Sturdy steel wall cabinet with front glass door and key lock to secure DVR & wiring.'
  },
  {
    id: 'wifiRouter4G',
    name: '4G Wi-Fi SIM Router / Dongle',
    category: 'accessory',
    categoryLabel: 'Hardware Accessories',
    architecture: 'All Systems',
    unit: '₹ / unit',
    description: 'High-speed 4G SIM hotspot router providing Internet for mobile viewing if no broadband.'
  },

  // 7. INSTALLATION & SETUP SERVICES (3)
  {
    id: 'installationPerCamera',
    name: 'Certified Wired CCTV Installation & Wiring Labor',
    category: 'labor',
    categoryLabel: 'Certified Labor & Setup',
    architecture: 'Wired CCTV',
    unit: '₹ / camera',
    description: 'Professional drilling, conduit piping/cabling, camera mounting, DVR setup & mobile phone app configuration.'
  },
  {
    id: 'wifiFittingPerCamera',
    name: 'Wi-Fi Camera Wall Mounting & Phone Pairing Labor',
    category: 'labor',
    categoryLabel: 'Certified Labor & Setup',
    architecture: 'Wi-Fi 360°',
    unit: '₹ / camera',
    description: 'Wall mounting, electrical connection, Wi-Fi pairing & mobile app account setup.'
  },
  {
    id: 'solarFittingPerCamera',
    name: 'Solar 4G Pole Fitting, Solar Alignment & SIM Setup',
    category: 'labor',
    categoryLabel: 'Certified Labor & Setup',
    architecture: 'Solar 4G',
    unit: '₹ / camera',
    description: 'Heavy-duty pole/bracket mounting, solar angle alignment, 4G SIM testing & phone viewing setup.'
  }
];

export const AdminCctvPricing: React.FC = () => {
  const { cctvPricing, updateCctvPricing, resetCctvPricing } = useShop();

  const [formData, setFormData] = useState<CctvPricingConfig>({ 
    ...DEFAULT_CCTV_PRICING,
    ...(cctvPricing || {})
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<'wired' | 'wifi' | 'solar'>('wired');

  const handleInputChange = (field: keyof CctvPricingConfig, value: string) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setFormData(prev => ({ ...prev, [field]: num }));
  };

  const handleStepPrice = (field: keyof CctvPricingConfig, step: number) => {
    setFormData(prev => {
      const current = typeof prev[field] === 'number' ? (prev[field] as number) : 0;
      return { ...prev, [field]: Math.max(0, current + step) };
    });
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateCctvPricing(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    resetCctvPricing();
    setFormData({ ...DEFAULT_CCTV_PRICING });
    setShowResetConfirm(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Sample quick calculator previews
  // 1. Wired 4-Cam: 2 Dome + 2 Bullet + 4CH DVR + 1TB HDD + 4-Port SMPS + 80m Cable (20m*4) + 4 Modular Boxes + 4 BNC sets + Installation
  const sampleWiredCameras = (formData.hd2mpDome * 2) + (formData.hd2mpBullet * 2);
  const sampleWiredDvr = formData.dvr4Channel;
  const sampleWiredHdd = formData.hdd1TB;
  const sampleWiredSmps = formData.powerSupply4Port;
  const sampleWiredCableMeters = formData.defaultCableMetersPerCam * 4;
  const sampleWiredCableCost = sampleWiredCableMeters * formData.cablePricePerMeter;
  const sampleWiredBoxes = formData.modularBoxPerCam * 4;
  const sampleWiredBnc = formData.bncConnectorsPerCam * 4;
  const sampleWiredLabor = formData.installationPerCamera * 4;
  const sampleWiredTotal = sampleWiredCameras + sampleWiredDvr + sampleWiredHdd + sampleWiredSmps + sampleWiredCableCost + sampleWiredBoxes + sampleWiredBnc + sampleWiredLabor;

  // 2. WiFi 1-Cam: 1 WiFi 360 Camera + 64GB MicroSD + WiFi Setup
  const sampleWifiTotal = formData.wifi360Camera + formData.sdCard64GB + formData.wifiFittingPerCamera;

  // 3. Solar 4G 1-Cam: 1 Solar 4G Camera + 64GB MicroSD + Solar Pole Mounting
  const sampleSolarTotal = formData.solar4gCamera + formData.sdCard64GB + formData.solarFittingPerCamera;

  // Filter products by category and search
  const filteredCatalog = useMemo(() => {
    return ESTIMATOR_CATALOG.filter(item => {
      const matchesCategory = 
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = 
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.architecture.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Products (33)' },
    { id: 'camera', label: 'Cameras (9)' },
    { id: 'recorder', label: 'Recorders DVR/NVR (6)' },
    { id: 'storage', label: 'Storage HDD & SD (6)' },
    { id: 'smps', label: 'Power Supplies (3)' },
    { id: 'cable', label: 'Cables & Usage (2)' },
    { id: 'accessory', label: 'Accessories & Racks (4)' },
    { id: 'labor', label: 'Installation Labor (3)' }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'camera': return <Video size={16} color="#2563eb" />;
      case 'recorder': return <Server size={16} color="#0284c7" />;
      case 'storage': return <HardDrive size={16} color="#d97706" />;
      case 'smps': return <Cable size={16} color="#16a34a" />;
      case 'cable': return <Cable size={16} color="#7c3aed" />;
      case 'accessory': return <Box size={16} color="#4f46e5" />;
      case 'labor': return <Wrench size={16} color="#059669" />;
      default: return <Sparkles size={16} color="#64748b" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                CCTV Estimator Products &amp; Pricing Catalog
              </h2>
              <span style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Lock size={12} color="#64748b" /> 33 Permanent Products (Non-Deletable)
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '3px 0 0 0' }}>
              These 33 products drive the live CCTV Cost Estimator algorithm. All products are protected and cannot be deleted. You can freely edit and add prices for every component.
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
            <span>Reset Factory Rates</span>
          </button>

          <button
            onClick={() => handleSave()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 24px',
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
            <span>{saveSuccess ? 'All Rates Saved!' : 'Save Estimator Rates'}</span>
          </button>
        </div>
      </div>

      {/* Non-Deletable Protection Notice Banner */}
      <div style={{
        background: '#f8fafc',
        border: '1.5px solid #cbd5e1',
        borderRadius: '14px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#334155',
        fontSize: '0.85rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={18} color="#04647a" />
        </div>
        <div style={{ flex: 1 }}>
          <strong style={{ color: '#0f172a' }}>System Protection Policy:</strong> Every product in this table is permanently linked to the customer-facing cost estimator. Items cannot be deleted by accident to protect system calculation stability. You have full control over the <strong>price and unit rate</strong> of every single item.
        </div>
      </div>

      {/* Live Estimator Multi-Tab Preview Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #024b86 0%, #03667c 100%)',
        borderRadius: '18px',
        padding: '20px 24px',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 8px 24px rgba(2, 75, 134, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#fde047" />
            <span style={{ fontSize: '0.78rem', color: '#fde047', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Customer Estimator Preview (Recalculates as you edit prices)
            </span>
          </div>

          {/* Architecture Switcher Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'wired' as const, label: 'Wired 4-Cam Setup', icon: Video },
              { id: 'wifi' as const, label: 'Wi-Fi 360° Setup', icon: Wifi },
              { id: 'solar' as const, label: 'Solar 4G Setup', icon: Sun },
            ].map(tab => {
              const Icon = tab.icon;
              const isSel = previewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPreviewTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: isSel ? '1px solid #fde047' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: isSel ? '#fde047' : 'rgba(255, 255, 255, 0.1)',
                    color: isSel ? '#0f172a' : '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Detail & Price */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'rgba(0, 0, 0, 0.15)',
          padding: '14px 18px',
          borderRadius: '12px'
        }}>
          <div>
            {previewTab === 'wired' && (
              <>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  Wired System (2 Dome + 2 Bullet + 4CH DVR + 1TB HDD + SMPS + 80m Cable + 4 Boxes + Connectors + Setup)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '4px' }}>
                  Cable: {sampleWiredCableMeters}m @ ₹{formData.cablePricePerMeter}/m = ₹{sampleWiredCableCost} • Modular Boxes: ₹{sampleWiredBoxes} • BNC Sets: ₹{sampleWiredBnc} • Labor: ₹{sampleWiredLabor}
                </div>
              </>
            )}
            {previewTab === 'wifi' && (
              <>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  Smart Wi-Fi Setup (1x WiFi 360° PTZ Camera + 64GB MicroSD Card + Doorstep Wall Mounting &amp; App Setup)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '4px' }}>
                  Camera: ₹{formData.wifi360Camera} • 64GB MicroSD: ₹{formData.sdCard64GB} • Fitting: ₹{formData.wifiFittingPerCamera}
                </div>
              </>
            )}
            {previewTab === 'solar' && (
              <>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  Solar 4G Setup (1x Standalone Solar 4G Camera + 64GB MicroSD + Pole Mounting &amp; Angle Setup)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '4px' }}>
                  Solar 4G Unit: ₹{formData.solar4gCamera} • 64GB MicroSD: ₹{formData.sdCard64GB} • Pole Mounting: ₹{formData.solarFittingPerCamera}
                </div>
              </>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 700 }}>
              Calculated Customer Quote
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fde047', letterSpacing: '-0.02em' }}>
              ₹{(
                previewTab === 'wired' ? sampleWiredTotal :
                previewTab === 'wifi' ? sampleWifiTotal :
                sampleSolarTotal
              ).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px' }} />
            <input
              type="text"
              placeholder="Search any estimator product (e.g. Dome, Bullet, DVR, NVR, 1TB, Cable, MicroSD, Solar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '42px' }}
            />
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
            Showing {filteredCatalog.length} of {ESTIMATOR_CATALOG.length} items
          </div>
        </div>

        {/* Category filter tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {categories.map(cat => {
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: isSel ? '1.5px solid #04647a' : '1px solid #cbd5e1',
                  background: isSel ? '#04647a' : '#ffffff',
                  color: isSel ? '#ffffff' : '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 33 Estimator Products Table / Grid View */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 2fr) minmax(130px, 1fr) minmax(140px, 1fr) minmax(220px, 1.5fr)',
          gap: '16px',
          padding: '14px 20px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontWeight: 800,
          fontSize: '0.78rem',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          <div>Product Name &amp; Description</div>
          <div>Category</div>
          <div>System Architecture</div>
          <div style={{ textAlign: 'right' }}>Unit Price / Rate (₹)</div>
        </div>

        {/* Table Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredCatalog.map((item, index) => {
            const currentValue = formData[item.id] !== undefined ? formData[item.id] : 0;
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(280px, 2fr) minmax(130px, 1fr) minmax(140px, 1fr) minmax(220px, 1.5fr)',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: isEven ? '#ffffff' : '#fcfcfd',
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.15s ease'
                }}
              >
                {/* 1. Name & Description */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {getCategoryIcon(item.category)}
                    </div>
                    <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                      {item.name}
                    </span>
                    {item.badge && (
                      <span style={{
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        background: '#fef08a',
                        color: '#854d0e',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px', lineHeight: 1.3 }}>
                    {item.description}
                  </div>
                </div>

                {/* 2. Category & Non-Deletable Lock */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    {item.categoryLabel}
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.68rem',
                    color: '#059669',
                    fontWeight: 700,
                    marginTop: '2px'
                  }}>
                    <Lock size={11} color="#059669" />
                    <span>Non-Deletable</span>
                  </div>
                </div>

                {/* 3. System Architecture */}
                <div>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 
                      item.architecture === 'Wired CCTV' ? '#eff6ff' :
                      item.architecture === 'Wi-Fi 360°' ? '#f0fdfa' :
                      item.architecture === 'Solar 4G' ? '#fffbeb' : '#f8fafc',
                    color: 
                      item.architecture === 'Wired CCTV' ? '#1e40af' :
                      item.architecture === 'Wi-Fi 360°' ? '#0f766e' :
                      item.architecture === 'Solar 4G' ? '#b45309' : '#475569',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    {item.architecture}
                  </span>
                </div>

                {/* 4. Price Input (Directly Editable by Admin, NO DELETE BUTTON) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                  <div style={{ textAlign: 'right', marginRight: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                      {item.unit}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    width: '180px'
                  }}>
                    <button
                      type="button"
                      onClick={() => handleStepPrice(item.id, item.id === 'cablePricePerMeter' ? -5 : item.id === 'defaultCableMetersPerCam' ? -5 : -50)}
                      title="Decrease by ₹50"
                      style={{
                        padding: '8px 10px',
                        background: '#ffffff',
                        border: 'none',
                        borderRight: '1px solid #e2e8f0',
                        color: '#475569',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Minus size={13} />
                    </button>

                    <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                      <span style={{ position: 'absolute', left: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>
                        {item.id === 'defaultCableMetersPerCam' ? '' : '₹'}
                      </span>
                      <input
                        type="number"
                        value={currentValue}
                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          padding: item.id === 'defaultCableMetersPerCam' ? '8px 8px' : '8px 8px 8px 22px',
                          fontSize: '0.92rem',
                          fontWeight: 800,
                          color: '#0f172a',
                          textAlign: 'right',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStepPrice(item.id, item.id === 'cablePricePerMeter' ? 5 : item.id === 'defaultCableMetersPerCam' ? 5 : 50)}
                      title="Increase by ₹50"
                      style={{
                        padding: '8px 10px',
                        background: '#ffffff',
                        border: 'none',
                        borderLeft: '1px solid #e2e8f0',
                        color: '#475569',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px 24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          🔒 <strong>Reminder:</strong> None of these 33 components can be deleted. Once you click <strong>Save Rates</strong>, all prices immediately take effect on the customer estimator.
        </div>

        <button
          onClick={() => handleSave()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 32px',
            borderRadius: '10px',
            border: 'none',
            background: saveSuccess ? '#16a34a' : '#1d4ed8',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.94rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(29, 78, 216, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          {saveSuccess ? <Check size={18} /> : <Save size={18} />}
          <span>{saveSuccess ? 'All 33 Estimator Rates Saved Successfully!' : 'Save All Pricing Changes'}</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={confirmReset}
        title="Reset CCTV Estimator Rates"
        subtitle="Reset all CCTV camera, DVR/NVR, hard disk, and labor rates back to official factory default pricing?"
        warningNote="All customized camera hardware and installation fee modifications will be reset to defaults."
        confirmLabel="Yes, Reset Rates"
        cancelLabel="Cancel"
      />
    </div>
  );
};
