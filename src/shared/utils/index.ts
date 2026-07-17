import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

// ─── CLASSNAMES ──────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── DATES ───────────────────────────────────────────────────────────────────
export function formatDate(date: string, fmt = 'dd MMM yyyy', lang = 'es'): string {
  try {
    return format(parseISO(date), fmt, {
      locale: lang === 'es' ? es : enUS,
    });
  } catch {
    return date;
  }
}

export function formatRelative(date: string, lang = 'es'): string {
  try {
    return formatDistanceToNow(parseISO(date), {
      addSuffix: true,
      locale: lang === 'es' ? es : enUS,
    });
  } catch {
    return date;
  }
}

// ─── CURRENCY ────────────────────────────────────────────────────────────────
// MediConnect operates in Peru (EsSalud, Lima addresses, DNI), so amounts are
// displayed in Peruvian Soles (S/) using the es-PE locale by default.
export function formatCurrency(amount: number, currency = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── NUMBERS ─────────────────────────────────────────────────────────────────
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-PE').format(n);
}

export function formatPercentage(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

// ─── STRINGS ─────────────────────────────────────────────────────────────────
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}

// ─── APPOINTMENT DATE/TIME ───────────────────────────────────────────────────
// Appointment records store the calendar day in `date` (an ISO string whose
// time-of-day component is generation noise, not the real scheduled hour) and
// the actual scheduled hour separately in `time` (e.g. "10:30"). Comparing
// against `date` alone silently uses the wrong hour and produces unstable,
// inconsistent "is this appointment upcoming?" results. This combines both
// fields into the true appointment moment and should be used everywhere that
// distinction matters.
export function getAppointmentDateTime(appt: { date: string; time?: string }): Date {
  const d = new Date(appt.date);
  if (appt.time) {
    const [h, m] = appt.time.split(':').map(Number);
    if (!Number.isNaN(h) && !Number.isNaN(m)) d.setHours(h, m, 0, 0);
  }
  return d;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── RANDOM ──────────────────────────────────────────────────────────────────
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── STATUS HELPERS ──────────────────────────────────────────────────────────
export const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'no-show': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  rescheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

// ─── AVATAR ──────────────────────────────────────────────────────────────────
export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export function doctorAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}`;
}
