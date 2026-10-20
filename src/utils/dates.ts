// Arabic date helpers and memory counter utilities

export interface DateBreakdown {
  dayName: string;
  dayNumber: string;
  monthName: string;
  yearNumber: string;
  formattedFull: string;
  formattedHijri?: string;
  timeString: string;
}

export function getTodayArabicDetails(): DateBreakdown {
  const now = new Date();

  // Arabic Egyptian / Standard formatting
  const dayName = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(now);
  const dayNumber = new Intl.DateTimeFormat('ar-EG', { day: 'numeric' }).format(now);
  const monthName = new Intl.DateTimeFormat('ar-EG', { month: 'long' }).format(now);
  const yearNumber = new Intl.DateTimeFormat('ar-EG', { year: 'numeric' }).format(now);

  const formattedFull = `${dayName}، ${dayNumber} ${monthName} ${yearNumber}`;

  let formattedHijri = '';
  try {
    formattedHijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);
  } catch {
    formattedHijri = '';
  }

  const timeString = new Intl.DateTimeFormat('ar-EG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(now);

  return {
    dayName,
    dayNumber,
    monthName,
    yearNumber,
    formattedFull,
    formattedHijri,
    timeString,
  };
}

export interface MemoryElapsed {
  days: number;
  months: number;
  years: number;
  totalDays: number;
  textArabic: string;
}

export function calculateMemoryElapsed(memoryDateStr: string): MemoryElapsed {
  const start = new Date(memoryDateStr);
  const now = new Date();

  // Diff in milliseconds
  const diffMs = Math.max(0, now.getTime() - start.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  years = Math.max(0, years);
  months = Math.max(0, months);
  days = Math.max(0, days);

  const parts: string[] = [];
  if (years > 0) {
    if (years === 1) parts.push('سنة واحدة');
    else if (years === 2) parts.push('سنتان');
    else if (years >= 3 && years <= 10) parts.push(`${years} سنوات`);
    else parts.push(`${years} سنة`);
  }

  if (months > 0) {
    if (months === 1) parts.push('شهر واحد');
    else if (months === 2) parts.push('شهران');
    else if (months >= 3 && months <= 10) parts.push(`${months} أشهر`);
    else parts.push(`${months} شهراً`);
  }

  if (days > 0 || parts.length === 0) {
    if (days === 1) parts.push('يوم واحد');
    else if (days === 2) parts.push('يومان');
    else if (days >= 3 && days <= 10) parts.push(`${days} أيام`);
    else parts.push(`${days} يوماً`);
  }

  return {
    days,
    months,
    years,
    totalDays,
    textArabic: parts.join(' و '),
  };
}
