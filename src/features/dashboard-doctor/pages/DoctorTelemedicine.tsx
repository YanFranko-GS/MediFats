import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Monitor, CheckCircle2, Calendar, Clock } from 'lucide-react';
import { useDoctorAppointments } from '../../../shared/hooks/useAppointments';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton, AvatarImg } from '../../../shared/components/atoms/index';
import { cn, formatDate, formatCurrency } from '../../../shared/utils';
import { isToday, isTomorrow, parseISO, format } from 'date-fns';

export default function DoctorTelemedicine() {
  const { data: appointments, isLoading } = useDoctorAppointments();
  const videoAppts = (appointments || []).filter((a: any) => a.mode === 'video');
  const upcoming = videoAppts.filter((a: any) => {
    if (a.status !== 'scheduled' || !a.date) return false;
    const dateStr = a.date.includes('T') ? a.date.split('T')[0] : a.date;
    return dateStr >= format(new Date(), 'yyyy-MM-dd');
  }).sort((a: any, b: any) => {
    const dateA = a.date.includes('T') ? a.date.split('T')[0] : a.date;
    const dateB = b.date.includes('T') ? b.date.split('T')[0] : b.date;
    const timeA = `${dateA}T${a.time || '00:00'}`;
    const timeB = `${dateB}T${b.time || '00:00'}`;
    return timeA.localeCompare(timeB);
  });
  const history = videoAppts.filter((a: any) => a.status === 'completed')
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const next = upcoming[0];

  return (
    <>
      <Helmet><title>Telemedicina – Dashboard Médico</title></Helmet>
      <PageHeader title="Telemedicina" subtitle="Gestión de videoconsultas"
        action={<Link to="/dashboard/doctor/schedule" className="btn-primary flex items-center gap-2 text-sm"><Calendar className="h-4 w-4"/>Ver agenda</Link>}
        breadcrumb={[{label:'Dashboard Médico',href:'/dashboard/doctor'},{label:'Telemedicina'}]} />

      {/* Next call hero */}
      {next ? (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
          className="card p-6 mb-6 bg-gradient-to-br from-indigo-600 to-primary-700 text-white border-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Video className="h-7 w-7 text-white"/>
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wide mb-1">
                  {isToday(parseISO(next.date)) ? 'Próxima videollamada · HOY' : isTomorrow(parseISO(next.date)) ? 'Próxima videollamada · MAÑANA' : 'Próxima videollamada'}
                </p>
                <p className="font-heading font-bold text-xl text-white">{next.patientName}</p>
                <div className="flex items-center gap-3 mt-1.5 text-sm text-indigo-200">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/>{formatDate(next.date,'dd MMM')}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4"/>{next.time}</span>
                  <span>{formatCurrency(next.price)}</span>
                </div>
              </div>
            </div>
            <Link to={`/dashboard/doctor/consultation/${next.id}`}
              className="bg-white text-indigo-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm shrink-0">
              <Monitor className="h-4 w-4"/> Entrar a consulta
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="card p-8 mb-6 text-center">
          <Video className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-3"/>
          <p className="font-medium text-slate-600 dark:text-slate-400 mb-2">Sin videollamadas próximas</p>
          <p className="text-sm text-slate-400">Las consultas virtuales programadas aparecerán aquí.</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upcoming */}
        {upcoming.length > 1 && (
          <div className="card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-surface-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Próximas videoconsultas ({upcoming.length})</h3>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-slate-800">
              {upcoming.slice(1).map((a: any) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                  <AvatarImg src={a.patientAvatar} alt={a.patientName} className="w-9 h-9 rounded-full object-cover bg-primary-50 shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{a.patientName}</p>
                    <p className="text-xs text-slate-400">{formatDate(a.date,'dd MMM yyyy')} · {a.time}</p>
                  </div>
                  <Link to={`/dashboard/doctor/consultation/${a.id}`}
                    className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors font-medium shrink-0">
                    Entrar
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Historial de videoconsultas</h3>
            <span className="text-xs text-slate-400">{history.length} realizadas</span>
          </div>
          {isLoading ? <div className="p-3 space-y-2">{[...Array(4)].map((_,i)=><Skeleton key={i} className="h-14"/>)}</div> :
          history.length === 0 ? <div className="py-10 text-center text-sm text-slate-400">Sin historial de videoconsultas</div> : (
            <div className="divide-y divide-surface-100 dark:divide-slate-800 max-h-[400px] overflow-y-auto">
              {history.slice(0, 10).map((a: any) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                  <AvatarImg src={a.patientAvatar} alt={a.patientName} className="w-8 h-8 rounded-full object-cover bg-primary-50 shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{a.patientName}</p>
                    <p className="text-xs text-slate-400">{formatDate(a.date,'dd MMM yyyy')} · {a.time}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle2 className="h-3.5 w-3.5"/>Completada</span>
                    <span className="text-xs text-slate-400 hidden sm:block">{formatCurrency(a.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
