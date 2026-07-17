import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Eye, Download, AlertCircle, Search, CheckCircle2, Clock } from 'lucide-react';
import { useMedicalResults } from '../../../shared/hooks/usePatient';
import { PageHeader, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { Skeleton, Badge } from '../../../shared/components/atoms/index';
import { cn, formatDate } from '../../../shared/utils';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  available: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: 'Disponible' },
  pending: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: <Clock className="h-3.5 w-3.5" />, label: 'Pendiente' },
  processing: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Clock className="h-3.5 w-3.5" />, label: 'Procesando' },
};
const CATEGORIES = ['all', 'Laboratorio', 'Imagen', 'Cardiología', 'Neumología'];

export default function PatientResults() {
  const { t } = useTranslation();
  const [category, setCategory] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const { data: results, isLoading, isError, refetch } = useMedicalResults(category === 'all' ? undefined : category);

  const visible = (results || []).filter((r: any) => r.type.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <Helmet><title>{t('patientDashboard.resultsTitle')}</title></Helmet>
      <PageHeader title="Resultados Médicos" subtitle="Accede a tus estudios y análisis"
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Resultados' }]} />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-700 rounded-xl px-4 py-2.5 flex-1 min-w-[200px] max-w-sm">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar resultado..."
            className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none flex-1" />
        </div>
        <div className="flex gap-1 bg-surface-100 dark:bg-slate-800 rounded-lg p-1 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors', category === c ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400')}>
              {c === 'all' ? 'Todos' : c}
            </button>
          ))}
        </div>
      </div>

      {isError ? <ErrorState onRetry={refetch} /> : isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36" />)}</div>
      ) : visible.length === 0 ? (
        <div className="card p-16 text-center"><FlaskConical className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" /><p className="text-slate-400 text-sm">{t('patientDashboard.noResults')}</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {visible.map((res: any, i: number) => {
              const cfg = STATUS_CONFIG[res.status] || STATUS_CONFIG.pending;
              return (
                <motion.div key={res.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="card p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        res.category === 'Laboratorio' ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' :
                        res.category === 'Imagen' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600' :
                        'bg-teal-50 dark:bg-teal-950/30 text-teal-600')}>
                        <FlaskConical className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{res.type}</p>
                        <p className="text-xs text-slate-400">{res.category}</p>
                      </div>
                    </div>
                    {res.urgent && <span className="text-xs bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><AlertCircle className="h-3 w-3" />{t('patientDashboard.urgent')}</span>}
                  </div>
                  <div className="text-xs text-slate-400">{res.doctorName} · {formatDate(res.date, 'dd MMM yyyy')}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-slate-800">
                    <span className={cn('flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', cfg.color)}>{cfg.icon}{cfg.label}</span>
                    {res.status === 'available' && (
                      <div className="flex gap-1.5">
                        <button onClick={() => setSelected(res)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => toast.success('Resultado descargado')} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><Download className="h-4 w-4" /></button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Resultado Médico" size="lg"
        footer={<>
          <button onClick={() => toast.success('Descargado')} className="btn-outline text-sm flex items-center gap-2"><Download className="h-4 w-4" />{t('patientDashboard.download')}</button>
          <button onClick={() => setSelected(null)} className="btn-ghost text-sm">{t('patientDashboard.close')}</button>
        </>}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-surface-50 dark:bg-slate-800 rounded-lg p-3"><p className="text-xs text-slate-400 mb-1">{t('patientDashboard.study')}</p><p className="font-semibold text-slate-700 dark:text-slate-300">{selected.type}</p></div>
              <div className="bg-surface-50 dark:bg-slate-800 rounded-lg p-3"><p className="text-xs text-slate-400 mb-1">{t('patientDashboard.category')}</p><p className="font-semibold text-slate-700 dark:text-slate-300">{selected.category}</p></div>
              <div className="bg-surface-50 dark:bg-slate-800 rounded-lg p-3"><p className="text-xs text-slate-400 mb-1">{t('patientDashboard.requestingDoctor')}</p><p className="font-semibold text-slate-700 dark:text-slate-300">{selected.doctorName}</p></div>
              <div className="bg-surface-50 dark:bg-slate-800 rounded-lg p-3"><p className="text-xs text-slate-400 mb-1">{t('patientDashboard.date')}</p><p className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(selected.date, 'dd/MM/yyyy')}</p></div>
            </div>
            <div className="bg-surface-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('patientDashboard.reportSummary')}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selected.summary}</p>
            </div>
            <div className="bg-primary-50 dark:bg-primary-950/20 rounded-xl overflow-hidden flex items-center justify-center h-40 border-2 border-dashed border-primary-200 dark:border-primary-900">
              <div className="text-center text-primary-400">
                <FlaskConical className="h-10 w-10 mx-auto mb-2" />
                <p className="text-xs">Informe PDF simulado · {selected.type}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
