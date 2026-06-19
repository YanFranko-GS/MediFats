import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Lock, Unlock, Video, Building2, MessageCircle, Clock, Settings } from 'lucide-react';
import { useWeekSchedule, useDaySchedule } from '../../../shared/hooks/useDoctor';
import { useDoctorStore } from '../../../shared/stores/doctorStore';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { cn, statusColors } from '../../../shared/utils';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const HOURS = Array.from({ length: 10 }, (_, i) => `${String(i + 8).padStart(2,'0')}:00`);
const VIEWS = ['day','week','month'] as const;
const MODE_ICONS: Record<string, React.ReactNode> = {
  'in-person': <Building2 className="h-3 w-3" />, 'video': <Video className="h-3 w-3" />, 'chat': <MessageCircle className="h-3 w-3" />,
};
const DURATIONS = [15,30,45,60,90] as const;

export default function DoctorSchedule() {
  const [view, setView] = useState<typeof VIEWS[number]>('week');
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { consultationDuration, setConsultationDuration, blockSlot, unblockSlot, isBlocked } = useDoctorStore();

  const weekEnd = addDays(weekStart, 5);
  const { data: weekAppts } = useWeekSchedule(format(weekStart,'yyyy-MM-dd'), format(weekEnd,'yyyy-MM-dd'));
  const { data: dayAppts } = useDaySchedule(format(selectedDay,'yyyy-MM-dd'));
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i));

  const getAppts = (day: Date, hour: string) =>
    (weekAppts || []).filter(a => isSameDay(parseISO(a.date), day) && a.time.startsWith(hour.slice(0,2)));

  const handleBlockToggle = (date: string, time: string) => {
    if (isBlocked(date, time)) { unblockSlot(date, time); toast.info('Horario desbloqueado'); }
    else { blockSlot(date, time); toast.success('Horario bloqueado'); }
  };

  return (
    <>
      <Helmet><title>Mi Agenda – Dashboard Médico</title></Helmet>
      <PageHeader title="Mi Agenda"
        action={
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-surface-100 dark:bg-slate-800 rounded-lg p-1">
              {VIEWS.map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize', view === v ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400')}>
                  {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
                </button>
              ))}
            </div>
            <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-lg border border-surface-200 dark:border-slate-700 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors" title="Configurar agenda">
              <Settings className="h-4 w-4 text-slate-500" />
            </button>
            <button onClick={() => setWeekStart(d => addDays(d, -7))} className="p-2 rounded-lg border border-surface-200 dark:border-slate-700 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 min-w-[160px] text-center hidden sm:block">
              {format(weekStart,'dd MMM',{locale:es})} – {format(weekEnd,'dd MMM yyyy',{locale:es})}
            </span>
            <button onClick={() => setWeekStart(d => addDays(d, 7))} className="p-2 rounded-lg border border-surface-200 dark:border-slate-700 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        }
        breadcrumb={[{ label: 'Dashboard Médico', href: '/dashboard/doctor' }, { label: 'Agenda' }]} />

      {view === 'week' && (
        <div className="card overflow-hidden">
          <div className="grid border-b border-surface-200 dark:border-slate-800" style={{ gridTemplateColumns: '60px repeat(6, 1fr)' }}>
            <div className="p-2" />
            {weekDays.map(day => (
              <div key={day.toISOString()} className={cn('p-3 text-center border-l border-surface-100 dark:border-slate-800', isSameDay(day, new Date()) && 'bg-primary-50 dark:bg-primary-950/20')}>
                <p className="text-xs text-slate-400 uppercase">{format(day,'EEE',{locale:es})}</p>
                <p className={cn('text-lg font-bold font-data mt-0.5', isSameDay(day, new Date()) ? 'text-primary-600' : 'text-slate-700 dark:text-slate-300')}>{format(day,'d')}</p>
              </div>
            ))}
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            {HOURS.map(hour => (
              <div key={hour} className="grid border-b border-surface-50 dark:border-slate-800/50 min-h-[56px]" style={{ gridTemplateColumns: '60px repeat(6, 1fr)' }}>
                <div className="p-2 text-xs text-slate-400 text-right pr-3 pt-2">{hour}</div>
                {weekDays.map(day => {
                  const dateStr = format(day,'yyyy-MM-dd');
                  const appts = getAppts(day, hour);
                  const blocked = isBlocked(dateStr, hour);
                  return (
                    <div key={day.toISOString()}
                      className={cn('border-l border-surface-100 dark:border-slate-800 p-1 min-h-[56px] relative group',
                        isSameDay(day, new Date()) && 'bg-primary-50/30 dark:bg-primary-950/10',
                        blocked && 'bg-slate-100 dark:bg-slate-800/70')}
                      onDoubleClick={() => handleBlockToggle(dateStr, hour)}>
                      {blocked && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-40">
                          <Lock className="h-4 w-4 text-slate-500" />
                        </div>
                      )}
                      {!blocked && appts.map(a => (
                        <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className={cn('rounded px-1.5 py-1 text-xs mb-0.5 cursor-pointer border-l-2',
                            a.status === 'completed' ? 'bg-green-50 dark:bg-green-950/30 border-green-400 text-green-700 dark:text-green-400' :
                            a.status === 'cancelled' ? 'bg-red-50 dark:bg-red-950/20 border-red-300 text-red-400' :
                            'bg-primary-50 dark:bg-primary-950/30 border-primary-400 text-primary-700 dark:text-primary-400')}>
                          <p className="font-medium truncate">{a.patientName.split(' ')[0]}</p>
                          <div className="flex items-center gap-0.5 text-[10px] opacity-70">{MODE_ICONS[a.mode]} {a.time}</div>
                        </motion.div>
                      ))}
                      {!blocked && appts.length === 0 && (
                        <button onClick={() => handleBlockToggle(dateStr, hour)}
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-[10px] text-slate-400 bg-surface-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">Bloquear</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 px-5 py-2.5 border-t border-surface-100 dark:border-slate-800">Doble clic en un slot vacío para bloquearlo/desbloquearlo</p>
        </div>
      )}

      {view === 'day' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-slate-800 flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({length:7},(_,i)=>addDays(weekStart,i)).map(day=>(
                <button key={day.toISOString()} onClick={()=>setSelectedDay(day)}
                  className={cn('w-9 h-9 rounded-lg text-xs font-bold transition-colors',
                    isSameDay(day,selectedDay)?'bg-primary-600 text-white':isSameDay(day,new Date())?'border-2 border-primary-400 text-primary-600':'border border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-slate-800')}>
                  {format(day,'d')}
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{format(selectedDay,'EEEE dd MMMM',{locale:es})}</p>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-slate-800">
            {HOURS.map(hour => {
              const appts = (dayAppts||[]).filter(a=>a.time.startsWith(hour.slice(0,2)));
              const dateStr = format(selectedDay,'yyyy-MM-dd');
              const blocked = isBlocked(dateStr, hour);
              return (
                <div key={hour} className={cn('flex gap-4 px-5 py-3 min-h-[56px]', blocked && 'bg-slate-50 dark:bg-slate-800/40')}>
                  <span className="text-xs text-slate-400 w-12 shrink-0 mt-1">{hour}</span>
                  <div className="flex-1">
                    {blocked ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Lock className="h-3.5 w-3.5" />Bloqueado
                        <button onClick={()=>handleBlockToggle(dateStr,hour)} className="text-primary-600 hover:underline ml-2">Desbloquear</button>
                      </div>
                    ) : appts.length === 0 ? (
                      <button onClick={()=>handleBlockToggle(dateStr,hour)} className="text-xs text-slate-300 hover:text-slate-500 transition-colors">+ Bloquear</button>
                    ) : appts.map(a=>(
                      <Link key={a.id} to={`/dashboard/doctor/consultation/${a.id}`}
                        className="flex items-center gap-3 p-2 bg-primary-50 dark:bg-primary-950/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-950/50 transition-colors cursor-pointer mb-1">
                        <img src={a.patientAvatar} alt={a.patientName} className="w-7 h-7 rounded-full object-cover bg-primary-50 shrink-0"/>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{a.patientName}</p>
                          <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1">{MODE_ICONS[a.mode]}{a.mode}</p>
                        </div>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusColors[a.status])}>
                          {a.status==='scheduled'?'Programada':a.status==='completed'?'Completada':'Cancelada'}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings modal */}
      <Modal isOpen={settingsOpen} onClose={()=>setSettingsOpen(false)} title="Configuración de Agenda" size="sm"
        footer={<><button onClick={()=>setSettingsOpen(false)} className="btn-ghost text-sm px-4 py-2">Cerrar</button></>}>
        <div className="space-y-5">
          <div>
            <label className="label-base flex items-center gap-2"><Clock className="h-4 w-4 text-primary-600"/>Duración de consulta</label>
            <div className="flex gap-2 flex-wrap">
              {DURATIONS.map(d=>(
                <button key={d} onClick={()=>{setConsultationDuration(d);toast.success(`Duración: ${d} min`);}}
                  className={cn('px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                    consultationDuration===d?'bg-primary-600 text-white border-primary-600':'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>
                  {d} min
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-base">Horario de trabajo</label>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-400 mb-1 block">Inicio</label><input type="time" defaultValue="08:00" className="input-base text-sm"/></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Fin</label><input type="time" defaultValue="18:00" className="input-base text-sm"/></div>
            </div>
          </div>
          <div>
            <label className="label-base">Días laborables</label>
            <div className="flex gap-2 flex-wrap">
              {['Lun','Mar','Mié','Jue','Vie','Sáb'].map((d,i)=>(
                <button key={d} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  i<5?'bg-primary-600 text-white border-primary-600':'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
