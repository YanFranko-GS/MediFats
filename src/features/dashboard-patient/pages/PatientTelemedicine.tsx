import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Video, Clock, Calendar, CheckCircle2, Monitor, Mic, MicOff, VideoOff, PhoneOff, Wifi } from 'lucide-react';
import { usePatientAppointments } from '../../../shared/hooks/useAppointments';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { Skeleton, AvatarImg } from '../../../shared/components/atoms/index';
import { formatDate, formatCurrency, cn } from '../../../shared/utils';
import { toast } from 'sonner';

export default function PatientTelemedicine() {
  const { t } = useTranslation();
  const { data: appointments, isLoading } = usePatientAppointments();
  const [joinTarget, setJoinTarget] = useState<any>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [inCall, setInCall] = useState(false);

  const openWaitingRoom = (appt: any) => { setJoinTarget(appt); setInCall(false); setMicOn(true); setCamOn(true); };
  const closeWaitingRoom = () => { setJoinTarget(null); setInCall(false); };

  const handleEnterCall = () => {
    setInCall(true);
    toast.success(`Consulta iniciada con ${joinTarget.doctorName}`, { description: 'Esta es una simulación de la sala de videollamada.' });
  };

  const handleEndCall = () => {
    toast.info('Llamada finalizada');
    closeWaitingRoom();
  };

  const videoAppts = (appointments || []).filter((a: any) => a.mode === 'video').sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const upcoming = videoAppts.filter((a: any) => a.status === 'scheduled' && new Date(a.date) >= new Date());
  const history = videoAppts.filter((a: any) => a.status === 'completed');
  const next = upcoming[0];

  return (
    <>
      <Helmet><title>Teleconsultas – SmartSalud</title></Helmet>
      <PageHeader title="Teleconsultas" subtitle="Tus consultas médicas virtuales"
        action={<Link to="/dashboard/patient/find-doctors" className="btn-primary flex items-center gap-2 text-sm"><Video className="h-4 w-4" />Reservar teleconsulta</Link>}
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Teleconsultas' }]} />

      {/* Next video call highlight */}
      {next ? (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Video className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary-200 uppercase tracking-wide mb-1">Próxima videollamada</p>
                <p className="font-heading font-bold text-xl text-white">{next.doctorName}</p>
                <p className="text-primary-200 text-sm">{next.doctorSpecialty}</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-primary-100">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(next.date, 'EEEE dd MMM')}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{next.time}</span>
                </div>
              </div>
            </div>
            <button onClick={() => openWaitingRoom(next)}
              className="bg-white text-primary-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-2 text-sm shrink-0">
              <Monitor className="h-4 w-4" /> Entrar a consulta
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="card p-8 mb-6 text-center">
          <Video className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
          <p className="font-medium text-slate-600 dark:text-slate-400 mb-2">No tienes videollamadas próximas</p>
          <Link to="/dashboard/patient/find-doctors" className="btn-primary text-sm inline-flex items-center gap-2 mt-2">
            <Video className="h-4 w-4" /> Reservar teleconsulta
          </Link>
        </div>
      )}

      {/* Upcoming video calls */}
      {upcoming.length > 1 && (
        <div className="card overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Próximas teleconsultas ({upcoming.length})</h3>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-slate-800">
            {upcoming.slice(1).map((a: any) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3.5">
                <AvatarImg src={a.doctorAvatar} alt={a.doctorName} className="w-10 h-10 rounded-xl object-cover bg-primary-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{a.doctorName}</p>
                  <p className="text-xs text-slate-400">{formatDate(a.date, 'dd MMM yyyy')} · {a.time}</p>
                </div>
                <button onClick={() => openWaitingRoom(a)} className="text-xs text-primary-600 font-medium hover:underline">Entrar</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Historial de teleconsultas</h3>
          <span className="text-xs text-slate-400">{history.length} consultas</span>
        </div>
        {isLoading ? <div className="p-4 space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div> :
        history.length === 0 ? <div className="py-10 text-center text-sm text-slate-400">Sin historial de teleconsultas</div> : (
          <div className="divide-y divide-surface-100 dark:divide-slate-800">
            {history.slice(0, 10).map((a: any) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                <AvatarImg src={a.doctorAvatar} alt={a.doctorName} className="w-9 h-9 rounded-xl object-cover bg-primary-50 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{a.doctorName}</p>
                  <p className="text-xs text-slate-400">{a.doctorSpecialty} · {formatDate(a.date, 'dd MMM yyyy')} · {a.time}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle2 className="h-3.5 w-3.5" />Completada</span>
                  <span className="text-xs text-slate-500 hidden sm:block">{formatCurrency(a.price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Virtual waiting room / call modal */}
      <Modal isOpen={!!joinTarget} onClose={closeWaitingRoom} title={inCall ? 'Consulta en curso' : 'Sala de espera virtual'} size="md">
        {joinTarget && !inCall && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-slate-800 rounded-xl">
              <AvatarImg src={joinTarget.doctorAvatar} alt={joinTarget.doctorName} className="w-12 h-12 rounded-xl object-cover bg-primary-50" />
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{joinTarget.doctorName}</p>
                <p className="text-xs text-slate-400">{joinTarget.doctorSpecialty} · {formatDate(joinTarget.date, 'dd MMM yyyy')} · {joinTarget.time}</p>
              </div>
            </div>

            <div className="relative bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center h-48">
              {camOn ? (
                <div className="text-center text-slate-400">
                  <Video className="h-10 w-10 mx-auto mb-2 opacity-60" />
                  <p className="text-xs">Vista previa de cámara (simulada)</p>
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <VideoOff className="h-10 w-10 mx-auto mb-2" />
                  <p className="text-xs">Cámara desactivada</p>
                </div>
              )}
              <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">
                <Wifi className="h-3 w-3 text-green-400" /> Conexión estable
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setMicOn(v => !v)}
                className={cn('w-11 h-11 rounded-full flex items-center justify-center transition-colors', micOn ? 'bg-surface-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-red-100 dark:bg-red-950/30 text-red-600')}>
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>
              <button onClick={() => setCamOn(v => !v)}
                className={cn('w-11 h-11 rounded-full flex items-center justify-center transition-colors', camOn ? 'bg-surface-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-red-100 dark:bg-red-950/30 text-red-600')}>
                {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>
            </div>

            <p className="text-xs text-center text-slate-400">Verifica tu cámara y micrófono antes de ingresar. Tu médico será notificado cuando entres a la sala.</p>

            <button onClick={handleEnterCall} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              <Monitor className="h-4 w-4" /> Ingresar a la consulta
            </button>
          </div>
        )}

        {joinTarget && inCall && (
          <div className="space-y-4">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center h-64">
              <div className="text-center text-slate-300">
                <AvatarImg src={joinTarget.doctorAvatar} alt={joinTarget.doctorName} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" />
                <p className="text-sm font-medium">{joinTarget.doctorName}</p>
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> En consulta · simulación
                </p>
              </div>
              {camOn && (
                <div className="absolute bottom-3 right-3 w-20 h-14 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center">
                  <Video className="h-4 w-4 text-slate-400" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setMicOn(v => !v)}
                className={cn('w-11 h-11 rounded-full flex items-center justify-center transition-colors', micOn ? 'bg-surface-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-red-100 dark:bg-red-950/30 text-red-600')}>
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>
              <button onClick={() => setCamOn(v => !v)}
                className={cn('w-11 h-11 rounded-full flex items-center justify-center transition-colors', camOn ? 'bg-surface-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-red-100 dark:bg-red-950/30 text-red-600')}>
                {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>
              <button onClick={handleEndCall} className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors">
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
