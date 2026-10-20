import React, { useState, useEffect } from 'react';
import { getTodayArabicDetails, calculateMemoryElapsed } from '../utils/dates';
import { Calendar, Clock, Sparkles, Heart } from 'lucide-react';

interface DateDisplayProps {
  memoryDate: string;
  onEditMemoryDate: () => void;
  onSparkCelebration: () => void;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  memoryDate,
  onEditMemoryDate,
  onSparkCelebration,
}) => {
  const [dateInfo, setDateInfo] = useState(getTodayArabicDetails());

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setDateInfo(getTodayArabicDetails());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const elapsed = calculateMemoryElapsed(memoryDate);

  return (
    <div className="w-full text-center space-y-4">
      {/* Kicker / Memory proclamation */}
      <div className="flex items-center justify-center gap-2 text-amber-400/90 text-sm md:text-base tracking-wide font-medium">
        <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
        <span className="font-kufi">اليـوم ذكـرى لا تُـنـسى</span>
        <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
      </div>

      {/* Primary Date Headline */}
      <div className="relative inline-block px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-amiri leading-tight">
          {dateInfo.formattedFull}
        </h1>
        {dateInfo.formattedHijri && (
          <p className="mt-1 text-sm md:text-base text-neutral-400 font-light">
            الموافق {dateInfo.formattedHijri} هـ
          </p>
        )}
      </div>

      {/* Clean typographic metadata & elapsed counter */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:text-sm text-neutral-400 pt-1">
        <span className="flex items-center gap-1.5 text-neutral-300">
          <Clock className="w-3.5 h-3.5 text-amber-500/80" />
          <span>الوقت الآن: {dateInfo.timeString}</span>
        </span>

        <span aria-hidden="true" className="text-neutral-600 hidden sm:inline">·</span>

        <button
          onClick={onEditMemoryDate}
          className="flex items-center gap-1.5 text-amber-300/90 hover:text-amber-200 transition-colors underline decoration-dotted underline-offset-4 cursor-pointer"
          title="انقر لتعديل تاريخ أول ذكرى"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>مرت {elapsed.textArabic} على أول لحظة ({elapsed.totalDays} يوم)</span>
        </button>

        <span aria-hidden="true" className="text-neutral-600 hidden sm:inline">·</span>

        <button
          onClick={onSparkCelebration}
          className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer group"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500/30 group-hover:fill-rose-500 transition-all transform group-hover:scale-125" />
          <span>أنعش الذكرى</span>
        </button>
      </div>
    </div>
  );
};
