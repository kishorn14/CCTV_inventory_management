import React from 'react';
import { 
  Calculator, 
  ArrowRight, 
  Video, 
  Wifi, 
  Sun, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';

interface EstimatorCalculatorProps {
  onOpenEstimator: () => void;
}

export const EstimatorCalculator: React.FC<EstimatorCalculatorProps> = ({ onOpenEstimator }) => {
  return (
    <section id="estimator" className="section-padding" style={{ position: 'relative', background: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div className="section-badge" style={{ margin: '0 auto 12px auto' }}>
            <Calculator size={14} /> CCTV Package Planner &amp; Cost Estimator
          </div>
          <h2 className="section-title">
            Calculate Your <span className="text-gradient">CCTV Requirement &amp; Cost</span>
          </h2>
          <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0 auto' }}>
            Choose between Wired DVR/NVR, Smart Wi-Fi 360°, or Off-Grid Solar 4G systems. Get transparent itemized pricing for cameras, hard disks, cabling, accessories &amp; certified doorstep installation.
          </p>
        </div>

        {/* High-Converting Estimator Teaser Card */}
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
          borderRadius: '24px',
          border: '1.5px solid #ccfbf1',
          padding: '36px 32px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px'
        }}>
          {/* Top 3 System Architecture Pills */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            width: '100%'
          }}>
            {/* Pill 1: Wired */}
            <div 
              onClick={onOpenEstimator}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#04647a';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#eff6ff',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Video size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                  Wired CCTV Systems
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  DVR / NVR + 24×7 HDD
                </div>
              </div>
            </div>

            {/* Pill 2: Wi-Fi */}
            <div 
              onClick={onOpenEstimator}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#04647a';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#f0fdfa',
                color: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Wifi size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                  Wi-Fi 360° Smart
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  App Control + MicroSD
                </div>
              </div>
            </div>

            {/* Pill 3: Solar 4G */}
            <div 
              onClick={onOpenEstimator}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#04647a';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sun size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                  Solar 4G Off-Grid
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  100% Wire-Free + 4G SIM
                </div>
              </div>
            </div>
          </div>

          {/* Key Advantages Checklist */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '18px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#334155'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" /> Transparent Hardware Breakdown
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" /> Exact Cable Meter Pricing
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" /> Certified Installation Included
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#0284c7" /> Official 2 Years Brand Warranty
            </span>
          </div>

          {/* Primary Action Button: Estimate Cost */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onOpenEstimator}
              id="btn-estimate-cost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #04647a 0%, #034858 100%)',
                color: '#ffffff',
                padding: '16px 36px',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '1.05rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(4, 100, 122, 0.35)',
                transition: 'all 0.2s ease',
                letterSpacing: '0.01em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(4, 100, 122, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(4, 100, 122, 0.35)';
              }}
            >
              <Calculator size={20} />
              <span>Estimate Cost</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Instant live calculation • No phone number required to view quote
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
