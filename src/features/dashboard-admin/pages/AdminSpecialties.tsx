import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Heart, Brain, Eye, Activity, Stethoscope, X } from 'lucide-react';
import { useAdminMasterStore } from '../store/adminMasterStore';
import type { Specialty } from '../store/adminMasterStore';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Badge } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { cn } from '../../../shared/utils';
import { toast } from 'sonner';

const ICON_MAP: Record<string, React.ReactNode> = {
  Heart: <Heart className="h-5 w-5"/>, Brain: <Brain className="h-5 w-5"/>, Eye: <Eye className="h-5 w-5"/>,
  Activity: <Activity className="h-5 w-5"/>, Stethoscope: <Stethoscope className="h-5 w-5"/>,
  Scan: <Activity className="h-5 w-5"/>, Baby: <Heart className="h-5 w-5"/>, Bone: <Activity className="h-5 w-5"/>,
  Microscope: <Activity className="h-5 w-5"/>,
};
const COLOR_CLASSES: Record<string, string> = {
  red:'bg-red-50 text-red-500 dark:bg-red-950/30', purple:'bg-purple-50 text-purple-500 dark:bg-purple-950/30',
  blue:'bg-blue-50 text-blue-500 dark:bg-blue-950/30', amber:'bg-amber-50 text-amber-500 dark:bg-amber-950/30',
  pink:'bg-pink-50 text-pink-500 dark:bg-pink-950/30', orange:'bg-orange-50 text-orange-500 dark:bg-orange-950/30',
  teal:'bg-teal-50 text-teal-500 dark:bg-teal-950/30', indigo:'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30',
  green:'bg-green-50 text-green-500 dark:bg-green-950/30', yellow:'bg-yellow-50 text-yellow-500 dark:bg-yellow-950/30',
  gray:'bg-slate-50 text-slate-400 dark:bg-slate-800', black:'bg-slate-100 text-slate-600 dark:bg-slate-800',
};

const BLANK: Omit<Specialty,'id'> = { name:'', description:'', icon:'Stethoscope', status:'active', doctorCount:0, color:'blue' };

function SpecialtyModal({ spec, onClose }: { spec?: Specialty; onClose: () => void }) {
  const { addSpecialty, updateSpecialty } = useAdminMasterStore();
  const [form, setForm] = useState<Omit<Specialty,'id'>>(spec ? { name:spec.name, description:spec.description, icon:spec.icon, status:spec.status, doctorCount:spec.doctorCount, color:spec.color } : BLANK);

  function submit() {
    if (!form.name.trim()) { toast.error('El nombre es requerido'); return; }
    if (spec) { updateSpecialty(spec.id, form); toast.success('Especialidad actualizada'); }
    else { addSpecialty({ ...form, id:`sp-${Date.now()}` }); toast.success('Especialidad creada'); }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{spec ? 'Editar' : 'Nueva'} especialidad</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 text-slate-400"><X className="h-4 w-4"/></button>
        </div>
        <div className="p-5 space-y-4">
          {[{key:'name',label:'Nombre',ph:'Ej. Cardiología'},{key:'description',label:'Descripción',ph:'Breve descripción…'}].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"/>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Color</label>
              <select value={form.color} onChange={e=>setForm(p=>({...p,color:e.target.value}))}
                className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
                {Object.keys(COLOR_CLASSES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Estado</label>
              <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value as any}))}
                className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
                <option value="active">Activa</option><option value="inactive">Inactiva</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-surface-200 dark:border-slate-800 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit}>{spec ? 'Actualizar' : 'Crear'}</Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminSpecialties() {
  const { specialties, deleteSpecialty, updateSpecialty } = useAdminMasterStore();
  const [editing, setEditing] = useState<Specialty | null | 'new'>(null);

  return (
    <>
      <Helmet><title>Especialidades – Admin</title></Helmet>
      <PageHeader title="Especialidades Médicas" subtitle={`${specialties.length} especialidades registradas`}
        breadcrumb={[{label:'Admin'},{label:'Gestión Médica'},{label:'Especialidades'}]}
        action={<Button size="sm" onClick={() => setEditing('new')}><Plus className="h-4 w-4 mr-1.5"/>Nueva especialidad</Button>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {specialties.map(sp => (
          <motion.div key={sp.id} layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            className="card p-4 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', COLOR_CLASSES[sp.color] || COLOR_CLASSES.blue)}>
                {ICON_MAP[sp.icon] || <Stethoscope className="h-5 w-5"/>}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(sp)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"><Edit2 className="h-3.5 w-3.5"/></button>
                <button onClick={() => { if (confirm('¿Eliminar esta especialidad?')) { deleteSpecialty(sp.id); toast.success('Especialidad eliminada'); } }}
                  className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5"/></button>
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-0.5">{sp.name}</h3>
            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{sp.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{sp.doctorCount} médicos</span>
              <Badge variant={sp.status === 'active' ? 'success' : 'default'} size="sm" dot>{sp.status === 'active' ? 'Activa' : 'Inactiva'}</Badge>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {editing && <SpecialtyModal spec={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)}/>}
      </AnimatePresence>
    </>
  );
}
