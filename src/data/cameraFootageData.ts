import { Product } from '../types';

export interface CameraFootageInfo {
  resolutionLabel: string;
  resolutionPixels: string;
  fps: number;
  bitrate: string;
  sensor: string;
  lens: string;
  nightVisionType: 'dual_light' | 'infrared' | 'starlight';
  nightVisionDistance: string;
  supportsColorNight: boolean;
  audio: string;
  weatherRating: string;
  videoDay: string;
  videoNight: string;
}

export function isCameraProduct(product: Product): boolean {
  if (['ip_cameras', 'hd_analog', 'wifi_4g'].includes(product.category)) return true;
  if (product.category === 'solar') {
    if (product.name.toLowerCase().includes('panel with battery kit') || product.name.toLowerCase().includes('cp-sl06k')) {
      return false; // solar kit only
    }
    return true; // solar camera
  }
  const n = product.name.toLowerCase();
  if (n.includes('camera') && !n.includes('cable') && !n.includes('rack') && !n.includes('box')) {
    return true;
  }
  return false;
}

export function is360Product(product: Product): boolean {
  if (product.is360Camera === true) return true;
  if (product.is360Camera === false) return false;
  const n = product.name.toUpperCase();
  return (
    n.includes('360') ||
    n.includes('PT') ||
    n.includes('PTZ') ||
    n.includes('PAN & TILT') ||
    n.includes('PAN-TILT') ||
    n.includes('LINKAGE') ||
    n.includes('TRIPLE LENS')
  );
}

