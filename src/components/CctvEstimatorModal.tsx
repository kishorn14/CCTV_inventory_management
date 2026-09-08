import React, { useState } from 'react';
import { 
  X, 
  Video, 
  HardDrive, 
  ShieldCheck, 
  Check, 
  MessageCircle, 
  Plus, 
  Minus, 
  Eye, 
  PhoneCall
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink, formatEstimateMessage } from '../utils/whatsapp';
import { sendLeadToGoogleSheets } from '../utils/googleSheets';

interface CctvEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type CameraTechType = 'hd_2mp' | 'hd_5mp' | 'ip_2mp' | 'ip_4mp_colorvu' | 'wifi_360';
export type RecorderChannelType = '4ch' | '8ch' | '16ch';
export type HddCapacityType = '500gb' | '1tb' | '2tb' | '4tb';

export const CctvEstimatorModal: React.FC<CctvEstimatorModalProps> = ({ isOpen, onClose }) => {
  const { shopInfo, cctvPricing } = useShop();

  // Selections
  const [cameraTech, setCameraTech] = useState<CameraTechType>('hd_2mp');
  const [indoorCount, setIndoorCount] = useState<number>(2);
  const [outdoorCount, setOutdoorCount] = useState<number>(2);
  const [customChannel, setCustomChannel] = useState<RecorderChannelType | null>(null);
  const [hddCapacity, setHddCapacity] = useState<HddCapacityType>('1tb');
  const [includeCabling, setIncludeCabling] = useState<boolean>(true);
  const [includeInstallation, setIncludeInstallation] = useState<boolean>(true);
  const [premisesType, setPremisesType] = useState<string>('Home / Residential Villa');

  if (!isOpen) return null;

  const totalCameras = indoorCount + outdoorCount;

  // Auto-suggest channels based on camera count if user hasn't manually overridden
  const recommendedChannel: RecorderChannelType = 
    totalCameras <= 4 ? '4ch' : totalCameras <= 8 ? '8ch' : '16ch';

  const activeChannel = customChannel || recommendedChannel;

  // Calculate Camera Unit Price
  const getCameraUnitPrice = (isOutdoor: boolean): number => {
    switch (cameraTech) {
      case 'hd_2mp':
        return isOutdoor ? cctvPricing.hd2mpBullet : cctvPricing.hd2mpDome;
      case 'hd_5mp':
        return isOutdoor ? cctvPricing.hd5mpBullet : cctvPricing.hd5mpDome;
      case 'ip_2mp':
        return isOutdoor ? cctvPricing.ip2mpBullet : cctvPricing.ip2mpDome;
      case 'ip_4mp_colorvu':
        return cctvPricing.ip4mpColorVu;
      case 'wifi_360':
        return cctvPricing.wifi360Camera;
      default:
        return cctvPricing.hd2mpDome;
    }
  };

  const indoorUnitPrice = getCameraUnitPrice(false);
  const outdoorUnitPrice = getCameraUnitPrice(true);
  const camerasTotal = (indoorCount * indoorUnitPrice) + (outdoorCount * outdoorUnitPrice);

  // Recorder (DVR / NVR) Price
  const isIpSystem = cameraTech === 'ip_2mp' || cameraTech === 'ip_4mp_colorvu';
  const isWifiSystem = cameraTech === 'wifi_360';

  const getRecorderPrice = (): number => {
    if (isWifiSystem) {
      // WiFi cameras can be standalone without recorder or with NVR
      return 0;
    }
    if (isIpSystem) {
      // NVR (PoE)
      if (activeChannel === '4ch') return cctvPricing.nvr4Channel;
      if (activeChannel === '8ch') return cctvPricing.nvr8Channel;
      return cctvPricing.nvr16Channel;
    } else {
      // HD DVR
      if (activeChannel === '4ch') return cctvPricing.dvr4Channel;
      if (activeChannel === '8ch') return cctvPricing.dvr8Channel;
      return cctvPricing.dvr16Channel;
    }
  };

  const recorderTotal = getRecorderPrice();

  // Storage / Hard Disk Price
  const getHddPrice = (): number => {
    switch (hddCapacity) {
      case '500gb': return cctvPricing.hdd500GB;
      case '1tb': return cctvPricing.hdd1TB;
      case '2tb': return cctvPricing.hdd2TB;
      case '4tb': return cctvPricing.hdd4TB;
      default: return cctvPricing.hdd1TB;
    }
  };

  const hddTotal = getHddPrice();

  // Power supply price
  const getPowerSupplyPrice = (): number => {
    if (isIpSystem || isWifiSystem) return 0; // IP uses PoE NVR, WiFi has standalone adapter
    if (activeChannel === '4ch') return cctvPricing.powerSupply4Port;
    if (activeChannel === '8ch') return cctvPricing.powerSupply8Port;
    return cctvPricing.powerSupply16Port;
  };

  const powerSupplyTotal = getPowerSupplyPrice();
  const cablingTotal = includeCabling ? totalCameras * cctvPricing.cablePerCamera : 0;
  const installationTotal = includeInstallation ? totalCameras * cctvPricing.installationPerCamera : 0;

  // Grand Total
  const grandTotal = camerasTotal + recorderTotal + hddTotal + powerSupplyTotal + cablingTotal + installationTotal;

  // Camera technology display labels
  const cameraTechOptions = [
    {
      id: 'hd_2mp' as CameraTechType,
      name: 'HD 2MP (1080p)',
      desc: 'Crystal HD night vision with infrared LEDs. Best value for homes & shops.',
      badge: 'Most Popular',
      recorderLabel: 'HD DVR'
    },
    {
      id: 'hd_5mp' as CameraTechType,
      name: 'HD 5MP Super-HD',
      desc: 'Extra-crisp clarity for fine vehicle number plates & cash counters.',
      badge: 'Sharp Detail',
      recorderLabel: 'HD 5MP DVR'
    },
    {
      id: 'ip_2mp' as CameraTechType,
      name: 'IP 2MP PoE Smart',
      desc: 'Network digital cameras with two-way audio & direct PoE cable power.',
      badge: 'Smart IP PoE',
      recorderLabel: 'PoE NVR'
    },
    {
      id: 'ip_4mp_colorvu' as CameraTechType,
      name: 'IP 4MP ColorVu (24/7 Color)',
      desc: 'Full-color night vision even in total pitch darkness with smart AI human alerts.',
      badge: 'Ultra Night Color',
      recorderLabel: '4K PoE NVR'
    },
    {
      id: 'wifi_360' as CameraTechType,
      name: 'WiFi 360° Smart PTZ',
      desc: 'Wireless motorized camera with mobile app rotation, siren & cloud backup.',
      badge: 'Wireless PTZ',
      recorderLabel: 'Standalone / WiFi'
    }
  ];

  // Hard Disk options
  const hddOptions = [
    { id: '500gb' as HddCapacityType, label: '500 GB', days: '~5 to 7 Days Recording', price: cctvPricing.hdd500GB },
    { id: '1tb' as HddCapacityType, label: '1 TB (Surveillance)', days: '~12 to 15 Days Recording', price: cctvPricing.hdd1TB, popular: true },
    { id: '2tb' as HddCapacityType, label: '2 TB (Surveillance)', days: '~25 to 30 Days Recording', price: cctvPricing.hdd2TB },
    { id: '4tb' as HddCapacityType, label: '4 TB (Surveillance)', days: '~50 to 60 Days Recording', price: cctvPricing.hdd4TB }
  ];

  // WhatsApp Quotation sender
  const handleSendWhatsApp = () => {
    const selectedTechObj = cameraTechOptions.find(t => t.id === cameraTech);
    const techName = selectedTechObj?.name || 'HD CCTV';
    const recorderName = isWifiSystem 
      ? 'Wireless Cloud / MicroSD Storage' 
      : `${activeChannel.toUpperCase()} ${isIpSystem ? 'PoE NVR' : 'HD DVR'} Digital Recorder`;

    const selectedHddObj = hddOptions.find(h => h.id === hddCapacity);

    const details = [
      `Premises Type: ${premisesType}`,
      `Camera Technology: ${techName}`,
      `Indoor Cameras: ${indoorCount} Unit(s) (₹${indoorUnitPrice.toLocaleString('en-IN')} each)`,
      `Outdoor Cameras: ${outdoorCount} Unit(s) (₹${outdoorUnitPrice.toLocaleString('en-IN')} each)`,
      `Total Cameras: ${totalCameras} Camera(s)`,
      `Recorder (Hub): ${recorderName} (₹${recorderTotal.toLocaleString('en-IN')})`,
      `Storage (Hard Disk): ${selectedHddObj?.label} (${selectedHddObj?.days}) - ₹${hddTotal.toLocaleString('en-IN')}`,
      `Power Supply & Cabling: ${includeCabling ? `Included (₹${(powerSupplyTotal + cablingTotal).toLocaleString('en-IN')})` : 'Self Arranged'}`,
      `Certified Installation: ${includeInstallation ? `Included (${totalCameras} Points - ₹${installationTotal.toLocaleString('en-IN')})` : 'Hardware Only'}`,
      `Total Estimated Package: ₹${grandTotal.toLocaleString('en-IN')}`,
      `Warranty: 1 to 2 Years Genuine Brand Warranty + 1 Year Service Support`
    ];

    const message = formatEstimateMessage(`CCTV Security Package Estimate Request`, details);

    // Capture lead in Google Sheets in background
    sendLeadToGoogleSheets(shopInfo.googleSheetWebhookUrl, {
      customerName: 'CCTV Package Estimator User',
      phoneNumber: 'Via WhatsApp',
      address: premisesType,
      category: 'CCTV Security',
      serviceType: `${totalCameras} Cameras (${techName}) + ${recorderName} - ₹${grandTotal.toLocaleString('en-IN')}`,
      preferredTime: includeInstallation ? 'Installation Required' : 'Equipment Only',
      notes: `Storage: ${selectedHddObj?.label} | Total: ₹${grandTotal.toLocaleString('en-IN')}`,
      source: 'CCTV Estimator Modal',
      status: 'Pending ⏳'
    });

    window.open(createWhatsAppLink(message, shopInfo.whatsappPhone), '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        animation: 'modalSlideUp 0.25s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#04647a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(4, 100, 122, 0.4)'
            }}>
              <Video size={22} />
            </div>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
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
                  Instant Quote
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Select camera types, DVR/NVR channels, and storage to calculate your setup cost.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{
          padding: '22px 24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          background: '#f8fafc'
        }}>
          {/* Quick Presets / Premises Type Selector */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Premises / Building Type
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                'Home / Residential Villa',
                'Retail Shop / Supermarket',
                'Office & Workplace',
                'Factory / Warehouse',
                'Apartment / Society'
              ].map(prem => (
                <button
                  key={prem}
                  onClick={() => setPremisesType(prem)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: premisesType === prem ? '1.5px solid #04647a' : '1px solid #cbd5e1',
                    background: premisesType === prem ? '#04647a' : '#ffffff',
                    color: premisesType === prem ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {prem}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: Select Camera Technology & Quality */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '18px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
                  1
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Choose Camera Quality &amp; Type
                </h3>
              </div>
              <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                CP PLUS · Hikvision · Dahua
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
              gap: '10px'
            }}>
              {cameraTechOptions.map((opt) => {
                const isSelected = cameraTech === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setCameraTech(opt.id);
                      setCustomChannel(null); // reset channel override to auto
                    }}
                    style={{
                      border: isSelected ? '2px solid #04647a' : '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '14px 12px',
                      cursor: 'pointer',
                      background: isSelected ? '#f0fdfa' : '#ffffff',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{
                        background: isSelected ? '#04647a' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#475569',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {opt.badge}
                      </span>
                      {isSelected && (
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#04647a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                      {opt.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.35 }}>
                      {opt.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Camera Counts (Indoor vs Outdoor) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '18px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
                  2
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Number of Cameras Required
                </h3>
              </div>
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                fontWeight: 800,
                fontSize: '0.82rem',
                padding: '4px 12px',
                borderRadius: '9999px'
              }}>
                Total: {totalCameras} Camera{totalCameras !== 1 ? 's' : ''}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px'
            }}>
              {/* Indoor Dome Cameras */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Eye size={16} color="#04647a" />
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Indoor Dome Cameras</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    For living rooms, rooms, shops &amp; counters
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#04647a', fontWeight: 700, marginTop: '4px' }}>
                    ₹{indoorUnitPrice.toLocaleString('en-IN')} / camera
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setIndoorCount(Math.max(0, indoorCount - 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                    {indoorCount}
                  </span>
                  <button
                    onClick={() => setIndoorCount(indoorCount + 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#04647a',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Outdoor Bullet Cameras */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} color="#04647a" />
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Outdoor Bullet Cameras</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    Weatherproof IP67 for gates, entrance &amp; street
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#04647a', fontWeight: 700, marginTop: '4px' }}>
                    ₹{outdoorUnitPrice.toLocaleString('en-IN')} / camera
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setOutdoorCount(Math.max(0, outdoorCount - 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                    {outdoorCount}
                  </span>
                  <button
                    onClick={() => setOutdoorCount(outdoorCount + 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#04647a',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Video Recorder (DVR vs NVR) */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '18px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
                  3
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Video Recorder ({isIpSystem ? 'PoE NVR' : isWifiSystem ? 'WiFi Hub' : 'HD DVR'})
                </h3>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#04647a', fontWeight: 700, background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>
                {isIpSystem ? 'Digital PoE NVR' : isWifiSystem ? 'Direct App / WiFi' : 'HD Coaxial DVR'}
              </span>
            </div>

            {isWifiSystem ? (
              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', fontSize: '0.84rem', color: '#475569' }}>
                💡 <strong>WiFi 360 Cameras</strong> record directly to on-board High Endurance MicroSD cards or Cloud without requiring a separate DVR box.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px'
              }}>
                {[
                  {
                    id: '4ch' as RecorderChannelType,
                    label: '4 Channel System',
                    sub: 'Supports up to 4 Cameras',
                    price: isIpSystem ? cctvPricing.nvr4Channel : cctvPricing.dvr4Channel,
                    isRecommended: recommendedChannel === '4ch'
                  },
                  {
                    id: '8ch' as RecorderChannelType,
                    label: '8 Channel System',
                    sub: 'Supports up to 8 Cameras',
                    price: isIpSystem ? cctvPricing.nvr8Channel : cctvPricing.dvr8Channel,
                    isRecommended: recommendedChannel === '8ch'
                  },
                  {
                    id: '16ch' as RecorderChannelType,
                    label: '16 Channel System',
                    sub: 'Supports up to 16 Cameras',
                    price: isIpSystem ? cctvPricing.nvr16Channel : cctvPricing.dvr16Channel,
                    isRecommended: recommendedChannel === '16ch'
                  }
                ].map(ch => {
                  const isSelected = activeChannel === ch.id;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => setCustomChannel(ch.id)}
                      style={{
                        border: isSelected ? '2px solid #04647a' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px',
                        cursor: 'pointer',
                        background: isSelected ? '#f0fdfa' : '#ffffff',
                        transition: 'all 0.15s ease',
                        position: 'relative'
                      }}
                    >
                      {ch.isRecommended && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '10px',
                          background: '#04647a',
                          color: '#ffffff',
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          Auto Match
                        </div>
                      )}
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                        {ch.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        {ch.sub}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#04647a', marginTop: '6px' }}>
                        ₹{ch.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* STEP 4: Hard Disk Storage Selection */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '18px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
                  4
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Hard Disk Recording Storage
                </h3>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                Seagate SkyHawk · WD Purple 24×7
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px'
            }}>
              {hddOptions.map(hdd => {
                const isSelected = hddCapacity === hdd.id;
                return (
                  <div
                    key={hdd.id}
                    onClick={() => setHddCapacity(hdd.id)}
                    style={{
                      border: isSelected ? '2px solid #04647a' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: 'pointer',
                      background: isSelected ? '#f0fdfa' : '#ffffff',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    {hdd.popular && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '8px',
                        background: '#eab308',
                        color: '#0f172a',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        Recommended
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HardDrive size={15} color={isSelected ? '#04647a' : '#64748b'} />
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{hdd.label}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                      {hdd.days}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#04647a', marginTop: '6px' }}>
                      ₹{hdd.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 5: Accessories & Installation Toggles */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '18px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
                5
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Accessories &amp; Doorstep Installation
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Cabling & Connectors Checkbox */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={includeCabling}
                    onChange={(e) => setIncludeCabling(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#04647a', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      Pure Copper 3+1 CCTV Cable &amp; Connectors ({totalCameras * 30}m included)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Includes Heavy-duty BNC / DC / RJ45 pins + SMPS Multi-channel power adapter
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#04647a' }}>
                  {includeCabling ? `+₹${(powerSupplyTotal + cablingTotal).toLocaleString('en-IN')}` : 'Free'}
                </span>
              </label>

              {/* Installation Checkbox */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={includeInstallation}
                    onChange={(e) => setIncludeInstallation(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#04647a', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      Professional Certified Installation &amp; Mobile Setup
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Drilling, conduit wiring, angles, online mobile app config &amp; live demonstration
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#04647a' }}>
                  {includeInstallation ? `+₹${installationTotal.toLocaleString('en-IN')}` : 'Excluded'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer - Live Cost Breakdown & Action Buttons */}
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
          {/* Total Price Display */}
          <div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Estimated Total ({totalCameras} Camera System)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.76rem', color: '#16a34a', fontWeight: 700 }}>
                Includes GST &amp; Warranty
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
    </div>
  );
};
