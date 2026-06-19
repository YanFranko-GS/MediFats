import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Ban, MonitorOff, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { PageHeader, KpiCard } from '../../../shared/components/molecules/StatusComponents';
import { Badge, Avatar, Skeleton } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { useLoginAttempts, useActiveSessions, useSecurityAlerts } from '../hooks/useAdminMaster';
import { useAdminMasterStore } from '../store/adminMasterStore';
import { formatDate, formatRelative, cn } from '../../../shared/utils';
import { toast } from 'sonner';

const TABS = [
  { key:'alerts', label:'Alertas' },
  { key:'attempts', label:'Intentos fallidos' },
  { key:'sessions', label:'Sesiones activas' },
  { key:'settings', label:'Configuración' },
];

const ALERT_SEVERITY: Record<string,any> = {
  critical:{ variant:'error', label:'Crítica' },
  high:    { variant:'error', label:'Alta' },
  medium:  { variant:'warning', label:'Media' },
  low:     { variant:'default', label:'Baja' },
};

export default function AdminSecurity() {
  const { data: attempts = [], isLoading: l1 } = useLoginAttempts();
  const { data: sessions = [], isLoading: l2 } = useActiveSessions();
  const { data: alerts = [], isLoading: l3 } = useSecurityAlerts();
  const { blockedIps, blockIp, closeSession, settings, updateSettings } = useAdminMasterStore();
  const [tab, setTab] = useState('alerts');

  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <>
      <Helmet><title>Seguridad – Admin</title></Helmet>
      <PageHeader title="Seguridad del Sistema" subtitle="Monitoreo y control de accesos"
        breadcrumb={[{label:'Admin'},{label:'Seguridad'}]}/>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Alertas activas" value={activeAlerts.length} icon={<AlertTriangle className="h-5 w-5"/>} iconColor="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"/>
        <KpiCard title="IPs bloqueadas" value={attempts.filter(a=>a.status==='blocked').length + blockedIps.length} icon={<Ban className="h-5 w-5"/>} iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"/>
        <KpiCard title="Sesiones activas" value={sessions.length} icon={<Shield className="h-5 w-5"/>} iconColor="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"/>
        <KpiCard title="Intentos fallidos (24h)" value={attempts.filter(a=>new Date(a.timestamp)>new Date(Date.now()-86400000)).length} icon={<Lock className="h-5 w-5"/>} iconColor="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"/>
      </div>

      <div className="flex gap-1 p-1 bg-surface-100 dark:bg-slate-800 rounded-xl w-fit mb-5 flex-wrap">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab===t.key?'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm':'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'alerts' && (
        <div className="space-y-3">
          {l3 ? [...Array(3)].map((_,i)=><Skeleton key={i} className="h-20"/>) :
          alerts.map(alert => (
            <div key={alert.id} className={cn('card p-4 flex items-start gap-4 border-l-4',
              alert.severity==='critical'?'border-l-red-600':alert.severity==='high'?'border-l-red-400':alert.severity==='medium'?'border-l-amber-500':'border-l-slate-300')}>
              <AlertTriangle className={cn('h-5 w-5 mt-0.5 shrink-0',
                alert.severity==='critical'||alert.severity==='high'?'text-red-500':'text-amber-500')}/>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={ALERT_SEVERITY[alert.severity]?.variant||'default'} size="sm">{ALERT_SEVERITY[alert.severity]?.label||alert.severity}</Badge>
                  <Badge variant={alert.resolved?'success':'warning'} size="sm" dot>{alert.resolved?'Resuelta':'Activa'}</Badge>
                  <span className="text-xs text-slate-400 ml-auto">{formatRelative(alert.timestamp)}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{alert.description}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">IP: {alert.ip}</p>
              </div>
              {!alert.resolved && !blockedIps.includes(alert.ip) && (
                <Button size="sm" variant="outline" className="text-red-600 border-red-300 shrink-0"
                  onClick={()=>{ blockIp(alert.ip); toast.success(`IP ${alert.ip} bloqueada`); }}>
                  <Ban className="h-3.5 w-3.5 mr-1"/>Bloquear IP
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'attempts' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
                <tr>{['Email objetivo','IP','País','Intentos','Estado','Fecha','Acción'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
                {l1 ? [...Array(5)].map((_,i)=><tr key={i}><td colSpan={7} className="px-4 py-3"><Skeleton className="h-6"/></td></tr>) :
                attempts.map(a => (
                  <tr key={a.id} className="hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100 text-xs">{a.email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">{a.ip}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{a.country}</td>
                    <td className="px-4 py-3"><span className="font-bold text-red-600 dark:text-red-400">{a.attempts}</span></td>
                    <td className="px-4 py-3"><Badge variant={a.status==='blocked'?'error':'warning'} size="sm" dot>{a.status==='blocked'?'Bloqueada':'Fallida'}</Badge></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(a.timestamp)}</td>
                    <td className="px-4 py-3">
                      {!blockedIps.includes(a.ip) && a.status !== 'blocked' ? (
                        <Button size="sm" variant="outline" className="text-red-600 border-red-300"
                          onClick={()=>{ blockIp(a.ip); toast.success(`IP ${a.ip} bloqueada`); }}>
                          <Ban className="h-3.5 w-3.5 mr-1"/>Bloquear
                        </Button>
                      ) : <Badge variant="error" size="sm">IP Bloqueada</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'sessions' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
                <tr>{['Usuario','Dispositivo','IP / Ubicación','Última actividad','Acción'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
                {l2 ? [...Array(3)].map((_,i)=><tr key={i}><td colSpan={5} className="px-4 py-3"><Skeleton className="h-8"/></td></tr>) :
                sessions.map(s => (
                  <tr key={s.id} className={cn('hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors', s.isCurrent && 'bg-primary-50/50 dark:bg-primary-950/10')}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={s.userAvatar} name={s.userName} size="sm"/>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100 text-xs">{s.userName}</p>
                          <p className="text-xs text-slate-500">{s.userRole}{s.isCurrent&&<span className="ml-1 text-primary-600 font-medium">(Sesión actual)</span>}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{s.device} · {s.browser}</td>
                    <td className="px-4 py-3 text-xs"><p className="font-mono text-slate-600 dark:text-slate-400">{s.ip}</p><p className="text-slate-400">{s.location}</p></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatRelative(s.lastActivity)}</td>
                    <td className="px-4 py-3">
                      {!s.isCurrent && (
                        <Button size="sm" variant="outline" onClick={()=>{ closeSession(s.id); toast.success('Sesión cerrada'); }}>
                          <MonitorOff className="h-3.5 w-3.5 mr-1"/>Cerrar sesión
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="card p-6 max-w-lg space-y-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Políticas de seguridad</h3>
          {[
            { key:'force2FA', label:'Forzar autenticación 2FA', desc:'Todos los usuarios deberán configurar 2FA' },
          ].map(item => (
            <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-surface-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <button onClick={() => {
                updateSettings({ security: { ...settings.security, [item.key]: !(settings.security as any)[item.key] } });
                toast.success('Configuración actualizada');
              }} className={cn('w-11 h-6 rounded-full transition-colors shrink-0',
                (settings.security as any)[item.key] ? 'bg-primary-600' : 'bg-surface-300 dark:bg-slate-700')}>
                <div className={cn('w-4 h-4 bg-white rounded-full shadow transition-transform mx-1',
                  (settings.security as any)[item.key] ? 'translate-x-5' : 'translate-x-0')}/>
              </button>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Intentos máximos de login: <span className="text-primary-600">{settings.security.maxLoginAttempts}</span>
            </label>
            <input type="range" min={3} max={10} value={settings.security.maxLoginAttempts}
              onChange={e => updateSettings({ security: { ...settings.security, maxLoginAttempts: +e.target.value } })}
              className="w-full accent-primary-600"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Timeout de sesión: <span className="text-primary-600">{settings.security.sessionTimeoutMinutes} min</span>
            </label>
            <input type="range" min={15} max={480} step={15} value={settings.security.sessionTimeoutMinutes}
              onChange={e => updateSettings({ security: { ...settings.security, sessionTimeoutMinutes: +e.target.value } })}
              className="w-full accent-primary-600"/>
          </div>
        </div>
      )}
    </>
  );
}
