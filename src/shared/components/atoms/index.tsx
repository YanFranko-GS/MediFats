import React from 'react';
import { cn, initials } from '../../utils';

// ─── BADGE ───────────────────────────────────────────────────────────────────
type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
type BadgeSize = 'sm' | 'md';

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  outline: 'border border-current text-slate-600 dark:text-slate-400',
};

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', size = 'md', dot, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        badgeVariants[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full bg-current')} />}
      {children}
    </span>
  );
}

// ─── SKELETON ────────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-800',
        variant === 'circle' ? 'rounded-full' : 'rounded-lg',
        variant === 'text' ? 'h-4' : '',
        className
      )}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="w-12 h-12 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
      <Skeleton className="h-20" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 px-4">
      <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-1/2 h-3" />
      </div>
      <Skeleton className="h-7 w-20" />
    </div>
  );
}

// ─── SPINNER ─────────────────────────────────────────────────────────────────
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={cn(
        'border-2 border-surface-200 border-t-primary-600 rounded-full animate-spin',
        spinnerSizes[size],
        className
      )}
    />
  );
}

// ─── AVATAR ──────────────────────────────────────────────────────────────────
interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  online?: boolean;
}

const avatarSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const onlineSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

export function Avatar({ src, name, size = 'md', className, online }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  // Reset error state whenever the image source changes (e.g. after uploading a new photo),
  // otherwise a previously failed src (like an unreachable placeholder avatar) would permanently
  // lock the component into showing initials even after a valid new src is provided.
  React.useEffect(() => { setImgError(false); }, [src]);

  return (
    <div className={cn('relative shrink-0', className)}>
      <div className={cn('rounded-full overflow-hidden bg-primary-100 flex items-center justify-center font-semibold text-primary-700', avatarSizes[size])}>
        {src && !imgError ? (
          <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <span>{name ? initials(name) : '?'}</span>
        )}
      </div>
      {online !== undefined && (
        <span className={cn(
          'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-900',
          onlineSizes[size],
          online ? 'bg-green-500' : 'bg-slate-400'
        )} />
      )}
    </div>
  );
}

// ─── AVATAR IMG (drop-in replacement for raw <img src={avatar}>) ─────────────
// Real-world reliance on external avatar services (dicebear, etc.) is
// unreliable: rate limits, fair-use blocks, or outages break every photo in
// the app simultaneously. This component preserves the exact className the
// caller already uses (size, rounding, object-fit) but gracefully falls back
// to a colored initials badge — the same pattern Gmail, Slack, and Linear use
// — instead of a broken-image icon, and assigns a deterministic color per
// person so the same doctor/patient always gets the same fallback color.
const AVATAR_PALETTE = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-fuchsia-100 text-fuchsia-700',
];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function textSizeForClassName(className = ''): string {
  const m = className.match(/\bw-(\d+)\b/);
  const w = m ? parseInt(m[1], 10) : 10;
  if (w <= 7) return 'text-[10px]';
  if (w <= 9) return 'text-xs';
  if (w <= 12) return 'text-sm';
  if (w <= 16) return 'text-base';
  return 'text-lg';
}

interface AvatarImgProps {
  src?: string;
  alt: string;
  className?: string;
}

export function AvatarImg({ src, alt, className }: AvatarImgProps) {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => { setImgError(false); }, [src]);

  if (!src || imgError) {
    return (
      <div className={cn(className, 'flex items-center justify-center font-semibold shrink-0', textSizeForClassName(className), colorForName(alt || '?'))}>
        <span>{alt ? initials(alt) : '?'}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
    />
  );
}

// ─── DIVIDER ─────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-surface-200 dark:border-slate-800', className)} />;
}

// ─── STAR RATING ─────────────────────────────────────────────────────────────
interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  showNumber?: boolean;
}

export function StarRating({ rating, size = 'sm', showNumber = true }: StarRatingProps) {
  const starSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
            className={cn(starSize, i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-200 dark:text-slate-700')}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>
      {showNumber && (
        <span className={cn('font-semibold text-slate-700 dark:text-slate-300', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
