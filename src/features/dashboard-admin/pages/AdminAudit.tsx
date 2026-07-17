import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Eye } from 'lucide-react';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Badge, Skeleton } from '../../../shared/components/atoms/index';
import { useAuditLogs } from '../hooks/useAdminMaster';
import type { AuditLog } from '../../../data/auditLogs';
import { formatDate, cn } from '../../../shared/utils';

const SEVERITY_CFG: Record<string, { label: string; variant: any; dot?: boolean }> = {
  low:      { label: 'Baja',     variant: 'default' },
  medium:   { label: 'Media',    variant: 'warning', dot: true },
  high:     { label: 'Alta',     variant: 'error',   dot: true },
  critical: { label: 'Crítica',  variant: 'error',   dot: true },
};

const ACTION_LABELS: Record<string, string> = {
  'user.created':'Usuario creado','user.updated':'Usuario editado','user.deleted':'Usuario eliminado',
  'user.suspended':'Usuario suspendido','user.activated':'Usuario activado','user.role_changed':'Rol cambiado',
  'user.impersonated':'Impersonación','user.password_reset':'Reset contraseña',
  'doctor.approved':'Médico aprobado','doctor.rejected':'Médico rechazado',
  'doctor.suspended':'Médico suspendido','doctor.reactivated':'Médico reactivado',
  'appointment.cancelled':'Cita cancelada','appointment.rescheduled':'Cita reprogramada',
  'appointment.completed':'Cita completada','finance.payout_marked':'Pago realizado',
  'review.approved':'Reseña aprobada','review.hidden':'Reseña ocultada','review.deleted':'Reseña eliminada',
  'settings.updated':'Config actualizada','role.permissions_updated':'Permisos modificados',
  'report.exported':'Reporte exportado','security.user_blocked':'Usuario bloqueado',
};

function DetailModal({ log, onClose }: { log: AuditLog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Detalle de auditoría</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 text-slate-400"><X className="h-4 w-4"/></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={SEVERITY_CFG[log.severity]?.variant||'default'} size="sm" dot={SEVERITY_CFG[log.severity]?.dot}>
              {SEVERITY_CFG[log.severity]?.label || log.severity}
            </Badge>
            <Badge variant="outline" size="sm">{ACTION_LABELS[log.action] || log.action}</Badge>
          </div>
          {[
            ['Descripción', log.description],
            ['Administrador', log.adminName],
            ['Objetivo', `${log.targetName} (${log.targetType})`],
            ['IP', log.ip],
            ['Fecha', formatDate(log.timestamp)],
          ].map(([k,v]) => (
            <div key={k} className="flex justify-between text-sm py-1.5 border-b border-surface-100 dark:border-slate-800 last:border-0">
              <span className="text-slate-500 shrink-0 mr-4">{k}</span>
              <span className="font-medium text-slate-800 dark:text-slate-100 text-right">{v}</span>
            </div>
          ))}
          {Object.keys(log.details).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Detalles adicionales</p>
              <div className="bg-surface-50 dark:bg-slate-800/60 rounded-xl p-3 space-y-1">
                {Object.entries(log.details).map(([k,v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-slate-500 capitalize">{k}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminAudit() {
  const { data: logs = [], isLoading } = useAuditLogs();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [selected, setSelected] = useState<AuditLog | null>(null);
  const [page, setPage] = useState(1);
  const PAGE = 20;

  const actionGroups = useMemo(() => {
    const groups: Record<string,string> = {
      'user.':'Usuarios','doctor.':'Médicos','appointment.':'Citas',
      'finance.':'Finanzas','review.':'Reseñas','settings.':'Sistema',
      'role.':'Roles','report.':'Reportes','security.':'Seguridad',
    };
    return groups;
  }, []);

  const filtered = useMemo(() => logs.filter(l =>
    (severityFilter === 'all' || l.severity === severityFilter) &&
    (actionFilter === 'all' || l.action.startsWith(actionFilter)) &&
    (l.description.toLowerCase().includes(search.toLowerCase()) ||
     l.adminName.toLowerCase().includes(search.toLowerCase()) ||
     l.targetName.toLowerCase().includes(search.toLowerCase()))
  ), [logs, search, severityFilter, actionFilter]);

  const pages = Math.ceil(filtered.length / PAGE);
  const visible = filtered.slice((page-1)*PAGE, page*PAGE);

  return (
    <>
      <Helmet><title>Auditoría – Admin</title></Helmet>
      <PageHeader title="Registro de Auditoría" subtitle={`${logs.length} eventos registrados`}
        breadcrumb={[{label:'Admin'},{label:'Auditoría'}]}/>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-surface-200 dark:border-slate-800 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Buscar por descripción, admin o afectado…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"/>
          </div>
          <select value={severityFilter} onChange={e=>{setSeverityFilter(e.target.value);setPage(1);}}
            className="px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
            <option value="all">Toda severidad</option>
            {['low','medium','high','critical'].map(s=><option key={s} value={s}>{SEVERITY_CFG[s].label}</option>)}
          </select>
          <select value={actionFilter} onChange={e=>{setActionFilter(e.target.value);setPage(1);}}
            className="px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
            <option value="all">Todas las categorías</option>
            {Object.entries(actionGroups).map(([k,v])=><option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
              <tr>
                {['Acción','Descripción','Administrador','Afectado','IP','Fecha','Severidad',''].map(h=>(
                  <th key={h} className={cn('text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide',
                    ['Administrador','IP'].includes(h)&&'hidden md:table-cell',
                    ['Afectado'].includes(h)&&'hidden lg:table-cell',
                    !h&&'text-right')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
              {isLoading ? [...Array(10)].map((_,i)=>(
                <tr key={i}><td colSpan={8} className="px-4 py-3"><Skeleton className="h-6"/></td></tr>
              )) : visible.map(log => (
                <tr key={log.id} className="hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer" onClick={()=>setSelected(log)}>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono bg-surface-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-xs">
                    <p className="truncate text-xs">{log.description}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs hidden md:table-cell">{log.adminName}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs hidden lg:table-cell">{log.targetName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 hidden md:table-cell">{log.ip}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{formatDate(log.timestamp)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={SEVERITY_CFG[log.severity]?.variant||'default'} size="sm" dot={SEVERITY_CFG[log.severity]?.dot}>
                      {SEVERITY_CFG[log.severity]?.label||log.severity}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-all">
                      <Eye className="h-3.5 w-3.5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <div className="py-16 text-center text-slate-500 text-sm">No se encontraron registros con los filtros aplicados.</div>
          )}
        </div>
        {pages > 1 && (
          <div className="px-4 py-3 border-t border-surface-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Mostrando {visible.length} de {filtered.length} registros</span>
            <div className="flex gap-1">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-slate-700 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-slate-800">Anterior</button>
              <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-slate-700 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-slate-800">Siguiente</button>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>{selected && <DetailModal log={selected} onClose={()=>setSelected(null)}/>}</AnimatePresence>
    </>
  );
}
