import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { getCameraFootageInfo, CameraFootageInfo } from '../data/cameraFootageData';
import { createWhatsAppLink, SHOP_INFO } from '../utils/whatsapp';
import { 
  X, 
  Sun, 
  Moon, 
  Lightbulb, 
  Maximize2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ZoomIn, 
  ZoomOut, 
  Camera, 
  Mic, 
  Phone, 
  MessageSquare
} from 'lucide-react';

interface CameraFootageModalProps {
  product: Product | null;
  onClose: () => void;
}

type VisionMode = 'day' | 'night_ir' | 'night_color';

export const CameraFootageModal: React.FC<CameraFootageModalProps> = ({ product, onClose }) => {
  const [visionMode, setVisionMode] = useState<VisionMode>('day');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Reset mode on product change
    setVisionMode('day');
    setIsZoomed(false);
  }, [product?.id]);

  useEffect(() => {
    // Live ticking surveillance clock
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      setCurrentTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!product) return null;

  const info: CameraFootageInfo = getCameraFootageInfo(product);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Video source based on day vs night
  const activeVideoSrc = visionMode === 'day' ? info.videoDay : info.videoNight;

  // Filter effect styling for simulated night vision
  const getVideoFilterStyle = () => {
    if (visionMode === 'night_ir') {
      // True IR monochrome with infrared luminescence & high contrast
      return {
        filter: 'grayscale(100%) contrast(140%) brightness(88%)'
      };
    }
    if (visionMode === 'night_color') {
      // Dual Light / Warm LED color night mode
      return {
        filter: 'contrast(120%) brightness(105%) saturate(115%)'
      };
    }
    // Day vision
    return {
      filter: 'none'
    };
  };

  const waInquiryText = `Hello Meksha CCTV Solutions! I watched the sample CCTV footage for:\n\n*${product.name}*\nBrand: ${product.brand}\nResolution: ${info.resolutionLabel}\nNight Vision: ${info.nightVisionDistance}\nPrice: ₹${(product.price || 0).toLocaleString('en-IN')}\n\nPlease share the best price quote, installation charges and stock availability.`;
  const waLink = createWhatsAppLink(waInquiryText, SHOP_INFO.whatsappNumber);

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="camera-footage-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0f172a',
          color: '#ffffff',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '880px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#1e293b'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                {product.brand}
              </span>
              <span style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                {info.resolutionLabel}
              </span>
              <span style={{
                background: 'rgba(234, 179, 8, 0.2)',
                color: '#fde047',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                Live CCTV Sample Footage
              </span>
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
              {product.name}
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          
          {/* Vision Mode Selector Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '6px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => setVisionMode('day')}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.86rem',
                background: visionMode === 'day' ? '#2563eb' : 'transparent',
                color: visionMode === 'day' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s ease'
              }}
            >
              <Sun size={17} color={visionMode === 'day' ? '#fde047' : '#94a3b8'} />
              <span>☀️ Day Vision (Color HD)</span>
            </button>

            <button
              onClick={() => setVisionMode('night_ir')}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.86rem',
                background: visionMode === 'night_ir' ? '#334155' : 'transparent',
                color: visionMode === 'night_ir' ? '#ffffff' : '#94a3b8',
                boxShadow: visionMode === 'night_ir' ? '0 0 12px rgba(148, 163, 184, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Moon size={17} color={visionMode === 'night_ir' ? '#38bdf8' : '#94a3b8'} />
              <span>🌙 Night Vision (Infrared IR)</span>
            </button>

            {info.supportsColorNight && (
              <button
                onClick={() => setVisionMode('night_color')}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  background: visionMode === 'night_color' ? '#ca8a04' : 'transparent',
                  color: visionMode === 'night_color' ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
              >
                <Lightbulb size={17} color={visionMode === 'night_color' ? '#fef08a' : '#94a3b8'} />
                <span>💡 Dual-Light Warm Color Night</span>
              </button>
            )}
          </div>

          {/* CCTV Surveillance Screen Container */}
          <div 
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#000000',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8)',
              aspectRatio: '16/9',
              maxHeight: '440px'
            }}
          >
            {/* HTML5 Video Player */}
            <video
              ref={videoRef}
              src={activeVideoSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isZoomed ? 'scale(1.7)' : 'scale(1)',
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease, filter 0.35s ease',
                ...getVideoFilterStyle()
              }}
            />

            {/* OSD (On-Screen Display) CCTV Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#ffffff',
              textShadow: '0 0 4px #000, 1px 1px 2px #000, -1px -1px 2px #000'
            }}>
              {/* Top OSD Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                    <span style={{ 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      background: '#ef4444', 
                      animation: 'pulse 1.2s infinite' 
                    }} />
                    <span>REC ● CH01</span>
                  </div>
                  <div style={{ color: '#38bdf8', marginTop: '2px', fontSize: '0.75rem' }}>
                    CAM 01: {product.brand} {info.resolutionPixels}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#fbbf24', fontSize: '0.88rem' }}>
                    {currentTime}
                  </div>
                  <div style={{ color: '#a7f3d0', fontSize: '0.72rem', marginTop: '2px' }}>
                    {info.bitrate} · {info.fps} FPS
                  </div>
                </div>
              </div>

              {/* Center Crosshair Simulation (subtle) */}
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                opacity: 0.3,
                pointerEvents: 'none'
              }}>
                <div style={{ width: '40px', height: '1px', background: '#fff', position: 'absolute', left: '-20px', top: 0 }} />
                <div style={{ width: '1px', height: '40px', background: '#fff', position: 'absolute', left: 0, top: '-20px' }} />
              </div>

              {/* Bottom OSD Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.65)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '0.72rem'
                }}>
                  {visionMode === 'day' && '☀️ DAY COLOR SENSOR (ICR FILTER OFF)'}
                  {visionMode === 'night_ir' && `🌙 INFRARED IR ACTIVE · 850nm LEDS (${info.nightVisionDistance})`}
                  {visionMode === 'night_color' && '💡 DUAL-LIGHT WARM LED COLOR MODE ACTIVE'}
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.65)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  color: isZoomed ? '#f59e0b' : '#94a3b8'
                }}>
                  {isZoomed ? '🔍 2.0x DIGITAL ZOOM' : '🔍 1.0x NORMAL VIEW'}
                </div>
              </div>
            </div>

            {/* Video Controls Toolbar (Interactive) */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(6px)',
              padding: '6px 14px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: 10
            }}>
              <button
                onClick={togglePlay}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <button
                onClick={toggleMute}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              <button
                onClick={() => setIsZoomed(!isZoomed)}
                style={{ 
                  background: isZoomed ? '#2563eb' : 'none', 
                  border: 'none', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Toggle 2x Zoom to Inspect Details"
              >
                {isZoomed ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
                <span>{isZoomed ? 'Reset Zoom' : '2x Zoom'}</span>
              </button>

              <button
                onClick={handleFullscreen}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
                title="Fullscreen"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Camera Performance & Technical Specs Summary */}
          <div style={{
            marginTop: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Camera size={14} color="#38bdf8" /> Resolution & Optics
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                {info.resolutionLabel}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                {info.lens}
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Moon size={14} color="#a855f7" /> Night Vision Performance
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                {info.nightVisionDistance}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                {info.supportsColorNight ? 'Dual-Light (Smart IR + Warm LED Color)' : 'High Power Infrared Array'}
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Mic size={14} color="#22c55e" /> Audio & Enclosure
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                {info.audio}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                {info.weatherRating}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Quotation Actions */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Selling Price (Meksha CCTV):
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#22c55e', fontFamily: 'Outfit, sans-serif' }}>
              ₹{(product.price || 0).toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '8px',
                background: '#25D366',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.86rem',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
              }}
            >
              <MessageSquare size={16} />
              <span>Get WhatsApp Quote</span>
            </a>

            <a
              href={`tel:${SHOP_INFO.phone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '8px',
                background: '#334155',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.86rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Phone size={16} />
              <span>Call Us</span>
            </a>

            <button
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
