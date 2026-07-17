import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Shield, Users, Clock, Heart, CheckCircle2, ArrowRight,
  Calendar, Star, Stethoscope, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '../../../shared/utils';

/* ── Image placeholder – adapts to any img placed inside ──────────────────── */
function ImgSlot({
  className, label, rounded = 'rounded-2xl',
}: { className?: string; label?: string; rounded?: string }) {
  return (
    <div className={cn('relative bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center', rounded, className)}>
      <div className="text-center p-4 select-none pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-2 flex items-center justify-center">
          <Users className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-xs text-slate-400 font-medium">{label ?? 'Imagen'}</p>
        <p className="text-[10px] text-slate-300 mt-0.5">Se adapta automáticamente</p>
      </div>
    </div>
  );
}

function PulseTrace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 60" preserveAspectRatio="none" className={cn('w-full h-full', className)} aria-hidden="true">
      <path d="M0 30 H150 L172 30 L185 8 L200 52 L215 30 L230 30 H600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STATS = [
  { icon: <Calendar className="h-5 w-5" />, value: '+50,000', label: 'Citas reservadas cada mes' },
  { icon: <Users className="h-5 w-5" />, value: '+500', label: 'Especialistas certificados' },
  { icon: <Shield className="h-5 w-5" />, value: '+50', label: 'Clínicas aliadas en todo el país' },
  { icon: <Heart className="h-5 w-5" />, value: '98%', label: 'Pacientes satisfechos' },
];

const WHY_DIFFERENT = [
  { icon: <Shield className="h-5 w-5 text-primary-600" />, title: 'Seguridad garantizada', desc: 'Protegemos tu información con los más altos estándares de seguridad.' },
  { icon: <Users className="h-5 w-5 text-primary-600" />, title: 'Especialistas certificados', desc: 'Todos nuestros médicos pasan por un riguroso proceso de verificación.' },
  { icon: <Clock className="h-5 w-5 text-primary-600" />, title: 'Ahorra tiempo', desc: 'Reserva en minutos y evita largas esperas.' },
  { icon: <Heart className="h-5 w-5 text-primary-600" />, title: 'Atención humanizada', desc: 'Nos importa tu bienestar y te acompañamos en cada paso.' },
];

const TEAM = [
  { name: 'Carla Fernández', role: 'CEO & Co-fundadora', avatar: 'carla-fernandez' },
  { name: 'Andrés Ramírez', role: 'CTO & Co-fundador', avatar: 'andres-ramirez' },
  { name: 'María Gutiérrez', role: 'Directora Médica', avatar: 'maria-gutierrez' },
  { name: 'Luis Mendoza', role: 'Director de Operaciones', avatar: 'luis-mendoza' },
  { name: 'Sofía Torres', role: 'Directora de Marketing', avatar: 'sofia-torres' },
];

