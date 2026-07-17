import React from 'react';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, TrendingDown, Users, Activity, Star, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { PageHeader, KpiCard } from '../../../shared/components/molecules/StatusComponents';
import { SaasKpiCard } from '../components/SaasKpiCard';
import { Skeleton } from '../../../shared/components/atoms/index';
import { useExecutiveKPIs, useMRRHistory } from '../hooks/useAdminMaster';
import { formatCurrency, formatPercentage, cn } from '../../../shared/utils';


export default function AdminAnalytics() {
  const { data: kpis, isLoading } = useExecutiveKPIs();
  const { data: mrr = [] } = useMRRHistory();

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(8)].map((_,i)=><Skeleton key={i} className="h-24"/>)}</div>
    </div>
  );

  const gaugeData = [{ name:'MRR', value: kpis?.mrrProgress || 0, fill:'#3b82f6' }];

  return (
    <>
      <Helmet><title>Analytics – Admin MediConnect</title></Helmet>
      <PageHeader title="Dashboard Ejecutivo" subtitle="KPIs SaaS en tiempo real" breadcrumb={[{label:'Admin'},{label:'Analytics'}]}/>

      <div className="mb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Métricas SaaS</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { title:'MRR', value: formatCurrency(kpis?.mrr||0), sub:`${kpis?.mrrProgress}% del objetivo`, positive:true, icon:<TrendingUp className="h-4 w-4"/> },
            { title:'ARR', value: formatCurrency(kpis?.arr||0), sub:'+18% YoY', positive:true, icon:<TrendingUp className="h-4 w-4"/> },
            { title:'ARPU', value: formatCurrency(kpis?.arpu||0), sub:'por usuario', positive:true, icon:<Users className="h-4 w-4"/> },
            { title:'LTV', value: formatCurrency(kpis?.ltv||0), sub:'vida media 24 meses', positive:true, icon:<Star className="h-4 w-4"/> },
            { title:'CAC', value: formatCurrency(kpis?.cac||0), sub:'costo adquisición', positive:true, icon:<TrendingDown className="h-4 w-4"/> },
            { title:'NPS', value: kpis?.nps, sub:'excelente (>70)', positive:true, icon:<Star className="h-4 w-4"/> },
            { title:'Churn', value: formatPercentage(kpis?.churnRate||0), sub:'tasa abandono mensual', positive:false, icon:<TrendingDown className="h-4 w-4"/> },
          ].map(m => <SaasKpiCard key={m.title} {...m}/>)}
        </div>
      </div>

      <div className="mb-2 mt-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">KPIs Operacionales – Hoy</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title:'Usuarios activos', value: kpis?.activeUsersToday, icon:<Users className="h-5 w-5"/> },
            { title:'Médicos activos', value: kpis?.activeDoctorsToday, icon:<Activity className="h-5 w-5"/> },
            { title:'Consultas hoy', value: kpis?.consultationsToday, icon:<Activity className="h-5 w-5"/> },
            { title:'Conversión', value: formatPercentage(kpis?.conversionRate||0), icon:<TrendingUp className="h-5 w-5"/> },
            { title:'Satisfacción', value: `⭐ ${kpis?.avgSatisfaction}`, icon:<Star className="h-5 w-5"/> },
            { title:'T. medio reserva', value: `${kpis?.avgBookingTime}min`, icon:<Clock className="h-5 w-5"/> },
          ].map(k => (
            <KpiCard key={k.title} title={k.title} value={String(k.value)} icon={k.icon}/>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">Evolución MRR (12 meses)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mrr}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={(v:any)=>formatCurrency(v)} contentStyle={{background:'var(--color-surface-50)',border:'1px solid var(--color-surface-200)',borderRadius:'12px',fontSize:'12px'}}/>
              <Line type="monotone" dataKey="mrr" name="MRR" stroke="#3b82f6" strokeWidth={2.5} dot={{r:3,fill:'#3b82f6'}}/>
              <Line type="monotone" dataKey="arpu" name="ARPU" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="4 4"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 flex flex-col items-center justify-center">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-2 self-start">Progreso vs Objetivo MRR</h3>
          <div className="relative">
            <RadialBarChart width={180} height={180} cx={90} cy={90} innerRadius={55} outerRadius={80} startAngle={90} endAngle={-270} data={gaugeData}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#3b82f6" background={{fill:'var(--color-surface-100)'}}/>
            </RadialBarChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{kpis?.mrrProgress}%</p>
              <p className="text-xs text-slate-400">del objetivo</p>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-2">{formatCurrency(kpis?.mrr||0)} / {formatCurrency(kpis?.mrrGoal||0)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Meta mensual</p>
        </div>
      </div>
    </>
  );
}
