import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCw, 
  Maximize2, 
  Heart, 
  Edit3, 
  Sparkles, 
  SlidersHorizontal,
  Bookmark,
  Check,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { nostalgiaAudio } from '../utils/audio';

interface MemoryCardProps {
  imageSrc: string;
  cardCaption: string;
  onUpdateCaption: (newCaption: string) => void;
  backLetter: string;
  onUpdateLetter: (newLetter: string) => void;
  memoryDate: string;
  onOpenLightbox: () => void;
}

type PhotoFilter = 'normal' | 'warm' | 'golden' | 'vintage-bw';

export const MemoryCard: React.FC<MemoryCardProps> = ({
  imageSrc,
  cardCaption,
  onUpdateCaption,
  backLetter,
  onUpdateLetter,
  memoryDate,
  onOpenLightbox,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<PhotoFilter>('warm');
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionDraft, setCaptionDraft] = useState(cardCaption);
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [letterDraft, setLetterDraft] = useState(backLetter);
  const [heartsCount, setHeartsCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('memory_hearts_count') || '12', 10);
  });
  const [isHearted, setIsHearted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const filterClasses: Record<PhotoFilter, string> = {
    normal: 'brightness-100 contrast-100 saturate-100',
    warm: 'sepia-[0.20] contrast-[1.05] brightness-[1.02] saturate-[1.1]',
    golden: 'sepia-[0.35] brightness-[1.05] contrast-[1.08] saturate-[1.25]',
    'vintage-bw': 'grayscale contrast-[1.2] brightness-[0.98] sepia-[0.1]',
  };

  const cycleFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    const filters: PhotoFilter[] = ['warm', 'golden', 'vintage-bw', 'normal'];
    const next = filters[(filters.indexOf(filter) + 1) % filters.length];
    setFilter(next);
  };

  const handleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = heartsCount + 1;
    setHeartsCount(newCount);
    setIsHearted(true);
    localStorage.setItem('memory_hearts_count', newCount.toString());

    nostalgiaAudio.playMemorySpark();

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ec4899', '#fb7185', '#fbbf24'],
    });

    setTimeout(() => setIsHearted(false), 600);
  };

  const handleSaveCaption = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCaption(captionDraft);
    setIsEditingCaption(false);
  };

  const handleSaveLetter = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLetter(letterDraft);
    setIsEditingLetter(false);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `ذكرى تجمعنا غالية على القلب ❤️\n"${cardCaption}"\nتاريخ اليوم وذكرانا دايماً في البال.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ذكرى اليوم',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto my-6 px-2">
      {/* Decorative Washi Tape on top */}
      <div 
        aria-hidden="true" 
        className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-amber-100/30 backdrop-blur-xs border-y border-amber-200/20 shadow-xs rotate-[-1.5deg] z-20 pointer-events-none rounded-xs"
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      />

      {/* Main 3D Card Container */}
      <div className="perspective-1000 w-full min-h-[540px]">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full h-full transform-style-3d cursor-pointer"
          onClick={() => {
            if (!isEditingCaption && !isEditingLetter) {
              setIsFlipped(!isFlipped);
            }
          }}
        >
          {/* ================= FRONT SIDE (The Polaroid Photo) ================= */}
          <div 
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between backface-hidden transition-shadow hover:shadow-amber-500/10"
            style={{
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Top Bar inside card */}
            <div className="flex items-center justify-between pb-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 font-kufi text-amber-300/80">
                <Bookmark className="w-3.5 h-3.5" />
                <span>لحظة مخلدة</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={cycleFilter}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                  title={`فلتر الصورة: ${filter}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLightbox();
                  }}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                  title="تكبير الصورة"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photo frame */}
            <div className="relative overflow-hidden rounded-xl bg-neutral-950 aspect-[4/5] sm:aspect-[3/4] border border-neutral-800/80 shadow-inner group">
              <img
                src={imageSrc}
                alt="ذكرى الأصدقاء"
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02] ${filterClasses[filter]}`}
                loading="eager"
              />

              {/* Subtle vintage light leak overlay */}
              <div 
                className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20"
                style={{
                  background: 'radial-gradient(ellipse at 10% 20%, rgba(251, 146, 60, 0.5) 0%, transparent 60%)'
                }}
              />

              {/* Overlay quick flip button badge */}
              <div className="absolute bottom-3 left-3 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 text-xs text-neutral-200 hover:text-amber-300 hover:border-amber-400/40 shadow-lg transition-all"
                >
                  <RotateCw className="w-3 h-3 text-amber-400" />
                  <span>اقرأ ظهر الصورة</span>
                </button>
              </div>
            </div>

            {/* Bottom Caption Area */}
            <div className="pt-4 text-center">
              {isEditingCaption ? (
                <form 
                  onSubmit={handleSaveCaption} 
                  onClick={(e) => e.stopPropagation()} 
                  className="space-y-2"
                >
                  <input
                    type="text"
                    value={captionDraft}
                    onChange={(e) => setCaptionDraft(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-800 border border-amber-500/50 text-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    autoFocus
                    maxLength={70}
                  />
                  <div className="flex justify-center gap-2">
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs bg-amber-500 text-neutral-950 rounded-md font-medium hover:bg-amber-400"
                    >
                      حفظ
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingCaption(false)}
                      className="px-3 py-1 text-xs bg-neutral-800 text-neutral-300 rounded-md hover:bg-neutral-700"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              ) : (
                <div className="group/caption relative inline-block max-w-full">
                  <p className="font-amiri text-lg sm:text-xl text-neutral-100 font-semibold tracking-wide">
                    {cardCaption}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCaptionDraft(cardCaption);
                      setIsEditingCaption(true);
                    }}
                    className="opacity-0 group-hover/caption:opacity-100 absolute -left-6 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-amber-300 transition-opacity"
                    title="تعديل العبارة"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Interaction Bar */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-800/80 text-xs text-neutral-400">
                <button
                  type="button"
                  onClick={handleHeart}
                  className={`flex items-center gap-1.5 transition-transform ${isHearted ? 'scale-125' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${heartsCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`} />
                  <span className="text-neutral-300 font-medium">{heartsCount} نبضة حب</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {copiedShare ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>مشاركة</span>
                      </>
                    )}
                  </button>

                  <span className="text-neutral-600">·</span>

                  <span className="text-[11px] text-neutral-500 font-mono">
                    {memoryDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BACK SIDE (The Handwritten Postcard / Letter) ================= */}
          <div 
            className="w-full bg-[#1c1917] border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between absolute inset-0 backface-hidden rotate-y-180 text-amber-100/90"
            style={{
              backgroundImage: 'radial-gradient(#292524 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(245, 158, 11, 0.15)'
            }}
          >
            {/* Top Postcard Header with stamp */}
            <div className="flex items-start justify-between border-b border-amber-900/40 pb-3">
              <div>
                <span className="font-kufi text-xs text-amber-400/90 block">رسالة من القلب</span>
                <span className="text-[11px] text-neutral-400">طابع الذكريات الخالدة</span>
              </div>

              {/* Vintage Stamp graphic */}
              <div className="w-12 h-14 border-2 border-dashed border-amber-500/50 rounded-sm flex flex-col items-center justify-center p-1 bg-amber-950/40 text-[9px] text-amber-400 text-center font-mono">
                <Sparkles className="w-4 h-4 text-amber-400 mb-0.5" />
                <span>ذِكْرَى</span>
              </div>
            </div>

            {/* Letter Content */}
            <div className="my-auto py-4">
              {isEditingLetter ? (
                <form 
                  onSubmit={handleSaveLetter} 
                  onClick={(e) => e.stopPropagation()} 
                  className="space-y-3"
                >
                  <textarea
                    value={letterDraft}
                    onChange={(e) => setLetterDraft(e.target.value)}
                    rows={6}
                    className="w-full p-3 rounded-lg bg-neutral-900/80 border border-amber-500/50 text-amber-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 leading-relaxed resize-none"
                    placeholder="اكتب كلمات الذكرى..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs bg-amber-500 text-neutral-950 rounded-md font-semibold hover:bg-amber-400"
                    >
                      حفظ الرسالة
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingLetter(false)}
                      className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 rounded-md hover:bg-neutral-700"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              ) : (
                <div className="relative group/letter">
                  <p className="font-amiri text-base sm:text-lg leading-relaxed whitespace-pre-line text-amber-100/90 text-right pr-2 border-r-2 border-amber-500/30">
                    {backLetter}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLetterDraft(backLetter);
                      setIsEditingLetter(true);
                    }}
                    className="opacity-0 group-hover/letter:opacity-100 absolute -left-2 top-0 p-1.5 rounded bg-neutral-800/80 text-amber-300 hover:text-white transition-opacity"
                    title="تعديل الرسالة"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Signature & Flip back button */}
            <div className="pt-3 border-t border-amber-900/40 flex items-center justify-between text-xs text-amber-400/80">
              <span className="font-amiri text-sm text-neutral-300">
                — دمت رفيقاً وسنداً ☕
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/70 border border-amber-700/40 text-amber-200 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <RotateCw className="w-3 h-3 text-amber-400" />
                <span>وجه الصورة</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
