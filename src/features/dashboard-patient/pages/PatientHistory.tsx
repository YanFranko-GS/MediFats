import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { usePatientAppointments } from '../../../shared/hooks/useAppointments';
import { usePatientStore } from '../../../shared/stores/patientStore';
import { PageHeader, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { Skeleton, AvatarImg } from '../../../shared/components/atoms/index';
import { cn, formatCurrency, formatDate } from '../../../shared/utils';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  completed: { icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-green-500 bg-green-50 dark:bg-green-950/30', label: 'patientDashboard.status.completed' },
  cancelled: { icon: <XCircle className="h-4 w-4" />, color: 'text-red-400 bg-red-50 dark:bg-red-950/30', label: 'patientDashboard.status.cancelled' },
  'no-show': { icon: <AlertCircle className="h-4 w-4" />, color: 'text-orange-400 bg-orange-50 dark:bg-orange-950/30', label: 'patientDashboard.status.noShow' },
  rescheduled: { icon: <RefreshCw className="h-4 w-4" />, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30', label: 'patientDashboard.status.rescheduled' },
  scheduled: { icon: <Calendar className="h-4 w-4" />, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30', label: 'patientDashboard.status.scheduled' },
};

export default function PatientHistory() {
  const { t } = useTranslation();
  const { data: appointments, isLoading, isError, refetch } = usePatientAppointments();
  const { reviewsByAppointment, addOrUpdateReview } = usePatientStore();
  const [reviewTarget, setReviewTarget] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const openReview = (appt: any) => {
    const existing = reviewsByAppointment[appt.id];
    setReviewTarget(appt);
    setReviewRating(existing?.rating ?? 5);
    setReviewComment(existing?.comment ?? '');
  };

  const handleSaveReview = () => {
    if (!reviewComment.trim()) { toast.error('Escribe un comentario antes de guardar'); return; }
    addOrUpdateReview({
      id: reviewsByAppointment[reviewTarget.id]?.id ?? `rev-${reviewTarget.id}`,
      appointmentId: reviewTarget.id,
      doctorId: reviewTarget.doctorId,
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString(),
    });
    toast.success('Reseña guardada', { description: 'Puedes verla y editarla en "Mis Reseñas".' });
    setReviewTarget(null);
  };

  const history = (appointments || [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by year-month
  const grouped: Record<string, typeof history> = {};
  history.forEach(a => {
    const key = formatDate(a.date, 'MMMM yyyy');
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  });

  const totalSpent = history.filter(a => a.status === 'completed').reduce((s, a) => s + a.price, 0);
  const completedCount = history.filter(a => a.status === 'completed').length;

  return (
    <>
      <Helmet><title>Historial Médico – Clínica Fast</title></Helmet>
      <PageHeader title={t('patientDashboard.viewHistory')} subtitle={t('patientDashboard.historyDesc')}
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: t('patientDashboard.viewHistory') }]} />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('patientDashboard.totalConsultations'), value: history.length, color: 'text-primary-600' },
          { label: t('patientDashboard.completed'), value: completedCount, color: 'text-green-600' },
          { label: t('patientDashboard.cancelled'), value: history.filter(a => a.status === 'cancelled').length, color: 'text-red-500' },
          { label: 'Total invertido', value: formatCurrency(totalSpent), color: 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="card p-4 text-center">
            <p className={cn('text-2xl font-bold font-data', s.color)}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {isError ? <ErrorState onRetry={refetch} /> : isLoading ? (
        <div className="space-y-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : history.length === 0 ? (
        <div className="card p-16 text-center">
          <Calendar className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">{t('patientDashboard.noAppointmentsCategory')}</p>
          <Link to="/doctors" className="btn-primary text-sm inline-flex mt-4">{t('patientDashboard.bookAppointment')}</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).slice(0, 12).map(([month, appts]) => (
            <div key={month}>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 px-1">{month}</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-surface-200 dark:bg-slate-800" />
                <div className="space-y-3">
                  {appts.map((appt, i) => {
                    const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.completed;
                    return (
                      <motion.div key={appt.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex gap-4 pl-4">
                        {/* Timeline dot */}
                        <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-3 z-10 relative', cfg.color)}>
                          {cfg.icon && cfg.icon}
                        </div>
                        {/* Card */}
                        <div className="flex-1 card p-4 flex items-center gap-4 min-w-0">
                          <AvatarImg src={appt.doctorAvatar} alt={appt.doctorName}
                            className="w-10 h-10 rounded-xl object-cover bg-primary-50 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{appt.doctorName}</p>
                            <p className="text-xs text-primary-600 dark:text-primary-400">{appt.doctorSpecialty}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                              <Calendar className="h-3 w-3" />{formatDate(appt.date, 'dd MMM')}
                              <Clock className="h-3 w-3" />{appt.time}
                            </div>
                          </div>
                          <div className="text-right shrink-0 hidden sm:block">
                            <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{formatCurrency(appt.price)}</p>
                            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', cfg.color)}>{t(cfg.label)}</span>
                          </div>
                          {appt.status === 'completed' && (
                            <button onClick={() => openReview(appt)}
                              className={cn('shrink-0 p-2 rounded-lg transition-colors',
                                reviewsByAppointment[appt.id] ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20')}
                              title={reviewsByAppointment[appt.id] ? 'Editar reseña' : 'Dejar reseña'}>
                              <Star className={cn('h-4 w-4', reviewsByAppointment[appt.id] && 'fill-amber-500')} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!reviewTarget} onClose={() => setReviewTarget(null)}
        title={reviewTarget && reviewsByAppointment[reviewTarget.id] ? 'Editar reseña' : 'Dejar reseña'} size="sm"
        footer={<>
          <button onClick={() => setReviewTarget(null)} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.cancel')}</button>
          <button onClick={handleSaveReview} className="btn-primary text-sm px-4 py-2">{t('patientDashboard.saveChanges')}</button>
        </>}>
        {reviewTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-slate-800 rounded-xl">
              <AvatarImg src={reviewTarget.doctorAvatar} alt={reviewTarget.doctorName} className="w-10 h-10 rounded-xl object-cover bg-primary-50" />
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{reviewTarget.doctorName}</p>
                <p className="text-xs text-slate-400">{reviewTarget.doctorSpecialty} · {formatDate(reviewTarget.date, 'dd MMM yyyy')}</p>
              </div>
            </div>
            <div>
              <label className="label-base">{t('patientDashboard.rating')}</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setReviewRating(s)}
                    className={cn('text-2xl transition-transform hover:scale-110', s <= reviewRating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700')}>★</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-base">{t('patientDashboard.comment')}</label>
              <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={3}
                placeholder="Cuéntanos cómo fue tu experiencia con este médico..."
                className="input-base resize-none text-sm" />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
