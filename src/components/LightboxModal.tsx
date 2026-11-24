import React from 'react';
import { GalleryImage } from '../data/pubData';

interface LightboxModalProps {
  image: GalleryImage | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  image,
  onClose,
  onNext,
  onPrev
}) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-[#1A1D1C] border-4 border-dock-mustard rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ribbon */}
        <div className="h-3 w-full checker-ribbon-carbon border-b border-black"></div>

        {/* Top bar */}
        <div className="flex items-center justify-between p-4 bg-[#212423] border-b border-[#343A37]">
          <div className="flex items-center gap-2.5">
            <span className="burst-badge px-2.5 py-0.5 bg-dock-mustard text-dock-carbon font-marker text-[11px] uppercase">
              {image.badge}
            </span>
            <span className="font-chunky text-sm text-white uppercase">{image.title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/60 border border-[#444] text-white hover:text-dock-mustard flex items-center justify-center transition-colors"
            aria-label="Chiudi visualizzatore"
          >
            <span className="material-symbols-outlined notranslate text-lg">close</span>
          </button>
        </div>

        {/* Media */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-black flex items-center justify-center overflow-hidden">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-contain"
          />

          {/* Navigation Arrows */}
          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-dock-burgundy text-white flex items-center justify-center border border-white/20 transition-colors"
              aria-label="Foto precedente"
            >
              <span className="material-symbols-outlined notranslate text-2xl">chevron_left</span>
            </button>
          )}

          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-dock-burgundy text-white flex items-center justify-center border border-white/20 transition-colors"
              aria-label="Foto successiva"
            >
              <span className="material-symbols-outlined notranslate text-2xl">chevron_right</span>
            </button>
          )}
        </div>

        {/* Caption bar */}
        <div className="p-4 bg-[#1F2221] border-t border-[#343A37] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-work text-xs sm:text-sm text-[#DDD5C7] leading-relaxed">
            {image.caption}
          </p>
          <span className="font-marker text-[11px] text-dock-mustard uppercase shrink-0">
            @DOCK71_CANTU
          </span>
        </div>
      </div>
    </div>
  );
};
