import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDoctorAppointments } from '../../../shared/hooks/useAppointments';
import { PageHeader, KpiCard } from '../../../shared/components/molecules/StatusComponents';
import { Calendar, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { formatCurrency } from '../../../shared/utils';

export default function DoctorStats() {
  const { data: appointments } = useDoctorAppointments();
  const completed = (appointments || []).filter(a => a.status === 'completed');
  const revenue = completed.reduce((s, a) => s + a.price, 0);

  // Mock monthly data
  const monthlyData = [
    { m: 'Ene', citas: 24, ingresos: 3200 }, { m: 'Feb', citas: 31, ingresos: 4100 },
    { m: 'Mar', citas: 28, ingresos: 3700 }, { m: 'Abr', citas: 36, ingresos: 4800 },
    { m: 'May', citas: 42, ingresos: 5600 }, { m: 'Jun', citas: 38, ingresos: 5000 },
  ];

  return (
    <>
      <Helmet><title>Mis Estadísticas – SmartSalud</title></Helmet>
      <PageHeader title="Estadísticas" subtitle="Tu rendimiento en la plataforma"
        breadcrumb={[{ label: 'Dashboard Médico', href: '/dashboard/doctor' }, { label: 'Estadísticas' }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total citas" value={(appointments || []).length} icon={<Calendar className="h-5 w-5" />} change={12.5} />
        <KpiCard title="Completadas" value={completed.length} icon={<CheckCircle2 className="h-5 w-5" />}
          iconColor="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" change={8.3} />
        <KpiCard title="Ingresos" value={formatCurrency(revenue)} icon={<DollarSign className="h-5 w-5" />}
          iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400" change={15.2} />
        <KpiCard title="Calificación" value="4.8 / 5" icon={<TrendingUp className="h-5 w-5" />}
          iconColor="bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Citas por mes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#f1f5f9' }} />
              <Bar dataKey="citas" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Ingresos por mes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#f1f5f9' }} />
              <Line type="monotone" dataKey="ingresos" stroke="#14B8A6" strokeWidth={2} dot={{ r: 4, fill: '#14B8A6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
