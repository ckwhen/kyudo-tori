'use client';

import { SlidersHorizontal, X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ShinsaFilterModal({
  isOpen,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in" 
        onClick={onClose} 
      />
      <div className="bg-canvas w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-ink/10 p-6 text-ink transform transition-all duration-200 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-6 border-b border-ink/10 pb-3">
          <h3 className="text-lg font-serif font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-moss" />
            <span>篩選條件</span>
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-ink/40 hover:text-ink hover:bg-ink/5 p-1.5 rounded-full transition-colors cursor-pointer active:scale-95"
            aria-label="關閉彈窗"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <h4 className="font-serif font-bold text-sm text-ink mb-1.5 tracking-wider">
            系統建置中
          </h4>
        </div>
        <div className="pt-2 border-t border-ink/5 bg-canvas/30 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-ink/50 hover:text-ink transition-colors cursor-pointer select-none active:scale-98"
          >
            清除全部
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-moss hover:bg-ink text-canvas font-bold px-5 py-3 rounded-xl text-xs tracking-wider transition-colors cursor-pointer active:scale-[0.97] transform shadow-xs"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
}