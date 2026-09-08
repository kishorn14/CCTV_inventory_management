import { Product, ServiceItem } from '../types';

export const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'Sparkles' },
  { id: 'cctv', label: 'CCTV Surveillance', icon: 'Camera', active: true },
  { id: 'battery', label: 'Vehicle Batteries', icon: 'BatteryCharging', active: true },
  { id: 'inverter', label: 'Inverters & UPS Power', icon: 'Zap', active: true },
] as const;

export const PRODUCTS: Product[] = [
  // CCTV Category
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

  // Vehicle Batteries Category (Fully Active)
  {
    id: 'bat-1',
    name: 'Amaron & Exide Four-Wheeler Car Batteries',
    category: 'battery',
    brand: 'Amaron / Exide',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    badge: 'Doorstep Fitment',
    priceRange: '₹3,600 - ₹7,800 (with Old Battery Scrap Exchange)',
    warranty: '36 to 66 Months Manufacturer Warranty',
    features: [
      'Free Doorstep Delivery & Professional Installation',
      'Zero-Maintenance Silver Alloy Technology',
      'High Cranking Power (CCA) for Instant Cold Starts',
      'Best Trade-in Cash Discount for Old Scrap Battery',
      'Official Warranty Card & Digital Tax Invoice'
    ],
    description: 'Authorized automotive battery sales for hatchback, sedan, SUV, and commercial vehicles with free doorstep fitment across the city.',
    popular: true
  },
  {
    id: 'bat-2',
    name: 'Two-Wheeler Bike & Scooter Batteries',
    category: 'battery',
    brand: 'Exide / Amaron Pro',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    badge: 'High Performance',
    priceRange: '₹950 - ₹1,850',
    warranty: '24 to 48 Months Warranty',
    features: [
      'Factory Charged & Ready to Ride (VRLA / AGM)',
      'Spill-Proof & Vibration Resistant Design',
      'Superior Cranking for Quick Push-Button Ignition',
      'Suitable for Activa, Pulsar, Splendor, Bullet, EV 2-wheelers'
    ],
    description: 'Maintenance-free two-wheeler batteries delivering high cranking reliability and long service life.'
  },
  {
    id: 'bat-3',
    name: 'Commercial Vehicle, Tractor & Auto Batteries',
    category: 'battery',
    brand: 'Exide / PowerZone',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    badge: 'Heavy Duty',
    priceRange: '₹4,500 - ₹14,000',
    warranty: '24 to 36 Months Warranty',
    features: [
      'Heavy Deep-Cycle Lead-Antimony Alloy Plates',
      'Engineered for Indian Rough Roads & Heavy Loads',
      'Instant Emergency Jumpstart & Fitment Available'
    ],
    description: 'Tough commercial batteries designed for trucks, mini-trucks, tractors, commercial generators, and passenger auto-rickshaws.'
  },

  // Inverters & UPS Power Category (Fully Active)
  {
    id: 'inv-1',
    name: 'Pure Sine Wave Home Inverter + Tall Tubular Battery Combo',
    category: 'inverter',
    brand: 'Luminous / Microtek',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    badge: 'Home & Office Power',
    priceRange: '₹14,500 - ₹24,500 (Installed Combo)',
    warranty: 'Up to 5 Years Warranty',
    features: [
      '900VA - 1500VA Pure Sine Wave Inverter System',
      '150Ah - 220Ah Heavy Tall Tubular Battery',
      'Silent Operation for Fans, Lights, TV, Laptops & Mixers',
      'Fast Battery Charging with Low-Voltage Grid Support',
      'Neat Concealed Wiring & Bypass Switch Setup'
    ],
    description: 'Reliable uninterrupted power backup systems for homes and offices. Keep your lights, fans, and work-from-home setup running smoothly during power cuts.',
    popular: true
  },
  {
    id: 'inv-2',
    name: 'Mini DC UPS for Wi-Fi Routers & Broadband Modems',
    category: 'inverter',
    brand: 'Meksha Pro Power',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    badge: 'Zero Internet Downtime',
    priceRange: '₹1,299 - ₹1,850',
    warranty: '1 Year Replacement Warranty',
    features: [
      '4 to 6 Hours Continuous Internet Backup during Power Cuts',
      'Zero-Delay Switchover (No Wi-Fi disconnection on Zoom/Teams)',
      'Compatible with JioFiber, Airtel Xstream, ACT, BSNL, TP-Link',
      'Smart Microprocessor Charging with Overcharge Protection',
      'Compact Plug-and-Play Design with Universal Connector Pins'
    ],
    description: 'Never get disconnected during important work meetings, online classes, or transactions. Essential power backup for Wi-Fi routers, optical network units (ONU), and broadband modems.',
    popular: true
  },
  {
    id: 'inv-3',
    name: 'Dedicated CCTV Surveillance Centralized UPS Power Backup',
    category: 'inverter',
    brand: 'Meksha SecurePower',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    badge: '24/7 Security Backup',
    priceRange: '₹2,400 - ₹6,500',
    warranty: '2 Years Warranty',
    features: [
      'Guarantees 24/7 Continuous CCTV & DVR Recording during Power Outages',
      '4-Port / 8-Port / 16-Port Centralized Regulated Output',
      'Built-in Voltage Spike, Lightning Surge & Short-Circuit Protection',
      'Prevents Hard Disk Corruptions and Security Blind Spots'
    ],
    description: 'Specialized power backup engineered for CCTV DVRs, NVRs, and security cameras to guarantee continuous surveillance even during power cuts and tampering attempts.'
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
    responseTime: 'Doorstep Service (Same Day)',
    comingSoon: false
  },
  {
    id: 'srv-battery',
    title: 'Doorstep Vehicle Battery Delivery, Fitment & Jumpstart',
    category: 'battery',
    iconName: 'BatteryCharging',
    shortDesc: 'Instant doorstep delivery and installation for cars, bikes, and commercial vehicles with old battery exchange and emergency jumpstart.',
    bulletPoints: [
      'Free doorstep delivery & professional computerized fitment',
      'Highest scrap exchange cash discount for old batteries',
      'Emergency car & bike jumpstart breakdown support',
      'Free alternator voltage & battery health diagnostic check'
    ],
    startingPrice: 'Free Fitment with Battery',
    responseTime: 'Doorstep in 30-45 Mins',
    comingSoon: false
  },
  {
    id: 'srv-inverter',
    title: 'Home Inverter, Wi-Fi Mini UPS & CCTV Power Backup Setup',
    category: 'inverter',
    iconName: 'Zap',
    shortDesc: 'Complete power backup planning, pure sine wave inverter wiring, Wi-Fi modem UPS setup, and regular battery distilled water maintenance.',
    bulletPoints: [
      'Expert load calculation & pure sine wave inverter sizing',
      'Dedicated backup setup for Wi-Fi routers & CCTV security systems',
      'Battery distilled water top-up, terminal descaling & health check',
      'PCB repair, bypass switch installation & office UPS support'
    ],
    startingPrice: '₹450 / service visit',
    responseTime: 'Doorstep Service (Prompt)',
    comingSoon: false
  }
];

export const BRANDS = [
  { name: 'Hikvision', category: 'CCTV Surveillance' },
  { name: 'CP PLUS', category: 'CCTV Surveillance' },
  { name: 'Dahua', category: 'CCTV Surveillance' },
  { name: 'Meksha Pro', category: 'CCTV & Power' },
  { name: 'Exide', category: 'Vehicle Batteries' },
  { name: 'Amaron', category: 'Vehicle Batteries' },
  { name: 'Luminous', category: 'Inverters & UPS' },
  { name: 'Microtek', category: 'Inverters & UPS' }
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
    q: 'Do you offer doorstep delivery and fitment for vehicle batteries?',
    a: 'Yes! We deliver and professionally install genuine Exide and Amaron batteries for cars, bikes, and commercial vehicles right at your doorstep with instant old scrap exchange discounts.'
  },
  {
    q: 'Do you supply inverters for Wi-Fi modems and CCTV cameras?',
    a: 'Yes! In addition to whole-home sine wave inverters, we supply dedicated Mini DC UPS for Wi-Fi routers (4-6 hours internet backup) and specialized centralized CCTV power backup systems to ensure continuous security recording during power cuts.'
  }
];

