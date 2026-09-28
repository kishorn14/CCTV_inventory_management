import { Product, ServiceItem, Review } from '../types';

export const CATEGORIES = [
  { id: 'all', label: 'All Cameras & Kits', icon: 'Sparkles' },
  { id: 'kits', label: 'HD Dome & Bullet Kits', icon: 'Camera', active: true },
  { id: 'wifi', label: 'Smart Wi-Fi & PTZ', icon: 'Wifi', active: true },
  { id: 'ip_nvr', label: '4K IP & Commercial NVR', icon: 'Shield', active: true },
  { id: 'solar_4g', label: '4G SIM & Solar Cameras', icon: 'Sun', active: true },
] as const;

export const PRODUCTS: Product[] = [
  // 1. HD CCTV Kits
  {
    id: 'cctv-1',
    name: 'Hikvision 4-Camera 1080P Full HD Security Kit',
    category: 'kits',
    brand: 'Hikvision',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Seller',
    priceRange: '₹12,500 - ₹15,500 (Installed)',
    warranty: '2 Years Manufacturer Warranty',
    features: [
      '2 Indoor Dome + 2 Outdoor Bullet Full HD Cameras',
      '4-Channel Turbo HD DVR + 1TB Surveillance Hard Disk',
      '30m Smart Infrared Night Vision & Motion Detection',
      'Free Live Mobile Viewing on Android & iOS (Hik-Connect)',
      'Standard Cabling, Power Supply & Installation Included'
    ],
    description: 'Complete high-definition surveillance solution perfect for homes, retail shops, and small offices with remote mobile access anywhere in the world.',
    popular: true
  },
  {
    id: 'cctv-2',
    name: 'CP PLUS 360° Smart Wi-Fi PTZ Dome Camera (EzyKam+)',
    category: 'wifi',
    brand: 'CP PLUS',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular for Home',
    priceRange: '₹2,499 - ₹3,200',
    warranty: '2 Years Replacement Warranty',
    features: [
      '360° Pan & Tilt Rotation via Phone App',
      '2-Way Audio (Speak & Listen in Real-Time)',
      'AI Smart Motion Tracking & Human Body Detection',
      'MicroSD Card Support up to 128GB + Cloud Backup',
      'Full Color Night Vision in Low-Light Conditions'
    ],
    description: 'Plug-and-play smart security camera for baby/elderly monitoring, indoor rooms, and shop billing counters. Easy Wi-Fi setup with zero DVR required.',
    popular: true
  },
  {
    id: 'cctv-3',
    name: 'Dahua 8-Channel 4K IP Commercial NVR Package',
    category: 'ip_nvr',
    brand: 'Dahua',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    badge: 'Commercial Grade',
    priceRange: '₹28,000 - ₹36,000',
    warranty: '3 Years Warranty',
    features: [
      '8 PoE 4K Ultra-HD Network Cameras',
      '8-Channel 4K NVR with 2TB / 4TB Enterprise Storage',
      'AI Facial Recognition & Perimeter Intrusion Alert',
      'Weatherproof IP67 Metal Housing with Surge Protection',
      'Heavy Duty Cat6 Gigabit Structured Cabling'
    ],
    description: 'Ultra-reliable enterprise surveillance system engineered for factories, warehouses, apartment complexes, and jewelry showrooms.'
  },
  {
    id: 'cctv-4',
    name: 'Outdoor Solar 4G Standalone Bullet Camera',
    category: 'solar_4g',
    brand: 'Meksha Pro',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    badge: 'No Wi-Fi / Wire Needed',
    priceRange: '₹6,800 - ₹8,500',
    warranty: '1 Year Full Warranty',
    features: [
      'Operates with 4G SIM Card (Jio / Airtel / Vi)',
      'Built-in Monocrystalline Solar Panel + Long-Life Lithium Battery',
      'Continuous 24/7 Recording even during total power outages',
      'IP66 Waterproof & Heavy Lightning Surge Protection',
      'Instant Siren & Mobile Notification Alerts upon Detection'
    ],
    description: 'Ideal for agricultural farms, construction project sites, remote houses, and open plots without electricity or Wi-Fi.'
  },
  {
    id: 'cctv-5',
    name: 'Hikvision ColorVu 24/7 Full-Color Night Camera Kit',
    category: 'kits',
    brand: 'Hikvision',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    badge: 'Color Night Vision',
    priceRange: '₹14,000 - ₹18,000',
    warranty: '2 Years Manufacturer Warranty',
    features: [
      '24/7 Vivid Color Imaging even in total darkness',
      'F1.0 Super Aperture & Advanced Low-Light Sensor',
      'Warm supplemental soft light for 20m range',
      'Includes 4-Channel Turbo DVR + 1TB Surveillance Hard Disk',
      'Free Doorstep Setup & Concealed Cable Wiring'
    ],
    description: 'Never miss vehicle color or clothing details in black & white. Delivers crystal clear colorful video day and night for heightened home and business security.'
  },
  {
    id: 'cctv-6',
    name: 'CP PLUS 8-Camera Full HD Surveillance Package',
    category: 'kits',
    brand: 'CP PLUS',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    badge: 'Large Home & Shop',
    priceRange: '₹22,500 - ₹26,500 (Installed)',
    warranty: '2 Years Brand Warranty',
    features: [
      '4 Indoor Dome + 4 Outdoor Bullet 1080P Cameras',
      '8-Channel Turbo DVR + 2TB Seagate SkyHawk Surveillance HDD',
      'Centralized 8-Port Heavy Duty SMPS Power Supply',
      'Mobile View on unlimited Android and iPhone devices',
      'Full Clean Cabling, Wall Clamping & Technician Fitment'
    ],
    description: 'The preferred package for multi-story residential buildings, departmental stores, and commercial premises requiring complete perimeter and indoor coverage.',
    popular: true
  },
  {
    id: 'cctv-7',
    name: 'Imou Ranger 2 360° AI Smart Wireless Camera',
    category: 'wifi',
    brand: 'Imou',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    badge: 'Smart AI Tracking',
    priceRange: '₹2,199 - ₹2,799',
    warranty: '1 Year Warranty',
    features: [
      '1080P Full HD with 360° Zero-Blind Spot Coverage',
      'Smart Tracking & AI Human Detection (Filters false alarms)',
      'Abnormal Sound Alarm (Detects baby crying & glass breaks)',
      'Privacy Shield Mode & 2-Way Intercom Talk',
      'Works with Alexa & Google Assistant Smart Displays'
    ],
    description: 'Compact and intelligent indoor security camera with automatic human tracking and instant smartphone alerts.'
  },
  {
    id: 'cctv-8',
    name: 'Uniview (UNV) 16-Channel Enterprise 4K AI NVR System',
    category: 'ip_nvr',
    brand: 'UNV (Uniview)',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    badge: 'Enterprise Solution',
    priceRange: '₹58,000 - ₹75,000',
    warranty: '3 Years Brand Warranty',
    features: [
      '16 Ultra 4K Ultra-PoE IP Starlight Cameras',
      '16-Channel AI NVR with 4TB / 8TB Surveillance Storage',
      'Smart Perimeter Protection, Vehicle & Human Search',
      'Central Monitoring Station (CMS) Software support',
      'Ideal for factories, schools, jewelry showrooms & apartments'
    ],
    description: 'Top-tier commercial video security system designed for large properties with smart analytics, high-speed PoE, and centralized control.'
  },
  {
    id: 'cctv-9',
    name: 'Meksha Dual-Lens 4G Outdoor PTZ Police Siren Camera',
    category: 'solar_4g',
    brand: 'Meksha Pro',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    badge: 'Red & Blue Alarm',
    priceRange: '₹5,499 - ₹6,999',
    warranty: '1 Year Warranty',
    features: [
      'Dual-Lens (Wide Angle + 10x Telephoto Zoom)',
      'Red-Blue Flashing Police Strobe & Loud Siren Deterrent',
      'Direct 4G SIM Card Connectivity (No Wi-Fi needed)',
      'Auto Human Motion Tracking & Floodlight Night Vision',
      'Heavy Duty Weatherproof IP66 Metal Body'
    ],
    description: 'Active defense security camera that automatically sounds a loud siren and flashes warning lights to scare off intruders before a crime happens.'
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-cctv-install',
    title: 'Home & Commercial CCTV Camera Installation',
    category: 'cctv',
    iconName: 'Camera',
    shortDesc: 'Complete HD & 4K IP camera installation, neat concealed wiring, DVR/NVR setup, and free mobile live viewing on all smartphones.',
    bulletPoints: [
      'Free on-site survey & camera placement angle optimization',
      'Neat concealed or casing-pipe cabling without wall damage',
      'Instant mobile live view setup on Android & iPhone',
      'Surveillance-grade hard disk configuration & recording test',
      'Zero advance payment — pay only after 100% satisfaction'
    ],
    startingPrice: '₹350 / camera install',
    responseTime: 'Doorstep Service (Same Day)',
    comingSoon: false
  },
  {
    id: 'srv-cctv-repair',
    title: 'CCTV Repair, Hard Disk & Offline Troubleshooting',
    category: 'cctv',
    iconName: 'Wrench',
    shortDesc: 'Fast diagnostics and doorstep repair for offline cameras, blank screens, power supply failures, and DVR recording errors.',
    bulletPoints: [
      'Camera offline, video loss & blank black screen fixes',
      'DVR/NVR continuous beeping & hard disk recording failure repair',
      'SMPS power supply replacement & BNC/DC connector crimping',
      'Mobile app re-linking (Hik-Connect / DMSS / gCMOB / Imou)',
      'Password reset & firmware upgrade for all major DVR/NVRs'
    ],
    startingPrice: '₹300 / service visit',
    responseTime: 'Doorstep in 60 Mins',
    comingSoon: false
  },
  {
    id: 'srv-cctv-commercial',
    title: 'Commercial 4K IP Surveillance & Multi-Site CMS',
    category: 'cctv',
    iconName: 'Shield',
    shortDesc: 'Enterprise PoE network camera design for factories, jewelry stores, schools, apartments, and centralized multi-branch monitoring.',
    bulletPoints: [
      'Gigabit Cat6 PoE structured networking & rack cabinet setups',
      'AI facial recognition, perimeter tripwire & ANPR vehicle detection',
      'Central monitoring station (CMS) software for multi-branch viewing',
      'Cloud backup & off-site tamper-proof recording systems',
      'Comprehensive handover with user training & technical documentation'
    ],
    startingPrice: 'Custom Quotation',
    responseTime: 'Next Day Survey',
    comingSoon: false
  },
  {
    id: 'srv-cctv-amc',
    title: 'Annual Maintenance Contracts (AMC) for Homes & Corporates',
    category: 'cctv',
    iconName: 'Award',
    shortDesc: 'Keep your security cameras operating 24/7/365 with regular preventative checkups, lens cleaning, priority breakdown visits, and free labor.',
    bulletPoints: [
      'Quarterly preventative health audits, lens cleaning & angle adjustments',
      'Hard disk recording retention check & backup verification',
      'Unlimited priority emergency breakdown repair calls',
      'Zero labor charges on all camera & cable servicing throughout the year',
      'Special discounts on hardware upgrades & camera additions'
    ],
    startingPrice: 'From ₹1,999 / year',
    responseTime: 'Priority 2-Hour SLA',
    comingSoon: false
  }
];

