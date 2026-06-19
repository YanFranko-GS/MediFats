import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, RefreshCw, X, Eye } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Badge, Skeleton } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { useActivityFeed } from '../hooks/useAdminMaster';
import { ACTIVITY_FEED } from '../../../data/activityFeed';
import { formatRelative, cn } from '../../../shared/utils';
import { toast } from 'sonner';

const TYPE_LABELS: Record<string, { label: string; variant: any }> = {
  'appointment.booked':    { label:'Reserva',   variant:'primary' },
  'appointment.cancelled': { label:'Cancelación',variant:'error' },
  'appointment.completed': { label:'Completada', variant:'success' },
  'user.registered':       { label:'Registro',  variant:'secondary' },
  'doctor.approved':       { label:'Médico',     variant:'secondary' },
  'doctor.suspended':      { label:'Suspensión', variant:'warning' },
  'payment.confirmed':     { label:'Pago',       variant:'success' },
  'review.published':      { label:'Reseña',     variant:'warning' },
  'review.flagged':        { label:'Reseña',     variant:'error' },
  'report.exported':       { label:'Reporte',    variant:'default' },
  'user.login':            { label:'Acceso',     variant:'default' },
  'system.alert':          { label:'Alerta',     variant:'error' },
};

const COLOR_BG: Record<string, string> = {
  blue:'bg-blue-50 dark:bg-blue-950/20 text-blue-600',
  green:'bg-green-50 dark:bg-green-950/20 text-green-600',
  teal:'bg-teal-50 dark:bg-teal-950/20 text-teal-600',
  purple:'bg-purple-50 dark:bg-purple-950/20 text-purple-600',
  amber:'bg-amber-50 dark:bg-amber-950/20 text-amber-600',
  red:'bg-red-50 dark:bg-red-950/20 text-red-600',
  indigo:'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600',
  orange:'bg-orange-50 dark:bg-orange-950/20 text-orange-600',
};

function EventIcon({ name, color }: { name: string; color: string }) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Activity;
  return (
    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', COLOR_BG[color]||COLOR_BG.blue)}>
      <Icon className="h-4 w-4"/>
    </div>
  );
}

function DetailModal({ event, onClose }: { event: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Detalle del evento</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 text-slate-400"><X className="h-4 w-4"/></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <EventIcon name={event.icon} color={event.color}/>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{event.title}</p>
              <p className="text-xs text-slate-500">{formatRelative(event.timestamp)}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{event.description}</p>
          {Object.keys(event.metadata).length > 0 && (
            <div className="bg-surface-50 dark:bg-slate-800/60 rounded-xl p-3 space-y-1.5">
              {Object.entries(event.metadata).map(([k,v])=>(
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-slate-500 capitalize">{k}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminActivity() {
  const { data: initial = [], isLoading } = useActivityFeed(50);
  const [feed, setFeed] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState<any>(null);
  const [live, setLive] = useState(true);

  useEffect(() => { if (initial.length) setFeed(initial); }, [initial]);

  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      const randomEvent = ACTIVITY_FEED[Math.floor(Math.random() * ACTIVITY_FEED.length)];
      const newEvent = { ...randomEvent, id:`live-${Date.now()}`, timestamp: new Date().toISOString() };
      setFeed(f => [newEvent, ...f.slice(0, 99)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [live]);

  const allTypes = useMemo(() => [...new Set((ACTIVITY_FEED as unknown as any[]).map(e=>e.type))], []);
  const filtered = useMemo(() => typeFilter === 'all' ? feed : feed.filter(e=>e.type===typeFilter), [feed, typeFilter]);

  return (
    <>
      <Helmet><title>Actividad en tiempo real – Admin</title></Helmet>
      <PageHeader title="Centro de Actividad" subtitle="Eventos del sistema en tiempo real"
        breadcrumb={[{label:'Admin'},{label:'Actividad'}]}
        action={
          <Button size="sm" variant={live?'primary':'outline'} onClick={()=>setLive(l=>!l)}>
            <RefreshCw className={cn('h-4 w-4 mr-1.5', live&&'animate-spin')}/>
            {live ? 'Live' : 'Pausado'}
          </Button>
        }
      />

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 flex-wrap">
        <button onClick={()=>setTypeFilter('all')} className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-all',
          typeFilter==='all'?'bg-primary-600 text-white border-primary-600':'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-surface-200 dark:border-slate-700 hover:border-primary-400')}>
          Todos
        </button>
        {allTypes.map(t=>(
          <button key={t} onClick={()=>setTypeFilter(t)} className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-all',
            typeFilter===t?'bg-primary-600 text-white border-primary-600':'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-surface-200 dark:border-slate-700 hover:border-primary-400')}>
            {TYPE_LABELS[t]?.label || t}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-surface-100 dark:divide-slate-800 max-h-[calc(100vh-340px)] overflow-y-auto">
          {isLoading ? [...Array(8)].map((_,i)=>(
            <div key={i} className="p-4"><Skeleton className="h-14"/></div>
          )) : (
            <AnimatePresence mode="popLayout">
              {filtered.map(event => (
                <motion.div key={event.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} layout
                  className="flex items-start gap-3 p-4 hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={()=>setSelected(event)}>
                  <EventIcon name={event.icon} color={event.color}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{event.title}</p>
                      <Badge variant={TYPE_LABELS[event.type]?.variant||'default'} size="sm">{TYPE_LABELS[event.type]?.label||event.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{event.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{event.actorName} · {formatRelative(event.timestamp)}</p>
                  </div>
                  <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-all shrink-0">
                    <Eye className="h-3.5 w-3.5"/>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        <div className="px-4 py-3 border-t border-surface-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} eventos{typeFilter!=='all'?' filtrados':''}</span>
          {live && <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>Actualizando automáticamente</span>}
        </div>
      </div>
      <AnimatePresence>{selected && <DetailModal event={selected} onClose={()=>setSelected(null)}/>}</AnimatePresence>
    </>
  );
}
