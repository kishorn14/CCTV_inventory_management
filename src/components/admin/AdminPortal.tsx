import React, { useState } from 'react';
import {
  ShoppingBag,
  Wrench,
  Settings,
  Database,
  Store,
  LogOut,
  ShieldCheck,
  Video,
  Award
} from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { AdminProducts } from './AdminProducts';
import { AdminBrands } from './AdminBrands';
import { AdminServices } from './AdminServices';
import { AdminCctvPricing } from './AdminCctvPricing';
import { AdminSettings } from './AdminSettings';
import { AdminBackup } from './AdminBackup';
import { useShop } from '../../context/ShopContext';

interface AdminPortalProps {
  onGoToStore: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onGoToStore }) => {
  const { shopInfo } = useShop();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('mekha_admin_logged_in') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'products' | 'brands' | 'cctv_pricing' | 'services' | 'settings' | 'backup'>('products');

  const handleLogout = () => {
    sessionStorage.removeItem('mekha_admin_logged_in');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onSuccess={() => setIsLoggedIn(true)} onGoToStore={onGoToStore} />;
  }

  const navTabs = [
    { id: 'products', label: 'Products & Pricing', icon: ShoppingBag },
    { id: 'brands', label: 'Brand Partners', icon: Award },
    { id: 'cctv_pricing', label: 'CCTV Estimator Pricing', icon: Video },
    { id: 'services', label: 'Services & AMC', icon: Wrench },
    { id: 'settings', label: 'Shop & WhatsApp Details', icon: Settings },
    { id: 'backup', label: 'Backup & Reset', icon: Database },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      {/* Top Admin Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '14px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Brand Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', lineHeight: 1.1 }}>
                {shopInfo.shopName} <span style={{ color: '#1d4ed8', fontSize: '0.8rem', fontWeight: 700 }}>[ADMIN]</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Store Management &amp; Pricing Portal
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onGoToStore}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Store size={15} /> View Storefront
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '14px',
          marginBottom: '30px',
          overflowX: 'auto'
        }}>
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: isActive ? '1.5px solid #1d4ed8' : '1px solid #e2e8f0',
                  background: isActive ? '#eff6ff' : '#ffffff',
                  color: isActive ? '#1d4ed8' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(29, 78, 216, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)'
                }}
              >
                <Icon size={18} color={isActive ? '#1d4ed8' : '#64748b'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'brands' && <AdminBrands />}
        {activeTab === 'cctv_pricing' && <AdminCctvPricing />}
        {activeTab === 'services' && <AdminServices />}
        {activeTab === 'settings' && <AdminSettings />}
        {activeTab === 'backup' && <AdminBackup />}
      </div>
    </div>
  );
};

