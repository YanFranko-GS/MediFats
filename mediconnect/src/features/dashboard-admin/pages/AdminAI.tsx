import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bot, Send, Sparkles, TrendingDown, AlertTriangle, BarChart, Users, DollarSign } from 'lucide-react';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Button } from '../../../shared/components/atoms/Button';
import { cn } from '../../../shared/utils';
import { toast } from 'sonner';

const SUGGESTIONS = [
  { icon:<BarChart className="h-4 w-4"/>, text:'Generar reporte ejecutivo semanal', color:'blue' },
  { icon:<TrendingDown className="h-4 w-4"/>, text:'Detectar caída de reservas en los últimos 7 días', color:'amber' },
  { icon:<AlertTriangle className="h-4 w-4"/>, text:'Identificar médicos con rating menor a 4.0', color:'red' },
  { icon:<DollarSign className="h-4 w-4"/>, text:'Resumen de ingresos: este mes vs mes anterior', color:'green' },
  { icon:<Sparkles className="h-4 w-4"/>, text:'Predicción de ingresos para el próximo mes', color:'purple' },
  { icon:<Users className="h-4 w-4"/>, text:'Listar usuarios inactivos en los últimos 30 días', color:'teal' },
];

const COLOR_MAP: Record<string, string> = {
  blue:'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/40 border-blue-200 dark:border-blue-900',
  amber:'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 border-amber-200 dark:border-amber-900',
  red:'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900',
  green:'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/40 border-green-200 dark:border-green-900',
  purple:'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/40 border-purple-200 dark:border-purple-900',
  teal:'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-950/40 border-teal-200 dark:border-teal-900',
};

const MOCK_RESPONSES: Record<string, string> = {
  'reporte ejecutivo semanal': `📊 **Reporte Ejecutivo Semanal – Semana del 9 al 14 de junio 2026**\n\n**Resumen de negocio:**\n• MRR actual: $47,320 (+5.2% vs semana anterior)\n• Nuevas reservas: 312 citas (+8.1%)\n• Nuevos usuarios: 47 pacientes, 3 médicos\n• Tasa de conversión: 7.8% (objetivo: 8.0%)\n\n**Alertas importantes:**\n⚠️ Tasa de cancelación del 15.3% (por encima del umbral del 12%)\n⚠️ 3 médicos pendientes de aprobación desde hace más de 48h\n✅ NPS = 72 puntos (excelente)\n\n**Recomendaciones:**\n1. Revisar política de cancelaciones para reducir la tasa actual\n2. Priorizar aprobación de médicos pendientes (Gastroenterología demandada)\n3. Impulsar campaña de reactivación para 23 pacientes inactivos`,
  'caída de reservas': `📉 **Análisis de reservas – Últimos 7 días**\n\nSe detectó una caída del **12.4%** en reservas comparado con la semana anterior.\n\n**Por especialidad más afectada:**\n• Traumatología: −28% (2 médicos con ausencias)\n• Neurología: −15% (disponibilidad reducida)\n• Oftalmología: −8% (normal, estacional)\n\n**Causa probable:** La reducción en Traumatología correlaciona con los horarios cerrados de Dr. Pedro Ramos y Dra. Elena Soto esta semana.\n\n**Acción sugerida:** Habilitar la opción de sustitución automática con médicos disponibles de la misma especialidad.`,
  'médicos con rating': `⭐ **Médicos con rating inferior a 4.0**\n\nSe identificaron **4 médicos** con rating bajo:\n\n| Médico | Especialidad | Rating | Reseñas |\n|---|---|---|---|\n| Dr. Marcos Vila | Traumatología | 3.6 | 12 |\n| Dra. Rosa Soto | Medicina General | 3.8 | 28 |\n| Dr. Fabio Reyes | Neurología | 3.9 | 8 |\n| Dra. Carla Muñoz | Ginecología | 3.9 | 15 |\n\n**Recomendación:** Iniciar protocolo de mejora de calidad: envío de formulario de feedback y reunión de revisión en los próximos 7 días.`,
  'ingresos': `💰 **Comparativa de ingresos: Mayo vs Junio 2026**\n\n| Métrica | Mayo 2026 | Junio 2026* | Δ |\n|---|---|---|---|\n| Ingresos totales | $42,840 | $47,320 | +10.5% |\n| Comisión plataforma | $8,568 | $9,464 | +10.5% |\n| Pago a médicos | $34,272 | $37,856 | +10.5% |\n| Ticket promedio | $78.5 | $82.1 | +4.6% |\n| N° consultas | 546 | 576 | +5.5% |\n\n*Junio proyectado al ritmo actual\n\n**Destacado:** El ticket promedio creció gracias al aumento de consultas de especialidades premium (Cardiología y Neurología).`,
  'predicción': `🔮 **Predicción de ingresos – Julio 2026**\n\nModelo basado en tendencias históricas, estacionalidad y crecimiento de usuarios:\n\n**Estimación puntual:** $51,200 – $54,800\n**Escenario base:** $52,900 (+11.8% vs junio)\n\n**Factores positivos:**\n✅ 47 nuevos pacientes registrados esta semana\n✅ 3 médicos nuevos aprobados en especialidades demandadas\n✅ Campaña de reactivación planificada para semana 1 de julio\n\n**Riesgos:**\n⚠️ Temporada vacacional puede reducir citas presenciales −8%\n⚠️ Tasa de churn actual del 4.2% debe contenerse\n\n**Confianza del modelo:** Alta (R² = 0.91)`,
  'usuarios inactivos': `👤 **Usuarios inactivos – Sin actividad en 30+ días**\n\nTotal identificados: **23 pacientes**\n\n**Segmentación:**\n• 30-45 días sin reserva: 14 usuarios\n• 45-60 días sin reserva: 6 usuarios\n• +60 días sin reserva: 3 usuarios\n\n**Perfil típico:** Paciente que realizó 1-2 consultas y no continuó.\n\n**Estrategia de reactivación recomendada:**\n1. Email personalizado recordando historial médico (7 días)\n2. Descuento del 10% en próxima consulta (14 días)\n3. Notificación push de disponibilidad de su médico habitual (21 días)\n\n**Tasa de reactivación esperada:** 22-28% con esta estrategia.`,
};

