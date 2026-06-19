import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Clock, Shield, CheckCircle2, Users, Heart,
  Calendar, Stethoscope, Star, ArrowRight, ChevronDown,
} from 'lucide-react';
import { cn } from '../../../shared/utils';

/* ── Image placeholder ─────────────────────────────────────────────────────── */
function ImgSlot({ className, label, rounded = 'rounded-2xl' }: { className?: string; label?: string; rounded?: string }) {
  return (
    <div className={cn('relative bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center', rounded, className)}>
      <div className="text-center p-4 select-none pointer-events-none">
        <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-400 font-medium">{label ?? 'Imagen'}</p>
        <p className="text-[10px] text-slate-300 mt-0.5">Se adapta automáticamente</p>
      </div>
    </div>
  );
}

const HERO_BADGES = [
  { icon: <Clock className="h-4 w-4" />, label: 'Rápido', sub: 'En minutos' },
  { icon: <Shield className="h-4 w-4" />, label: 'Seguro', sub: '100% confiable' },
  { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Fácil', sub: 'Sin complicaciones' },
  { icon: <Stethoscope className="h-4 w-4" />, label: 'Cercano', sub: 'Especialistas cerca de ti' },
];

const STEPS_FULL = [
  {
    num: '1',
    icon: <Users className="h-7 w-7" />,
    iconConnector: <Users className="h-6 w-6 text-primary-600" />,
    title: 'Elige tu especialista',
    desc: 'Busca por especialidad, síntoma o nombre del médico que necesitas.',
  },
  {
    num: '2',
    icon: <Calendar className="h-7 w-7" />,
    iconConnector: <Calendar className="h-6 w-6 text-primary-600" />,
    title: 'Selecciona fecha y hora',
    desc: 'Elige el día y la hora que mejor se adapte a tu agenda.',
  },
  {
    num: '3',
    icon: <Shield className="h-7 w-7" />,
    iconConnector: <Shield className="h-6 w-6 text-primary-600" />,
    title: 'Confirma tu cita',
    desc: 'Completa tu reserva de forma segura y recibe la confirmación al instante.',
  },
  {
    num: '4',
    icon: <Heart className="h-7 w-7" />,
    iconConnector: <Heart className="h-6 w-6 text-primary-600" />,
    title: 'Asiste a tu consulta',
    desc: 'Acude a tu cita presencial o conéctate a tu consulta virtual y recibe la atención que mereces.',
  },
];

const WHY_US = [
  { icon: <Shield className="h-6 w-6 text-primary-600" />, title: 'Profesionales certificados', desc: 'Médicos altamente capacitados y verificados.' },
  { icon: <Shield className="h-6 w-6 text-primary-600" />, title: 'Seguridad total', desc: 'Protegemos tu información con los más altos estándares de seguridad.' },
  { icon: <Clock className="h-6 w-6 text-primary-600" />, title: 'Ahorra tiempo', desc: 'Reserva en minutos y evita largas esperas.' },
  { icon: <Heart className="h-6 w-6 text-primary-600" />, title: 'Atención de calidad', desc: 'Tu bienestar es nuestra prioridad en cada consulta.' },
];

const STATS = [
  { icon: <Calendar className="h-5 w-5" />, value: '+50,000', label: 'Citas reservadas' },
  { icon: <Users className="h-5 w-5" />, value: '+500', label: 'Especialistas certificados' },
  { icon: <Stethoscope className="h-5 w-5" />, value: '+50', label: 'Clínicas aliadas' },
  { icon: <Shield className="h-5 w-5" />, value: '98%', label: 'Pacientes satisfechos' },
];

const FAQS = [
  { q: '¿Es gratis registrarse en CLÍNICA FAST?', a: 'Sí, el registro como paciente es completamente gratuito. Solo pagas por las consultas que reserves, sin mensualidades ni costos ocultos.' },
  { q: '¿Cómo sé que los médicos son confiables?', a: 'Todos los médicos pasan por un proceso de verificación de credenciales que incluye título médico, especialidad certificada y registro en el Colegio Médico.' },
  { q: '¿Puedo cancelar una cita?', a: 'Sí. Puedes cancelar hasta 24 horas antes de la consulta sin costo. Cancelaciones tardías pueden aplicar una penalidad del 50% del valor de la consulta.' },
  { q: '¿Las teleconsultas son igual de efectivas?', a: 'Para muchas consultas, sí. Las teleconsultas son ideales para seguimientos, consultas de resultados, prescripciones de renovación y evaluación de síntomas leves.' },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-surface-200 dark:border-slate-800 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        <span className="font-medium text-slate-800 dark:text-slate-100 text-sm">{q}</span>
        <ChevronDown className={cn('h-4 w-4 text-slate-400 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="pb-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {a}
        </motion.div>
      )}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <Helmet>
        <title>Cómo Funciona – CLÍNICA FAST</title>
        <meta name="description" content="Aprende cómo reservar tu cita médica en CLÍNICA FAST en 4 simples pasos. Rápido, seguro y fácil." />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 border-b border-surface-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-1.5 text-primary-600 text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-3 h-0.5 bg-primary-600" /> CÓMO FUNCIONA
              </span>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 dark:text-white leading-tight mb-3">
                Tu salud nunca fue<br />
                tan <span className="text-primary-600">fácil</span> y <span className="text-primary-600">rápida</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 max-w-md">
                Reservar tu cita médica es simple, rápido y seguro.<br />
                En solo 4 pasos, conecta con el especialista ideal<br />
                y cuida tu salud sin complicaciones.
              </p>
              {/* Feature badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-0">
                {HERO_BADGES.map((b, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 flex items-center justify-center">
                      {b.icon}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{b.label}</p>
                    <p className="text-xs text-slate-400">{b.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: hero image + floating cards */}
            <motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.15 }}
  className="hidden lg:flex items-center justify-end"
