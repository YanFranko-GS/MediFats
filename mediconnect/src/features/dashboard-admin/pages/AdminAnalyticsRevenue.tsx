import React from 'react';
import { DollarSign, TrendingUp, Users, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PageHeader, KpiCard } from '../../../shared/components/molecules/StatusComponents';
import { useMRRHistory, useExecutiveKPIs } from '../hooks/useAdminMaster';
import { formatCurrency } from '../../../shared/utils';

const REVENUE_TYPE = [
  { month:'Ene', presencial:18000, online:12000 }, { month:'Feb', presencial:19500, online:13000 },
  { month:'Mar', presencial:21000, online:15500 }, { month:'Abr', presencial:22000, online:16800 },
  { month:'May', presencial:24500, online:18200 }, { month:'Jun', presencial:26000, online:20100 },
];

export default function AdminAnalyticsRevenue() {
  const { data: mrr = [] } = useMRRHistory();
  const { data: kpis } = useExecutiveKPIs();
  const arrData = mrr.map(m => ({ ...m, arr: m.mrr * 12 }));
  return (
    <>
      <Helmet><title>Revenue Analytics – Admin</title></Helmet>
      <PageHeader title="Revenue Analytics" subtitle="Métricas financieras avanzadas" breadcrumb={[{label:'Admin'},{label:'Analytics'},{label:'Revenue'}]}/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="MRR Actual" value={formatCurrency(kpis?.mrr||0)} icon={<DollarSign className="h-5 w-5"/>} change={12.4}/>
        <KpiCard title="ARR Proyectado" value={formatCurrency(kpis?.arr||0)} icon={<TrendingUp className="h-5 w-5"/>} iconColor="bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400"/>
        <KpiCard title="ARPU" value={formatCurrency(kpis?.arpu||0)} icon={<Users className="h-5 w-5"/>} iconColor="bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400"/>
        <KpiCard title="LTV" value={formatCurrency(kpis?.ltv||0)} icon={<Star className="h-5 w-5"/>} iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"/>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">ARR Proyección (12 meses)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={arrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={(v:any)=>formatCurrency(v)} contentStyle={{background:'var(--color-surface-50)',border:'1px solid var(--color-surface-200)',borderRadius:'12px',fontSize:'12px'}}/>
              <Bar dataKey="arr" name="ARR" fill="#8b5cf6" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">Revenue por tipo de consulta</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={REVENUE_TYPE}>
              <defs>
                <linearGradient id="presG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                <linearGradient id="onlG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={(v:any)=>formatCurrency(v)} contentStyle={{background:'var(--color-surface-50)',border:'1px solid var(--color-surface-200)',borderRadius:'12px',fontSize:'12px'}}/>
              <Legend wrapperStyle={{fontSize:'12px'}}/>
              <Area type="monotone" dataKey="presencial" name="Presencial" stroke="#3b82f6" fill="url(#presG)" strokeWidth={2}/>
              <Area type="monotone" dataKey="online" name="Online" stroke="#10b981" fill="url(#onlG)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
