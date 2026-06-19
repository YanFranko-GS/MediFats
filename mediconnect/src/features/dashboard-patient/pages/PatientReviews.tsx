import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Edit3, Trash2, Search } from 'lucide-react';
import { usePatientAppointments } from '../../../shared/hooks/useAppointments';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { Skeleton } from '../../../shared/components/atoms/index';
import { formatDate, cn } from '../../../shared/utils';
import { toast } from 'sonner';

// Build reviews from completed appointments
function useMyReviews() {
  const { data: appointments, isLoading } = usePatientAppointments();
  const completed = (appointments || []).filter((a: any) => a.status === 'completed').slice(0, 12);
  const reviews = completed.map((a: any, i: number) => ({
    id: `rev-my-${i}`,
    appointmentId: a.id,
    doctorId: a.doctorId,
    doctorName: a.doctorName,
    doctorAvatar: a.doctorAvatar,
    doctorSpecialty: a.doctorSpecialty,
    rating: [4, 5, 5, 4, 5, 3, 5, 4, 5, 4, 5, 5][i % 12],
    comment: [
      'Excelente doctor, muy atento y profesional.',
      'Me explicó todo con claridad. Muy recomendado.',
      'La atención fue rápida y efectiva. Muy satisfecha.',
      'Buen profesional, resolvió mis dudas.',
      'Muy empático y dedicado. Lo recomiendo.',
    ][i % 5],
    date: a.date,
  }));
  return { reviews, isLoading };
}

export default function PatientReviews() {
  const { t } = useTranslation();
  const { reviews, isLoading } = useMyReviews();
  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [localReviews, setLocalReviews] = useState<any[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const allReviews = [...reviews.filter(r => !deletedIds.includes(r.id)).map(r => {
    const edited = localReviews.find(e => e.id === r.id);
    return edited ? { ...r, ...edited } : r;
  })];

  const openEdit = (r: any) => { setEditTarget(r); setEditRating(r.rating); setEditComment(r.comment); };

  const handleSaveEdit = () => {
    setLocalReviews(prev => { const f = prev.filter(e => e.id !== editTarget.id); return [...f, { id: editTarget.id, rating: editRating, comment: editComment }]; });
    setEditTarget(null);
    toast.success('Reseña actualizada');
  };

  const handleDelete = () => {
    setDeletedIds(prev => [...prev, deleteTarget.id]);
    setDeleteTarget(null);
    toast.success('Reseña eliminada');
  };

  const avgRating = allReviews.length ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : '0';

  return (
    <>
      <Helmet><title>{t('patientDashboard.reviewsTitle')}</title></Helmet>
      <PageHeader title="Mis Reseñas" subtitle="Reseñas que has dejado a tus médicos"
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Mis Reseñas' }]} />

      {/* Summary */}
      {allReviews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center"><p className="text-2xl font-bold font-data text-amber-500">{avgRating}★</p><p className="text-xs text-slate-400 mt-1">{t('patientDashboard.averageGiven')}</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold font-data text-primary-600">{allReviews.length}</p><p className="text-xs text-slate-400 mt-1">{t('patientDashboard.writtenReviews')}</p></div>
          <div className="card p-4 text-center"><p className="text-2xl font-bold font-data text-green-600">{allReviews.filter(r => r.rating >= 4).length}</p><p className="text-xs text-slate-400 mt-1">{t('patientDashboard.positiveRatings')}</p></div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : allReviews.length === 0 ? (
        <div className="card p-16 text-center">
          <Star className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('patientDashboard.noReviewsYet')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t('patientDashboard.rateAfterConsultation')}</p>
          <Link to="/dashboard/patient/find-doctors" className="btn-primary text-sm inline-flex items-center gap-2">{t('patientDashboard.findDoctors')}</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {allReviews.map((rev, i) => (
            <motion.div key={rev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="card p-5 flex gap-4">
              <img src={rev.doctorAvatar} alt={rev.doctorName} className="w-12 h-12 rounded-xl bg-primary-50 object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{rev.doctorName}</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400">{rev.doctorSpecialty}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => openEdit(rev)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-colors" title="Editar"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteTarget(rev)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-colors" title={t('patientDashboard.delete')}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-1 my-2">
                  {[1,2,3,4,5].map(j => <span key={j} className={j <= rev.rating ? 'text-amber-400 text-sm' : 'text-slate-200 dark:text-slate-700 text-sm'}>★</span>)}
                  <span className="text-xs text-slate-400 ml-1">{formatDate(rev.date, 'dd MMM yyyy')}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">"{rev.comment}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Editar reseña" size="sm"
        footer={<><button onClick={() => setEditTarget(null)} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.cancel')}</button><button onClick={handleSaveEdit} className="btn-primary text-sm px-4 py-2">{t('patientDashboard.saveChanges')}</button></>}>
        {editTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-slate-800 rounded-xl">
              <img src={editTarget.doctorAvatar} alt={editTarget.doctorName} className="w-10 h-10 rounded-xl object-cover bg-primary-50" />
              <div><p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{editTarget.doctorName}</p><p className="text-xs text-slate-400">{editTarget.doctorSpecialty}</p></div>
            </div>
            <div>
              <label className="label-base">{t('patientDashboard.rating')}</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setEditRating(s)} className={cn('text-2xl transition-transform hover:scale-110', s <= editRating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700')}>★</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-base">{t('patientDashboard.comment')}</label>
              <textarea value={editComment} onChange={e => setEditComment(e.target.value)} rows={3} className="input-base resize-none text-sm" />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Eliminar reseña" size="sm"
        footer={<><button onClick={() => setDeleteTarget(null)} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.cancel')}</button><button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 text-sm">{t('patientDashboard.delete')}</button></>}>
        <p className="text-sm text-slate-600 dark:text-slate-400">¿Estás segura de eliminar esta reseña? Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  );
}
