import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, Plus, Eye, X, AlertCircle, Search } from 'lucide-react';
import { useDoctorOrders, useCreateOrder, useCancelOrder } from '../../../shared/hooks/useDoctor';
import { useDoctorPatients } from '../../../shared/hooks/useDoctor';
import { DOCTOR_ID } from '../../../shared/hooks/useDoctor';
import { PageHeader, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { Skeleton, AvatarImg } from '../../../shared/components/atoms/index';
import { cn, formatDate } from '../../../shared/utils';
import { toast } from 'sonner';

const STUDIES = ['Hemograma completo','Perfil lipídico','Glucosa en ayunas','Función renal','Función hepática','Radiografía de tórax','Ecografía abdominal','Resonancia magnética','Tomografía','Electrocardiograma','Espirometría','Urocultivo'];
const TYPES = [['laboratory','Laboratorio'],['imaging','Imagen'],['cardiology','Cardiología'],['pulmonology','Neumología']];
const STATUS_TABS = ['all','pending','processing','completed','cancelled'];
const STATUS_LABELS: Record<string,string> = { all:'Todas',pending:'Pendiente',processing:'En proceso',completed:'Completada',cancelled:'Cancelada' };
const STATUS_COLORS: Record<string,string> = {
  pending:'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  processing:'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed:'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled:'bg-slate-100 text-slate-500 dark:bg-slate-800',
};

export default function DoctorOrders() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ patientId:'',type:'laboratory',study:'',priority:'normal',indications:'',notes:'' });

  // Arriving from a consultation's "Crear orden médica" quick action: open
  // the form pre-filled with that patient instead of making the doctor pick again.
  useEffect(() => {
    const patientId = searchParams.get('patient');
    if (patientId) {
      setForm(f => ({ ...f, patientId }));
      setShowForm(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { data: orders, isLoading, isError, refetch } = useDoctorOrders(tab==='all'?undefined:tab);
  const { data: patients } = useDoctorPatients();
  const createOrder = useCreateOrder();
  const cancelOrder = useCancelOrder();

  const visible = (orders||[]).filter((o:any)=>o.patientName?.toLowerCase().includes(q.toLowerCase())||o.study?.toLowerCase().includes(q.toLowerCase()));

  const handleCreate = async () => {
    if (!form.patientId||!form.study) { toast.error('Completa los campos requeridos'); return; }
    const patient = (patients as unknown as any[]||[]).find(p=>p.id===form.patientId);
    await createOrder.mutateAsync({ ...form, doctorId:DOCTOR_ID, patientName:patient?.name||'', patientAvatar:patient?.avatar||'' });
    setForm({patientId:'',type:'laboratory',study:'',priority:'normal',indications:'',notes:''});
    setShowForm(false);
  };

  return (
    <>
      <Helmet><title>Órdenes Médicas – Dashboard Médico</title></Helmet>
      <PageHeader title="Órdenes Médicas" subtitle={`${(orders||[]).length} órdenes en el sistema`}
        action={<button onClick={()=>setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus className="h-4 w-4"/>Nueva orden</button>}
        breadcrumb={[{label:'Dashboard Médico',href:'/dashboard/doctor'},{label:'Órdenes'}]} />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-700 rounded-xl px-4 py-2.5 flex-1 min-w-[200px] max-w-sm">
          <Search className="h-4 w-4 text-slate-400 shrink-0"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar orden..." className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none flex-1"/>
        </div>
        <div className="flex gap-1 bg-surface-100 dark:bg-slate-800 rounded-lg p-1 flex-wrap">
          {STATUS_TABS.map(s=>(
            <button key={s} onClick={()=>setTab(s)}
              className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize',
                tab===s?'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm':'text-slate-500 dark:text-slate-400')}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {isError?<ErrorState onRetry={refetch}/>:isLoading?(
        <div className="space-y-2">{[...Array(5)].map((_,i)=><Skeleton key={i} className="h-16"/>)}</div>
      ):(
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
                <tr>{['Paciente','Estudio','Tipo','Prioridad','Estado','Fecha','Acciones'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
                {visible.map((o:any,i:number)=>(
                  <motion.tr key={o.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                    className="hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {o.patientAvatar&&<AvatarImg src={o.patientAvatar} alt={o.patientName} className="w-7 h-7 rounded-full object-cover bg-primary-50 shrink-0"/>}
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{o.patientName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs font-medium">{o.study}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs capitalize">{o.type}</td>
                    <td className="px-4 py-3">
                      {o.priority==='urgent'
                        ?<span className="flex items-center gap-1 text-xs text-red-600 font-medium"><AlertCircle className="h-3.5 w-3.5"/>Urgente</span>
                        :<span className="text-xs text-slate-400">Normal</span>}
                    </td>
                    <td className="px-4 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full font-medium',STATUS_COLORS[o.status]||STATUS_COLORS.pending)}>{STATUS_LABELS[o.status]||o.status}</span></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(o.createdAt,'dd/MM/yy')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button title="Ver orden" onClick={()=>toast.info(`Orden: ${o.study}`)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><Eye className="h-4 w-4"/></button>
                        {o.status==='pending'&&<button title="Cancelar" onClick={()=>cancelOrder.mutate(o.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-colors"><X className="h-4 w-4"/></button>}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {visible.length===0&&<div className="py-12 text-center text-slate-400 text-sm">No se encontraron órdenes</div>}
          </div>
        </div>
      )}

      <Modal isOpen={showForm} onClose={()=>setShowForm(false)} title="Nueva Orden Médica" size="md"
        footer={<><button onClick={()=>setShowForm(false)} className="btn-ghost text-sm px-4 py-2">Cancelar</button><button onClick={handleCreate} disabled={createOrder.isPending} className="btn-primary text-sm px-4 py-2">{createOrder.isPending?'Creando…':'Crear orden'}</button></>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label-base">Paciente *</label>
            <select value={form.patientId} onChange={e=>setForm(f=>({...f,patientId:e.target.value}))} className="input-base">
              <option value="">Seleccionar paciente...</option>
              {(patients as unknown as any[]||[]).map((p:any)=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Tipo de estudio</label>
            <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className="input-base">
              {TYPES.map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Estudio *</label>
            <select value={form.study} onChange={e=>setForm(f=>({...f,study:e.target.value}))} className="input-base">
              <option value="">Seleccionar...</option>
              {STUDIES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Prioridad</label>
            <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} className="input-base">
              <option value="normal">Normal</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <div>
            <label className="label-base">Indicaciones de preparación</label>
            <input value={form.indications} onChange={e=>setForm(f=>({...f,indications:e.target.value}))} className="input-base" placeholder="Ej: Ayuno 8h..."/>
          </div>
          <div className="sm:col-span-2">
            <label className="label-base">Notas clínicas</label>
            <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} className="input-base resize-none" placeholder="Motivo clínico del estudio..."/>
          </div>
        </div>
      </Modal>
    </>
  );
}
