import React from 'react';
import { CctvEstimatorView } from './CctvEstimatorView';

interface CctvEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CctvEstimatorModal: React.FC<CctvEstimatorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <CctvEstimatorView embedded={false} onClose={onClose} />
    </div>
  );
};
