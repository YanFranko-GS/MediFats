import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Pill, Download, Eye, Search, Printer } from 'lucide-react';
import { useMedications } from '../../../shared/hooks/usePatient';
import { useAuthStore } from '../../../shared/stores/authStore';
import { PageHeader, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { Skeleton } from '../../../shared/components/atoms/index';
import { cn, formatDate } from '../../../shared/utils';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  finished: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};
const STATUS_LABELS: Record<string, string> = { active: 'Activa', finished: 'Finalizada', pending: 'Pendiente' };

export default function PatientPrescriptions() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const { data: meds, isLoading, isError, refetch } = useMedications(filter === 'all' ? undefined : filter);

  const visible = (meds || []).filter((m: any) => m.name.toLowerCase().includes(q.toLowerCase()) || m.reason.toLowerCase().includes(q.toLowerCase()));

  const handleDownload = (med: any) => {
    toast.success(`Receta de ${med.name} descargada`, { description: 'Archivo PDF listo.' });
  };

  return (
    <>
      <Helmet><title>{t('patientDashboard.prescriptionsTitle')}</title></Helmet>
      <PageHeader title="Recetas Médicas" subtitle="Historial completo de tus prescripciones"
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Recetas' }]} />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-700 rounded-xl px-4 py-2.5 flex-1 min-w-[200px] max-w-sm">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar medicamento..."
            className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none flex-1" />
        </div>
        <div className="flex gap-1 bg-surface-100 dark:bg-slate-800 rounded-lg p-1">
          {[['all','Todos'],['active','Activos'],['finished','Finalizados'],['pending','Pendientes']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors', filter === v ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400')}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {isError ? <ErrorState onRetry={refetch} /> : isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
                <tr>{['Medicamento', 'Dosis / Frecuencia', t('patientDashboard.doctor'), 'Fecha inicio', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
                {visible.map((med: any, i: number) => (
                  <motion.tr key={med.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                          <Pill className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-300">{med.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[140px]">{med.reason}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400 text-xs"><p className="font-medium text-slate-700 dark:text-slate-300">{med.dose}</p><p>{med.frequency}</p></td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400 text-xs">{med.doctorName}<br/><span className="text-primary-500">{med.doctorSpecialty}</span></td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{formatDate(med.startDate, 'dd MMM yyyy')}</td>
                    <td className="px-5 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[med.status])}>{STATUS_LABELS[med.status]}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelected(med)} title="Ver detalle" className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleDownload(med)} title={t('patientDashboard.downloadPdf')} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><Download className="h-4 w-4" /></button>
                        <button onClick={() => { setSelected(med); toast.info('Enviando a impresora…'); }} title="Imprimir" className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><Printer className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {visible.length === 0 && <div className="py-12 text-center text-slate-400 text-sm">{t('patientDashboard.noPrescriptions')}</div>}
          </div>
        </div>
      )}

      {/* Prescription detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Detalle de Receta" size="md"
        footer={<>
          <button onClick={() => handleDownload(selected)} className="btn-outline text-sm flex items-center gap-2"><Download className="h-4 w-4" />{t('patientDashboard.downloadPdf')}</button>
          <button onClick={() => setSelected(null)} className="btn-ghost text-sm">{t('patientDashboard.close')}</button>
        </>}>
        {selected && (
          <div className="border-2 border-dashed border-surface-200 dark:border-slate-700 rounded-xl p-5 bg-surface-50 dark:bg-slate-800/30">
            <div className="text-center border-b border-surface-200 dark:border-slate-700 pb-4 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <p className="font-heading font-bold text-primary-600">SmartSalud</p>
              <p className="text-xs text-slate-400">{t('patientDashboard.digitalPrescription')}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div><p className="text-xs text-slate-400">{t('patientDashboard.doctor')}</p><p className="font-medium text-slate-700 dark:text-slate-300">{selected.doctorName}</p></div>
              <div><p className="text-xs text-slate-400">{t('patientDashboard.specialty')}</p><p className="font-medium text-slate-700 dark:text-slate-300">{selected.doctorSpecialty}</p></div>
              <div><p className="text-xs text-slate-400">{t('patientDashboard.patient')}</p><p className="font-medium text-slate-700 dark:text-slate-300">{user?.name}</p></div>
              <div><p className="text-xs text-slate-400">{t('patientDashboard.date')}</p><p className="font-medium text-slate-700 dark:text-slate-300">{formatDate(selected.startDate, 'dd/MM/yyyy')}</p></div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 mb-3">
              <p className="text-xs text-slate-400 mb-2">{t('patientDashboard.prescribedMedication')}</p>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{selected.name} <span className="text-primary-600">{selected.dose}</span></p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selected.frequency}</p>
              <p className="text-sm text-slate-500 mt-2 italic">{selected.instructions}</p>
            </div>
            <div className="text-xs text-center text-slate-400">Diagnóstico: {selected.reason} · {selected.refills} recarga(s) disponible(s)</div>
          </div>
        )}
      </Modal>
    </>
  );
}
