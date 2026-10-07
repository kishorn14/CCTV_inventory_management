import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Camera, 
  HardDrive, 
  Box, 
  Zap, 
  Plus, 
  Minus, 
  MessageSquare, 
  Phone, 
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Server,
  X,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { isCameraProduct } from '../data/cameraFootageData';
import { createWhatsAppLink, SHOP_INFO } from '../utils/whatsapp';

interface CctvCostEstimatorProps {
  onClose?: () => void;
}

export const CctvCostEstimator: React.FC<CctvCostEstimatorProps> = ({ onClose }) => {
  const { products } = useShop();

  // Lock background scroll when modal is open and handle Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // 1. Live dynamic product categories directly from store catalog
  const cameraProducts = useMemo(() => {
    return products.filter(p => isCameraProduct(p) && (p.price || 0) > 0);
  }, [products]);

  const hddProducts = useMemo(() => {
    return products.filter(p => p.category === 'storage' && (p.price || 0) > 0);
  }, [products]);

  const recorderProducts = useMemo(() => {
    return products.filter(p => p.category === 'dvr_nvr' && (p.price || 0) > 0);
  }, [products]);

  const rackProducts = useMemo(() => {
    return products.filter(p => 
      (p.name.toLowerCase().includes('rack') || p.badge?.toLowerCase().includes('rack')) && 
      !p.name.toLowerCase().includes('connector') &&
      !p.name.toLowerCase().includes('jointer') &&
      !p.name.toLowerCase().includes('box') &&
      (p.price || 0) > 0
    );
  }, [products]);

  const powerProducts = useMemo(() => {
    return products.filter(p => 
      (p.name.toLowerCase().includes('smps') || p.name.toLowerCase().includes('poe') || p.name.toLowerCase().includes('switch')) && 
      (p.price || 0) > 0
    );
  }, [products]);

  const cableProducts = useMemo(() => {
    return products.filter(p => 
      (p.name.toLowerCase().includes('cable') || p.name.toLowerCase().includes('solid cable')) && 
      (p.price || 0) > 0
    );
  }, [products]);

  // Step 1: Camera Quantities Map (cameraId -> quantity)
  // Allows selecting individual quantities beside each camera model
  const [cameraQuantities, setCameraQuantities] = useState<Record<string, number>>(() => {
    const firstCam = cameraProducts[0]?.id;
    return firstCam ? { [firstCam]: 4 } : {};
  });

  const [cameraFilter, setCameraFilter] = useState<'all' | 'ip' | 'analog' | 'wifi' | 'solar'>('all');

  // Helper to update quantity for a specific camera
  const updateCameraQty = (cameraId: string, qty: number) => {
    setCameraQuantities(prev => {
      const updated = { ...prev };
      if (qty <= 0) {
        delete updated[cameraId];
      } else {
        updated[cameraId] = Math.min(32, qty);
      }
      return updated;
    });
  };

  // Subsequent Component Selections
  const [selectedHddId, setSelectedHddId] = useState<string>('auto'); // 'auto' | 'none' | specific id
  const [selectedRecorderId, setSelectedRecorderId] = useState<string>('auto'); // 'auto' | 'none' | specific id
  const [selectedRackId, setSelectedRackId] = useState<string>('none'); // 'none' | specific id
  const [includePowerSupply, setIncludePowerSupply] = useState<boolean>(true);
  const [includeCables, setIncludeCables] = useState<boolean>(true);
  const [includeConnectors, setIncludeConnectors] = useState<boolean>(true);
  const [includeInstallation, setIncludeInstallation] = useState<boolean>(true);

  // Active step guide (1 to 5)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const advanceToStep = (step: number, message: string) => {
    setActiveStep(step);
    setNotificationMsg(message);
    const stepEl = document.getElementById(`estimator-step-${step}`);
    if (stepEl) {
      stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // List of all currently selected cameras with their quantities
  const selectedCamerasList = useMemo(() => {
    return cameraProducts
      .filter(p => (cameraQuantities[p.id] || 0) > 0)
      .map(p => ({
        product: p,
        quantity: cameraQuantities[p.id] || 0
      }));
  }, [cameraProducts, cameraQuantities]);

  // Total cameras count across all selected models
  const totalCameraCount = useMemo(() => {
    return selectedCamerasList.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedCamerasList]);

  // Minimum 1 camera count for sizing downstream accessories
  const effectiveCameraCount = Math.max(1, totalCameraCount);

  // Check if any selected camera is an IP camera
  const hasIpCameras = useMemo(() => {
    return selectedCamerasList.some(item => 
      item.product.category === 'ip_cameras' || item.product.name.toUpperCase().includes('IP')
    );
  }, [selectedCamerasList]);

  // Check if all selected cameras are standalone (Wi-Fi or Solar)
  const isAllStandalone = useMemo(() => {
    return selectedCamerasList.length > 0 && selectedCamerasList.every(item => 
      item.product.category === 'wifi_4g' || item.product.category === 'solar'
    );
  }, [selectedCamerasList]);

  // Filtered cameras for Step 1
  const filteredCameras = useMemo(() => {
    if (cameraFilter === 'all') return cameraProducts;
    if (cameraFilter === 'ip') return cameraProducts.filter(p => p.category === 'ip_cameras');
    if (cameraFilter === 'analog') return cameraProducts.filter(p => p.category === 'hd_analog');
    if (cameraFilter === 'wifi') return cameraProducts.filter(p => p.category === 'wifi_4g');
    if (cameraFilter === 'solar') return cameraProducts.filter(p => p.category === 'solar');
    return cameraProducts;
  }, [cameraProducts, cameraFilter]);

  // Dynamic Auto Recommendations for Recorder (scaled to totalCameraCount)
  const recommendedRecorder = useMemo(() => {
    if (isAllStandalone) return null;
    if (hasIpCameras) {
      if (effectiveCameraCount <= 8) {
        return recorderProducts.find(p => p.name.includes('8CH')) || recorderProducts[0];
      } else if (effectiveCameraCount <= 16) {
        return recorderProducts.find(p => p.name.includes('16CH')) || recorderProducts[0];
      } else {
        return recorderProducts.find(p => p.name.includes('32CH')) || recorderProducts[0];
      }
    } else {
      // Analog DVR
      return recorderProducts.find(p => p.name.includes('DVR')) || recorderProducts[0];
    }
  }, [effectiveCameraCount, hasIpCameras, isAllStandalone, recorderProducts]);

  const resolvedRecorder = useMemo(() => {
    if (selectedRecorderId === 'none') return null;
    if (selectedRecorderId === 'auto') return recommendedRecorder;
    return recorderProducts.find(p => p.id === selectedRecorderId) || null;
  }, [selectedRecorderId, recommendedRecorder, recorderProducts]);

  // Recommended HDD Storage (scaled to totalCameraCount)
  const recommendedHdd = useMemo(() => {
    if (isAllStandalone) {
      return hddProducts.find(p => p.name.includes('128 GB')) || hddProducts.find(p => p.name.includes('64 GB'));
    }
    if (effectiveCameraCount <= 4) {
      return hddProducts.find(p => p.name.includes('1TB')) || hddProducts.find(p => p.name.includes('500GB'));
    } else if (effectiveCameraCount <= 8) {
      return hddProducts.find(p => p.name.includes('2TB')) || hddProducts.find(p => p.name.includes('1TB'));
    } else {
      return hddProducts.find(p => p.name.includes('4TB')) || hddProducts.find(p => p.name.includes('2TB'));
    }
  }, [effectiveCameraCount, isAllStandalone, hddProducts]);

  const resolvedHdd = useMemo(() => {
    if (selectedHddId === 'none') return null;
    if (selectedHddId === 'auto') return recommendedHdd;
    return hddProducts.find(p => p.id === selectedHddId) || null;
  }, [selectedHddId, recommendedHdd, hddProducts]);

  // Selected Rack
  const resolvedRack = useMemo(() => {
    if (selectedRackId === 'none') return null;
    return rackProducts.find(p => p.id === selectedRackId) || null;
  }, [selectedRackId, rackProducts]);

  // Resolved Power (PoE switch or SMPS)
  const resolvedPower = useMemo(() => {
    if (!includePowerSupply) return null;
    if (isAllStandalone) return null;
    if (hasIpCameras) {
      return powerProducts.find(p => p.name.includes('POE') || p.name.includes('PoE')) || powerProducts[0];
    } else {
      return powerProducts.find(p => p.name.includes('SMPS')) || powerProducts[0];
    }
  }, [includePowerSupply, hasIpCameras, isAllStandalone, powerProducts]);

  // Resolved Cable
  const resolvedCable = useMemo(() => {
    if (!includeCables) return null;
    if (isAllStandalone) return null;
    if (hasIpCameras) {
      return cableProducts.find(p => p.name.includes('Cat6 cable pure copper')) || cableProducts[0];
    } else {
      return cableProducts.find(p => p.name.includes('3+1')) || cableProducts[0];
    }
  }, [includeCables, hasIpCameras, isAllStandalone, cableProducts]);

  // Connectors & Accessories Cost
  const connectorsUnitCost = hasIpCameras ? 65 : 55; // per camera point
  const connectorsTotalCost = includeConnectors && !isAllStandalone ? connectorsUnitCost * totalCameraCount : 0;

  // Doorstep Installation labor rate
  const installationUnitCost = isAllStandalone ? 450 : (hasIpCameras ? 550 : 450);
  const installationTotalCost = includeInstallation ? installationUnitCost * totalCameraCount : 0;

  // Total Camera Cost across all types
  const cameraTotal = useMemo(() => {
    return selectedCamerasList.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  }, [selectedCamerasList]);

  const hddTotal = resolvedHdd?.price || 0;
  const recorderTotal = resolvedRecorder?.price || 0;
  const rackTotal = resolvedRack?.price || 0;
  const powerTotal = resolvedPower?.price || 0;
  
  const cableTotal = useMemo(() => {
    if (!resolvedCable) return 0;
    if (resolvedCable.name.includes('305M')) return resolvedCable.price || 0;
    const meters = Math.max(totalCameraCount * 20, 40);
    return (resolvedCable.price || 47) * meters;
  }, [resolvedCable, totalCameraCount]);

  const grandTotal = cameraTotal + hddTotal + recorderTotal + rackTotal + powerTotal + cableTotal + connectorsTotalCost + installationTotalCost;

  // Reset function
  const handleReset = () => {
    const firstCam = cameraProducts[0]?.id;
    setCameraQuantities(firstCam ? { [firstCam]: 4 } : {});
    setSelectedHddId('auto');
    setSelectedRecorderId('auto');
    setSelectedRackId('none');
    setIncludePowerSupply(true);
    setIncludeCables(true);
    setIncludeConnectors(true);
    setIncludeInstallation(true);
    setActiveStep(1);
    setNotificationMsg(null);
  };

  // WhatsApp Quotation Message (Lists each individual camera model and count)
  const waEstimateText = useMemo(() => {
    let msg = `*MEKSHA CCTV SOLUTIONS - ESTIMATED PACKAGE QUOTATION*\n`;
    msg += `-------------------------------------------\n`;
    msg += `📷 *Selected Cameras (${totalCameraCount} Total):*\n`;
    selectedCamerasList.forEach(item => {
      const lineCost = (item.product.price || 0) * item.quantity;
      msg += `   • ${item.quantity}x ${item.product.name}\n`;
      msg += `     Rate: ₹${(item.product.price || 0).toLocaleString('en-IN')} × ${item.quantity} = ₹${lineCost.toLocaleString('en-IN')}\n`;
    });
    msg += `   └ Cameras Subtotal: ₹${cameraTotal.toLocaleString('en-IN')}\n\n`;

    if (resolvedHdd) {
      msg += `💾 *Storage:* ${resolvedHdd.name}\n`;
      msg += `   └ Price: ₹${(resolvedHdd.price || 0).toLocaleString('en-IN')}\n\n`;
    }

    if (resolvedRecorder) {
      msg += `📼 *Recorder:* ${resolvedRecorder.name}\n`;
      msg += `   └ Price: ₹${(resolvedRecorder.price || 0).toLocaleString('en-IN')}\n\n`;
    }

    if (resolvedRack) {
      msg += `🗄️ *Enclosure:* ${resolvedRack.name}\n`;
      msg += `   └ Price: ₹${(resolvedRack.price || 0).toLocaleString('en-IN')}\n\n`;
    }

    if (resolvedPower) {
      msg += `⚡ *Power/PoE:* ${resolvedPower.name}\n`;
      msg += `   └ Price: ₹${(resolvedPower.price || 0).toLocaleString('en-IN')}\n\n`;
    }

    if (resolvedCable) {
      msg += `🔌 *Cabling:* ${resolvedCable.name} (~${totalCameraCount * 20}m)\n`;
      msg += `   └ Est. Price: ₹${cableTotal.toLocaleString('en-IN')}\n\n`;
    }

    if (connectorsTotalCost > 0) {
      msg += `🔩 *Connectors & Junction Boxes:* ${totalCameraCount} points\n`;
      msg += `   └ Price: ₹${connectorsTotalCost.toLocaleString('en-IN')}\n\n`;
    }

    if (includeInstallation) {
      msg += `🛠️ *Doorstep Installation:* ${totalCameraCount} points fitting & mobile setup\n`;
      msg += `   └ Labor: ₹${installationTotalCost.toLocaleString('en-IN')}\n\n`;
    }

    msg += `-------------------------------------------\n`;
    msg += `*ESTIMATED TOTAL: ₹${grandTotal.toLocaleString('en-IN')}*\n`;
    msg += `✓ All prices inclusive of GST & Brand Warranty\n\n`;
    msg += `Please confirm stock availability, schedule doorstep site survey & book installation.`;

    return msg;
  }, [
    totalCameraCount,
    selectedCamerasList,
    cameraTotal, 
    resolvedHdd, 
    resolvedRecorder, 
    resolvedRack, 
    resolvedPower, 
    resolvedCable, 
    cableTotal, 
    connectorsTotalCost, 
    includeInstallation, 
    installationTotalCost, 
    grandTotal
  ]);

  const waLink = createWhatsAppLink(waEstimateText, SHOP_INFO.whatsappNumber);

  return (
    <div 
      id="cctv-cost-estimator-modal"
      className="estimator-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div 
        className="estimator-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1240px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '20px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Sticky Fixed Header Bar with Round X Close Button (No overlapping text) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0,
          gap: '12px',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              padding: '6px 12px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.84rem',
              fontWeight: 800,
              flexShrink: 0
            }}>
              <Calculator size={16} />
              <span>CCTV Cost Estimator</span>
            </div>
            <span style={{ 
              fontSize: '0.8rem', 
              color: '#64748b', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              Interactive Package Configurator
            </span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              title="Close"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#f1f5f9',
                border: '1.5px solid #cbd5e1',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fee2e2';
                e.currentTarget.style.borderColor = '#f87171';
                e.currentTarget.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Scrollable Modal Content */}
        <div style={{
          overflowY: 'auto',
          padding: '24px 20px 36px',
          flex: 1,
          overscrollBehavior: 'contain',
          background: '#f8fafc'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Estimator Header Banner Inside Modal */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                padding: '5px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '10px'
              }}>
                <Calculator size={15} /> Instant CCTV Package Cost Estimator
              </div>
              <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.85rem)', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>
                Customize &amp; Estimate Your CCTV System In Seconds
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '680px', margin: '0 auto' }}>
                Select individual quantities beside each camera model (mix &amp; match bullets, domes, and Wi-Fi cams). The estimator automatically guides you through matching storage (HDD), recording unit (DVR/NVR), racks, cables, and setup.
              </p>

              {/* Stepper Navigation Strip */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '20px',
                flexWrap: 'wrap'
              }}>
                {[
                  { num: 1, label: `1. Cameras (${totalCameraCount})`, icon: Camera },
                  { num: 2, label: '2. HDD Storage', icon: HardDrive },
                  { num: 3, label: '3. DVR / NVR', icon: Server },
                  { num: 4, label: '4. Rack Enclosure', icon: Box },
                  { num: 5, label: '5. Cabling & Accessories', icon: Zap }
                ].map(step => {
                  const isActive = activeStep === step.num;
                  const isPast = activeStep > step.num;
                  const Icon = step.icon;
                  return (
                    <button
                      key={step.num}
                      onClick={() => setActiveStep(step.num)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        border: isActive 
                          ? '1.5px solid #2563eb' 
                          : (isPast ? '1.5px solid #10b981' : '1px solid #cbd5e1'),
                        background: isActive 
                          ? '#2563eb' 
                          : (isPast ? '#ecfdf5' : '#ffffff'),
                        color: isActive ? '#ffffff' : (isPast ? '#059669' : '#475569'),
                        boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
                      }}
                    >
                      {isPast ? <CheckCircle2 size={14} color="#059669" /> : <Icon size={14} />}
                      <span>{step.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleReset}
                  title="Reset estimator back to default"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626'
                  }}
                >
                  <RefreshCw size={13} /> Reset
                </button>
              </div>
            </div>

            {/* Guided Banner Notification Prompt */}
            {notificationMsg && (
              <div style={{
                maxWidth: '800px',
                margin: '0 auto 18px auto',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '10px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.86rem',
                color: '#1e40af'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronRight size={16} color="#2563eb" />
                  <span style={{ fontWeight: 600 }}>{notificationMsg}</span>
                </div>
                <button
                  onClick={() => setNotificationMsg(null)}
                  style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* 2-Column Layout: Component Configurator (Left) + Live Total Bill Card (Right) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '24px',
              alignItems: 'start'
            }}>
              
              {/* LEFT: Step-by-Step Auto Guided Components Builder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* STEP 1: Select Cameras with Quantity Beside Each Camera */}
                <div 
                  id="estimator-step-1"
                  style={{
                    background: '#ffffff',
                    border: activeStep === 1 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    boxShadow: activeStep === 1 ? '0 4px 20px rgba(37, 99, 235, 0.1)' : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'border 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div 
                      onClick={() => setActiveStep(1)} 
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                    >
                      <span style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: '#2563eb',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}>
                        1
                      </span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                          Step 1: Select Cameras &amp; Quantities
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Total Selected: <strong style={{ color: '#2563eb' }}>{totalCameraCount} Camera{totalCameraCount !== 1 ? 's' : ''}</strong> ({selectedCamerasList.length} model{selectedCamerasList.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>

                    {/* Quick Advance Button */}
                    <button
                      onClick={() => advanceToStep(2, `Selected ${totalCameraCount} camera(s). Next: Choose HDD storage capacity.`)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: totalCameraCount > 0 ? '#2563eb' : '#f1f5f9',
                        color: totalCameraCount > 0 ? '#ffffff' : '#94a3b8',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: totalCameraCount > 0 ? 'pointer' : 'default',
                        transition: 'all 0.15s ease'
                      }}
                      disabled={totalCameraCount === 0}
                    >
                      <span>Next: Storage (HDD)</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Camera Filter Tabs */}
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' }}>
                    {[
                      { id: 'all', label: `All Cameras (${cameraProducts.length})` },
                      { id: 'ip', label: 'CP PLUS IP' },
                      { id: 'analog', label: 'HD Analog' },
                      { id: 'wifi', label: '360° Wi-Fi & 4G' },
                      { id: 'solar', label: 'Solar Kit' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setCameraFilter(tab.id as any)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: cameraFilter === tab.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
                          background: cameraFilter === tab.id ? '#2563eb' : '#f8fafc',
                          color: cameraFilter === tab.id ? '#ffffff' : '#64748b',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Camera Grid with Quantity Controller Right Beside Each Camera */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', 
                    gap: '10px', 
                    maxHeight: '340px', 
                    overflowY: 'auto',
                    paddingRight: '4px'
                  }}>
                    {filteredCameras.map(cam => {
                      const qty = cameraQuantities[cam.id] || 0;
                      const isSelected = qty > 0;
                      return (
                        <div
                          key={cam.id}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: isSelected ? '#eff6ff' : '#ffffff',
                            border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                            transition: 'all 0.18s ease'
                          }}
                        >
                          {/* Left: Thumbnail + Camera Info */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                            <img 
                              src={cam.image} 
                              alt={cam.name} 
                              style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'contain', background: '#f8fafc', padding: '2px', border: '1px solid #e2e8f0', flexShrink: 0 }} 
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#0f172a',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }} title={cam.name}>
                                {cam.name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{cam.brand}</span>
                                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>
                                  ₹{(cam.price || 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                              {isSelected && (
                                <div style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 700, marginTop: '2px' }}>
                                  Subtotal: ₹{((cam.price || 0) * qty).toLocaleString('en-IN')}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Quantity Controller Just Beside Camera */}
                          <div style={{ flexShrink: 0 }}>
                            {qty === 0 ? (
                              <button
                                onClick={() => {
                                  updateCameraQty(cam.id, 1);
                                  setNotificationMsg(`Added ${cam.name} (1 unit) to package.`);
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#eff6ff',
                                  border: '1px solid #bfdbfe',
                                  color: '#1d4ed8',
                                  padding: '5px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                                title="Add this camera model"
                              >
                                <Plus size={13} /> Add
                              </button>
                            ) : (
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '2px',
                                background: '#ffffff',
                                borderRadius: '8px',
                                padding: '2px 4px',
                                border: '1.5px solid #2563eb'
                              }}>
                                <button
                                  onClick={() => updateCameraQty(cam.id, qty - 1)}
                                  style={{
                                    background: '#eff6ff',
                                    border: 'none',
                                    color: '#1d4ed8',
                                    cursor: 'pointer',
                                    padding: '3px 6px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  title="Decrease quantity"
                                >
                                  <Minus size={13} />
                                </button>
                                <span style={{
                                  minWidth: '22px',
                                  textAlign: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.86rem',
                                  color: '#0f172a'
                                }}>
                                  {qty}
                                </span>
                                <button
                                  onClick={() => updateCameraQty(cam.id, qty + 1)}
                                  style={{
                                    background: '#eff6ff',
                                    border: 'none',
                                    color: '#1d4ed8',
                                    cursor: 'pointer',
                                    padding: '3px 6px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  title="Increase quantity"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalCameraCount === 0 && (
                    <div style={{ textAlign: 'center', color: '#dc2626', fontSize: '0.82rem', marginTop: '10px', fontWeight: 600 }}>
                      ⚠️ Please select quantity for at least 1 camera model above to configure your package.
                    </div>
                  )}
                </div>

                {/* STEP 2: Automatic HDD Storage Selection */}
                <div 
                  id="estimator-step-2"
                  style={{
                    background: '#ffffff',
                    border: activeStep === 2 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    boxShadow: activeStep === 2 ? '0 4px 20px rgba(37, 99, 235, 0.1)' : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'border 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div 
                    onClick={() => setActiveStep(2)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', cursor: 'pointer' }}
                  >
                    <span style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: activeStep >= 2 ? '#2563eb' : '#94a3b8',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      2
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        Step 2: Select Hard Disk (HDD) Storage Size
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Continuous CCTV video recording retention for {totalCameraCount} camera{totalCameraCount !== 1 ? 's' : ''} (Auto-recommended: <strong style={{ color: '#2563eb' }}>{recommendedHdd?.name}</strong>)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                    {/* Auto Recommend Option */}
                    <div
                      onClick={() => { 
                        setSelectedHddId('auto'); 
                        advanceToStep(3, `Storage set to Auto Recommended (${recommendedHdd?.name}). Next: Select DVR / NVR.`); 
                      }}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: selectedHddId === 'auto' ? '#eff6ff' : '#f8fafc',
                        border: selectedHddId === 'auto' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: selectedHddId === 'auto' ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 800 }}>★ AUTO RECOMMENDED</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                        {recommendedHdd ? recommendedHdd.name.split('-')[0] : 'Auto Storage'}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                        ₹{(recommendedHdd?.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Specific HDDs from catalog */}
                    {hddProducts.map(hdd => {
                      const isSelected = selectedHddId === hdd.id;
                      return (
                        <div
                          key={hdd.id}
                          onClick={() => { 
                            setSelectedHddId(hdd.id); 
                            advanceToStep(3, `Selected HDD: ${hdd.name}. Next: Select DVR / NVR.`); 
                          }}
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            background: isSelected ? '#eff6ff' : '#f8fafc',
                            border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            textAlign: 'center',
                            boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none'
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{hdd.brand}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {hdd.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                            ₹{(hdd.price || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      );
                    })}

                    {/* None Option */}
                    <div
                      onClick={() => { 
                        setSelectedHddId('none'); 
                        advanceToStep(3, `HDD skipped (Already have drive). Next: Select DVR / NVR.`); 
                      }}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: selectedHddId === 'none' ? '#fef2f2' : '#f8fafc',
                        border: selectedHddId === 'none' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Already Have HDD</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>₹0 (Skip)</div>
                    </div>
                  </div>
                </div>

                {/* STEP 3: Automatic DVR / NVR Unit Selection */}
                <div 
                  id="estimator-step-3"
                  style={{
                    background: '#ffffff',
                    border: activeStep === 3 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    boxShadow: activeStep === 3 ? '0 4px 20px rgba(37, 99, 235, 0.1)' : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'border 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div 
                    onClick={() => setActiveStep(3)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', cursor: 'pointer' }}
                  >
                    <span style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: activeStep >= 3 ? '#2563eb' : '#94a3b8',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      3
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        Step 3: Select DVR / NVR Recording Unit
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {isAllStandalone 
                          ? 'Wi-Fi / 4G Solar cameras support internal SD recording; NVR is optional'
                          : `Matching channels for ${totalCameraCount} camera(s) (Auto-recommended: ${recommendedRecorder?.name || 'Auto'})`
                        }
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                    {/* Auto Recommend Option */}
                    <div
                      onClick={() => { 
                        setSelectedRecorderId('auto'); 
                        advanceToStep(4, `Recorder set to Auto Matching (${recommendedRecorder?.name || 'None'}). Next: Select Rack Enclosure.`); 
                      }}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: selectedRecorderId === 'auto' ? '#eff6ff' : '#f8fafc',
                        border: selectedRecorderId === 'auto' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: selectedRecorderId === 'auto' ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 800 }}>★ AUTO MATCHING</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {resolvedRecorder ? resolvedRecorder.name.split('-')[0] : 'Auto Matching'}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                        ₹{(resolvedRecorder?.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Specific Recorders from catalog */}
                    {recorderProducts.map(rec => {
                      const isSelected = selectedRecorderId === rec.id;
                      return (
                        <div
                          key={rec.id}
                          onClick={() => { 
                            setSelectedRecorderId(rec.id); 
                            advanceToStep(4, `Selected Recorder: ${rec.name}. Next: Select Rack Enclosure.`); 
                          }}
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            background: isSelected ? '#eff6ff' : '#f8fafc',
                            border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            textAlign: 'center',
                            boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none'
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{rec.brand}</div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {rec.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                            ₹{(rec.price || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      );
                    })}

                    {/* None / Standalone Option */}
                    <div
                      onClick={() => { 
                        setSelectedRecorderId('none'); 
                        advanceToStep(4, `Recorder skipped. Next: Select CCTV Wall Mount Rack.`); 
                      }}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: selectedRecorderId === 'none' ? '#fef2f2' : '#f8fafc',
                        border: selectedRecorderId === 'none' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>No NVR / Standalone</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>₹0 (Skip)</div>
                    </div>
                  </div>
                </div>

                {/* STEP 4: CCTV Rack Enclosure Selection */}
                <div 
                  id="estimator-step-4"
                  style={{
                    background: '#ffffff',
                    border: activeStep === 4 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    boxShadow: activeStep === 4 ? '0 4px 20px rgba(37, 99, 235, 0.1)' : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'border 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div 
                    onClick={() => setActiveStep(4)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', cursor: 'pointer' }}
                  >
                    <span style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: activeStep >= 4 ? '#2563eb' : '#94a3b8',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      4
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        Step 4: Select CCTV Wall Mount Rack
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Lockable metal chassis to secure DVR, HDD, power supply &amp; wiring
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    <div
                      onClick={() => { 
                        setSelectedRackId('none'); 
                        advanceToStep(5, `Rack excluded. Next: Review cables, power supplies & connectors.`); 
                      }}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: selectedRackId === 'none' ? '#fef2f2' : '#f8fafc',
                        border: selectedRackId === 'none' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>No Rack Enclosure</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>₹0 (Skip)</div>
                    </div>

                    {rackProducts.map(rk => {
                      const isSelected = selectedRackId === rk.id;
                      return (
                        <div
                          key={rk.id}
                          onClick={() => { 
                            setSelectedRackId(rk.id); 
                            advanceToStep(5, `Rack selected: ${rk.name}. Next: Review accessories & connectors.`); 
                          }}
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            background: isSelected ? '#eff6ff' : '#f8fafc',
                            border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            textAlign: 'center',
                            boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none'
                          }}
                        >
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {rk.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                            ₹{(rk.price || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 5: Cables, Power, Connectors & Installation Options */}
                <div 
                  id="estimator-step-5"
                  style={{
                    background: '#ffffff',
                    border: activeStep === 5 ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    boxShadow: activeStep === 5 ? '0 4px 20px rgba(37, 99, 235, 0.1)' : '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'border 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div 
                    onClick={() => setActiveStep(5)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', cursor: 'pointer' }}
                  >
                    <span style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: activeStep >= 5 ? '#2563eb' : '#94a3b8',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      5
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        Step 5: Cables, Power, Connectors &amp; Doorstep Setup
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Turnkey accessories required for {totalCameraCount} camera points (Toggle to customize)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {/* Power Supply Toggle */}
                    <div 
                      onClick={() => setIncludePowerSupply(!includePowerSupply)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: includePowerSupply ? '#eff6ff' : '#f8fafc',
                        border: includePowerSupply ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                          {hasIpCameras ? 'PoE Switch Unit' : 'SMPS Power Supply'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {resolvedPower ? resolvedPower.name.slice(0, 25) : 'Auto assigned'}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: includePowerSupply ? '#059669' : '#94a3b8' }}>
                        {includePowerSupply ? `+₹${powerTotal.toLocaleString('en-IN')}` : 'Excluded'}
                      </div>
                    </div>

                    {/* Cable Bundle Toggle */}
                    <div 
                      onClick={() => setIncludeCables(!includeCables)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: includeCables ? '#eff6ff' : '#f8fafc',
                        border: includeCables ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                          {hasIpCameras ? 'Pure Copper Cat6' : '3+1 CCTV Cable'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          ~{totalCameraCount * 20}m wiring run
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: includeCables ? '#059669' : '#94a3b8' }}>
                        {includeCables ? `+₹${cableTotal.toLocaleString('en-IN')}` : 'Excluded'}
                      </div>
                    </div>

                    {/* Connectors & Modular Boxes Toggle */}
                    <div 
                      onClick={() => setIncludeConnectors(!includeConnectors)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: includeConnectors ? '#eff6ff' : '#f8fafc',
                        border: includeConnectors ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                          Connectors &amp; Modular Boxes
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {hasIpCameras ? 'RJ45 + Modular Boxes' : 'BNC + DC + Modular Boxes'}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: includeConnectors ? '#059669' : '#94a3b8' }}>
                        {includeConnectors ? `+₹${connectorsTotalCost.toLocaleString('en-IN')}` : 'Excluded'}
                      </div>
                    </div>

                    {/* Turnkey Installation Toggle */}
                    <div 
                      onClick={() => setIncludeInstallation(!includeInstallation)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: includeInstallation ? '#eff6ff' : '#f8fafc',
                        border: includeInstallation ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                          Doorstep Fitting &amp; Setup
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Davanagere district fitting &amp; app config ({totalCameraCount} points)
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: includeInstallation ? '#059669' : '#94a3b8' }}>
                        {includeInstallation ? `+₹${installationTotalCost.toLocaleString('en-IN')}` : 'Self Install'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT: Live Estimated Bill Breakdown Card */}
              <div style={{
                position: 'sticky',
                top: '80px',
                background: '#ffffff',
                border: '2px solid #bfdbfe',
                borderRadius: '16px',
                padding: '22px',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 800, textTransform: 'uppercase' }}>
                      Live Package Summary
                    </span>
                    <h3 style={{ margin: '2px 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                      {totalCameraCount} Camera CCTV Package
                    </h3>
                  </div>
                  <span style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    border: '1px solid #a7f3d0',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '9999px'
                  }}>
                    Live Store Rates
                  </span>
                </div>

                {/* Itemized List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', marginBottom: '18px' }}>
                  
                  {/* Selected Cameras (Lists each camera model selected) */}
                  {selectedCamerasList.length === 0 ? (
                    <div style={{ color: '#dc2626', fontSize: '0.82rem', padding: '6px 0', fontWeight: 600 }}>
                      No cameras selected yet
                    </div>
                  ) : (
                    selectedCamerasList.map(({ product, quantity }) => (
                      <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            📷 {quantity}x {product.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            ₹{(product.price || 0).toLocaleString('en-IN')} each
                          </div>
                        </div>
                        <div style={{ fontWeight: 800, color: '#0f172a', flexShrink: 0 }}>
                          ₹{((product.price || 0) * quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))
                  )}

                  {/* HDD */}
                  {resolvedHdd && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          💾 {resolvedHdd.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Continuous Recording Storage
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{(resolvedHdd.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* Recorder */}
                  {resolvedRecorder && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          📼 {resolvedRecorder.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Recording Control Unit
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{(resolvedRecorder.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* Rack */}
                  {resolvedRack && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          🗄️ {resolvedRack.name}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{(resolvedRack.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* Power */}
                  {resolvedPower && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          ⚡ {resolvedPower.name}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{powerTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* Cabling */}
                  {resolvedCable && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          🔌 {resolvedCable.name.slice(0, 24)} (~{totalCameraCount * 20}m)
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{cableTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* Connectors */}
                  {connectorsTotalCost > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          🔩 Connectors &amp; Modular Boxes
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{connectorsTotalCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* Installation */}
                  {includeInstallation && totalCameraCount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          🛠️ Fitting &amp; Mobile App Setup
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{installationTotalCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                </div>

                {/* Total Sum Display */}
                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '18px',
                  border: '1.5px solid #bfdbfe'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 700 }}>
                      Estimated Package Total:
                    </span>
                    <span style={{
                      fontSize: '1.65rem',
                      fontWeight: 900,
                      color: '#15803d',
                      fontFamily: 'Outfit, sans-serif'
                    }}>
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>
                    ✓ GST &amp; Genuine Brand Warranty Included
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <MessageSquare size={18} />
                    <span>Get This Quotation on WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${SHOP_INFO.phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '11px 18px',
                      borderRadius: '10px',
                      background: '#f8fafc',
                      color: '#334155',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    <Phone size={16} />
                    <span>Call Store (+91 63664 06305)</span>
                  </a>

                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: '4px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                        e.currentTarget.style.color = '#dc2626';
                        e.currentTarget.style.borderColor = '#fca5a5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }}
                    >
                      <X size={16} />
                      <span>Close &amp; Return to Shop</span>
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
