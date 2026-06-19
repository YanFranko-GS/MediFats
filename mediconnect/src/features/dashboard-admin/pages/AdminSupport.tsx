import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Send, CheckCircle, RotateCcw, Mail, Clock } from 'lucide-react';
import { PageHeader, KpiCard } from '../../../shared/components/molecules/StatusComponents';
import { Badge, Avatar, Skeleton } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { useSupportTickets } from '../hooks/useAdminMaster';
import { useAdminMasterStore } from '../store/adminMasterStore';
import { formatRelative, cn } from '../../../shared/utils';
import { toast } from 'sonner';

const STATUS_CFG: Record<string, { label: string; variant: any }> = {
  open:     { label: 'Abierto',    variant: 'primary' },
  pending:  { label: 'Pendiente',  variant: 'warning' },
  resolved: { label: 'Resuelto',   variant: 'success' },
  closed:   { label: 'Cerrado',    variant: 'default' },
};
const PRIORITY_CFG: Record<string, { label: string; variant: any }> = {
  low:    { label: 'Baja',    variant: 'default' },
  medium: { label: 'Media',   variant: 'warning' },
  high:   { label: 'Alta',    variant: 'error' },
  urgent: { label: 'Urgente', variant: 'error' },
};

export default function AdminSupport() {
  const { data: tickets = [], isLoading } = useSupportTickets();
  const { resolveTicket } = useAdminMasterStore();
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState('');
  const [localMessages, setLocalMessages] = useState<Record<string, any[]>>({});
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = tickets.filter(t => statusFilter === 'all' || t.status === statusFilter);
  const selectedTicket = selected ? { ...selected, messages: [...(selected.messages || []), ...(localMessages[selected.id] || [])] } : null;

  const stats = {
    open: tickets.filter(t=>t.status==='open').length,
    pending: tickets.filter(t=>t.status==='pending').length,
    resolved: tickets.filter(t=>t.status==='resolved').length,
  };

  function sendReply() {
    if (!reply.trim() || !selected) return;
    const msg = {
      id: `msg-reply-${Date.now()}`, senderId:'u-admin-1', senderName:'Soporte MediConnect',
      senderRole:'support', senderAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=admin-mediconnect',
      content: reply, timestamp: new Date().toISOString(),
    };
    setLocalMessages(m => ({ ...m, [selected.id]: [...(m[selected.id]||[]), msg] }));
    setReply('');
    toast.success('Respuesta enviada');
  }

  return (
    <>
      <Helmet><title>Soporte – Admin</title></Helmet>
      <PageHeader title="Centro de Soporte" subtitle="Gestión de tickets y conversaciones"
        breadcrumb={[{label:'Admin'},{label:'Soporte'}]}/>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiCard title="Abiertos" value={stats.open} icon={<Mail className="h-5 w-5"/>} iconColor="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"/>
        <KpiCard title="Pendientes" value={stats.pending} icon={<Clock className="h-5 w-5"/>} iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"/>
        <KpiCard title="Resueltos" value={stats.resolved} icon={<CheckCircle className="h-5 w-5"/>} iconColor="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"/>
      </div>

      <div className="grid lg:grid-cols-5 gap-5 h-[calc(100vh-380px)] min-h-[500px]">
        {/* Ticket list */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col">
          <div className="p-3 border-b border-surface-200 dark:border-slate-800">
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
              <option value="all">Todos los estados</option>
              {Object.entries(STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-surface-100 dark:divide-slate-800">
            {isLoading ? [...Array(4)].map((_,i)=><div key={i} className="p-3"><Skeleton className="h-16"/></div>) :
            filtered.map(ticket => (
              <button key={ticket.id} onClick={() => setSelected(ticket)} className={cn(
                'w-full text-left p-3.5 hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors',
                selected?.id === ticket.id && 'bg-primary-50 dark:bg-primary-950/20 border-r-2 border-r-primary-500')}>
                <div className="flex items-start gap-2.5">
                  <Avatar src={ticket.userAvatar} name={ticket.userName} size="sm"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 text-xs truncate">{ticket.userName}</p>
                      <Badge variant={PRIORITY_CFG[ticket.priority]?.variant||'default'} size="sm">{PRIORITY_CFG[ticket.priority]?.label}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">{ticket.subject}</p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant={STATUS_CFG[ticket.status]?.variant||'default'} size="sm" dot>{STATUS_CFG[ticket.status]?.label}</Badge>
                      <span className="text-xs text-slate-400">{formatRelative(ticket.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className="lg:col-span-3 card overflow-hidden flex flex-col">
          {!selectedTicket ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              <div className="text-center space-y-2">
                <p className="text-4xl">💬</p>
                <p>Selecciona un ticket para ver la conversación</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{selectedTicket.subject}</p>
                  <p className="text-xs text-slate-500">{selectedTicket.userName} · {selectedTicket.category}</p>
                </div>
                <div className="flex gap-2">
                  {selectedTicket.status !== 'resolved' && (
                    <Button size="sm" variant="success"
                      onClick={() => { resolveTicket(selected.id); toast.success('Ticket marcado como resuelto'); setSelected(null); }}>
                      <CheckCircle className="h-3.5 w-3.5 mr-1"/>Resolver
                    </Button>
                  )}
                  {selectedTicket.status === 'resolved' && (
                    <Button size="sm" variant="outline" onClick={() => toast.success('Ticket reabierto')}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1"/>Reabrir
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedTicket.messages?.map((msg: any) => (
                  <motion.div key={msg.id} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                    className={cn('flex gap-2.5', msg.senderRole === 'support' && 'flex-row-reverse')}>
                    <Avatar src={msg.senderAvatar} name={msg.senderName} size="sm"/>
                    <div className={cn('max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm',
                      msg.senderRole === 'support'
                        ? 'bg-primary-600 text-white rounded-tr-sm'
                        : 'bg-surface-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm')}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={cn('text-xs mt-1', msg.senderRole==='support' ? 'text-primary-200' : 'text-slate-400')}>{formatRelative(msg.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-3 border-t border-surface-200 dark:border-slate-800 flex gap-2">
                <input value={reply} onChange={e=>setReply(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendReply();} }}
                  placeholder="Escribe tu respuesta…"
                  className="flex-1 px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"/>
                <Button onClick={sendReply} disabled={!reply.trim()}>
                  <Send className="h-4 w-4"/>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
