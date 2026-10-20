import React from 'react';
import { X, Sparkles, Heart } from 'lucide-react';

interface PhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  caption: string;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  isOpen,
  onClose,
  imageSrc,
  caption,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative max-w-2xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 left-0 p-2 rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700 transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl max-h-[75vh]">
          <img
            src={imageSrc}
            alt="صورة الذكرى"
            className="w-full h-auto max-h-[75vh] object-contain select-none"
          />
        </div>

        <div className="mt-4 text-center">
          <p className="font-amiri text-xl text-amber-200 font-semibold flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>{caption}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            انقر في أي مكان للإغلاق
          </p>
        </div>
      </div>
    </div>
  );
};
