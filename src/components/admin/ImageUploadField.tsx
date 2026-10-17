import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';

export interface ImagePreset {
  label: string;
  url: string;
}

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  presets?: ImagePreset[];
  maxWidth?: number;
  maxHeight?: number;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = 'Product Image Source',
  value,
  onChange,
  required = false,
  placeholder = 'Paste image link (https://... or /products/...)',
  helpText,
  presets,
  maxWidth = 1200,
  maxHeight = 1200
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const compressedDataUrl = await compressImageFile(file, maxWidth, maxHeight, 0.85);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Image compression failed:', err);
      setErrorMessage('Could not load photo from device. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const isDataUrl = value && value.startsWith('data:image/');

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontSize: '0.85rem', 
          fontWeight: 700, 
          color: '#334155', 
          marginBottom: '6px' 
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <ImageIcon size={14} color="#2563eb" />
            {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
          </span>
          {isDataUrl && (
            <span style={{ 
              fontSize: '0.68rem', 
              color: '#15803d', 
              background: '#dcfce7', 
              padding: '1px 6px', 
              borderRadius: '4px',
              fontWeight: 700
            }}>
              ✓ Device Photo Attached
            </span>
          )}
        </label>
      )}

      {/* Main Upload & Input Container */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          background: isDragging ? '#eff6ff' : '#f8fafc',
          border: isDragging ? '2px dashed #2563eb' : '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '12px',
          transition: 'all 0.15s ease'
        }}
      >
        {/* Device Upload Button + URL Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Native Device File Picker Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              style={{
                background: isProcessing ? '#93c5fd' : '#2563eb',
                border: 'none',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: isProcessing ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                whiteSpace: 'nowrap',
                transition: 'background 0.15s ease'
              }}
              title="Select an image file from your phone gallery, computer, or camera"
            >
              <Upload size={14} />
              <span>{isProcessing ? 'Optimizing Photo...' : '📁 Choose Photo from Device / Camera'}</span>
            </button>

            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
              or paste link below
            </span>

            {/* Clear Button */}
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
                title="Clear current photo"
              >
                <X size={12} />
                <span>Remove</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileChange(file);
                }
                // reset so selecting the same file again triggers onChange
                e.target.value = '';
              }}
            />
          </div>

          {/* Web URL / Path Input with live preview thumbnail */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              required={required && !value}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.84rem',
                background: '#ffffff',
                color: '#0f172a'
              }}
            />

            {/* Live Preview Thumbnail */}
            {value && (
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative'
              }}>
                <img
                  src={value}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  onError={e => { e.currentTarget.src = '/logo.jpg'; }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px',
            color: '#dc2626',
            fontSize: '0.74rem',
            fontWeight: 600
          }}>
            <AlertCircle size={13} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Presets List */}
        {presets && presets.length > 0 && (
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
            <div style={{ 
              fontSize: '0.72rem', 
              color: '#64748b', 
              fontWeight: 600, 
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Sparkles size={11} color="#d97706" />
              <span>Or click a ready-made preset banner/photo:</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {presets.map((preset, idx) => {
                const isSelected = value === preset.url;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => onChange(preset.url)}
                    style={{
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      color: isSelected ? '#1d4ed8' : '#475569',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    {isSelected && <CheckCircle2 size={11} color="#2563eb" />}
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {helpText && (
          <p style={{ margin: '6px 0 0 0', fontSize: '0.72rem', color: '#64748b' }}>
            {helpText}
          </p>
        )}
      </div>
    </div>
  );
};
