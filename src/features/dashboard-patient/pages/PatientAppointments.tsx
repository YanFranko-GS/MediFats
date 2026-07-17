import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, Building2, MessageCircle, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { usePatientAppointments, useCancelAppointment, useRescheduleAppointment } from '../../../shared/hooks/useAppointments';
import { PageHeader, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { SkeletonCard, Badge, AvatarImg } from '../../../shared/components/atoms/index';
import { cn, formatCurrency, formatDate, statusColors, getAppointmentDateTime } from '../../../shared/utils';

const MODE_ICONS: Record<string, React.ReactNode> = {
  'in-person': <Building2 className="h-3.5 w-3.5" />,
  'video': <Video className="h-3.5 w-3.5" />,
  'chat': <MessageCircle className="h-3.5 w-3.5" />,
};
const TABS = ['all', 'scheduled', 'completed', 'cancelled'] as const;

export default function PatientAppointments() {
  const { t } = useTranslation();
  
  const STATUS_LABELS: Record<string, string> = {
    scheduled: t('patientDashboard.status.scheduled'), completed: t('patientDashboard.status.completed'), cancelled: t('patientDashboard.status.cancelled'),
    'no-show': t('patientDashboard.status.noShow'), rescheduled: t('patientDashboard.status.rescheduled'),
  };
  const TAB_LABELS: Record<string, string> = { all: t('patientDashboard.all'), scheduled: t('patientDashboard.upcoming'), completed: t('patientDashboard.completed'), cancelled: t('patientDashboard.status.cancelled') };

  const [tab, setTab] = useState<typeof TABS[number]>('all');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [rescheduleTarget, setRescheduleTarget] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const { data: appointments, isLoading, isError, refetch } = usePatientAppointments();
  const cancelMutation = useCancelAppointment();
  const rescheduleMutation = useRescheduleAppointment();

  // "Próximas" (scheduled) means genuinely ahead in time, not just an
  // unclosed status — matches the definition used on the Dashboard KPI so
  // both pages always agree on the same count.
  const isUpcoming = (a: any) => a.status === 'scheduled' && getAppointmentDateTime(a) >= new Date();

  const filtered = (appointments || []).filter(a =>
    tab === 'all' ? true : tab === 'scheduled' ? isUpcoming(a) : a.status === tab
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const counts: Record<string, number> = {
    all: (appointments || []).length,
    scheduled: (appointments || []).filter(isUpcoming).length,
    completed: (appointments || []).filter(a => a.status === 'completed').length,
    cancelled: (appointments || []).filter(a => a.status === 'cancelled').length,
  };

  return (
    <>
      <Helmet><title>Mis Citas – SmartSalud</title></Helmet>
      <PageHeader title={t('patientDashboard.myAppointments')} subtitle={t('patientDashboard.historyDesc')}
        action={<Link to="/doctors" className="btn-primary flex items-center gap-2 text-sm"><Plus className="h-4 w-4" /> {t('patientDashboard.newAppointment')}</Link>}
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: t('patientDashboard.myAppointments') }]} />

      {/* Tab bar */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-800 rounded-xl p-1 mb-6 w-full sm:w-fit overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shrink-0 whitespace-nowrap',
              tab === t ? 'bg-primary-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200')}>
            {TAB_LABELS[t]}
            <span className={cn('text-xs px-1.5 py-0.5 rounded-full', tab === t ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-slate-800 text-slate-500')}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {isError ? <ErrorState onRetry={refetch} /> : isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Calendar className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-medium mb-2">{t('patientDashboard.noAppointmentsCategory')}</p>
          <Link to="/doctors" className="btn-primary text-sm inline-flex items-center gap-2 mt-2">
            <Plus className="h-4 w-4" /> {t('patientDashboard.bookAppointment')}
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((appt, i) => (
              <motion.div key={appt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                className="card p-5 flex flex-col gap-3 min-w-0">
                <div className="flex items-start gap-3">
                  <AvatarImg src={appt.doctorAvatar} alt={appt.doctorName} className="w-12 h-12 rounded-xl object-cover bg-primary-50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate text-sm">{appt.doctorName}</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400">{appt.doctorSpecialty}</p>
                  </div>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium shrink-0', statusColors[appt.status])}>
                    {STATUS_LABELS[appt.status]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-slate-300" />
                    {formatDate(appt.date, 'dd MMM yyyy')}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-slate-300" /> {appt.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 capitalize">
                    {MODE_ICONS[appt.mode]} {appt.mode}
                  </div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(appt.price)}</div>
                </div>

                {appt.reason && (
                  <p className="text-xs text-slate-400 border-t border-surface-100 dark:border-slate-800 pt-2 truncate">
                    Motivo: {appt.reason}
                  </p>
                )}

                {appt.status === 'scheduled' && (
                  <div className="flex gap-2 pt-1 border-t border-surface-100 dark:border-slate-800">
                    <button onClick={() => setCancelId(appt.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors">
                      <AlertTriangle className="h-3 w-3" /> {t('patientDashboard.cancel')}
                    </button>
                    <button onClick={() => { setRescheduleTarget(appt); setNewDate(appt.date.slice(0, 10)); setNewTime(appt.time); }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-lg transition-colors">
                      <RefreshCw className="h-3 w-3" /> {t('patientDashboard.reschedule')}
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={!!cancelId} onClose={() => { setCancelId(null); setCancelReason(''); }}
        title={t('patientDashboard.cancelAppointment')} size="sm"
        footer={<>
          <button onClick={() => { setCancelId(null); setCancelReason(''); }} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.goBack')}</button>
          <button onClick={async () => { await cancelMutation.mutateAsync({ id: cancelId!, reason: cancelReason }); setCancelId(null); setCancelReason(''); }}
            disabled={cancelMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 text-sm">
            {cancelMutation.isPending ? t('patientDashboard.canceling') : t('patientDashboard.confirmCancel')}
          </button>
        </>}>
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">{t('patientDashboard.cannotUndo')}</p>
          </div>
          <div>
            <label className="label-base">{t('patientDashboard.reasonOptional')}</label>
            <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={3}
              className="input-base resize-none text-sm" placeholder={t('patientDashboard.reasonPlaceholder')} />
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!rescheduleTarget} onClose={() => setRescheduleTarget(null)}
        title="Reprogramar cita" size="sm"
        footer={<>
          <button onClick={() => setRescheduleTarget(null)} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.goBack')}</button>
          <button onClick={async () => {
            await rescheduleMutation.mutateAsync({ id: rescheduleTarget.id, date: newDate, time: newTime });
            setRescheduleTarget(null);
          }} disabled={rescheduleMutation.isPending || !newDate || !newTime}
            className="btn-primary text-sm px-4 py-2 disabled:opacity-50">
            {rescheduleMutation.isPending ? 'Reprogramando…' : 'Confirmar nueva fecha'}
          </button>
        </>}>
        {rescheduleTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-slate-800 rounded-xl">
              <AvatarImg src={rescheduleTarget.doctorAvatar} alt={rescheduleTarget.doctorName} className="w-10 h-10 rounded-xl object-cover bg-primary-50" />
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{rescheduleTarget.doctorName}</p>
                <p className="text-xs text-slate-400">{rescheduleTarget.doctorSpecialty}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-base">Nueva fecha</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)} className="input-base text-sm" />
              </div>
              <div>
                <label className="label-base">Nueva hora</label>
                <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="input-base text-sm" />
              </div>
            </div>
            <p className="text-xs text-slate-400">Tu cita anterior se actualizará a la nueva fecha y hora seleccionadas. El médico será notificado del cambio.</p>
          </div>
        )}
      </Modal>
    </>
  );
}
