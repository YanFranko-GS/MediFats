import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Users, CheckCircle2, DollarSign, TrendingUp, Clock, Video, Building2, MessageCircle, AlertTriangle, Star, RotateCcw, Bell, Activity, UserPlus, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../../shared/stores/authStore';
import { useDoctorAppointments } from '../../../shared/hooks/useAppointments';
import { useDoctorFinanceKPIs, useDoctorFinanceMonthly, usePendingRequests, useDoctorUnreadCount } from '../../../shared/hooks/useDoctor';
import { useDoctorReviews } from '../../../shared/hooks/useDoctors';
import { PageHeader, KpiCard, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton, SkeletonRow } from '../../../shared/components/atoms/index';
import { cn, formatCurrency, formatDate, statusColors } from '../../../shared/utils';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, AreaChart, Area
} from 'recharts';

const MODE_ICONS: Record<string, React.ReactNode> = {
  'in-person': <Building2 className="h-3.5 w-3.5" />,
  'video': <Video className="h-3.5 w-3.5" />,
  'chat': <MessageCircle className="h-3.5 w-3.5" />,
};
const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Programada', completed: 'Completada', cancelled: 'Cancelada',
  'no-show': 'No asistió', rescheduled: 'Reprogramada',
};

const HEATMAP_DAYS = ['Lun','Mar','Mié','Jue','Vie'];
const HEATMAP_HOURS = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];

