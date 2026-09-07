import { Product, ServiceItem } from '../types';

export const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'Sparkles' },
  { id: 'cctv', label: 'CCTV Surveillance (Active)', icon: 'Camera', active: true },
  { id: 'battery', label: 'Vehicle Batteries', icon: 'BatteryCharging', comingSoon: true },
  { id: 'inverter', label: 'UPS & Inverters', icon: 'Zap', comingSoon: true },
  { id: 'water_purifier', label: 'RO Water Purifiers', icon: 'Droplets', comingSoon: true },
  { id: 'solar_heater', label: 'Solar Water Heaters', icon: 'Sun', comingSoon: true },
] as const;

export const PRODUCTS: Product[] = [
  // CCTV Category (Fully Active)
  {
    id: 'cctv-1',
    name: 'Hikvision 4-Camera 1080P Full HD Security Kit',
    category: 'cctv',
    brand: 'Hikvision',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Seller',
    priceRange: '₹12,500 - ₹15,500 (Installed)',
    warranty: '2 Years Manufacturer Warranty',
    features: [
      '2 Dome + 2 Bullet Full HD Cameras',
      '4-Channel Turbo HD DVR + 1TB Surveillance Hard Disk',
      '30m Smart Infrared Night Vision',
      'Live Mobile Viewing on Android & iOS',
      'Free Standard Cable & Power Supply'
    ],
    description: 'Complete high-definition surveillance solution perfect for homes, retail shops, and small offices with remote mobile access anywhere in the world.',
    popular: true
  },
  {
    id: 'cctv-2',
    name: 'CP PLUS 360° Smart Wi-Fi PTZ Dome Camera',
    category: 'cctv',
    brand: 'CP PLUS',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular for Home',
    priceRange: '₹2,499 - ₹3,200',
    warranty: '2 Years Replacement Warranty',
    features: [
      '360° Pan & Tilt Rotation via Mobile App',
      '2-Way Audio (Speak & Listen)',
      'Motion Tracking & Human Body Detection',
      'MicroSD Card Support up to 128GB + Cloud Backup',
      'Full Color Night Vision in Low Light'
    ],
    description: 'Plug-and-play smart security camera for baby/elderly monitoring, indoor rooms, and shop billing counters.',
    popular: true
  },
  {
    id: 'cctv-3',
    name: 'Dahua 8-Channel 4K IP Commercial NVR Package',
    category: 'cctv',
    brand: 'Dahua',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    badge: 'Commercial Grade',
    priceRange: '₹28,000 - ₹36,000',
    warranty: '3 Years Warranty',
    features: [
      '8 POE 4K Ultra-HD Network Cameras',
      '8-Channel 4K NVR with 2TB / 4TB Enterprise Storage',
      'AI Facial Recognition & Perimeter Intrusion Alert',
      'Weatherproof IP67 Metal Housing',
      'Heavy duty Cat6 Gigabit Cabling'
    ],
    description: 'Ultra-reliable enterprise surveillance system engineered for factories, warehouses, apartment complexes, and jewelry showrooms.'
  },
  {
    id: 'cctv-4',
    name: 'Outdoor Solar 4G Standalone Bullet Camera',
    category: 'cctv',
    brand: 'Meksha Pro',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    badge: 'No Wi-Fi / Wire Needed',
    priceRange: '₹6,800 - ₹8,500',
    warranty: '1 Year Full Warranty',
    features: [
      'Operates with 4G SIM Card (Jio / Airtel)',
      'Built-in Monocrystalline Solar Panel + Lithium Battery',
      'Continuous 24/7 Recording even during power cuts',
      'IP66 Waterproof & Heavy Lightning Surge Protection',
      'Instant Siren & Mobile Notification Alerts'
    ],
    description: 'Ideal for agricultural farms, construction project sites, remote houses, and open plots without electricity or Wi-Fi.'
  },
  {
    id: 'cctv-5',
    name: 'Hikvision ColorVu 24/7 Full-Color Night Camera Kit',
    category: 'cctv',
    brand: 'Hikvision',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    badge: 'Color Night Vision',
    priceRange: '₹14,000 - ₹18,000',
    warranty: '2 Years Manufacturer Warranty',
    features: [
      '24/7 Vivid Color Imaging even in total darkness',
      'F1.0 Super Aperture & Advanced Sensor',
      'Warm supplemental light for 20m range',
      'Includes 4-Channel DVR + 1TB Storage Disk'
    ],
    description: 'Never miss details in black & white. Delivers crystal clear colorful video day and night for heightened security.'
  },

  // Coming Soon Categories
  {
    id: 'bat-1',
    name: 'Amaron & Exide Automotive Car Batteries',
    category: 'battery',
    brand: 'Amaron / Exide',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    badge: '🚀 Coming Soon',
    priceRange: 'Pre-Inquire on WhatsApp',
    warranty: 'Up to 66 Months Warranty',
    features: [
      'Doorstep Delivery & Fitment (Launching Soon)',
      'Zero Maintenance Factory Charged',
      'Old Battery Scrap Exchange Value'
    ],
    description: 'Automotive battery sales and doorstep replacement service launching soon.',
    comingSoon: true
  },
  {
    id: 'inv-1',
    name: 'Home UPS & Pure Sine Wave Inverters',
    category: 'inverter',
    brand: 'Luminous / Microtek',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    badge: '🚀 Coming Soon',
    priceRange: 'Pre-Inquire on WhatsApp',
    warranty: 'Up to 5 Years Warranty',
    features: [
      'Sine Wave Inverter + Tall Tubular Battery Combos',
      'Silent Power Backup for Home & Office',
      'Doorstep Setup & Battery Water Topping'
    ],
    description: 'Home power backup solutions and inverter installation service launching soon.',
    comingSoon: true
  },
  {
    id: 'ro-1',
    name: 'RO + UV + Copper Water Purifiers',
    category: 'water_purifier',
    brand: 'Kent / Aquaguard',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    badge: '🚀 Coming Soon',
    priceRange: 'Pre-Inquire on WhatsApp',
    warranty: '1 Year Comprehensive Warranty',
    features: [
      'Multi-Stage RO + UV + TDS Controller',
      'Filter Replacement & Membrane Service',
      'Free Digital TDS Testing'
    ],
    description: 'Pure and healthy drinking water purifier systems and filter servicing launching soon.',
    comingSoon: true
  },
  {
    id: 'sol-1',
    name: 'Rooftop Solar Water Heating Systems',
    category: 'solar_heater',
    brand: 'Racold / Supreme',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    badge: '🚀 Coming Soon',
    priceRange: 'Pre-Inquire on WhatsApp',
    warranty: '5 Years Tank Warranty',
    features: [
      '100L - 500L ETC Glass Lined Solar Systems',
      'Saves up to 80% on Electricity Bills',
      'Tank Descaling & Heating Element Repair'
    ],
    description: 'Eco-friendly rooftop solar water heaters and maintenance services launching soon.',
    comingSoon: true
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-cctv',
    title: 'CCTV Camera Installation & Maintenance',
    category: 'cctv',
    iconName: 'Camera',
    shortDesc: 'Complete HD & 4K IP camera installation, concealed wiring, mobile live viewing setup, DVR hard disk repair, and AMC contracts.',
    bulletPoints: [
      'Professional site survey & camera placement planning',
      'Mobile live view setup on all family/staff phones',
      'Cable fault troubleshooting & power supply repairs',
      'Hard disk recording recovery & DVR troubleshooting',
      'Annual Maintenance Contracts (AMC) for shops & homes'
    ],
    startingPrice: '₹350 / camera install',
    responseTime: 'Doorstep Service',
    comingSoon: false
  },
  {
    id: 'srv-battery',
    title: 'Doorstep Vehicle Battery Delivery & Jumpstart',
    category: 'battery',
    iconName: 'BatteryCharging',
    shortDesc: 'Doorstep battery delivery, fitting, and jumpstart breakdown support launching soon.',
    bulletPoints: [
      'Doorstep fitment & computerized battery testing',
      'Emergency car jumpstart breakdown service',
      'Free battery health & alternator voltage check'
    ],
    startingPrice: 'Launching Soon',
    responseTime: 'Coming Soon 🚀',
    comingSoon: true
  },
  {
    id: 'srv-inverter',
    title: 'Inverter & UPS Setup, Repair & Water Topping',
    category: 'inverter',
    iconName: 'Zap',
    shortDesc: 'Load calculation, home inverter wiring, PCB repairs, and battery maintenance launching soon.',
    bulletPoints: [
      'Pure sine wave inverter installation',
      'Battery distilled water top-up and terminal care',
      'High-capacity office UPS maintenance'
    ],
    startingPrice: 'Launching Soon',
    responseTime: 'Coming Soon 🚀',
    comingSoon: true
  },
  {
    id: 'srv-ro',
    title: 'RO Water Purifier Service & Filter Change',
    category: 'water_purifier',
    iconName: 'Droplets',
    shortDesc: 'Complete servicing for Kent, Aquaguard, and all brands with genuine NSF certified filters launching soon.',
    bulletPoints: [
      'Filter cartridge and RO membrane replacement',
      'Free digital TDS water purity testing',
      'Booster pump and leakage repair'
    ],
    startingPrice: 'Launching Soon',
    responseTime: 'Coming Soon 🚀',
    comingSoon: true
  },
  {
    id: 'srv-solar',
    title: 'Solar Water Heater Installation & Descaling',
    category: 'solar_heater',
    iconName: 'Sun',
    shortDesc: 'Rooftop solar water heater installation, chemical tank descaling, and tube repair launching soon.',
    bulletPoints: [
      'Chemical descaling for hard-water borewell scale',
      'Replacement of broken glass ETC tubes',
      'Electric backup element and thermostat fix'
    ],
    startingPrice: 'Launching Soon',
    responseTime: 'Coming Soon 🚀',
    comingSoon: true
  }
];

