import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Save, CheckCircle2, Paperclip, Stethoscope } from 'lucide-react';
import { useDoctorStore } from '../../../shared/stores/doctorStore';
import { useAuthStore } from '../../../shared/stores/authStore';
import { APPOINTMENTS } from '../../../data/appointments';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { AvatarImg } from '../../../shared/components/atoms/index';
import { toast } from 'sonner';
import { cn } from '../../../shared/utils';
import type { Appointment } from '../../../shared/types';

const ALL_APPTS = APPOINTMENTS as unknown as Appointment[];
const COMMON_DIAGNOSES = [
  'Hipertensión arterial (I10)','Infección respiratoria alta (J06)','Gastritis aguda (K29.7)',
  'Diabetes tipo 2 (E11)','Cefalea tensional (G44.2)','Dislipidemia (E78.5)',
  'Ansiedad (F41.1)','Artritis (M13.9)','Rinitis alérgica (J30.1)','Lumbalgia (M54.5)',
];

export default function DoctorConsultation() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { saveConsultation, getConsultation } = useDoctorStore();
  const existing = getConsultation(appointmentId || '');
  const appt = ALL_APPTS.find(a => a.id === appointmentId);

  const [form, setForm] = useState({
    motivo: existing?.motivo || appt?.reason || '',
    sintomas: existing?.sintomas || '',
    diagnostico: existing?.diagnostico || '',
    tratamiento: existing?.tratamiento || '',
    observaciones: existing?.observaciones || '',
  });
  const [saved, setSaved] = useState(false);
  const [diagInput, setDiagInput] = useState('');
  const [showDiagSugg, setShowDiagSugg] = useState(false);

  const filteredDiag = COMMON_DIAGNOSES.filter(d => d.toLowerCase().includes(diagInput.toLowerCase()) && diagInput.length > 1);

  const handleSave = () => {
    if (!form.diagnostico.trim()) { toast.error('Ingresa un diagnóstico'); return; }
    saveConsultation({ appointmentId: appointmentId!, patientId: appt?.patientId || '', ...form, createdAt: new Date().toISOString() });
    setSaved(true);
    toast.success('Consulta guardada en el expediente del paciente');
  };

  const handleFinish = () => {
    handleSave();
    setTimeout(() => navigate('/dashboard/doctor/schedule'), 800);
  };

  return (
    <>
      <Helmet><title>Consulta en curso – Dashboard Médico</title></Helmet>
      <Link to="/dashboard/doctor/schedule" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-5">
        <ArrowLeft className="h-4 w-4"/>Volver a agenda
      </Link>

      {/* Patient info bar */}
      {appt && (
        <div className="card p-4 mb-5 flex items-center gap-4 bg-primary-50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900">
          <AvatarImg src={appt.patientAvatar} alt={appt.patientName} className="w-12 h-12 rounded-xl object-cover bg-white shrink-0"/>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-100">{appt.patientName}</p>
            <p className="text-sm text-primary-600 dark:text-primary-400">{appt.doctorSpecialty} · {appt.date.slice(0,10)} {appt.time}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
            <Stethoscope className="h-4 w-4 text-primary-600"/>
            <span className="font-medium capitalize">{appt.mode}</span>
          </div>
          {saved && <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium shrink-0"><CheckCircle2 className="h-4 w-4"/>Guardado</span>}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { label:'Motivo de consulta', field:'motivo', rows:2, placeholder:'Ej: Dolor de cabeza persistente hace 3 días...' },
            { label:'Síntomas', field:'sintomas', rows:3, placeholder:'Describe los síntomas del paciente...' },
            { label:'Tratamiento indicado', field:'tratamiento', rows:3, placeholder:'Indicaciones terapéuticas...' },
            { label:'Observaciones privadas', field:'observaciones', rows:2, placeholder:'Notas internas (no visibles para el paciente)...' },
          ].map(({label,field,rows,placeholder})=>(
            <div key={field} className="card p-5">
              <label className="label-base">{label}</label>
              <textarea rows={rows} value={(form as any)[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
                placeholder={placeholder} className="input-base resize-none text-sm"/>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Diagnosis */}
          <div className="card p-5">
            <label className="label-base">Diagnóstico (CIE-10)</label>
            <div className="relative">
              <input value={diagInput || form.diagnostico}
                onChange={e=>{ setDiagInput(e.target.value); setForm(f=>({...f,diagnostico:e.target.value})); setShowDiagSugg(true); }}
                onFocus={()=>setShowDiagSugg(true)}
                placeholder="Escribe o selecciona diagnóstico..."
                className="input-base text-sm"/>
              {showDiagSugg && filteredDiag.length>0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                  {filteredDiag.map(d=>(
                    <button key={d} onClick={()=>{ setForm(f=>({...f,diagnostico:d})); setDiagInput(d); setShowDiagSugg(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-surface-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors border-b border-surface-50 dark:border-slate-800 last:border-0">
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">Diagnósticos comunes sugeridos al escribir</p>
          </div>

          {/* Attachments */}
          <div className="card p-5">
            <label className="label-base flex items-center gap-1.5"><Paperclip className="h-3.5 w-3.5"/>Adjuntos</label>
            <div className="border-2 border-dashed border-surface-200 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              onClick={()=>toast.info('Subida de archivos simulada')}>
              <Paperclip className="h-6 w-6 text-slate-300 mx-auto mb-2"/>
              <p className="text-xs text-slate-400">Arrastra archivos o haz clic</p>
              <p className="text-xs text-slate-300 mt-1">PDF, JPEG, PNG · máx. 10MB</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-5 space-y-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Acciones rápidas</h3>
            <Link to={`/dashboard/doctor/prescriptions?patient=${appt?.patientId || ''}`} className="w-full btn-outline text-xs flex items-center justify-center gap-2 py-2.5">💊 Emitir receta</Link>
            <Link to={`/dashboard/doctor/orders?patient=${appt?.patientId || ''}`} className="w-full btn-outline text-xs flex items-center justify-center gap-2 py-2.5">🧪 Crear orden médica</Link>
          </div>

          {/* Save / Finish */}
          <div className="space-y-2">
            <button onClick={handleSave} className="w-full btn-outline flex items-center justify-center gap-2 text-sm py-3">
              <Save className="h-4 w-4"/>Guardar borrador
            </button>
            <button onClick={handleFinish} className="w-full btn-primary flex items-center justify-center gap-2 text-sm py-3">
              <CheckCircle2 className="h-4 w-4"/>Finalizar consulta
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
