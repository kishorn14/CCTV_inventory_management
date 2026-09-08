import { useState } from 'react';
import { Lock, ArrowRight, Eye, EyeOff, Store, AlertCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface AdminLoginProps {
  onSuccess: () => void;
  onGoToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onGoToStore }) => {
  const { adminPassword, shopInfo } = useShop();
  const [inputPass, setInputPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (inputPass === adminPassword) {
      sessionStorage.setItem('mekha_admin_logged_in', 'true');
      onSuccess();
    } else {
      setErrorMsg('Incorrect admin password. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at 50% 30%, #eff6ff 0%, #f8fafc 75%)'
    }}>
      <div className="glass-card" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '36px',
        background: '#ffffff',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 25px rgba(29, 78, 216, 0.3)'
          }}>
            <Lock size={28} />
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Shop Admin Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {shopInfo.shopName} Management Dashboard
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#b91c1c',
            fontSize: '0.88rem',
            marginBottom: '20px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label">Enter Admin Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password..."
                value={inputPass}
                onChange={(e) => setInputPass(e.target.value)}
                autoFocus
                required
                style={{ paddingRight: '45px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            style={{ marginBottom: '16px' }}
          >
            Access Admin Portal <ArrowRight size={18} />
          </button>
        </form>

        {/* Back to Storefront Link */}
        <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={onGoToStore}
            style={{
              background: 'none',
              border: 'none',
              color: '#1d4ed8',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Store size={16} /> Return to Storefront Website
          </button>
        </div>
      </div>
    </div>
  );
};
