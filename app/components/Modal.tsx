import { ReactNode } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 's' | 'm' | 'l';
  type?: 'default' | 'destructive' | 'success' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showFooter?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'm',
  type = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showFooter = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    s: 'max-w-[420px]',
    m: 'max-w-[560px]',
    l: 'max-w-[720px]',
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative ${sizes[size]} w-full mx-4 bg-white rounded-2xl shadow-xl`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E6EEF2]">
          <h4 className="text-xl font-semibold text-[#0F172A]">{title}</h4>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#475569] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E6EEF2]">
            <Button variant="secondary" onClick={handleCancel}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button 
                variant={type === 'destructive' ? 'danger' : 'primary'} 
                onClick={handleConfirm}
              >
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

