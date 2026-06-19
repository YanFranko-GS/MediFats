import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton } from '../../../shared/components/atoms/index';
import { useFunnelData } from '../hooks/useAdminMaster';
import { formatNumber, formatPercentage } from '../../../shared/utils';

const COLORS = ['#3b82f6','#6366f1','#8b5cf6','#a855f7','#c084fc','#e879f9','#f472b6'];

export default function AdminAnalyticsFunnel() {
  const { data: steps = [], isLoading } = useFunnelData();
  return (
    <>
      <Helmet><title>Funnel de Conversión – Admin</title></Helmet>
      <PageHeader title="Funnel de Conversión" subtitle="7 pasos del ciclo de vida del paciente" breadcrumb={[{label:'Admin'},{label:'Analytics'},{label:'Funnel'}]}/>
      {isLoading ? <Skeleton className="h-96"/> : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-5">Embudo visual</h3>
            <div className="space-y-2">
              {steps.map((step: any, i: number) => {
                const pct = (step.count / steps[0].count) * 100;
                return (
                  <div key={step.step}>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{step.label}</span>
                      <span>{formatNumber(step.count)} · {pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-8 bg-surface-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                      <div className="h-full rounded-lg flex items-center justify-end pr-2 transition-all" style={{ width:`${pct}%`, background: COLORS[i] }}>
                        {pct > 20 && <span className="text-white text-xs font-semibold">{pct.toFixed(1)}%</span>}
                      </div>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="flex items-center gap-1 mt-1 ml-2">
                        <ChevronDown className="h-3 w-3 text-slate-400"/>
                        <span className="text-xs text-red-500">−{formatPercentage(step.dropOffRate)} drop-off</span>
                        <span className="text-xs text-green-600 ml-2">→ {formatPercentage(steps[i+1]?.conversionRate || 0)} conversión</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">Usuarios por paso</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={steps} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={true} horizontal={false}/>
                <XAxis type="number" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v=>formatNumber(v)}/>
                <YAxis type="category" dataKey="step" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} width={20}/>
                <Tooltip formatter={(v:any)=>[formatNumber(v),'Usuarios']} labelFormatter={l=>`Paso ${l}`} contentStyle={{background:'var(--color-surface-50)',border:'1px solid var(--color-surface-200)',borderRadius:'12px',fontSize:'12px'}}/>
                <Bar dataKey="count" name="Usuarios" radius={[0,6,6,0]}>
                  {steps.map((_: any, i: number) => <Cell key={i} fill={COLORS[i]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-xs text-blue-700 dark:text-blue-300">
              <span className="font-semibold">Tasa de conversión global:</span> {steps.length > 0 ? formatPercentage((steps[steps.length-1]?.count / steps[0]?.count) * 100) : '—'} (visitante → paciente recurrente)
            </div>
          </div>
        </div>
      )}
    </>
  );
}
