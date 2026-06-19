import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { DollarSign, TrendingUp, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PageHeader, KpiCard } from '../../../shared/components/molecules/StatusComponents';
import { Badge } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { useAdminMasterStore } from '../store/adminMasterStore';
import { MONTHLY_METRICS } from '../../../data/metrics';
import { APPOINTMENTS } from '../../../data/appointments';
import { formatCurrency, formatDate, cn } from '../../../shared/utils';
import { toast } from 'sonner';

interface Props { tab?: string; }

const METRICS = MONTHLY_METRICS as unknown as any[];
const COMMISSION = 0.20;

const TRANSACTIONS = (APPOINTMENTS as unknown as any[]).slice(0, 80).map((a, i) => ({
  id: `txn-${String(i+1).padStart(4,'0')}`,
  appointmentId: a.id, patientName: a.patientName, doctorName: a.doctorName,
  specialty: a.specialty, amount: a.price, commission: Math.round(a.price * COMMISSION),
  net: Math.round(a.price * (1 - COMMISSION)), status: a.status === 'completed' ? 'paid' : a.status === 'cancelled' ? 'refunded' : 'pending',
  date: a.date,
}));

const DOCTOR_PAYOUTS = [
  { id:'pay-001', doctorName:'Dr. Carlos Mendoza', specialty:'Cardiología', avatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza', totalEarned:4800, pendingAmount:2450, consultations:32 },
  { id:'pay-002', doctorName:'Dra. Ana Torres', specialty:'Dermatología', avatar:'https://api.dicebear.com/7.x/personas/svg?seed=dra-ana-torres', totalEarned:3600, pendingAmount:1800, consultations:24 },
  { id:'pay-003', doctorName:'Dr. Luis Vargas', specialty:'Neurología', avatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-luis-vargas', totalEarned:5200, pendingAmount:3100, consultations:41 },
  { id:'pay-004', doctorName:'Dra. Sofía Chen', specialty:'Pediatría', avatar:'https://api.dicebear.com/7.x/personas/svg?seed=dra-sofia-chen', totalEarned:2900, pendingAmount:1450, consultations:19 },
  { id:'pay-005', doctorName:'Dr. Pedro Ramos', specialty:'Traumatología', avatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-pedro-ramos', totalEarned:3100, pendingAmount:0, consultations:22 },
  { id:'pay-006', doctorName:'Dra. Elena Vargas', specialty:'Endocrinología', avatar:'https://api.dicebear.com/7.x/personas/svg?seed=dra-elena-vargas', totalEarned:2200, pendingAmount:1100, consultations:15 },
];

const CHART_DATA = METRICS.slice(-12).map(m => ({
  month: m.month.slice(5),
  revenue: m.revenue,
  commission: Math.round(m.revenue * COMMISSION),
  net: Math.round(m.revenue * (1 - COMMISSION)),
}));

const SPECIALTY_DATA = [
  { name:'Cardiología', revenue:12400 }, { name:'Neurología', revenue:9800 }, { name:'Pediatría', revenue:8200 },
  { name:'Dermatología', revenue:7600 }, { name:'Ginecología', revenue:6900 }, { name:'Traumatología', revenue:5400 },
];

const TABS = [
  { key:'overview', label:'Resumen' },
  { key:'transactions', label:'Transacciones' },
  { key:'payouts', label:'Pagos a médicos' },
];

const TXN_STATUS: Record<string,any> = { paid:{label:'Pagado',v:'success'}, pending:{label:'Pendiente',v:'warning'}, refunded:{label:'Reembolsado',v:'default'} };

export default function AdminFinance({ tab: initTab }: Props) {
  const [tab, setTab] = useState(initTab || 'overview');
  const { paidPayoutIds, markPayoutPaid } = useAdminMasterStore();

  const totals = useMemo(() => ({
    totalRevenue: METRICS.slice(-1)[0]?.revenue || 0,
    totalCommission: Math.round((METRICS.slice(-1)[0]?.revenue || 0) * COMMISSION),
    pendingPayouts: DOCTOR_PAYOUTS.filter(d => !paidPayoutIds.includes(d.id)).reduce((s,d)=>s+d.pendingAmount,0),
    avgTicket: Math.round((METRICS.slice(-1)[0]?.revenue || 0) / (METRICS.slice(-1)[0]?.completions || 1)),
  }), [paidPayoutIds]);

  const payouts = DOCTOR_PAYOUTS.map(p => ({ ...p, paid: paidPayoutIds.includes(p.id) }));

  return (
    <>
      <Helmet><title>Finanzas – Admin</title></Helmet>
      <PageHeader title="Sistema Financiero" subtitle="Ingresos, transacciones y pagos" breadcrumb={[{label:'Admin'},{label:'Finanzas'}]} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Ingresos (mes)" value={formatCurrency(totals.totalRevenue)} icon={<DollarSign className="h-5 w-5"/>} change={12.4} />
        <KpiCard title="Comisión plataforma" value={formatCurrency(totals.totalCommission)} icon={<TrendingUp className="h-5 w-5"/>} iconColor="bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400" />
        <KpiCard title="Ticket promedio" value={formatCurrency(totals.avgTicket)} icon={<CreditCard className="h-5 w-5"/>} iconColor="bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400" />
        <KpiCard title="Pagos pendientes" value={formatCurrency(totals.pendingPayouts)} icon={<Clock className="h-5 w-5"/>} iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400" />
      </div>

      <div className="flex gap-1 mb-4 p-1 bg-surface-100 dark:bg-slate-800 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', tab===t.key ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-5">
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="card p-5 lg:col-span-2">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 text-sm">Ingresos vs Comisiones (12 meses)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)"/>
                  <XAxis dataKey="month" tick={{fontSize:11, fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11, fill:'#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                  <Tooltip formatter={(v:any)=>formatCurrency(v)} contentStyle={{background:'var(--color-surface-50)',border:'1px solid var(--color-surface-200)',borderRadius:'12px',fontSize:'12px'}}/>
                  <Legend wrapperStyle={{fontSize:'12px'}}/>
                  <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2}/>
                  <Area type="monotone" dataKey="commission" name="Comisión" stroke="#8b5cf6" fill="url(#comGrad)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 text-sm">Ingresos por especialidad</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={SPECIALTY_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" horizontal={false}/>
                  <XAxis type="number" tick={{fontSize:10, fill:'#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                  <YAxis type="category" dataKey="name" tick={{fontSize:10, fill:'#94a3b8'}} axisLine={false} tickLine={false} width={80}/>
                  <Tooltip formatter={(v:any)=>formatCurrency(v)} contentStyle={{background:'var(--color-surface-50)',border:'1px solid var(--color-surface-200)',borderRadius:'12px',fontSize:'12px'}}/>
                  <Bar dataKey="revenue" name="Ingresos" fill="#3b82f6" radius={[0,6,6,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === 'transactions' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
                <tr>{['ID','Paciente','Médico','Monto','Comisión','Estado','Fecha'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
                {TRANSACTIONS.map(t => (
                  <tr key={t.id} className="hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{t.id}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-100">{t.patientName}</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{t.doctorName}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(t.amount)}</td>
                    <td className="px-4 py-2.5 text-purple-600 dark:text-purple-400 font-medium">{formatCurrency(t.commission)}</td>
                    <td className="px-4 py-2.5"><Badge variant={TXN_STATUS[t.status]?.v||'default'} size="sm" dot>{TXN_STATUS[t.status]?.label||t.status}</Badge></td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs">{formatDate(t.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'payouts' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
                <tr>{['Médico','Especialidad','Total generado','Pendiente','Consultas','Estado','Acción'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
                {payouts.map(p => (
                  <tr key={p.id} className="hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{p.doctorName}</td>
                    <td className="px-4 py-3"><Badge variant="outline" size="sm">{p.specialty}</Badge></td>
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{formatCurrency(p.totalEarned)}</td>
                    <td className={cn('px-4 py-3 font-bold', p.pendingAmount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400')}>{formatCurrency(p.pendingAmount)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.consultations}</td>
                    <td className="px-4 py-3"><Badge variant={p.paid || p.pendingAmount===0 ? 'success' : 'warning'} size="sm" dot>{p.paid || p.pendingAmount===0 ? 'Pagado' : 'Pendiente'}</Badge></td>
                    <td className="px-4 py-3">
                      {!p.paid && p.pendingAmount > 0 ? (
                        <Button size="sm" variant="success" onClick={() => { markPayoutPaid(p.id); toast.success(`Pago marcado para ${p.doctorName}`); }}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1"/>Marcar pagado
                        </Button>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
