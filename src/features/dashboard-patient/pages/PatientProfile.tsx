import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Droplet, Edit3, Camera, Save, Heart, Shield, UserCheck, Calendar, Lock, Smartphone, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../../shared/stores/authStore';
import { usePatientStore } from '../../../shared/stores/patientStore';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { Avatar } from '../../../shared/components/atoms/index';
import { cn } from '../../../shared/utils';
import { toast } from 'sonner';

const BLOOD_TYPES = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const EPS_LIST = ['EsSalud','RIMAC','Pacífico','La Positiva','Mapfre','SIS','Sanitas','Ninguno'];

export default function PatientProfile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const { profile, updateProfile } = usePatientStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security modals
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [twoFAModalOpen, setTwoFAModalOpen] = useState(false);
  const [sessionsModalOpen, setSessionsModalOpen] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success('Perfil actualizado correctamente');
  };

  const handleCancel = () => { setForm({ ...profile }); setEditing(false); };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Selecciona un archivo de imagen válido'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('La imagen no debe superar 5MB'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateProfile({ avatarUrl: dataUrl });
      updateUser({ avatar: dataUrl });
      toast.success('Foto de perfil actualizada');
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = () => {
    if (!pwdForm.current || !pwdForm.next || !pwdForm.confirm) { toast.error('Completa todos los campos'); return; }
    if (pwdForm.next.length < 8) { toast.error('La nueva contraseña debe tener al menos 8 caracteres'); return; }
    if (pwdForm.next !== pwdForm.confirm) { toast.error('Las contraseñas no coinciden'); return; }
    toast.success('Contraseña actualizada correctamente');
    setPwdForm({ current: '', next: '', confirm: '' });
    setPwdModalOpen(false);
  };

  const handleToggle2FA = () => {
    setTwoFAEnabled(v => !v);
    toast.success(twoFAEnabled ? 'Verificación en 2 pasos desactivada' : 'Verificación en 2 pasos activada', {
      description: twoFAEnabled ? undefined : 'A partir de ahora se te pedirá un código adicional al iniciar sesión.',
    });
    setTwoFAModalOpen(false);
  };

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
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            {editing && (
              <button onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 shadow-md transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <h2 className="font-heading font-bold text-slate-800 dark:text-slate-100 text-lg">{user.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
          <span className="inline-flex mt-3 px-3 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">{t('patientDashboard.patient')}</span>
          <div className="mt-5 pt-5 border-t border-surface-100 dark:border-slate-800 space-y-3 text-sm">
            {[
              { icon: <User className="h-3.5 w-3.5 text-blue-500" />, label: 'DNI', value: (form as any).dni || 'No especificado' },
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
              <Field label="DNI" icon={<User className="h-3.5 w-3.5" />} field={'dni' as any} type="text" />
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
                { label: 'Contraseña', desc: 'Última actualización hace 3 meses', action: 'Cambiar', onClick: () => setPwdModalOpen(true) },
                { label: 'Verificación en 2 pasos', desc: twoFAEnabled ? 'Activada · Protegiendo tu cuenta' : 'No configurada · Mejora la seguridad de tu cuenta', action: twoFAEnabled ? 'Gestionar' : 'Activar', onClick: () => setTwoFAModalOpen(true) },
                { label: 'Sesiones activas', desc: '1 dispositivo conectado', action: 'Gestionar', onClick: () => setSessionsModalOpen(true) },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div><p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</p><p className="text-xs text-slate-400">{item.desc}</p></div>
                  <button onClick={item.onClick} className="text-xs text-primary-600 font-medium hover:underline shrink-0 ml-4">{item.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Change password modal */}
      <Modal isOpen={pwdModalOpen} onClose={() => setPwdModalOpen(false)} title="Cambiar contraseña" size="sm"
        footer={<>
          <button onClick={() => setPwdModalOpen(false)} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.cancel')}</button>
          <button onClick={handleChangePassword} className="btn-primary text-sm px-4 py-2">Actualizar contraseña</button>
        </>}>
        <div className="space-y-3">
          <div>
            <label className="label-base flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" />Contraseña actual</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={pwdForm.current} onChange={e => setPwdForm(f => ({ ...f, current: e.target.value }))} className="input-base pr-9" />
              <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="label-base">Nueva contraseña</label>
            <input type={showPwd ? 'text' : 'password'} value={pwdForm.next} onChange={e => setPwdForm(f => ({ ...f, next: e.target.value }))} className="input-base" placeholder="Mínimo 8 caracteres" />
          </div>
          <div>
            <label className="label-base">Confirmar nueva contraseña</label>
            <input type={showPwd ? 'text' : 'password'} value={pwdForm.confirm} onChange={e => setPwdForm(f => ({ ...f, confirm: e.target.value }))} className="input-base" />
          </div>
        </div>
      </Modal>

      {/* 2FA modal */}
      <Modal isOpen={twoFAModalOpen} onClose={() => setTwoFAModalOpen(false)} title="Verificación en 2 pasos" size="sm"
        footer={<>
          <button onClick={() => setTwoFAModalOpen(false)} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.cancel')}</button>
          <button onClick={handleToggle2FA} className={cn('text-sm px-4 py-2 rounded-lg font-medium text-white', twoFAEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700')}>
            {twoFAEnabled ? 'Desactivar' : 'Activar verificación'}
          </button>
        </>}>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-surface-50 dark:bg-slate-800 rounded-xl">
            <Smartphone className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {twoFAEnabled
                ? 'La verificación en 2 pasos está activa. Cada vez que inicies sesión desde un dispositivo nuevo te pediremos un código adicional.'
                : 'Añade una capa extra de seguridad. Una vez activada, necesitarás tu contraseña y un código temporal para iniciar sesión.'}
            </p>
          </div>
        </div>
      </Modal>

      {/* Sessions modal */}
      <Modal isOpen={sessionsModalOpen} onClose={() => setSessionsModalOpen(false)} title="Sesiones activas" size="sm"
        footer={<button onClick={() => setSessionsModalOpen(false)} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.close')}</button>}>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-surface-200 dark:border-slate-700 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center"><Smartphone className="h-4 w-4 text-green-600" /></div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Este dispositivo</p>
                <p className="text-xs text-slate-400">Sesión activa ahora</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">Activa</span>
          </div>
          <p className="text-xs text-slate-400">No tienes otras sesiones activas en este momento. Si detectas actividad sospechosa, cambia tu contraseña de inmediato.</p>
        </div>
      </Modal>
    </>
  );
}
