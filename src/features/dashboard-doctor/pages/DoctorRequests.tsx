import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, AlertCircle, Clock, Calendar } from 'lucide-react';
import { useAllRequests, useResolveRequest } from '../../../shared/hooks/useDoctor';
import { useDoctorStore } from '../../../shared/stores/doctorStore';
import { PageHeader, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { Skeleton, AvatarImg } from '../../../shared/components/atoms/index';
import { cn, formatDate, formatRelative } from '../../../shared/utils';

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  reschedule: { label: 'Reprogramación', icon: <RotateCcw className="h-4 w-4" />, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' },
  cancel:     { label: 'Cancelación',    icon: <XCircle className="h-4 w-4" />,    color: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400' },
  urgent:     { label: 'Urgente',        icon: <AlertCircle className="h-4 w-4" />, color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400' },
};

export default function DoctorRequests() {
  const { data: requests, isLoading, isError, refetch } = useAllRequests();
  const resolveMutation = useResolveRequest();
  const { resolvedRequestIds, resolveRequest } = useDoctorStore();
  const [rejectTarget, setRejectTarget] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [tab, setTab] = useState<'pending' | 'resolved'>('pending');

  const allRequests = (requests || []).map((r: any) => ({
    ...r,
    status: resolvedRequestIds.includes(r.id) ? 'resolved' : r.status,
  }));
  const visible = allRequests.filter((r: any) => tab === 'pending' ? r.status === 'pending' : r.status === 'resolved');

  const handleApprove = async (req: any) => {
    await resolveMutation.mutateAsync({ id: req.id, action: 'approved' });
    resolveRequest(req.id);
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    await resolveMutation.mutateAsync({ id: rejectTarget.id, action: 'rejected', reason: rejectReason });
    resolveRequest(rejectTarget.id);
    setRejectTarget(null);
    setRejectReason('');
  };

  const pendingCount = allRequests.filter((r: any) => r.status === 'pending').length;

  return (
    <>
      <Helmet><title>Solicitudes Pendientes – Dashboard Médico</title></Helmet>
      <PageHeader title="Solicitudes de Pacientes"
        subtitle={`${pendingCount} solicitudes pendientes de respuesta`}
        breadcrumb={[{ label: 'Dashboard Médico', href: '/dashboard/doctor' }, { label: 'Solicitudes' }]} />

      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-800 rounded-xl p-1 mb-6 w-fit">
        <button onClick={() => setTab('pending')}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === 'pending' ? 'bg-primary-600 text-white' : 'text-slate-500 dark:text-slate-400')}>
          <Clock className="h-4 w-4" /> Pendientes
          {pendingCount > 0 && <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-bold', tab === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-500 text-white')}>{pendingCount}</span>}
        </button>
        <button onClick={() => setTab('resolved')}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === 'resolved' ? 'bg-primary-600 text-white' : 'text-slate-500 dark:text-slate-400')}>
          <CheckCircle2 className="h-4 w-4" /> Resueltas
        </button>
      </div>

      {isError ? <ErrorState onRetry={refetch} /> : isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : visible.length === 0 ? (
        <div className="card p-16 text-center">
          <CheckCircle2 className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <p className="font-medium text-slate-600 dark:text-slate-400">
            {tab === 'pending' ? 'Sin solicitudes pendientes' : 'Sin solicitudes resueltas'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {visible.map((req: any, i: number) => {
              const cfg = TYPE_CONFIG[req.type] || TYPE_CONFIG.reschedule;
              const resolved = req.status === 'resolved';
              return (
                <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.05 }}
                  className="card p-5">
                  <div className="flex items-start gap-4 flex-wrap">
                    <AvatarImg src={req.patientAvatar} alt={req.patientName} className="w-12 h-12 rounded-xl object-cover bg-primary-50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{req.patientName}</p>
                        <span className={cn('flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium', cfg.color)}>
                          {cfg.icon}{cfg.label}
                        </span>
                        {req.type === 'urgent' && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">URGENTE</span>}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">{req.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400"/>Cita: {formatDate(req.originalDate, 'dd MMM yyyy')} · {req.originalTime}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400"/>Hace {formatRelative(req.createdAt)}</span>
                      </div>
                    </div>

                    {!resolved ? (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleApprove(req)} disabled={resolveMutation.isPending}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50">
                          <CheckCircle2 className="h-4 w-4" /> Aprobar
                        </button>
                        <button onClick={() => setRejectTarget(req)} disabled={resolveMutation.isPending}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl transition-colors border border-red-200 dark:border-red-900">
                          <XCircle className="h-4 w-4" /> Rechazar
                        </button>
                      </div>
                    ) : (
                      <div className="shrink-0">
                        <span className={cn('flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl',
                          (req as any).resolution === 'approved'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400')}>
                          {(req as any).resolution === 'approved' ? <><CheckCircle2 className="h-4 w-4" />Aprobada</> : <><XCircle className="h-4 w-4" />Rechazada</>}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={!!rejectTarget} onClose={() => { setRejectTarget(null); setRejectReason(''); }}
        title="Rechazar solicitud" size="sm"
        footer={<>
          <button onClick={() => { setRejectTarget(null); setRejectReason(''); }} className="btn-ghost text-sm px-4 py-2">Cancelar</button>
          <button onClick={handleReject} disabled={resolveMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 text-sm">
            Confirmar rechazo
          </button>
        </>}>
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            ¿Deseas rechazar la solicitud de <strong>{rejectTarget?.patientName}</strong>?
          </p>
          <div>
            <label className="label-base">Motivo del rechazo (opcional)</label>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
              className="input-base resize-none text-sm"
              placeholder="Ej: Sin disponibilidad en esa fecha, por favor reprograma..." />
          </div>
        </div>
      </Modal>
    </>
  );
}