export const BRANDS = [
  { name: 'Hikvision', category: 'CCTV' },
  { name: 'CP PLUS', category: 'CCTV' },
  { name: 'Dahua', category: 'CCTV' },
  { name: 'Meksha Pro', category: 'CCTV' },
  { name: 'Exide', category: 'Batteries (Upcoming)' },
  { name: 'Amaron', category: 'Batteries (Upcoming)' },
  { name: 'Luminous', category: 'Inverters (Upcoming)' },
  { name: 'Microtek', category: 'Inverters (Upcoming)' },
  { name: 'Kent RO', category: 'Purifiers (Upcoming)' },
  { name: 'Racold', category: 'Solar (Upcoming)' }
];

export const FAQS = [
  {
    q: 'How quickly can you install CCTV cameras at my location?',
    a: 'We provide prompt site visits and professional installation. Our certified technicians bring all necessary cameras, DVR/NVR, hard disks, power supplies, and cabling.'
  },
  {
    q: 'Can I view my CCTV cameras on my smartphone from anywhere?',
    a: 'Yes! We configure official mobile apps (Hik-Connect / gCMOB / DMSS) on all your smartphones for free, so you can watch live video, playback recordings, and receive motion alert notifications worldwide.'
  },
  {
    q: 'Do you provide warranties on cameras and recording equipment?',
    a: 'Yes! All our Hikvision, CP PLUS, and Dahua cameras and DVRs come with 2 to 3 years official manufacturer warranty with original tax invoices.'
  },
  {
    q: 'Do you offer Annual Maintenance Contracts (AMC) for shops and apartments?',
    a: 'Yes, we provide comprehensive AMC services including quarterly health checks, lens cleaning, cable testing, power supply checkups, and priority breakdown resolution.'
  },
  {
    q: 'When are other services like Batteries, Inverters & RO launching?',
    a: 'We are expanding our catalog soon! You can contact us on WhatsApp anytime to pre-inquire or request special orders.'
  }
];
