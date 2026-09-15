import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`pointer-events-auto flex items-center justify-between px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-900/95 text-white border-emerald-700 shadow-emerald-950/20'
                : toast.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-700 shadow-rose-950/20'
                : 'bg-stone-900/95 text-white border-stone-700 shadow-stone-950/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-sky-300 shrink-0" />}
              <span>{toast.text}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-2"
              aria-label="닫기"
            >
              <X className="w-3.5 h-3.5 text-white/80" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
