import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DollarSign, Calendar, Users, TrendingUp, Activity, XCircle, CheckCircle2, TrendingDown, Star, Clock, ArrowUpRight, ArrowDownRight, LogIn } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  RadialBarChart, RadialBar,
} from 'recharts';
import {
  useAdminKPIs, useMonthlyMetrics, useDoctorPerformance,
  useSpecialtyBreakdown, useAppointmentFunnel, useRecentActivity, useRetentionMetrics,
} from '../../../shared/hooks/useAdmin';
import { useExecutiveKPIs, useMRRHistory } from '../hooks/useAdminMaster';
import { useAdminMasterStore } from '../store/adminMasterStore';
import { PageHeader, KpiCard } from '../../../shared/components/molecules/StatusComponents';
import { SaasKpiCard } from '../components/SaasKpiCard';
import { Skeleton, Badge } from '../../../shared/components/atoms/index';
import { formatCurrency, formatNumber, formatPercentage, formatRelative, cn } from '../../../shared/utils';
import { useTranslation } from 'react-i18next';

const COLORS = ['#2563EB','#14B8A6','#F59E0B','#EF4444','#8B5CF6','#EC4899','#10B981','#F97316'];
const ACT_ICONS: Record<string,React.ReactNode> = {
  book:<CheckCircle2 className="h-4 w-4 text-green-500"/>,
  cancel:<XCircle className="h-4 w-4 text-red-400"/>,
  complete:<Activity className="h-4 w-4 text-primary-500"/>,
};


function ImpersonationBanner() {
  const { impersonatingUserName, setImpersonating } = useAdminMasterStore();
  if (!impersonatingUserName) return null;
  return (
    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
      className="mb-4 p-3 bg-amber-500 rounded-xl flex items-center gap-3 text-white text-sm font-medium">
      <span className="flex items-center gap-2 flex-1"><LogIn className="h-4 w-4"/>Estás impersonando a <strong>{impersonatingUserName}</strong>. Vista de su panel activa (simulado).</span>
      <button onClick={() => setImpersonating(null, null)}
        className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 text-xs font-semibold transition-colors">
        Salir
      </button>
    </motion.div>
  );
}