function getResponse(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes('reporte') || lower.includes('semanal') || lower.includes('ejecutivo')) return MOCK_RESPONSES['reporte ejecutivo semanal'];
  if (lower.includes('caída') || lower.includes('reservas') || lower.includes('bajada')) return MOCK_RESPONSES['caída de reservas'];
  if (lower.includes('rating') || lower.includes('rendimiento') || lower.includes('bajo')) return MOCK_RESPONSES['médicos con rating'];
  if (lower.includes('ingreso') || lower.includes('mes') || lower.includes('revenue')) return MOCK_RESPONSES['ingresos'];
  if (lower.includes('predicción') || lower.includes('próximo') || lower.includes('proyección')) return MOCK_RESPONSES['predicción'];
  if (lower.includes('inactiv') || lower.includes('30 días') || lower.includes('sin reserva')) return MOCK_RESPONSES['usuarios inactivos'];
  return `He analizado los datos de la plataforma para responder tu consulta: **"${q}"**\n\nBasándome en los datos actuales (${new Date().toLocaleDateString('es-PE')}):\n\n• **Plataforma activa:** 247 usuarios activos hoy\n• **MRR actual:** $47,320\n• **Citas hoy:** 89 consultas realizadas\n• **NPS:** 72 (excelente)\n\nPara análisis más específicos, prueba alguna de las sugerencias del panel izquierdo.`;
}

interface Message { id: string; role: 'user'|'assistant'; content: string; ts: string; }

export default function AdminAI() {
  const [messages, setMessages] = useState<Message[]>([
    { id:'init', role:'assistant', content:'¡Hola! Soy el asistente de IA administrativo de MediConnect. Puedo analizar datos, generar reportes, detectar tendencias y darte recomendaciones basadas en los datos reales de la plataforma. ¿En qué te puedo ayudar hoy?', ts: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  async function send(text?: string) {
    const q = text || input;
    if (!q.trim()) return;
    setInput('');
    const userMsg: Message = { id:`u${Date.now()}`, role:'user', content:q, ts:new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const aiMsg: Message = { id:`a${Date.now()}`, role:'assistant', content:getResponse(q), ts:new Date().toISOString() };
    setMessages(m => [...m, aiMsg]);
    setLoading(false);
  }

  return (
    <>
      <Helmet><title>Asistente IA – Admin</title></Helmet>
      <PageHeader title="Asistente IA Administrativo" subtitle="Análisis inteligente de la plataforma"
        breadcrumb={[{label:'Admin'},{label:'Asistente IA'}]}/>

      <div className="grid lg:grid-cols-4 gap-5 h-[calc(100vh-280px)] min-h-[520px]">
        {/* Suggestions */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Consultas rápidas</p>
          {SUGGESTIONS.map((s,i) => (
            <button key={i} onClick={()=>send(s.text)}
              className={cn('w-full text-left p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all', COLOR_MAP[s.color])}>
              {s.icon}{s.text}
            </button>
          ))}
        </div>

        {/* Chat */}
        <div className="lg:col-span-3 card overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b border-surface-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white"/>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">MediConnect AI Admin</p>
              <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/>En línea</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={cn('flex gap-3', msg.role==='user'&&'flex-row-reverse')}>
                <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold',
                  msg.role==='assistant' ? 'bg-gradient-to-br from-primary-600 to-violet-600' : 'bg-slate-700')}>
                  {msg.role==='assistant'?<Bot className="h-3.5 w-3.5"/>:'A'}
                </div>
                <div className={cn('max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  msg.role==='assistant' ? 'bg-surface-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm' : 'bg-primary-600 text-white rounded-tr-sm')}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shrink-0"><Bot className="h-3.5 w-3.5 text-white"/></div>
                <div className="bg-surface-50 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0,1,2].map(i=><span key={i} className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{animationDelay:`${i*150}ms`}}/>)}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          <div className="p-3 border-t border-surface-200 dark:border-slate-800 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }}
              placeholder="Pregunta sobre métricas, usuarios, ingresos, tendencias…"
              className="flex-1 px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"/>
            <Button onClick={()=>send()} disabled={!input.trim()||loading}>
              <Send className="h-4 w-4"/>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
