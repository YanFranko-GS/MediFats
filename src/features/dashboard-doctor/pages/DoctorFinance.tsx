import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { useDoctorFinanceKPIs, useDoctorFinanceMonthly, useDoctorTransactions } from '../../../shared/hooks/useDoctor';
import { PageHeader, KpiCard, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton, AvatarImg } from '../../../shared/components/atoms/index';
import { cn, formatCurrency, formatDate } from '../../../shared/utils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area } from 'recharts';

const PERIODS = [6, 12, 24] as const;

export default function DoctorFinance() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>(12);
  const [page, setPage] = useState(1);
  const { data: kpis } = useDoctorFinanceKPIs();
  const { data: monthly, isLoading } = useDoctorFinanceMonthly(period);
  const { data: txData } = useDoctorTransactions(page);
  const transactions = (txData as any)?.items || [];
  const txTotal = (txData as any)?.total || 0;
  const txPages = Math.ceil(txTotal / 15);

  const chartData = (monthly || []).map((m: any) => ({
    month: m.month.slice(5),
    ingresos: Math.round(m.revenue / 1000),
    citas: m.consultations,
    ticket: m.avgTicket,
    cancelaciones: m.cancellations,
  }));

  const currentMonth = chartData[chartData.length - 1];
  const prevMonth = chartData[chartData.length - 2];

  return (
    <>
      <Helmet><title>Gestión Financiera – Dashboard Médico</title></Helmet>
      <PageHeader title="Gestión Financiera" subtitle="Análisis de ingresos y transacciones"
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
        breadcrumb={[{ label: 'Dashboard Médico', href: '/dashboard/doctor' }, { label: 'Finanzas' }]} />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Ingresos del mes" value={formatCurrency(kpis?.monthRevenue || 0)}
          icon={<DollarSign className="h-5 w-5" />} change={kpis?.monthRevenueChange} />
        <KpiCard title="Ingresos del año" value={formatCurrency((monthly || []).reduce((s: number, m: any) => s + m.revenue, 0))}
          icon={<TrendingUp className="h-5 w-5" />}
          iconColor="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" />
        <KpiCard title="Consultas este mes" value={kpis?.monthConsultations || 0}
          icon={<Calendar className="h-5 w-5" />}
          iconColor="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" />
        <KpiCard title="Ticket promedio" value={formatCurrency(kpis?.avgTicket || 0)}
          icon={<CreditCard className="h-5 w-5" />}
          iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">Ingresos mensuales</h3>
          <p className="text-xs text-slate-400 mb-4">Miles de Soles · {period} meses</p>
          {isLoading ? <Skeleton className="h-48" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
                <Bar dataKey="ingresos" name="Ingresos (k S/)" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">Evolución de consultas y ticket</h3>
          <p className="text-xs text-slate-400 mb-4">Tendencia mensual</p>
          {isLoading ? <Skeleton className="h-48" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="citas" name="Consultas" stroke="#2563EB" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ticket" name="Ticket (S/)" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Month comparison */}
      {currentMonth && prevMonth && (
        <div className="card p-5 mb-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Comparativo: mes actual vs anterior</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Ingresos', curr: `S/ ${currentMonth.ingresos}k`, prev: `S/ ${prevMonth.ingresos}k`, positive: currentMonth.ingresos >= prevMonth.ingresos },
              { label: 'Consultas', curr: currentMonth.citas, prev: prevMonth.citas, positive: currentMonth.citas >= prevMonth.citas },
              { label: 'Ticket promedio', curr: `S/ ${currentMonth.ticket}`, prev: `S/ ${prevMonth.ticket}`, positive: currentMonth.ticket >= prevMonth.ticket },
              { label: 'Cancelaciones', curr: currentMonth.cancelaciones, prev: prevMonth.cancelaciones, positive: currentMonth.cancelaciones <= prevMonth.cancelaciones },
            ].map(({ label, curr, prev, positive }) => (
              <div key={label} className="text-center">
                <p className="text-xs text-slate-400 mb-2">{label}</p>
                <p className="text-2xl font-bold font-data text-slate-800 dark:text-slate-100">{curr}</p>
                <p className={cn('text-xs font-medium mt-1', positive ? 'text-green-500' : 'text-red-400')}>
                  {positive ? '↑' : '↓'} vs {prev}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Historial de transacciones</h3>
          <span className="text-xs text-slate-400">{txTotal} consultas completadas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
              <tr>{['Paciente', 'Fecha', 'Hora', 'Modalidad', 'Monto', 'Estado'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
              {transactions.map((a: any) => (
                <tr key={a.id} className="hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AvatarImg src={a.patientAvatar} alt={a.patientName} className="w-7 h-7 rounded-full object-cover bg-primary-50 shrink-0" />
                      <span className="text-xs text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{a.patientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{formatDate(a.date, 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{a.time}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs capitalize">{a.mode}</td>
                  <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">{formatCurrency(a.price)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">Pagado</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-surface-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">Página {page} de {txPages}</p>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(txPages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={cn('w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                  page === p ? 'bg-primary-600 text-white' : 'border border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-slate-800')}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
