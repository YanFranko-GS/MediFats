import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Camera, Edit3, Save, Plus, X, MapPin, Clock, DollarSign, Globe, Award } from 'lucide-react';
import { useAuthStore } from '../../../shared/stores/authStore';
import { useDoctorStore } from '../../../shared/stores/doctorStore';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Avatar } from '../../../shared/components/atoms/index';
import { cn, formatCurrency } from '../../../shared/utils';
import { toast } from 'sonner';

const SPECIALTIES = ['Cardiología','Dermatología','Neurología','Pediatría','Ginecología','Traumatología','Endocrinología','Medicina General','Gastroenterología','Psiquiatría'];
const LANGUAGES = ['Español','Inglés','Portugués','Francés','Alemán','Italiano'];
const MODES = [['in-person','Presencial'],['video','Videollamada'],['chat','Chat médico']];

export default function DoctorProfile() {
  const { user } = useAuthStore();
  const { profile, updateProfile } = useDoctorStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [newCert, setNewCert] = useState('');

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success('Perfil actualizado correctamente');
  };

  const toggleLang = (lang: string) => {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(lang) ? f.languages.filter(l => l !== lang) : [...f.languages, lang],
    }));
  };

  const toggleMode = (mode: string) => {
    setForm(f => ({
      ...f,
      modes: f.modes.includes(mode) ? f.modes.filter(m => m !== mode) : [...f.modes, mode],
    }));
  };

  const addCert = () => {
    if (!newCert.trim()) return;
    setForm(f => ({ ...f, certifications: [...f.certifications, newCert.trim()] }));
    setNewCert('');
  };

  const removeCert = (i: number) => {
    setForm(f => ({ ...f, certifications: f.certifications.filter((_, idx) => idx !== i) }));
  };

  if (!user) return null;

  return (
    <>
      <Helmet><title>Mi Perfil Médico – Dashboard Médico</title></Helmet>
      <PageHeader title="Mi Perfil Médico" subtitle="Tu información pública en la plataforma"
        action={!editing ? (
          <button onClick={() => setEditing(true)} className="btn-outline flex items-center gap-2 text-sm"><Edit3 className="h-4 w-4" />Editar perfil</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setForm({ ...profile }); setEditing(false); }} className="btn-ghost text-sm px-4 py-2">Cancelar</button>
            <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm"><Save className="h-4 w-4" />Guardar cambios</button>
          </div>
        )}
        breadcrumb={[{ label: 'Dashboard Médico', href: '/dashboard/doctor' }, { label: 'Mi Perfil' }]} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar + quick stats */}
        <div className="card p-6 text-center">
          <div className="relative inline-block mb-4">
            <Avatar src={user.avatar} name={user.name} size="xl" className="mx-auto" />
            {editing && (
              <button onClick={() => toast.info('Cambio de foto simulado')}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 shadow-md transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <h2 className="font-heading font-bold text-slate-800 dark:text-slate-100 text-lg">{user.name}</h2>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-1">{profile.specialty}</p>
          <div className="flex justify-center gap-0.5 mt-2">
            {[1,2,3,4,5].map(i => <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-amber-400 text-amber-400" stroke="currentColor" strokeWidth={1.5}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
            <span className="text-xs text-slate-400 ml-1">4.8</span>
          </div>

          <div className="mt-5 pt-5 border-t border-surface-100 dark:border-slate-800 space-y-3 text-sm text-left">
            {[
              { icon: <Clock className="h-4 w-4 text-slate-400" />, label: `${profile.experience} años de experiencia` },
              { icon: <DollarSign className="h-4 w-4 text-slate-400" />, label: `${formatCurrency(profile.price)} por consulta` },
              { icon: <MapPin className="h-4 w-4 text-slate-400" />, label: 'San Isidro, Lima' },
              { icon: <Globe className="h-4 w-4 text-slate-400" />, label: profile.languages.join(', ') },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                {icon}
                <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Editable fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Professional info */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-5 text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-primary-600" />Información profesional
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-base">Especialidad</label>
                {editing ? (
                  <select value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} className="input-base">
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : <p className="text-sm text-slate-700 dark:text-slate-300 py-2.5 px-3.5 bg-surface-50 dark:bg-slate-800 rounded-lg">{profile.specialty}</p>}
              </div>
              <div>
                <label className="label-base">Años de experiencia</label>
                {editing ? (
                  <input type="number" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: Number(e.target.value) }))} className="input-base" min={0} max={50} />
                ) : <p className="text-sm text-slate-700 dark:text-slate-300 py-2.5 px-3.5 bg-surface-50 dark:bg-slate-800 rounded-lg">{profile.experience} años</p>}
              </div>
              <div>
                <label className="label-base">Precio por consulta (S/)</label>
                {editing ? (
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="input-base" min={0} />
                ) : <p className="text-sm text-slate-700 dark:text-slate-300 py-2.5 px-3.5 bg-surface-50 dark:bg-slate-800 rounded-lg">${profile.price}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label-base">Biografía profesional</label>
                {editing ? (
                  <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="input-base resize-none text-sm" />
                ) : <p className="text-sm text-slate-700 dark:text-slate-300 py-2.5 px-3.5 bg-surface-50 dark:bg-slate-800 rounded-lg leading-relaxed">{profile.bio}</p>}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 text-sm">Idiomas</h3>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <button key={lang} onClick={() => editing && toggleLang(lang)} disabled={!editing}
                  className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    (editing ? form : profile).languages.includes(lang)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-surface-200 dark:border-slate-700 text-slate-500 dark:text-slate-400',
                    !editing && 'cursor-default')}>
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Consultation modes */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 text-sm">Modalidades de atención</h3>
            <div className="flex flex-wrap gap-2">
              {MODES.map(([v, l]) => (
                <button key={v} onClick={() => editing && toggleMode(v)} disabled={!editing}
                  className={cn('px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                    (editing ? form : profile).modes.includes(v)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-surface-200 dark:border-slate-700 text-slate-500 dark:text-slate-400',
                    !editing && 'cursor-default')}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 text-sm">Certificaciones</h3>
            <div className="space-y-2 mb-3">
              {(editing ? form : profile).certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-2 py-2 px-3 bg-surface-50 dark:bg-slate-800 rounded-lg">
                  <Award className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{cert}</span>
                  {editing && (
                    <button onClick={() => removeCert(i)} className="text-slate-300 hover:text-red-500 transition-colors"><X className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input value={newCert} onChange={e => setNewCert(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCert()}
                  placeholder="Agregar certificación..." className="input-base text-sm flex-1" />
                <button onClick={addCert} className="btn-outline text-sm px-3 py-2.5 flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
