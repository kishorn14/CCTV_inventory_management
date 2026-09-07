export type CategoryType = 'all' | 'cctv' | 'battery' | 'inverter' | 'water_purifier' | 'solar_heater';

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
  googleSheetWebhookUrl?: string;
  googleSheetViewUrl?: string;
}
