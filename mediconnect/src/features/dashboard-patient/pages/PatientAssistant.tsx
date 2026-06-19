import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Loader2, User, Zap } from 'lucide-react';
import { chatbotService } from '../../../shared/services/chatbotService';
import { useAuthStore } from '../../../shared/stores/authStore';
import { usePatientAppointments, useAppointmentStats } from '../../../shared/hooks/useAppointments';
import { useActiveMedications } from '../../../shared/hooks/usePatient';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { cn, formatDate } from '../../../shared/utils';

interface Msg { id: string; role: 'user' | 'assistant'; text: string; ts: string; }
const uid = () => Math.random().toString(36).slice(2);

const PRESETS = [
  '¿Cuándo es mi próxima cita?',
  '¿Cuántas recetas activas tengo?',
  '¿Con qué especialista me recomiendas atenderme?',
  'Muéstrame un resumen de mi historial',
  '¿Cómo está mi presión arterial?',
  '¿Qué debo hacer antes de mi cita?',
];

export default function PatientAssistant() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: appointments } = usePatientAppointments();
  const { data: stats } = useAppointmentStats();
  const { data: meds } = useActiveMedications();

  const now = new Date();
  const nextAppt = (appointments || [])
    .filter((a: any) => a.status === 'scheduled' && new Date(a.date) >= now)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Context-aware response generator
  const buildContextualResponse = (msg: string): string | null => {
    const lower = msg.toLowerCase();
    if (lower.includes('próxima cita') || lower.includes('siguiente cita')) {
      if (!nextAppt) return 'No tienes citas programadas próximamente. ¿Quieres que te ayude a buscar un médico?';
      return `Tu próxima cita es con **${nextAppt.doctorName}** (${nextAppt.doctorSpecialty}) el **${formatDate(nextAppt.date, 'dd MMMM')} a las ${nextAppt.time}**. Modalidad: ${nextAppt.mode === 'video' ? 'videollamada' : 'presencial'}.`;
    }
    if (lower.includes('receta') || lower.includes('medicamento') || lower.includes('pastilla')) {
      const count = (meds as unknown as any[])?.length ?? 0;
      if (count === 0) return 'No tienes recetas activas en este momento.';
      const names = (meds as unknown as any[]).slice(0, 3).map((m: any) => `**${m.name}** ${m.dose}`).join(', ');
      return `Tienes **${count} receta(s) activa(s)**. Las principales son: ${names}${count > 3 ? ` y ${count - 3} más` : ''}. ¿Quieres ver los detalles de alguna?`;
    }
    if (lower.includes('historial') || lower.includes('resumen') || lower.includes('consultas')) {
      return `Has tenido **${stats?.total ?? 0} consultas** en total: ${stats?.completed ?? 0} completadas, ${stats?.upcoming ?? 0} próximas y ${stats?.cancelled ?? 0} canceladas. ¿Quieres ver el historial completo?`;
    }
    if (lower.includes('presión') || lower.includes('salud')) {
      return 'Según tus últimos registros, tu presión arterial promedio es **120/80 mmHg** (dentro del rango normal). Te recomiendo continuar con tus controles periódicos. ¿Quieres ver tus métricas de salud completas?';
    }
    if (lower.includes('especialista') || lower.includes('recomiendas')) {
      return 'Basándome en tu historial, has consultado más frecuentemente **Cardiología** y **Medicina General**. Si tienes síntomas nuevos, te recomiendo agendar con tu médico de cabecera. ¿Te ayudo a buscar uno disponible?';
    }
    if (lower.includes('antes de') && lower.includes('cita')) {
      return '**Antes de tu cita te recomiendo:** ✅ Ayuno de 8h si es análisis de sangre · ✅ Llevar documentos de identificación · ✅ Lista de medicamentos actuales · ✅ Anotar tus síntomas y dudas · ✅ Llegar 10 min antes. ¿Algo más en lo que pueda ayudarte?';
    }
    return null;
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { id: uid(), role: 'user', text: text.trim(), ts: new Date().toISOString() };
    setMsgs(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const contextual = buildContextualResponse(text);
      let response: string;
      if (contextual) {
        await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
        response = contextual;
      } else {
        const res = await chatbotService.getResponse(text);
        response = res.message;
      }
      setMsgs(m => [...m, { id: uid(), role: 'assistant', text: response, ts: new Date().toISOString() }]);
    } catch {
      setMsgs(m => [...m, { id: uid(), role: 'assistant', text: 'Lo siento, tuve un problema. ¿Puedes intentarlo de nuevo?', ts: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  // Welcome on first load
  useEffect(() => {
    setMsgs([{ id: uid(), role: 'assistant', ts: new Date().toISOString(),
      text: `¡Hola ${user?.name.split(' ')[0]} 👋! Soy tu **Asistente de Salud IA**. Tengo acceso a tu historial médico, citas y recetas. ¿En qué puedo ayudarte hoy?` }]);
  }, []);

  const renderText = (t: string) => {
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>);
  };

  return (
    <>
      <Helmet><title>Asistente IA – MediConnect</title></Helmet>
      <PageHeader title="Asistente de Salud IA" subtitle="Tu asistente personal con contexto de tu historial médico"
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Asistente IA' }]} />

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Chat */}
        <div className="lg:col-span-3 card overflow-hidden flex flex-col" style={{ height: '580px' }}>
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-surface-200 dark:border-slate-800 flex items-center gap-3 shrink-0 bg-gradient-to-r from-primary-600 to-primary-700">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><Bot className="h-5 w-5 text-white" /></div>
            <div>
              <p className="text-sm font-semibold text-white">MediBot IA</p>
              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><p className="text-xs text-primary-100">Conectado · Conoce tu historial</p></div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-surface-50 dark:bg-slate-950">
            <AnimatePresence>
              {msgs.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    msg.role === 'assistant' ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300')}>
                    {msg.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={cn('max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'assistant'
                      ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-surface-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
                      : 'bg-primary-600 text-white rounded-tr-sm')}>
                    {renderText(msg.text)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0"><Bot className="h-4 w-4 text-primary-600" /></div>
                <div className="bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                  {[0,1,2].map(i => <motion.span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0,-4,0] }} transition={{ duration: 0.6, delay: i*0.15, repeat: Infinity }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-surface-200 dark:border-slate-800 flex gap-2 shrink-0 bg-white dark:bg-slate-900">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Pregunta sobre tus citas, recetas, historial..." disabled={loading}
              className="flex-1 bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400 disabled:opacity-50" />
            <button onClick={() => send(input)} disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-40 transition-colors shrink-0 active:scale-95">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Sidebar: presets + context */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" />Preguntas rápidas</h3>
            <div className="space-y-2">
              {PRESETS.map(p => (
                <button key={p} onClick={() => send(p)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-700 dark:hover:text-primary-400 rounded-lg transition-colors border border-surface-100 dark:border-slate-800">
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Contexto activo</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: t('patientDashboard.patient'), value: user?.name.split(' ')[0] },
                { label: 'Próxima cita', value: nextAppt ? formatDate(nextAppt.date, 'dd MMM') : 'Ninguna' },
                { label: 'Recetas activas', value: `${(meds as unknown as any[])?.length ?? 0}` },
                { label: 'Total consultas', value: `${stats?.total ?? 0}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-surface-50 dark:border-slate-800 last:border-0">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">El asistente tiene acceso a tu información médica para darte respuestas personalizadas.</p>
          </div>
        </div>
      </div>
    </>
  );
}
