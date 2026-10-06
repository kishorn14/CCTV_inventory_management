import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../types';
import { getCameraFootageInfo, is360Product, CameraFootageInfo } from '../data/cameraFootageData';
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
  MessageSquare,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RefreshCw,
  Move
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
  
  // 360° / Pan-Tilt Rotation States
  const [panAngle, setPanAngle] = useState<number>(0);     // -180° to 180°
  const [tiltAngle, setTiltAngle] = useState<number>(0);   // -30° to 30°
  const [isAutoPatrol, setIsAutoPatrol] = useState<boolean>(false);
  const [hasInteracted360, setHasInteracted360] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; startPan: number; startTilt: number }>({ x: 0, y: 0, startPan: 0, startTilt: 0 });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const is360 = product ? is360Product(product) : false;

  useEffect(() => {
    // Reset state when product changes
    setVisionMode('day');
    setIsZoomed(false);
    setPanAngle(0);
    setTiltAngle(0);
    setIsAutoPatrol(false);
    setHasInteracted360(false);
  }, [product?.id]);

  useEffect(() => {
    // Live surveillance timestamp clock
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

  // 360° Auto-Patrol continuous scan interval
  useEffect(() => {
    if (!isAutoPatrol || !is360) return;
    const patrolInterval = setInterval(() => {
      setPanAngle(prev => {
        const next = prev + 1.2;
        return next > 180 ? -180 : next;
      });
    }, 50);
    return () => clearInterval(patrolInterval);
  }, [isAutoPatrol, is360]);

  // Touch & Pointer Drag Handlers for 360 Pan-Tilt
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!is360) return;
    setIsDragging(true);
    setHasInteracted360(true);
    setIsAutoPatrol(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPan: panAngle,
      startTilt: tiltAngle
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !is360) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Convert pixels to degrees with responsive sensitivity
    const sensitivity = 0.45;
    let newPan = dragStartRef.current.startPan - deltaX * sensitivity;
    let newTilt = dragStartRef.current.startTilt - deltaY * sensitivity;

    // Wrap pan around 360 degrees
    if (newPan > 180) newPan = -180 + (newPan - 180);
    if (newPan < -180) newPan = 180 + (newPan + 180);

    // Clamp tilt to realistic camera bounds
    newTilt = Math.max(-25, Math.min(25, newTilt));

    setPanAngle(newPan);
    setTiltAngle(newTilt);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!is360) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  // PTZ D-Pad step buttons
  const stepPan = useCallback((delta: number) => {
    setHasInteracted360(true);
    setIsAutoPatrol(false);
    setPanAngle(prev => {
      let next = prev + delta;
      if (next > 180) next = -180;
      if (next < -180) next = 180;
      return next;
    });
  }, []);

  const stepTilt = useCallback((delta: number) => {
    setHasInteracted360(true);
    setIsAutoPatrol(false);
    setTiltAngle(prev => Math.max(-25, Math.min(25, prev + delta)));
  }, []);

  const resetPTZ = useCallback(() => {
    setPanAngle(0);
    setTiltAngle(0);
    setIsAutoPatrol(false);
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
    if (!viewportRef.current) return;
    if (viewportRef.current.requestFullscreen) {
      viewportRef.current.requestFullscreen();
    }
  };

  // Video source based on day vs night
  const activeVideoSrc = visionMode === 'day' ? info.videoDay : info.videoNight;

  // Filter effect styling for simulated night vision
  const getVideoFilterStyle = () => {
    if (visionMode === 'night_ir') {
      return {
        filter: 'grayscale(100%) contrast(145%) brightness(88%)'
      };
    }
    if (visionMode === 'night_color') {
      return {
        filter: 'contrast(120%) brightness(105%) saturate(115%)'
      };
    }
    return {
      filter: 'none'
    };
  };

  // Combined 360 Pan-Tilt and Zoom transform
  const getVideoTransformStyle = () => {
    const baseScale = is360 ? 1.4 : 1.0;
    const finalScale = isZoomed ? baseScale * 1.8 : baseScale;
    
    // Convert pan degrees to translation percentage
    // 180 degrees maps to approx 35% horizontal shift across the scaled frame
    const translateX = is360 ? -(panAngle / 180) * 32 : 0;
    const translateY = is360 ? -(tiltAngle / 25) * 20 : 0;

    return {
      transform: `scale(${finalScale}) translate(${translateX}%, ${translateY}%)`,
      transformOrigin: 'center center',
      transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease'
    };
  };

  const waInquiryText = `Hello Meksha CCTV Solutions! I watched the sample CCTV footage for:\n\n*${product.name}*\nBrand: ${product.brand}\nResolution: ${info.resolutionLabel}\nNight Vision: ${info.nightVisionDistance}\nPrice: ₹${(product.price || 0).toLocaleString('en-IN')}\n\nPlease share the best quotation with GST bill and installation details.`;
  const waLink = createWhatsAppLink(waInquiryText, SHOP_INFO.whatsappNumber);

  return (
    <div className="cctv-modal-overlay" onClick={onClose}>
      <div 
        className="cctv-modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="cctv-modal-header">
          <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '3px' }}>
              <span style={{
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: '4px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                {product.brand}
              </span>
              <span style={{
                background: 'rgba(34, 197, 94, 0.18)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '4px'
              }}>
                {info.resolutionLabel.split(' ')[0]} {info.resolutionPixels}
              </span>
              {is360 && (
                <span style={{
                  background: 'rgba(234, 179, 8, 0.2)',
                  color: '#fde047',
                  border: '1px solid rgba(234, 179, 8, 0.35)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <RotateCw size={11} /> 360° PTZ
                </span>
              )}
            </div>
            <h2 style={{ 
              fontSize: '0.92rem', 
              fontWeight: 700, 
              margin: 0, 
              color: '#f8fafc',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {product.name}
            </h2>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close Sample Video"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#ffffff',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="cctv-modal-body">
          
          {/* Vision Mode Selector Tabs */}
          <div className="cctv-vision-nav">
            <button
              onClick={() => setVisionMode('day')}
              className="cctv-vision-btn"
              style={{
                background: visionMode === 'day' ? '#2563eb' : 'transparent',
                color: visionMode === 'day' ? '#ffffff' : '#94a3b8',
                boxShadow: visionMode === 'day' ? '0 2px 10px rgba(37, 99, 235, 0.4)' : 'none'
              }}
            >
              <Sun size={15} color={visionMode === 'day' ? '#fde047' : '#94a3b8'} />
              <span>☀️ Day (HD)</span>
            </button>

            <button
              onClick={() => setVisionMode('night_ir')}
              className="cctv-vision-btn"
              style={{
                background: visionMode === 'night_ir' ? '#334155' : 'transparent',
                color: visionMode === 'night_ir' ? '#ffffff' : '#94a3b8',
                boxShadow: visionMode === 'night_ir' ? '0 2px 10px rgba(148, 163, 184, 0.3)' : 'none'
              }}
            >
              <Moon size={15} color={visionMode === 'night_ir' ? '#38bdf8' : '#94a3b8'} />
              <span>🌙 IR Night</span>
            </button>

            {info.supportsColorNight && (
              <button
                onClick={() => setVisionMode('night_color')}
                className="cctv-vision-btn"
                style={{
                  background: visionMode === 'night_color' ? '#ca8a04' : 'transparent',
                  color: visionMode === 'night_color' ? '#ffffff' : '#94a3b8',
                  boxShadow: visionMode === 'night_color' ? '0 2px 10px rgba(202, 138, 4, 0.4)' : 'none'
                }}
              >
                <Lightbulb size={15} color={visionMode === 'night_color' ? '#fef08a' : '#94a3b8'} />
                <span>💡 Color Night</span>
              </button>
            )}
          </div>

          {/* Interactive CCTV Video Screen */}
          <div 
            ref={viewportRef}
            className="cctv-viewport-box"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              cursor: is360 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
          >
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              src={activeVideoSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              webkit-playsinline="true"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                ...getVideoTransformStyle(),
                ...getVideoFilterStyle()
              }}
            />

            {/* 360° Live PTZ HUD Badge */}
            {is360 && (
              <div className="cctv-ptz-hud">
                <Compass size={13} color="#4ade80" />
                <span>360° PTZ · PAN: {Math.round(panAngle)}° | TILT: {Math.round(tiltAngle)}°</span>
                {isAutoPatrol && (
                  <span style={{ color: '#fde047', marginLeft: '4px' }}>● AUTO SCAN</span>
                )}
              </div>
            )}

            {/* Mobile Touch Gesture Hint (Fades after user touches or 4s) */}
            {is360 && !hasInteracted360 && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '9999px',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                pointerEvents: 'none',
                zIndex: 14,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)'
              }}>
                <Move size={14} color="#38bdf8" />
                <span>Swipe Video to Rotate 360°</span>
              </div>
            )}

            {/* Surveillance OSD (On-Screen Display) Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#ffffff',
              textShadow: '0 0 4px #000, 1px 1px 2px #000, -1px -1px 2px #000',
              zIndex: 10
            }}>
              {/* Top OSD Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: '#ef4444', 
                      display: 'inline-block',
                      boxShadow: '0 0 8px #ef4444' 
                    }} />
                    <span>REC ● CH01</span>
                  </div>
                  <div style={{ color: '#38bdf8', marginTop: '1px', fontSize: '0.64rem' }}>
                    {product.brand} {info.resolutionPixels}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#fbbf24', fontSize: '0.72rem' }}>
                    {currentTime}
                  </div>
                  <div style={{ color: '#a7f3d0', fontSize: '0.62rem', marginTop: '1px' }}>
                    {info.bitrate.split(' ')[0]} {info.bitrate.split(' ')[1]} · {info.fps}FPS
                  </div>
                </div>
              </div>

              {/* Center PTZ Crosshair Simulation */}
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                opacity: 0.35,
                pointerEvents: 'none'
              }}>
                <div style={{ width: '32px', height: '1px', background: '#38bdf8', position: 'absolute', left: '-16px', top: 0 }} />
                <div style={{ width: '1px', height: '32px', background: '#38bdf8', position: 'absolute', left: 0, top: '-16px' }} />
                <div style={{ width: '8px', height: '8px', border: '1px solid #38bdf8', borderRadius: '50%', position: 'absolute', left: '-4px', top: '-4px' }} />
              </div>

              {/* Bottom OSD Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.62rem',
                  maxWidth: '70%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {visionMode === 'day' && '☀️ DAY COLOR SENSOR'}
                  {visionMode === 'night_ir' && `🌙 INFRARED IR (${info.nightVisionDistance})`}
                  {visionMode === 'night_color' && '💡 DUAL-LIGHT WARM COLOR'}
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: '0.62rem',
                  color: isZoomed ? '#f59e0b' : '#94a3b8'
                }}>
                  {isZoomed ? '🔍 2.0x ZOOM' : '🔍 1.0x'}
                </div>
              </div>
            </div>

            {/* Video Controls Toolbar (Centered Floating Pill) */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              zIndex: 18,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
            }}>
              <button
                type="button"
                onClick={togglePlay}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', display: 'flex' }}
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', display: 'flex' }}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                style={{ 
                  background: isZoomed ? '#2563eb' : 'rgba(255, 255, 255, 0.1)', 
                  border: 'none', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Toggle Digital Zoom"
                aria-label="Toggle Digital Zoom"
              >
                {isZoomed ? <ZoomOut size={13} /> : <ZoomIn size={13} />}
                <span>{isZoomed ? 'Reset' : 'Zoom'}</span>
              </button>

              <button
                type="button"
                onClick={handleFullscreen}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', display: 'flex' }}
                title="Fullscreen View"
                aria-label="Fullscreen View"
              >
                <Maximize2 size={15} />
              </button>
            </div>
          </div>

          {/* 360° PTZ Quick Controller Bar (Clean Micro-Bar Beneath Video) */}
          {is360 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0d1527',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '10px',
              padding: '6px 10px',
              gap: '6px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '3px', marginRight: '2px' }}>
                  <Compass size={12} /> PTZ:
                </span>
                <button
                  type="button"
                  onClick={() => stepPan(-25)}
                  title="Pan Left"
                  aria-label="Pan Left"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <ArrowLeft size={13} /> Left
                </button>

                <button
                  type="button"
                  onClick={() => stepTilt(10)}
                  title="Tilt Up"
                  aria-label="Tilt Up"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <ArrowUp size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => stepTilt(-10)}
                  title="Tilt Down"
                  aria-label="Tilt Down"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <ArrowDown size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => stepPan(25)}
                  title="Pan Right"
                  aria-label="Pan Right"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  Right <ArrowRight size={13} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsAutoPatrol(!isAutoPatrol)}
                  aria-label="Toggle 360 Auto Scan"
                  style={{
                    background: isAutoPatrol ? '#16a34a' : 'rgba(255, 255, 255, 0.1)',
                    border: isAutoPatrol ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: isAutoPatrol ? '#ffffff' : '#fde047',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCw size={12} />
                  <span>{isAutoPatrol ? 'Auto Scanning' : '360° Scan'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetPTZ}
                  title="Reset Center"
                  aria-label="Reset Center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#94a3b8',
                    padding: '4px 7px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <RefreshCw size={11} /> Center
                </button>
              </div>
            </div>
          )}

          {/* Technical Specifications Compact Grid */}
          <div className="cctv-specs-grid">
            <div className="cctv-spec-item">
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                <Camera size={13} color="#38bdf8" /> Resolution &amp; Optics
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                {info.resolutionLabel}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>
                {info.lens}
              </div>
            </div>

            <div className="cctv-spec-item">
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                <Moon size={13} color="#a855f7" /> Night Vision Range
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                {info.nightVisionDistance}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>
                {info.supportsColorNight ? 'Dual-Light (Smart IR + Warm LED Color)' : 'Long-Range Infrared Array'}
              </div>
            </div>

            <div className="cctv-spec-item">
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                <Mic size={13} color="#22c55e" /> Audio &amp; Housing
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                {info.audio}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>
                {info.weatherRating}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Quotation Actions */}
        <div className="cctv-modal-footer">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Selling Price:
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#22c55e', fontFamily: 'Outfit, sans-serif' }}>
              ₹{(product.price || 0).toLocaleString('en-IN')}
            </span>
            {product.mrp && product.mrp > (product.price || 0) && (
              <span style={{ fontSize: '0.74rem', color: '#64748b', textDecoration: 'line-through' }}>
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="cctv-modal-footer-actions">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                background: '#25D366',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.84rem',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
              }}
            >
              <MessageSquare size={16} />
              <span>WhatsApp Quote</span>
            </a>

            <a
              href={`tel:${SHOP_INFO.phone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.84rem',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <Phone size={15} />
              <span>Call Us</span>
            </a>

            <button
              onClick={onClose}
              style={{
                padding: '9px 14px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontWeight: 600,
                fontSize: '0.84rem',
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
