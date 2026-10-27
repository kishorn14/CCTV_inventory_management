import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, ProductCategory, ServiceItem, ShopContactInfo, CctvPricingConfig, DEFAULT_CCTV_PRICING, BrandPartner, DEFAULT_BRANDS, ComboOffer, SiteVisit } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS, SERVICES as DEFAULT_SERVICES, DEFAULT_PRODUCT_CATEGORIES, DEFAULT_COMBO_OFFERS } from '../data/shopData';
import persistedStoreData from '../data/persistedStoreData.json';

interface PersistedStoreType {
  categories?: ProductCategory[];
  products?: Product[];
  services?: ServiceItem[];
  brands?: BrandPartner[];
  comboOffers?: ComboOffer[];
  siteVisits?: SiteVisit[];
  shopInfo?: Partial<ShopContactInfo>;
  cctvPricing?: Partial<CctvPricingConfig>;
}

const bundledData = (persistedStoreData as unknown) as PersistedStoreType;
import { SHOP_INFO as DEFAULT_SHOP_INFO } from '../utils/whatsapp';

interface ShopContextType {
  products: Product[];
  categories: ProductCategory[];
  services: ServiceItem[];
  brands: BrandPartner[];
  comboOffers: ComboOffer[];
  siteVisits: SiteVisit[];
  shopInfo: ShopContactInfo;
  cctvPricing: CctvPricingConfig;
  adminPassword: string;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductCategory: (productId: string, categoryId: string | undefined, categoryNumber: number | undefined) => void;
  updateProductCategoryNumber: (productId: string, categoryNumber: number | undefined) => void;
  updateProductCategories: (productId: string, categoryIds: string[], categoryNumbers: number[]) => void;
  addCategory: (category: Omit<ProductCategory, 'id'>) => void;
  updateCategory: (id: string, updated: Partial<ProductCategory>) => void;
  deleteCategory: (id: string) => void;
  swapCategoryOrder: (catId1: string, catId2: string) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  addBrand: (brand: Omit<BrandPartner, 'id'>) => void;
  updateBrand: (id: string, updated: Partial<BrandPartner>) => void;
  deleteBrand: (id: string) => void;
  resetBrands: () => void;
  addComboOffer: (offer: Omit<ComboOffer, 'id'>) => void;
  updateComboOffer: (id: string, updated: Partial<ComboOffer>) => void;
  deleteComboOffer: (id: string) => void;
  addSiteVisit: (visitData: Omit<SiteVisit, 'id' | 'visitNumber' | 'timestamp' | 'formattedDate'>) => SiteVisit;
  updateSiteVisit: (id: string, updated: Partial<SiteVisit>) => void;
  deleteSiteVisit: (id: string) => void;
  updateShopInfo: (info: ShopContactInfo) => void;
  updateCctvPricing: (pricing: CctvPricingConfig) => void;
  resetCctvPricing: () => void;
  updateAdminPassword: (newPass: string) => void;
  forceSyncToDisk: () => Promise<boolean>;
  cart: Record<string, number>;
  addToCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'meksha_shop_products_v15',
  CATEGORIES: 'meksha_shop_categories_v5',
  SERVICES: 'meksha_shop_services_v11',
  BRANDS: 'meksha_shop_brands_v11',
  COMBO_OFFERS: 'meksha_shop_combos_v1',
  SITE_VISITS: 'meksha_site_visits_v1',
  SHOP_INFO: 'meksha_shop_info_v11',
  CCTV_PRICING: 'meksha_cctv_pricing_v11',
  ADMIN_PASS: 'meksha_shop_admin_pass_v4'
};

