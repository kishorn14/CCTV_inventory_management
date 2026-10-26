import { Product } from '../types/index';
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
  const { products, cctvPricing } = useShop();

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
  // Starts empty so no camera is pre-selected by default
  const [cameraQuantities, setCameraQuantities] = useState<Record<string, number>>({});

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
  const [selectedRackId, setSelectedRackId] = useState<string>('auto'); // 'auto' (2U Rack) | 'none' | specific id
  const [includePowerSupply, setIncludePowerSupply] = useState<boolean>(true);
  const [includeCables, setIncludeCables] = useState<boolean>(true);
  const [includeConnectors, setIncludeConnectors] = useState<boolean>(true);
  const [includeInstallation, setIncludeInstallation] = useState<boolean>(true);

  // Active step guide (1 to 5)
  const [activeStep, setActiveStep] = useState<number>(1);

  const advanceToStep = (step: number, _message?: string) => {
    setActiveStep(step);
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

  // Breakdown of selected cameras by type: Bullet vs Dome
  const bulletCameraCount = useMemo(() => {
    return selectedCamerasList.reduce((sum, item) => {
      const n = (item.product.name + ' ' + (item.product.badge || '')).toLowerCase();
      if (n.includes('bullet')) return sum + item.quantity;
      return sum;
    }, 0);
  }, [selectedCamerasList]);

  const domeCameraCount = useMemo(() => {
    return selectedCamerasList.reduce((sum, item) => {
      const n = (item.product.name + ' ' + (item.product.badge || '')).toLowerCase();
      if (n.includes('dome')) return sum + item.quantity;
      return sum;
    }, 0);
  }, [selectedCamerasList]);

  const otherCameraCount = useMemo(() => {
    return Math.max(0, totalCameraCount - (bulletCameraCount + domeCameraCount));
  }, [totalCameraCount, bulletCameraCount, domeCameraCount]);

  // Helper functions for camera classification matching admin-configured categories
  const isSolarCamera = (p: Product): boolean => {
    if (p.categoryId === 'cat-1' || p.categoryNumber === 1) return true;
    if (p.category === 'solar') return true;
    const n = (p.name + ' ' + (p.badge || '')).toLowerCase();
    return n.includes('solar');
  };

  const isWifiCamera = (p: Product): boolean => {
    if (isSolarCamera(p)) return false;
    if (p.categoryId === 'cat-2' || p.categoryNumber === 2) return true;
    if (p.category === 'wifi_4g') return true;
    const n = (p.name + ' ' + (p.badge || '')).toLowerCase();
    return n.includes('wifi') || n.includes('wi-fi') || n.includes('360') || (p.is360Camera === true);
  };

  const isIpCamera = (p: Product): boolean => {
    if (isSolarCamera(p) || isWifiCamera(p)) return false;
    if (p.categoryId === 'cat-3' || p.categoryNumber === 3) return true;
    if (p.category === 'ip_cameras') return true;
    return /\bIP\b/i.test(p.name) || p.name.toLowerCase().includes('network camera');
  };

  const isAnalogCamera = (p: Product): boolean => {
    if (isSolarCamera(p) || isWifiCamera(p) || isIpCamera(p)) return false;
    if (p.categoryId === 'cat-4' || p.categoryNumber === 4) return true;
    if (p.category === 'hd_analog') return true;
    return true;
  };

  // Live counts for category tabs
  const solarCount = useMemo(() => cameraProducts.filter(isSolarCamera).length, [cameraProducts]);
  const wifiCount = useMemo(() => cameraProducts.filter(isWifiCamera).length, [cameraProducts]);
  const ipCount = useMemo(() => cameraProducts.filter(isIpCamera).length, [cameraProducts]);
  const analogCount = useMemo(() => cameraProducts.filter(isAnalogCamera).length, [cameraProducts]);

  // Check if any selected camera is an IP camera
  const hasIpCameras = useMemo(() => {
    return selectedCamerasList.some(item => isIpCamera(item.product));
  }, [selectedCamerasList]);

  // Check if all selected cameras are standalone (Wi-Fi or Solar)
  const isAllStandalone = useMemo(() => {
    return selectedCamerasList.length > 0 && selectedCamerasList.every(item => 
      isSolarCamera(item.product) || isWifiCamera(item.product)
    );
  }, [selectedCamerasList]);

  // Filtered cameras for Step 1
  const filteredCameras = useMemo(() => {
    if (cameraFilter === 'all') return cameraProducts;
    if (cameraFilter === 'ip') return cameraProducts.filter(isIpCamera);
    if (cameraFilter === 'analog') return cameraProducts.filter(isAnalogCamera);
    if (cameraFilter === 'wifi') return cameraProducts.filter(isWifiCamera);
    if (cameraFilter === 'solar') return cameraProducts.filter(isSolarCamera);
    return cameraProducts;
  }, [cameraProducts, cameraFilter]);

  // Dynamic Auto Recommendations for Recorder (scaled to totalCameraCount)
  // <= 4 cameras: 4-Channel NVR / DVR
  // 5 to 8 cameras: 8-Channel NVR / DVR
  // > 8 cameras: 16-Channel / 32-Channel NVR
  const recommendedRecorder = useMemo(() => {
    if (isAllStandalone) return null;
    if (hasIpCameras) {
      if (effectiveCameraCount <= 4) {
        return recorderProducts.find(p => p.name.includes('4CH') && p.name.includes('NVR')) ||
               recorderProducts.find(p => p.id === 'prod-51') ||
               recorderProducts.find(p => p.name.includes('8CH')) ||
               recorderProducts[0];
      } else if (effectiveCameraCount <= 8) {
        return recorderProducts.find(p => p.name.includes('8CH') && p.name.includes('NVR')) ||
               recorderProducts.find(p => p.id === 'prod-25') ||
               recorderProducts[0];
      } else if (effectiveCameraCount <= 16) {
        return recorderProducts.find(p => p.name.includes('16CH')) ||
               recorderProducts.find(p => p.id === 'prod-23') ||
               recorderProducts[0];
      } else {
        return recorderProducts.find(p => p.name.includes('32CH')) ||
               recorderProducts.find(p => p.id === 'prod-24') ||
               recorderProducts[0];
      }
    } else {
      // Analog DVR: 4CH for <= 4 cams, 8CH for 5 to 8 cams, 16CH for > 8 cams
      if (effectiveCameraCount <= 4) {
        return recorderProducts.find(p => p.name.includes('4CH') && p.name.includes('DVR')) ||
               recorderProducts.find(p => p.id === 'prod-26') ||
               recorderProducts[0];
      } else if (effectiveCameraCount <= 8) {
        return recorderProducts.find(p => p.name.includes('8CH') && p.name.includes('DVR')) ||
               recorderProducts.find(p => p.id === 'prod-53') ||
               recorderProducts.find(p => p.name.includes('8CH')) ||
               recorderProducts[0];
      } else {
        return recorderProducts.find(p => p.name.includes('16CH') && p.name.includes('DVR')) ||
               recorderProducts.find(p => p.id === 'prod-54') ||
               recorderProducts.find(p => p.name.includes('16CH')) ||
               recorderProducts[0];
      }
    }
  }, [effectiveCameraCount, hasIpCameras, isAllStandalone, recorderProducts]);

  const resolvedRecorder = useMemo(() => {
    if (selectedRecorderId === 'none') return null;
    if (selectedRecorderId === 'auto') return recommendedRecorder;
    return recorderProducts.find(p => p.id === selectedRecorderId) || null;
  }, [selectedRecorderId, recommendedRecorder, recorderProducts]);

  // Recommended HDD Storage (scaled to totalCameraCount)
  // For Analog: 1-2 cams: 500GB, 3-4 cams: 1TB, 5-8 cams: 2TB, > 8 cams: 4TB
  // For IP: <= 4 cams: 1TB, 5-8 cams: 2TB, > 8 cams: 4TB
  const recommendedHdd = useMemo(() => {
    if (isAllStandalone) {
      return hddProducts.find(p => p.name.includes('128 GB') && (p.name.toUpperCase().includes('SD') || p.badge?.toUpperCase().includes('SD'))) ||
             hddProducts.find(p => p.name.toUpperCase().includes('SD') || p.badge?.toUpperCase().includes('SD')) ||
             hddProducts[0];
    }
    if (hasIpCameras) {
      if (effectiveCameraCount <= 4) {
        return hddProducts.find(p => p.name.includes('1TB')) || hddProducts.find(p => p.name.includes('500GB')) || hddProducts[0];
      } else if (effectiveCameraCount <= 8) {
        return hddProducts.find(p => p.name.includes('2TB')) || hddProducts.find(p => p.name.includes('1TB')) || hddProducts[0];
      } else {
        return hddProducts.find(p => p.name.includes('4TB')) || hddProducts.find(p => p.name.includes('2TB')) || hddProducts[0];
      }
    } else {
      // Analog system
      if (effectiveCameraCount <= 2) {
        return hddProducts.find(p => p.name.includes('500GB') || p.name.includes('500 GB')) ||
               hddProducts.find(p => p.id === 'prod-17') ||
               hddProducts.find(p => p.name.includes('1TB')) ||
               hddProducts[0];
      } else if (effectiveCameraCount <= 4) {
        return hddProducts.find(p => p.name.includes('1TB')) ||
               hddProducts.find(p => p.id === 'prod-18') ||
               hddProducts[0];
      } else if (effectiveCameraCount <= 8) {
        return hddProducts.find(p => p.name.includes('2TB')) ||
               hddProducts.find(p => p.id === 'prod-19') ||
               hddProducts[0];
      } else {
        return hddProducts.find(p => p.name.includes('4TB')) ||
               hddProducts.find(p => p.id === 'prod-20') ||
               hddProducts[0];
      }
    }
  }, [effectiveCameraCount, hasIpCameras, isAllStandalone, hddProducts]);

  const resolvedHdd = useMemo(() => {
    if (selectedHddId === 'none') return null;
    if (selectedHddId === 'auto') return recommendedHdd;
    return hddProducts.find(p => p.id === selectedHddId) || null;
  }, [selectedHddId, recommendedHdd, hddProducts]);

  // Filtered storage catalog for Step 2: MicroSD cards for standalone, SATA HDDs for wired
  const displayedStorageProducts = useMemo(() => {
    if (isAllStandalone) {
      const sdCards = hddProducts.filter(p => p.name.toUpperCase().includes('SD') || p.badge?.toUpperCase().includes('SD'));
      return sdCards.length > 0 ? sdCards : hddProducts;
    }
    const hdds = hddProducts.filter(p => !p.name.toUpperCase().includes('SD') && !p.badge?.toUpperCase().includes('SD'));
    return hdds.length > 0 ? hdds : hddProducts;
  }, [hddProducts, isAllStandalone]);

  // Selected Rack: 2U Wall Mount Rack auto-selected by default for wired systems.
  // Not required for Wi-Fi / Solar standalone cameras.
  const recommendedRack = useMemo(() => {
    if (isAllStandalone) return null;
    return rackProducts.find(p => p.name.toUpperCase().includes('2U')) ||
           rackProducts.find(p => p.id === 'prod-34') ||
           rackProducts[0] || null;
  }, [rackProducts, isAllStandalone]);

  const resolvedRack = useMemo(() => {
    if (isAllStandalone) {
      if (selectedRackId === 'auto' || selectedRackId === 'none') return null;
      return rackProducts.find(p => p.id === selectedRackId) || null;
    }
    if (selectedRackId === 'none' || totalCameraCount === 0) return null;
    if (selectedRackId === 'auto') return recommendedRack;
    return rackProducts.find(p => p.id === selectedRackId) || null;
  }, [selectedRackId, recommendedRack, rackProducts, totalCameraCount, isAllStandalone]);

  // Resolved Power (PoE switch for IP or SMPS for Analog)
  // Analog: <= 4 cameras: 4CH SMPS; > 4 cameras: 8CH SMPS
  const resolvedPower = useMemo(() => {
    if (!includePowerSupply) return null;
    if (isAllStandalone) return null;
    if (hasIpCameras) {
      if (effectiveCameraCount <= 4) {
        return powerProducts.find(p => p.id === 'prod-52' || (p.name.includes('4') && (p.name.includes('POE') || p.name.includes('PoE')))) ||
               powerProducts.find(p => p.name.includes('POE') || p.name.includes('PoE')) ||
               powerProducts[0];
      } else {
        return powerProducts.find(p => p.name.includes('8') && (p.name.includes('POE') || p.name.includes('PoE'))) ||
               powerProducts.find(p => p.name.includes('POE') || p.name.includes('PoE')) ||
               powerProducts[0];
      }
    } else {
      if (effectiveCameraCount <= 4) {
        return powerProducts.find(p => p.name.includes('4CH') && p.name.includes('SMPS')) || 
               powerProducts.find(p => p.id === 'prod-39') ||
               powerProducts[0];
      } else {
        return powerProducts.find(p => p.name.includes('8CH') && p.name.includes('SMPS')) || 
               powerProducts.find(p => p.id === 'prod-40') ||
               powerProducts[0];
      }
    }
  }, [includePowerSupply, hasIpCameras, isAllStandalone, effectiveCameraCount, powerProducts]);

  // Resolved Cable (Cat6 Pure Copper for IP, 3+1 for Analog)
  const resolvedCable = useMemo(() => {
    if (!includeCables) return null;
    if (isAllStandalone) return null;
    if (hasIpCameras) {
      return cableProducts.find(p => p.name.includes('Cat6 cable pure copper')) || cableProducts[0];
    } else {
      return cableProducts.find(p => p.name.includes('3+1')) || cableProducts[0];
    }
  }, [includeCables, hasIpCameras, isAllStandalone, cableProducts]);

  // Cable Length in Meters:
  // For IP cameras: Math.max(totalCameraCount * 20, 40)m
  // For Analog cameras: totalCameraCount * 25m (25m per 1 camera)
  const cableMeters = useMemo(() => {
    if (totalCameraCount === 0) return 0;
    if (hasIpCameras) {
      return Math.max(totalCameraCount * 20, 40);
    } else {
      return totalCameraCount * 25;
    }
  }, [totalCameraCount, hasIpCameras]);

  const cableTotal = useMemo(() => {
    if (totalCameraCount === 0 || !resolvedCable) return 0;
    if (hasIpCameras) {
      if (resolvedCable.name.includes('305M')) return resolvedCable.price || 0;
      return (resolvedCable.price || 47) * cableMeters;
    } else {
      // 3+1 CCTV Cable per meter rate (from ₹1711/90m ≈ ₹19/m or ₹22/m)
      const perMeterRate = resolvedCable.price && resolvedCable.price < 50
        ? resolvedCable.price
        : Math.round((resolvedCable.price || 1711) / 90);
      return perMeterRate * cableMeters;
    }
  }, [resolvedCable, totalCameraCount, hasIpCameras, cableMeters]);

  // RJ45 Connectors for IP Cameras: (totalCameraCount * 2 + 2)
  const rj45Count = totalCameraCount > 0 ? (totalCameraCount * 2 + 2) : 0;
  const rj45Product = useMemo(() => {
    return products.find(p => p.id === 'prod-45') || products.find(p => p.name.includes('RJ45')) || null;
  }, [products]);
  const rj45UnitPrice = rj45Product?.price || 9;
  const rj45TotalCost = hasIpCameras && includeConnectors && !isAllStandalone ? rj45Count * rj45UnitPrice : 0;

  // BNC Connectors for Analog Cameras: 2 per camera + 2 additional
  const bncCount = totalCameraCount > 0 ? (totalCameraCount * 2 + 2) : 0;
  const bncProduct = useMemo(() => {
    return products.find(p => p.id === 'prod-49') || products.find(p => p.name.includes('BNC')) || null;
  }, [products]);
  const bncUnitPrice = bncProduct?.price || 47;
  const bncTotalCost = !hasIpCameras && includeConnectors && !isAllStandalone ? bncCount * bncUnitPrice : 0;

  // DC Power Pins for Analog Cameras: 1 per camera + 1 additional
  const dcPinCount = totalCameraCount > 0 ? (totalCameraCount * 1 + 1) : 0;
  const dcPinProduct = useMemo(() => {
    return products.find(p => p.id === 'prod-48') || products.find(p => p.name.includes('DC PINS') || p.name.includes('DC')) || null;
  }, [products]);
  const dcPinUnitPrice = dcPinProduct?.price || 12;
  const dcPinTotalCost = !hasIpCameras && includeConnectors && !isAllStandalone ? dcPinCount * dcPinUnitPrice : 0;

  // 4x4 Modular Box for Bullet Cameras: 1 per camera
  const box4x4Product = useMemo(() => {
    return products.find(p => p.id === 'prod-46') || products.find(p => p.name.includes('4X4')) || null;
  }, [products]);
  const box4x4UnitPrice = box4x4Product?.price || 53;
  const box4x4Count = bulletCameraCount + otherCameraCount;
  const box4x4TotalCost = includeConnectors && !isAllStandalone ? box4x4Count * box4x4UnitPrice : 0;

  // 5x5 Modular Box for Dome Cameras: 1 per camera
  const box5x5Product = useMemo(() => {
    return products.find(p => p.id === 'prod-47') || products.find(p => p.name.includes('5X5')) || null;
  }, [products]);
  const box5x5UnitPrice = box5x5Product?.price || 65;
  const box5x5Count = domeCameraCount;
  const box5x5TotalCost = includeConnectors && !isAllStandalone ? box5x5Count * box5x5UnitPrice : 0;

  // Total Connectors & Accessories Cost
  const connectorsTotalCost = totalCameraCount === 0 || !includeConnectors || isAllStandalone 
    ? 0 
    : (hasIpCameras 
        ? (rj45TotalCost + box4x4TotalCost + box5x5TotalCost) 
        : (bncTotalCost + dcPinTotalCost + box4x4TotalCost + box5x5TotalCost));

  // Doorstep Installation labor rate (dynamically sourced from Admin CCTV Pricing Portal)
  const installationUnitCost = useMemo(() => {
    if (isAllStandalone) {
      return cctvPricing?.wifiFittingPerCamera ?? 600;
    }
    return cctvPricing?.installationPerCamera ?? (hasIpCameras ? 600 : 600);
  }, [isAllStandalone, hasIpCameras, cctvPricing]);
  const installationTotalCost = includeInstallation ? installationUnitCost * totalCameraCount : 0;

  // Total Camera Cost across all types
  const cameraTotal = useMemo(() => {
    return selectedCamerasList.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  }, [selectedCamerasList]);

  // Storage quantity: For Wi-Fi / Solar standalone cameras, every camera requires its own individual MicroSD card.
  // For wired DVR/NVR systems, a single central HDD is used.
  const storageQty = totalCameraCount > 0 && resolvedHdd 
    ? (isAllStandalone ? totalCameraCount : 1) 
    : 0;

  const hddTotal = resolvedHdd ? (resolvedHdd.price || 0) * storageQty : 0;
  const recorderTotal = totalCameraCount > 0 ? (resolvedRecorder?.price || 0) : 0;
  const rackTotal = totalCameraCount > 0 ? (resolvedRack?.price || 0) : 0;
  const powerTotal = totalCameraCount > 0 ? (resolvedPower?.price || 0) : 0;

  const grandTotal = totalCameraCount === 0 ? 0 : (cameraTotal + hddTotal + recorderTotal + rackTotal + powerTotal + cableTotal + connectorsTotalCost + installationTotalCost);

  // Reset function
  const handleReset = () => {
    setCameraQuantities({});
    setSelectedHddId('auto');
    setSelectedRecorderId('auto');
    setSelectedRackId('auto');
    setIncludePowerSupply(true);
    setIncludeCables(true);
    setIncludeConnectors(true);
    setIncludeInstallation(true);
    setActiveStep(1);
  };

  // WhatsApp Quotation Message (Lists each individual camera model and count)
  const waEstimateText = useMemo(() => {
    if (totalCameraCount === 0) {
      return `Hello Meksha CCTV Solutions, I would like to inquire about CCTV package estimation.`;
    }
    let msg = `*MEKSHA CCTV SOLUTIONS - ESTIMATED PACKAGE QUOTATION*\n`;
    msg += `-------------------------------------------\n`;
    msg += `📷 *Selected Cameras (${totalCameraCount} Total):*\n`;
    selectedCamerasList.forEach(item => {
      const lineCost = (item.product.price || 0) * item.quantity;
      msg += `   • ${item.quantity}x ${item.product.name}\n`;
      msg += `     Rate: ₹${(item.product.price || 0).toLocaleString('en-IN')} × ${item.quantity} = ₹${lineCost.toLocaleString('en-IN')}\n`;
    });
    msg += `   └ Cameras Subtotal: ₹${cameraTotal.toLocaleString('en-IN')}\n\n`;

        if (resolvedHdd && storageQty > 0) {
      if (isAllStandalone) {
        msg += `💾 *Storage (MicroSD):* ${storageQty}x ${resolvedHdd.name} (1 per camera)\n`;
        msg += `   ↳ Rate: ₹${(resolvedHdd.price || 0).toLocaleString('en-IN')} × ${storageQty} = ₹${hddTotal.toLocaleString('en-IN')}\n\n`;
      } else {
        msg += `💾 *Storage:* ${resolvedHdd.name}\n`;
        msg += `   ↳ Price: ₹${(resolvedHdd.price || 0).toLocaleString('en-IN')}\n\n`;
      }
    }

    if (resolvedRecorder) {
      msg += `📼 *Recorder:* ${resolvedRecorder.name}\n`;
      msg += `   └ Price: ₹${(resolvedRecorder.price || 0).toLocaleString('en-IN')}\n\n`;
    }

    if (resolvedPower) {
      msg += `⚡ *Power / PoE Switch:* ${resolvedPower.name}\n`;
      msg += `   └ Price: ₹${powerTotal.toLocaleString('en-IN')}\n\n`;
    }

    if (resolvedRack) {
      msg += `🗄️ *Enclosure:* ${resolvedRack.name}\n`;
      msg += `   └ Price: ₹${rackTotal.toLocaleString('en-IN')}\n\n`;
    }

    if (resolvedCable) {
      msg += `🔌 *Cabling:* ${resolvedCable.name} (~${cableMeters}m${hasIpCameras ? '' : ' - 25m/cam'})\n`;
      msg += `   └ Est. Price: ₹${cableTotal.toLocaleString('en-IN')}\n\n`;
    }

    if (hasIpCameras && !isAllStandalone && includeConnectors && rj45Count > 0) {
      msg += `🔌 *RJ45 Connectors:* ${rj45Count} Pcs\n`;
      msg += `   └ Price: ₹${rj45TotalCost.toLocaleString('en-IN')}\n\n`;
    }

    if (!hasIpCameras && includeConnectors && bncCount > 0 && !isAllStandalone) {
      msg += `🔩 *BNC Connectors:* ${bncCount} Pcs\n`;
      msg += `   └ Price: ₹${bncTotalCost.toLocaleString('en-IN')}\n\n`;
    }

    if (!hasIpCameras && includeConnectors && dcPinCount > 0 && !isAllStandalone) {
      msg += `🔌 *DC Power Pins:* ${dcPinCount} Pcs\n`;
      msg += `   └ Price: ₹${dcPinTotalCost.toLocaleString('en-IN')}\n\n`;
    }

    if (includeConnectors && box4x4Count > 0 && !isAllStandalone) {
      msg += `📦 *4x4 Modular Box (Bullet):* ${box4x4Count}x iFYBER 4x4 Modular Box\n`;
      msg += `   └ Price: ₹${box4x4TotalCost.toLocaleString('en-IN')}\n\n`;
    }

    if (includeConnectors && box5x5Count > 0 && !isAllStandalone) {
      msg += `📦 *5x5 Modular Box (Dome):* ${box5x5Count}x iFYBER 5x5 Modular Box\n`;
      msg += `   └ Price: ₹${box5x5TotalCost.toLocaleString('en-IN')}\n\n`;
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
    rackTotal,
    resolvedPower, 
    powerTotal,
    resolvedCable, 
    cableMeters,
    cableTotal, 
    hasIpCameras,
    includeConnectors,
    rj45Count,
    rj45TotalCost,
    bncCount,
    bncTotalCost,
    dcPinCount,
    dcPinTotalCost,
    box4x4Count,
    box4x4TotalCost,
    box5x5Count,
    box5x5TotalCost,
    isAllStandalone,
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
        <div className="estimator-body">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Estimator Header Banner Inside Modal */}
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: 'clamp(1.25rem, 2.8vw, 1.75rem)', fontWeight: 800, margin: '0 0 14px', color: '#0f172a' }}>
                Customize &amp; Estimate Your CCTV System In Seconds
              </h2>

              {/* Stepper Navigation Strip */}
              <div className="estimator-stepper-strip">
                {[
                  { num: 1, label: `1. Cameras (${totalCameraCount})`, icon: Camera },
                  { num: 2, label: isAllStandalone ? '2. MicroSD Storage' : '2. HDD Storage', icon: HardDrive },
                  { num: 3, label: isAllStandalone ? '3. DVR / NVR (Not Needed)' : '3. DVR / NVR', icon: Server },
                  { num: 4, label: isAllStandalone ? '4. Rack (Not Needed)' : '4. Rack Enclosure', icon: Box },
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
                        gap: '5px',
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
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
                        boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
                        flexShrink: 0
                      }}
                    >
                      {isPast ? <CheckCircle2 size={13} color="#059669" /> : <Icon size={13} />}
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
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    flexShrink: 0
                  }}
                >
                  <RefreshCw size={12} /> Reset
                </button>
              </div>
            </div>

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
                  className={`estimator-step-card ${activeStep === 1 ? 'active-step' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div 
                      onClick={() => setActiveStep(1)} 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#2563eb',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.82rem'
                      }}>
                        1
                      </span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                          Step 1: Select Cameras &amp; Quantities
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
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
                        gap: '4px',
                        background: totalCameraCount > 0 ? '#2563eb' : '#f1f5f9',
                        color: totalCameraCount > 0 ? '#ffffff' : '#94a3b8',
                        border: 'none',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: totalCameraCount > 0 ? 'pointer' : 'default',
                        transition: 'all 0.15s ease'
                      }}
                      disabled={totalCameraCount === 0}
                    >
                      <span>Next: Storage</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* Camera Filter Tabs */}
                  <div className="estimator-filter-tabs">
                    {[
                      { id: 'all', label: `All Cameras (${cameraProducts.length})` },
                      { id: 'ip', label: `CP PLUS IP (${ipCount})` },
                      { id: 'analog', label: `HD Analog (${analogCount})` },
                      { id: 'wifi', label: `360° Wi-Fi & 4G (${wifiCount})` },
                      { id: 'solar', label: `Solar Kit (${solarCount})` }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setCameraFilter(tab.id as any)}
                        className={`estimator-filter-tab ${cameraFilter === tab.id ? 'active' : ''}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Camera List - Clean, simplified product rows */}
                  <div className="estimator-camera-list">
                    {filteredCameras.map(cam => {
                      const qty = cameraQuantities[cam.id] || 0;
                      const isSelected = qty > 0;
                      return (
                        <div
                          key={cam.id}
                          className={`estimator-camera-row ${isSelected ? 'selected' : ''}`}
                        >
                          {/* Left: Thumbnail + Camera Info */}
                          <div className="estimator-camera-info">
                            <img 
                              src={cam.image} 
                              alt={cam.name} 
                              className="estimator-camera-img"
                              loading="lazy"
                            />
                            <div className="estimator-camera-text">
                              <div className="estimator-camera-title" title={cam.name}>
                                {cam.name}
                              </div>
                              <div className="estimator-camera-meta">
                                <span className="estimator-camera-brand">{cam.brand}</span>
                                <span className="estimator-camera-price">
                                  ₹{(cam.price || 0).toLocaleString('en-IN')}
                                </span>
                                {isSelected && (
                                  <span className="estimator-camera-subtotal">
                                    Subtotal: ₹{((cam.price || 0) * qty).toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right: Quantity Controller */}
                          <div className="estimator-camera-actions">
                            {qty === 0 ? (
                              <button
                                type="button"
                                onClick={() => updateCameraQty(cam.id, 1)}
                                className="estimator-add-btn"
                                title="Add camera"
                              >
                                <Plus size={13} /> Add
                              </button>
                            ) : (
                              <div className="estimator-qty-pill">
                                <button
                                  type="button"
                                  onClick={() => updateCameraQty(cam.id, qty - 1)}
                                  className="estimator-qty-btn"
                                  title="Decrease quantity"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="estimator-qty-count">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateCameraQty(cam.id, qty + 1)}
                                  className="estimator-qty-btn"
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
                    <div style={{ textAlign: 'center', color: '#dc2626', fontSize: '0.8rem', marginTop: '10px', fontWeight: 600 }}>
                      ⚠️ Please select quantity for at least 1 camera model above to configure your package.
                    </div>
                  )}
                </div>

                {/* STEP 2: Automatic HDD Storage Selection */}
                <div 
                  id="estimator-step-2"
                  className={`estimator-step-card ${activeStep === 2 ? 'active-step' : ''}`}
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
                        {isAllStandalone ? 'Step 2: Select MicroSD Card Storage' : 'Step 2: Select Hard Disk (HDD) Storage Size'}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {isAllStandalone
                          ? `Continuous CCTV recording storage for ${totalCameraCount} camera${totalCameraCount !== 1 ? 's' : ''} (1 separate SD card required per camera)`
                          : `Continuous CCTV video recording retention for ${totalCameraCount} camera${totalCameraCount !== 1 ? 's' : ''} (Auto-recommended: ${recommendedHdd?.name})`}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '8px' }}>
                    {/* Auto Recommend Option */}
                    <div
                      onClick={() => { 
                        setSelectedHddId('auto'); 
                        advanceToStep(3, isAllStandalone 
                          ? `Storage set to Auto Recommended MicroSD (${recommendedHdd?.name}). Next: DVR/NVR (not needed for standalone).` 
                          : `Storage set to Auto Recommended (${recommendedHdd?.name}). Next: Select DVR / NVR.`); 
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
                        {recommendedHdd 
                          ? (isAllStandalone && storageQty > 1 ? `${recommendedHdd.name.split('-')[0]} (${storageQty}x)` : recommendedHdd.name.split('-')[0]) 
                          : 'Auto Storage'}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                        ₹{((recommendedHdd?.price || 0) * (isAllStandalone ? storageQty : 1)).toLocaleString('en-IN')}
                      </div>
                      {isAllStandalone && storageQty > 1 && (
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                          ₹{(recommendedHdd?.price || 0).toLocaleString('en-IN')} each × {storageQty} cards
                        </div>
                      )}
                    </div>

                    {/* Specific Storage Products from catalog */}
                    {displayedStorageProducts.map(hdd => {
                      const isSelected = selectedHddId === hdd.id;
                      const itemTotal = (hdd.price || 0) * (isAllStandalone ? storageQty : 1);
                      return (
                        <div
                          key={hdd.id}
                          onClick={() => { 
                            setSelectedHddId(hdd.id); 
                            advanceToStep(3, `Selected: ${hdd.name}. Next: Review DVR / NVR.`); 
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
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{hdd.brand || (isAllStandalone ? 'MicroSD Card' : 'HDD')}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {hdd.name}{isAllStandalone && storageQty > 1 ? ` (${storageQty}x)` : ''}
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </div>
                          {isAllStandalone && storageQty > 1 && (
                            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                              ₹{(hdd.price || 0).toLocaleString('en-IN')} each × {storageQty}
                            </div>
                          )}
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
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{isAllStandalone ? 'No SD Card / Have Own Card' : 'Already Have HDD'}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>₹0 (Skip)</div>
                    </div>
                  </div>
                </div>

                {/* STEP 3: Automatic DVR / NVR Unit Selection */}
                <div 
                  id="estimator-step-3"
                  className={`estimator-step-card ${activeStep === 3 ? 'active-step' : ''}`}
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '8px' }}>
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
                  className={`estimator-step-card ${activeStep === 4 ? 'active-step' : ''}`}
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
                        {isAllStandalone 
                          ? 'Rack enclosure is NOT required for Wi-Fi & Solar cameras (No central DVR/NVR chassis needed)'
                          : 'Lockable metal chassis to secure DVR, HDD, power supply & wiring'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '8px' }}>
                    {isAllStandalone ? (
                      /* Standalone: Recommended is No Rack Required */
                      <div
                        onClick={() => { 
                          setSelectedRackId('none'); 
                          advanceToStep(5, `Rack not required for Wi-Fi / Solar cameras. Next: Review installation & accessories.`); 
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          background: selectedRackId === 'none' || selectedRackId === 'auto' ? '#ecfdf5' : '#f8fafc',
                          border: selectedRackId === 'none' || selectedRackId === 'auto' ? '2px solid #10b981' : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: selectedRackId === 'none' || selectedRackId === 'auto' ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 800 }}>✓ RECOMMENDED FOR WI-FI / SOLAR</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                          No Rack Required
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                          ₹0 (Not Needed)
                        </div>
                      </div>
                    ) : (
                      /* Auto Selected 2U Rack Option for Wired */
                      <div
                        onClick={() => { 
                          setSelectedRackId('auto'); 
                          advanceToStep(5, `2U Rack auto-selected. Next: Review cables, power supplies & connectors.`); 
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          background: selectedRackId === 'auto' ? '#eff6ff' : '#f8fafc',
                          border: selectedRackId === 'auto' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: selectedRackId === 'auto' ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 800 }}>★ AUTO MATCHING</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {resolvedRack ? resolvedRack.name : '2U Rack Wall Mount'}
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                          ₹{(resolvedRack?.price || 1416).toLocaleString('en-IN')}
                        </div>
                      </div>
                    )}

                    {!isAllStandalone && (
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
                    )}

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
                  className={`estimator-step-card ${activeStep === 5 ? 'active-step' : ''}`}
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '8px' }}>
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
                          {hasIpCameras ? `~${cableMeters}m wiring run` : `${cableMeters}m wiring run (25m per camera)`}
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
                          {hasIpCameras 
                            ? `RJ45 (${rj45Count} pcs)${box4x4Count > 0 ? ` + 4x4 Box (${box4x4Count})` : ''}${box5x5Count > 0 ? ` + 5x5 Box (${box5x5Count})` : ''}`
                            : (isAllStandalone ? 'Not required for wireless' : `BNC (${bncCount} pcs) + DC (${dcPinCount} pcs)${box4x4Count > 0 ? ` + 4x4 Box (${box4x4Count})` : ''}${box5x5Count > 0 ? ` + 5x5 Box (${box5x5Count})` : ''}`)
                          }
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
                          Davanagere district fitting &amp; app config ({totalCameraCount} point{totalCameraCount !== 1 ? 's' : ''} @ ₹{installationUnitCost}/cam)
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

                  {/* Storage (MicroSD for Standalone / HDD for Wired) */}
                  {totalCameraCount > 0 && resolvedHdd && storageQty > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          💾 {storageQty > 1 ? `${storageQty}x ` : ''}{resolvedHdd.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {isAllStandalone 
                            ? `Continuous Storage (${storageQty} card${storageQty > 1 ? 's' : ''} - 1 per camera @ ₹${(resolvedHdd.price || 0).toLocaleString('en-IN')} each)`
                            : 'Continuous Recording Storage'}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a', flexShrink: 0 }}>
                        ₹{hddTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* Recorder */}
                  {totalCameraCount > 0 && resolvedRecorder && (
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
                  {totalCameraCount > 0 && resolvedRack && (
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
                  {totalCameraCount > 0 && resolvedPower && (
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
                  {totalCameraCount > 0 && resolvedCable && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          🔌 {resolvedCable.name.slice(0, 24)} ({cableMeters}m{hasIpCameras ? '' : ' - 25m/cam'})
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{cableTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* RJ45 Connectors for IP Cameras */}
                  {hasIpCameras && !isAllStandalone && includeConnectors && rj45Count > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          🔌 RJ45 Connectors ({rj45Count} Pcs)
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          ₹{rj45UnitPrice} each
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{rj45TotalCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* BNC Connectors for Analog Cameras */}
                  {!hasIpCameras && includeConnectors && bncCount > 0 && !isAllStandalone && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          🔩 MAXXION Wired BNC Connectors ({bncCount} Pcs)
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          ₹{bncUnitPrice} each
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{bncTotalCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* DC Power Pins for Analog Cameras */}
                  {!hasIpCameras && includeConnectors && dcPinCount > 0 && !isAllStandalone && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          🔌 MAXXION Wired DC Power Pins ({dcPinCount} Pcs)
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          ₹{dcPinUnitPrice} each
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{dcPinTotalCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* 4x4 Modular Box for Bullet Cameras */}
                  {includeConnectors && box4x4Count > 0 && !isAllStandalone && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          📦 iFYBER 4x4 Modular Box ({box4x4Count} Pcs)
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Weatherproof base for bullet cameras
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{box4x4TotalCost.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* 5x5 Modular Box for Dome Cameras */}
                  {includeConnectors && box5x5Count > 0 && !isAllStandalone && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', borderBottom: '1px dashed #f1f5f9', paddingBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          📦 iFYBER 5x5 Modular Box ({box5x5Count} Pcs)
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Weatherproof base for dome cameras
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{box5x5TotalCost.toLocaleString('en-IN')}
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
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {totalCameraCount} camera{totalCameraCount !== 1 ? 's' : ''} @ ₹{installationUnitCost} each
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
                    <span>{totalCameraCount === 0 ? 'Inquire on WhatsApp' : 'Get This Quotation on WhatsApp'}</span>
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
