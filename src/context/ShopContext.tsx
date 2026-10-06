import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ServiceItem, ShopContactInfo, CctvPricingConfig, DEFAULT_CCTV_PRICING, BrandPartner, DEFAULT_BRANDS } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS, SERVICES as DEFAULT_SERVICES } from '../data/shopData';
import { SHOP_INFO as DEFAULT_SHOP_INFO } from '../utils/whatsapp';

interface ShopContextType {
  products: Product[];
  services: ServiceItem[];
  brands: BrandPartner[];
  shopInfo: ShopContactInfo;
  cctvPricing: CctvPricingConfig;
  adminPassword: string;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  addBrand: (brand: Omit<BrandPartner, 'id'>) => void;
  updateBrand: (id: string, updated: Partial<BrandPartner>) => void;
  deleteBrand: (id: string) => void;
  resetBrands: () => void;
  updateShopInfo: (info: ShopContactInfo) => void;
  updateCctvPricing: (pricing: CctvPricingConfig) => void;
  resetCctvPricing: () => void;
  updateAdminPassword: (newPass: string) => void;
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'meksha_shop_products_v9',
  SERVICES: 'meksha_shop_services_v9',
  BRANDS: 'meksha_shop_brands_v9',
  SHOP_INFO: 'meksha_shop_info_v9',
  CCTV_PRICING: 'meksha_cctv_pricing_v9',
  ADMIN_PASS: 'meksha_shop_admin_pass_v4'
};

