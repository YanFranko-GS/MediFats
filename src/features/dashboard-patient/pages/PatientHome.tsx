import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, XCircle, Plus, Video, Building2, MessageCircle, AlertTriangle, Pill, FlaskConical, Star, Stethoscope, Heart, Bell, Activity, ClipboardList } from 'lucide-react';
import { useAuthStore } from '../../../shared/stores/authStore';
import { usePatientAppointments, useAppointmentStats, useCancelAppointment } from '../../../shared/hooks/useAppointments';
import { useActiveMedications } from '../../../shared/hooks/usePatient';
import { usePendingResults } from '../../../shared/hooks/usePatient';
import { useUnreadCount } from '../../../shared/hooks/usePatient';
import { PageHeader, KpiCard, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { SkeletonRow, Skeleton, Badge, AvatarImg } from '../../../shared/components/atoms/index';
import { cn, formatCurrency, formatDate, statusColors, getAppointmentDateTime } from '../../../shared/utils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const MODE_ICONS: Record<string, React.ReactNode> = {
  'in-person': <Building2 className="h-3.5 w-3.5" />,
  'video': <Video className="h-3.5 w-3.5" />,
  'chat': <MessageCircle className="h-3.5 w-3.5" />,
};
const STATUS_COLORS_MED: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  finished: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

