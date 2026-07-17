import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Palette, Globe, Calendar, Bell, Save } from 'lucide-react';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Button } from '../../../shared/components/atoms/Button';
import { useAdminMasterStore } from '../store/adminMasterStore';
import { cn } from '../../../shared/utils';
import { toast } from 'sonner';

const SECTIONS = [
  { key:'branding', label:'Branding', icon:<Palette className="h-4 w-4"/> },
  { key:'system',   label:'Sistema',  icon:<Globe className="h-4 w-4"/> },
  { key:'appointments', label:'Reservas', icon:<Calendar className="h-4 w-4"/> },
  { key:'notifications', label:'Notificaciones', icon:<Bell className="h-4 w-4"/> },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={cn('w-11 h-6 rounded-full transition-colors shrink-0', value ? 'bg-primary-600' : 'bg-surface-300 dark:bg-slate-700')}>
      <div className={cn('w-4 h-4 bg-white rounded-full shadow transition-transform mx-1', value ? 'translate-x-5' : 'translate-x-0')}/>
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-surface-100 dark:border-slate-800 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-48 px-3 py-1.5 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-slate-800 dark:text-slate-100"/>
  );
}

function NumberInput({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input type="number" value={value} onChange={e => onChange(+e.target.value)} min={min} max={max}
      className="w-24 px-3 py-1.5 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-slate-800 dark:text-slate-100"/>
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="px-3 py-1.5 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-slate-800 dark:text-slate-100">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export default function AdminSettings() {
  const { settings, updateSettings } = useAdminMasterStore();
  const [section, setSection] = useState('branding');

  function save() { toast.success('Configuración guardada correctamente'); }

  function upd(key: keyof typeof settings, partial: any) {
    updateSettings({ [key]: { ...(settings as any)[key], ...partial } });
  }

  return (
    <>
      <Helmet><title>Configuración – Admin</title></Helmet>
      <PageHeader title="Configuración del Sistema" subtitle="Personalización y políticas de la plataforma"
        breadcrumb={[{label:'Admin'},{label:'Configuración'}]}
        action={<Button size="sm" onClick={save}><Save className="h-4 w-4 mr-1.5"/>Guardar cambios</Button>}
      />

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)}
              className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                section === s.key
                  ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800')}>
              {s.icon}{s.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 card p-6">
          {section === 'branding' && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Identidad visual</h3>
              <SettingRow label="Nombre de la plataforma" desc="Nombre que aparece en el header y emails">
                <TextInput value={settings.branding.platformName} onChange={v => upd('branding', { platformName: v })}/>
              </SettingRow>
              <SettingRow label="Color primario" desc="Color principal de la interfaz">
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.branding.primaryColor}
                    onChange={e => upd('branding', { primaryColor: e.target.value })}
                    className="w-10 h-8 rounded-lg border border-surface-200 dark:border-slate-700 cursor-pointer"/>
                  <span className="text-xs font-mono text-slate-500">{settings.branding.primaryColor}</span>
                </div>
              </SettingRow>
              <SettingRow label="Color de acento" desc="Color secundario de la interfaz">
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.branding.accentColor}
                    onChange={e => upd('branding', { accentColor: e.target.value })}
                    className="w-10 h-8 rounded-lg border border-surface-200 dark:border-slate-700 cursor-pointer"/>
                  <span className="text-xs font-mono text-slate-500">{settings.branding.accentColor}</span>
                </div>
              </SettingRow>
              <SettingRow label="Logo de la plataforma" desc="Imagen SVG o PNG (simulado)">
                <Button size="sm" variant="outline" onClick={() => toast.success('Logo actualizado (simulado)')}>Subir logo</Button>
              </SettingRow>
            </div>
          )}

          {section === 'system' && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Configuración del sistema</h3>
              <SettingRow label="Idioma por defecto">
                <SelectInput value={settings.system.language} onChange={v => upd('system', { language: v })}
                  options={[{value:'es',label:'Español'},{value:'en',label:'English'},{value:'pt',label:'Português'}]}/>
              </SettingRow>
              <SettingRow label="Zona horaria">
                <SelectInput value={settings.system.timezone} onChange={v => upd('system', { timezone: v })}
                  options={[{value:'America/Lima',label:'Lima (GMT-5)'},{value:'America/Bogota',label:'Bogotá (GMT-5)'},{value:'America/Santiago',label:'Santiago (GMT-3)'}]}/>
              </SettingRow>
              <SettingRow label="Moneda">
                <SelectInput value={settings.system.currency} onChange={v => upd('system', { currency: v })}
                  options={[{value:'PEN',label:'PEN – Sol peruano'},{value:'USD',label:'USD – Dólar'},{value:'COP',label:'COP – Peso colombiano'}]}/>
              </SettingRow>
              <SettingRow label="Formato de fecha">
                <SelectInput value={settings.system.dateFormat} onChange={v => upd('system', { dateFormat: v })}
                  options={[{value:'DD/MM/YYYY',label:'DD/MM/AAAA'},{value:'MM/DD/YYYY',label:'MM/DD/AAAA'},{value:'YYYY-MM-DD',label:'AAAA-MM-DD'}]}/>
              </SettingRow>
              <SettingRow label="Formato de hora">
                <SelectInput value={settings.system.timeFormat} onChange={v => upd('system', { timeFormat: v as any })}
                  options={[{value:'12h',label:'12 horas (AM/PM)'},{value:'24h',label:'24 horas'}]}/>
              </SettingRow>
            </div>
          )}

          {section === 'appointments' && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Política de reservas</h3>
              <SettingRow label="Duración de cita por defecto" desc="En minutos">
                <NumberInput value={settings.appointments.defaultDurationMinutes} min={15} max={120} onChange={v => upd('appointments', { defaultDurationMinutes: v })}/>
              </SettingRow>
              <SettingRow label="Máximo de citas por día (por médico)">
                <NumberInput value={settings.appointments.maxDailyAppointmentsPerDoctor} min={5} max={50} onChange={v => upd('appointments', { maxDailyAppointmentsPerDoctor: v })}/>
              </SettingRow>
              <SettingRow label="Anticipación máxima de reserva" desc="Días en el futuro permitidos">
                <NumberInput value={settings.appointments.maxAdvanceBookingDays} min={7} max={180} onChange={v => upd('appointments', { maxAdvanceBookingDays: v })}/>
              </SettingRow>
              <SettingRow label="Política de cancelación" desc="Horas mínimas de antelación">
                <NumberInput value={settings.appointments.cancellationPolicyHours} min={0} max={72} onChange={v => upd('appointments', { cancellationPolicyHours: v })}/>
              </SettingRow>
              <SettingRow label="Permitir reservas el mismo día" desc="Los pacientes pueden reservar para hoy">
                <Toggle value={settings.appointments.allowSameDayBooking} onChange={v => upd('appointments', { allowSameDayBooking: v })}/>
              </SettingRow>
              <SettingRow label="Pago anticipado obligatorio" desc="Requiere pago para confirmar la reserva">
                <Toggle value={settings.appointments.requirePaymentUpfront} onChange={v => upd('appointments', { requirePaymentUpfront: v })}/>
              </SettingRow>
            </div>
          )}

          {section === 'notifications' && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Configuración de notificaciones</h3>
              <SettingRow label="Recordatorios por email" desc="Enviar recordatorios de citas por email">
                <Toggle value={settings.notifications.emailReminders} onChange={v => upd('notifications', { emailReminders: v })}/>
              </SettingRow>
              <SettingRow label="Recordatorios por SMS" desc="Enviar recordatorios de citas por SMS">
                <Toggle value={settings.notifications.smsReminders} onChange={v => upd('notifications', { smsReminders: v })}/>
              </SettingRow>
              <SettingRow label="Antelación del recordatorio" desc="Horas antes de la cita">
                <NumberInput value={settings.notifications.reminderHoursBefore} min={1} max={72} onChange={v => upd('notifications', { reminderHoursBefore: v })}/>
              </SettingRow>
              <SettingRow label="Email de bienvenida" desc="Enviar email al registrarse">
                <Toggle value={settings.notifications.sendWelcomeEmail} onChange={v => upd('notifications', { sendWelcomeEmail: v })}/>
              </SettingRow>
              <SettingRow label="Email de cancelación" desc="Notificar cancelaciones por email">
                <Toggle value={settings.notifications.sendCancellationEmail} onChange={v => upd('notifications', { sendCancellationEmail: v })}/>
              </SettingRow>
              <div className="mt-4 pt-4 border-t border-surface-100 dark:border-slate-800">
                <Button variant="outline" onClick={() => toast.success('Vista previa de plantilla de email abierta (simulado)')}>
                  Ver plantilla de email
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
