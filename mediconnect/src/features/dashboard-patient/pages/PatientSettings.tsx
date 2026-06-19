import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Palette, Accessibility, Globe, Bell, Trash2, Sun, Moon, Eye } from 'lucide-react';
import { useUIStore } from '../../../shared/stores/uiStore';
import { usePatientStore } from '../../../shared/stores/patientStore';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { cn } from '../../../shared/utils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

function Toggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-surface-100 dark:border-slate-800 last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className={cn('w-12 h-6 rounded-full transition-all relative shrink-0', checked ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700')}>
        <motion.span animate={{ x: checked ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm block" />
      </button>
    </div>
  );
}

export default function PatientSettings() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { theme, setTheme, fontSize, setFontSize, language, setLanguage } = useUIStore();
  const { seniorMode, setSeniorMode, reduceMotion, setReduceMotion } = usePatientStore();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [notifReminder, setNotifReminder] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSeniorMode = (v: boolean) => {
    setSeniorMode(v);
    if (v) {
      setFontSize('xl');
      toast.success('Modo adulto mayor activado', { description: 'Fuente grande y alto contraste activados.' });
    } else {
      setFontSize('md');
      toast.info('Modo adulto mayor desactivado');
    }
  };

  const handleLanguage = (lang: 'es' | 'en') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    toast.success(lang === 'es' ? 'Idioma cambiado a Español' : 'Language changed to English');
  };

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="card p-6">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2 text-sm">
        <span className="text-primary-600">{icon}</span>{title}
      </h3>
      {children}
    </div>
  );

  return (
    <>
      <Helmet><title>{t('patientDashboard.settingsTitle')}</title></Helmet>
      <PageHeader title="Configuración" subtitle="Personaliza tu experiencia en MediConnect"
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Configuración' }]} />

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Appearance */}
        <Section title="Apariencia" icon={<Palette className="h-4 w-4" />}>
          <div className="space-y-5">
            <div>
              <label className="label-base">{t('patientDashboard.theme')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: 'light', l: 'Claro', icon: <Sun className="h-4 w-4" /> },
                  { v: 'dark', l: 'Oscuro', icon: <Moon className="h-4 w-4" /> },
                  { v: 'high-contrast', l: 'Alto contraste', icon: <Eye className="h-4 w-4" /> },
                ].map(({ v, l, icon }) => (
                  <button key={v} onClick={() => setTheme(v as any)}
                    className={cn('flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all',
                      theme === v ? 'bg-primary-600 text-white border-primary-600' : 'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-300')}>
                    {icon} {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-base">{t('patientDashboard.fontSize')}</label>
              <div className="flex gap-2">
                {([['sm','Pequeña'],['md','Normal'],['lg','Grande'],['xl','Muy grande']] as const).map(([v, l]) => (
                  <button key={v} onClick={() => setFontSize(v)}
                    className={cn('flex-1 py-2 rounded-xl text-xs font-medium border transition-all',
                      fontSize === v ? 'bg-primary-600 text-white border-primary-600' : 'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Accessibility */}
        <Section title="Accesibilidad" icon={<Accessibility className="h-4 w-4" />}>
          <div className={cn('mb-4 p-4 rounded-xl border-2 transition-all', seniorMode ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/20' : 'border-surface-200 dark:border-slate-700')}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">🧓 Modo Adulto Mayor</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Activa fuente más grande (20px), alto contraste, botones más amplios y navegación simplificada.</p>
              </div>
              <button onClick={() => handleSeniorMode(!seniorMode)}
                className={cn('w-12 h-6 rounded-full transition-all relative shrink-0', seniorMode ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700')}>
                <motion.span animate={{ x: seniorMode ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm block" />
              </button>
            </div>
          </div>
          <Toggle label="Reducir animaciones" desc="Desactiva las transiciones y efectos de movimiento"
            checked={reduceMotion} onChange={setReduceMotion} />
          <Toggle label="Subtítulos en teleconsultas" desc="Muestra transcripción en tiempo real durante videollamadas"
            checked={false} onChange={() => toast.info('Próximamente disponible')} />
        </Section>

        {/* Language */}
        <Section title="Idioma" icon={<Globe className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-3">
            {[['es','🇪🇸 Español'],['en','🇺🇸 English']].map(([v, l]) => (
              <button key={v} onClick={() => handleLanguage(v as 'es' | 'en')}
                className={cn('py-3 rounded-xl text-sm font-medium border transition-all',
                  language === v ? 'bg-primary-600 text-white border-primary-600' : 'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-300')}>
                {l}
              </button>
            ))}
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notificaciones" icon={<Bell className="h-4 w-4" />}>
          <Toggle label="Notificaciones por email" desc="Confirmaciones y recordatorios de citas" checked={notifEmail} onChange={setNotifEmail} />
          <Toggle label="Notificaciones push" desc="Alertas en tiempo real en el navegador" checked={notifPush} onChange={setNotifPush} />
          <Toggle label="Notificaciones SMS" desc="Mensajes de texto para citas urgentes" checked={notifSMS} onChange={setNotifSMS} />
          <Toggle label="Recordatorio 24h antes" desc="Alerta un día antes de cada cita" checked={notifReminder} onChange={setNotifReminder} />
        </Section>

        {/* Danger zone */}
        <div className="lg:col-span-2 card p-6 border-red-200 dark:border-red-900">
          <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2 text-sm"><Trash2 className="h-4 w-4" />{t('patientDashboard.dangerZone')}</h3>
          <div className="flex items-center justify-between py-3 border border-red-100 dark:border-red-900/50 rounded-xl px-4 bg-red-50/50 dark:bg-red-950/10">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('patientDashboard.deleteAccount')}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t('patientDashboard.deleteWarning')}</p>
            </div>
            <button onClick={() => setDeleteOpen(true)}
              className="shrink-0 ml-4 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirm */}
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Eliminar cuenta" size="sm"
        footer={<>
          <button onClick={() => setDeleteOpen(false)} className="btn-ghost text-sm px-4 py-2">{t('patientDashboard.cancel')}</button>
          <button onClick={() => { setDeleteOpen(false); toast.success('Solicitud enviada', { description: 'Recibirás un email de confirmación.' }); }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 text-sm">
            Confirmar eliminación
          </button>
        </>}>
        <div className="space-y-3">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-2">⚠️ Esto eliminará permanentemente:</p>
            <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
              <li>{t('patientDashboard.dataProfile')}</li><li>{t('patientDashboard.dataHistory')}</li>
              <li>{t('patientDashboard.dataMedical')}</li><li>{t('patientDashboard.dataMessages')}</li>
            </ul>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">¿Estás segura de continuar? Esta acción no puede deshacerse.</p>
        </div>
      </Modal>
    </>
  );
}
