import React, { useState } from 'react';
import {
  ShoppingBag,
  Wrench,
  Settings,
  Database,
  Store,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { AdminProducts } from './AdminProducts';
import { AdminServices } from './AdminServices';
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

  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'settings' | 'backup'>('products');

  const handleLogout = () => {
    sessionStorage.removeItem('mekha_admin_logged_in');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onSuccess={() => setIsLoggedIn(true)} onGoToStore={onGoToStore} />;
  }

  const navTabs = [
    { id: 'products', label: 'Products & Pricing', icon: ShoppingBag },
    { id: 'services', label: 'Services & AMC', icon: Wrench },
    { id: 'settings', label: 'Shop & WhatsApp Details', icon: Settings },
    { id: 'backup', label: 'Backup & Reset', icon: Database },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1d', color: '#ffffff' }}>
      {/* Top Admin Header */}
      <header style={{
        background: '#111827',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '14px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 800
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
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff', lineHeight: 1.1 }}>
                {shopInfo.shopName} <span style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600 }}>[ADMIN]</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Store Management & Pricing Portal
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
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: 600,
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
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
                  border: isActive ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#ffffff' : '#9ca3af',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#60a5fa' : '#9ca3af'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'services' && <AdminServices />}
        {activeTab === 'settings' && <AdminSettings />}
        {activeTab === 'backup' && <AdminBackup />}
      </div>
    </div>
  );
};
