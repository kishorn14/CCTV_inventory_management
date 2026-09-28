export type CategoryType = 'all' | 'cctv' | 'kits' | 'wifi' | 'ip_nvr' | 'solar_4g';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  brand: string;
  image: string;
  badge?: string;
  priceRange: string;
  warranty: string;
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
  location: string;
  rating: number;
  service: string;
  comment: string;
  date: string;
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

  // Accessories & Installation labor
  powerSupply4Port: number;
  powerSupply8Port: number;
  powerSupply16Port: number;
  cablePerCamera: number;       // 30m cable bundle + connectors per camera
  installationPerCamera: number; // labor, mounting, mobile setup per camera
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

  powerSupply4Port: 650,
  powerSupply8Port: 1150,
  powerSupply16Port: 1950,
  cablePerCamera: 450,
  installationPerCamera: 450
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


