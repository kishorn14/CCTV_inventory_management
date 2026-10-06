import { Product, ServiceItem, Review } from '../types';

export const CATEGORIES = [
  { id: 'all', label: 'All Products (50)', icon: 'Sparkles', active: true },
  { id: 'wifi_4g', label: 'Wi-Fi 360° & 4G Cameras', icon: 'Wifi', active: true },
  { id: 'ip_cameras', label: 'CP PLUS IP Cameras', icon: 'Shield', active: true },
  { id: 'hd_analog', label: 'HD & Analog Cameras', icon: 'Camera', active: true },
  { id: 'dvr_nvr', label: 'DVR & NVR Recording Units', icon: 'HardDrive', active: true },
  { id: 'solar', label: 'Solar 4G Cameras', icon: 'Sun', active: true },
  { id: 'storage', label: 'Hard Disks & SD Storage', icon: 'Database', active: true },
  { id: 'networking', label: 'PoE Switches & Routers', icon: 'Network', active: true },
  { id: 'cables_power', label: 'Cables & SMPS Power', icon: 'Zap', active: true },
  { id: 'racks_accessories', label: 'Racks & Accessories', icon: 'Box', active: true },
] as const;

export const PRODUCTS: Product[] = [
  {
    "id": "prod-1",
    "name": "128 GB MICRO SD CARD",
    "category": "storage",
    "brand": "MEKSHA",
    "image": "/products/microsd.jpg",
    "badge": "128GB MicroSD",
    "priceRange": "₹1,800",
    "price": 1800,
    "mrp": 2500,
    "unit": "PCS",
    "warranty": "2 Years Warranty",
    "features": [
      "High Endurance Class 10 U3 / V30",
      "Optimized for Continuous CCTV Video Loop",
      "Shock, Temperature & Waterproof",
      "Plug & Play for Wi-Fi & 4G Cameras"
    ],
    "description": "High-endurance Micro SD memory card for standalone Wi-Fi and 4G smart cameras with fast read/write speeds.",
    "popular": false
  },
  {
    "id": "prod-2",
    "name": "2U RACK - WALL MOUNT",
    "category": "racks_accessories",
    "brand": "MEKSHA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7691d991-ca0c-419b-95bb-09a18a0c1ecb.png",
    "badge": "2U Wall Mount",
    "priceRange": "₹1,200",
    "price": 1200,
    "mrp": 1700,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "2U Compact Wall Mount Enclosure",
      "Lockable Front Door with Ventilation",
      "Powder Coated Rust-Proof Steel",
      "Ideal for 4CH / 8CH DVR Setups"
    ],
    "description": "Compact 2U wall mount CCTV rack to house DVR, SMPS, and cables cleanly in homes and shops.",
    "popular": false
  },
  {
    "id": "prod-3",
    "name": "4mp ip Bullet Illuamx With Mic(CP-UNC-TA41L3C-D-LQ)",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png",
    "badge": "4MP IP Bullet",
    "priceRange": "₹4,000",
    "price": 4000,
    "mrp": 5600,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "PoE IP Bullet Camera with Mic",
      "Long-Range Night Vision (up to 60m)",
      "Dual IR / Full Color Support",
      "Weatherproof IP67 Metal Enclosure",
      "CP PLUS InstaOn Cloud Remote View"
    ],
    "description": "CP PLUS professional IP bullet camera designed for outdoor perimeter monitoring, factories, shops, and residential complexes.",
    "popular": true
  },
  {
    "id": "prod-4",
    "name": "4mp ip Dome Illuamx With Mic (CP-UNC-DA41L3C-D-LQ)",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7e13a7bd-368f-4d00-9e74-411262b2b98c.png",
    "badge": "4MP IP Dome",
    "priceRange": "₹3,950",
    "price": 3950,
    "mrp": 5550,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "PoE Smart IP Network Camera",
      "Built-in High Sensitivity Microphone",
      "Dual IR LEDs for Vivid Night Vision",
      "H.265+ Ultra Compression",
      "Metal Housing Weatherproof"
    ],
    "description": "CP PLUS high-definition IP dome camera with audio recording, crisp night vision, and easy PoE network plug & play.",
    "popular": false
  },
  {
    "id": "prod-5",
    "name": "64 GB MICRO SD CARD",
    "category": "storage",
    "brand": "MEKSHA",
    "image": "/products/microsd.jpg",
    "badge": "64GB MicroSD",
    "priceRange": "₹1,150",
    "price": 1150,
    "mrp": 1600,
    "unit": "PCS",
    "warranty": "2 Years Warranty",
    "features": [
      "High Endurance Class 10 U3 / V30",
      "Optimized for Continuous CCTV Video Loop",
      "Shock, Temperature & Waterproof",
      "Plug & Play for Wi-Fi & 4G Cameras"
    ],
    "description": "High-endurance Micro SD memory card for standalone Wi-Fi and 4G smart cameras with fast read/write speeds.",
    "popular": false
  },
  {
    "id": "prod-6",
    "name": "6U RACK WALL MOUNT - 500D",
    "category": "racks_accessories",
    "brand": "MEKSHA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7691d991-ca0c-419b-95bb-09a18a0c1ecb.png",
    "badge": "6U Wall Mount",
    "priceRange": "₹2,300",
    "price": 2300,
    "mrp": 3200,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "6U Standard 19\" Wall Mount Rack (500mm Depth)",
      "Toughened Glass Front Door with Lock & Key",
      "Cable Entry Cutouts on Top and Bottom",
      "High Load Bearing Powder Coated Steel"
    ],
    "description": "Heavy duty 6U server and CCTV rack cabinet to secure NVR, DVR, PoE switch, and power supplies.",
    "popular": false
  },
  {
    "id": "prod-7",
    "name": "Cat6 cable pure copper",
    "category": "cables_power",
    "brand": "MEKSHA",
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    "badge": "Pure Copper",
    "priceRange": "₹40",
    "price": 40,
    "mrp": 64,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Pure Copper High Conductivity",
      "Gigabit Cat6 Specification",
      "Weatherproof Outer Sheath",
      "Low Interference Twisted Pairs"
    ],
    "description": "High grade pure copper Cat6 networking cable sold per meter for custom wiring lengths.",
    "popular": false
  },
  {
    "id": "prod-8",
    "name": "Consistent 500GB HDD - 2YRS",
    "category": "storage",
    "brand": "CONSISTENT",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/b7a7fdc5-2cf3-44c3-9ae0-859b2ba9e3b1.png",
    "badge": "500GB HDD",
    "priceRange": "₹2,100",
    "price": 2100,
    "mrp": 2950,
    "unit": "NOS",
    "warranty": "2 Years Warranty",
    "features": [
      "Standard 3.5\" SATA Surveillance Drive",
      "SATA 6Gb/s High Speed Interface",
      "Low Power Consumption & Silent Operation",
      "Tested for DVR Recording"
    ],
    "description": "Reliable SATA internal hard disk drive for CCTV video storage with 2 years replacement warranty.",
    "popular": false
  },
  {
    "id": "prod-9",
    "name": "CP PLUS 16CH NVR - CP-UNR-4K2162-V3",
    "category": "dvr_nvr",
    "brand": "CP PLUS",
    "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    "badge": "16CH 4K NVR",
    "priceRange": "₹10,900",
    "price": 10900,
    "mrp": 14700,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "16-Channel 4K High Definition NVR",
      "SATA HDD Support up to 10TB",
      "Multi-Screen Live Monitoring",
      "Audio & Motion Alarm Triggering",
      "CP PLUS InstaOn App Support"
    ],
    "description": "CP PLUS 16-Channel 4K NVR for commercial shops, multi-floor buildings, and warehouses.",
    "popular": true
  },
  {
    "id": "prod-10",
    "name": "CP Plus 2.4MP Bullet With Mic - CP-URC-TC24PL3C",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png",
    "badge": "4MP IP Bullet",
    "priceRange": "₹1,550",
    "price": 1550,
    "mrp": 2150,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "PoE IP Bullet Camera with Mic",
      "Long-Range Night Vision (up to 60m)",
      "Dual IR / Full Color Support",
      "Weatherproof IP67 Metal Enclosure",
      "CP PLUS InstaOn Cloud Remote View"
    ],
    "description": "CP PLUS professional IP bullet camera designed for outdoor perimeter monitoring, factories, shops, and residential complexes.",
    "popular": true
  },
  {
    "id": "prod-11",
    "name": "CP PLUS 2MP IP DUAL IR BULLET WITH MIC - CP-UNC-TA21L3C-LQ",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png",
    "badge": "2MP IP Bullet",
    "priceRange": "₹3,200",
    "price": 3200,
    "mrp": 4500,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "PoE IP Bullet Camera with Mic",
      "Long-Range Night Vision (up to 60m)",
      "Dual IR / Full Color Support",
      "Weatherproof IP67 Metal Enclosure",
      "CP PLUS InstaOn Cloud Remote View"
    ],
    "description": "CP PLUS professional IP bullet camera designed for outdoor perimeter monitoring, factories, shops, and residential complexes.",
    "popular": false
  },
  {
    "id": "prod-12",
    "name": "CP PLUS 2MP IP DUAL IR DOME WITH MIC - CP-UNC-DA21L3C-LQ",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7e13a7bd-368f-4d00-9e74-411262b2b98c.png",
    "badge": "2MP IP Dome",
    "priceRange": "₹3,100",
    "price": 3100,
    "mrp": 4350,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "PoE Smart IP Network Camera",
      "Built-in High Sensitivity Microphone",
      "Dual IR LEDs for Vivid Night Vision",
      "H.265+ Ultra Compression",
      "Metal Housing Weatherproof"
    ],
    "description": "CP PLUS high-definition IP dome camera with audio recording, crisp night vision, and easy PoE network plug & play.",
    "popular": false
  },
  {
    "id": "prod-13",
    "name": "CP PLUS 2MP IP DUAL IR DOME WITH MIC - CP-UNC-TA21L3C-LQ",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7e13a7bd-368f-4d00-9e74-411262b2b98c.png",
    "badge": "2MP IP Dome",
    "priceRange": "Enquire for Price",
    "price": 0,
    "mrp": 0,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "PoE Smart IP Network Camera",
      "Built-in High Sensitivity Microphone",
      "Dual IR LEDs for Vivid Night Vision",
      "H.265+ Ultra Compression",
      "Metal Housing Weatherproof"
    ],
    "description": "CP PLUS high-definition IP dome camera with audio recording, crisp night vision, and easy PoE network plug & play.",
    "popular": false
  },
  {
    "id": "prod-14",
    "name": "CP PLUS 3+1 CCTV CABLE - 90R-V3",
    "category": "cables_power",
    "brand": "CP PLUS",
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    "badge": "90M Coil",
    "priceRange": "₹1,450",
    "price": 1450,
    "mrp": 2050,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Coaxial Video Cable + 3 Power/Audio Wires",
      "90 Meters Factory Sealed Coil",
      "Low Signal Loss & Noise Shielding",
      "Weatherproof PVC Insulation"
    ],
    "description": "CP PLUS 3+1 CCTV cable 90m bundle designed for analog and HD DVR camera wiring.",
    "popular": false
  },
  {
    "id": "prod-15",
    "name": "CP PLUS 32CH NVR - CP-UNR-4K4322-V4 (4K)",
    "category": "dvr_nvr",
    "brand": "CP PLUS",
    "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    "badge": "32CH 4K NVR",
    "priceRange": "₹17,000",
    "price": 17000,
    "mrp": 22950,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "32-Channel 4K Ultra HD Recording",
      "Dual SATA Ports up to 16TB Storage",
      "H.265+ Smart Video Encoding",
      "Commercial Enterprise Grade NVR",
      "Instant Mobile App Remote Access"
    ],
    "description": "CP PLUS 32-Channel 4K Network Video Recorder for large commercial enterprises, apartments, and industrial facilities.",
    "popular": true
  },
  {
    "id": "prod-16",
    "name": "CP PLUS 4MP IP BULLET CAMERA - CP-UNC-TA41L6C-D-Q-0600 - 60MTRS",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png",
    "badge": "4MP IP Bullet",
    "priceRange": "₹5,950",
    "price": 5950,
    "mrp": 8050,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "PoE IP Bullet Camera with Mic",
      "Long-Range Night Vision (up to 60m)",
      "Dual IR / Full Color Support",
      "Weatherproof IP67 Metal Enclosure",
      "CP PLUS InstaOn Cloud Remote View"
    ],
    "description": "CP PLUS professional IP bullet camera designed for outdoor perimeter monitoring, factories, shops, and residential complexes.",
    "popular": true
  },
  {
    "id": "prod-17",
    "name": "CP PLUS 4MP IP DUAL IR BULLET WITH MIC - CP-UNC-TA41L3C-D-LQ",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png",
    "badge": "4MP IP Bullet",
    "priceRange": "₹4,600",
    "price": 4600,
    "mrp": 6450,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "PoE IP Bullet Camera with Mic",
      "Long-Range Night Vision (up to 60m)",
      "Dual IR / Full Color Support",
      "Weatherproof IP67 Metal Enclosure",
      "CP PLUS InstaOn Cloud Remote View"
    ],
    "description": "CP PLUS professional IP bullet camera designed for outdoor perimeter monitoring, factories, shops, and residential complexes.",
    "popular": true
  },
  {
    "id": "prod-18",
    "name": "CP PLUS 4MP IP DUAL IR DOME WITH MIC - CP-UNC-DA41L3C-D-LQ",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7e13a7bd-368f-4d00-9e74-411262b2b98c.png",
    "badge": "4MP IP Dome",
    "priceRange": "₹4,500",
    "price": 4500,
    "mrp": 6300,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "PoE Smart IP Network Camera",
      "Built-in High Sensitivity Microphone",
      "Dual IR LEDs for Vivid Night Vision",
      "H.265+ Ultra Compression",
      "Metal Housing Weatherproof"
    ],
    "description": "CP PLUS high-definition IP dome camera with audio recording, crisp night vision, and easy PoE network plug & play.",
    "popular": false
  },
  {
    "id": "prod-19",
    "name": "CP Plus 8CH NVR - CP-UNR-108F1",
    "category": "dvr_nvr",
    "brand": "CP PLUS",
    "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    "badge": "8CH NVR",
    "priceRange": "₹5,500",
    "price": 5500,
    "mrp": 7450,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "8-Channel HD NVR Recording",
      "High Speed Network Bandwidth",
      "Compact Desktop / Rack Chassis",
      "Plug & Play IP Camera Detection",
      "Mobile App Live Streaming"
    ],
    "description": "CP PLUS 8-Channel NVR recorder suitable for homes, offices, and small retail showrooms.",
    "popular": false
  },
  {
    "id": "prod-20",
    "name": "CP PLUS Cat6 UTP SOLID CABLE 305M - CP-BUT-6TGL1",
    "category": "cables_power",
    "brand": "CP PLUS",
    "image": "/products/cat6_box.jpg",
    "badge": "305M Drum Box",
    "priceRange": "₹10,200",
    "price": 10200,
    "mrp": 13750,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Original CP PLUS Solid Copper Cat6 Cable",
      "305 Meters Full Length Reel in Pull Box",
      "Gigabit Transmission Speeds (up to 250 MHz)",
      "Durable Outer Jacket with Meter Markings"
    ],
    "description": "CP PLUS 305m pure solid Cat6 networking cable drum for professional IP CCTV camera installations.",
    "popular": true
  },
  {
    "id": "prod-21",
    "name": "CP PLUS SOLAR PANEL WITH BATTERY KIT - CP-SL06K YI86VjM0JDVUUNDr",
    "category": "solar",
    "brand": "CP PLUS",
    "image": "https://dms.mydukaan.io/original/jpeg/media/476bc181-01e5-44a8-9872-bcca3baa81a3.png",
    "badge": "Solar Powered",
    "priceRange": "₹5,800",
    "price": 5800,
    "mrp": 7850,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Continuous Solar Powered Operation",
      "High-Capacity Lithium Battery Kit",
      "Weatherproof Outdoor IP66 Casing",
      "Zero Electric Wiring Required",
      "Mobile View Anywhere"
    ],
    "description": "Complete solar security camera kit engineered for agricultural farms, open lands, and remote properties without grid electricity.",
    "popular": true
  },
  {
    "id": "prod-22",
    "name": "D-Link 5 Port Switch - DES-1005C",
    "category": "networking",
    "brand": "D-LINK",
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    "badge": "Ethernet Switch",
    "priceRange": "₹960",
    "price": 960,
    "mrp": 1440,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "5 Fast Ethernet 10/100 Ports",
      "Energy Efficient Green Ethernet",
      "Plug & Play Easy Installation",
      "Compact Desktop Footprint"
    ],
    "description": "D-Link / Maxxion 5-Port desktop ethernet switch for expanding network connections in CCTV and office setups.",
    "popular": false
  },
  {
    "id": "prod-23",
    "name": "FYBER 4CH CCTV SMPS FYUS-51",
    "category": "cables_power",
    "brand": "FYBER",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/d5234608-3eb1-476b-956c-d0455253b5c2.png",
    "badge": "4CH SMPS",
    "priceRange": "₹850",
    "price": 850,
    "mrp": 1280,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Regulated 12V DC Centralized Power Output",
      "Short Circuit & Overload Protection",
      "Perforated Heavy Metal Casing",
      "Individual Fuse Protection per Channel"
    ],
    "description": "Fyber centralized CCTV SMPS power supply box to power 4 or 8 cameras safely from a single power point.",
    "popular": false
  },
  {
    "id": "prod-24",
    "name": "FYBER 8+2 PORT 10/100 POE - FYA-82FE (COMPACT)",
    "category": "networking",
    "brand": "FYBER",
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    "badge": "PoE Switch",
    "priceRange": "₹2,500",
    "price": 2500,
    "mrp": 3500,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "8 PoE Ports + 2 Uplink Ports (10/100 Mbps)",
      "Up to 250m Long Distance PoE Transmission",
      "Surge & Lightning Protection",
      "Metal Sturdy Desktop/Rack Mount Case"
    ],
    "description": "Power over Ethernet (PoE) network switch to deliver both power and data to IP cameras over single Cat6 cable.",
    "popular": true
  },
  {
    "id": "prod-25",
    "name": "FYBER 8CH CCTV SMPS FYUS-61 202512610204015",
    "category": "cables_power",
    "brand": "FYBER",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/d5234608-3eb1-476b-956c-d0455253b5c2.png",
    "badge": "8CH SMPS",
    "priceRange": "₹850",
    "price": 850,
    "mrp": 1280,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Regulated 12V DC Centralized Power Output",
      "Short Circuit & Overload Protection",
      "Perforated Heavy Metal Casing",
      "Individual Fuse Protection per Channel"
    ],
    "description": "Fyber centralized CCTV SMPS power supply box to power 4 or 8 cameras safely from a single power point.",
    "popular": false
  },
  {
    "id": "prod-26",
    "name": "FYBER RJ45 CONNECTORS - FYJC5E",
    "category": "racks_accessories",
    "brand": "FYBER",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/19b8d19f-4ded-4f09-89ba-3daa9b7a4f2e.png",
    "badge": "Accessory",
    "priceRange": "Enquire for Price",
    "price": 0,
    "mrp": 0,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Gold Plated 8P8C Pins for Best Contact",
      "Clear Polycarbonate Durable Housing",
      "Compatible with Cat5e & Cat6 Cables",
      "Pack / Loose Available"
    ],
    "description": "High quality RJ45 crimp modular connectors for terminating IP camera network cables.",
    "popular": false
  },
  {
    "id": "prod-27",
    "name": "FYBER RJ45 CONNECTORS - FY-RJC5E",
    "category": "racks_accessories",
    "brand": "FYBER",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/19b8d19f-4ded-4f09-89ba-3daa9b7a4f2e.png",
    "badge": "Accessory",
    "priceRange": "₹8",
    "price": 8,
    "mrp": 13,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Gold Plated 8P8C Pins for Best Contact",
      "Clear Polycarbonate Durable Housing",
      "Compatible with Cat5e & Cat6 Cables",
      "Pack / Loose Available"
    ],
    "description": "High quality RJ45 crimp modular connectors for terminating IP camera network cables.",
    "popular": false
  },
  {
    "id": "prod-28",
    "name": "iFYBER 4X4 MODULAR BOX - FYJC-77(B)",
    "category": "racks_accessories",
    "brand": "FYBER",
    "image": "/products/junction_box.jpg",
    "badge": "Accessory",
    "priceRange": "₹45",
    "price": 45,
    "mrp": 72,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Waterproof & Dustproof Junction Box",
      "Pre-Marked Knockouts for Cable Glands",
      "UV Resistant High Impact Plastic",
      "Clean Concealed Camera Base Mounting"
    ],
    "description": "iFyber waterproof modular junction box to conceal and protect camera connectors from rain and dust.",
    "popular": false
  },
  {
    "id": "prod-29",
    "name": "iFYBER 5X5 MODULAR BOX - FYJC-88(B)",
    "category": "racks_accessories",
    "brand": "FYBER",
    "image": "/products/junction_box.jpg",
    "badge": "Accessory",
    "priceRange": "₹55",
    "price": 55,
    "mrp": 88,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Waterproof & Dustproof Junction Box",
      "Pre-Marked Knockouts for Cable Glands",
      "UV Resistant High Impact Plastic",
      "Clean Concealed Camera Base Mounting"
    ],
    "description": "iFyber waterproof modular junction box to conceal and protect camera connectors from rain and dust.",
    "popular": false
  },
  {
    "id": "prod-30",
    "name": "KRYSTAA 1TB SATA HDD - 2YRS",
    "category": "storage",
    "brand": "KRYSTAA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/b7a7fdc5-2cf3-44c3-9ae0-859b2ba9e3b1.png",
    "badge": "1TB HDD",
    "priceRange": "₹5,600",
    "price": 5600,
    "mrp": 7550,
    "unit": "NOS",
    "warranty": "2 Years Warranty",
    "features": [
      "Standard 3.5\" SATA Surveillance Drive",
      "SATA 6Gb/s High Speed Interface",
      "Low Power Consumption & Silent Operation",
      "Tested for DVR Recording"
    ],
    "description": "Reliable SATA internal hard disk drive for CCTV video storage with 2 years replacement warranty.",
    "popular": false
  },
  {
    "id": "prod-31",
    "name": "MAXXION 5 PORT DESKTOP SWITCH - (MX-DS1105)",
    "category": "networking",
    "brand": "MAXXION",
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    "badge": "Ethernet Switch",
    "priceRange": "₹850",
    "price": 850,
    "mrp": 1280,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "5 Fast Ethernet 10/100 Ports",
      "Energy Efficient Green Ethernet",
      "Plug & Play Easy Installation",
      "Compact Desktop Footprint"
    ],
    "description": "D-Link / Maxxion 5-Port desktop ethernet switch for expanding network connections in CCTV and office setups.",
    "popular": false
  },
  {
    "id": "prod-32",
    "name": "MAXXION CCTV WIRED DC PINS",
    "category": "racks_accessories",
    "brand": "MAXXION",
    "image": "/products/bnc_dc_pins.jpg",
    "badge": "Accessory",
    "priceRange": "₹10",
    "price": 10,
    "mrp": 16,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Standard 12V 2.1mm DC Power Connector",
      "Pre-Wired Heavy Gauge Copper Leads",
      "Polarity Color Coded (Red/Black)",
      "Secure Camera Power Connection"
    ],
    "description": "Maxxion CCTV wired DC male power pins for connecting 12V power supply to security cameras.",
    "popular": false
  },
  {
    "id": "prod-33",
    "name": "MAXXION WIRED BNC CONNECTORS - ELITE",
    "category": "racks_accessories",
    "brand": "MAXXION",
    "image": "/products/bnc_dc_pins.jpg",
    "badge": "Accessory",
    "priceRange": "₹40",
    "price": 40,
    "mrp": 64,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Pure Copper Core BNC Connector",
      "Screw Terminal / Pre-Wired Easy Fit",
      "Heavy Shielding Against Signal Interference",
      "Standard for All HD DVR Cameras"
    ],
    "description": "Maxxion Elite wired BNC connectors for crisp, noise-free video transmission from HD cameras.",
    "popular": false
  },
  {
    "id": "prod-34",
    "name": "MINI CCTV RACK - WALLMOUNT",
    "category": "racks_accessories",
    "brand": "MEKSHA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7691d991-ca0c-419b-95bb-09a18a0c1ecb.png",
    "badge": "Mini CCTV Rack",
    "priceRange": "₹900",
    "price": 900,
    "mrp": 1350,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Mini Wall Mount CCTV Cabinet",
      "Key Lock for Physical Security of DVR",
      "Ventilated Side Panels for Heat Dissipation",
      "Pre-Drilled Wall Mounting Holes"
    ],
    "description": "Mini wall mount enclosure to prevent tampering and theft of CCTV recording units.",
    "popular": false
  },
  {
    "id": "prod-35",
    "name": "MINI CCTV RACK - WALLMOUNT",
    "category": "racks_accessories",
    "brand": "MEKSHA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7691d991-ca0c-419b-95bb-09a18a0c1ecb.png",
    "badge": "Mini CCTV Rack",
    "priceRange": "₹935",
    "price": 935,
    "mrp": 1400,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Mini Wall Mount CCTV Cabinet",
      "Key Lock for Physical Security of DVR",
      "Ventilated Side Panels for Heat Dissipation",
      "Pre-Drilled Wall Mounting Holes"
    ],
    "description": "Mini wall mount enclosure to prevent tampering and theft of CCTV recording units.",
    "popular": false
  },
  {
    "id": "prod-36",
    "name": "OEM CCTV PRO HD CAMERA - EYEQUBE EQ-2025C01293| EQ-2025C01295",
    "category": "solar",
    "brand": "EYEQUBE",
    "image": "https://dms.mydukaan.io/original/jpeg/media/476bc181-01e5-44a8-9872-bcca3baa81a3.png",
    "badge": "Solar Powered",
    "priceRange": "₹9,500",
    "price": 9500,
    "mrp": 12850,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Continuous Solar Powered Operation",
      "High-Capacity Lithium Battery Kit",
      "Weatherproof Outdoor IP66 Casing",
      "Zero Electric Wiring Required",
      "Mobile View Anywhere"
    ],
    "description": "Complete solar security camera kit engineered for agricultural farms, open lands, and remote properties without grid electricity.",
    "popular": true
  },
  {
    "id": "prod-37",
    "name": "RJ 45 JOINTER - 1X1",
    "category": "racks_accessories",
    "brand": "MEKSHA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/19b8d19f-4ded-4f09-89ba-3daa9b7a4f2e.png",
    "badge": "Accessory",
    "priceRange": "₹50",
    "price": 50,
    "mrp": 80,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "Heavy Duty Standard CCTV Accessory",
      "Durable Construction",
      "Direct Shop Stock Available"
    ],
    "description": "Essential installation accessory for secure CCTV system deployment.",
    "popular": false
  },
  {
    "id": "prod-38",
    "name": "Seagate 2TB SKYHAWK HDD - SV",
    "category": "storage",
    "brand": "SEAGATE",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/b7a7fdc5-2cf3-44c3-9ae0-859b2ba9e3b1.png",
    "badge": "2TB Surveillance",
    "priceRange": "₹11,000",
    "price": 11000,
    "mrp": 14850,
    "unit": "NOS",
    "warranty": "3 Years Warranty",
    "features": [
      "Engineered for 24/7 Surveillance Workloads",
      "ImagePerfect Firmware (Zero Frame Drops)",
      "Up to 64 HD Cameras Supported",
      "1 Million Hours MTBF Reliability",
      "3 Years Brand Warranty"
    ],
    "description": "Original Seagate SkyHawk Surveillance HDD designed specifically for continuous 24/7 DVR and NVR video recording.",
    "popular": true
  },
  {
    "id": "prod-39",
    "name": "Seagate 4TB SKYHAWK HDD - SV",
    "category": "storage",
    "brand": "SEAGATE",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/b7a7fdc5-2cf3-44c3-9ae0-859b2ba9e3b1.png",
    "badge": "4TB Surveillance",
    "priceRange": "₹16,500",
    "price": 16500,
    "mrp": 22300,
    "unit": "NOS",
    "warranty": "3 Years Warranty",
    "features": [
      "Engineered for 24/7 Surveillance Workloads",
      "ImagePerfect Firmware (Zero Frame Drops)",
      "Up to 64 HD Cameras Supported",
      "1 Million Hours MTBF Reliability",
      "3 Years Brand Warranty"
    ],
    "description": "Original Seagate SkyHawk Surveillance HDD designed specifically for continuous 24/7 DVR and NVR video recording.",
    "popular": true
  },
  {
    "id": "prod-40",
    "name": "SecureMax 6MP 4G Linkage PT Camera Triple Lens 4+4+12mm - SM1005-A 7843308399",
    "category": "wifi_4g",
    "brand": "SECUREMAX",
    "image": "https://dms.mydukaan.io/original/jpeg/media/7bb4bf4e-a186-4e4e-9589-eddfa611c615.png",
    "badge": "Triple Lens 4G",
    "priceRange": "₹6,200",
    "price": 6200,
    "mrp": 8350,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "6MP Ultra HD Triple Lens (4+4+12mm)",
      "4G SIM Card Enabled (No Wi-Fi needed)",
      "360° PTZ Panoramic Coverage",
      "AI Human Detection & Smart Auto Tracking",
      "Full Color Night Vision"
    ],
    "description": "SecureMax 6MP 4G Linkage Triple Lens PT Camera with multi-angle surveillance, ideal for large areas without broadband.",
    "popular": true
  },
  {
    "id": "prod-41",
    "name": "TP-LINK USB TYPE CTO GIGA LAN ADAPTER - UE300C 22487E3011735",
    "category": "networking",
    "brand": "TP-LINK",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/1faa6cf5-1fdb-44bf-a020-ec9bddb331da.png",
    "badge": "Gigabit Adapter",
    "priceRange": "₹1,550",
    "price": 1550,
    "mrp": 2150,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "USB Type-C to RJ45 Gigabit Ethernet",
      "Foldable & Compact Portable Design",
      "Plug & Play on Windows, Mac, Linux",
      "Supports up to 1000 Mbps High Speed"
    ],
    "description": "TP-Link high-speed Gigabit LAN adapter for laptops, PCs and network testing.",
    "popular": false
  },
  {
    "id": "prod-42",
    "name": "TRUEVIEW 2MP BULLET DUAL LIGHT HD CAMERA - (T18257-A)",
    "category": "hd_analog",
    "brand": "TRUEVIEW",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/a99b70d4-d5c9-4d7e-b1b8-453714a701d8.png",
    "badge": "2MP HD Bullet",
    "priceRange": "₹950",
    "price": 950,
    "mrp": 1430,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "2MP Full HD High Resolution",
      "Dual Light Outdoor Bullet",
      "Weatherproof Metal/ABS Housing",
      "Smart IR Night Vision 20m",
      "Standard BNC Connection"
    ],
    "description": "Trueview 2MP outdoor HD bullet camera with dual illumination night vision for residential and retail protection.",
    "popular": false
  },
  {
    "id": "prod-43",
    "name": "TRUEVIEW 2MP DOME DUAL LIGHT HD CAMERA - (T18256-A)",
    "category": "hd_analog",
    "brand": "TRUEVIEW",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7e13a7bd-368f-4d00-9e74-411262b2b98c.png",
    "badge": "2MP HD Dome",
    "priceRange": "₹920",
    "price": 920,
    "mrp": 1380,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "2MP 1080P Full HD Video",
      "Dual Light Smart Night Vision",
      "Compact Ceiling Dome Design",
      "Plug & Play with HD DVR",
      "Budget-Friendly Security"
    ],
    "description": "Trueview 2MP indoor dome HD camera with dual light illumination for crystal clear security on any HD DVR setup.",
    "popular": false
  },
  {
    "id": "prod-44",
    "name": "TRUEVIEW 3MP 4G PT DOME CAMERA - (T18120SF) 2AB089WN1000159534",
    "category": "wifi_4g",
    "brand": "TRUEVIEW",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/d4579b9c-357c-402a-b1f0-863495f37583.png",
    "badge": "360° PTZ",
    "priceRange": "₹3,500",
    "price": 3500,
    "mrp": 4900,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "3MP Super HD Clarity",
      "360° Pan & Tilt Motorized Rotation",
      "Mobile App Remote Control & Alerts",
      "Night Vision & Motion Detection",
      "Two-Way Voice Intercom"
    ],
    "description": "Trueview 3MP Pan & Tilt smart camera with 360-degree rotation and clear two-way communication.",
    "popular": true
  },
  {
    "id": "prod-45",
    "name": "TRUEVIEW 3MP OUTDOOR WIFI PT CAMERA - (T18290S)",
    "category": "wifi_4g",
    "brand": "TRUEVIEW",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/d4579b9c-357c-402a-b1f0-863495f37583.png",
    "badge": "360° PTZ",
    "priceRange": "₹3,800",
    "price": 3800,
    "mrp": 5300,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "3MP Super HD Clarity",
      "360° Pan & Tilt Motorized Rotation",
      "Mobile App Remote Control & Alerts",
      "Night Vision & Motion Detection",
      "Two-Way Voice Intercom"
    ],
    "description": "Trueview 3MP Pan & Tilt smart camera with 360-degree rotation and clear two-way communication.",
    "popular": true
  },
  {
    "id": "prod-46",
    "name": "TRUEVIEW 3MP WIFI COLOR BULLET CAMERA - (T18238S)",
    "category": "wifi_4g",
    "brand": "TRUEVIEW",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/6a31cb86-553b-4a3f-a63a-157236a306dd.png",
    "badge": "Wi-Fi Bullet",
    "priceRange": "₹2,950",
    "price": 2950,
    "mrp": 4150,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "3MP Full HD Resolution",
      "Wi-Fi Wireless Connectivity",
      "Color Night Vision with Warm LEDs",
      "Two-Way Audio with Mic & Speaker",
      "MicroSD Slot up to 256GB"
    ],
    "description": "Trueview 3MP Wi-Fi outdoor color bullet camera with mobile app live viewing, motion detection and two-way talk.",
    "popular": false
  },
  {
    "id": "prod-47",
    "name": "TRUEVIEW 4CH HD DVR (Two-Way Audio) - (T-38297-A)",
    "category": "dvr_nvr",
    "brand": "TRUEVIEW",
    "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    "badge": "4CH HD DVR",
    "priceRange": "₹3,500",
    "price": 3500,
    "mrp": 4900,
    "unit": "NOS",
    "warranty": "2 Years Brand Warranty",
    "features": [
      "4-Channel HD DVR with Two-Way Audio",
      "Support for HD Analog & IP Cameras",
      "H.265 Video Compression",
      "HDMI & VGA Full HD Outputs",
      "Cloud P2P Easy Phone Setup"
    ],
    "description": "Trueview 4-Channel HD DVR with two-way audio talk and reliable continuous recording.",
    "popular": false
  },
  {
    "id": "prod-48",
    "name": "TRUEVIEW 4G WI-FI ROUTER - R300 WHITE - (T18258-A) SOCNYA25102310633| SOCNYA25102310614",
    "category": "networking",
    "brand": "TRUEVIEW",
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    "badge": "4G SIM Router",
    "priceRange": "₹1,700",
    "price": 1700,
    "mrp": 2400,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "High Speed 4G LTE Wi-Fi Connectivity",
      "Plug & Play SIM Slot (Jio / Airtel / Vi)",
      "Long Range Wi-Fi Antennas",
      "Connect Multiple Cameras & Devices"
    ],
    "description": "Trueview 4G SIM wireless router providing instant internet connectivity for CCTV setups without broadband connection.",
    "popular": false
  },
  {
    "id": "prod-49",
    "name": "TRUEVIEW 8+2 10/100 POE SWITCH",
    "category": "networking",
    "brand": "TRUEVIEW",
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    "badge": "PoE Switch",
    "priceRange": "₹1,900",
    "price": 1900,
    "mrp": 2650,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "8 PoE Ports + 2 Uplink Ports (10/100 Mbps)",
      "Up to 250m Long Distance PoE Transmission",
      "Surge & Lightning Protection",
      "Metal Sturdy Desktop/Rack Mount Case"
    ],
    "description": "Power over Ethernet (PoE) network switch to deliver both power and data to IP cameras over single Cat6 cable.",
    "popular": true
  },
  {
    "id": "prod-50",
    "name": "TRUEVIEW 8+2 10/100 POE SWITCH - (T38262-A) FA08EA5A42DF",
    "category": "networking",
    "brand": "TRUEVIEW",
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    "badge": "PoE Switch",
    "priceRange": "₹1,800",
    "price": 1800,
    "mrp": 2500,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "features": [
      "8 PoE Ports + 2 Uplink Ports (10/100 Mbps)",
      "Up to 250m Long Distance PoE Transmission",
      "Surge & Lightning Protection",
      "Metal Sturdy Desktop/Rack Mount Case"
    ],
    "description": "Power over Ethernet (PoE) network switch to deliver both power and data to IP cameras over single Cat6 cable.",
    "popular": true
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'cctv-install',
    title: 'Professional CCTV Installation & Cabling',
    category: 'cctv',
    iconName: 'Camera',
    shortDesc: 'Complete home, shop, and industrial CCTV setup by certified technicians with concealed wiring and mobile app sync.',
    bulletPoints: [
      'Same-Day / Next-Day Installation in Davanagere & surrounding areas',
      'Concealed wiring, waterproof conduit piping & neat finish',
      'Free mobile app setup on all family members\' smartphones',
      '1-Year Free On-Site Service Warranty & Support'
    ],
    startingPrice: '₹350 / Camera point',
    responseTime: 'Within 2 Hours'
  },
  {
    id: 'cctv-repair',
    title: 'CCTV Repair, Offline Camera & DVR Troubleshooting',
    category: 'cctv',
    iconName: 'Wrench',
    shortDesc: 'Quick diagnosis and repair for black screens, offline mobile view, recording failures, or broken connectors.',
    bulletPoints: [
      'Rapid door-step technician visit across Davanagere',
      'DVR/NVR password reset, HDD bad sector check & SMPS replacement',
      'Mobile view offline / Wi-Fi router reconnection assistance',
      'Genuine spare parts & transparent pricing'
    ],
    startingPrice: '₹299 Visit & Inspection',
    responseTime: 'Within 2 Hours'
  },
  {
    id: 'cctv-amc',
    title: 'Annual Maintenance Contract (AMC) for Businesses',
    category: 'cctv',
    iconName: 'ShieldCheck',
    shortDesc: 'Preventive monthly maintenance, lens cleaning, recording audits, and priority emergency response for shops, schools & factories.',
    bulletPoints: [
      'Scheduled monthly health checkups of cameras, cables & DVR',
      'Lens cleaning, angle readjustment & recording backup audit',
      'Zero visit charge during breakdown emergencies',
      'Custom plans for retail showrooms, apartments & warehouses'
    ],
    startingPrice: 'Custom Plan on Request',
    responseTime: 'Priority 1 Hour'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Ravi Kumar',
    location: 'MCC B Block, Davanagere',
    rating: 5,
    service: '4-Camera CP PLUS IP Setup',
    comment: 'I was searching for a reliable CCTV camera shop in Davanagere. Visited Meksha CCTV Solutions and got a 4-camera IP setup installed. Night vision video clarity is crystal clear and mobile viewing is super smooth. Highly recommended!',
    date: '1 week ago',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Priya Sharma',
    location: 'Vidyanagar, Davanagere',
    rating: 5,
    service: 'Trueview 360° Wi-Fi PT Camera',
    comment: 'Best CCTV store in Davanagere. Bought a Trueview 360 Wi-Fi camera for my boutique. The two-way audio and motion alerts are awesome. Very quick delivery and courteous service.',
    date: '2 weeks ago',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Arjun Reddy',
    location: 'Hadadi Road, Davanagere',
    rating: 5,
    service: 'CP PLUS 16CH NVR & IP Cameras',
    comment: 'Got 16 CP Plus IP cameras installed for our commercial warehouse. Professional cabling with server rack. Neat work and very genuine prices for cameras and accessories.',
    date: '3 weeks ago',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Manjunath S',
    location: 'Harihar Road, Davanagere',
    rating: 5,
    service: 'Solar 4G Camera Kit',
    comment: 'Purchased a Solar 4G security camera for our farmhouse where there is no Wi-Fi or electricity. It works 24/7 without fail on SIM card. Best solar CCTV solution in town!',
    date: '1 month ago',
    verified: true
  },
  {
    id: 'rev-5',
    name: 'Sneha Patel',
    location: 'PJ Extension, Davanagere',
    rating: 5,
    service: 'Trueview HD Bullet & DVR Setup',
    comment: 'Very professional team. They gave an instant quotation on WhatsApp with honest prices of all cameras and accessories. Work completed on the same day cleanly.',
    date: '1 month ago',
    verified: true
  },
  {
    id: 'rev-6',
    name: 'Karthik N',
    location: 'Kuvempu Nagar, Davanagere',
    rating: 5,
    service: 'Seagate SkyHawk 4TB HDD & Cables',
    comment: 'Best wholesale and retail rates for CCTV hard disks, Cat6 cables, and SMPS power supplies in Davanagere. Original products with GST bill.',
    date: '5 weeks ago',
    verified: true
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

export const BRANDS = [
  { name: 'CP PLUS', category: 'India\'s Most Trusted CCTV' },
  { name: 'Trueview', category: 'Smart Wi-Fi & 4G Cameras' },
  { name: 'Seagate SkyHawk', category: 'Surveillance Hard Disks' },
  { name: 'D-Link', category: 'PoE & Network Switches' },
  { name: 'TP-Link', category: 'Gigabit Network Adapters' },
  { name: 'Fyber', category: 'CCTV SMPS & Connectors' }
];

export const FAQS = [
  {
    q: 'How quickly can you deliver or install cameras in Davanagere?',
    a: 'We provide same-day doorstep delivery and installation across Davanagere and nearby areas. All cameras, DVR/NVR, hard disks, and cables are in stock in our shop.'
  },
  {
    q: 'Do you offer mobile viewing on smartphones?',
    a: 'Yes! We configure official mobile viewing apps (CP PLUS InstaOn, Trueview, etc.) on all family or staff smartphones with high security and zero monthly charges.'
  },
  {
    q: 'What warranty is provided on cameras and hard disks?',
    a: 'All our CP PLUS, Trueview, and Seagate products carry official 1 to 3 years manufacturer warranty with authentic GST invoices from our shop.'
  },
  {
    q: 'Can I request an instant quotation for my shop or home?',
    a: 'Yes, just click "WhatsApp Quote" on any product or contact us at 6366406305. We will provide an itemized quote within minutes.'
  }
];

export const SHOP_CONTACT = {
  shopName: 'MEKSHA CCTV SOLUTIONS',
  tagline: 'Authorized CCTV Cameras, Security Surveillance & Accessories Store',
  phone: '6366406305',
  whatsappPhone: '916366406305',
  email: 'mekhasolutions@gmail.com',
  gstNumber: '29CCVPR4344H1ZU',
  address: '536/10, Mittlakatte Road, Davanagere, Karnataka - 577004',
  city: 'Davanagere',
  googleMapsUrl: 'https://maps.google.com/?q=14.4644,75.9218',
  workingHours: '9:00 AM - 9:00 PM',
  workingDays: 'Monday - Sunday (7 Days Open)',
  catalogUrl: 'https://mybillbook.in/store/meksha_cctv_solutions',
  googleSheetViewUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'
};
