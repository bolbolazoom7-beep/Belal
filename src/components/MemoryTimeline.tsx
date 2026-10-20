import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Sparkles, MessageSquareHeart } from 'lucide-react';
import { nostalgiaAudio } from '../utils/audio';

export interface MemoryEntry {
  id: string;
  date: string;
  title: string;
  note: string;
}

interface MemoryTimelineProps {
  entries: MemoryEntry[];
  onAddEntry: (entry: Omit<MemoryEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
}) => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !note.trim()) return;

    onAddEntry({
      title: title.trim(),
      note: note.trim(),
      date,
    });

    nostalgiaAudio.playMemorySpark();
    setTitle('');
    setNote('');
    setIsOpenForm(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-16 px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <MessageSquareHeart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold font-kufi text-neutral-100">
              دفتر الذكريات والمواقف
            </h2>
            <p className="text-xs text-neutral-400">
              لحظات عشناها سوا وما زالت محفورة في القلب
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpenForm(!isOpenForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-medium transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isOpenForm ? 'إغلاق' : 'أضف موقفاً'}</span>
        </button>
      </div>

      {/* Add Memory Form */}
      {isOpenForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 md:p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 animate-fadeIn"
        >
          <h3 className="text-sm font-semibold text-amber-300 font-kufi flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>تسجيل ذكرى جديدة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">عنوان الموقف أو المكان</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: يوم ما اتعشينا في الشارع ده..."
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">تاريخ الذكرى</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">تفاصيل الذكرى وما قيل فيها</label>
            <textarea
              required
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اكتب الشعور أو الموقف اللي ضحكتوا عليه..."
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOpenForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-neutral-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors shadow-md"
            >
              حفظ في الدفتر
            </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="relative border-r-2 border-neutral-800 mr-3 md:mr-4 pr-6 space-y-6">
        {entries.length === 0 ? (
          <p className="text-center text-xs text-neutral-500 py-6">
            لا توجد ذكريات مضافة بعد. اضغط &quot;أضف موقفاً&quot; لتسجيل أول ذكرى!
          </p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -right-[31px] top-1.5 w-3 h-3 rounded-full bg-neutral-950 border-2 border-amber-500 group-hover:scale-125 transition-transform" />

              <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                  <div className="flex items-center gap-1.5 text-amber-400/90 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{entry.date}</span>
                  </div>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-rose-400 transition-opacity p-1"
                    title="حذف الذكرى"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-sm md:text-base font-semibold text-neutral-100 font-kufi">
                  {entry.title}
                </h4>
                <p className="mt-1.5 text-xs md:text-sm text-neutral-300 font-amiri leading-relaxed">
                  {entry.note}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
