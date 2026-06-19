import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, EyeOff, Trash2, Flag, Filter, Clock } from 'lucide-react';
import { PageHeader, KpiCard } from '../../../shared/components/molecules/StatusComponents';
import { Badge, Avatar, Skeleton } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { usePendingReviews } from '../hooks/useAdminMaster';
import { useAdminMasterStore } from '../store/adminMasterStore';
import { formatRelative, cn } from '../../../shared/utils';
import { toast } from 'sonner';

const STATUS_CFG: Record<string, { label: string; variant: any }> = {
  pending:  { label: 'Pendiente',  variant: 'warning' },
  approved: { label: 'Aprobada',   variant: 'success' },
  hidden:   { label: 'Oculta',     variant: 'default' },
};

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={cn('h-3.5 w-3.5', s <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600')}/>
      ))}
    </div>
  );
}

export default function AdminModeration() {
  const { data: reviews = [], isLoading } = usePendingReviews();
  const { approveReview, hideReview, deleteReview } = useAdminMasterStore();
  const [filter, setFilter] = useState<'all'|'pending'|'flagged'>('pending');

  const visible = reviews.filter(r => {
    if (filter === 'pending') return r.moderationStatus === 'pending';
    if (filter === 'flagged') return (r as any).flagged;
    return true;
  });

  const stats = {
    pending: reviews.filter(r => r.moderationStatus === 'pending').length,
    approved: reviews.filter(r => r.moderationStatus === 'approved').length,
    hidden: reviews.filter(r => r.moderationStatus === 'hidden').length,
    flagged: reviews.filter(r => (r as any).flagged).length,
  };

  return (
    <>
      <Helmet><title>Moderación de Reseñas – Admin</title></Helmet>
      <PageHeader
        title="Centro de Moderación"
        subtitle="Revisión y moderación de reseñas"
        breadcrumb={[{ label:'Admin' },{ label:'Reseñas' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? [...Array(4)].map((_,i)=><Skeleton key={i} className="h-24"/>) : <>
          <KpiCard title="Pendientes" value={stats.pending} icon={<Clock className="h-5 w-5"/>} iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"/>
          <KpiCard title="Aprobadas" value={stats.approved} icon={<CheckCircle className="h-5 w-5"/>} iconColor="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"/>
          <KpiCard title="Ocultas" value={stats.hidden} icon={<EyeOff className="h-5 w-5"/>} iconColor="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400"/>
          <KpiCard title="Reportadas" value={stats.flagged} icon={<Flag className="h-5 w-5"/>} iconColor="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"/>
        </>}
      </div>

      <div className="flex gap-1 p-1 bg-surface-100 dark:bg-slate-800 rounded-xl w-fit mb-4">
        {([['all','Todas'],['pending','Pendientes'],['flagged','Reportadas']] as const).map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filter === k ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}>
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {isLoading ? [...Array(5)].map((_,i)=><Skeleton key={i} className="h-28"/>) :
          visible.map((review: any) => (
            <motion.div key={review.id} layout initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.97 }}
              className="card p-5">
              <div className="flex items-start gap-4">
                <Avatar src={review.patientAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.patientName}`} name={review.patientName} size="sm"/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{review.patientName}</span>
                        <span className="text-slate-400 text-xs">→</span>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">{review.doctorName}</span>
                        <Badge variant={STATUS_CFG[review.moderationStatus]?.variant || 'default'} size="sm" dot>
                          {STATUS_CFG[review.moderationStatus]?.label || review.moderationStatus}
                        </Badge>
                        {(review as any).flagged && (
                          <Badge variant="error" size="sm"><Flag className="h-3 w-3 mr-0.5"/>Reportada</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating value={review.rating}/>
                        <span className="text-xs text-slate-500">{formatRelative(review.date || review.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {review.moderationStatus !== 'approved' && (
                        <Button size="sm" variant="success"
                          onClick={() => { approveReview(review.id); toast.success('Reseña aprobada'); }}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1"/>Aprobar
                        </Button>
                      )}
                      {review.moderationStatus !== 'hidden' && (
                        <Button size="sm" variant="outline"
                          onClick={() => { hideReview(review.id); toast.success('Reseña ocultada'); }}>
                          <EyeOff className="h-3.5 w-3.5 mr-1"/>Ocultar
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300"
                        onClick={() => { if (confirm('¿Eliminar esta reseña?')) { deleteReview(review.id); toast.success('Reseña eliminada'); } }}>
                        <Trash2 className="h-3.5 w-3.5"/>
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{review.comment || review.content}</p>
                  {(review as any).flagReason && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <Flag className="h-3 w-3"/>Motivo del reporte: {(review as any).flagReason}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!isLoading && visible.length === 0 && (
          <div className="py-16 text-center text-slate-500 text-sm card">No hay reseñas en esta categoría.</div>
        )}
      </div>
    </>
  );
}