>
  <div className="relative">

    <img
      src="/img/doctora1.png"
      alt="Médico / Doctora"
      className="w-[420px] h-[520px] rounded-3xl object-cover"
    />

    {/* Card 1 */}
    <div className="absolute top-8 -right-10 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 w-[180px]">
      <p className="text-xs text-slate-400 mb-1">
        Citas reservadas
      </p>

      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        +50,000
      </p>

      <p className="text-xs text-slate-400">
        este mes
      </p>
    </div>

    {/* Card 2 */}
    <div className="absolute top-1/2 -translate-y-1/2 -right-10 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 w-[180px]">
      <p className="text-xs text-slate-400 mb-2">
        Pacientes satisfechos
      </p>

      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

        <span className="font-bold text-slate-800 dark:text-slate-100">
          4.9
        </span>
      </div>

      <div className="flex gap-0.5 mt-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="h-3 w-3 fill-amber-400 text-amber-400"
          />
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-1">
        +10,000 reseñas
      </p>
    </div>

    {/* Card 3 */}
    <div className="absolute bottom-8 -right-10 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 w-[180px]">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="h-4 w-4 text-primary-600" />

        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          Certificados
        </span>
      </div>

      <p className="font-bold text-slate-800 dark:text-slate-100">
        +500 profesionales
      </p>
    </div>

  </div>
</motion.div>
          </div>
        </div>
      </section>

      {/* ── 4 STEPS ───────────────────────────────────────────────────────── */}
      <section className="py-16 bg-surface-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: steps */}
            <motion.div {...fadeUp}>
              <span className="text-primary-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <span className="w-3 h-0.5 bg-primary-600" /> EN 4 PASOS SIMPLES
              </span>
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-slate-800 dark:text-slate-100 mb-8">
                Así de fácil es cuidar tu salud
              </h2>

              {/* Step icons row */}
              <div className="flex items-center gap-2 mb-8">
                {STEPS_FULL.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="w-10 h-10 rounded-full border-2 border-primary-200 dark:border-primary-800 text-primary-600 flex items-center justify-center">
                      {step.iconConnector}
                    </div>
                    {i < STEPS_FULL.length - 1 && (
                      <div className="flex-1 h-px border-t-2 border-dashed border-primary-200 dark:border-primary-800" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step details grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {STEPS_FULL.map((step, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold font-data text-primary-600 mb-1">{step.num}</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{step.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: phone mockup */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex justify-center">
              <img
  src="/img/celular.png"
  alt="Aplicación móvil"
  className="w-100 h-[480px] rounded-[2.5rem] object-cover"
/>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="text-primary-600 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <span className="w-3 h-0.5 bg-primary-600" /> ¿POR QUÉ ELEGIRNOS?
            </span>
            <h2 className="text-2xl lg:text-3xl font-heading font-bold text-slate-800 dark:text-slate-100">
              Más que una plataforma,<br />
              tu <span className="text-primary-600">aliado en salud</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_US.map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-start gap-3 p-5 rounded-2xl border border-surface-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ──────────────────────────────────────────────────── */}
      <section className="bg-primary-800 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center">
            {STATS.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="opacity-75">{s.icon}</span>
                  <p className="text-2xl lg:text-3xl font-bold font-data">{s.value}</p>
                </div>
                <p className="text-sm text-primary-100">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOOKING ───────────────────────────────────────────────────── */}
      <section className="py-12 bg-surface-50 dark:bg-slate-950">
  <div className="max-w-7xl mx-auto px-6">
    <div className="bg-white dark:bg-slate-900 border border-primary-100 dark:border-slate-800 rounded-3xl px-10 py-8">

      <div className="flex items-center justify-between gap-12">

        {/* Imagen */}
        <div className="hidden lg:block flex-shrink-0">
          <img
            src="/img/papahija.png"
            alt="Familia usando aplicación médica"
            className="w-[280px] h-auto object-contain"
          />
        </div>

        {/* Texto */}
        <div className="flex-1 max-w-[450px]">
          <h3 className="text-[35px] font-bold text-slate-900 dark:text-white leading-tight mb-4">
            ¿Listo para cuidar
            <br />
            lo más importante?
          </h3>

          <p className="text-lg text-slate-500 dark:text-slate-400">
            Reserva tu cita hoy mismo y da el primer paso
            hacia una vida más saludable.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-start gap-5 min-w-[280px]">

          <Link
            to="/doctors"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-10 py-4 rounded-xl shadow-lg transition-all"
          >
            Reservar mi cita ahora
          </Link>

          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary-600" />

            <span className="text-slate-500 dark:text-slate-400">
              Es rápido, fácil y seguro
            </span>
          </div>

        </div>

      </div>

    </div>
  </div>
</section>

      {/* ── CLINIC ALLIES ─────────────────────────────────────────────────── */}
      <section className="py-10 bg-white dark:bg-slate-900 border-t border-surface-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-6">
            <span className="text-primary-600 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
              <span className="w-3 h-0.5 bg-primary-600" /> CLÍNICAS ALIADAS
            </span>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">Con el respaldo de las mejores clínicas del país</p>
          </motion.div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['Clínica San Pablo', 'Clínica Ricardo Palma', 'AUNA', 'Clínica Internacional', 'Sanitas'].map(c => (
              <div key={c} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 dark:border-slate-700">
                <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center">
                  <Stethoscope className="h-2.5 w-2.5 text-primary-600" />
                </div>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-surface-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold text-slate-800 dark:text-slate-100">Preguntas frecuentes</h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 shadow-sm px-6">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </motion.div>
        </div>
      </section>
    </>
  );
}
