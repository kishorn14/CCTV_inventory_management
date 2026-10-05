import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Check, 
  MessageCircle, 
  Plus, 
  Minus, 
  PhoneCall,
  Wifi,
  Sun,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink, formatEstimateMessage } from '../utils/whatsapp';
import { sendLeadToGoogleSheets } from '../utils/googleSheets';
import { CctvPricingConfig, DEFAULT_CCTV_PRICING } from '../types';

export type SystemArchitecture = 'wired' | 'wifi' | 'solar';
export type WiredCameraTech = 'hd_2mp' | 'hd_5mp' | 'ip_2mp' | 'ip_4mp_colorvu';
export type RecorderChannelType = '4ch' | '8ch' | '16ch';
export type HddCapacityType = '500gb' | '1tb' | '2tb' | '4tb';
export type SdCardCapacityType = 'none' | '64gb' | '128gb';

interface CctvEstimatorViewProps {
  embedded?: boolean;
  onClose?: () => void;
}

export const CctvEstimatorView: React.FC<CctvEstimatorViewProps> = ({ embedded = false, onClose }) => {
  const { shopInfo, cctvPricing: rawPricing } = useShop();

  // Ensure all pricing keys have robust fallbacks
  const pricing: CctvPricingConfig = {
    ...DEFAULT_CCTV_PRICING,
    ...(rawPricing || {})
  };

  // 1. Architecture Selection
  const [architecture, setArchitecture] = useState<SystemArchitecture>('wired');

  // 2. Premises Type
  const [premisesType, setPremisesType] = useState<string>('Home / Residential Villa');

  // 3. Wired System States
  const [wiredTech, setWiredTech] = useState<WiredCameraTech>('hd_2mp');
  const [indoorCount, setIndoorCount] = useState<number>(2);
  const [outdoorCount, setOutdoorCount] = useState<number>(2);
  const [customChannel, setCustomChannel] = useState<RecorderChannelType | null>(null);
  const [hddCapacity, setHddCapacity] = useState<HddCapacityType>('1tb');
  const [customCableMeters, setCustomCableMeters] = useState<number | null>(null);
  const [includeCabling, setIncludeCabling] = useState<boolean>(true);
  const [includeModularBoxes, setIncludeModularBoxes] = useState<boolean>(true);
  const [includeBncConnectors, setIncludeBncConnectors] = useState<boolean>(true);
  const [include2uRack, setInclude2uRack] = useState<boolean>(false);
  const [includeWiredWifiRouter, setIncludeWiredWifiRouter] = useState<boolean>(false);
  const [includeWiredInstallation, setIncludeWiredInstallation] = useState<boolean>(true);

  // 4. Wi-Fi System States
  const [wifiCameraCount, setWifiCameraCount] = useState<number>(1);
  const [wifiSdCard, setWifiSdCard] = useState<SdCardCapacityType>('64gb');
  const [includeWifiRouter, setIncludeWifiRouter] = useState<boolean>(false);
  const [includeWifiFitting, setIncludeWifiFitting] = useState<boolean>(true);

  // 5. Solar 4G System States
  const [solarCameraCount, setSolarCameraCount] = useState<number>(1);
  const [solarSdCard, setSolarSdCard] = useState<SdCardCapacityType>('64gb');
  const [includeSolarFitting, setIncludeSolarFitting] = useState<boolean>(true);

  // UI accordion for bill breakdown
  const [showBillDetails, setShowBillDetails] = useState<boolean>(true);

  // ==========================================
  // CALCULATIONS FOR WIRED SYSTEM
  // ==========================================
  const totalWiredCameras = indoorCount + outdoorCount;
  const isIpSystem = wiredTech === 'ip_2mp' || wiredTech === 'ip_4mp_colorvu';

  // Camera Unit Rates
  const getWiredCameraUnitPrice = (isOutdoor: boolean): number => {
    switch (wiredTech) {
      case 'hd_2mp':
        return isOutdoor ? pricing.hd2mpBullet : pricing.hd2mpDome;
      case 'hd_5mp':
        return isOutdoor ? pricing.hd5mpBullet : pricing.hd5mpDome;
      case 'ip_2mp':
        return isOutdoor ? pricing.ip2mpBullet : pricing.ip2mpDome;
      case 'ip_4mp_colorvu':
        return pricing.ip4mpColorVu;
      default:
        return pricing.hd2mpDome;
    }
  };

  const indoorRate = getWiredCameraUnitPrice(false);
  const outdoorRate = getWiredCameraUnitPrice(true);
  const wiredCamerasCost = (indoorCount * indoorRate) + (outdoorCount * outdoorRate);

  // Channel Recommendation & DVR/NVR Cost
  const recommendedChannel: RecorderChannelType = 
    totalWiredCameras <= 4 ? '4ch' : totalWiredCameras <= 8 ? '8ch' : '16ch';
  const activeChannel = customChannel || recommendedChannel;

  const getRecorderPrice = (): number => {
    if (isIpSystem) {
      if (activeChannel === '4ch') return pricing.nvr4Channel;
      if (activeChannel === '8ch') return pricing.nvr8Channel;
      return pricing.nvr16Channel;
    } else {
      if (activeChannel === '4ch') return pricing.dvr4Channel;
      if (activeChannel === '8ch') return pricing.dvr8Channel;
      return pricing.dvr16Channel;
    }
  };
  const recorderCost = getRecorderPrice();

  // HDD Storage Cost
  const getHddPrice = (): number => {
    switch (hddCapacity) {
      case '500gb': return pricing.hdd500GB;
      case '1tb': return pricing.hdd1TB;
      case '2tb': return pricing.hdd2TB;
      case '4tb': return pricing.hdd4TB;
      default: return pricing.hdd1TB;
    }
  };
  const hddCost = getHddPrice();

  // SMPS Power Supply Cost (IP PoE uses NVR built-in PoE power, so ₹0)
  const getSmpsPrice = (): number => {
    if (isIpSystem) return 0;
    if (activeChannel === '4ch') return pricing.powerSupply4Port;
    if (activeChannel === '8ch') return pricing.powerSupply8Port;
    return pricing.powerSupply16Port;
  };
  const smpsCost = getSmpsPrice();

  // Cabling Cost based on per-meter rate
  const defaultMeters = totalWiredCameras * (pricing.defaultCableMetersPerCam || 20);
  const cableMeters = customCableMeters !== null ? customCableMeters : defaultMeters;
  const cableCost = includeCabling ? cableMeters * (pricing.cablePricePerMeter || 25) : 0;

  // Accessories Cost
  const modularBoxesCost = includeModularBoxes ? totalWiredCameras * (pricing.modularBoxPerCam || 120) : 0;
  const bncCost = includeBncConnectors ? totalWiredCameras * (pricing.bncConnectorsPerCam || 90) : 0;
  const rackCost = include2uRack ? (pricing.rack2U || 1450) : 0;
  const wiredRouterCost = includeWiredWifiRouter ? (pricing.wifiRouter4G || 2100) : 0;
  const wiredInstallationCost = includeWiredInstallation ? totalWiredCameras * (pricing.installationPerCamera || 450) : 0;

  const wiredGrandTotal = wiredCamerasCost + recorderCost + hddCost + smpsCost + cableCost + modularBoxesCost + bncCost + rackCost + wiredRouterCost + wiredInstallationCost;

  // ==========================================
  // CALCULATIONS FOR WI-FI SMART SYSTEM
  // ==========================================
  const wifiCameraCost = wifiCameraCount * (pricing.wifi360Camera || 2199);
  const wifiSdCardCost = 
    wifiSdCard === '64gb' ? wifiCameraCount * (pricing.sdCard64GB || 550) :
    wifiSdCard === '128gb' ? wifiCameraCount * (pricing.sdCard128GB || 950) : 0;
  const wifiRouterCost = includeWifiRouter ? (pricing.wifiRouter4G || 2100) : 0;
  const wifiFittingCost = includeWifiFitting ? wifiCameraCount * (pricing.wifiFittingPerCamera || 350) : 0;

  const wifiGrandTotal = wifiCameraCost + wifiSdCardCost + wifiRouterCost + wifiFittingCost;

  // ==========================================
  // CALCULATIONS FOR SOLAR 4G SYSTEM
  // ==========================================
  const solarCameraCost = solarCameraCount * (pricing.solar4gCamera || 5800);
  const solarSdCardCost = 
    solarSdCard === '64gb' ? solarCameraCount * (pricing.sdCard64GB || 550) :
    solarSdCard === '128gb' ? solarCameraCount * (pricing.sdCard128GB || 950) : 0;
  const solarFittingCost = includeSolarFitting ? solarCameraCount * (pricing.solarFittingPerCamera || 650) : 0;

  const solarGrandTotal = solarCameraCost + solarSdCardCost + solarFittingCost;

  // Active Total according to architecture
  const activeGrandTotal = 
    architecture === 'wired' ? wiredGrandTotal :
    architecture === 'wifi' ? wifiGrandTotal :
    solarGrandTotal;

  // Options definitions
  const wiredTechList = [
    {
      id: 'hd_2mp' as WiredCameraTech,
      name: 'HD 2MP (1080p)',
      desc: 'Crystal HD night vision with infrared LEDs. Best value for homes & shops.',
      badge: 'Most Popular',
      recorderLabel: 'HD DVR'
    },
    {
      id: 'hd_5mp' as WiredCameraTech,
      name: 'HD 5MP Super-HD',
      desc: 'Extra-crisp clarity for fine vehicle number plates & cash counters.',
      badge: 'Sharp Detail',
      recorderLabel: 'HD 5MP DVR'
    },
    {
      id: 'ip_2mp' as WiredCameraTech,
      name: 'IP 2MP PoE Smart',
      desc: 'Network digital cameras with two-way audio & direct PoE cable power.',
      badge: 'Smart IP PoE',
      recorderLabel: 'PoE NVR'
    },
    {
      id: 'ip_4mp_colorvu' as WiredCameraTech,
      name: 'IP 4MP ColorVu (24/7 Color)',
      desc: 'Full-color night vision even in total pitch darkness with smart AI human alerts.',
      badge: 'Ultra Night Color',
      recorderLabel: '4K PoE NVR'
    }
  ];

  const hddOptions = [
    { id: '500gb' as HddCapacityType, label: '500 GB', days: '~5 to 7 Days Recording', price: pricing.hdd500GB },
    { id: '1tb' as HddCapacityType, label: '1 TB (Surveillance)', days: '~12 to 15 Days Recording', price: pricing.hdd1TB, popular: true },
    { id: '2tb' as HddCapacityType, label: '2 TB (Surveillance)', days: '~25 to 30 Days Recording', price: pricing.hdd2TB },
    { id: '4tb' as HddCapacityType, label: '4 TB (Surveillance)', days: '~50 to 60 Days Recording', price: pricing.hdd4TB }
  ];

  // Send Custom Quotation to WhatsApp
  const handleSendWhatsApp = () => {
    let details: string[] = [];
    let systemTitle = '';

    if (architecture === 'wired') {
      const selectedTechObj = wiredTechList.find(t => t.id === wiredTech);
      const techName = selectedTechObj?.name || 'HD 2MP';
      const recorderName = `${activeChannel.toUpperCase()} ${isIpSystem ? 'PoE NVR' : 'HD DVR'} Hub`;
      const selectedHddObj = hddOptions.find(h => h.id === hddCapacity);

      systemTitle = `Wired CCTV System (${totalWiredCameras} Cameras)`;
      details = [
        `Architecture: Wired ${techName}`,
        `Premises Type: ${premisesType}`,
        `Indoor Dome: ${indoorCount} Unit(s) @ ₹${indoorRate} = ₹${(indoorCount * indoorRate).toLocaleString('en-IN')}`,
        `Outdoor Bullet: ${outdoorCount} Unit(s) @ ₹${outdoorRate} = ₹${(outdoorCount * outdoorRate).toLocaleString('en-IN')}`,
        `Digital Recorder: ${recorderName} (₹${recorderCost.toLocaleString('en-IN')})`,
        `Storage (HDD): ${selectedHddObj?.label} (${selectedHddObj?.days}) - ₹${hddCost.toLocaleString('en-IN')}`,
        ...(isIpSystem ? [`PoE Switch: Built-in NVR PoE Power Supply Included`] : [`SMPS Power Supply: ${activeChannel.toUpperCase()} Multi-Port Adapter - ₹${smpsCost.toLocaleString('en-IN')}`]),
        `Cabling: ${includeCabling ? `${cableMeters}m 3+1 Pure Copper Cable (@ ₹${pricing.cablePricePerMeter}/m) = ₹${cableCost.toLocaleString('en-IN')}` : 'Self Arranged Cable'}`,
        `Modular Boxes: ${includeModularBoxes ? `${totalWiredCameras} Weatherproof PVC Boxes (@ ₹${pricing.modularBoxPerCam}) = ₹${modularBoxesCost.toLocaleString('en-IN')}` : 'Excluded'}`,
        `BNC / DC Connectors: ${includeBncConnectors ? `${totalWiredCameras} Sets (@ ₹${pricing.bncConnectorsPerCam}) = ₹${bncCost.toLocaleString('en-IN')}` : 'Excluded'}`,
        ...(include2uRack ? [`2U CCTV Wall Mount Metal Rack: Included (₹${rackCost.toLocaleString('en-IN')})`] : []),
        ...(includeWiredWifiRouter ? [`4G Wi-Fi SIM Router: Included (₹${wiredRouterCost.toLocaleString('en-IN')})`] : []),
        `Installation & Wiring: ${includeWiredInstallation ? `${totalWiredCameras} Point(s) Professional Conduit Fitting - ₹${wiredInstallationCost.toLocaleString('en-IN')}` : 'Self Installation / Equipment Only'}`,
        `Estimated Setup Total: ₹${activeGrandTotal.toLocaleString('en-IN')}`,
        `Official Warranty: 2 Years Brand Warranty on Cameras & DVR/NVR`
      ];
    } else if (architecture === 'wifi') {
      systemTitle = `Smart Wi-Fi CCTV Setup (${wifiCameraCount} Camera${wifiCameraCount > 1 ? 's' : ''})`;
      details = [
        `Architecture: Wireless Smart Wi-Fi 360° PTZ`,
        `Premises Type: ${premisesType}`,
        `Wi-Fi Cameras: ${wifiCameraCount} Unit(s) @ ₹${pricing.wifi360Camera} = ₹${wifiCameraCost.toLocaleString('en-IN')}`,
        `Local Storage: ${wifiSdCard === 'none' ? 'No SD Card Selected' : `${wifiSdCard.toUpperCase()} MicroSD (${wifiCameraCount} card${wifiCameraCount > 1 ? 's' : ''}) - ₹${wifiSdCardCost.toLocaleString('en-IN')}`}`,
        ...(includeWifiRouter ? [`4G Wi-Fi Router: Included (₹${wifiRouterCost.toLocaleString('en-IN')})`] : []),
        `Doorstep Installation: ${includeWifiFitting ? `Wall Mounting & Phone App Setup (₹${wifiFittingCost.toLocaleString('en-IN')})` : 'Self-Fit'}`,
        `Estimated Setup Total: ₹${activeGrandTotal.toLocaleString('en-IN')}`,
        `Key Features: 360° Pan/Tilt, 2-Way Audio, Motion Siren, Instant Phone Alerts`
      ];
    } else {
      systemTitle = `Solar 4G CCTV Setup (${solarCameraCount} Camera${solarCameraCount > 1 ? 's' : ''})`;
      details = [
        `Architecture: 100% Wire-Free Standalone Solar 4G Camera`,
        `Premises Type: ${premisesType}`,
        `Solar 4G Cameras: ${solarCameraCount} Unit(s) @ ₹${pricing.solar4gCamera} = ₹${solarCameraCost.toLocaleString('en-IN')}`,
        `Storage: ${solarSdCard === 'none' ? 'No SD Card Selected' : `${solarSdCard.toUpperCase()} MicroSD (${solarCameraCount} card${solarCameraCount > 1 ? 's' : ''}) - ₹${solarSdCardCost.toLocaleString('en-IN')}`}`,
        `Pole Mounting & Setup: ${includeSolarFitting ? `Professional Pole Fitting & Angle Setup (₹${solarFittingCost.toLocaleString('en-IN')})` : 'Self Installation'}`,
        `Estimated Setup Total: ₹${activeGrandTotal.toLocaleString('en-IN')}`,
        `Key Features: Solar Powered, 4G SIM Slot, Zero Electricity Needed, Continuous Battery Backup`
      ];
    }

    const message = formatEstimateMessage(systemTitle, details);

    // Record lead to Google Sheets
    sendLeadToGoogleSheets(shopInfo.googleSheetWebhookUrl, {
      customerName: 'Website Cost Estimator',
      phoneNumber: 'Via WhatsApp Quote',
      address: premisesType,
      category: 'CCTV Security',
      serviceType: systemTitle,
      preferredTime: 'Immediate Quotation',
      notes: `Architecture: ${architecture.toUpperCase()} | Total: ₹${activeGrandTotal.toLocaleString('en-IN')}`,
      source: 'CCTV Package Cost Estimator',
      status: 'Pending ⏳'
    });

    window.open(createWhatsAppLink(message, shopInfo.whatsappPhone), '_blank');
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: embedded ? '24px' : '20px',
      border: '1px solid #e2e8f0',
      boxShadow: embedded ? '0 12px 40px rgba(15, 23, 42, 0.08)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: embedded ? '1060px' : '960px',
      margin: '0 auto'
    }}>
      {/* Header Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #04647a 0%, #034858 100%)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(4, 100, 122, 0.4)'
          }}>
            <Video size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
                CCTV Package Cost Estimator
              </h2>
              <span style={{
                background: 'rgba(234, 179, 8, 0.2)',
                border: '1px solid #eab308',
                color: '#fde047',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Instant Live Quote
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Calculate exact transparent costs for Wired DVR/NVR, Smart Wi-Fi, or Solar 4G systems.
            </p>
          </div>
        </div>

        {!embedded && onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main Content Body */}
      <div style={{
        padding: embedded ? '26px 28px' : '22px 24px',
        maxHeight: embedded ? 'none' : 'calc(88vh - 160px)',
        overflowY: embedded ? 'visible' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        background: '#f8fafc'
      }}>
        {/* 1. PRIMARY ARCHITECTURE SELECTOR */}
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
            Select Camera System Type
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px'
          }}>
            {[
              {
                id: 'wired' as SystemArchitecture,
                title: 'Wired CCTV System',
                desc: 'Multi-camera setup with DVR/NVR & continuous 24×7 HDD recording.',
                badge: 'Complete Property Security',
                icon: Video
              },
              {
                id: 'wifi' as SystemArchitecture,
                title: 'Wi-Fi Smart Cameras',
                desc: 'Wireless motorized camera with mobile app rotation, siren & SD card.',
                badge: 'Plug & Play Wireless',
                icon: Wifi
              },
              {
                id: 'solar' as SystemArchitecture,
                title: 'Solar 4G Cameras',
                desc: '100% Wire-free with solar panel, battery & 4G SIM. No Wi-Fi or wires needed.',
                badge: 'Off-Grid & Farmlands',
                icon: Sun
              }
            ].map(arch => {
              const Icon = arch.icon;
              const isSelected = architecture === arch.id;
              return (
                <div
                  key={arch.id}
                  onClick={() => setArchitecture(arch.id)}
                  style={{
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    border: isSelected ? '2px solid #04647a' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 16px rgba(4, 100, 122, 0.15)' : '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isSelected ? '#04647a' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#04647a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      background: isSelected ? '#04647a' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#64748b',
                      letterSpacing: '0.03em'
                    }}>
                      {arch.badge}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                      {arch.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                      {arch.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. PREMISES / INSTALLATION LOCATION */}
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
            Premises / Installation Location
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              'Home / Residential Villa',
              'Retail Shop / Supermarket',
              'Office & Workplace',
              'Factory / Warehouse',
              'Farmland / Construction Site',
              'Apartment / Society'
            ].map(type => {
              const isSelected = premisesType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPremisesType(type)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: isSelected ? '1.5px solid #04647a' : '1px solid #cbd5e1',
                    background: isSelected ? '#04647a' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(4, 100, 122, 0.2)' : 'none'
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ARCHITECTURE 1: WIRED CCTV SYSTEM CONFIGURATION           */}
        {/* ========================================================= */}
        {architecture === 'wired' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Step A: Camera Technology Selection */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Select Camera Technology &amp; Resolution
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px'
              }}>
                {wiredTechList.map(tech => {
                  const isSel = wiredTech === tech.id;
                  const domeRate = tech.id === 'hd_2mp' ? pricing.hd2mpDome : tech.id === 'hd_5mp' ? pricing.hd5mpDome : tech.id === 'ip_2mp' ? pricing.ip2mpDome : pricing.ip4mpColorVu;
                  return (
                    <div
                      key={tech.id}
                      onClick={() => setWiredTech(tech.id)}
                      style={{
                        background: isSel ? '#eff6ff' : '#ffffff',
                        border: isSel ? '2px solid #04647a' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSel ? '0 2px 10px rgba(4, 100, 122, 0.12)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: isSel ? '#04647a' : '#64748b' }}>
                            {tech.badge}
                          </span>
                          {isSel && <Check size={14} color="#04647a" strokeWidth={3} />}
                        </div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                          {tech.name}
                        </div>
                        <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.3 }}>
                          {tech.desc}
                        </p>
                      </div>

                      <div style={{
                        paddingTop: '8px',
                        borderTop: '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#04647a',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>Starts from</span>
                        <span>₹{domeRate.toLocaleString('en-IN')}/cam</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step B: Indoor & Outdoor Camera Counts */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '18px'
            }}>
              {/* Indoor Domes */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      Indoor Dome Cameras (Ceiling Mount)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      Discreet compact shape • ₹{indoorRate.toLocaleString('en-IN')} / camera
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    border: '1px solid #cbd5e1'
                  }}>
                    <button
                      type="button"
                      onClick={() => setIndoorCount(Math.max(0, indoorCount - 1))}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: '22px', textAlign: 'center', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                      {indoorCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIndoorCount(indoorCount + 1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: '#04647a',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Outdoor Bullets */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      Outdoor Bullet Cameras (Waterproof)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      IP66 rain &amp; sun protection • ₹{outdoorRate.toLocaleString('en-IN')} / camera
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    border: '1px solid #cbd5e1'
                  }}>
                    <button
                      type="button"
                      onClick={() => setOutdoorCount(Math.max(0, outdoorCount - 1))}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: '22px', textAlign: 'center', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                      {outdoorCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOutdoorCount(outdoorCount + 1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: '#04647a',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Cameras Summary Notice */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.84rem',
              color: '#1e40af',
              fontWeight: 700
            }}>
              <span>Total Cameras Selected: {totalWiredCameras} Units ({indoorCount} Indoor + {outdoorCount} Outdoor)</span>
              <span>Subtotal: ₹{wiredCamerasCost.toLocaleString('en-IN')}</span>
            </div>

            {/* Step C: DVR / NVR Channels Selection */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  Select {isIpSystem ? 'PoE NVR' : 'HD DVR'} Channels Hub
                </label>
                <span style={{ fontSize: '0.74rem', color: '#04647a', fontWeight: 700 }}>
                  Auto-recommended: {recommendedChannel.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { id: '4ch' as RecorderChannelType, label: '4 Channels', max: 'Up to 4 Cams', disabled: totalWiredCameras > 4 },
                  { id: '8ch' as RecorderChannelType, label: '8 Channels', max: 'Up to 8 Cams', disabled: totalWiredCameras > 8 },
                  { id: '16ch' as RecorderChannelType, label: '16 Channels', max: 'Up to 16 Cams', disabled: false }
                ].map(ch => {
                  const isSel = activeChannel === ch.id;
                  const price = isIpSystem 
                    ? (ch.id === '4ch' ? pricing.nvr4Channel : ch.id === '8ch' ? pricing.nvr8Channel : pricing.nvr16Channel)
                    : (ch.id === '4ch' ? pricing.dvr4Channel : ch.id === '8ch' ? pricing.dvr8Channel : pricing.dvr16Channel);
                  
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      disabled={ch.disabled}
                      onClick={() => setCustomChannel(ch.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSel ? '2px solid #04647a' : '1px solid #cbd5e1',
                        background: isSel ? '#eff6ff' : ch.disabled ? '#f1f5f9' : '#ffffff',
                        opacity: ch.disabled ? 0.5 : 1,
                        cursor: ch.disabled ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isSel ? '#04647a' : '#0f172a' }}>
                        {ch.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        {ch.max}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#04647a', marginTop: '4px' }}>
                        ₹{price.toLocaleString('en-IN')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step D: Hard Disk Storage Capacity */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Select 24×7 Surveillance Hard Disk Storage (HDD)
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px'
              }}>
                {hddOptions.map(hdd => {
                  const isSel = hddCapacity === hdd.id;
                  return (
                    <div
                      key={hdd.id}
                      onClick={() => setHddCapacity(hdd.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSel ? '2px solid #04647a' : '1px solid #cbd5e1',
                        background: isSel ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSel ? '0 2px 8px rgba(4, 100, 122, 0.12)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.94rem', fontWeight: 800, color: isSel ? '#04647a' : '#0f172a' }}>
                          {hdd.label}
                        </span>
                        {hdd.popular && (
                          <span style={{ fontSize: '0.66rem', background: '#fef08a', color: '#854d0e', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            Popular
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {hdd.days}
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#04647a', marginTop: '6px' }}>
                        ₹{hdd.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step E: Cabling Usage per Meter */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                    3+1 Pure Copper Surveillance Cable
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Solid copper video + power wire • Standard: ₹{pricing.cablePricePerMeter}/meter (Estimated {cableMeters}m for {totalWiredCameras} cameras)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setCustomCableMeters(Math.max(0, cableMeters - 10))}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', minWidth: '48px', textAlign: 'center' }}>
                    {cableMeters}m
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomCableMeters(cableMeters + 10)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: '#04647a',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={includeCabling}
                    onChange={(e) => setIncludeCabling(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#04647a' }}
                  />
                  <span>Include CCTV Cable in Quote</span>
                </label>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#04647a' }}>
                  {includeCabling ? `₹${cableCost.toLocaleString('en-IN')}` : 'Excluded (Self Arranged)'}
                </span>
              </div>
            </div>

            {/* Step F: Essential Connectors, Modular Boxes & Add-ons */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Hardware Accessories &amp; Wall Enclosures
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px'
              }}>
                {/* Modular Box */}
                <div
                  onClick={() => setIncludeModularBoxes(!includeModularBoxes)}
                  style={{
                    background: includeModularBoxes ? '#f0fdf4' : '#ffffff',
                    border: includeModularBoxes ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includeModularBoxes}
                    onChange={() => {}}
                    style={{ marginTop: '2px', accentColor: '#16a34a' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                      PVC Modular Boxes ({totalWiredCameras}x)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Weatherproof wire protection (₹{pricing.modularBoxPerCam}/cam)
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
                      +₹{modularBoxesCost.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* BNC Connectors */}
                <div
                  onClick={() => setIncludeBncConnectors(!includeBncConnectors)}
                  style={{
                    background: includeBncConnectors ? '#f0fdf4' : '#ffffff',
                    border: includeBncConnectors ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includeBncConnectors}
                    onChange={() => {}}
                    style={{ marginTop: '2px', accentColor: '#16a34a' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                      BNC &amp; DC Pins ({totalWiredCameras}x)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Heavy-duty gold connectors (₹{pricing.bncConnectorsPerCam}/cam)
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
                      +₹{bncCost.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* 2U Rack */}
                <div
                  onClick={() => setInclude2uRack(!include2uRack)}
                  style={{
                    background: include2uRack ? '#f0fdf4' : '#ffffff',
                    border: include2uRack ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={include2uRack}
                    onChange={() => {}}
                    style={{ marginTop: '2px', accentColor: '#16a34a' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                      2U Metal Wall Rack
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Lockable steel DVR rack
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
                      +₹{rackCost.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* 4G Wi-Fi Router */}
                <div
                  onClick={() => setIncludeWiredWifiRouter(!includeWiredWifiRouter)}
                  style={{
                    background: includeWiredWifiRouter ? '#f0fdf4' : '#ffffff',
                    border: includeWiredWifiRouter ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includeWiredWifiRouter}
                    onChange={() => {}}
                    style={{ marginTop: '2px', accentColor: '#16a34a' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                      4G Wi-Fi Router
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      For phone live view if no broadband
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
                      +₹{wiredRouterCost.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step G: Professional Installation */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  Certified Doorstep Installation &amp; Wiring
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Complete drilling, conduit cabling, DVR config &amp; phone app setup (₹{pricing.installationPerCamera}/camera)
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#04647a' }}>
                  {includeWiredInstallation ? `₹${wiredInstallationCost.toLocaleString('en-IN')}` : 'Self-Fit'}
                </span>
                <button
                  type="button"
                  onClick={() => setIncludeWiredInstallation(!includeWiredInstallation)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: includeWiredInstallation ? '1px solid #16a34a' : '1px solid #cbd5e1',
                    background: includeWiredInstallation ? '#f0fdf4' : '#ffffff',
                    color: includeWiredInstallation ? '#16a34a' : '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {includeWiredInstallation ? 'Included ✓' : 'Add Fitting'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ARCHITECTURE 2: WI-FI 360 SMART WIRELESS SYSTEM           */}
        {/* ========================================================= */}
        {architecture === 'wifi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Wi-Fi Info Callout */}
            <div style={{
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              borderRadius: '14px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#0f766e',
              fontSize: '0.84rem'
            }}>
              <Wifi size={24} color="#0d9488" style={{ flexShrink: 0 }} />
              <div>
                <strong>Smart Wireless Advantage:</strong> Plugs directly into any normal power socket. Connects wirelessly to your home/shop Wi-Fi. Features 360° motor rotation, two-way audio talk, siren &amp; MicroSD motion recording. No DVR or heavy cabling needed!
              </div>
            </div>

            {/* Camera Quantity */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  Wi-Fi 360° Smart PTZ Cameras
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Full 1080p / 3MP PTZ camera with night vision • ₹{(pricing.wifi360Camera || 2199).toLocaleString('en-IN')} / unit
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#04647a', marginTop: '4px' }}>
                  Subtotal: ₹{wifiCameraCost.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '4px 8px',
                border: '1px solid #cbd5e1'
              }}>
                <button
                  type="button"
                  onClick={() => setWifiCameraCount(Math.max(1, wifiCameraCount - 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                  {wifiCameraCount}
                </span>
                <button
                  type="button"
                  onClick={() => setWifiCameraCount(wifiCameraCount + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: '#04647a',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* MicroSD Storage Selection */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Select On-Device MicroSD Motion Recording Card
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px'
              }}>
                {[
                  { id: '64gb' as SdCardCapacityType, label: '64 GB MicroSD', days: '~7 to 10 Days Motion Recording', price: pricing.sdCard64GB || 550 },
                  { id: '128gb' as SdCardCapacityType, label: '128 GB MicroSD', days: '~15 to 20 Days Motion Recording', price: pricing.sdCard128GB || 950 },
                  { id: 'none' as SdCardCapacityType, label: 'No SD Card', days: 'I have my own card', price: 0 }
                ].map(sd => {
                  const isSel = wifiSdCard === sd.id;
                  const totalCardPrice = sd.price * wifiCameraCount;
                  return (
                    <div
                      key={sd.id}
                      onClick={() => setWifiSdCard(sd.id)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: isSel ? '2px solid #04647a' : '1px solid #cbd5e1',
                        background: isSel ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: isSel ? '#04647a' : '#0f172a' }}>
                        {sd.label}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        {sd.days}
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#04647a', marginTop: '6px' }}>
                        {sd.price === 0 ? 'Free / ₹0' : `₹${totalCardPrice.toLocaleString('en-IN')} (${wifiCameraCount}x)`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional Wi-Fi Router */}
            <div
              onClick={() => setIncludeWifiRouter(!includeWifiRouter)}
              style={{
                background: includeWifiRouter ? '#f0fdf4' : '#ffffff',
                border: includeWifiRouter ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                borderRadius: '14px',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={includeWifiRouter}
                  onChange={() => {}}
                  style={{ accentColor: '#16a34a', width: '16px', height: '16px' }}
                />
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                    Need a 4G Wi-Fi SIM Router?
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Select if you don't have home Wi-Fi/broadband. Just insert any Jio/Airtel 4G SIM.
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#16a34a' }}>
                +₹{(pricing.wifiRouter4G || 2100).toLocaleString('en-IN')}
              </div>
            </div>

            {/* Fitting & App Setup */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  Doorstep Wall Mounting &amp; Phone App Setup
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Wall mounting bracket installation, Wi-Fi pairing &amp; phone app setup (₹{pricing.wifiFittingPerCamera || 350}/camera)
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#04647a' }}>
                  {includeWifiFitting ? `₹${wifiFittingCost.toLocaleString('en-IN')}` : 'Self-Fit'}
                </span>
                <button
                  type="button"
                  onClick={() => setIncludeWifiFitting(!includeWifiFitting)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: includeWifiFitting ? '1px solid #16a34a' : '1px solid #cbd5e1',
                    background: includeWifiFitting ? '#f0fdf4' : '#ffffff',
                    color: includeWifiFitting ? '#16a34a' : '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {includeWifiFitting ? 'Included ✓' : 'Add Fitting'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ARCHITECTURE 3: SOLAR 4G WIRELESS SYSTEM                  */}
        {/* ========================================================= */}
        {architecture === 'solar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Solar Info Callout */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '14px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#92400e',
              fontSize: '0.84rem'
            }}>
              <Sun size={24} color="#d97706" style={{ flexShrink: 0 }} />
              <div>
                <strong>100% Off-Grid Security:</strong> Requires zero electricity wires, zero Wi-Fi, and zero DVR! Powered by integrated solar panel with built-in battery &amp; 4G SIM. Perfect for farmlands, remote villas, fish ponds &amp; construction plots.
              </div>
            </div>

            {/* Solar Camera Count */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '18px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                  Outdoor Solar 4G Standalone Bullet / PTZ Camera
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Includes 8W/12W Solar Panel + Rechargeable Lithium Battery + 4G SIM slot
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
                  ₹{(pricing.solar4gCamera || 5800).toLocaleString('en-IN')} / unit
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '4px 8px',
                border: '1px solid #cbd5e1'
              }}>
                <button
                  type="button"
                  onClick={() => setSolarCameraCount(Math.max(1, solarCameraCount - 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                  {solarCameraCount}
                </span>
                <button
                  type="button"
                  onClick={() => setSolarCameraCount(solarCameraCount + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: '#04647a',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* MicroSD Storage Selection */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Select On-Device MicroSD Motion Recording Card
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px'
              }}>
                {[
                  { id: '64gb' as SdCardCapacityType, label: '64 GB MicroSD', days: '~7 to 10 Days Motion Recording', price: pricing.sdCard64GB || 550 },
                  { id: '128gb' as SdCardCapacityType, label: '128 GB MicroSD', days: '~15 to 20 Days Motion Recording', price: pricing.sdCard128GB || 950 },
                  { id: 'none' as SdCardCapacityType, label: 'No SD Card', days: 'I have my own card', price: 0 }
                ].map(sd => {
                  const isSel = solarSdCard === sd.id;
                  const totalCardPrice = sd.price * solarCameraCount;
                  return (
                    <div
                      key={sd.id}
                      onClick={() => setSolarSdCard(sd.id)}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: isSel ? '2px solid #04647a' : '1px solid #cbd5e1',
                        background: isSel ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: isSel ? '#04647a' : '#0f172a' }}>
                        {sd.label}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        {sd.days}
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#04647a', marginTop: '6px' }}>
                        {sd.price === 0 ? 'Free / ₹0' : `₹${totalCardPrice.toLocaleString('en-IN')} (${solarCameraCount}x)`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Solar Pole Mounting & Angle Alignment */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  Heavy-Duty Pole Mounting &amp; Solar Alignment
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Pole clamps/brackets fitting, sunlight angle calibration &amp; 4G SIM mobile configuration (₹{pricing.solarFittingPerCamera || 650}/camera)
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#04647a' }}>
                  {includeSolarFitting ? `₹${solarFittingCost.toLocaleString('en-IN')}` : 'Self-Fit'}
                </span>
                <button
                  type="button"
                  onClick={() => setIncludeSolarFitting(!includeSolarFitting)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: includeSolarFitting ? '1px solid #16a34a' : '1px solid #cbd5e1',
                    background: includeSolarFitting ? '#f0fdf4' : '#ffffff',
                    color: includeSolarFitting ? '#16a34a' : '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {includeSolarFitting ? 'Included ✓' : 'Add Fitting'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ITEMIZED BILL BREAKDOWN ACCORDION                         */}
        {/* ========================================================= */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <button
            type="button"
            onClick={() => setShowBillDetails(!showBillDetails)}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '0.88rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#04647a" />
              <span>Transparent Itemized Component Breakdown</span>
            </div>
            {showBillDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showBillDetails && (
            <div style={{ padding: '16px 18px', fontSize: '0.82rem', color: '#475569' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {architecture === 'wired' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {indoorCount}x Indoor Dome ({wiredTech.toUpperCase()})</span>
                      <strong>₹{(indoorCount * indoorRate).toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {outdoorCount}x Outdoor Bullet ({wiredTech.toUpperCase()})</span>
                      <strong>₹{(outdoorCount * outdoorRate).toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {activeChannel.toUpperCase()} {isIpSystem ? 'PoE NVR' : 'HD DVR'} Central Hub</span>
                      <strong>₹{recorderCost.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• 24×7 Surveillance HDD ({hddCapacity.toUpperCase()})</span>
                      <strong>₹{hddCost.toLocaleString('en-IN')}</strong>
                    </div>
                    {!isIpSystem && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• Multi-Port SMPS Power Supply ({activeChannel.toUpperCase()})</span>
                        <strong>₹{smpsCost.toLocaleString('en-IN')}</strong>
                      </div>
                    )}
                    {isIpSystem && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• PoE Network Power (Integrated NVR Switch)</span>
                        <strong style={{ color: '#16a34a' }}>Included (₹0)</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {includeCabling ? `${cableMeters}m 3+1 Pure Copper Surveillance Cable (@ ₹${pricing.cablePricePerMeter}/m)` : 'Cabling (Excluded)'}</span>
                      <strong>{includeCabling ? `₹${cableCost.toLocaleString('en-IN')}` : '₹0'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {includeModularBoxes ? `${totalWiredCameras}x Weatherproof PVC Modular Junction Boxes` : 'Modular Boxes (Excluded)'}</span>
                      <strong>{includeModularBoxes ? `₹${modularBoxesCost.toLocaleString('en-IN')}` : '₹0'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {includeBncConnectors ? `${totalWiredCameras}x Heavy-Duty BNC & DC Pin Connectors` : 'BNC Connectors (Excluded)'}</span>
                      <strong>{includeBncConnectors ? `₹${bncCost.toLocaleString('en-IN')}` : '₹0'}</strong>
                    </div>
                    {include2uRack && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• 2U Lockable Metal CCTV Wall Rack</span>
                        <strong>₹{rackCost.toLocaleString('en-IN')}</strong>
                      </div>
                    )}
                    {includeWiredWifiRouter && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• 4G SIM Wi-Fi Router / Dongle</span>
                        <strong>₹{wiredRouterCost.toLocaleString('en-IN')}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {totalWiredCameras} Point(s) Certified Doorstep Installation</span>
                      <strong>{includeWiredInstallation ? `₹${wiredInstallationCost.toLocaleString('en-IN')}` : 'Self-Fit (₹0)'}</strong>
                    </div>
                  </>
                )}

                {architecture === 'wifi' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {wifiCameraCount}x Smart Wi-Fi 360° PTZ Wireless Camera</span>
                      <strong>₹{wifiCameraCost.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {wifiSdCard === 'none' ? 'No SD Card' : `${wifiSdCard.toUpperCase()} MicroSD Card (${wifiCameraCount}x)`}</span>
                      <strong>₹{wifiSdCardCost.toLocaleString('en-IN')}</strong>
                    </div>
                    {includeWifiRouter && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>• 4G SIM Wi-Fi Router</span>
                        <strong>₹{wifiRouterCost.toLocaleString('en-IN')}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• Doorstep Mounting &amp; Phone App Setup</span>
                      <strong>{includeWifiFitting ? `₹${wifiFittingCost.toLocaleString('en-IN')}` : 'Hardware Only'}</strong>
                    </div>
                  </>
                )}

                {architecture === 'solar' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {solarCameraCount}x Standalone Solar 4G Camera (Solar Panel + Battery + SIM Slot)</span>
                      <strong>₹{solarCameraCost.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• {solarSdCard === 'none' ? 'No SD Card' : `${solarSdCard.toUpperCase()} MicroSD Card (${solarCameraCount}x)`}</span>
                      <strong>₹{solarSdCardCost.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>• Heavy-Duty Pole Mounting &amp; Solar Setup</span>
                      <strong>{includeSolarFitting ? `₹${solarFittingCost.toLocaleString('en-IN')}` : 'Hardware Only'}</strong>
                    </div>
                  </>
                )}

                <div style={{
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px dashed #cbd5e1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  color: '#0f172a'
                }}>
                  <span>Total Calculated Estimate:</span>
                  <span style={{ color: '#04647a' }}>₹{activeGrandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Total & WhatsApp Action */}
      <div style={{
        padding: '18px 24px',
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        flexShrink: 0
      }}>
        <div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Estimated Setup Cost
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              ₹{activeGrandTotal.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700 }}>
              Includes GST &amp; Official Warranty
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSendWhatsApp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#22c55e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: '0.94rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = '#16a34a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = '#22c55e';
            }}
          >
            <MessageCircle size={18} />
            <span>Get Quote on WhatsApp</span>
          </button>

          <a
            href={`tel:${shopInfo.phone}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '0.92rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#94a3b8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
          >
            <PhoneCall size={16} />
            <span>Call Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};