const DEFAULT_PASS = 'meksha@2026';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Categories state (orderNumber determines order: 1 comes first, 2 below 1, etc.)
  const [categories, setCategories] = useState<ProductCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a: ProductCategory, b: ProductCategory) => a.orderNumber - b.orderNumber);
        }
      }
    } catch {}
    const base = bundledData.categories || DEFAULT_PRODUCT_CATEGORIES;
    return Array.isArray(base) && base.length > 0
      ? [...base].sort((a: ProductCategory, b: ProductCategory) => a.orderNumber - b.orderNumber)
      : DEFAULT_PRODUCT_CATEGORIES;
  });

  // 2. Products state with auto-migration from bundled admin persisted data
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    const base = bundledData.products || DEFAULT_PRODUCTS;
    return Array.isArray(base) && base.length > 0 ? base : DEFAULT_PRODUCTS;
  });

  // 3. Services state
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    const base = bundledData.services || DEFAULT_SERVICES;
    return Array.isArray(base) && base.length > 0 ? base : DEFAULT_SERVICES;
  });

  // 4. Trusted Brand Partners state
  const [brands, setBrands] = useState<BrandPartner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    const base = bundledData.brands || DEFAULT_BRANDS;
    return Array.isArray(base) && base.length > 0 ? base : DEFAULT_BRANDS;
  });

  // 5. Shop Info state
  const [shopInfo, setShopInfo] = useState<ShopContactInfo>(() => {
    const defaultWebhook = 'https://script.google.com/macros/s/AKfycbzXmQwZ0f3EzFWkvWy_hqNBRpBy8ETYI9Rdql9Q6P3RXxlJEaIN_jVl_Vnjgkb_2x13mw/exec';
    const fallbackInfo: ShopContactInfo = {
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
    const baseInfo = { ...fallbackInfo, ...(bundledData.shopInfo || {}) };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOP_INFO);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...baseInfo, ...parsed };
      }
    } catch {}
    return baseInfo;
  });

  // 6. CCTV Estimator Pricing Config state (locks admin configured pricing across releases)
  const [cctvPricing, setCctvPricing] = useState<CctvPricingConfig>(() => {
    const basePricing: CctvPricingConfig = {
      ...DEFAULT_CCTV_PRICING,
      ...(bundledData.cctvPricing || {})
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CCTV_PRICING);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...basePricing, ...parsed };
      }
    } catch {}
    return basePricing;
  });

  // 7. Combo Offers state (Configured by admin, auto-rotating hero banner)
  const [comboOffers, setComboOffers] = useState<ComboOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMBO_OFFERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated = parsed.map((c: ComboOffer) => {
            if (c.id === 'combo-solar' && (!c.image || c.image.includes('cpplusworld'))) {
              return { ...c, image: '/combos/solar_combo_banner.jpg' };
            }
            if (c.id === 'combo-ip' && (!c.image || c.image.includes('cpplusworld'))) {
              return { ...c, image: '/combos/ip_combo_banner.jpg' };
            }
            if (c.id === 'combo-analog' && (!c.image || c.image.includes('ncaps'))) {
              return { ...c, image: '/combos/analog_combo_banner.jpg' };
            }
            return c;
          });
          return migrated.sort((a: ComboOffer, b: ComboOffer) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
        }
      }
    } catch {}
    const base = bundledData.comboOffers || DEFAULT_COMBO_OFFERS;
    if (Array.isArray(base) && base.length > 0) {
      const migrated = base.map((c: ComboOffer) => {
        if (c.id === 'combo-solar' && (!c.image || c.image.includes('cpplusworld'))) {
          return { ...c, image: '/combos/solar_combo_banner.jpg' };
        }
        if (c.id === 'combo-ip' && (!c.image || c.image.includes('cpplusworld'))) {
          return { ...c, image: '/combos/ip_combo_banner.jpg' };
        }
        if (c.id === 'combo-analog' && (!c.image || c.image.includes('ncaps'))) {
          return { ...c, image: '/combos/analog_combo_banner.jpg' };
        }
        return c;
      });
      return migrated.sort((a: ComboOffer, b: ComboOffer) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
    }
    return DEFAULT_COMBO_OFFERS;
  });

  // 8. Site Visits state (Field Inspection Reports conducted by technicians)
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_VISITS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return bundledData.siteVisits || [];
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

  // 6. Cart state
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('meksha_shop_cart_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('meksha_shop_cart_v1', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
  };

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
      localStorage.setItem(STORAGE_KEYS.COMBO_OFFERS, JSON.stringify(comboOffers));
    } catch (e) {
      console.error('Failed to save combo offers to localStorage', e);
    }
  }, [comboOffers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

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
        } else if (e.key === STORAGE_KEYS.CATEGORIES) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCategories(parsed);
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
        } else if (e.key === STORAGE_KEYS.COMBO_OFFERS) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setComboOffers(parsed);
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

  const isReadyToSaveRef = useRef<boolean>(false);

  // Latest state references for instant synchronous persistence
  const categoriesRef = useRef(categories);
  const productsRef = useRef(products);
  const servicesRef = useRef(services);
  const brandsRef = useRef(brands);
  const comboOffersRef = useRef(comboOffers);
  const siteVisitsRef = useRef(siteVisits);
  const shopInfoRef = useRef(shopInfo);
  const cctvPricingRef = useRef(cctvPricing);

  useEffect(() => { categoriesRef.current = categories; }, [categories]);
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { servicesRef.current = services; }, [services]);
  useEffect(() => { brandsRef.current = brands; }, [brands]);
  useEffect(() => { comboOffersRef.current = comboOffers; }, [comboOffers]);
  useEffect(() => { siteVisitsRef.current = siteVisits; }, [siteVisits]);
  useEffect(() => { shopInfoRef.current = shopInfo; }, [shopInfo]);
  useEffect(() => { cctvPricingRef.current = cctvPricing; }, [cctvPricing]);

  // Immediate disk persistence helper that bypasses debounce
  const saveDirectlyToDisk = (override?: {
    categories?: ProductCategory[];
    products?: Product[];
    services?: ServiceItem[];
    brands?: BrandPartner[];
    comboOffers?: ComboOffer[];
    siteVisits?: SiteVisit[];
    shopInfo?: ShopContactInfo;
    cctvPricing?: CctvPricingConfig;
  }) => {
    const payload = {
      categories: override?.categories || categoriesRef.current,
      products: override?.products || productsRef.current,
      services: override?.services || servicesRef.current,
      brands: override?.brands || brandsRef.current,
      comboOffers: override?.comboOffers || comboOffersRef.current,
      siteVisits: override?.siteVisits || siteVisitsRef.current,
      shopInfo: override?.shopInfo || shopInfoRef.current,
      cctvPricing: override?.cctvPricing || cctvPricingRef.current
    };
    fetch('/api/save-store-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.warn('Silent save-store-data warning:', err);
    });
  };

  const forceSyncToDisk = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/save-store-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: categoriesRef.current,
          products: productsRef.current,
          services: servicesRef.current,
          brands: brandsRef.current,
          comboOffers: comboOffersRef.current,
          siteVisits: siteVisitsRef.current,
          shopInfo: shopInfoRef.current,
          cctvPricing: cctvPricingRef.current
        })
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  // Fetch live store data from backend API on mount to sync across all browsers and devices
  useEffect(() => {
    fetch('/api/get-store-data')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object') {
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            const sorted = data.categories.sort((a: ProductCategory, b: ProductCategory) => a.orderNumber - b.orderNumber);
            setCategories(sorted);
            try { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(sorted)); } catch {}
          }
          if (Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
            try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products)); } catch {}
          }
          if (Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
            try { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data.services)); } catch {}
          }
          if (Array.isArray(data.brands) && data.brands.length > 0) {
            setBrands(data.brands);
            try { localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(data.brands)); } catch {}
          }
          if (Array.isArray(data.comboOffers) && data.comboOffers.length > 0) {
            const sorted = data.comboOffers.sort((a: ComboOffer, b: ComboOffer) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
            setComboOffers(sorted);
            try { localStorage.setItem(STORAGE_KEYS.COMBO_OFFERS, JSON.stringify(sorted)); } catch {}
          }
          if (Array.isArray(data.siteVisits)) {
            setSiteVisits(data.siteVisits);
            try { localStorage.setItem(STORAGE_KEYS.SITE_VISITS, JSON.stringify(data.siteVisits)); } catch {}
          }
          if (data.shopInfo && typeof data.shopInfo === 'object') {
            setShopInfo(prev => {
              const updated = { ...prev, ...data.shopInfo };
              try { localStorage.setItem(STORAGE_KEYS.SHOP_INFO, JSON.stringify(updated)); } catch {}
              return updated;
            });
          }
          if (data.cctvPricing && typeof data.cctvPricing === 'object') {
            setCctvPricing(prev => {
              const updated = { ...prev, ...data.cctvPricing };
              try { localStorage.setItem(STORAGE_KEYS.CCTV_PRICING, JSON.stringify(updated)); } catch {}
              return updated;
            });
          }
        }
      })
      .catch(() => {
        // Fallback silently if offline or static host
      })
      .finally(() => {
        setTimeout(() => {
          isReadyToSaveRef.current = true;
        }, 300);
      });
  }, []);

  // Secondary debounced persist to disk whenever store data changes
  useEffect(() => {
    if (!isReadyToSaveRef.current) return;
    if (products.length === 0 || categories.length === 0) return;

    const timeoutId = setTimeout(() => {
      saveDirectlyToDisk();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [categories, products, services, brands, shopInfo, cctvPricing]);

  // Product CRUD
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    isReadyToSaveRef.current = true;
    const id = `prod-${Date.now()}`;
    setProducts(prev => {
      const next = [ { ...newProd, id }, ...prev ];
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ products: next });
      return next;
    });
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    isReadyToSaveRef.current = true;
    setProducts(prev => {
      const nextProducts = prev.map(p => {
        if (p.id !== id) return p;
        const next = { ...p, ...updated };
        if (!updated.warranty || updated.warranty.trim() === '') {
          delete next.warranty;
        } else {
          next.warranty = updated.warranty.trim();
        }
        return next;
      });
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(nextProducts)); } catch {}
      saveDirectlyToDisk({ products: nextProducts });
      return nextProducts;
    });
  };

  const deleteProduct = (id: string) => {
    isReadyToSaveRef.current = true;
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ products: next });
      return next;
    });
  };

  const updateProductCategory = (productId: string, categoryId: string | undefined, categoryNumber: number | undefined) => {
    isReadyToSaveRef.current = true;
    setProducts(prev => {
      const next = prev.map(p => p.id === productId ? { ...p, categoryId, categoryNumber } : p);
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ products: next });
      return next;
    });
  };

  const updateProductCategoryNumber = (productId: string, categoryNumber: number | undefined) => {
    isReadyToSaveRef.current = true;
    setProducts(prev => {
      const next = prev.map(p => p.id === productId ? { ...p, categoryNumber } : p);
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ products: next });
      return next;
    });
  };

  const updateProductCategories = (productId: string, categoryIds: string[], categoryNumbers: number[]) => {
    isReadyToSaveRef.current = true;
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          categoryId: categoryIds[0] || undefined,
          categoryNumber: categoryNumbers[0] !== undefined ? categoryNumbers[0] : undefined,
          categoryIds,
          categoryNumbers
        };
      });
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ products: next });
      return next;
    });
  };

  // Category CRUD
  const addCategory = (categoryData: Omit<ProductCategory, 'id'>) => {
    isReadyToSaveRef.current = true;
    const id = `cat-${Date.now()}`;
    setCategories(prev => {
      const next = [...prev, { ...categoryData, id }].sort((a, b) => a.orderNumber - b.orderNumber);
      try { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ categories: next });
      return next;
    });
  };

  const updateCategory = (id: string, updated: Partial<ProductCategory>) => {
    isReadyToSaveRef.current = true;
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updated } : c).sort((a, b) => a.orderNumber - b.orderNumber);
      try { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ categories: next });
      return next;
    });
  };

  const deleteCategory = (id: string) => {
    isReadyToSaveRef.current = true;
    setCategories(prev => {
      const nextCats = prev.filter(c => c.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(nextCats)); } catch {}
      saveDirectlyToDisk({ categories: nextCats });
      return nextCats;
    });
    setProducts(prev => {
      const nextProds = prev.map(p => p.categoryId === id ? { ...p, categoryId: undefined, categoryNumber: undefined } : p);
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(nextProds)); } catch {}
      saveDirectlyToDisk({ products: nextProds });
      return nextProds;
    });
  };

  const swapCategoryOrder = (catId1: string, catId2: string) => {
    isReadyToSaveRef.current = true;
    setCategories(prev => {
      const cat1 = prev.find(c => c.id === catId1);
      const cat2 = prev.find(c => c.id === catId2);
      if (!cat1 || !cat2) return prev;
      const order1 = cat1.orderNumber;
      const order2 = cat2.orderNumber;

      const nextCategories = prev.map(c => {
        if (c.id === catId1) return { ...c, orderNumber: order2 };
        if (c.id === catId2) return { ...c, orderNumber: order1 };
        return c;
      }).sort((a, b) => a.orderNumber - b.orderNumber);

      // Keep products in sync with the swapped order numbers
      setProducts(prodPrev => {
        const nextProducts = prodPrev.map(p => {
          if (p.categoryId === catId1) {
            return { ...p, categoryNumber: order2 };
          }
          if (p.categoryId === catId2) {
            return { ...p, categoryNumber: order1 };
          }
          return p;
        });
        try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(nextProducts)); } catch {}
        saveDirectlyToDisk({ categories: nextCategories, products: nextProducts });
        return nextProducts;
      });

      try { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(nextCategories)); } catch {}
      return nextCategories;
    });
  };

  // Service CRUD
  const addService = (newSrv: Omit<ServiceItem, 'id'>) => {
    isReadyToSaveRef.current = true;
    const id = `srv-${Date.now()}`;
    setServices(prev => {
      const next = [ ...prev, { ...newSrv, id } ];
      try { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ services: next });
      return next;
    });
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    isReadyToSaveRef.current = true;
    setServices(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updated } : s);
      try { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ services: next });
      return next;
    });
  };

  const deleteService = (id: string) => {
    isReadyToSaveRef.current = true;
    setServices(prev => {
      const next = prev.filter(s => s.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ services: next });
      return next;
    });
  };

  // Brand CRUD
  const addBrand = (newBrand: Omit<BrandPartner, 'id'>) => {
    isReadyToSaveRef.current = true;
    const id = `brand-${Date.now()}`;
    setBrands(prev => {
      const next = [ ...prev, { ...newBrand, id } ];
      try { localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ brands: next });
      return next;
    });
  };

  const updateBrand = (id: string, updated: Partial<BrandPartner>) => {
    isReadyToSaveRef.current = true;
    setBrands(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...updated } : b);
      try { localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ brands: next });
      return next;
    });
  };

  const deleteBrand = (id: string) => {
    isReadyToSaveRef.current = true;
    setBrands(prev => {
      const next = prev.filter(b => b.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ brands: next });
      return next;
    });
  };

  const resetBrands = () => {
    isReadyToSaveRef.current = true;
    const baseline = bundledData.brands || DEFAULT_BRANDS;
    setBrands(baseline);
    try { localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(baseline)); } catch {}
    saveDirectlyToDisk({ brands: baseline });
  };

  // Combo Offer CRUD (Banners configured by admin)
  const addComboOffer = (offerData: Omit<ComboOffer, 'id'>) => {
    isReadyToSaveRef.current = true;
    const id = `combo-${Date.now()}`;
    setComboOffers(prev => {
      const next = [...prev, { ...offerData, id, orderNumber: offerData.orderNumber ?? (prev.length + 1) }]
        .sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
      try { localStorage.setItem(STORAGE_KEYS.COMBO_OFFERS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ comboOffers: next });
      return next;
    });
  };

  const updateComboOffer = (id: string, updated: Partial<ComboOffer>) => {
    isReadyToSaveRef.current = true;
    setComboOffers(prev => {
      const next = prev.map(o => o.id === id ? { ...o, ...updated } : o)
        .sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));
      try { localStorage.setItem(STORAGE_KEYS.COMBO_OFFERS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ comboOffers: next });
      return next;
    });
  };

  const deleteComboOffer = (id: string) => {
    isReadyToSaveRef.current = true;
    setComboOffers(prev => {
      const next = prev.filter(o => o.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.COMBO_OFFERS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ comboOffers: next });
      return next;
    });
  };

  // Site Visits Management (Field Inspection Records)
  const addSiteVisit = (visitData: Omit<SiteVisit, 'id' | 'visitNumber' | 'timestamp' | 'formattedDate'>): SiteVisit => {
    isReadyToSaveRef.current = true;
    const count = siteVisits.length + 1;
    const visitNumber = `SV-${1000 + count}`;
    const now = new Date();
    const formattedDate = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newVisit: SiteVisit = {
      ...visitData,
      id: `sv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      visitNumber,
      timestamp: now.toISOString(),
      formattedDate
    };

    setSiteVisits(prev => {
      const next = [newVisit, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.SITE_VISITS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ siteVisits: next });
      return next;
    });

    return newVisit;
  };

  const updateSiteVisit = (id: string, updated: Partial<SiteVisit>) => {
    isReadyToSaveRef.current = true;
    setSiteVisits(prev => {
      const next = prev.map(v => v.id === id ? { ...v, ...updated } : v);
      try { localStorage.setItem(STORAGE_KEYS.SITE_VISITS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ siteVisits: next });
      return next;
    });
  };

  const deleteSiteVisit = (id: string) => {
    isReadyToSaveRef.current = true;
    setSiteVisits(prev => {
      const next = prev.filter(v => v.id !== id);
      try { localStorage.setItem(STORAGE_KEYS.SITE_VISITS, JSON.stringify(next)); } catch {}
      saveDirectlyToDisk({ siteVisits: next });
      return next;
    });
  };

  // Shop Info, CCTV Pricing & Password
  const updateShopInfo = (newInfo: ShopContactInfo) => {
    isReadyToSaveRef.current = true;
    setShopInfo(newInfo);
    try { localStorage.setItem(STORAGE_KEYS.SHOP_INFO, JSON.stringify(newInfo)); } catch {}
    saveDirectlyToDisk({ shopInfo: newInfo });
  };

  const updateCctvPricing = (newPricing: CctvPricingConfig) => {
    isReadyToSaveRef.current = true;
    setCctvPricing(newPricing);
    try { localStorage.setItem(STORAGE_KEYS.CCTV_PRICING, JSON.stringify(newPricing)); } catch {}
    saveDirectlyToDisk({ cctvPricing: newPricing });
  };

  const resetCctvPricing = () => {
    isReadyToSaveRef.current = true;
    const baseline: CctvPricingConfig = {
      ...DEFAULT_CCTV_PRICING,
      ...(bundledData.cctvPricing || {})
    };
    setCctvPricing(baseline);
    try { localStorage.setItem(STORAGE_KEYS.CCTV_PRICING, JSON.stringify(baseline)); } catch {}
    saveDirectlyToDisk({ cctvPricing: baseline });
  };

  const updateAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
  };

  // Reset to default seed (uses current admin-configured baseline, not ancient template)
  const resetToDefaults = () => {
    const baseCats = bundledData.categories || DEFAULT_PRODUCT_CATEGORIES;
    const baseProds = bundledData.products || DEFAULT_PRODUCTS;
    const baseServs = bundledData.services || DEFAULT_SERVICES;
    const baseBrands = bundledData.brands || DEFAULT_BRANDS;
    const baseCombos = bundledData.comboOffers || DEFAULT_COMBO_OFFERS;
    const basePricing: CctvPricingConfig = { ...DEFAULT_CCTV_PRICING, ...(bundledData.cctvPricing || {}) };
    const baseInfo: ShopContactInfo = {
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
      googleSheetViewUrl: '',
      ...(bundledData.shopInfo || {})
    };

    setProducts(baseProds);
    setCategories(baseCats);
    setServices(baseServs);
    setBrands(baseBrands);
    setComboOffers(baseCombos);
    setCctvPricing(basePricing);
    setShopInfo(baseInfo);

    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(baseProds));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(baseCats));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(baseServs));
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(baseBrands));
      localStorage.setItem(STORAGE_KEYS.COMBO_OFFERS, JSON.stringify(baseCombos));
      localStorage.setItem(STORAGE_KEYS.CCTV_PRICING, JSON.stringify(basePricing));
      localStorage.setItem(STORAGE_KEYS.SHOP_INFO, JSON.stringify(baseInfo));
    } catch {}

    saveDirectlyToDisk({
      categories: baseCats,
      products: baseProds,
      services: baseServs,
      brands: baseBrands,
      comboOffers: baseCombos,
      cctvPricing: basePricing,
      shopInfo: baseInfo
    });
  };

  const exportDataJSON = () => {
    return JSON.stringify({
      products,
      categories,
      services,
      brands,
      comboOffers,
      shopInfo,
      cctvPricing,
      exportedAt: new Date().toISOString()
    }, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      let updatedProds = products;
      let updatedCats = categories;
      let updatedServs = services;
      let updatedBrands = brands;
      let updatedCombos = comboOffers;
      let updatedInfo = shopInfo;
      let updatedPricing = cctvPricing;

      if (parsed.products && Array.isArray(parsed.products)) {
        updatedProds = parsed.products;
        setProducts(updatedProds);
        try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProds)); } catch {}
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        updatedCats = parsed.categories;
        setCategories(updatedCats);
        try { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedCats)); } catch {}
      }
      if (parsed.services && Array.isArray(parsed.services)) {
        updatedServs = parsed.services;
        setServices(updatedServs);
        try { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updatedServs)); } catch {}
      }
      if (parsed.brands && Array.isArray(parsed.brands)) {
        updatedBrands = parsed.brands;
        setBrands(updatedBrands);
        try { localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(updatedBrands)); } catch {}
      }
      if (parsed.comboOffers && Array.isArray(parsed.comboOffers)) {
        updatedCombos = parsed.comboOffers;
        setComboOffers(updatedCombos);
        try { localStorage.setItem(STORAGE_KEYS.COMBO_OFFERS, JSON.stringify(updatedCombos)); } catch {}
      }
      if (parsed.shopInfo) {
        updatedInfo = { ...shopInfo, ...parsed.shopInfo };
        setShopInfo(updatedInfo);
        try { localStorage.setItem(STORAGE_KEYS.SHOP_INFO, JSON.stringify(updatedInfo)); } catch {}
      }
      if (parsed.cctvPricing) {
        updatedPricing = { ...cctvPricing, ...parsed.cctvPricing };
        setCctvPricing(updatedPricing);
        try { localStorage.setItem(STORAGE_KEYS.CCTV_PRICING, JSON.stringify(updatedPricing)); } catch {}
      }

      saveDirectlyToDisk({
        products: updatedProds,
        categories: updatedCats,
        services: updatedServs,
        brands: updatedBrands,
        comboOffers: updatedCombos,
        shopInfo: updatedInfo,
        cctvPricing: updatedPricing
      });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ShopContext.Provider value={{
      products,
      categories,
      services,
      brands,
      comboOffers,
      siteVisits,
      shopInfo,
      cctvPricing,
      adminPassword,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProductCategory,
      updateProductCategoryNumber,
      updateProductCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      swapCategoryOrder,
      addService,
      updateService,
      deleteService,
      addBrand,
      updateBrand,
      deleteBrand,
      resetBrands,
      addComboOffer,
      updateComboOffer,
      deleteComboOffer,
      addSiteVisit,
      updateSiteVisit,
      deleteSiteVisit,
      updateShopInfo,
      updateCctvPricing,
      resetCctvPricing,
      updateAdminPassword,
      forceSyncToDisk,
      cart,
      addToCart,
      updateCartQuantity,
      clearCart,
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
