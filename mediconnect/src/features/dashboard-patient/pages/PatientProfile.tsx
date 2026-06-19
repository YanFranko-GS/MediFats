import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Droplet, Edit3, Camera, Save, Heart, Shield, UserCheck, Calendar } from 'lucide-react';
import { useAuthStore } from '../../../shared/stores/authStore';
import { usePatientStore } from '../../../shared/stores/patientStore';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Avatar } from '../../../shared/components/atoms/index';
import { toast } from 'sonner';

const BLOOD_TYPES = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const EPS_LIST = ['EsSalud','RIMAC','Pacífico','La Positiva','Mapfre','SIS','Sanitas','Ninguno'];

export default function PatientProfile() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { profile, updateProfile } = usePatientStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success('Perfil actualizado correctamente');
  };

  const handleCancel = () => { setForm({ ...profile }); setEditing(false); };

  if (!user) return null;

  const Field = ({ label, icon, field, type = 'text', options }: { label: string; icon: React.ReactNode; field: keyof typeof form; type?: string; options?: string[] }) => (
    <div>
      <label className="label-base flex items-center gap-1.5">{icon}{label}</label>
      {editing ? (
        options ? (
          <select value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="input-base">
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input type={type} value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="input-base" />
        )
      ) : (
        <p className="text-sm text-slate-700 dark:text-slate-300 py-2.5 px-3.5 bg-surface-50 dark:bg-slate-800 rounded-lg">{(form as any)[field] || '—'}</p>
      )}
    </div>
  );

  return (
    <>
      <Helmet><title>{t('patientDashboard.profileTitle')}</title></Helmet>
      <PageHeader title="Mi Perfil" subtitle="Tu información personal y médica"
        action={!editing ? (
          <button onClick={() => setEditing(true)} className="btn-outline flex items-center gap-2 text-sm"><Edit3 className="h-4 w-4" />{t('patientDashboard.editProfile')}</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.cancel')}</button>
            <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm"><Save className="h-4 w-4" />Guardar</button>
          </div>
        )}
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Mi Perfil' }]} />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Avatar panel */}
        <div className="card p-6 text-center">
          <div className="relative inline-block mb-4">
            <Avatar src={user.avatar} name={user.name} size="xl" className="mx-auto" />
            {editing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 shadow-md transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <h2 className="font-heading font-bold text-slate-800 dark:text-slate-100 text-lg">{user.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
          <span className="inline-flex mt-3 px-3 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">{t('patientDashboard.patient')}</span>
          <div className="mt-5 pt-5 border-t border-surface-100 dark:border-slate-800 space-y-3 text-sm">
            {[
              { icon: <Droplet className="h-3.5 w-3.5 text-red-500" />, label: 'Tipo de sangre', value: form.bloodType },
              { icon: <Calendar className="h-3.5 w-3.5 text-primary-500" />, label: 'Fecha de nac.', value: form.birthDate },
              { icon: <MapPin className="h-3.5 w-3.5 text-slate-400" />, label: 'Dirección', value: form.address },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 text-left">
                {icon}
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forms */}
        <div className="lg:col-span-3 space-y-5">
          {/* Personal info */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2 text-sm"><User className="h-4 w-4 text-primary-600" />Información personal</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Teléfono" icon={<Phone className="h-3.5 w-3.5" />} field="phone" type="tel" />
              <Field label="Dirección" icon={<MapPin className="h-3.5 w-3.5" />} field="address" />
              <Field label="Tipo de sangre" icon={<Droplet className="h-3.5 w-3.5" />} field="bloodType" options={BLOOD_TYPES} />
              <Field label="Fecha de nacimiento" icon={<Calendar className="h-3.5 w-3.5" />} field="birthDate" type="date" />
              <div>
                <label className="label-base flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Correo electrónico</label>
                <p className="text-sm text-slate-400 py-2.5 px-3.5 bg-surface-50 dark:bg-slate-800 rounded-lg">{user.email} <span className="text-xs text-slate-300">(no editable)</span></p>
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2 text-sm"><Shield className="h-4 w-4 text-green-600" />Seguro médico</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="EPS / Aseguradora" icon={<Shield className="h-3.5 w-3.5" />} field="eps" options={EPS_LIST} />
              <Field label="Número de afiliado" icon={<UserCheck className="h-3.5 w-3.5" />} field="affiliateNum" />
            </div>
          </div>

          {/* Emergency contact */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2 text-sm"><Heart className="h-4 w-4 text-red-500" />Contacto de emergencia</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Nombre completo" icon={<User className="h-3.5 w-3.5" />} field="emergencyName" />
              <Field label="Teléfono" icon={<Phone className="h-3.5 w-3.5" />} field="emergencyPhone" type="tel" />
              <Field label="Parentesco" icon={<Heart className="h-3.5 w-3.5" />} field="emergencyRelation" />
            </div>
          </div>

          {/* Security */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 text-sm">Seguridad de la cuenta</h3>
            <div className="space-y-3 divide-y divide-surface-100 dark:divide-slate-800">
              {[
                { label: 'Contraseña', desc: 'Última actualización hace 3 meses', action: 'Cambiar' },
                { label: 'Verificación en 2 pasos', desc: 'No configurada · Mejora la seguridad de tu cuenta', action: 'Activar' },
                { label: 'Sesiones activas', desc: '1 dispositivo conectado', action: 'Gestionar' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div><p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</p><p className="text-xs text-slate-400">{item.desc}</p></div>
                  <button className="text-xs text-primary-600 font-medium hover:underline shrink-0 ml-4">{item.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
