import React, { useState } from 'react';
import { Download, Upload, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AdminBackup: React.FC = () => {
  const { exportDataJSON, importDataJSON, resetToDefaults } = useShop();
  const [statusMsg, setStatusMsg] = useState('');
  const [importText, setImportText] = useState('');

  const handleExport = () => {
    const dataStr = exportDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meksha_shop_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Shop data backup JSON downloaded successfully!');
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importDataJSON(importText);
    if (ok) {
      setStatusMsg('Data imported successfully! Store catalog and settings updated.');
      setImportText('');
    } else {
      alert('Invalid JSON format. Please check and try again.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all products, prices, and services back to original defaults? Any custom products added will be replaced.')) {
      resetToDefaults();
      setStatusMsg('All data reset to initial default templates.');
    }
  };

  return (
    <div style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
          Data Backup, Export & Reset
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Safely export your product catalog and store details to a JSON file or restore default shop data.
        </p>
      </div>

      {statusMsg && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#065f46',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '20px'
        }}>
          <CheckCircle2 size={18} />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Export Card */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
          1. Download Backup (JSON)
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
          Save a complete copy of all your products, prices, services, and contact info to your computer.
        </p>
        <button onClick={handleExport} className="btn btn-primary btn-sm">
          <Download size={16} /> Export & Download JSON Backup
        </button>
      </div>

      {/* Import Card */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
          2. Restore / Import Data from JSON
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
          Paste raw JSON from a previous backup file below:
        </p>
        <textarea
          className="form-textarea"
          rows={4}
          placeholder="Paste JSON content here..."
          value={importText}
          onChange={e => setImportText(e.target.value)}
          style={{ marginBottom: '14px', background: '#f8fafc' }}
        />
        <button onClick={handleImport} className="btn btn-outline btn-sm" disabled={!importText.trim()}>
          <Upload size={16} /> Import & Apply Data
        </button>
      </div>

      {/* Reset Card */}
      <div className="glass-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid #fecaca', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.05)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <AlertTriangle size={24} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b91c1c', marginBottom: '4px' }}>
              Reset to Original Factory Defaults
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Restores the default catalog of CCTV, Batteries, Inverters, RO purifiers, and Solar heaters.
            </p>
            <button
              onClick={handleReset}
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={15} /> Reset Store Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
