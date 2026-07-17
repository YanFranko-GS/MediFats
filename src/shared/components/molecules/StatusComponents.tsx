import React from 'react';
import { WifiOff, AlertTriangle, SearchX, CalendarX, FileSearch } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '../../utils';
import { useOnlineStatus } from '../../hooks';
import { motion } from 'framer-motion';

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
        {icon || <SearchX className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">{description}</p>}
      {action && (
        <Button variant="outline" size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

export function EmptyAppointments() {
  return (
    <EmptyState
      title="No tienes citas programadas"
      description="Reserva una cita con uno de nuestros especialistas."
      icon={<CalendarX className="h-7 w-7" />}
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      title="Sin resultados"
      description="No encontramos médicos que coincidan con tu búsqueda. Intenta con otros términos."
      icon={<FileSearch className="h-7 w-7" />}
    />
  );
}

// ─── ERROR STATE ─────────────────────────────────────────────────────────────
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message = 'Algo salió mal. Por favor reintenta.', onRetry, className }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}
    >
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">Error</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </motion.div>
  );
}

// ─── OFFLINE BANNER ──────────────────────────────────────────────────────────
export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <motion.div
      initial={{ y: -48 }}
      animate={{ y: 0 }}
      exit={{ y: -48 }}
      className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white text-sm font-medium py-2.5 px-4 flex items-center justify-center gap-2"
      role="alert"
    >
      <WifiOff className="h-4 w-4" />
      Sin conexión. Algunas funciones pueden no estar disponibles.
    </motion.div>
  );
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  iconColor?: string;
  description?: string;
  className?: string;
}

export function KpiCard({ title, value, change, icon, iconColor = 'bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400', description, className }: KpiCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={cn('card p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{title}</p>
          <p className="text-2xl font-bold font-data text-slate-800 dark:text-slate-100 truncate">{value}</p>
          {change !== undefined && (
            <p className={cn('text-xs font-medium mt-1', isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400')}>
              {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% vs mes anterior
            </p>
          )}
          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>
        {icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconColor)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE HEADER ─────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}

export function PageHeader({ title, subtitle, action, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
          {breadcrumb.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span>/</span>}
              {item.href ? (
                <a href={item.href} className="hover:text-primary-600 transition-colors">{item.label}</a>
              ) : (
                <span className={i === breadcrumb.length - 1 ? 'text-slate-700 dark:text-slate-300 font-medium' : ''}>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
