import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Activity, Heart, TrendingUp, Droplets, Wind, Scale , Leaf} from 'lucide-react';
import { useHealthHistory, useLatestHealth } from '../../../shared/hooks/usePatient';
import { healthService } from '../../../shared/services/healthService';
import { PageHeader, KpiCard } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton } from '../../../shared/components/atoms/index';
import { cn } from '../../../shared/utils';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts';

const PERIODS = [3, 6, 12, 24];

function MetricCard({ icon, label, value, unit, sub, color }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold font-data text-slate-800 dark:text-slate-100">{value}</p>
            <p className="text-sm text-slate-400">{unit}</p>
          </div>
          {sub && <p className={cn('text-xs mt-1 font-medium', sub.color)}>{sub.label}</p>}
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', color)}>{icon}</div>
      </div>
    </div>
  );
}


const HEALTH_TIP_ICONS: Record<string, React.ReactNode> = {
  Activity: <Activity className="h-5 w-5"/>,
  Droplets: <Droplets className="h-5 w-5"/>,
  Salad: <Leaf className="h-5 w-5"/>,
};

export default function PatientHealth() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState(6);
  const { data: history, isLoading } = useHealthHistory(period);
  const { data: latest } = useLatestHealth();

  const HEIGHT_M = 1.75;
  const bmi = latest ? healthService.getBMI(latest.weight, HEIGHT_M) : null;

  const chartData = (history || []).map((m: any) => ({
    month: m.month.slice(5),
    peso: m.weight,
    sistolica: m.systolic,
    diastolica: m.diastolic,
    frecuencia: m.heartRate,
    glucosa: m.glucose,
    saturacion: m.oxygenSat,
  }));

  return (
    <>
      <Helmet><title>Mi Salud – SmartSalud</title></Helmet>
      <PageHeader title="Mi Salud" subtitle="Panel de métricas de salud personal"
        action={
          <div className="flex gap-1.5">
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  period === p ? 'bg-primary-600 text-white border-primary-600' : 'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-slate-800')}>
                {p}M
              </button>
            ))}
          </div>
        }
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Mi Salud' }]} />

      {/* Current metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {latest && (<>
          <MetricCard icon={<Scale className="h-5 w-5" />} label="Peso" value={latest.weight} unit="kg" color="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" />
          <MetricCard icon={<TrendingUp className="h-5 w-5" />} label="IMC" value={bmi?.value} unit="" sub={bmi ? { label: bmi.label, color: bmi.color } : undefined} color="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400" />
          <MetricCard icon={<Activity className="h-5 w-5" />} label="Presión" value={`${latest.systolic}/${latest.diastolic}`} unit="mmHg"
            sub={{ label: latest.systolic < 120 ? 'Normal' : latest.systolic < 140 ? 'Elevada' : 'Alta', color: latest.systolic < 120 ? 'text-green-500' : latest.systolic < 140 ? 'text-amber-500' : 'text-red-500' }}
            color="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400" />
          <MetricCard icon={<Heart className="h-5 w-5" />} label="Frec. cardíaca" value={latest.heartRate} unit="BPM"
            sub={{ label: latest.heartRate < 60 ? 'Baja' : latest.heartRate <= 100 ? 'Normal' : 'Alta', color: latest.heartRate >= 60 && latest.heartRate <= 100 ? 'text-green-500' : 'text-amber-500' }}
            color="bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400" />
          <MetricCard icon={<Droplets className="h-5 w-5" />} label="Glucosa" value={latest.glucose} unit="mg/dL"
            sub={{ label: latest.glucose < 100 ? 'Normal' : latest.glucose < 126 ? 'Prediabetes' : 'Alta', color: latest.glucose < 100 ? 'text-green-500' : 'text-amber-500' }}
            color="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400" />
          <MetricCard icon={<Wind className="h-5 w-5" />} label="Sat. O₂" value={latest.oxygenSat} unit="%"
            sub={{ label: latest.oxygenSat >= 95 ? 'Normal' : 'Baja', color: latest.oxygenSat >= 95 ? 'text-green-500' : 'text-red-500' }}
            color="bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400" />
        </>)}
        {!latest && [...Array(6)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>

      {/* Charts */}
      {isLoading ? (
        <div className="grid lg:grid-cols-2 gap-5">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-56" />)}</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Weight */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2"><Scale className="h-4 w-4 text-blue-500" />Evolución del peso</h3>
            <p className="text-xs text-slate-400 mb-4">Últimos {period} meses · kg</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
                <Area type="monotone" dataKey="peso" name="Peso (kg)" stroke="#3b82f6" fill="url(#gw)" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Blood pressure */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2"><Activity className="h-4 w-4 text-red-500" />Presión arterial</h3>
            <p className="text-xs text-slate-400 mb-4">Últimos {period} meses · mmHg</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[50, 160]} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
                <ReferenceLine y={120} stroke="#22c55e" strokeDasharray="4 2" strokeOpacity={0.5} />
                <Line type="monotone" dataKey="sistolica" name="Sistólica" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} />
                <Line type="monotone" dataKey="diastolica" name="Diastólica" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Heart rate */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" />Frecuencia cardíaca</h3>
            <p className="text-xs text-slate-400 mb-4">Últimos {period} meses · BPM</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="gh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[50, 110]} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
                <ReferenceLine y={60} stroke="#22c55e" strokeDasharray="4 2" strokeOpacity={0.4} />
                <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="4 2" strokeOpacity={0.4} />
                <Area type="monotone" dataKey="frecuencia" name="BPM" stroke="#f43f5e" fill="url(#gh)" strokeWidth={2.5} dot={{ r: 3, fill: '#f43f5e' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Glucose */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2"><Droplets className="h-4 w-4 text-amber-500" />Glucosa en sangre</h3>
            <p className="text-xs text-slate-400 mb-4">Últimos {period} meses · mg/dL</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[70, 140]} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
                <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="4 2" strokeOpacity={0.5} label={{ value: 'Normal', fontSize: 9, fill: '#22c55e' }} />
                <Area type="monotone" dataKey="glucosa" name="mg/dL" stroke="#f59e0b" fill="url(#gg)" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Health tips */}
      <div className="mt-5 card p-5">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">💡 Recomendaciones personalizadas</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: 'Activity', title: 'Actividad física', desc: 'Mantén 30 min de ejercicio moderado al día para optimizar tu frecuencia cardíaca.' },
            { icon: 'Droplets', title: 'Hidratación', desc: 'Bebe 8 vasos de agua diarios. Ayuda a regular la presión arterial y el metabolismo.' },
            { icon: 'Salad', title: 'Dieta equilibrada', desc: 'Reduce el consumo de sodio y azúcares refinados para mantener tu glucosa estable.' },
            { icon: '😴', title: 'Descanso', desc: '7-8 horas de sueño diario contribuyen a una mejor regulación hormonal y cardíaca.' },
            { icon: '🩺', title: 'Controles periódicos', desc: 'Tu presión arterial requiere monitoreo mensual según tus últimas lecturas.' },
            { icon: '🧘', title: 'Manejo del estrés', desc: 'Técnicas de respiración y meditación pueden reducir tu frecuencia cardíaca en reposo.' },
          ].map((tip, i) => (
            <div key={i} className="flex gap-3 p-3 bg-surface-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-2xl shrink-0">{HEALTH_TIP_ICONS[tip.icon] || null}</span>
              <div><p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">{tip.title}</p><p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{tip.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
