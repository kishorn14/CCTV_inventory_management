export type CategoryType = 
  | 'all' 
  | 'wifi_4g' 
  | 'ip_cameras' 
  | 'hd_analog' 
  | 'dvr_nvr' 
  | 'solar' 
  | 'storage' 
  | 'networking' 
  | 'cables_power' 
  | 'racks_accessories'
  | 'cctv' 
  | 'kits' 
  | 'wifi' 
  | 'ip_nvr' 
  | 'solar_4g';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  brand: string;
  image: string;
  badge?: string;
  priceRange: string;
  price?: number;
  mrp?: number;
  unit?: string;
  warranty?: string;
  features: string[];
  description: string;
  popular?: boolean;
  comingSoon?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: CategoryType;
  iconName: string;
  shortDesc: string;
  bulletPoints: string[];
  startingPrice?: string;
  responseTime: string;
  comingSoon?: boolean;
}

export interface Review {
  id: string;
  name: string;
  location?: string;
  badge?: string;
  rating: number;
  service: string;
  comment: string;
  date?: string;
  time?: string;
  photos?: string[];
  verified?: boolean;
}

export interface BookingFormData {
  customerName: string;
  phoneNumber: string;
  address: string;
  category: CategoryType;
  serviceType: string;
  preferredTime: string;
  notes?: string;
  locationMapUrl?: string;
  gpsCoordinates?: { lat: number; lng: number };
}

export interface ShopContactInfo {
  shopName: string;
  tagline: string;
  phone: string;
  whatsappPhone: string; // international format without + or spaces e.g. 919876543210
  email: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  workingHours: string;
  workingDays: string;
  instagramUrl?: string;
  googleSheetWebhookUrl?: string;
  googleSheetViewUrl?: string;
}

export interface CctvPricingConfig {
  // Camera unit prices
  hd2mpDome: number;      // HD 2MP Indoor Dome Camera
  hd2mpBullet: number;    // HD 2MP Outdoor Bullet Camera
  hd5mpDome: number;      // HD 5MP Indoor Dome Camera
  hd5mpBullet: number;    // HD 5MP Outdoor Bullet Camera
  ip2mpDome: number;      // IP 2MP Smart Indoor Camera
  ip2mpBullet: number;    // IP 2MP Smart Outdoor Camera
  ip4mpColorVu: number;   // IP 4MP Full-Color Smart Camera
  wifi360Camera: number;  // WiFi 360° Smart Wireless Camera
  solar4gCamera: number;  // Solar 4G Standalone Bullet/PTZ Camera

  // DVR prices (HD Analog)
  dvr4Channel: number;    // 4 Channel HD DVR
  dvr8Channel: number;    // 8 Channel HD DVR
  dvr16Channel: number;   // 16 Channel HD DVR

  // NVR prices (IP Smart PoE Network)
  nvr4Channel: number;    // 4 Channel PoE NVR
  nvr8Channel: number;    // 8 Channel PoE NVR
  nvr16Channel: number;   // 16 Channel PoE NVR

  // Hard disk storage prices
  hdd500GB: number;       // 500GB Surveillance HDD
  hdd1TB: number;         // 1TB Surveillance HDD
  hdd2TB: number;         // 2TB Surveillance HDD
  hdd4TB: number;         // 4TB Surveillance HDD

  // MicroSD Storage (for WiFi & Solar cameras)
  sdCard64GB: number;     // 64GB High-Speed MicroSD
  sdCard128GB: number;    // 128GB High-Speed MicroSD

  // Power supply (SMPS)
  powerSupply4Port: number;
  powerSupply8Port: number;
  powerSupply16Port: number;

  // Cabling per meter
  cablePricePerMeter: number;       // ₹ per meter (e.g. ₹25/m)
  defaultCableMetersPerCam: number; // default meters per camera (e.g. 20m)
  cablePerCamera?: number;          // backwards compat fallback

  // Connectors & Accessories
  modularBoxPerCam: number;         // Weatherproof PVC Modular Junction Box per camera (e.g. ₹120)
  bncConnectorsPerCam: number;      // 2 BNC + 1 DC Pin connector set per camera (e.g. ₹90)
  rack2U: number;                   // 2U Wall Mount DVR/NVR Metal Rack (e.g. ₹1,450)
  wifiRouter4G: number;             // 4G Wi-Fi Router / Dongle for Online Mobile View (e.g. ₹2,100)

  // Installation & Fitting charges
  installationPerCamera: number;    // Wired camera mounting, wiring & setup
  wifiFittingPerCamera: number;     // WiFi camera wall mounting & phone pairing
  solarFittingPerCamera: number;    // Solar panel mounting & pole alignment
}

export const DEFAULT_CCTV_PRICING: CctvPricingConfig = {
  hd2mpDome: 1250,
  hd2mpBullet: 1350,
  hd5mpDome: 1850,
  hd5mpBullet: 1950,
  ip2mpDome: 2400,
  ip2mpBullet: 2600,
  ip4mpColorVu: 3600,
  wifi360Camera: 2199,
  solar4gCamera: 5800,

  dvr4Channel: 2800,
  dvr8Channel: 4200,
  dvr16Channel: 7400,

  nvr4Channel: 4500,
  nvr8Channel: 7200,
  nvr16Channel: 12500,

  hdd500GB: 1800,
  hdd1TB: 3400,
  hdd2TB: 5200,
  hdd4TB: 8900,

  sdCard64GB: 550,
  sdCard128GB: 950,

  powerSupply4Port: 650,
  powerSupply8Port: 1150,
  powerSupply16Port: 1950,

  cablePricePerMeter: 25,
  defaultCableMetersPerCam: 20,
  cablePerCamera: 500,

  modularBoxPerCam: 120,
  bncConnectorsPerCam: 90,
  rack2U: 1450,
  wifiRouter4G: 2100,

  installationPerCamera: 450,
  wifiFittingPerCamera: 350,
  solarFittingPerCamera: 650
};

export interface BrandPartner {
  id: string;
  name: string;
  tagline: string;
  category: 'cctv';
  image: string;
  badge?: string;
}

export const DEFAULT_BRANDS: BrandPartner[] = [
  {
    id: 'brand-hikvision',
    name: 'Hikvision',
    tagline: 'Global Leader in AI & Video Surveillance',
    category: 'cctv',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    badge: 'Global #1 Brand'
  },
  {
    id: 'brand-cpplus',
    name: 'CP PLUS',
    tagline: 'Security Simplified & Most Trusted in India',
    category: 'cctv',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller'
  },
  {
    id: 'brand-dahua',
    name: 'Dahua',
    tagline: 'Smart 4K Ultra HD & AI Video Security',
    category: 'cctv',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    badge: '4K Ultra HD'
  },
  {
    id: 'brand-unv',
    name: 'UNV (Uniview)',
    tagline: 'Pioneer in IP Surveillance & Enterprise PoE',
    category: 'cctv',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    badge: 'Enterprise Grade'
  },
  {
    id: 'brand-imou',
    name: 'Imou',
    tagline: 'Smart Home Wi-Fi & 360° AI Cameras',
    category: 'cctv',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
    badge: 'Smart Wi-Fi'
  },
  {
    id: 'brand-meksha',
    name: 'Meksha Pro',
    tagline: 'Custom 4G SIM & Solar Outdoor Surveillance',
    category: 'cctv',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    badge: 'Specialized 4G'
  }
];


