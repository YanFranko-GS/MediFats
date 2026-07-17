import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, MapPin, Phone, Mail, X } from 'lucide-react';
import { useAdminMasterStore } from '../store/adminMasterStore';
import type { Clinic } from '../store/adminMasterStore';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Badge } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { toast } from 'sonner';

const BLANK: Omit<Clinic,'id'> = { name:'', address:'', city:'Lima', phone:'', email:'', status:'active', doctorCount:0, coordinates:{ lat:-12.0464, lng:-77.0428 } };

function ClinicModal({ clinic, onClose }: { clinic?: Clinic; onClose: () => void }) {
  const { addClinic, updateClinic } = useAdminMasterStore();
  const [form, setForm] = useState<Omit<Clinic,'id'>>(clinic ? { name:clinic.name, address:clinic.address, city:clinic.city, phone:clinic.phone, email:clinic.email, status:clinic.status, doctorCount:clinic.doctorCount, coordinates:clinic.coordinates } : BLANK);
  function submit() {
    if (!form.name.trim()) { toast.error('El nombre es requerido'); return; }
    if (clinic) { updateClinic(clinic.id, form); toast.success('Clínica actualizada'); }
    else { addClinic({ ...form, id:`cl-${Date.now()}` }); toast.success('Clínica creada'); }
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{clinic ? 'Editar' : 'Nueva'} clínica</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-slate-400"><X className="h-4 w-4"/></button>
        </div>
        <div className="p-5 space-y-3">
          {[{k:'name',l:'Nombre',p:'Nombre de la clínica'},{k:'address',l:'Dirección',p:'Av. ...'},{k:'city',l:'Ciudad',p:'Lima'},{k:'phone',l:'Teléfono',p:'+51 1 ...'},{k:'email',l:'Email',p:'contacto@clinica.pe'}].map(f=>(
            <div key={f.k}>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{f.l}</label>
              <input value={(form as any)[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p}
                className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"/>
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Estado</label>
            <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value as any}))}
              className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
              <option value="active">Activa</option><option value="inactive">Inactiva</option>
            </select>
          </div>
        </div>
        <div className="p-5 border-t border-surface-200 dark:border-slate-800 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit}>{clinic ? 'Actualizar' : 'Crear'}</Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminClinics() {
  const { clinics, deleteClinic } = useAdminMasterStore();
  const [editing, setEditing] = useState<Clinic | null | 'new'>(null);
  return (
    <>
      <Helmet><title>Clínicas – Admin</title></Helmet>
      <PageHeader title="Gestión de Clínicas" subtitle={`${clinics.length} clínicas registradas`}
        breadcrumb={[{label:'Admin'},{label:'Gestión Médica'},{label:'Clínicas'}]}
        action={<Button size="sm" onClick={() => setEditing('new')}><Plus className="h-4 w-4 mr-1.5"/>Nueva clínica</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clinics.map(cl => (
          <motion.div key={cl.id} layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="card p-5 group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{cl.name}</h3>
                <Badge variant={cl.status==='active'?'success':'default'} size="sm" dot className="mt-1">{cl.status==='active'?'Activa':'Inactiva'}</Badge>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(cl)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"><Edit2 className="h-3.5 w-3.5"/></button>
                <button onClick={() => { if (confirm('¿Eliminar esta clínica?')) { deleteClinic(cl.id); toast.success('Clínica eliminada'); } }} className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5"/></button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0"/>{cl.address}, {cl.city}</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-400 shrink-0"/>{cl.phone}</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-400 shrink-0"/>{cl.email}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-surface-100 dark:border-slate-800 text-xs text-slate-500">
              {cl.doctorCount} médicos asignados
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{editing && <ClinicModal clinic={editing==='new'?undefined:editing} onClose={()=>setEditing(null)}/>}</AnimatePresence>
    </>
  );
}