export default function DoctorHome() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { data: appointments, isLoading } = useDoctorAppointments();
  const { data: kpis } = useDoctorFinanceKPIs();
  const { data: monthlyFinance } = useDoctorFinanceMonthly(12);
  const { data: pendingReqs } = usePendingRequests();
  const { data: unread } = useDoctorUnreadCount();
  const { data: reviewData } = useDoctorReviews('doc-001', 1);
  const reviews = (reviewData as any)?.data?.data ?? (reviewData as any)?.data ?? [];

  const now = new Date();
  const todayAppts = (appointments || []).filter(a => a.date && isToday(parseISO(a.date)) && a.status === 'scheduled');
  const tomorrowAppts = (appointments || []).filter(a => a.date && isTomorrow(parseISO(a.date)) && a.status === 'scheduled');
  const videoToday = (appointments || []).filter(a => a.date && isToday(parseISO(a.date)) && a.mode === 'video' && a.status === 'scheduled');
  const upcoming = (appointments || []).filter(a => a.status === 'scheduled' && new Date(a.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 8);
  const completed = (appointments || []).filter(a => a.status === 'completed');
  const cancelled = (appointments || []).filter(a => a.status === 'cancelled');

  const chartData = (monthlyFinance || []).map((m: any) => ({
    month: m.month.slice(5),
    ingresos: Math.round(m.revenue / 1000),
    citas: m.consultations,
    nuevos: m.newPatients,
  }));

  const occupancyRate = todayAppts.length > 0 ? Math.round((todayAppts.length / 10) * 100) : 0;

  // Heatmap data (mock)
  const heatData: Record<string, number> = {};
  HEATMAP_DAYS.forEach((d, di) => HEATMAP_HOURS.forEach((h, hi) => {
    const dayPeak = di === 2 ? 1.3 : di >= 3 ? 0.8 : 1.0;
    const hourPeak = hi >= 1 && hi <= 3 ? 1.4 : hi >= 6 ? 0.7 : 1.0;
    heatData[`${d}-${h}`] = Math.round(8 * dayPeak * hourPeak + Math.random() * 3);
  }));
  const maxHeat = Math.max(...Object.values(heatData));

  return (
    <>
      <Helmet><title>Dashboard Médico – MediConnect</title></Helmet>
      <PageHeader
        title={`${t('dashboard.doctorPanel')} · ${user?.name?.split(' ').slice(0, 2).join(' ')}`}
        subtitle={format(now, "EEEE, dd MMMM yyyy", { locale: es })}
        action={
          <Link to="/dashboard/doctor/schedule" className="btn-primary flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" /> {t('dashboard.viewSchedule')}
          </Link>
        }
        breadcrumb={[{ label: t('dashboard.doctorPanel') }]}
      />

      {/* Row 1: 8 KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { icon: <Calendar className="h-5 w-5" />, label: t('dashboard.apptsToday'), value: todayAppts.length, color: 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400', to: '/dashboard/doctor/schedule' },
          { icon: <Users className="h-5 w-5" />, label: t('dashboard.totalPatients'), value: (appointments || []).length, color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400', to: '/dashboard/doctor/patients', change: 12.5 },
          { icon: <CheckCircle2 className="h-5 w-5" />, label: t('dashboard.completed'), value: completed.length, color: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400', to: '/dashboard/doctor/schedule', change: 8.3 },
          { icon: <DollarSign className="h-5 w-5" />, label: t('dashboard.monthRevenue'), value: formatCurrency(kpis?.monthRevenue ?? 0), color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400', to: '/dashboard/doctor/finance', change: kpis?.monthRevenueChange },
          { icon: <UserPlus className="h-5 w-5" />, label: t('dashboard.newPatients'), value: kpis?.totalPatients ?? 0, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400', to: '/dashboard/doctor/patients' },
          { icon: <RefreshCw className="h-5 w-5" />, label: t('dashboard.recurring'), value: kpis?.totalPatients ?? 0, color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400', to: '/dashboard/doctor/patients' },
          { icon: <Video className="h-5 w-5" />, label: t('dashboard.videoConsultations'), value: kpis?.videoconsultations ?? 0, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400', to: '/dashboard/doctor/telemedicine' },
          { icon: <Bell className="h-5 w-5" />, label: t('sidebar.notifications'), value: unread ?? 0, color: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400', to: '/dashboard/doctor/notifications' },
        ].map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={k.to}>
              <div className="card p-4 flex items-center gap-3 hover:shadow-card-md transition-all cursor-pointer">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', k.color)}>{k.icon}</div>
                <div className="min-w-0">
                  <p className="text-xl font-bold font-data text-slate-800 dark:text-slate-100 leading-none">{k.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{k.label}</p>
                  {k.change !== undefined && (
                    <p className={cn('text-xs font-medium', k.change >= 0 ? 'text-green-500' : 'text-red-400')}>
                      {k.change >= 0 ? '↑' : '↓'} {Math.abs(k.change)}%
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Row 2: Today card + Upcoming + Alerts */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Today hero */}
        <div className="card p-5 bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0">
          <p className="text-primary-100 text-xs font-semibold uppercase tracking-wide mb-3">{t('dashboard.today')} · {format(now, 'EEEE dd', { locale: es })}</p>
          <p className="text-5xl font-bold font-data mb-1">{todayAppts.length}</p>
          <p className="text-primary-100 text-sm mb-4">{t('dashboard.scheduledAppts')}</p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary-200">{t('dashboard.occupancyRate')}</span>
              <span className="font-bold">{occupancyRate}%</span>
            </div>
            <div className="h-2 bg-primary-500 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${occupancyRate}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-primary-500 text-sm text-center">
            <div><p className="text-primary-200 text-xs">{t('dashboard.completed')}</p><p className="font-bold">{completed.slice(-5).length}</p></div>
            <div><p className="text-primary-200 text-xs">{t('dashboard.tomorrow')}</p><p className="font-bold">{tomorrowAppts.length}</p></div>
            <div><p className="text-primary-200 text-xs">{t('dashboard.videoToday')}</p><p className="font-bold">{videoToday.length}</p></div>
          </div>
        </div>

        {/* Upcoming appointments */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-primary-600" />Próximas citas</h3>
            <Link to="/dashboard/doctor/schedule" className="text-xs text-primary-600 hover:underline">Ver agenda →</Link>
          </div>
          {isLoading ? <div>{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</div> :
          upcoming.length === 0 ? <div className="py-10 text-center text-sm text-slate-400">Sin citas próximas</div> : (
            <div className="divide-y divide-surface-100 dark:divide-slate-800 max-h-[280px] overflow-y-auto">
              {upcoming.map(appt => (
                <div key={appt.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                  <img src={appt.patientAvatar} alt={appt.patientName} className="w-8 h-8 rounded-full object-cover bg-primary-50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{appt.patientName}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />{formatDate(appt.date, 'dd MMM')}
                      <Clock className="h-3 w-3 ml-1" />{appt.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs text-slate-400 capitalize flex items-center gap-0.5">{MODE_ICONS[appt.mode]}</span>
                    {appt.mode === 'video' && (
                      <Link to={`/dashboard/doctor/consultation/${appt.id}`}
                        className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full font-medium hover:bg-primary-700 transition-colors">
                        Entrar
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts + Requests */}
        <div className="space-y-3">
          {/* Pending requests */}
          <div className="card p-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2 mb-3">
              <RotateCcw className="h-4 w-4 text-amber-500" />
              Solicitudes pendientes
              {(pendingReqs || []).length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{(pendingReqs || []).length}</span>
              )}
            </h3>
            {(pendingReqs || []).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">Sin solicitudes pendientes</p>
            ) : (
              <div className="space-y-2">
                {(pendingReqs as unknown as any[] || []).slice(0, 3).map((req: any) => (
                  <div key={req.id} className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <img src={req.patientAvatar} alt={req.patientName} className="w-7 h-7 rounded-full object-cover bg-primary-50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{req.patientName}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 capitalize">{req.type === 'reschedule' ? 'Reprogramación' : req.type === 'cancel' ? 'Cancelación' : 'Urgente'}</p>
                    </div>
                    <Link to="/dashboard/doctor/requests" className="text-xs text-primary-600 font-medium hover:underline shrink-0">Ver</Link>
                  </div>
                ))}
                {(pendingReqs || []).length > 3 && (
                  <Link to="/dashboard/doctor/requests" className="text-xs text-primary-600 hover:underline block text-center">
                    +{(pendingReqs || []).length - 3} más
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Alerts */}
          <div className="card p-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-500" />Alertas médicas
            </h3>
            <div className="space-y-2">
              {[
                { text: 'Resultado crítico: Hemograma de Carlos P.', color: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400', urgent: true },
                { text: 'Seguimiento pendiente: Ana G. – 3 días sin respuesta', color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400', urgent: false },
                { text: '2 recetas próximas a vencer esta semana', color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400', urgent: false },
              ].map((a, i) => (
                <div key={i} className={cn('flex items-start gap-2 p-2 rounded-lg text-xs', a.color)}>
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{a.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Charts */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Revenue bars */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2"><DollarSign className="h-4 w-4 text-amber-500" />Ingresos mensuales (12 meses)</h3>
          <p className="text-xs text-slate-400 mb-4">Miles de USD</p>
          {!chartData.length ? <Skeleton className="h-48" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
                <Bar dataKey="ingresos" name="Ingresos (k$)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Reservas line */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary-600" />Reservas últimos 12 meses</h3>
          <p className="text-xs text-slate-400 mb-4">Consultas por mes</p>
          {!chartData.length ? <Skeleton className="h-48" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} /><stop offset="95%" stopColor="#2563EB" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
                <Area type="monotone" dataKey="citas" name="Citas" stroke="#2563EB" fill="url(#gc)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row 4: Heatmap + Latest reviews */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Demand heatmap */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-teal-600" />Horarios con más demanda</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left text-slate-400 font-normal pr-3 pb-2">Hora</th>
                  {HEATMAP_DAYS.map(d => <th key={d} className="text-center text-slate-400 font-normal px-1 pb-2 min-w-[50px]">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {HEATMAP_HOURS.map(hour => (
                  <tr key={hour}>
                    <td className="text-slate-400 pr-3 py-0.5 whitespace-nowrap">{hour}</td>
                    {HEATMAP_DAYS.map(day => {
                      const val = heatData[`${day}-${hour}`] || 0;
                      const intensity = val / maxHeat;
                      return (
                        <td key={day} className="px-1 py-0.5">
                          <div className="w-full h-7 rounded flex items-center justify-center text-xs font-bold transition-all"
                            style={{ background: `rgba(37,99,235,${0.07 + intensity * 0.85})`, color: intensity > 0.5 ? 'white' : '#2563EB' }}
                            title={`${day} ${hour}: ${val} citas`}>
                            {val}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest reviews */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" />Últimas reseñas</h3>
            <Link to="/dashboard/doctor/reviews" className="text-xs text-primary-600 hover:underline">Ver todas →</Link>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-slate-800">
            {(reviews as unknown as any[]).slice(0, 4).map((r: any) => (
              <div key={r.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">{r.patientName}</p>
                  <div className="flex gap-0.5 shrink-0">{[1,2,3,4,5].map(j => <svg key={j} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn('h-3 w-3', j <= r.rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-200')} stroke="currentColor" strokeWidth={1.5}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{r.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <div className="py-8 text-center text-xs text-slate-400">Sin reseñas aún</div>}
          </div>
        </div>
      </div>
    </>
  );
}
