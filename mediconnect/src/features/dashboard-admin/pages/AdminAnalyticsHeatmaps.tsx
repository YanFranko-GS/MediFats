import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton } from '../../../shared/components/atoms/index';
import { useScheduleHeatmap, useSpecialtyHeatmap } from '../hooks/useAdminMaster';
import { cn } from '../../../shared/utils';

const HOURS = Array.from({length:13},(_,i)=>i+8);

function heatColor(v: number): string {
  if (v >= 80) return 'bg-blue-700 text-white';
  if (v >= 60) return 'bg-blue-500 text-white';
  if (v >= 40) return 'bg-blue-300 text-slate-800';
  if (v >= 20) return 'bg-blue-100 text-slate-700 dark:bg-blue-900/40 dark:text-blue-200';
  return 'bg-surface-50 text-slate-400 dark:bg-slate-800';
}
function spHeatColor(v: number): string {
  if (v >= 80) return 'bg-indigo-700 text-white';
  if (v >= 60) return 'bg-indigo-400 text-white';
  if (v >= 40) return 'bg-indigo-200 text-slate-800 dark:bg-indigo-900/50 dark:text-indigo-200';
  if (v >= 20) return 'bg-indigo-50 text-slate-600 dark:bg-indigo-950/30 dark:text-slate-400';
  return 'bg-surface-50 text-slate-400 dark:bg-slate-800';
}

export default function AdminAnalyticsHeatmaps() {
  const { data: schedule, isLoading: l1 } = useScheduleHeatmap();
  const { data: specialty, isLoading: l2 } = useSpecialtyHeatmap();
  const [view, setView] = useState<'schedule'|'specialty'>('schedule');
  const days = schedule?.days || [];
  const spDays = specialty?.days || [];

  return (
    <>
      <Helmet><title>Heatmaps – Admin</title></Helmet>
      <PageHeader title="Heatmaps de Demanda" subtitle="Análisis de demanda por horario y especialidad" breadcrumb={[{label:'Admin'},{label:'Analytics'},{label:'Heatmaps'}]}/>
      <div className="flex gap-1 p-1 bg-surface-100 dark:bg-slate-800 rounded-xl w-fit mb-5">
        {(['schedule','specialty'] as const).map(v => (
          <button key={v} onClick={()=>setView(v)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', view===v ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}>
            {v==='schedule' ? 'Horario semanal' : 'Por especialidad'}
          </button>
        ))}
      </div>

      {view === 'schedule' && (
        l1 ? <Skeleton className="h-96"/> : (
          <div className="card p-5 overflow-x-auto">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">Demanda por día y hora</h3>
            <div className="flex items-start gap-1 min-w-max">
              <div className="flex flex-col gap-1 mt-6 mr-1">
                {HOURS.map(h => <div key={h} className="h-7 w-12 flex items-center justify-end text-xs text-slate-400">{h}:00</div>)}
              </div>
              <div className="flex gap-1">
                {days.map((day: string, di: number) => (
                  <div key={day} className="flex flex-col gap-1">
                    <div className="h-6 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400 w-10">{day.slice(0,3)}</div>
                    {HOURS.map(h => {
                      const cell = schedule?.cells?.find((c:any) => c.day===di && c.hour===h);
                      const v = cell?.value || 0;
                      return (
                        <div key={h} title={`${day} ${h}:00 – Demanda: ${v}%`}
                          className={cn('w-10 h-7 rounded text-xs flex items-center justify-center transition-all cursor-default', heatColor(v))}>
                          {v >= 40 ? v : ''}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
              <span>Baja demanda</span>
              {['bg-blue-50','bg-blue-100','bg-blue-300','bg-blue-500','bg-blue-700'].map((c,i)=>(
                <div key={i} className={cn('w-5 h-4 rounded', c, i>2&&'opacity-90')}/>
              ))}
              <span>Alta demanda</span>
            </div>
          </div>
        )
      )}

      {view === 'specialty' && (
        l2 ? <Skeleton className="h-80"/> : (
          <div className="card p-5 overflow-x-auto">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">Demanda por especialidad y día de semana</h3>
            <div className="flex items-start gap-1 min-w-max">
              <div className="flex flex-col gap-1 mt-6 mr-2">
                {specialty?.specialties?.map((sp: string) => <div key={sp} className="h-8 flex items-center text-xs text-slate-500 w-28 font-medium">{sp}</div>)}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {spDays.map((d: string) => <div key={d} className="w-10 h-6 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400">{d.slice(0,3)}</div>)}
                </div>
                {specialty?.specialties?.map((sp: string) => (
                  <div key={sp} className="flex gap-1">
                    {spDays.map((day: string, di: number) => {
                      const cell = specialty?.cells?.find((c:any)=>c.specialty===sp&&c.day===di);
                      const v = cell?.value || 0;
                      return (
                        <div key={di} title={`${sp} – ${day}: ${v}%`}
                          className={cn('w-10 h-8 rounded text-xs flex items-center justify-center', spHeatColor(v))}>
                          {v >= 40 ? v : ''}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
