import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Video, Clock, Calendar, CheckCircle2, Monitor } from 'lucide-react';
import { usePatientAppointments } from '../../../shared/hooks/useAppointments';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton } from '../../../shared/components/atoms/index';
import { formatDate, formatCurrency, cn } from '../../../shared/utils';

export default function PatientTelemedicine() {
  const { t } = useTranslation();
  const { data: appointments, isLoading } = usePatientAppointments();
  const videoAppts = (appointments || []).filter((a: any) => a.mode === 'video').sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const upcoming = videoAppts.filter((a: any) => a.status === 'scheduled' && new Date(a.date) >= new Date());
  const history = videoAppts.filter((a: any) => a.status === 'completed');
  const next = upcoming[0];

  return (
    <>
      <Helmet><title>Teleconsultas – MediConnect</title></Helmet>
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
            <button className="bg-white text-primary-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-2 text-sm shrink-0">
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
                <img src={a.doctorAvatar} alt={a.doctorName} className="w-10 h-10 rounded-xl object-cover bg-primary-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{a.doctorName}</p>
                  <p className="text-xs text-slate-400">{formatDate(a.date, 'dd MMM yyyy')} · {a.time}</p>
                </div>
                <button className="text-xs text-primary-600 font-medium hover:underline">Entrar</button>
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
                <img src={a.doctorAvatar} alt={a.doctorName} className="w-9 h-9 rounded-xl object-cover bg-primary-50 shrink-0" />
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
    </>
  );
}
