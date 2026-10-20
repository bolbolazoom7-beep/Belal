import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Heart, 
  Calendar,
  Share2,
  Clock,
  Check
} from 'lucide-react';
import { AmbientBackground } from './components/AmbientBackground';
import { DateDisplay } from './components/DateDisplay';
import { MemoryCard } from './components/MemoryCard';
import { MemoryTimeline, MemoryEntry } from './components/MemoryTimeline';
import { QuotesTicker } from './components/QuotesTicker';
import { MemoryDateModal } from './components/MemoryDateModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { nostalgiaAudio } from './utils/audio';

const PHOTO_ASSET_PATH = '/assets/aistudio/selfie_quality_slight_upscale_15937e40.png';

const INITIAL_MEMORIES: MemoryEntry[] = [
  {
    id: '1',
    date: '2024-10-20',
    title: 'ضحكة من القلب في الشارع',
    note: 'الصورة دي اتصورت وإحنا بنضحك على موقف ما يتنسيش، كنا مروحين والشارع هادي والضحكة مكنتش راضية تفارق وشوشنا.',
  },
  {
    id: '2',
    date: '2025-01-15',
    title: 'سند في كل خطوة',
    note: 'لما الدنيا ضاقت عليا، كنت أول واحد جنبي وسمعني وقالي: "ولا تشيل هم، كله هيعدي وإحنا سوا".',
  },
  {
    id: '3',
    date: '2025-07-28',
    title: 'سهرة الصيف وكوباية الشاي',
    note: 'قعدتنا بالليل وسوالفنا عن المستقبل والأحلام والضحك على تفاصيل زمان.. دي الحاجات اللي بتفضل عايشة.',
  },
];

