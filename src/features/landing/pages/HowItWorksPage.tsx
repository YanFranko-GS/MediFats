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
    iconConnector: <Users className="h-6 w-6 text-clinical-700" />,
    title: 'Elige tu especialista',
    desc: 'Busca por especialidad, síntoma o nombre del médico que necesitas.',
  },
  {
    num: '2',
    icon: <Calendar className="h-7 w-7" />,
    iconConnector: <Calendar className="h-6 w-6 text-clinical-700" />,
    title: 'Selecciona fecha y hora',
    desc: 'Elige el día y la hora que mejor se adapte a tu agenda.',
  },
  {
    num: '3',
    icon: <Shield className="h-7 w-7" />,
    iconConnector: <Shield className="h-6 w-6 text-clinical-700" />,
    title: 'Confirma tu cita',
    desc: 'Completa tu reserva de forma segura y recibe la confirmación al instante.',
  },
  {
    num: '4',
    icon: <Heart className="h-7 w-7" />,
    iconConnector: <Heart className="h-6 w-6 text-clinical-700" />,
    title: 'Asiste a tu consulta',
    desc: 'Acude a tu cita presencial o conéctate a tu consulta virtual y recibe la atención que mereces.',
  },
];

const WHY_US = [
  { icon: <Shield className="h-6 w-6 text-clinical-700" />, title: 'Profesionales certificados', desc: 'Médicos altamente capacitados y verificados.' },
  { icon: <Shield className="h-6 w-6 text-clinical-700" />, title: 'Seguridad total', desc: 'Protegemos tu información con los más altos estándares de seguridad.' },
  { icon: <Clock className="h-6 w-6 text-clinical-700" />, title: 'Ahorra tiempo', desc: 'Reserva en minutos y evita largas esperas.' },
  { icon: <Heart className="h-6 w-6 text-clinical-700" />, title: 'Atención de calidad', desc: 'Tu bienestar es nuestra prioridad en cada consulta.' },
];

const STATS = [
  { icon: <Calendar className="h-5 w-5" />, value: '+50,000', label: 'Citas reservadas' },
  { icon: <Users className="h-5 w-5" />, value: '+500', label: 'Especialistas certificados' },
  { icon: <Stethoscope className="h-5 w-5" />, value: '+50', label: 'Clínicas aliadas' },
  { icon: <Shield className="h-5 w-5" />, value: '98%', label: 'Pacientes satisfechos' },
];