export function getCameraFootageInfo(product: Product): CameraFootageInfo {
  const name = product.name.toUpperCase();
  let baseInfo: CameraFootageInfo;

  // 1. 6MP Cameras
  if (name.includes('6MP') || name.includes('SM1005')) {
    baseInfo = {
      resolutionLabel: '6MP Ultra HD (3200 × 1800)',
      resolutionPixels: '3200 × 1800',
      fps: 25,
      bitrate: '5120 Kbps (H.265+ Smart Codec)',
      sensor: '1/2.8" Starlight Multi-Lens CMOS Sensor',
      lens: 'Triple Lens (4mm Fixed + 4mm Panoramic + 12mm Telephoto Zoom)',
      nightVisionType: 'dual_light',
      nightVisionDistance: '40 Meters Smart Full Color & IR',
      supportsColorNight: true,
      audio: 'Two-Way Audio Intercom with Noise Cancellation',
      weatherRating: 'IP66 Weatherproof Heavy Duty Housing',
      videoDay: '/videos/cctv_outdoor.mp4',
      videoNight: '/videos/cctv_street.mp4'
    };
  } else if (name.includes('4MP') || name.includes('TA41') || name.includes('DA41')) {
    // 2. 4MP Cameras
    const isLongRange = name.includes('60M') || name.includes('0600');
    const isIllumax = name.includes('ILLUAMX') || name.includes('ILLUMAX') || name.includes('DUAL LIGHT') || name.includes('DUAL IR');
    baseInfo = {
      resolutionLabel: '4MP 2K QHD (2688 × 1520)',
      resolutionPixels: '2688 × 1520',
      fps: 25,
      bitrate: '4096 Kbps (InstaStream H.265+)',
      sensor: '1/2.9" 4MP PS CMOS High-Sensitivity Sensor',
      lens: isLongRange ? '6.0mm Long Range Lens (60m IR Throw)' : '3.6mm Wide Angle (88° Field of View)',
      nightVisionType: isIllumax ? 'dual_light' : 'infrared',
      nightVisionDistance: isLongRange ? '60 Meters Heavy Infrared Distance' : '30 Meters Dual Light / IR Array',
      supportsColorNight: isIllumax,
      audio: 'Built-in High Sensitivity Microphone (-38dB)',
      weatherRating: 'IP67 Metal Waterproof & Dustproof',
      videoDay: '/videos/cctv_street.mp4',
      videoNight: '/videos/cctv_outdoor.mp4'
    };
  } else if (name.includes('3MP') || name.includes('T18120') || name.includes('T18290') || name.includes('T18238')) {
    // 3. 3MP Cameras (Trueview WiFi / 4G PTZ)
    const isPTZ = name.includes('PT') || name.includes('360');
    baseInfo = {
      resolutionLabel: '3MP 2K HD (2304 × 1296)',
      resolutionPixels: '2304 × 1296',
      fps: 25,
      bitrate: '3072 Kbps (H.265 Compression)',
      sensor: '1/2.9" Progressive Scan CMOS Sensor',
      lens: isPTZ ? '3.6mm Motorized Pan-Tilt (Pan 266°, Tilt 90°)' : '3.6mm Fixed Wide Angle Lens',
      nightVisionType: 'dual_light',
      nightVisionDistance: '30 Meters All-Time Color Vision & IR',
      supportsColorNight: true,
      audio: isPTZ ? 'Two-Way Real-time Audio Speaker & Mic' : 'Built-in High Gain Microphone',
      weatherRating: 'IP66 Weatherproof for Extreme Indian Climate',
      videoDay: '/videos/cctv_outdoor.mp4',
      videoNight: '/videos/cctv_street.mp4'
    };
  } else if (name.includes('EYEQUBE') || product.category === 'solar') {
    // 4. Solar Cameras (EyeQube / OEM)
    baseInfo = {
      resolutionLabel: '3MP / 4MP Solar 4G HD (2304 × 1296)',
      resolutionPixels: '2304 × 1296',
      fps: 20,
      bitrate: '2560 Kbps (Low-Power 4G SIM Protocol)',
      sensor: 'Ultra Low Power Dual Sensor PIR + Radar Detection',
      lens: 'Dual Lens Panoramic & Tracking (Pan 355°, Tilt 90°)',
      nightVisionType: 'dual_light',
      nightVisionDistance: '30 Meters Dual IR + White Floodlight',
      supportsColorNight: true,
      audio: 'Two-Way Loud Intercom with Siren Alert',
      weatherRating: 'IP66 Solar Sealed Enclosure',
      videoDay: '/videos/cctv_outdoor.mp4',
      videoNight: '/videos/cctv_street.mp4'
    };
  } else {
    // 5. 2.4MP / 2MP HD & Analog / IP Cameras
    const isDualLight = name.includes('DUAL LIGHT') || name.includes('DUAL IR');
    baseInfo = {
      resolutionLabel: name.includes('2.4MP') ? '2.4MP Full HD (1920 × 1080)' : '2MP 1080p Full HD (1920 × 1080)',
      resolutionPixels: '1920 × 1080',
      fps: 30,
      bitrate: '2048 Kbps (H.264 / H.265)',
      sensor: '1/2.7" 2MP Progressive High-Speed Sensor',
      lens: '3.6mm High Definition CCTV Lens',
      nightVisionType: isDualLight ? 'dual_light' : 'infrared',
      nightVisionDistance: '20 - 30 Meters Smart IR Distance',
      supportsColorNight: isDualLight,
      audio: name.includes('MIC') ? 'Built-in Audio Mic' : 'Standard Audio Over Coax / IP',
      weatherRating: 'IP67 / IP66 Weather Resistant',
      videoDay: '/videos/cctv_street.mp4',
      videoNight: '/videos/cctv_outdoor.mp4'
    };
  }

  // Admin Custom Video URL overrides (Day & Night)
  if (product.sampleVideoUrl && product.sampleVideoUrl.trim()) {
    baseInfo.videoDay = product.sampleVideoUrl.trim();
  }
  if (product.nightVideoUrl && product.nightVideoUrl.trim()) {
    baseInfo.videoNight = product.nightVideoUrl.trim();
  } else if (product.sampleVideoUrl && product.sampleVideoUrl.trim()) {
    baseInfo.videoNight = product.sampleVideoUrl.trim();
  }

  return baseInfo;
}
