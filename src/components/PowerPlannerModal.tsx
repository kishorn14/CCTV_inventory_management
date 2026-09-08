import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Plus, 
  Minus, 
  MessageCircle, 
  Lightbulb, 
  Tv, 
  Laptop, 
  Droplets, 
  Zap, 
  Wind,
  Layers,
  Sparkles,
  Gauge
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createWhatsAppLink } from '../utils/whatsapp';
import { sendLeadToGoogleSheets } from '../utils/googleSheets';

interface PowerPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplianceItem {
  id: string;
  name: string;
  watts: number;
  icon: React.ElementType;
}

const APPLIANCES: ApplianceItem[] = [
  { id: 'led', name: 'LED Bulb', watts: 9, icon: Lightbulb },
  { id: 'tube', name: 'Tube Light', watts: 40, icon: Sparkles },
  { id: 'fan', name: 'Ceiling Fan', watts: 75, icon: Wind },
  { id: 'tv', name: 'Television', watts: 100, icon: Tv },
  { id: 'fridge', name: 'Refrigerator', watts: 200, icon: Layers },
  { id: 'laptop', name: 'Laptop', watts: 50, icon: Laptop },
  { id: 'pump', name: 'Water Pump ½HP', watts: 400, icon: Droplets },
  { id: 'microwave', name: 'Microwave', watts: 1200, icon: Zap }
];

