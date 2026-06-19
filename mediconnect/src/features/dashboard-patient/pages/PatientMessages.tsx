import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Search, Send, MessageCircle } from 'lucide-react';
import { useConversations, useMessages, useSendMessage } from '../../../shared/hooks/usePatient';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Spinner } from '../../../shared/components/atoms/index';
import { cn, formatRelative } from '../../../shared/utils';

export default function PatientMessages() {
  const { t } = useTranslation();
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [q, setQ] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: conversations, isLoading: loadingConvs } = useConversations();
  const { data: messages, isLoading: loadingMsgs } = useMessages(activeConv);
  const sendMutation = useSendMessage();

  const filtered = (conversations || []).filter((c: any) => c.contactName.toLowerCase().includes(q.toLowerCase()));
  const activeConvObj = (conversations || []).find((c: any) => c.id === activeConv);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !activeConv) return;
    await sendMutation.mutateAsync({ conversationId: activeConv, text: text.trim() });
    setText('');
  };

  return (
    <>
      <Helmet><title>{t('patientDashboard.messagesTitle')}</title></Helmet>
      <PageHeader title="Mensajes" subtitle="Comunicación con tus médicos"
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Mensajes' }]} />

      <div className="card overflow-hidden" style={{ height: '620px', display: 'flex' }}>
        {/* Left: conversations */}
        <div className="w-72 shrink-0 border-r border-surface-200 dark:border-slate-800 flex flex-col">
          <div className="p-3 border-b border-surface-100 dark:border-slate-800">
            <div className="flex items-center gap-2 bg-surface-50 dark:bg-slate-800 rounded-xl px-3 py-2">
              <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar..."
                className="bg-transparent text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none flex-1" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="p-4 flex justify-center"><Spinner size="sm" /></div>
            ) : filtered.map((conv: any) => (
              <button key={conv.id} onClick={() => setActiveConv(conv.id)}
                className={cn('w-full flex items-start gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors text-left border-b border-surface-50 dark:border-slate-800/50',
                  activeConv === conv.id && 'bg-primary-50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900')}>
                <div className="relative shrink-0">
                  <img src={conv.contactAvatar} alt={conv.contactName} className="w-10 h-10 rounded-full bg-primary-50 object-cover" />
                  {conv.unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{conv.unreadCount}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{conv.contactName}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{conv.lastTimestamp ? formatRelative(conv.lastTimestamp) : ''}</span>
                  </div>
                  <p className={cn('text-xs truncate mt-0.5', conv.unreadCount > 0 ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-400')}>{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center text-center px-8">
              <div>
                <MessageCircle className="h-14 w-14 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-medium mb-1">{t('patientDashboard.selectConversation')}</p>
                <p className="text-sm text-slate-400">{t('patientDashboard.chooseDoctor')}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-3 border-b border-surface-200 dark:border-slate-800 flex items-center gap-3 shrink-0">
                {activeConvObj && (<>
                  <img src={activeConvObj.contactAvatar} alt={activeConvObj.contactName} className="w-9 h-9 rounded-full bg-primary-50 object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{activeConvObj.contactName}</p>
                    <p className="text-xs text-slate-400">{activeConvObj.specialty || activeConvObj.contactRole}</p>
                  </div>
                </>)}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-surface-50 dark:bg-slate-950">
                {loadingMsgs ? <div className="flex justify-center pt-8"><Spinner /></div> :
                (messages || []).map((msg: any) => (
                  <div key={msg.id} className={cn('flex gap-2 max-w-[75%]', msg.role === 'user' ? 'ml-auto flex-row-reverse' : '')}>
                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-7 h-7 rounded-full bg-primary-50 object-cover shrink-0 mt-0.5" />
                    <div className={cn('px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-surface-200 dark:border-slate-700 rounded-tl-sm shadow-sm')}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-surface-200 dark:border-slate-800 flex gap-2 shrink-0 bg-white dark:bg-slate-900">
                <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Escribe un mensaje..." disabled={sendMutation.isPending}
                  className="flex-1 bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                <button onClick={handleSend} disabled={!text.trim() || sendMutation.isPending}
                  className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-40 transition-colors shrink-0">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
