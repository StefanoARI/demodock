import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div className="bg-[#191B1A] border-2 border-dock-mustard text-dock-cream px-5 py-3.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="font-work text-xs sm:text-sm font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-dock-mustard hover:text-white transition-colors"
          aria-label="Chiudi notifica"
        >
          <span className="material-symbols-outlined notranslate text-lg">close</span>
        </button>
      </div>
    </div>
  );
};
