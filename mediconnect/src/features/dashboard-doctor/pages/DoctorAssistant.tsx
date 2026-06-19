import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Loader2, User, Zap, Stethoscope } from 'lucide-react';
import { chatbotService } from '../../../shared/services/chatbotService';
import { useAuthStore } from '../../../shared/stores/authStore';
import { useTodaySchedule, useDoctorFinanceKPIs, usePendingRequests } from '../../../shared/hooks/useDoctor';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { cn } from '../../../shared/utils';

interface Msg { id: string; role: 'user' | 'assistant'; text: string; }
const uid = () => Math.random().toString(36).slice(2);

const PRESETS = [
  'Resumen de mi agenda de hoy',
  'Solicitudes pendientes de pacientes',
  'Sugerencia de diagnóstico para hipertensión refractaria',
  'Genera observaciones para seguimiento de diabetes',
  '¿Cuáles son mis ingresos este mes?',
  'Mejores prácticas para recetas de opioides',
];

export default function DoctorAssistant() {
  const { user } = useAuthStore();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: todayAppts } = useTodaySchedule();
  const { data: kpis } = useDoctorFinanceKPIs();
  const { data: pendingReqs } = usePendingRequests();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  useEffect(() => {
    setMsgs([{
      id: uid(), role: 'assistant',
      text: `¡Hola Dr. ${user?.name?.split(' ').slice(-2)[0]} 👋! Soy tu **Asistente IA Clínico**. Tengo acceso a tu agenda, pacientes y métricas. ¿En qué puedo ayudarte hoy?`
    }]);
  }, []);

  const buildContextualResponse = (msg: string): string | null => {
    const lower = msg.toLowerCase();
    if (lower.includes('agenda') || lower.includes('hoy') || lower.includes('citas hoy')) {
      const count = (todayAppts || []).length;
      if (count === 0) return 'No tienes citas programadas para hoy. ¿Quieres revisar la agenda de mañana?';
      return `Hoy tienes **${count} cita(s) programada(s)**. La primera es a las ${(todayAppts as unknown as any[])[0]?.time ?? 'N/A'} con ${(todayAppts as unknown as any[])[0]?.patientName ?? 'tu paciente'}. ¿Necesitas más detalles sobre alguna?`;
    }
    if (lower.includes('solicitud') || lower.includes('pendiente') || lower.includes('reprogramación')) {
      const count = (pendingReqs || []).length;
      return count === 0
        ? 'No tienes solicitudes pendientes de pacientes en este momento.'
        : `Tienes **${count} solicitud(es) pendiente(s)**. ${count > 0 ? `La más reciente es de ${(pendingReqs as unknown as any[])[0]?.patientName}: ${(pendingReqs as unknown as any[])[0]?.type === 'reschedule' ? 'solicita reprogramación' : 'solicita cancelación'}.` : ''} ¿Quieres aprobar o rechazar alguna?`;
    }
    if (lower.includes('ingreso') || lower.includes('finanzas') || lower.includes('dinero')) {
      return `Este mes llevas **$${kpis?.monthRevenue?.toLocaleString() ?? 0}** en ingresos con **${kpis?.monthConsultations ?? 0} consultas** realizadas. Tu ticket promedio es **$${kpis?.avgTicket ?? 0}**. ${(kpis?.monthRevenueChange ?? 0) >= 0 ? `📈 Crecimiento del ${kpis?.monthRevenueChange}% vs mes anterior.` : `📉 Caída del ${Math.abs(kpis?.monthRevenueChange ?? 0)}% vs mes anterior.`}`;
    }
    if (lower.includes('hipertensión refractaria') || lower.includes('diagnóstico')) {
      return '**Diagnóstico diferencial sugerido para hipertensión refractaria:**\n\n• Hiperaldosteronismo primario (descartar con aldosterona/renina plasmática)\n• Feocromocitoma (metanefrinas en orina de 24h)\n• Síndrome de Cushing (cortisol libre urinario)\n• Estenosis arteria renal (eco-doppler renal)\n• Apnea del sueño (polisomnografía)\n\n⚠️ Verificar adherencia al tratamiento y descartar pseudorresistencia antes de proceder.';
    }
    if (lower.includes('diabetes') || lower.includes('observaciones')) {
      return '**Plantilla de observaciones para seguimiento de Diabetes tipo 2:**\n\nPaciente refiere cumplimiento del tratamiento farmacológico. Control glucémico: HbA1c [VALOR]%. Glucosa ayunas [VALOR] mg/dL. Se evidencia [mejoría/deterioro] metabólico. Se ajusta [mantiene] esquema terapéutico. Indicaciones: dieta hipocalórica, actividad física 150 min/semana, automonitoreo glucémico. Próximo control en [PLAZO].';
    }
    if (lower.includes('opioide') || lower.includes('receta') || lower.includes('opioid')) {
      return '**Mejores prácticas para prescripción de opioides:**\n\n✅ Evaluar riesgo de abuso antes de prescribir (herramienta ORT)\n✅ Iniciar con dosis mínima efectiva y duración limitada\n✅ Documentar diagnóstico, plan de tratamiento y consentimiento\n✅ Revisar historial en sistema SISFAR (Perú)\n✅ Monitoreo regular cada 1-3 meses\n✅ Plan de desescalada desde el inicio\n\n⚠️ Evitar prescripción en pacientes con antecedente de abuso de sustancias sin evaluación especializada.';
    }
    return null;
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMsgs(m => [...m, { id: uid(), role: 'user', text: text.trim() }]);
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
      setMsgs(m => [...m, { id: uid(), role: 'assistant', text: response }]);
    } catch {
      setMsgs(m => [...m, { id: uid(), role: 'assistant', text: 'Lo siento, tuve un problema. ¿Puedes intentarlo de nuevo?' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderText = (t: string) => {
    const lines = t.split('\n');
    return lines.map((line, li) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={li}>
          {parts.map((p, pi) => p.startsWith('**') && p.endsWith('**')
            ? <strong key={pi}>{p.slice(2,-2)}</strong>
            : <span key={pi}>{p}</span>
          )}
          {li < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      <Helmet><title>Asistente IA – Dashboard Médico</title></Helmet>
      <PageHeader title="Asistente IA Clínico" subtitle="Tu asistente médico con contexto de tu práctica"
        breadcrumb={[{ label: 'Dashboard Médico', href: '/dashboard/doctor' }, { label: 'Asistente IA' }]} />

      <div className="grid lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 card overflow-hidden flex flex-col" style={{ height: '580px' }}>
          <div className="px-5 py-3.5 border-b border-surface-200 dark:border-slate-800 flex items-center gap-3 shrink-0 bg-gradient-to-r from-teal-600 to-primary-700">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-white"/>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Asistente IA Clínico</p>
              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/><p className="text-xs text-teal-100">Conectado · Acceso a tu práctica médica</p></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-surface-50 dark:bg-slate-950">
            <AnimatePresence>
              {msgs.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    msg.role === 'assistant' ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300')}>
                    {msg.role === 'assistant' ? <Bot className="h-4 w-4"/> : <User className="h-4 w-4"/>}
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
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0"><Bot className="h-4 w-4 text-teal-600"/></div>
                <div className="bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                  {[0,1,2].map(i => <motion.span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{y:[0,-4,0]}} transition={{duration:0.6,delay:i*0.15,repeat:Infinity}}/>)}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          <div className="px-4 py-3 border-t border-surface-200 dark:border-slate-800 flex gap-2 shrink-0 bg-white dark:bg-slate-900">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Pregunta sobre agenda, pacientes, diagnósticos..." disabled={loading}
              className="flex-1 bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400 disabled:opacity-50"/>
            <button onClick={() => send(input)} disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 disabled:opacity-40 transition-colors shrink-0 active:scale-95">
              {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500"/>Preguntas rápidas</h3>
            <div className="space-y-2">
              {PRESETS.map(p => (
                <button key={p} onClick={() => send(p)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:text-teal-700 dark:hover:text-teal-400 rounded-lg transition-colors border border-surface-100 dark:border-slate-800">
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Contexto activo</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Citas hoy', value: `${(todayAppts || []).length}` },
                { label: 'Solicitudes pendientes', value: `${(pendingReqs || []).length}` },
                { label: 'Ingresos del mes', value: `$${(kpis?.monthRevenue || 0).toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-surface-50 dark:border-slate-800 last:border-0">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