export default function App() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Stored state for memory date
  const [memoryStartDate, setMemoryStartDate] = useState<string>(() => {
    return localStorage.getItem('memory_start_date') || '2024-10-20';
  });

  // Front caption state
  const [cardCaption, setCardCaption] = useState<string>(() => {
    return localStorage.getItem('memory_card_caption') || 'ضحكة تسوى الدنيا.. اخويا وسندي ❤️';
  });

  // Back letter state
  const [backLetter, setBackLetter] = useState<string>(() => {
    return localStorage.getItem('memory_back_letter') || 
`الأيام بتجري بسرعة والظروف بتتغير، بس الضحكة دي بتفضل دايماً فكراني بأحلى أوقات عشناها سوا.

يا صاحب العمر وأوفى صديق.. كل ما بفتح التطبيق ده وأشوف صورتنا، بحمد ربنا على وجودك في حياتي. 

الذكريات الحلوة مبتخلصش، والجاية أحلى وأجمل بإذن الله. دمت ليا سند وأخ حقيقي.`;
  });

  // Memory timeline entries
  const [timelineEntries, setTimelineEntries] = useState<MemoryEntry[]>(() => {
    const saved = localStorage.getItem('memory_timeline_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MEMORIES;
      }
    }
    return INITIAL_MEMORIES;
  });

  useEffect(() => {
    localStorage.setItem('memory_timeline_entries', JSON.stringify(timelineEntries));
  }, [timelineEntries]);

  const handleUpdateCaption = (newCaption: string) => {
    setCardCaption(newCaption);
    localStorage.setItem('memory_card_caption', newCaption);
  };

  const handleUpdateLetter = (newLetter: string) => {
    setBackLetter(newLetter);
    localStorage.setItem('memory_back_letter', newLetter);
  };

  const handleSaveStartDate = (newDate: string) => {
    setMemoryStartDate(newDate);
    localStorage.setItem('memory_start_date', newDate);
  };

  const handleAddTimelineEntry = (newEntry: Omit<MemoryEntry, 'id'>) => {
    const item: MemoryEntry = {
      ...newEntry,
      id: Date.now().toString(),
    };
    setTimelineEntries([item, ...timelineEntries]);
  };

  const handleDeleteTimelineEntry = (id: string) => {
    setTimelineEntries(timelineEntries.filter((e) => e.id !== id));
  };

  // Spark celebration handler
  const triggerCelebration = () => {
    nostalgiaAudio.playMemorySpark();

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#fbbf24', '#f43f5e', '#ffffff'],
    });
  };

  // Toggle ambient music
  const toggleAudio = () => {
    nostalgiaAudio.toggleAmbient((playing) => {
      setIsPlayingAudio(playing);
    });
  };

  // Share overall page
  const handleShareOverall = async () => {
    const text = `اليوم ذكرى عزيزة على القلب.. مهما مرت الأيام ذكرياتنا وضحكتنا دي مش بتتنسى ❤️`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ذكرى اليوم',
          text,
          url: window.location.href,
        });
      } catch {
        navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background ambient lighting and stars */}
      <AmbientBackground />

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 border border-amber-500/50 shadow-2xl text-xs text-amber-200 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>تم نسخ رابط وكلمات الذكرى بنجاح!</span>
        </div>
      )}

      {/* Top Floating App Bar */}
      <header className="relative z-10 w-full border-b border-neutral-900/80 bg-neutral-950/60 backdrop-blur-md sticky top-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Brand & Concept */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-kufi font-bold text-sm tracking-wide text-neutral-100">
                ذِكْرَى اليوم
              </span>
              <span className="text-[10px] text-amber-400/80 mr-2 font-mono">
                Memory Day
              </span>
            </div>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-2">
            {/* Ambient Music Toggle with sound bars */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all border ${
                isPlayingAudio
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title={isPlayingAudio ? 'إيقاف نغمة الحنين' : 'تشغيل نغمة هادئة للذكرى'}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">نغمة الحنين</span>
                  {/* Animated sound bars */}
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-full bg-amber-400 animate-pulse" />
                    <span className="w-0.5 h-2/3 bg-amber-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-4/5 bg-amber-400 animate-pulse delay-150" />
                  </div>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">تشغيل نغمة</span>
                </>
              )}
            </button>

            {/* Spark celebration button */}
            <button
              onClick={triggerCelebration}
              className="p-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-amber-400 hover:scale-110 transition-all"
              title="أنعش الذكرى واحتفل"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500/30 text-rose-400" />
            </button>

            {/* Share overall */}
            <button
              onClick={handleShareOverall}
              className="p-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="مشاركة الذكرى"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* 1. Direct Headline & Today's Date */}
        <DateDisplay
          memoryDate={memoryStartDate}
          onEditMemoryDate={() => setIsDateModalOpen(true)}
          onSparkCelebration={triggerCelebration}
        />

        {/* 2. Interactive Memory Card with User Photo */}
        <div className="mt-8">
          <MemoryCard
            imageSrc={PHOTO_ASSET_PATH}
            cardCaption={cardCaption}
            onUpdateCaption={handleUpdateCaption}
            backLetter={backLetter}
            onUpdateLetter={handleUpdateLetter}
            memoryDate={memoryStartDate}
            onOpenLightbox={() => setIsLightboxOpen(true)}
          />
        </div>

        {/* 3. Hint to flip card & interact */}
        <p className="text-center text-xs text-neutral-500 mt-2">
          💡 انقر على الصورة لقلبها وقراءة رسالة الظهر، أو اضغط على الفلاتر لتغيير الطابع.
        </p>

        {/* 4. Meaningful Quotes on Brotherhood & Memories */}
        <QuotesTicker />

        {/* 5. Memory Journal & Timeline */}
        <MemoryTimeline
          entries={timelineEntries}
          onAddEntry={handleAddTimelineEntry}
          onDeleteEntry={handleDeleteTimelineEntry}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-900 py-8 text-center text-xs text-neutral-500 space-y-2">
        <p className="font-amiri text-sm text-neutral-400">
          «عسى الأيام تجمعنا دايماً على خير وضحكة صافية»
        </p>
        <p className="text-[11px] text-neutral-600">
          تطبيق الذكرى • محفوظة اللحظات في متصفحك لتعود إليها كلما اشتقت
        </p>
      </footer>

      {/* Modals & Lightbox */}
      <PhotoLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc={PHOTO_ASSET_PATH}
        caption={cardCaption}
      />

      <MemoryDateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        currentDate={memoryStartDate}
        onSaveDate={handleSaveStartDate}
      />
    </div>
  );
}