const FAQS = [
  { q: '¿Es gratis registrarse en SmartSalud?', a: 'Sí, el registro como paciente es completamente gratuito. Solo pagas por las consultas que reserves, sin mensualidades ni costos ocultos.' },
  { q: '¿Cómo sé que los médicos son confiables?', a: 'Todos los médicos pasan por un proceso de verificación de credenciales que incluye título médico, especialidad certificada y registro en el Colegio Médico.' },
  { q: '¿Puedo cancelar una cita?', a: 'Sí. Puedes cancelar hasta 24 horas antes de la consulta sin costo. Cancelaciones tardías pueden aplicar una penalidad del 50% del valor de la consulta.' },
  { q: '¿Las teleconsultas son igual de efectivas?', a: 'Para muchas consultas, sí. Las teleconsultas son ideales para seguimientos, consultas de resultados, prescripciones de renovación y evaluación de síntomas leves.' },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-mist-200 dark:border-slate-800 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-clinical-700 dark:hover:text-clinical-300 transition-colors">
        <span className="font-medium text-ink-900 dark:text-slate-100 text-sm">{q}</span>
        <ChevronDown className={cn('h-4 w-4 text-ink-500/60 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="pb-4 text-ink-500 dark:text-slate-400 text-sm leading-relaxed">
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
        <title>Cómo Funciona – SmartSalud</title>
        <meta name="description" content="Aprende cómo reservar tu cita médica en SmartSalud en 4 simples pasos. Rápido, seguro y fácil." />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-mist-50 dark:bg-slate-900 overflow-hidden border-b border-mist-200 dark:border-slate-800">
        <div className="absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full bg-clinical-100/70 dark:bg-clinical-900/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="eyebrow mb-4">Cómo funciona</span>
              <h1 className="font-display text-4xl lg:text-[3.2rem] font-semibold text-ink-900 dark:text-white leading-[1.08] tracking-tight mb-5">
                Tu salud nunca fue<br />
                tan <span className="italic text-clinical-700 dark:text-clinical-300">fácil</span> y <span className="italic text-clinical-700 dark:text-clinical-300">rápida</span>
              </h1>
              <p className="text-ink-500 dark:text-slate-400 leading-relaxed mb-7 max-w-md text-lg">
                Reservar tu cita médica es simple, rápido y seguro.
                En solo 4 pasos, conecta con el especialista ideal
                y cuida tu salud sin complicaciones.
              </p>
              {/* Feature badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-0">
                {HERO_BADGES.map((b, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-clinical-50 dark:bg-clinical-950/30 text-clinical-700 flex items-center justify-center">
                      {b.icon}
                    </div>
                    <p className="text-xs font-semibold text-ink-900 dark:text-slate-300">{b.label}</p>
                    <p className="text-xs text-ink-500/70">{b.sub}</p>
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
      className="w-[420px] h-[520px] rounded-3xl object-cover shadow-clinical"
    />

    {/* Card 1 */}
    <div className="absolute top-8 -right-10 bg-white dark:bg-slate-800 rounded-xl shadow-clinical p-4 w-[180px] border border-clinical-100/60 dark:border-slate-700">
      <p className="text-xs text-ink-500/70 mb-1">
        Citas reservadas
      </p>

      <p className="text-2xl font-display font-semibold text-ink-900 dark:text-slate-100">
        +50,000
      </p>

      <p className="text-xs text-ink-500/70">
        este mes
      </p>
    </div>

    {/* Card 2 */}
    <div className="absolute top-1/2 -translate-y-1/2 -right-10 bg-white dark:bg-slate-800 rounded-xl shadow-clinical p-4 w-[180px] border border-clinical-100/60 dark:border-slate-700">
      <p className="text-xs text-ink-500/70 mb-2">
        Pacientes satisfechos
      </p>

      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 fill-vital-500 text-vital-500" />

        <span className="font-display font-semibold text-ink-900 dark:text-slate-100">
          4.9
        </span>
      </div>

      <div className="flex gap-0.5 mt-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="h-3 w-3 fill-vital-500 text-vital-500"
          />
        ))}
      </div>

      <p className="text-xs text-ink-500/70 mt-1">
        +10,000 reseñas
      </p>
    </div>

    {/* Card 3 */}
    <div className="absolute bottom-8 -right-10 bg-white dark:bg-slate-800 rounded-xl shadow-clinical p-4 w-[180px] border border-clinical-100/60 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="h-4 w-4 text-clinical-700" />

        <span className="text-xs font-semibold text-ink-900 dark:text-slate-200">
          Certificados
        </span>
      </div>

      <p className="font-semibold text-ink-900 dark:text-slate-100">
        +500 profesionales
      </p>
    </div>

  </div>
