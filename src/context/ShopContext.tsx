import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ServiceItem, ShopContactInfo } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS, SERVICES as DEFAULT_SERVICES } from '../data/shopData';
import { SHOP_INFO as DEFAULT_SHOP_INFO } from '../utils/whatsapp';

interface ShopContextType {
  products: Product[];
  services: ServiceItem[];
  shopInfo: ShopContactInfo;
  adminPassword: string;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  updateShopInfo: (info: ShopContactInfo) => void;
  updateAdminPassword: (newPass: string) => void;
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'meksha_shop_products_v2',
  SERVICES: 'meksha_shop_services_v2',
  SHOP_INFO: 'meksha_shop_info_v2',
  ADMIN_PASS: 'meksha_shop_admin_pass_v2'
};

const DEFAULT_PASS = 'meksha@2026';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // 2. Services state
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  // 3. Shop Info state
  const [shopInfo, setShopInfo] = useState<ShopContactInfo>(() => {
    const defaultWebhook = 'https://script.google.com/macros/s/AKfycbzXmQwZ0f3EzFWkvWy_hqNBRpBy8ETYI9Rdql9Q6P3RXxlJEaIN_jVl_Vnjgkb_2x13mw/exec';
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOP_INFO);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.googleSheetWebhookUrl) {
          parsed.googleSheetWebhookUrl = defaultWebhook;
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
        googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(DEFAULT_SHOP_INFO.shopName + ' ' + DEFAULT_SHOP_INFO.city)}`,
        workingHours: DEFAULT_SHOP_INFO.workingHours,
        workingDays: DEFAULT_SHOP_INFO.workingDays,
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
        googleMapsUrl: '',
        workingHours: DEFAULT_SHOP_INFO.workingHours,
        workingDays: DEFAULT_SHOP_INFO.workingDays,
        googleSheetWebhookUrl: defaultWebhook,
        googleSheetViewUrl: ''
      };
    }
  });

  // 4. Admin Password state
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
      localStorage.setItem(STORAGE_KEYS.SHOP_INFO, JSON.stringify(shopInfo));
    } catch (e) {
      console.error('Failed to save shop info to localStorage', e);
    }
  }, [shopInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, adminPassword);
    } catch (e) {
      console.error('Failed to save admin password to localStorage', e);
    }
  }, [adminPassword]);

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

  // Shop Info & Password
  const updateShopInfo = (newInfo: ShopContactInfo) => {
    setShopInfo(newInfo);
  };

  const updateAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
  };

  // Reset to default seed
  const resetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setServices(DEFAULT_SERVICES);
    setShopInfo({
      shopName: DEFAULT_SHOP_INFO.shopName,
      tagline: DEFAULT_SHOP_INFO.tagline,
      phone: DEFAULT_SHOP_INFO.phone,
      whatsappPhone: DEFAULT_SHOP_INFO.whatsappNumber,
      email: DEFAULT_SHOP_INFO.email,
      address: DEFAULT_SHOP_INFO.address,
      city: DEFAULT_SHOP_INFO.city,
      googleMapsUrl: '',
      workingHours: DEFAULT_SHOP_INFO.workingHours,
      workingDays: DEFAULT_SHOP_INFO.workingDays
    });
    setAdminPassword(DEFAULT_PASS);
  };

  // Backup / Export / Import
  const exportDataJSON = () => {
    return JSON.stringify({
      products,
      services,
      shopInfo,
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
      if (parsed.shopInfo) {
        setShopInfo(parsed.shopInfo);
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
      shopInfo,
      adminPassword,
      addProduct,
      updateProduct,
      deleteProduct,
      addService,
      updateService,
      deleteService,
      updateShopInfo,
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