export const PowerPlannerModal: React.FC<PowerPlannerModalProps> = ({ isOpen, onClose }) => {
  const { shopInfo } = useShop();

  const [quantities, setQuantities] = useState<Record<string, number>>({
    led: 0,
    tube: 0,
    fan: 0,
    tv: 0,
    fridge: 0,
    laptop: 0,
    pump: 0,
    microwave: 0
  });

  const [batteryCount, setBatteryCount] = useState<number>(1);

  if (!isOpen) return null;

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const applyPreset = (preset: '1bhk' | '2bhk' | 'shop') => {
    if (preset === '1bhk') {
      setQuantities({
        led: 3,
        tube: 2,
        fan: 2,
        tv: 1,
        fridge: 0,
        laptop: 1,
        pump: 0,
        microwave: 0
      });
      setBatteryCount(1);
    } else if (preset === '2bhk') {
      setQuantities({
        led: 5,
        tube: 3,
        fan: 3,
        tv: 1,
        fridge: 1,
        laptop: 2,
        pump: 0,
        microwave: 0
      });
      setBatteryCount(2);
    } else if (preset === 'shop') {
      setQuantities({
        led: 4,
        tube: 2,
        fan: 2,
        tv: 0,
        fridge: 0,
        laptop: 1,
        pump: 0,
        microwave: 0
      });
      setBatteryCount(1);
    }
  };

  // Calculations
  const totalWatts = APPLIANCES.reduce((sum, app) => {
    return sum + (quantities[app.id] || 0) * app.watts;
  }, 0);

  const powerFactor = 0.8;
  const requiredVA = Math.round(totalWatts / powerFactor);

  // Recommended Inverter Model
  const getRecommendedVA = (va: number) => {
    if (va === 0) return 600;
    if (va <= 600) return 600;
    if (va <= 900) return 900;
    if (va <= 1100) return 1100;
    if (va <= 1500) return 1500;
    if (va <= 2000) return 2000;
    if (va <= 2500) return 2500;
    return 3500;
  };

  const recommendedVA = getRecommendedVA(requiredVA);

  // Backup Hours = (Battery Ah * 12V * batteryCount * 0.85 efficiency) / totalWatts
  const calculateBackupHours = () => {
    if (totalWatts === 0) return 0;
    const totalEnergyWh = 150 * 12 * batteryCount * 0.85;
    const hours = totalEnergyWh / totalWatts;
    return hours >= 10 ? '10+' : hours.toFixed(1);
  };

  const backupHours = calculateBackupHours();

  const handleWhatsAppInquiry = () => {
    const selectedList = APPLIANCES
      .filter(app => (quantities[app.id] || 0) > 0)
      .map(app => `• ${app.name} (${app.watts}W): ${quantities[app.id]} unit(s)`);

    const message = `⚡ *POWER PLANNER / INVERTER LOAD CALCULATION*
*Shop:* ${shopInfo.shopName}
---------------------------------
📊 *Calculated Load Details:*
• *Total Running Load:* ${totalWatts} Watts
• *Required Minimum Capacity:* ${requiredVA} VA
• *Recommended Inverter:* ${recommendedVA} VA Pure Sine Wave
• *Battery Configuration:* ${batteryCount} × 150Ah Tall Tubular Battery
• *Estimated Backup Duration:* ~${backupHours} Hours

📋 *Appliances Selected:*
${selectedList.length > 0 ? selectedList.join('\n') : '• General Home Backup'}
---------------------------------
_Please share the best price quote & availability for this inverter combo._`;

    // Send lead to Google Sheets
    sendLeadToGoogleSheets(shopInfo.googleSheetWebhookUrl, {
      customerName: 'Power Planner Lead',
      phoneNumber: 'Via WhatsApp',
      address: 'Inverter Load Estimate',
      category: 'Inverter & UPS',
      serviceType: `${recommendedVA} VA Inverter + ${batteryCount}x150Ah (${totalWatts}W Load)`,
      preferredTime: `Est. Backup: ${backupHours} hrs`,
      notes: selectedList.join(', '),
      source: 'Power Planner Load Calculator',
      status: 'Pending ⏳'
    });

    window.open(createWhatsAppLink(message, shopInfo.whatsappPhone), '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '540px',
          background: '#ffffff',
          color: '#0f172a',
          padding: '24px 20px 32px 20px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div className="modal-drag-handle" />

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '14px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#04647a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Calculator size={22} />
            </div>
            <div>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#0284c7',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                lineHeight: 1
              }}>
                Power Planner
              </div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.2,
                marginTop: '3px',
                margin: 0
              }}>
                Load Calculator
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close calculator"
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

        {/* Intro Subtitle */}
        <p style={{
          fontSize: '0.86rem',
          color: '#475569',
          lineHeight: 1.5,
          marginBottom: '18px'
        }}>
          Pick your appliances and instantly see the right inverter size and backup time — based on standard Indian sizing.
        </p>

        {/* Quick Start Presets */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Start:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('1bhk')}
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '5px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            1 BHK Home
          </button>
          <button
            type="button"
            onClick={() => applyPreset('2bhk')}
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '5px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            2 BHK Home
          </button>
          <button
            type="button"
            onClick={() => applyPreset('shop')}
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '5px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Small Shop
          </button>
        </div>

        {/* Appliances Grid (2 columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '22px'
        }}>
          {APPLIANCES.map((app) => {
            const Icon = app.icon;
            const count = quantities[app.id] || 0;
            return (
              <div
                key={app.id}
                style={{
                  background: '#ffffff',
                  border: count > 0 ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: count > 0 ? '0 2px 8px rgba(2, 132, 199, 0.1)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: count > 0 ? '#e0f2fe' : '#f1f5f9',
                  color: count > 0 ? '#0284c7' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={16} />
                </div>

                <div>
                  <div style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.2
                  }}>
                    {app.name}
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#64748b',
                    marginTop: '2px'
                  }}>
                    {app.watts} W each
                  </div>
                </div>

                {/* Counter Increment / Decrement */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  paddingTop: '4px'
                }}>
                  <button
                    type="button"
                    onClick={() => updateQty(app.id, -1)}
                    disabled={count === 0}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: count === 0 ? '#f8fafc' : '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      color: count === 0 ? '#cbd5e1' : '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: count === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Minus size={14} />
                  </button>

                  <span style={{
                    fontSize: '0.94rem',
                    fontWeight: 800,
                    color: count > 0 ? '#0284c7' : '#0f172a'
                  }}>
                    {count}
                  </span>

                  <button
                    type="button"
                    onClick={() => updateQty(app.id, 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#04647a',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended System Card (Dark Blue-Teal Gradient Panel) */}
        <div style={{
          background: 'linear-gradient(135deg, #024b86 0%, #03667c 100%)',
          borderRadius: '24px',
          padding: '20px 18px',
          color: '#ffffff',
          boxShadow: '0 12px 30px rgba(2, 75, 134, 0.25)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#fde047',
            fontSize: '0.74rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '16px'
          }}>
            <Gauge size={14} />
            <span>Recommended System</span>
          </div>

          {/* Load Summary & Inverter VA Gauge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '18px'
          }}>
            {/* Circular Gauge */}
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 70%)',
              border: '3px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1 }}>
                {recommendedVA}
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.04em', opacity: 0.85, marginTop: '2px' }}>
                VA INVERTER
              </span>
            </div>

            {/* Total Load & Required Capacity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '0.74rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Load
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.1 }}>
                  {totalWatts} W
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Required Capacity
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.1 }}>
                  {requiredVA} VA
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Suggestion Pill */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#fde047',
              color: '#854d0e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Zap size={13} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.3 }}>
              {totalWatts === 0 
                ? 'Add appliances to see your recommendation' 
                : totalWatts <= 400
                  ? 'Ideal for 1-2 BHK lights, fans & TV during power outages.'
                  : totalWatts <= 800
                    ? 'Perfect for 2-3 BHK home with refrigerator & multiple fans.'
                    : 'Heavy-duty power setup for full home or commercial equipment.'}
            </div>
          </div>

          {/* Battery Count & Backup Duration */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '14px',
            padding: '12px 14px',
            marginBottom: '18px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                Battery backup (150Ah)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setBatteryCount(Math.max(1, batteryCount - 1))}
                  disabled={batteryCount <= 1}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: batteryCount <= 1 ? 'not-allowed' : 'pointer',
                    opacity: batteryCount <= 1 ? 0.4 : 1
                  }}
                >
                  <Minus size={12} />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 800 }}>
                  {batteryCount}
                </span>
                <button
                  type="button"
                  onClick={() => setBatteryCount(Math.min(4, batteryCount + 1))}
                  disabled={batteryCount >= 4}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: batteryCount >= 4 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fde047' }}>
              {totalWatts > 0 ? `⚡ ~${backupHours} hours of backup` : '— hours of backup'}
            </div>
          </div>

          {/* WhatsApp Action Button */}
          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            style={{
              width: '100%',
              background: '#22c55e',
              border: 'none',
              borderRadius: '9999px',
              padding: '13px 20px',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.96rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <MessageCircle size={18} />
            <span>Get this setup on WhatsApp</span>
          </button>

          <p style={{
            fontSize: '0.68rem',
            textAlign: 'center',
            opacity: 0.75,
            marginTop: '10px',
            marginBottom: 0
          }}>
            Estimates use a 0.8 power factor &amp; standard Indian ratings. Final sizing confirmed by our team.
          </p>
        </div>
      </div>
    </div>
  );
};