export const BRANDS = [
  { name: 'Hikvision', category: 'Global CCTV #1' },
  { name: 'CP PLUS', category: 'India\'s Most Trusted' },
  { name: 'Dahua', category: '4K AI Surveillance' },
  { name: 'UNV (Uniview)', category: 'IP Network Video' },
  { name: 'Imou', category: 'Smart Wi-Fi Security' },
  { name: 'Meksha Pro', category: '4G Solar & Long Range' }
];

export const FAQS = [
  {
    q: 'How quickly can you install CCTV cameras at my home or business?',
    a: 'We provide same-day or next-day installation across the city. Our certified technicians arrive fully equipped with cameras, DVR/NVR, surveillance hard disks, power supplies, and cabling.'
  },
  {
    q: 'Can I view my CCTV cameras on my smartphone when I am away?',
    a: 'Yes, absolutely! We configure official mobile apps (Hik-Connect, gCMOB, DMSS, Imou Life) on all family members or staff smartphones for free. You can view crystal-clear live video, playback past recordings, and get motion alerts anywhere in the world.'
  },
  {
    q: 'What is the difference between HD Analog CCTV and IP Network Cameras?',
    a: 'HD Analog cameras (coaxial cable + DVR) are highly cost-effective, durable, and ideal for homes and small shops. IP Network cameras (Cat6 cable + PoE NVR) deliver superior 4K clarity, digital zoom without pixelation, and advanced AI features like facial recognition and vehicle plate reading, making them the preferred choice for larger properties, warehouses, and offices.'
  },
  {
    q: 'Do your cameras work at night and during total darkness?',
    a: 'Yes! All our cameras come equipped with Smart Infrared (IR) night vision up to 30 meters. We also offer Full-Color Night Vision (Hikvision ColorVu / Dahua Full-Color) cameras that deliver vivid, colorful daylight-like video even in pitch-black environments.'
  },
  {
    q: 'Do I need an active Wi-Fi / Internet connection for CCTV cameras to record?',
    a: 'No internet is required for recording! Your CCTV cameras will continuously record 24/7 to the DVR/NVR hard disk even without internet or Wi-Fi. An active internet connection is only needed when you want to view live video or playbacks remotely on your mobile phone.'
  },
  {
    q: 'What warranty is provided on CCTV cameras and recording equipment?',
    a: 'All our Hikvision, CP PLUS, and Dahua cameras, DVRs, and NVRs carry 2 to 3 years official manufacturer warranty with original GST tax invoices. Surveillance hard disks carry up to 3 years replacement warranty.'
  }
];

