import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDoctorFinanceMonthly } from '../../../shared/hooks/useDoctor';
import { useDoctorAppointments } from '../../../shared/hooks/useAppointments';
import { useDoctorReviews } from '../../../shared/hooks/useDoctors';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton } from '../../../shared/components/atoms/index';
import { cn } from '../../../shared/utils';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#2563EB','#14B8A6','#F59E0B','#EF4444','#8B5CF6','#EC4899','#10B981'];
const PERIODS = [1, 3, 6, 12] as const;

const HEATMAP_DAYS = ['Lun','Mar','Mié','Jue','Vie'];
const HEATMAP_HOURS = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];

export default function DoctorAnalytics() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>(6);
  const { data: monthly } = useDoctorFinanceMonthly(period);
  const { data: appointments } = useDoctorAppointments();
  const { data: reviewData } = useDoctorReviews('doc-001', 1);
  const reviews = (reviewData as any)?.data?.data ?? (reviewData as any)?.data ?? [];

  // Age distribution mock
  const ageData = [
    { range: '18-25', count: 8 }, { range: '26-35', count: 22 },
    { range: '36-45', count: 35 }, { range: '46-55', count: 28 },
    { range: '56-65', count: 18 }, { range: '65+', count: 12 },
  ];

  // Gender mock
  const genderData = [{ name: 'Femenino', value: 58 }, { name: 'Masculino', value: 42 }];

  // Top diagnoses mock
  const diagData = [
    { name: 'Hipertensión', count: 45 }, { name: 'Diabetes T2', count: 38 },
    { name: 'Dislipidemia', count: 32 }, { name: 'Gastritis', count: 27 },
    { name: 'Ansiedad', count: 21 }, { name: 'Hipotiroidismo', count: 16 },
  ];

  const chartData = (monthly || []).map((m: any) => ({
    month: m.month.slice(5),
    citas: m.consultations,
    nuevos: m.newPatients,
    cancelaciones: m.cancellations,
  }));

  const cancelRate = (appointments || []).length > 0
    ? (((appointments || []).filter((a: any) => a.status === 'cancelled').length / (appointments || []).length) * 100).toFixed(1)
    : '0';

  const recurringPatients = (() => {
    const visitsByPatient = new Map<string, number>();
    (appointments || []).filter((a: any) => a.status === 'completed').forEach((a: any) => {
      visitsByPatient.set(a.patientId, (visitsByPatient.get(a.patientId) || 0) + 1);
    });
    return [...visitsByPatient.values()].filter(c => c > 1).length;
  })();

  const avgRating = reviews.length
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  // Heatmap
  const heatData: Record<string, number> = {};
  HEATMAP_DAYS.forEach((d, di) => HEATMAP_HOURS.forEach((h, hi) => {
    const dp = di === 2 ? 1.3 : di >= 4 ? 0.7 : 1.0;
    const hp = hi >= 1 && hi <= 3 ? 1.4 : 0.8;
    heatData[`${d}-${h}`] = Math.round(6 * dp * hp + Math.random() * 3);
  }));
  const maxHeat = Math.max(...Object.values(heatData));

  return (
    <>
      <Helmet><title>Analíticas – Dashboard Médico</title></Helmet>
      <PageHeader title="Analíticas Médicas" subtitle="Métricas de rendimiento clínico"
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
        breadcrumb={[{ label: 'Dashboard Médico', href: '/dashboard/doctor' }, { label: 'Analíticas' }]} />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tasa cancelación', value: `${cancelRate}%`, color: 'text-red-500' },
          { label: 'Pacientes recurrentes', value: recurringPatients, color: 'text-primary-600' },
          { label: 'Calificación promedio', value: `${avgRating} / 5`, color: 'text-amber-500' },
          { label: 'Total consultas', value: (appointments || []).filter((a: any) => a.status === 'completed').length, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={cn('text-2xl font-bold font-data', color)}>{value}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Patients by age */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Pacientes por rango de edad</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
              <Bar dataKey="count" name="Pacientes" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender pie */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Distribución por género</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie data={genderData} dataKey="value" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                  {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {genderData.map((g, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{g.value}%</p>
                    <p className="text-xs text-slate-400">{g.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top diagnoses */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Diagnósticos más frecuentes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={diagData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
              <Bar dataKey="count" name="Casos" fill="#14B8A6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* New vs returning */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Pacientes nuevos vs recurrentes</h3>
          {!chartData.length ? <Skeleton className="h-48" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="nuevos" name="Nuevos" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="cancelaciones" name="Cancelaciones" fill="#EF4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Demand heatmap */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Mapa de demanda horaria</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-slate-400 font-normal pr-4 pb-2 min-w-[50px]">Hora</th>
                {HEATMAP_DAYS.map(d => <th key={d} className="text-center text-slate-400 font-normal px-1 pb-2 min-w-[70px]">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_HOURS.map(hour => (
                <tr key={hour}>
                  <td className="text-slate-400 pr-4 py-0.5 whitespace-nowrap">{hour}</td>
                  {HEATMAP_DAYS.map(day => {
                    const val = heatData[`${day}-${hour}`] || 0;
                    const intensity = val / maxHeat;
                    return (
                      <td key={day} className="px-1 py-0.5">
                        <div className="w-full h-8 rounded flex items-center justify-center text-xs font-bold"
                          style={{ background: `rgba(37,99,235,${0.07 + intensity * 0.85})`, color: intensity > 0.5 ? 'white' : '#2563EB' }}>
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
    </>
  );
}
