import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, X, Eye, XCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { PageHeader, KpiCard } from '../../../shared/components/molecules/StatusComponents';
import { Badge } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { APPOINTMENTS } from '../../../data/appointments';
import { formatDate, formatCurrency, cn } from '../../../shared/utils';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../../../shared/services/appointmentService';

interface Props { filter?: string; view?: string; }

const STATUS_CFG: Record<string,{label:string;variant:any}> = {
  pending_approval: { label:'Pago Pendiente', variant:'warning' },
  scheduled:  { label:'Programada', variant:'primary' },
  completed:  { label:'Completada', variant:'success' },
  cancelled:  { label:'Cancelada',  variant:'error' },
  'no-show':  { label:'No asistió', variant:'warning' },
  rescheduled:{ label:'Reprogramada',variant:'secondary' },
};

function AppointmentModal({ appt, onClose, onApprove }: { appt: any; onClose: () => void; onApprove: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Detalle de cita #{appt.id?.slice(-4)}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 text-slate-400"><X className="h-4 w-4"/></button>
        </div>
        <div className="p-5 space-y-3">
          {[
            ['Paciente', appt.patientName], ['Médico', appt.doctorName], ['Especialidad', appt.doctorSpecialty || appt.specialty],
            ['Fecha', formatDate(appt.date)], ['Hora', appt.time], ['Modalidad', appt.type === 'online' || appt.mode === 'video' ? 'Teleconsulta' : 'Presencial'],
            ['Método de Pago', appt.paymentMethod === 'card' ? 'Tarjeta' : appt.paymentMethod === 'yape' ? 'Yape / Plin' : appt.paymentMethod === 'transfer' ? 'Transferencia Bancaria' : 'N/A'],
            ['Monto', formatCurrency(appt.price)], ['Estado', STATUS_CFG[appt.status]?.label || appt.status],
          ].map(([k,v]) => (
            <div key={k} className="flex justify-between text-sm py-1.5 border-b border-surface-100 dark:border-slate-800 last:border-0">
              <span className="text-slate-500">{k}</span>
              <span className="font-medium text-slate-800 dark:text-slate-100">{v}</span>
            </div>
          ))}
          {appt.paymentVoucherUrl && (
            <div className="flex justify-between text-sm py-1.5 border-b border-surface-100 dark:border-slate-800 last:border-0">
              <span className="text-slate-500">Comprobante</span>
              <a href="#" onClick={e=>e.preventDefault()} className="font-medium text-primary-600 underline">{appt.paymentVoucherUrl}</a>
            </div>
          )}
        </div>
        <div className="p-5 border-t border-surface-200 dark:border-slate-800 flex gap-2 justify-end">
          {appt.status === 'pending_approval' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white border-green-600" onClick={onApprove}>
              <CheckCircle className="h-3.5 w-3.5 mr-1"/> Se procede el pago
            </Button>
          )}
          {appt.status !== 'pending_approval' && (
            <Button size="sm" variant="outline" onClick={() => { toast.success('Cita reprogramada'); onClose(); }}>
              <RotateCcw className="h-3.5 w-3.5 mr-1"/>Reprogramar
            </Button>
          )}
          {(appt.status === 'scheduled' || appt.status === 'pending_approval') && (
            <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => { toast.success('Cita cancelada'); onClose(); }}>
              <XCircle className="h-3.5 w-3.5 mr-1"/>Cancelar
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminAppointments({ filter, view }: Props) {
  const queryClient = useQueryClient();
  const { data: result, isLoading } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: () => appointmentService.getAll(1, 1000)
  });
  
  const ALL = result?.items || [];

  const [q, setQ] = useState('');
  const [status, setStatus] = useState(filter || 'all');
  const [specialty, setSpecialty] = useState('all');
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const PAGE = 15;

  const approvePayment = useMutation({
    mutationFn: (id: string) => appointmentService.approvePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      toast.success('Pago aprobado. Cita programada oficialmente.');
      setSelected(null);
    }
  });

  const specialties = useMemo(() => [...new Set(ALL.map((a:any) => a.doctorSpecialty || a.specialty).filter(Boolean))].sort(), [ALL]);

  const filtered = useMemo(() => ALL.filter((a:any) =>
    (status === 'all' || a.status === status) &&
    (specialty === 'all' || (a.doctorSpecialty || a.specialty) === specialty) &&
    (a.patientName?.toLowerCase().includes(q.toLowerCase()) || a.doctorName?.toLowerCase().includes(q.toLowerCase()))
  ), [q, status, specialty, ALL]);

  const pages = Math.ceil(filtered.length / PAGE);
  const visible = filtered.slice((page-1)*PAGE, page*PAGE);

  const stats = useMemo(() => ({
    total: ALL.length,
    scheduled: ALL.filter((a:any)=>a.status==='scheduled').length,
    completed: ALL.filter((a:any)=>a.status==='completed').length,
    cancelled: ALL.filter((a:any)=>a.status==='cancelled').length,
  }), [ALL]);

  const titleMap: Record<string,string> = { rescheduled:'Reprogramaciones', cancelled:'Cancelaciones', agenda:'Agenda Global' };
  const title = view ? 'Agenda Global' : filter ? (titleMap[filter] || 'Gestión de Citas') : 'Gestión de Citas';

  return (
    <>
      <Helmet><title>{title} – Admin</title></Helmet>
      <PageHeader title={title} subtitle={`${filtered.length} citas encontradas`}
        breadcrumb={[{label:'Admin'},{label:'Citas'},{label:title}]} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total citas" value={stats.total} icon={<Calendar className="h-5 w-5"/>} />
        <KpiCard title="Programadas" value={stats.scheduled} icon={<Calendar className="h-5 w-5"/>} iconColor="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" />
        <KpiCard title="Completadas" value={stats.completed} icon={<CheckCircle className="h-5 w-5"/>} iconColor="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" />
        <KpiCard title="Canceladas" value={stats.cancelled} icon={<XCircle className="h-5 w-5"/>} iconColor="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400" />
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-surface-200 dark:border-slate-800 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
            <input value={q} onChange={e=>{setQ(e.target.value);setPage(1);}} placeholder="Buscar paciente o médico…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"/>
          </div>
          <select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}
            className="px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={specialty} onChange={e=>{setSpecialty(e.target.value);setPage(1);}}
            className="px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
            <option value="all">Todas las especialidades</option>
            {specialties.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
              <tr>
                {['ID','Paciente','Médico','Especialidad','Fecha','Estado','Monto',''].map(h=>(
                  <th key={h} className={cn('text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide',!h&&'text-right',['Especialidad','Monto'].includes(h)&&'hidden lg:table-cell',h==='Médico'&&'hidden md:table-cell')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
              {visible.map((a:any) => (
                <motion.tr key={a.id} initial={{opacity:0}} animate={{opacity:1}}
                  className="hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer" onClick={()=>setSelected(a)}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">#{a.id?.slice(-4)}</td>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{a.patientName}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden md:table-cell">{a.doctorName}</td>
                  <td className="px-4 py-3 hidden lg:table-cell"><Badge variant="outline" size="sm">{a.doctorSpecialty || a.specialty}</Badge></td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">{formatDate(a.date)} {a.time}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_CFG[a.status]?.variant||'default'} size="sm" dot>{STATUS_CFG[a.status]?.label||a.status}</Badge></td>
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300 hidden lg:table-cell">{formatCurrency(a.price)}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-all"><Eye className="h-3.5 w-3.5"/></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-16 text-center text-slate-500 text-sm">No se encontraron citas.</div>}
        </div>
        {pages > 1 && (
          <div className="px-4 py-3 border-t border-surface-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Página {page} de {pages}</span>
            <div className="flex gap-1">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-slate-700 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-slate-800">Anterior</button>
              <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-slate-700 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-slate-800">Siguiente</button>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>{selected && <AppointmentModal appt={selected} onClose={()=>setSelected(null)} onApprove={() => approvePayment.mutate(selected.id)} />}</AnimatePresence>
    </>
  );
}
