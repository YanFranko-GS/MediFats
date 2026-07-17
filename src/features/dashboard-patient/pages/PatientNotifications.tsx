import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, BellOff, Check, CheckCheck, Trash2 } from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '../../../shared/hooks/usePatient';
import { usePatientStore } from '../../../shared/stores/patientStore';
import { PageHeader, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton } from '../../../shared/components/atoms/index';
import { cn, formatRelative } from '../../../shared/utils';
import { toast } from 'sonner';

const FILTERS = ['all', 'unread', 'important'] as const;

export default function PatientNotifications() {
  const { t } = useTranslation();
  const FILTER_LABELS: Record<string, string> = { all: t('patientDashboard.all'), unread: 'No leídas', important: 'Importantes' };
  
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all');
  const { data: notifications, isLoading, isError, refetch } = useNotifications(filter);
  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllRead();
  const { dismissedNotificationIds, dismissNotification } = usePatientStore();

  const visibleNotifications = (notifications || []).filter((n: any) => !dismissedNotificationIds.includes(n.id));
  const unreadCount = visibleNotifications.filter((n: any) => !n.read).length;

  const handleDismiss = (id: string) => {
    dismissNotification(id);
    toast.success('Notificación eliminada');
  };

  return (
    <>
      <Helmet><title>Notificaciones – SmartSalud</title></Helmet>
      <PageHeader title="Notificaciones" subtitle={`${unreadCount} sin leer`}
        action={
          <button onClick={() => markAll.mutate()} disabled={markAll.isPending || unreadCount === 0}
            className="btn-outline text-sm flex items-center gap-2 disabled:opacity-40">
            <CheckCheck className="h-4 w-4" /> Marcar todas leídas
          </button>
        }
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Notificaciones' }]} />

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-800 rounded-xl p-1 mb-6 w-fit">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', filter === f ? 'bg-primary-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200')}>
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {isError ? <ErrorState onRetry={refetch} /> : isLoading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : visibleNotifications.length === 0 ? (
        <div className="card p-16 text-center">
          <BellOff className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <p className="font-medium text-slate-600 dark:text-slate-400 mb-1">No hay notificaciones</p>
          <p className="text-sm text-slate-400">Aquí aparecerán tus alertas y recordatorios médicos.</p>
        </div>
      ) : (
        <div className="card overflow-hidden divide-y divide-surface-100 dark:divide-slate-800">
          <AnimatePresence>
            {(visibleNotifications as unknown as any[]).map((notif, i) => (
              <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.03 }}
                className={cn('flex items-start gap-4 px-5 py-4 hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors group',
                  !notif.read && 'bg-primary-50/40 dark:bg-primary-950/10')}>
                {/* Icon */}
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0',
                  notif.important ? 'bg-red-50 dark:bg-red-950/30' : 'bg-surface-100 dark:bg-slate-800')}>
                  {notif.icon}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium', notif.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100')}>
                      {notif.title}
                      {notif.important && <span className="ml-2 text-xs bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-1.5 py-0.5 rounded-full font-semibold">Importante</span>}
                    </p>
                    <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{formatRelative(notif.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.body}</p>
                  {notif.href && (
                    <Link to={notif.href} className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline mt-1 inline-block">Ver detalle →</Link>
                  )}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button onClick={() => markOne.mutate(notif.id)} title="Marcar como leída"
                      className="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-slate-700 text-slate-400 hover:text-green-600 transition-colors">
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button onClick={() => handleDismiss(notif.id)} title="Eliminar notificación"
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {/* Unread dot */}
                {!notif.read && <div className="w-2 h-2 rounded-full bg-primary-600 shrink-0 mt-1.5" />}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
