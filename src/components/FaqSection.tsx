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
                  padding: '18px 24px',
                  cursor: 'pointer',
                  borderColor: isOpen ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)'
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
                    color: isOpen ? '#60a5fa' : '#ffffff',
                    lineHeight: 1.3
                  }}>
                    {faq.q}
                  </h3>
                  {isOpen ? <ChevronUp size={20} color="#60a5fa" /> : <ChevronDown size={20} color="#9ca3af" />}
                </div>

                {isOpen && (
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.92rem',
                    color: '#9ca3af',
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