const TESTIMONIALS = [
  { name: 'Lucía Ramírez', role: 'Paciente de Dermatología', avatar: 'lucia-ramirez', text: 'Gracias a CLÍNICA FAST encontré al especialista que necesitaba en minutos. La atención fue excelente y todo muy fácil de usar.' },
  { name: 'Carlos Mendoza', role: 'Paciente de Cardiología', avatar: 'carlos-mendoza', text: 'Excelente plataforma, me ahorra tiempo y me da la confianza saber que los médicos están verificados.' },
  { name: 'María López', role: 'Paciente de Pediatría', avatar: 'maria-lopez', text: 'Pude reservar la cita para mi hija sin salir de casa. La atención pediátrica fue maravillosa.' },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function AboutPage() {
  const [testIdx, setTestIdx] = useState(0);

  return (
    <>
      <Helmet>
        <title>Sobre Nosotros – Clínica Fast</title>
        <meta name="description" content="Conoce la misión, historia y equipo de Clínica Fast, la plataforma de reservas médicas líder en Perú." />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-mist-50 dark:bg-slate-900 overflow-hidden border-b border-mist-200 dark:border-slate-800">
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-clinical-100/70 dark:bg-clinical-900/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="eyebrow mb-4">Sobre Clínica Fast</span>
              <h1 className="font-display text-4xl lg:text-[3.2rem] font-semibold text-ink-900 dark:text-white leading-[1.08] tracking-tight mb-5">
                Conectamos personas<br />
                con la mejor <span className="italic text-clinical-700 dark:text-clinical-300">atención<br />médica</span>
              </h1>
              <p className="text-ink-500 dark:text-slate-400 leading-relaxed mb-7 max-w-md text-lg">
                En Clínica Fast creemos que la salud de calidad debe ser accesible, rápida y confiable para todos.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  [<Heart className="h-4 w-4 text-vital-500" />, 'Atención de calidad'],
                  [<Shield className="h-4 w-4 text-vital-500" />, 'Tecnología que cuida de ti'],
                  [<Users className="h-4 w-4 text-vital-500" />, 'Especialistas certificados'],
                  [<CheckCircle2 className="h-4 w-4 text-vital-500" />, 'Comprometidos contigo'],
                ].map(([icon, lbl], i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-ink-700 dark:text-slate-400 font-medium">
                    {icon as React.ReactNode} {lbl as string}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: image + mission badge */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="relative hidden lg:block">
              <img
                src="/img/familia2.png"
                alt="Familia / Pacientes"
                className="w-full h-80 object-cover rounded-3xl shadow-clinical"
              />
              {/* Mission badge */}
              <div className="absolute bottom-6 right-6 bg-clinical-800 text-white rounded-2xl px-4 py-3 shadow-xl max-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-vital-400" />
                  <p className="text-xs font-bold">Tu salud es nuestra misión</p>
                </div>
                <p className="text-xs text-clinical-200">Miles de familias confían en nosotros cada día para cuidar lo más importante.</p>
              </div>
            </motion.div>
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

      {/* ── HISTORY / MISSION ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp}>
              <span className="eyebrow mb-3">Nuestra historia</span>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight mb-5">
                Nacimos para <span className="italic text-clinical-700 dark:text-clinical-300">transformar</span><br />la experiencia en salud
              </h2>
              <p className="text-ink-500 dark:text-slate-400 leading-relaxed mb-3 text-sm">
                Clínica Fast nació en el 2022 con una misión clara: eliminar las barreras entre las personas y la atención médica de calidad.
              </p>
              <p className="text-ink-500 dark:text-slate-400 leading-relaxed mb-3 text-sm">
                Sabemos que tu tiempo es valioso y tu salud es lo más importante. Por eso creamos una plataforma intuitiva, segura y confiable que te permite encontrar especialistas, reservar citas y recibir atención de forma rápida y sin complicaciones.
              </p>
              <p className="text-ink-500 dark:text-slate-400 leading-relaxed mb-7 text-sm">
                Hoy, seguimos innovando cada día para conectar a más personas con los mejores profesionales de la salud.
              </p>
              <button className="btn-clinical-outline text-sm px-5 py-2.5">
                Conoce más sobre nuestra historia
              </button>
            </motion.div>

            {/* Right: image + "Nuestro propósito" badge */}
            <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }} className="relative">
              <img
                src="/img/doctor.png"
                alt="Médico realizando una consulta con una tablet"
                className="w-full h-80 object-cover rounded-3xl shadow-clinical"
              />
              {/* Purpose badge */}
              <div className="absolute bottom-6 right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-4 py-3 max-w-[180px] border border-clinical-100/70 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-vital-50 dark:bg-vital-950/40 flex items-center justify-center">
                    <Heart className="h-3.5 w-3.5 text-vital-500" />
                  </div>
                  <p className="text-xs font-bold text-ink-900 dark:text-slate-100">Nuestro propósito</p>
                </div>
                <p className="text-xs text-ink-500 dark:text-slate-400">Mejorar la calidad de vida de las personas conectándolos con especialistas de confianza.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY DIFFERENT ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-mist-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="eyebrow justify-center mb-3">Por qué elegirnos</span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight">
              Lo que nos hace diferentes
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_DIFFERENT.map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 pt-7 border border-mist-200 dark:border-slate-800 hover:shadow-clinical-sm hover:-translate-y-0.5 transition-all overflow-hidden">
                <span className="absolute top-0 left-0 right-0 h-1 bg-clinical-600" />
                <div className="w-11 h-11 rounded-xl bg-clinical-50 dark:bg-clinical-950/30 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <p className="font-semibold text-ink-900 dark:text-slate-100 text-sm mb-1.5">{item.title}</p>
                <p className="text-xs text-ink-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="eyebrow justify-center mb-3">Nuestro equipo</span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight">
              Personas que trabajan por tu salud
            </h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex flex-col items-center w-36">
                {/* Team member image placeholder – round */}
                <div className="w-24 h-24 rounded-full bg-mist-100 dark:bg-slate-800 flex items-center justify-center mb-3 border-2 border-clinical-100 dark:border-slate-700 overflow-hidden">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-clinical-200 mx-auto" />
                    <p className="text-[9px] text-clinical-300 mt-0.5">Foto</p>
                  </div>
                </div>
                <p className="font-semibold text-ink-900 dark:text-slate-100 text-xs text-center leading-tight">{member.name}</p>
                <p className="text-xs text-ink-500 text-center mt-0.5 leading-tight">{member.role}</p>
                <button className="mt-2 w-7 h-7 rounded-full bg-clinical-50 dark:bg-clinical-950/30 flex items-center justify-center hover:bg-clinical-100 transition-colors">
                  <svg className="h-3.5 w-3.5 text-clinical-700" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-mist-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="eyebrow justify-center mb-3">Lo que dicen nuestros pacientes</span>
            <h2 className="font-display text-3xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight">
              Historias reales, resultados reales
            </h2>
          </motion.div>

          {/* Testimonials grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-mist-200 dark:border-slate-800 shadow-clinical-sm">
                <div className="text-vital-500 text-4xl font-display leading-none mb-3">"</div>
                <p className="text-ink-700 dark:text-slate-300 text-sm leading-relaxed mb-5 italic font-display">{t.text}</p>
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-9 h-9 rounded-full bg-clinical-100 dark:bg-clinical-950/40 flex items-center justify-center shrink-0">
                    <span className="text-clinical-700 font-bold text-sm">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-900 dark:text-slate-100">{t.name}</p>
                    <p className="text-xs text-ink-500/70">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2, 3, 4].map(i => (
              <button key={i}
                className={cn('w-2 h-2 rounded-full transition-colors', i === 0 ? 'bg-vital-500' : 'bg-clinical-200 dark:bg-slate-700')} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="py-14 bg-gradient-to-r from-clinical-900 to-clinical-700">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Calendar className="h-7 w-7 text-vital-400" />
            </div>
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-white font-display font-semibold text-xl tracking-tight">Tu salud es nuestra prioridad</h3>
              <p className="text-clinical-200 text-sm mt-1">
                Miles de personas ya confían en nosotros para cuidar de lo más importante. Únete hoy.
              </p>
            </div>
            {/* Button */}
            <Link to="/doctors"
              className="inline-flex items-center gap-2 bg-vital-500 hover:bg-vital-600 text-white font-semibold px-6 py-3.5 rounded-full transition-colors shadow-vital whitespace-nowrap">
              Reservar mi cita ahora <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
