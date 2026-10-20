import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';

interface MemoryDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: string;
  onSaveDate: (newDate: string) => void;
}

export const MemoryDateModal: React.FC<MemoryDateModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  onSaveDate,
}) => {
  const [dateValue, setDateValue] = useState(currentDate);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateValue) {
      onSaveDate(dateValue);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-amber-400 font-kufi">
            <Calendar className="w-4 h-4" />
            <h3 className="font-semibold text-sm">تاريخ أول ذكرى أو التقاط الصورة</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          حدد التاريخ الذي بدأت فيه هذه الذكرى أو التُقطت فيه الصورة، ليتم حساب عدد الأيام والسنوات التي مرت بدقة:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-500"
            max={new Date().toISOString().split('T')[0]}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-lg text-neutral-400 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>تحديث التاريخ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
