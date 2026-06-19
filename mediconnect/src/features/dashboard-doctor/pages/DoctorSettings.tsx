import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sun, Moon, Eye, Globe, Bell, Shield, Palette } from 'lucide-react';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { useUIStore } from '../../../shared/stores/uiStore';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../shared/utils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function Toggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-surface-100 dark:border-slate-800 last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!checked)} className={cn('w-12 h-6 rounded-full transition-all relative shrink-0', checked ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700')}>
        <motion.span animate={{ x: checked ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm block" />
      </button>
    </div>
  );
}

export default function DoctorSettings() {
  const { i18n } = useTranslation();
  const { theme, setTheme, fontSize, setFontSize, language, setLanguage } = useUIStore();
  const [twoFA, setTwoFA] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="card p-6">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2 text-sm"><span className="text-primary-600">{icon}</span>{title}</h3>
      {children}
    </div>
  );

  return (
    <>
      <Helmet><title>Configuración – Dashboard Médico</title></Helmet>
      <PageHeader title="Configuración" subtitle="Personaliza tu experiencia clínica"
        breadcrumb={[{ label: 'Dashboard Médico', href: '/dashboard/doctor' }, { label: 'Configuración' }]} />
      <div className="grid lg:grid-cols-2 gap-5">
        <Section title="Apariencia" icon={<Palette className="h-4 w-4" />}>
          <div className="space-y-5">
            <div>
              <label className="label-base">Tema</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ v: 'light', l: 'Claro', icon: <Sun className="h-4 w-4" /> }, { v: 'dark', l: 'Oscuro', icon: <Moon className="h-4 w-4" /> }, { v: 'high-contrast', l: 'Alto contraste', icon: <Eye className="h-4 w-4" /> }].map(({ v, l, icon }) => (
                  <button key={v} onClick={() => setTheme(v as any)} className={cn('flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all', theme === v ? 'bg-primary-600 text-white border-primary-600' : 'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>{icon}{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-base">Tamaño de fuente</label>
              <div className="flex gap-2">
                {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                  <button key={s} onClick={() => setFontSize(s)} className={cn('flex-1 py-2 rounded-xl text-xs font-medium border transition-all', fontSize === s ? 'bg-primary-600 text-white border-primary-600' : 'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>{s.toUpperCase()}</button>
                ))}
              </div>
            </div>
          </div>
        </Section>
        <Section title="Idioma" icon={<Globe className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-3">
            {[['es', 'ES – Español'], ['en', 'EN – English']].map(([v, l]) => (
              <button key={v} onClick={() => { setLanguage(v as any); i18n.changeLanguage(v); toast.success(v === 'es' ? 'Idioma: Español' : 'Language: English'); }} className={cn('py-3 rounded-xl text-sm font-medium border transition-all', language === v ? 'bg-primary-600 text-white border-primary-600' : 'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>{l}</button>
            ))}
          </div>
        </Section>
        <Section title="Seguridad" icon={<Shield className="h-4 w-4" />}>
          <Toggle label="Autenticación en 2 pasos" desc="Requiere código adicional al iniciar sesión" checked={twoFA} onChange={v => { setTwoFA(v); toast.success(v ? '2FA activado' : '2FA desactivado'); }} />
          <Toggle label="Sesiones concurrentes" desc="Permite iniciar sesión en múltiples dispositivos" checked={true} onChange={() => {}} />
          <div className="mt-3 pt-3 border-t border-surface-100 dark:border-slate-800">
            <button onClick={() => toast.info('Enlace de cambio enviado al correo')} className="text-sm text-primary-600 font-medium hover:underline">Cambiar contraseña</button>
          </div>
        </Section>
        <Section title="Notificaciones" icon={<Bell className="h-4 w-4" />}>
          <Toggle label="Email" desc="Nuevas citas, cancelaciones y mensajes" checked={notifEmail} onChange={setNotifEmail} />
          <Toggle label="Push" desc="Alertas en tiempo real en el navegador" checked={notifPush} onChange={setNotifPush} />
          <Toggle label="SMS" desc="Recordatorios críticos por mensaje de texto" checked={notifSMS} onChange={setNotifSMS} />
        </Section>
      </div>
    </>
  );
}
