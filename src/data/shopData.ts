import { Product, ServiceItem, Review } from '../types';

export const CATEGORIES = [
  { id: 'all', label: 'All Products (50)', icon: 'Sparkles', active: true },
  { id: 'ip_cameras', label: 'CP PLUS IP Cameras', icon: 'Shield', active: true },
  { id: 'hd_analog', label: 'HD & Analog Cameras', icon: 'Camera', active: true },
  { id: 'wifi_4g', label: 'Wi-Fi 360° & 4G Cameras', icon: 'Wifi', active: true },
  { id: 'solar', label: 'Solar 4G Cameras', icon: 'Sun', active: true },
  { id: 'storage', label: 'Hard Disks & Storage (HDD)', icon: 'Database', active: true },
  { id: 'dvr_nvr', label: 'DVR & NVR Recording Units', icon: 'HardDrive', active: true },
  { id: 'racks_accessories', label: 'Server & CCTV Racks', icon: 'Box', active: true },
  { id: 'networking', label: 'PoE Switches & Routers', icon: 'Network', active: true },
  { id: 'cables_power', label: 'Cables & Connectors', icon: 'Zap', active: true },
] as const;

export const PRODUCTS: Product[] = [
  {
    "id": "prod-1",
    "name": "4mp ip Bullet Illuamx With Mic(CP-UNC-TA41L3C-D-LQ)",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/3a918c3a-eb66-4b2b-b067-f2c2c84a8b34.png",
    "badge": "4MP IP Bullet",
    "priceRange": "₹4,720",
    "price": 4720,
    "mrp": 6350,
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
    "id": "prod-2",
    "name": "4mp ip Dome Illuamx With Mic (CP-UNC-DA41L3C-D-LQ)",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/bbff1663-734f-4070-89cd-10ed47250f21.png",
    "badge": "4MP IP Dome",
    "priceRange": "₹4,661",
    "price": 4661,
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
    "id": "prod-3",
    "name": "CP Plus 2.4MP Bullet With Mic - CP-URC-TC24PL3C",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/9893dba8-7c90-4c50-aea2-20367326c8fb.png",
    "badge": "4MP IP Bullet",
    "priceRange": "₹1,829",
    "price": 1829,
    "mrp": 2450,
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
    "name": "CP PLUS 2MP IP DUAL IR BULLET WITH MIC - CP-UNC-TA21L3C-LQ",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/4ee65f95-4b89-4ecf-b313-2f834367caec.png",
    "badge": "2MP IP Bullet",
    "priceRange": "₹3,776",
    "price": 3776,
    "mrp": 5100,
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
    "id": "prod-5",
    "name": "CP PLUS 2MP IP DUAL IR DOME WITH MIC - CP-UNC-DA21L3C-LQ",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/1fafd883-5ef9-4a97-9f07-165b6f98b55f.png",
    "badge": "2MP IP Dome",
    "priceRange": "₹3,658",
    "price": 3658,
    "mrp": 4950,
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
    "id": "prod-6",
    "name": "CP PLUS 2MP IP DUAL IR DOME WITH MIC - CP-UNC-TA21L3C-LQ",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/1fafd883-5ef9-4a97-9f07-165b6f98b55f.png",
    "badge": "2MP IP Dome",
    "priceRange": "₹0",
    "price": 0,
    "mrp": 20,
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
    "id": "prod-7",
    "name": "CP PLUS 4MP IP BULLET CAMERA - CP-UNC-TA41L6C-D-Q-0600 - 60MTRS",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/83763292-5c69-415b-9637-52070d5a6828.png",
    "badge": "4MP IP Bullet",
    "priceRange": "₹7,021",
    "price": 7021,
    "mrp": 9500,
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
    "id": "prod-8",
    "name": "CP PLUS 4MP IP DUAL IR BULLET WITH MIC - CP-UNC-TA41L3C-D-LQ",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/3a918c3a-eb66-4b2b-b067-f2c2c84a8b34.png",
    "badge": "4MP IP Bullet",
    "priceRange": "₹5,428",
    "price": 5428,
    "mrp": 7350,
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
    "id": "prod-9",
    "name": "CP PLUS 4MP IP DUAL IR DOME WITH MIC - CP-UNC-DA41L3C-D-LQ",
    "category": "ip_cameras",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/bbff1663-734f-4070-89cd-10ed47250f21.png",
    "badge": "4MP IP Dome",
    "priceRange": "₹5,310",
    "price": 5310,
    "mrp": 7150,
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
    "id": "prod-10",
    "name": "TRUEVIEW 2MP BULLET DUAL LIGHT HD CAMERA - (T18257-A)",
    "category": "hd_analog",
    "brand": "TRUEVIEW",
    "image": "https://i0.wp.com/ncaps.in/wp-content/uploads/2026/01/Elite-CCTV-11.png?fit=500%2C500&ssl=1",
    "badge": "2MP HD Bullet",
    "priceRange": "₹1,121",
    "price": 1121,
    "mrp": 1500,
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
    "id": "prod-11",
    "name": "TRUEVIEW 2MP DOME DUAL LIGHT HD CAMERA - (T18256-A)",
    "category": "hd_analog",
    "brand": "TRUEVIEW",
    "image": "https://5.imimg.com/data5/ANDROID/Default/2026/4/597359638/BP/DE/DB/14132038/product-jpeg-500x500.jpg",
    "badge": "2MP HD Dome",
    "priceRange": "₹1,086",
    "price": 1086,
    "mrp": 1450,
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
    "id": "prod-12",
    "name": "SecureMax 6MP 4G Linkage PT Camera Triple Lens 4+4+12mm - SM1005-A 7843308399",
    "category": "wifi_4g",
    "brand": "SECUREMAX",
    "image": "/products/solar_triple_lens_camera.jpg",
    "badge": "Triple Lens 4G",
    "priceRange": "₹7,316",
    "price": 7316,
    "mrp": 9900,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "is360Camera": true,
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
    "id": "prod-13",
    "name": "TRUEVIEW 3MP 4G PT DOME CAMERA - (T18120SF) 2AB089WN1000159534",
    "category": "wifi_4g",
    "brand": "TRUEVIEW",
    "image": "https://cdn.moglix.com/p/b55aP74vx8PQq-xxlarge.jpg",
    "badge": "360° PTZ",
    "priceRange": "₹4,130",
    "price": 4130,
    "mrp": 5600,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "is360Camera": true,
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
    "id": "prod-14",
    "name": "TRUEVIEW 3MP OUTDOOR WIFI PT CAMERA - (T18290S)",
    "category": "wifi_4g",
    "brand": "TRUEVIEW",
    "image": "https://trueview.co.in/wp-content/uploads/2026/02/New-Mini-PT-Camera-01.webp",
    "badge": "360° PTZ",
    "priceRange": "₹4,484",
    "price": 4484,
    "mrp": 6050,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "is360Camera": true,
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
    "id": "prod-15",
    "name": "TRUEVIEW 3MP WIFI COLOR BULLET CAMERA - (T18238S)",
    "category": "wifi_4g",
    "brand": "TRUEVIEW",
    "image": "https://5.imimg.com/data5/SELLER/Default/2026/2/583341414/MJ/FK/IA/75452602/trueview-t18238s-3mp-smart-wifi-bullet-atc-500x500.jpg",
    "badge": "Wi-Fi Bullet",
    "priceRange": "₹3,481",
    "price": 3481,
    "mrp": 4700,
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
    "id": "prod-16",
    "name": "OEM CCTV PRO HD CAMERA - EYEQUBE EQ-2025C01293| EQ-2025C01295",
    "category": "solar",
    "brand": "EYEQUBE",
    "image": "/products/eyeqube_solar_camera.jpg",
    "badge": "Solar Powered",
    "priceRange": "₹11,210",
    "price": 11210,
    "mrp": 15150,
    "unit": "NOS",
    "warranty": "1 Year Warranty",
    "is360Camera": true,
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
    "id": "prod-38",
    "name": "CP PLUS SOLAR PANEL WITH BATTERY KIT - CP-SL06K YI86VjM0JDVUUNDr",
    "category": "solar",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/55926f8d-03c0-4c9a-8efc-8d29a64024d2.png",
    "badge": "Solar Powered",
    "priceRange": "₹6,090",
    "price": 6090,
    "mrp": 8200,
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
    "id": "prod-17",
    "name": "Consistent 500GB HDD - 2YRS",
    "category": "storage",
    "brand": "CONSISTENT",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/b7a7fdc5-2cf3-44c3-9ae0-859b2ba9e3b1.png",
    "badge": "500GB HDD",
    "priceRange": "₹2,478",
    "price": 2478,
    "mrp": 3350,
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
    "id": "prod-18",
    "name": "KRYSTAA 1TB SATA HDD - 2YRS",
    "category": "storage",
    "brand": "KRYSTAA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/b7a7fdc5-2cf3-44c3-9ae0-859b2ba9e3b1.png",
    "badge": "1TB HDD",
    "priceRange": "₹6,608",
    "price": 6608,
    "mrp": 8900,
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
    "id": "prod-19",
    "name": "Seagate 2TB SKYHAWK HDD - SV",
    "category": "storage",
    "brand": "SEAGATE",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/b7a7fdc5-2cf3-44c3-9ae0-859b2ba9e3b1.png",
    "badge": "2TB Surveillance",
    "priceRange": "₹12,980",
    "price": 12980,
    "mrp": 17500,
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
    "id": "prod-20",
    "name": "Seagate 4TB SKYHAWK HDD - SV",
    "category": "storage",
    "brand": "SEAGATE",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/b7a7fdc5-2cf3-44c3-9ae0-859b2ba9e3b1.png",
    "badge": "4TB Surveillance",
    "priceRange": "₹19,470",
    "price": 19470,
    "mrp": 26300,
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
    "id": "prod-21",
    "name": "128 GB MICRO SD CARD",
    "category": "storage",
    "brand": "MEKSHA",
    "image": "/products/microsd.jpg",
    "badge": "128GB MicroSD",
    "priceRange": "₹2,124",
    "price": 2124,
    "mrp": 2850,
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
    "id": "prod-22",
    "name": "64 GB MICRO SD CARD",
    "category": "storage",
    "brand": "MEKSHA",
    "image": "/products/microsd.jpg",
    "badge": "64GB MicroSD",
    "priceRange": "₹1,357",
    "price": 1357,
    "mrp": 1850,
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
    "id": "prod-26",
    "name": "TRUEVIEW 4CH HD DVR (Two-Way Audio) - (T-38297-A)",
    "category": "dvr_nvr",
    "brand": "TRUEVIEW",
    "image": "https://static.wixstatic.com/media/b4472d_48eb97d3648d4be0806912d961b56ea0~mv2.jpg",
    "badge": "4CH HD DVR",
    "priceRange": "₹4,130",
    "price": 4130,
    "mrp": 5600,
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
    "id": "prod-25",
    "name": "CP Plus 8CH NVR - CP-UNR-108F1",
    "category": "dvr_nvr",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/1eb53499-144f-4fd6-9a08-0007adc7c771.jpg",
    "badge": "8CH NVR",
    "priceRange": "₹6,490",
    "price": 6490,
    "mrp": 8750,
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
    "id": "prod-23",
    "name": "CP PLUS 16CH NVR - CP-UNR-4K2162-V3",
    "category": "dvr_nvr",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/9801c8f0-6d8b-4f7b-b199-c616819f8ae4.png",
    "badge": "16CH 4K NVR",
    "priceRange": "₹12,862",
    "price": 12862,
    "mrp": 17350,
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
    "id": "prod-24",
    "name": "CP PLUS 32CH NVR - CP-UNR-4K4322-V4 (4K)",
    "category": "dvr_nvr",
    "brand": "CP PLUS",
    "image": "https://cpplusworld.com/prodassets/product/small/dd6484c0-5c7a-49be-8c93-8103d785baf8.jpg",
    "badge": "32CH 4K NVR",
    "priceRange": "₹20,060",
    "price": 20060,
    "mrp": 27100,
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
    "id": "prod-36",
    "name": "MINI CCTV RACK - WALLMOUNT",
    "category": "racks_accessories",
    "brand": "MEKSHA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7691d991-ca0c-419b-95bb-09a18a0c1ecb.png",
    "badge": "Mini CCTV Rack",
    "priceRange": "₹1,062",
    "price": 1062,
    "mrp": 1450,
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
    "id": "prod-37",
    "name": "MINI CCTV RACK - WALLMOUNT",
    "category": "racks_accessories",
    "brand": "MEKSHA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7691d991-ca0c-419b-95bb-09a18a0c1ecb.png",
    "badge": "Mini CCTV Rack",
    "priceRange": "₹1,103",
    "price": 1103,
    "mrp": 1500,
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
    "id": "prod-34",
    "name": "2U RACK - WALL MOUNT",
    "category": "racks_accessories",
    "brand": "MEKSHA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/7691d991-ca0c-419b-95bb-09a18a0c1ecb.png",
    "badge": "2U Wall Mount",
    "priceRange": "₹1,416",
    "price": 1416,
    "mrp": 1900,
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
    "id": "prod-35",
    "name": "6U RACK WALL MOUNT - 500D",
    "category": "racks_accessories",
    "brand": "MEKSHA",
    "image": "/products/rack_6u_server.jpg",
    "badge": "6U Wall Mount",
    "priceRange": "₹2,714",
    "price": 2714,
    "mrp": 3650,
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
    "id": "prod-27",
    "name": "D-Link 5 Port Switch - DES-1005C",
    "category": "networking",
    "brand": "D-LINK",
    "image": "https://www.dlink.com/in/en/-/media/product-pages/des/1005c/preview-image/des1005cfrontin.png",
    "badge": "Ethernet Switch",
    "priceRange": "₹1,133",
    "price": 1133,
    "mrp": 1550,
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
    "id": "prod-28",
    "name": "FYBER 8+2 PORT 10/100 POE - FYA-82FE (COMPACT)",
    "category": "networking",
    "brand": "FYBER",
    "image": "https://rukminim3.flixcart.com/image/480/480/xif0q/network-switch/6/y/q/fya-82fe-fyber-original-imahfbmhtwr7pwgj.jpeg?q=90",
    "badge": "PoE Switch",
    "priceRange": "₹2,950",
    "price": 2950,
    "mrp": 4000,
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
    "id": "prod-29",
    "name": "MAXXION 5 PORT DESKTOP SWITCH - (MX-DS1105)",
    "category": "networking",
    "brand": "MAXXION",
    "image": "/products/maxxion_switch.jpg",
    "badge": "Ethernet Switch",
    "priceRange": "₹1,003",
    "price": 1003,
    "mrp": 1350,
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
    "id": "prod-30",
    "name": "TP-LINK USB TYPE CTO GIGA LAN ADAPTER - UE300C 22487E3011735",
    "category": "networking",
    "brand": "TP-LINK",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/1faa6cf5-1fdb-44bf-a020-ec9bddb331da.png",
    "badge": "Gigabit Adapter",
    "priceRange": "₹1,829",
    "price": 1829,
    "mrp": 2450,
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
    "id": "prod-31",
    "name": "TRUEVIEW 4G WI-FI ROUTER - R300 WHITE - (T18258-A) SOCNYA25102310633| SOCNYA25102310614",
    "category": "networking",
    "brand": "TRUEVIEW",
    "image": "https://rukminim3.flixcart.com/image/480/480/xif0q/router/z/z/b/t18258-a-trueview-original-imahjzgquuxhwwgt.jpeg",
    "badge": "4G SIM Router",
    "priceRange": "₹2,006",
    "price": 2006,
    "mrp": 2700,
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
    "id": "prod-32",
    "name": "TRUEVIEW 8+2 10/100 POE SWITCH",
    "category": "networking",
    "brand": "TRUEVIEW",
    "image": "/products/poe_switch_8port.jpg",
    "badge": "PoE Switch",
    "priceRange": "₹2,242",
    "price": 2242,
    "mrp": 3050,
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
    "id": "prod-33",
    "name": "TRUEVIEW 8+2 10/100 POE SWITCH - (T38262-A) FA08EA5A42DF",
    "category": "networking",
    "brand": "TRUEVIEW",
    "image": "https://trueview.co.in/wp-content/uploads/2026/03/T38262-A-8-PoE-2-Uplink-Ports-100-Mbps-ND-AP0820-1-01.webp",
    "badge": "PoE Switch",
    "priceRange": "₹2,124",
    "price": 2124,
    "mrp": 2850,
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
    "id": "prod-39",
    "name": "FYBER 4CH CCTV SMPS FYUS-51",
    "category": "cables_power",
    "brand": "FYBER",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/d5234608-3eb1-476b-956c-d0455253b5c2.png",
    "badge": "4CH SMPS",
    "priceRange": "₹1,003",
    "price": 1003,
    "mrp": 1350,
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
    "id": "prod-40",
    "name": "FYBER 8CH CCTV SMPS FYUS-61 202512610204015",
    "category": "cables_power",
    "brand": "FYBER",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/d5234608-3eb1-476b-956c-d0455253b5c2.png",
    "badge": "8CH SMPS",
    "priceRange": "₹1,003",
    "price": 1003,
    "mrp": 1350,
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
    "id": "prod-41",
    "name": "Cat6 cable pure copper",
    "category": "cables_power",
    "brand": "MEKSHA",
    "image": "/products/cat6_copper_coil.jpg",
    "badge": "Pure Copper",
    "priceRange": "₹47",
    "price": 47,
    "mrp": 65,
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
    "id": "prod-42",
    "name": "CP PLUS 3+1 CCTV CABLE - 90R-V3",
    "category": "cables_power",
    "brand": "CP PLUS",
    "image": "https://5.imimg.com/data5/SELLER/Default/2025/10/555585028/RX/TC/AS/129092759/cp-plus-cp-ecc-90r-3-1-cctv-cable-500x500.jpg",
    "badge": "90M Coil",
    "priceRange": "₹1,711",
    "price": 1711,
    "mrp": 2300,
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
    "id": "prod-43",
    "name": "CP PLUS Cat6 UTP SOLID CABLE 305M - CP-BUT-6TGL1",
    "category": "cables_power",
    "brand": "CP PLUS",
    "image": "/products/cat6_box.jpg",
    "badge": "305M Drum Box",
    "priceRange": "₹12,036",
    "price": 12036,
    "mrp": 16250,
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
    "id": "prod-48",
    "name": "MAXXION CCTV WIRED DC PINS",
    "category": "cables_power",
    "brand": "MAXXION",
    "image": "/products/bnc_dc_pins.jpg",
    "badge": "Accessory",
    "priceRange": "₹12",
    "price": 12,
    "mrp": 32,
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
    "id": "prod-49",
    "name": "MAXXION WIRED BNC CONNECTORS - ELITE",
    "category": "cables_power",
    "brand": "MAXXION",
    "image": "/products/bnc_dc_pins.jpg",
    "badge": "Accessory",
    "priceRange": "₹47",
    "price": 47,
    "mrp": 67,
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
    "id": "prod-44",
    "name": "FYBER RJ45 CONNECTORS - FYJC5E",
    "category": "cables_power",
    "brand": "FYBER",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/19b8d19f-4ded-4f09-89ba-3daa9b7a4f2e.png",
    "badge": "Accessory",
    "priceRange": "₹0",
    "price": 0,
    "mrp": 20,
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
    "id": "prod-45",
    "name": "FYBER RJ45 CONNECTORS - FY-RJC5E",
    "category": "cables_power",
    "brand": "FYBER",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/19b8d19f-4ded-4f09-89ba-3daa9b7a4f2e.png",
    "badge": "Accessory",
    "priceRange": "₹9",
    "price": 9,
    "mrp": 29,
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
    "id": "prod-50",
    "name": "RJ 45 JOINTER - 1X1",
    "category": "cables_power",
    "brand": "MEKSHA",
    "image": "https://dms.mydukaan.io/original/jpeg/download-and-upload/19b8d19f-4ded-4f09-89ba-3daa9b7a4f2e.png",
    "badge": "Accessory",
    "priceRange": "₹59",
    "price": 59,
    "mrp": 100,
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
    "id": "prod-46",
    "name": "iFYBER 4X4 MODULAR BOX - FYJC-77(B)",
    "category": "cables_power",
    "brand": "FYBER",
    "image": "/products/junction_box.jpg",
    "badge": "Accessory",
    "priceRange": "₹53",
    "price": 53,
    "mrp": 73,
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
    "id": "prod-47",
    "name": "iFYBER 5X5 MODULAR BOX - FYJC-88(B)",
    "category": "cables_power",
    "brand": "FYBER",
    "image": "/products/junction_box.jpg",
    "badge": "Accessory",
    "priceRange": "₹65",
    "price": 65,
    "mrp": 100,
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
