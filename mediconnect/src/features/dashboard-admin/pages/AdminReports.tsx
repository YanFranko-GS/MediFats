import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Badge, Skeleton } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { useReportDefinitions, useScheduledReports } from '../hooks/useAdminMaster';
import { formatDate, cn } from '../../../shared/utils';
import { toast } from 'sonner';

const CAT_COLORS: Record<string, string> = {
  finance:'blue', doctors:'teal', patients:'green', appointments:'purple', reviews:'amber',
};
const CAT_LABELS: Record<string, string> = {
  finance:'Finanzas', doctors:'Médicos', patients:'Pacientes', appointments:'Citas', reviews:'Reseñas',
};
const FORMAT_ICONS: Record<string, string> = { PDF:'PDF', Excel:'Excel', CSV:'CSV' };
const FREQ_LABELS: Record<string, string> = { weekly:'Semanal', monthly:'Mensual', quarterly:'Trimestral', annual:'Anual' };

function generateReport(name: string, format: string) {
  toast.loading(`Generando ${name} en ${format}…`, { id:'rpt' });
  setTimeout(() => toast.success(`✅ ${name} listo para descarga`, { id:'rpt', duration:3000 }), 2000);
}

export default function AdminReports() {
  const { data: reports = [], isLoading: l1 } = useReportDefinitions();
  const { data: scheduled = [], isLoading: l2 } = useScheduledReports();
  const [catFilter, setCatFilter] = useState('all');
  const [tab, setTab] = useState<'generate'|'scheduled'>('generate');

  const filtered = catFilter === 'all' ? reports : reports.filter(r => r.category === catFilter);

  return (
    <>
      <Helmet><title>Reportes – Admin</title></Helmet>
      <PageHeader title="Reportes Empresariales" subtitle="Generación y programación de reportes"
        breadcrumb={[{label:'Admin'},{label:'Reportes'}]}/>

      <div className="flex gap-1 p-1 bg-surface-100 dark:bg-slate-800 rounded-xl w-fit mb-5">
        {([['generate','Generar reportes'],['scheduled','Reportes programados']] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab===k?'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm':'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'generate' && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {[['all','Todos'],['finance','Finanzas'],['doctors','Médicos'],['patients','Pacientes'],['appointments','Citas'],['reviews','Reseñas']].map(([k,l])=>(
              <button key={k} onClick={()=>setCatFilter(k)}
                className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                  catFilter===k ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-surface-200 dark:border-slate-700 hover:border-primary-400')}>
                {l}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {l1 ? [...Array(6)].map((_,i)=><Skeleton key={i} className="h-40"/>) :
            filtered.map(rep => (
              <motion.div key={rep.id} layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-lg',
                    `bg-${CAT_COLORS[rep.category]||'blue'}-50 dark:bg-${CAT_COLORS[rep.category]||'blue'}-950/20`)}>
                    <FileText className={cn('h-4 w-4', `text-${CAT_COLORS[rep.category]||'blue'}-600`)}/>
                  </div>
                  <Badge variant="outline" size="sm">{CAT_LABELS[rep.category]||rep.category}</Badge>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{rep.name}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{rep.description}</p>
                {rep.lastGenerated && (
                  <p className="text-xs text-slate-400 mb-3">Última generación: {formatDate(rep.lastGenerated)}</p>
                )}
                <div className="flex gap-1.5 flex-wrap">
                  {rep.availableFormats.map(fmt => (
                    <Button key={fmt} size="sm" variant="outline" onClick={() => generateReport(rep.name, fmt)}
                      className="text-xs">
                      {fmt}
                    </Button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {tab === 'scheduled' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={()=>toast.success('Modal de nuevo reporte programado (simulado)')}>
              <Plus className="h-4 w-4 mr-1.5"/>Programar reporte
            </Button>
          </div>
          {l2 ? [...Array(3)].map((_,i)=><Skeleton key={i} className="h-20"/>) :
          scheduled.map(s => (
            <div key={s.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/20 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5 text-primary-600"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{s.reportName}</p>
                  <Badge variant={s.active?'success':'default'} size="sm" dot>{s.active?'Activo':'Pausado'}</Badge>
                  <Badge variant="outline" size="sm">{FREQ_LABELS[s.frequency]}</Badge>
                  <Badge variant="outline" size="sm">{s.format}</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Destinatarios: {s.recipients.join(', ')} · Próximo envío: {formatDate(s.nextRun)}
                </p>
              </div>
              <button onClick={()=>toast.success('Reporte programado eliminado')}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 shrink-0">
                <Trash2 className="h-4 w-4"/>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