export const REAL_GOOGLE_REVIEWS: Review[] = [
  {
    id: 'rev-sandeep',
    name: 'sandeep mk',
    badge: 'Local Guide · 10 reviews · 6 photos',
    rating: 5,
    service: 'HD CCTV Setup & Mobile Live App Config',
    comment: 'Quick and clean installation with good camera coverage and clear video quality. The team was professional, explained everything well, and set up the mobile app perfectly. Very satisfied with the service!',
    time: '10 months ago',
    date: '10 months ago',
    location: 'Davangere',
    photos: ['/reviews/sandeep-1.jpg', '/reviews/sandeep-2.jpg'],
    verified: true
  },
  {
    id: 'rev-praveen',
    name: 'Praveen MS',
    badge: '3 reviews · 2 photos',
    rating: 5,
    service: 'Farm & Home 4G Solar PTZ Cameras',
    comment: 'I installed 4 solar cameras and CCTV system on my farm and home through Mekha Solutions & Services in Davanagere, and I am highly impressed. Their service was excellent, with quick installation and a very reasonable price. The solar camera setup has been working seamlessly.',
    time: 'a year ago',
    date: '1 year ago',
    location: 'Davangere',
    photos: ['/reviews/praveen-1.jpg', '/reviews/praveen-2.jpg'],
    verified: true
  },
  {
    id: 'rev-shruthi',
    name: 'Shruthi N',
    badge: '4 reviews · 2 photos',
    rating: 5,
    service: 'Outdoor Full HD Security Camera Installation',
    comment: 'Great CCTV camera with clear footage. The Installation service was on time and very professional. They explained everything nicely and made sure the system was running perfectly. Totally satisfied with the product and service!',
    time: '10 months ago',
    date: '10 months ago',
    location: 'Davangere',
    photos: ['/reviews/shruthi-1.jpg', '/reviews/shruthi-2.jpg'],
    verified: true
  },
  {
    id: 'rev-lakshman',
    name: 'Lakshman Jasthi',
    badge: 'Local Guide · 15 reviews · 87 photos',
    rating: 5,
    service: 'Farm Pond Solar PTZ Camera System',
    comment: 'Installed solar PTZ camera for my farm pond and 2 other cameras for my farm, excellent service and they are working seamlessly. Prices are reasonable. Highly recommend them for CCTV installation and service.',
    time: '3 years ago',
    date: '3 years ago',
    location: 'Davangere',
    photos: ['/reviews/lakshman-1.jpg'],
    verified: true
  },
  {
    id: 'rev-bharath',
    name: 'Bharath Kumar',
    badge: 'Local Guide · 12 reviews · 2 photos',
    rating: 5,
    service: 'Farmland 4G Solar CCTV Camera Installation',
    comment: 'Got solar camera installed in my farm. Very good quality and fair pricing. Timely installation and no hidden prices. I highly recommend Mekha solutions.',
    time: 'a year ago',
    date: '1 year ago',
    location: 'Davangere',
    photos: ['/reviews/bharath-1.jpg', '/reviews/bharath-2.jpg'],
    verified: true
  },
  {
    id: 'rev-rasheed',
    name: 'Rasheed Rashe',
    badge: '5 reviews · 2 photos',
    rating: 5,
    service: 'CCTV Camera Installation & AMC Service',
    comment: 'Prompt CCTV installation and excellent after-sales customer support. Very fair pricing and trustworthy service in Davangere.',
    time: '2 years ago',
    date: '2 years ago',
    location: 'Davangere',
    photos: [],
    verified: true
  }
];
