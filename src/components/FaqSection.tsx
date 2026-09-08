import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQS } from '../data/shopData';

export const FaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="section-padding" style={{ position: 'relative' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* FAQ Header */}
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <div className="section-badge">
            <HelpCircle size={14} /> Got Questions?
          </div>
          <h2 className="section-title">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about our CCTV security installation, camera warranties, and doorstep service support.
          </p>
        </div>

        {/* FAQ List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  background: '#ffffff',
                  border: isOpen ? '1.5px solid #1d4ed8' : '1px solid #e2e8f0',
                  boxShadow: isOpen ? '0 4px 16px rgba(29, 78, 216, 0.08)' : '0 2px 6px rgba(0, 0, 0, 0.03)'
                }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: isOpen ? '#1d4ed8' : '#0f172a',
                    lineHeight: 1.3
                  }}>
                    {faq.q}
                  </h3>
                  {isOpen ? <ChevronUp size={20} color="#1d4ed8" /> : <ChevronDown size={20} color="#64748b" />}
                </div>

                {isOpen && (
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    fontSize: '0.92rem',
                    color: '#475569',
                    lineHeight: 1.6,
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