const DEFAULT_PASS = 'meksha@2026';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products state with auto-migration / cleanup
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      // Clean up legacy storage if present
      localStorage.removeItem('meksha_shop_products_v8');
      localStorage.removeItem('meksha_shop_services_v8');
      localStorage.removeItem('meksha_shop_brands_v8');
      localStorage.removeItem('meksha_shop_info_v8');
      localStorage.removeItem('meksha_shop_products_v4');
      localStorage.removeItem('meksha_shop_services_v4');
      localStorage.removeItem('meksha_shop_brands_v4');
      localStorage.removeItem('meksha_shop_info_v4');
      localStorage.removeItem('meksha_shop_products_v3');
      localStorage.removeItem('meksha_shop_services_v3');
      localStorage.removeItem('meksha_shop_info_v3');
      localStorage.removeItem('meksha_shop_products_v2');
      localStorage.removeItem('meksha_shop_services_v2');
      localStorage.removeItem('meksha_shop_products_v1');
      localStorage.removeItem('cctv_products_data');

      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // 2. Services state
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  // 3. Trusted Brand Partners state
  const [brands, setBrands] = useState<BrandPartner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return DEFAULT_BRANDS;
    } catch {
      return DEFAULT_BRANDS;
    }
  });

  // 4. Shop Info state
  const [shopInfo, setShopInfo] = useState<ShopContactInfo>(() => {
    const defaultWebhook = 'https://script.google.com/macros/s/AKfycbzXmQwZ0f3EzFWkvWy_hqNBRpBy8ETYI9Rdql9Q6P3RXxlJEaIN_jVl_Vnjgkb_2x13mw/exec';
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOP_INFO);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.googleSheetWebhookUrl) {
          parsed.googleSheetWebhookUrl = defaultWebhook;
        }
        if (
          parsed.whatsappPhone === '919845012345' || 
          parsed.phone === '+91 98450 12345' || 
          parsed.phone === '+91 96066 78763' || 
          parsed.whatsappPhone === '919606678763' ||
          parsed.phone === '+91 80504 26215' ||
          parsed.whatsappPhone === '918050426215' ||
          parsed.phone?.includes('80504') ||
          parsed.whatsappPhone?.includes('80504') ||
          parsed.phone?.includes('96066') ||
          parsed.whatsappPhone?.includes('96066') ||
          parsed.phone?.includes('98450') ||
          parsed.whatsappPhone?.includes('98450')
        ) {
          parsed.phone = DEFAULT_SHOP_INFO.phone;
          parsed.whatsappPhone = DEFAULT_SHOP_INFO.whatsappNumber;
        }
        if (!parsed.address || parsed.address.includes('Main Road, Opp. Bus Stand')) {
          parsed.address = DEFAULT_SHOP_INFO.address;
          parsed.city = DEFAULT_SHOP_INFO.city;
        }
        if (!parsed.shopName || parsed.shopName === 'Meksha Solutions') {
          parsed.shopName = DEFAULT_SHOP_INFO.shopName;
        }
        if (!parsed.tagline || parsed.tagline.includes('Batteries') || parsed.tagline.includes('Inverters')) {
          parsed.tagline = DEFAULT_SHOP_INFO.tagline;
        }
        if (!parsed.instagramUrl) {
          parsed.instagramUrl = DEFAULT_SHOP_INFO.instagramUrl;
        }
        if (!parsed.googleMapsUrl || parsed.googleMapsUrl.includes('q=Meksha') || parsed.googleMapsUrl.includes('maps.google.com/?q=')) {
          parsed.googleMapsUrl = DEFAULT_SHOP_INFO.googleMapsUrl;
        }
        return parsed;
      }
      return {
        shopName: DEFAULT_SHOP_INFO.shopName,
        tagline: DEFAULT_SHOP_INFO.tagline,
        phone: DEFAULT_SHOP_INFO.phone,
        whatsappPhone: DEFAULT_SHOP_INFO.whatsappNumber,
        email: DEFAULT_SHOP_INFO.email,
        address: DEFAULT_SHOP_INFO.address,
        city: DEFAULT_SHOP_INFO.city,
        googleMapsUrl: DEFAULT_SHOP_INFO.googleMapsUrl,
        workingHours: DEFAULT_SHOP_INFO.workingHours,
        workingDays: DEFAULT_SHOP_INFO.workingDays,
        instagramUrl: DEFAULT_SHOP_INFO.instagramUrl,
        googleSheetWebhookUrl: defaultWebhook,
        googleSheetViewUrl: ''
      };
    } catch {
      return {
        shopName: DEFAULT_SHOP_INFO.shopName,
        tagline: DEFAULT_SHOP_INFO.tagline,
        phone: DEFAULT_SHOP_INFO.phone,
        whatsappPhone: DEFAULT_SHOP_INFO.whatsappNumber,
        email: DEFAULT_SHOP_INFO.email,
        address: DEFAULT_SHOP_INFO.address,
        city: DEFAULT_SHOP_INFO.city,
        googleMapsUrl: DEFAULT_SHOP_INFO.googleMapsUrl,
        workingHours: DEFAULT_SHOP_INFO.workingHours,
        workingDays: DEFAULT_SHOP_INFO.workingDays,
        instagramUrl: DEFAULT_SHOP_INFO.instagramUrl,
        googleSheetWebhookUrl: defaultWebhook,
        googleSheetViewUrl: ''
      };
    }
  });

  // 4. CCTV Estimator Pricing Config state
  const [cctvPricing, setCctvPricing] = useState<CctvPricingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CCTV_PRICING);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CCTV_PRICING, ...parsed };
      }
      return DEFAULT_CCTV_PRICING;
    } catch {
      return DEFAULT_CCTV_PRICING;
    }
  });

  // 5. Admin Password state
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS);
      return saved || DEFAULT_PASS;
    } catch {
      return DEFAULT_PASS;
    }
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error('Failed to save services to localStorage', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
    } catch (e) {
      console.error('Failed to save brands to localStorage', e);
    }
  }, [brands]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOP_INFO, JSON.stringify(shopInfo));
    } catch (e) {
      console.error('Failed to save shop info to localStorage', e);
    }
  }, [shopInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CCTV_PRICING, JSON.stringify(cctvPricing));
    } catch (e) {
      console.error('Failed to save CCTV pricing to localStorage', e);
    }
  }, [cctvPricing]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, adminPassword);
    } catch (e) {
      console.error('Failed to save admin password to localStorage', e);
    }
  }, [adminPassword]);

  // Listen for storage events across tabs to sync admin changes to storefront in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === STORAGE_KEYS.PRODUCTS) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
          }
        } else if (e.key === STORAGE_KEYS.SERVICES) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setServices(parsed);
          }
        } else if (e.key === STORAGE_KEYS.BRANDS) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setBrands(parsed);
          }
        } else if (e.key === STORAGE_KEYS.SHOP_INFO) {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            setShopInfo(parsed);
          }
        } else if (e.key === STORAGE_KEYS.CCTV_PRICING) {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            setCctvPricing(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to sync storage event across tabs', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Product CRUD
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    setProducts(prev => [ { ...newProd, id }, ...prev ]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Service CRUD
  const addService = (newSrv: Omit<ServiceItem, 'id'>) => {
    const id = `srv-${Date.now()}`;
    setServices(prev => [ ...prev, { ...newSrv, id } ]);
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Brand CRUD
  const addBrand = (newBrand: Omit<BrandPartner, 'id'>) => {
    const id = `brand-${Date.now()}`;
    setBrands(prev => [ ...prev, { ...newBrand, id } ]);
  };

  const updateBrand = (id: string, updated: Partial<BrandPartner>) => {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
  };

  const deleteBrand = (id: string) => {
    setBrands(prev => prev.filter(b => b.id !== id));
  };

  const resetBrands = () => {
    setBrands(DEFAULT_BRANDS);
  };

  // Shop Info, CCTV Pricing & Password
  const updateShopInfo = (newInfo: ShopContactInfo) => {
    setShopInfo(newInfo);
  };

  const updateCctvPricing = (newPricing: CctvPricingConfig) => {
    setCctvPricing(newPricing);
  };

  const resetCctvPricing = () => {
    setCctvPricing(DEFAULT_CCTV_PRICING);
  };

  const updateAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
  };

  // Reset to default seed
  const resetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setServices(DEFAULT_SERVICES);
    setBrands(DEFAULT_BRANDS);
    setCctvPricing(DEFAULT_CCTV_PRICING);
    setShopInfo({
      shopName: DEFAULT_SHOP_INFO.shopName,
      tagline: DEFAULT_SHOP_INFO.tagline,
      phone: DEFAULT_SHOP_INFO.phone,
      whatsappPhone: DEFAULT_SHOP_INFO.whatsappNumber,
      email: DEFAULT_SHOP_INFO.email,
      address: DEFAULT_SHOP_INFO.address,
      city: DEFAULT_SHOP_INFO.city,
      googleMapsUrl: DEFAULT_SHOP_INFO.googleMapsUrl,
      workingHours: DEFAULT_SHOP_INFO.workingHours,
      workingDays: DEFAULT_SHOP_INFO.workingDays,
      instagramUrl: DEFAULT_SHOP_INFO.instagramUrl,
      googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbzXmQwZ0f3EzFWkvWy_hqNBRpBy8ETYI9Rdql9Q6P3RXxlJEaIN_jVl_Vnjgkb_2x13mw/exec',
      googleSheetViewUrl: ''
    });
    setAdminPassword(DEFAULT_PASS);
  };

  // Backup / Export / Import
  const exportDataJSON = () => {
    return JSON.stringify({
      products,
      services,
      brands,
      shopInfo,
      cctvPricing,
      exportedAt: new Date().toISOString()
    }, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products && Array.isArray(parsed.products)) {
        setProducts(parsed.products);
      }
      if (parsed.services && Array.isArray(parsed.services)) {
        setServices(parsed.services);
      }
      if (parsed.brands && Array.isArray(parsed.brands)) {
        setBrands(parsed.brands);
      }
      if (parsed.shopInfo) {
        setShopInfo(parsed.shopInfo);
      }
      if (parsed.cctvPricing) {
        setCctvPricing(parsed.cctvPricing);
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ShopContext.Provider value={{
      products,
      services,
      brands,
      shopInfo,
      cctvPricing,
      adminPassword,
      addProduct,
      updateProduct,
      deleteProduct,
      addService,
      updateService,
      deleteService,
      addBrand,
      updateBrand,
      deleteBrand,
      resetBrands,
      updateShopInfo,
      updateCctvPricing,
      resetCctvPricing,
      updateAdminPassword,
      resetToDefaults,
      exportDataJSON,
      importDataJSON
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