export default function AdminHome() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<6|12|24>(12);
  const { data: kpis, isLoading: loadingKPIs } = useAdminKPIs();
  const { data: metrics, isLoading: loadingMetrics } = useMonthlyMetrics(period);
  const { data: doctorPerf } = useDoctorPerformance();
  const { data: specBreak } = useSpecialtyBreakdown();
  const { data: funnel } = useAppointmentFunnel();
  const { data: activity } = useRecentActivity(15);
  const { data: retention } = useRetentionMetrics();
  const { data: execKPIs, isLoading: loadingExec } = useExecutiveKPIs();
  const { data: mrrHistory = [] } = useMRRHistory();

  const chartData = (metrics||[]).map(m => ({
    month: m.month.slice(5),
    citas: m.appointments,
    ingresos: Math.round(m.revenue / 1000),
    pacientes: m.newPatients,
    cancelaciones: m.cancellations,
  }));

  const mrrGoalPct = execKPIs?.mrrProgress || 0;
  const gaugeData = [{ name:'MRR', value: mrrGoalPct, fill:'#2563EB' }];

  return (
    <>
      <Helmet><title>Panel Admin CEO – MediConnect</title></Helmet>
      <ImpersonationBanner/>
      <PageHeader
        title={t('dashboard.adminPanel')}
        subtitle={t('dashboard.platformOverview')}
        action={
          <div className="flex gap-2">
            {([6,12,24] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  period === p
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-slate-800')}>
                {p}M
              </button>
            ))}
          </div>
        }
        breadcrumb={[{label:'Admin'},{label:'Dashboard Ejecutivo'}]}
      />

      {/* ── ROW 1: SaaS KPIs ──────────────────────────────────────────────── */}
      <div className="mb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span className="h-px flex-1 bg-surface-200 dark:bg-slate-800"/>KPIs SaaS<span className="h-px flex-1 bg-surface-200 dark:bg-slate-800"/>
        </p>
        {loadingExec
          ? <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">{[...Array(7)].map((_,i)=><Skeleton key={i} className="h-24"/>)}</div>
          : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <SaasKpiCard title="MRR" value={formatCurrency(execKPIs?.mrr||0)} sub="+12.4% vs anterior" positive trend={12.4}/>
              <SaasKpiCard title="ARR" value={formatCurrency(execKPIs?.arr||0)} sub="Proyectado anual" positive trend={12.4}/>
              <SaasKpiCard title="ARPU" value={formatCurrency(execKPIs?.arpu||0)} sub="por usuario activo" positive trend={4.6}/>
              <SaasKpiCard title="LTV" value={formatCurrency(execKPIs?.ltv||0)} sub="vida media 24m" positive/>
              <SaasKpiCard title="CAC" value={formatCurrency(execKPIs?.cac||0)} sub="costo adquisición"/>
              <SaasKpiCard title="NPS" value={execKPIs?.nps||0} sub="Excelente (>70)" positive trend={3}/>
              <SaasKpiCard title="Churn" value={formatPercentage(execKPIs?.churnRate||0)} sub="tasa mensual" positive={false} trend={-(execKPIs?.churnRate||0)}/>
            </div>
          )
        }
      </div>

      {/* ── ROW 2: Operational KPIs ───────────────────────────────────────── */}
      <div className="mb-6 mt-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span className="h-px flex-1 bg-surface-200 dark:bg-slate-800"/>KPIs Operacionales – Hoy<span className="h-px flex-1 bg-surface-200 dark:bg-slate-800"/>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {loadingKPIs || loadingExec
            ? [...Array(6)].map((_,i)=><Skeleton key={i} className="h-24"/>)
            : <>
              <KpiCard title={t('dashboard.totalRevenue')} value={formatCurrency(kpis?.totalRevenue||0)} icon={<DollarSign className="h-5 w-5"/>} change={kpis?.revenueGrowth}/>
              <KpiCard title={t('dashboard.totalConsultations')} value={formatNumber(kpis?.totalAppointments||0)} icon={<Calendar className="h-5 w-5"/>}
                iconColor="bg-secondary-50 text-secondary-600 dark:bg-secondary-950/30 dark:text-secondary-400" change={kpis?.appointmentGrowth}/>
              <KpiCard title={t('dashboard.activeUsers')} value={execKPIs?.activeUsersToday||0} icon={<Users className="h-5 w-5"/>}
                iconColor="bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400"/>
              <KpiCard title={t('dashboard.consultedDoctors')} value={execKPIs?.consultationsToday||0} icon={<Activity className="h-5 w-5"/>}
                iconColor="bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400"/>
              <KpiCard title={t('dashboard.verifiedDoctors')} value={`${execKPIs?.avgSatisfaction||0} / 5`} icon={<Star className="h-5 w-5"/>}
                iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"/>
              <KpiCard title={t('dashboard.activeClinics')} value={`${execKPIs?.conversionRate||0}%`} icon={<TrendingUp className="h-5 w-5"/>}
                iconColor="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"/>
            </>
          }
        </div>
      </div>

      {/* ── ROW 3: Charts ─────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* MRR trend */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Revenue e ingresos ({period} meses)</h3>
            <Badge variant="success" size="sm" dot>En objetivo</Badge>
          </div>
          {loadingMetrics ? <Skeleton className="h-52"/> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gi2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gc2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.18}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:'var(--color-surface-50)',border:'1px solid var(--color-surface-200)',borderRadius:'12px',fontSize:'11px'}}/>
                <Legend wrapperStyle={{fontSize:'11px'}}/>
                <Area type="monotone" dataKey="ingresos" name="Ingresos (k$)" stroke="#2563EB" fill="url(#gi2)" strokeWidth={2.5}/>
                <Area type="monotone" dataKey="citas" name="Citas" stroke="#14B8A6" fill="url(#gc2)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* MRR vs Goal gauge */}
        <div className="card p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">MRR vs Objetivo</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            {loadingExec ? <Skeleton className="h-40 w-40 rounded-full"/> : (
              <>
                <div className="relative">
                  <RadialBarChart width={160} height={160} cx={80} cy={80} innerRadius={50} outerRadius={72} startAngle={90} endAngle={-270} data={gaugeData}>
                    <RadialBar dataKey="value" cornerRadius={8} background={{fill:'var(--color-surface-100)'}}/>
                  </RadialBarChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{mrrGoalPct}%</p>
                    <p className="text-xs text-slate-400">del objetivo</p>
                  </div>
                </div>
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Actual</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(execKPIs?.mrr||0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Objetivo</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(execKPIs?.mrrGoal||0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Faltante</span>
                    <span className="font-semibold text-amber-600">{formatCurrency((execKPIs?.mrrGoal||0)-(execKPIs?.mrr||0))}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── ROW 4: Specialty + Funnel + Retention ─────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Specialty pie */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Citas por especialidad</h3>
          {!specBreak ? <Skeleton className="h-48"/> : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={(specBreak||[]).slice(0,6)} dataKey="count" nameKey="specialty" cx="50%" cy="50%" outerRadius={65} innerRadius={30}>
                    {(specBreak||[]).slice(0,6).map((_:any,i:number) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:'var(--color-surface-50)',border:'1px solid var(--color-surface-200)',borderRadius:'12px',fontSize:'11px'}}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {(specBreak||[]).slice(0,4).map((s:any,i:number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{background:COLORS[i%COLORS.length]}}/>
                      <span className="text-slate-600 dark:text-slate-400 truncate max-w-[100px]">{s.specialty}</span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Conversion funnel */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Embudo de conversión</h3>
            <Link to="/dashboard/admin/analytics/funnel" className="text-xs text-primary-600 hover:underline">Ver completo →</Link>
          </div>
          {!funnel ? <Skeleton className="h-48"/> : (
            <div className="space-y-2">
              {(funnel||[]).map((stage:any,i:number) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400 truncate max-w-[160px]">{stage.stage}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{formatNumber(stage.count)}</span>
                  </div>
                  <div className="h-5 bg-surface-100 dark:bg-slate-800 rounded overflow-hidden">
                    <motion.div initial={{width:0}} animate={{width:`${stage.percentage}%`}} transition={{delay:i*0.1,duration:0.6}}
                      className="h-full rounded flex items-center justify-end pr-1.5" style={{background:COLORS[i%COLORS.length]}}>
                      {stage.percentage > 20 && <span className="text-white text-xs font-bold">{stage.percentage}%</span>}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Retention ring */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Retención de pacientes</h3>
          {!retention ? <Skeleton className="h-48"/> : (
            <>
              <div className="relative h-32 flex items-center justify-center mb-4">
                <svg viewBox="0 0 120 120" className="w-28 h-28">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-surface-100)" strokeWidth="12" className="dark:stroke-slate-800"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#2563EB" strokeWidth="12"
                    strokeDasharray={`${(retention.returningPatients/(retention.returningPatients+retention.newPatients))*314} 314`}
                    strokeLinecap="round" transform="rotate(-90 60 60)"/>
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-bold font-data text-primary-600">
                    {((retention.returningPatients/(retention.returningPatients+retention.newPatients))*100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-slate-400">Recurrentes</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {l:'Recurrentes',v:formatNumber(retention.returningPatients),c:'text-primary-600'},
                  {l:'Nuevos',v:formatNumber(retention.newPatients),c:'text-green-600'},
                  {l:'Churn rate',v:formatPercentage(retention.churnRate),c:'text-red-500'},
                  {l:'Sesiones/pac',v:retention.avgSessionsPerPatient,c:'text-amber-500'},
                ].map(({l,v,c})=>(
                  <div key={l} className="text-center bg-surface-50 dark:bg-slate-800/60 rounded-xl p-2">
                    <p className={cn('text-base font-bold font-data',c)}>{v}</p>
                    <p className="text-xs text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── ROW 5: Doctor performance + Activity feed ──────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Top médicos por ingresos</h3>
            <Link to="/dashboard/admin/doctors" className="text-xs text-primary-600 hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-slate-800">
            {(!doctorPerf ? [...Array(5)] : (doctorPerf||[]).slice(0,6)).map((doc:any,i:number) => (
              !doc ? <div key={i} className="p-3"><Skeleton className="h-10"/></div> : (
                <div key={doc.doctorId} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-xs font-bold font-data text-slate-400 w-4">#{i+1}</span>
                  <img src={doc.avatar} alt={doc.doctorName} className="w-8 h-8 rounded-lg bg-primary-50 object-cover"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{doc.doctorName}</p>
                    <p className="text-xs text-slate-400 truncate">{doc.specialty}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{doc.totalAppointments} citas</p>
                    <p className="text-xs text-amber-500 flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400"/>{doc.avgRating}</p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-xs font-semibold text-green-600">{formatCurrency(doc.revenue)}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Actividad reciente</h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>Live
              </span>
              <Link to="/dashboard/admin/activity" className="text-xs text-primary-600 hover:underline">Ver todo →</Link>
            </div>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-slate-800 max-h-[340px] overflow-y-auto">
            {(!activity ? [...Array(6)] : activity).map((act:any,i:number) => (
              !act ? <div key={i} className="p-3"><Skeleton className="h-10"/></div> : (
                <div key={act.id} className="flex items-start gap-3 px-5 py-3 hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-surface-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {ACT_ICONS[act.type] || <Activity className="h-3.5 w-3.5 text-slate-400"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{act.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400 truncate">{act.user}</span>
                      {act.meta && <span className="text-xs text-primary-400 truncate">· {act.meta}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{formatRelative(act.timestamp)}</span>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