function KpiWidget({ icon, label, value, color, to }: { icon: React.ReactNode; label: string; value: string | number; color: string; to: string }) {
  return (
    <Link to={to}>
      <motion.div whileHover={{ y: -2 }} className="card p-4 flex items-center gap-3 hover:shadow-card-md transition-all cursor-pointer">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', color)}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xl font-bold font-data text-slate-800 dark:text-slate-100 leading-none">{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{label}</p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function PatientHome() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const { data: appointments, isLoading, isError, refetch } = usePatientAppointments();
  const { data: stats } = useAppointmentStats();
  const { data: meds } = useActiveMedications();
  const { data: pendingResults } = usePendingResults();
  const { data: unread } = useUnreadCount();
  const cancelMutation = useCancelAppointment();

  const now = new Date();
  const upcoming = (appointments || []).filter(a => a.status === 'scheduled' && getAppointmentDateTime(a) >= now)
    .sort((a, b) => getAppointmentDateTime(a).getTime() - getAppointmentDateTime(b).getTime()).slice(0, 5);
  const uniqueDoctors = new Set((appointments || []).map(a => a.doctorId)).size;
  const uniqueSpecialties = new Set((appointments || []).map(a => a.doctorSpecialty)).size;

  const kpis = [
    { icon: <Calendar className="h-5 w-5" />, label: t('dashboard.totalConsultations'), value: stats?.total ?? 0, color: 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400', to: '/dashboard/patient/appointments' },
    { icon: <CheckCircle2 className="h-5 w-5" />, label: t('dashboard.completed'), value: stats?.completed ?? 0, color: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400', to: '/dashboard/patient/history' },
    { icon: <Clock className="h-5 w-5" />, label: t('dashboard.upcoming'), value: stats?.upcoming ?? 0, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400', to: '/dashboard/patient/appointments' },
    { icon: <Stethoscope className="h-5 w-5" />, label: t('dashboard.consultedDoctors'), value: uniqueDoctors, color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400', to: '/dashboard/patient/find-doctors' },
    { icon: <Pill className="h-5 w-5" />, label: t('dashboard.activeMeds'), value: (meds || []).length, color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400', to: '/dashboard/patient/prescriptions' },
    { icon: <FlaskConical className="h-5 w-5" />, label: t('dashboard.pendingResults'), value: (pendingResults || []).length, color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400', to: '/dashboard/patient/results' },
    { icon: <Bell className="h-5 w-5" />, label: t('dashboard.newNotifications'), value: unread ?? 0, color: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400', to: '/dashboard/patient/notifications' },
    { icon: <Activity className="h-5 w-5" />, label: t('dashboard.visitedSpecialties'), value: uniqueSpecialties, color: 'bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400', to: '/dashboard/patient/health' },
  ];

  return (
    <>
      <Helmet><title>Mi Dashboard – SmartSalud</title></Helmet>
      <PageHeader
        title={t('dashboard.patientTitle', { name: user?.name.split(' ')[0] })}
        subtitle={t('dashboard.patientSubtitle')}
        action={<Link to="/dashboard/patient/find-doctors" className="btn-primary flex items-center gap-2 text-sm"><Plus className="h-4 w-4" />{t('dashboard.newAppointment')}</Link>}
        breadcrumb={[{ label: t('patientDashboard.dashboard') }]}
      />

      {/* 8 KPI widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {kpis.map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <KpiWidget {...k} />
          </motion.div>
        ))}
      </div>

      {/* Second row: 3 columns */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Upcoming appointments */}
        <div className="lg:col-span-1 card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-600" /> {t('patientDashboard.upcomingAppointments')}
            </h3>
            <Link to="/dashboard/patient/appointments" className="text-xs text-primary-600 hover:underline">{t('patientDashboard.viewAll')}</Link>
          </div>
          {isLoading ? (
            <div className="p-3 space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : upcoming.length === 0 ? (
            <div className="py-8 text-center px-4">
              <Calendar className="h-8 w-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-400 mb-3">{t('patientDashboard.noUpcoming')}</p>
              <Link to="/dashboard/patient/find-doctors" className="btn-primary text-xs px-3 py-1.5">{t('patientDashboard.bookAppointment')}</Link>
            </div>
          ) : (
            <div className="divide-y divide-surface-100 dark:divide-slate-800">
              {upcoming.map(appt => (
                <div key={appt.id} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors">
                  <AvatarImg src={appt.doctorAvatar} alt={appt.doctorName} className="w-9 h-9 rounded-xl bg-primary-50 object-cover shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{appt.doctorName}</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400">{appt.doctorSpecialty}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />{formatDate(appt.date, 'dd MMM')}
                      <Clock className="h-3 w-3 ml-1" />{appt.time}
                      <span className="ml-1 flex items-center gap-0.5 capitalize">{MODE_ICONS[appt.mode]}{appt.mode}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {appt.mode === 'video' && (
                      <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full font-medium">{t('patientDashboard.enter')}</span>
                    )}
                    <button onClick={() => setCancelId(appt.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">{t('patientDashboard.cancel')}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active medications */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Pill className="h-4 w-4 text-purple-600" /> {t('patientDashboard.activeMedications')}
            </h3>
            <Link to="/dashboard/patient/prescriptions" className="text-xs text-primary-600 hover:underline">{t('patientDashboard.viewAll')}</Link>
          </div>
          {!meds ? (
            <div className="p-3 space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : meds.length === 0 ? (
            <div className="py-8 text-center"><Pill className="h-8 w-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" /><p className="text-sm text-slate-400">{t('patientDashboard.noActiveMeds')}</p></div>
          ) : (
            <div className="divide-y divide-surface-100 dark:divide-slate-800">
              {(meds as unknown as any[]).slice(0, 5).map((med: any) => (
                <div key={med.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                    <Pill className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{med.name} <span className="font-normal text-slate-400">{med.dose}</span></p>
                    <p className="text-xs text-slate-400 truncate">{med.frequency}</p>
                  </div>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium shrink-0', STATUS_COLORS_MED[med.status])}>
                    {t(`patientDashboard.status.${med.status}`)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest results */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-orange-500" /> {t('patientDashboard.latestResults')}
            </h3>
            <Link to="/dashboard/patient/results" className="text-xs text-primary-600 hover:underline">{t('patientDashboard.viewAll')}</Link>
          </div>
          {!pendingResults ? (
            <div className="p-3 space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : (
            <div className="divide-y divide-surface-100 dark:divide-slate-800">
              {(pendingResults as unknown as any[]).slice(0, 5).map((res: any) => (
                <div key={res.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center shrink-0">
                    <FlaskConical className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{res.type}</p>
                    <p className="text-xs text-slate-400">{formatDate(res.date, 'dd MMM yyyy')}</p>
                  </div>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
                    res.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    res.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400')}>
                    {t(`patientDashboard.status.${res.status}`)}
                  </span>
                </div>
              ))}
              {(pendingResults as unknown as any[]).length === 0 && (
                <div className="py-8 text-center"><FlaskConical className="h-8 w-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" /><p className="text-sm text-slate-400">{t('patientDashboard.noPendingResults')}</p></div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('patientDashboard.findDoctor'), icon: <Stethoscope className="h-4 w-4" />, to: '/dashboard/patient/find-doctors', color: 'bg-primary-600 hover:bg-primary-700 text-white' },
          { label: t('patientDashboard.viewHistory'), icon: <ClipboardList />, to: '/dashboard/patient/history', color: 'bg-white dark:bg-slate-900 hover:bg-surface-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-surface-200 dark:border-slate-700' },
          { label: t('patientDashboard.myPrescriptions'), icon: <Pill className="h-4 w-4" />, to: '/dashboard/patient/prescriptions', color: 'bg-white dark:bg-slate-900 hover:bg-surface-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-surface-200 dark:border-slate-700' },
          { label: t('patientDashboard.telemedicine'), icon: <Video className="h-4 w-4" />, to: '/dashboard/patient/telemedicine', color: 'bg-white dark:bg-slate-900 hover:bg-surface-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-surface-200 dark:border-slate-700' },
        ].map(a => (
          <Link key={a.label} to={a.to} className={cn('flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors', a.color)}>
            {a.icon} {a.label}
          </Link>
        ))}
      </div>

      {/* Cancel modal */}
      <Modal isOpen={!!cancelId} onClose={() => { setCancelId(null); setCancelReason(''); }} title={t('patientDashboard.cancelAppointment')} size="sm"
        footer={<>
          <button onClick={() => { setCancelId(null); setCancelReason(''); }} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.goBack')}</button>
          <button onClick={async () => { await cancelMutation.mutateAsync({ id: cancelId!, reason: cancelReason }); setCancelId(null); setCancelReason(''); }}
            disabled={cancelMutation.isPending} className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 text-sm">
            {cancelMutation.isPending ? t('patientDashboard.canceling') : t('patientDashboard.confirm')}
          </button>
        </>}>
        <div className="space-y-3">
          <div className="flex gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">{t('patientDashboard.cannotUndo')}</p>
          </div>
          <div>
            <label className="label-base">{t('patientDashboard.reasonOptional')}</label>
            <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={2}
              className="input-base resize-none text-sm" placeholder={t('patientDashboard.reasonPlaceholder')} />
          </div>
        </div>
      </Modal>
    </>
  );
}

