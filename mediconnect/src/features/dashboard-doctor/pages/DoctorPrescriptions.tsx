import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Pill, Plus, Eye, Download, Edit3, CheckCircle2, Search } from 'lucide-react';
import { useDoctorStore } from '../../../shared/stores/doctorStore';
import { useDoctorPatients } from '../../../shared/hooks/useDoctor';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { Skeleton } from '../../../shared/components/atoms/index';
import { cn, formatDate } from '../../../shared/utils';
import { toast } from 'sonner';

const MEDS_LIST = ['Losartán','Atorvastatina','Metformina','Omeprazol','Aspirina','Amoxicilina','Ibuprofeno','Paracetamol','Clonazepam','Sertralina','Levotiroxina','Vitamina D3','Ciprofloxacino','Metoclopramida','Fluticasona','Amlodipino','Diclofenaco','Omega-3','Melatonina','Calcio + Magnesio'];
const FREQS = ['Cada 8 horas','Cada 12 horas','Cada 24 horas (1 vez/día)','2 veces al día','3 veces al día','En ayunas','Con las comidas','Antes de dormir'];
const DURATIONS = ['7 días','14 días','30 días','3 meses','6 meses','Crónico (indefinido)'];

export default function DoctorPrescriptions() {
  const { emittedPrescriptions, addPrescription } = useDoctorStore();
  const { data: patients } = useDoctorPatients();
  const [showForm, setShowForm] = useState(false);
  const [viewTarget, setViewTarget] = useState<any>(null);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ patientId:'', medication:'', dose:'', frequency:'', duration:'', instructions:'' });

  const filtered = emittedPrescriptions.filter(p =>
    p.patientName?.toLowerCase().includes(q.toLowerCase()) || p.medication?.toLowerCase().includes(q.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.patientId || !form.medication || !form.dose) { toast.error('Completa los campos requeridos'); return; }
    const patient = (patients as unknown as any[])?.find(p => p.id === form.patientId);
    const newRx = {
      id: `rx-${Date.now()}`,
      patientId: form.patientId,
      patientName: patient?.name || 'Paciente',
      patientAvatar: patient?.avatar || '',
      ...form,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    addPrescription(newRx);
    setForm({ patientId:'', medication:'', dose:'', frequency:'', duration:'', instructions:'' });
    setShowForm(false);
    toast.success('Receta emitida correctamente');
  };

  return (
    <>
      <Helmet><title>Recetas Médicas – Dashboard Médico</title></Helmet>
      <PageHeader title="Recetas Médicas" subtitle={`${emittedPrescriptions.length} recetas emitidas`}
        action={<button onClick={()=>setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus className="h-4 w-4"/>Nueva receta</button>}
        breadcrumb={[{label:'Dashboard Médico',href:'/dashboard/doctor'},{label:'Recetas'}]} />

      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-700 rounded-xl px-4 py-2.5 max-w-sm mb-5">
        <Search className="h-4 w-4 text-slate-400 shrink-0"/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar receta..." className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none flex-1"/>
      </div>

      {emittedPrescriptions.length === 0 ? (
        <div className="card p-16 text-center">
          <Pill className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4"/>
          <p className="font-medium text-slate-600 dark:text-slate-400 mb-2">Sin recetas emitidas</p>
          <button onClick={()=>setShowForm(true)} className="btn-primary text-sm mt-2">Emitir primera receta</button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
              <tr>{['Paciente','Medicamento','Dosis','Frecuencia','Duración','Fecha','Estado','Acciones'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
              {filtered.map((rx:any,i:number)=>(
                <motion.tr key={rx.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                  className="hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {rx.patientAvatar && <img src={rx.patientAvatar} alt={rx.patientName} className="w-7 h-7 rounded-full object-cover bg-primary-50 shrink-0"/>}
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[100px] text-xs">{rx.patientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{rx.medication}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{rx.dose}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{rx.frequency}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{rx.duration}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(rx.createdAt,'dd/MM/yy')}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium',
                      rx.status==='active'?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':'bg-slate-100 text-slate-500 dark:bg-slate-800')}>
                      {rx.status==='active'?'Activa':'Finalizada'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={()=>setViewTarget(rx)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><Eye className="h-4 w-4"/></button>
                      <button onClick={()=>toast.success('Receta descargada')} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><Download className="h-4 w-4"/></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New prescription modal */}
      <Modal isOpen={showForm} onClose={()=>setShowForm(false)} title="Nueva Receta Médica" size="lg"
        footer={<><button onClick={()=>setShowForm(false)} className="btn-ghost text-sm px-4 py-2">Cancelar</button><button onClick={handleSubmit} className="btn-primary text-sm px-4 py-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/>Emitir receta</button></>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label-base">Paciente *</label>
            <select value={form.patientId} onChange={e=>setForm(f=>({...f,patientId:e.target.value}))} className="input-base">
              <option value="">Seleccionar paciente...</option>
              {(patients as unknown as any[]||[]).map((p:any)=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Medicamento *</label>
            <select value={form.medication} onChange={e=>setForm(f=>({...f,medication:e.target.value}))} className="input-base">
              <option value="">Seleccionar...</option>
              {MEDS_LIST.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Dosis *</label>
            <input value={form.dose} onChange={e=>setForm(f=>({...f,dose:e.target.value}))} placeholder="Ej: 50mg" className="input-base"/>
          </div>
          <div>
            <label className="label-base">Frecuencia</label>
            <select value={form.frequency} onChange={e=>setForm(f=>({...f,frequency:e.target.value}))} className="input-base">
              <option value="">Seleccionar...</option>
              {FREQS.map(fr=><option key={fr} value={fr}>{fr}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Duración</label>
            <select value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))} className="input-base">
              <option value="">Seleccionar...</option>
              {DURATIONS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label-base">Indicaciones adicionales</label>
            <textarea value={form.instructions} onChange={e=>setForm(f=>({...f,instructions:e.target.value}))} rows={2} className="input-base resize-none" placeholder="Ej: Tomar con alimentos, evitar alcohol..."/>
          </div>
        </div>
      </Modal>

      {/* View prescription modal */}
      <Modal isOpen={!!viewTarget} onClose={()=>setViewTarget(null)} title="Detalle de Receta" size="md"
        footer={<><button onClick={()=>toast.success('Descargada')} className="btn-outline text-sm flex items-center gap-2"><Download className="h-4 w-4"/>Descargar</button><button onClick={()=>setViewTarget(null)} className="btn-ghost text-sm">Cerrar</button></>}>
        {viewTarget && (
          <div className="border-2 border-dashed border-surface-200 dark:border-slate-700 rounded-xl p-5 bg-surface-50 dark:bg-slate-800/30">
            <div className="text-center border-b border-surface-200 dark:border-slate-700 pb-4 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-2"><Pill className="h-5 w-5 text-white"/></div>
              <p className="font-heading font-bold text-primary-600">MediConnect</p>
              <p className="text-xs text-slate-400">Receta Médica Digital</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div><p className="text-xs text-slate-400">Médico</p><p className="font-semibold text-slate-700 dark:text-slate-300">Dr. Carlos Mendoza</p></div>
              <div><p className="text-xs text-slate-400">Paciente</p><p className="font-semibold text-slate-700 dark:text-slate-300">{viewTarget.patientName}</p></div>
              <div><p className="text-xs text-slate-400">Fecha</p><p className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(viewTarget.createdAt,'dd/MM/yyyy')}</p></div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-2">MEDICAMENTO PRESCRITO</p>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{viewTarget.medication} <span className="text-primary-600">{viewTarget.dose}</span></p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{viewTarget.frequency} · {viewTarget.duration}</p>
              {viewTarget.instructions && <p className="text-sm text-slate-500 italic mt-2">{viewTarget.instructions}</p>}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