</motion.div>
          </div>
        </div>
      </section>

      {/* ── 4 STEPS ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-mist-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: steps */}
            <motion.div {...fadeUp}>
              <span className="eyebrow mb-3">En 4 pasos simples</span>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight mb-9">
                Así de fácil es cuidar tu salud
              </h2>

              {/* Step icons row */}
              <div className="flex items-center gap-2 mb-8">
                {STEPS_FULL.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="w-10 h-10 rounded-full border-2 border-clinical-200 dark:border-clinical-800 text-clinical-700 flex items-center justify-center bg-white dark:bg-slate-900">
                      {step.iconConnector}
                    </div>
                    {i < STEPS_FULL.length - 1 && (
                      <div className="flex-1 h-px border-t-2 border-dashed border-clinical-200 dark:border-clinical-800" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step details grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {STEPS_FULL.map((step, i) => (
                  <div key={i}>
                    <p className="text-2xl font-display font-semibold text-clinical-700 dark:text-clinical-300 mb-1">{step.num}</p>
                    <p className="font-semibold text-ink-900 dark:text-slate-100 text-sm mb-1">{step.title}</p>
                    <p className="text-xs text-ink-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: phone mockup */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex justify-center">
              <img
  src="/img/celular.png"
  alt="Aplicación móvil"
  className="w-100 h-[480px] rounded-[2.5rem] object-cover shadow-clinical"
/>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="eyebrow justify-center mb-3">¿Por qué elegirnos?</span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight">
              Más que una plataforma,<br />
              tu <span className="italic text-clinical-700 dark:text-clinical-300">aliado en salud</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_US.map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-start gap-3 p-5 rounded-2xl border border-mist-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-clinical-sm hover:-translate-y-0.5 transition-all">
                <div className="w-10 h-10 rounded-xl bg-clinical-50 dark:bg-clinical-950/30 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-ink-900 dark:text-slate-100 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-ink-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ──────────────────────────────────────────────────── */}
      <section className="bg-clinical-900 py-11">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center">
            {STATS.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-vital-400">{s.icon}</span>
                  <p className="text-2xl lg:text-3xl font-display font-semibold">{s.value}</p>
                </div>
                <p className="text-sm text-clinical-200">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOOKING ───────────────────────────────────────────────────── */}
      <section className="py-14 bg-mist-50 dark:bg-slate-950">
  <div className="max-w-7xl mx-auto px-6">
    <div className="bg-white dark:bg-slate-900 border border-clinical-100 dark:border-slate-800 rounded-3xl px-10 py-8 shadow-clinical-sm">

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
          <h3 className="font-display text-[2.2rem] font-semibold text-ink-900 dark:text-white leading-tight mb-4 tracking-tight">
            ¿Listo para cuidar
            <br />
            lo más importante?
          </h3>

          <p className="text-lg text-ink-500 dark:text-slate-400">
            Reserva tu cita hoy mismo y da el primer paso
            hacia una vida más saludable.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-start gap-5 min-w-[280px]">

          <Link
            to="/doctors"
            className="btn-clinical px-10 py-4"
          >
            Reservar mi cita ahora
          </Link>

          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-clinical-700" />

            <span className="text-ink-500 dark:text-slate-400">
              Es rápido, fácil y seguro
            </span>
          </div>

        </div>

      </div>

    </div>
  </div>
</section>

      {/* ── CLINIC ALLIES ─────────────────────────────────────────────────── */}
      <section className="py-10 bg-white dark:bg-slate-900 border-t border-mist-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-6">
            <span className="eyebrow justify-center mb-2">Clínicas aliadas</span>
            <p className="text-ink-700 dark:text-slate-300 font-semibold">Con el respaldo de las mejores clínicas del país</p>
          </motion.div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['Clínica San Pablo', 'Clínica Ricardo Palma', 'AUNA', 'Clínica Internacional', 'Sanitas'].map(c => (
              <div key={c} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-mist-200 dark:border-slate-700">
                <div className="w-5 h-5 rounded-full bg-clinical-100 dark:bg-clinical-950/30 flex items-center justify-center">
                  <Stethoscope className="h-2.5 w-2.5 text-clinical-700" />
                </div>
                <span className="text-sm font-semibold text-ink-700 dark:text-slate-400">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-mist-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h2 className="font-display text-3xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight">Preguntas frecuentes</h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-mist-200 dark:border-slate-800 shadow-clinical-sm px-6">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </motion.div>
        </div>
      </section>
    </>
  );
}
