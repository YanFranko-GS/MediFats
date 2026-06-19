import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BellOff, CheckCheck, Check } from 'lucide-react';
import { useDoctorNotifications, useMarkDoctorNotifRead, useMarkAllDoctorNotifsRead } from '../../../shared/hooks/useDoctor';
import { PageHeader, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton } from '../../../shared/components/atoms/index';
import { cn, formatRelative } from '../../../shared/utils';

const FILTERS = ['all','unread','important'] as const;
const FILTER_LABELS: Record<string,string> = { all:'Todas', unread:'No leídas', important:'Importantes' };

export default function DoctorNotifications() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all');
  const { data: notifications, isLoading, isError, refetch } = useDoctorNotifications(filter);
  const markOne = useMarkDoctorNotifRead();
  const markAll = useMarkAllDoctorNotifsRead();
  const unreadCount = (notifications || []).filter((n: any) => !n.read).length;

  return (
    <>
      <Helmet><title>Notificaciones – Dashboard Médico</title></Helmet>
      <PageHeader title="Notificaciones" subtitle={`${unreadCount} sin leer`}
        action={
          <button onClick={() => markAll.mutate()} disabled={markAll.isPending || unreadCount === 0}
            className="btn-outline text-sm flex items-center gap-2 disabled:opacity-40">
            <CheckCheck className="h-4 w-4" /> Marcar todas leídas
          </button>
        }
        breadcrumb={[{ label: 'Dashboard Médico', href: '/dashboard/doctor' }, { label: 'Notificaciones' }]} />

      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-800 rounded-xl p-1 mb-6 w-fit">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', filter === f ? 'bg-primary-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200')}>
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {isError ? <ErrorState onRetry={refetch} /> : isLoading ? (
        <div className="space-y-2">{[...Array(6)].map((_,i) => <Skeleton key={i} className="h-20"/>)}</div>
      ) : (notifications || []).length === 0 ? (
        <div className="card p-16 text-center">
          <BellOff className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4"/>
          <p className="font-medium text-slate-600 dark:text-slate-400">Sin notificaciones</p>
        </div>
      ) : (
        <div className="card overflow-hidden divide-y divide-surface-100 dark:divide-slate-800">
          <AnimatePresence>
            {(notifications as unknown as any[]).map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn('flex items-start gap-4 px-5 py-4 hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors group',
                  !n.read && 'bg-primary-50/40 dark:bg-primary-950/10')}>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0',
                  n.important ? 'bg-red-50 dark:bg-red-950/30' : 'bg-surface-100 dark:bg-slate-800')}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium', n.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100')}>
                      {n.title}
                      {n.important && <span className="ml-2 text-xs bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-1.5 py-0.5 rounded-full font-semibold">Importante</span>}
                    </p>
                    <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{formatRelative(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.body}</p>
                  {n.href && <Link to={n.href} className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline mt-1 inline-block">Ver detalle →</Link>}
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.read && (
                    <button onClick={() => markOne.mutate(n.id)} title="Marcar como leída"
                      className="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-slate-700 text-slate-400 hover:text-green-600 transition-colors">
                      <Check className="h-3.5 w-3.5"/>
                    </button>
                  )}
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary-600 shrink-0 mt-1.5"/>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
