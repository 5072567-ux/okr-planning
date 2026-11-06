// components/ui/Modal.tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#17242b]/45 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl border border-[#e5e8e4] shadow-[0_18px_60px_rgba(25,45,54,.18)] w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-[#e5e8e4]">
          <h2 className="text-lg font-semibold text-[#202a32]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-[#849096] hover:text-[#202a32] hover:bg-[#f2f4f1] rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
