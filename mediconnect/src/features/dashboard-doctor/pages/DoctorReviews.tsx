import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { useDoctorReviews } from '../../../shared/hooks/useDoctors';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { Skeleton } from '../../../shared/components/atoms/index';
import { formatRelative, cn } from '../../../shared/utils';
import { toast } from 'sonner';

export default function DoctorReviews() {
  const { data: reviewData, isLoading } = useDoctorReviews('doc-001', 1);
  const reviews = (reviewData as any)?.data?.data ?? (reviewData as any)?.data ?? [];
  const [replyTarget, setReplyTarget] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Record<string, string>>({});

  const avg = reviews.length
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0';
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r: any) => { dist[r.rating] = (dist[r.rating] || 0) + 1; });

  const handleSaveReply = () => {
    if (!replyText.trim()) { toast.error('Escribe una respuesta'); return; }
    setReplies(prev => ({ ...prev, [replyTarget.id]: replyText }));
    toast.success('Respuesta publicada');
    setReplyTarget(null);
    setReplyText('');
  };

  return (
    <>
      <Helmet><title>Mis Reseñas – Dashboard Médico</title></Helmet>
      <PageHeader title="Mis Reseñas" subtitle="Lo que dicen tus pacientes"
        breadcrumb={[{ label: 'Dashboard Médico', href: '/dashboard/doctor' }, { label: 'Reseñas' }]} />

      <div className="grid lg:grid-cols-4 gap-5 mb-6">
        {/* Rating summary */}
        <div className="card p-6 text-center">
          <p className="text-6xl font-bold font-data text-amber-500 mb-2">{avg}</p>
          <div className="flex justify-center gap-0.5 mb-2">
            {[1,2,3,4,5].map(i => <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn('h-5 w-5', i <= Math.round(Number(avg)) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-200 dark:text-slate-700')} stroke="currentColor" strokeWidth={1.5}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
          </div>
          <p className="text-sm text-slate-400 mb-4">{reviews.length} reseñas verificadas</p>
          <div className="space-y-1.5">
            {[5,4,3,2,1].map(r => (
              <div key={r} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-3">{r}</span>
                <div className="flex-1 h-1.5 bg-surface-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full"
                    style={{ width: reviews.length ? `${(dist[r] / reviews.length) * 100}%` : '0%' }} />
                </div>
                <span className="text-xs text-slate-400 w-5">{dist[r]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats cards */}
        <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4 content-start">
          {[
            { label: 'Reseñas 5 estrellas', value: dist[5], pct: reviews.length ? ((dist[5]/reviews.length)*100).toFixed(0) : 0, color: 'text-green-600' },
            { label: 'Reseñas positivas (≥4)', value: (dist[5]||0)+(dist[4]||0), pct: reviews.length ? (((dist[5]+dist[4])/reviews.length)*100).toFixed(0) : 0, color: 'text-primary-600' },
            { label: 'Requieren atención (≤2)', value: (dist[2]||0)+(dist[1]||0), pct: reviews.length ? (((dist[2]+dist[1])/reviews.length)*100).toFixed(0) : 0, color: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="card p-5 text-center">
              <p className={cn('text-3xl font-bold font-data', s.color)}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{s.pct}% del total</p>
            </div>
          ))}
          <div className="sm:col-span-3 card p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900">
            <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <ThumbsUp className="h-3.5 w-3.5 shrink-0" />
              Consejo: responder a las reseñas aumenta la confianza de futuros pacientes. Las respuestas aparecen en tu perfil público.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="card divide-y divide-surface-100 dark:divide-slate-800 overflow-hidden">
        {isLoading ? (
          [...Array(4)].map((_, i) => <div key={i} className="p-5"><Skeleton className="h-24" /></div>)
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center">
            <Star className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Sin reseñas aún</p>
          </div>
        ) : (
          reviews.map((r: any, i: number) => (
            <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="p-5">
              <div className="flex items-start gap-4">
                <img src={r.patientAvatar} alt={r.patientName} className="w-10 h-10 rounded-full object-cover bg-primary-50 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{r.patientName}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1,2,3,4,5].map(j => <svg key={j} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn('h-3.5 w-3.5', j <= r.rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-200 dark:text-slate-700')} stroke="currentColor" strokeWidth={1.5}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                        <span className="text-xs text-slate-400 ml-1">{formatRelative(r.createdAt)}</span>
                      </div>
                    </div>
                    {!replies[r.id] && (
                      <button onClick={() => { setReplyTarget(r); setReplyText(''); }}
                        className="flex items-center gap-1.5 text-xs text-primary-600 font-medium hover:bg-primary-50 dark:hover:bg-primary-950/20 px-3 py-1.5 rounded-lg transition-colors border border-primary-200 dark:border-primary-900 shrink-0">
                        <MessageSquare className="h-3.5 w-3.5" /> Responder
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">"{r.comment}"</p>
                  {replies[r.id] && (
                    <div className="mt-3 p-3 bg-primary-50 dark:bg-primary-950/20 rounded-xl border-l-2 border-primary-400">
                      <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 mb-1">Tu respuesta:</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{replies[r.id]}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal isOpen={!!replyTarget} onClose={() => { setReplyTarget(null); setReplyText(''); }}
        title="Responder reseña" size="sm"
        footer={<>
          <button onClick={() => { setReplyTarget(null); setReplyText(''); }} className="btn-ghost text-sm px-4 py-2">Cancelar</button>
          <button onClick={handleSaveReply} className="btn-primary text-sm px-4 py-2">Publicar respuesta</button>
        </>}>
        {replyTarget && (
          <div className="space-y-4">
            <div className="p-3 bg-surface-50 dark:bg-slate-800 rounded-xl">
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map(j => <svg key={j} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn('h-3.5 w-3.5', j <= replyTarget.rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-200')} stroke="currentColor" strokeWidth={1.5}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{replyTarget.comment}"</p>
              <p className="text-xs text-slate-400 mt-1">— {replyTarget.patientName}</p>
            </div>
            <div>
              <label className="label-base">Tu respuesta pública</label>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4}
                className="input-base resize-none text-sm"
                placeholder="Agradece al paciente y responde con profesionalismo..." />
              <p className="text-xs text-slate-400 mt-1">Esta respuesta será visible en tu perfil público.</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
