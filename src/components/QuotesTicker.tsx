import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const MEMORY_QUOTES = [
  {
    text: 'سلامٌ على الدنيا إذا لم يكن بها .. صديقٌ صدوقٌ صادقُ الوعدِ منصفا.',
    author: 'الإمام الشافعي',
  },
  {
    text: 'الأيام تمضي سريعاً، لكن الذكريات الحقيقية والقلوب الصادقة تظل ثابتة لا يغيرها زمن.',
    author: 'من وحي الخاطر',
  },
  {
    text: 'بعض الرفاق رزق، يضعهم الله في طريقك ليخففوا عنك ثقل الحياة ويشاركونك ضحكة الروح.',
    author: 'كلمات في الوفاء',
  },
  {
    text: 'الذكريات هي الشيء الوحيد الذي لا تستطيع يد الأيام أن تأخذه منا.',
    author: 'حكمة مأثورة',
  },
  {
    text: 'يا صاحب الأيام الحلوة.. ممتن لكل لحظة جمعتنا ولكل ضحكة خرجت من أعماق القلب.',
    author: 'رسالة ود',
  },
];

export const QuotesTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MEMORY_QUOTES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % MEMORY_QUOTES.length);
  };

  const current = MEMORY_QUOTES[index];

  return (
    <div className="w-full max-w-xl mx-auto px-4 my-8 text-center">
      <div className="relative p-5 rounded-2xl bg-gradient-to-b from-neutral-900/60 to-neutral-900/30 border border-neutral-800/80 backdrop-blur-xs">
        <Quote className="w-6 h-6 text-amber-500/30 mx-auto mb-2" />
        
        <p className="font-amiri text-base sm:text-lg text-neutral-200 leading-relaxed min-h-[50px] flex items-center justify-center">
          &quot;{current.text}&quot;
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-800/60">
          <span>{current.author}</span>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 hover:text-amber-400 transition-colors p-1"
            title="اقتباس آخر"
          >
            <RefreshCw className="w-3 h-3" />
            <span>اقتباس آخر</span>
          </button>
        </div>
      </div>
    </div>
  );
};
