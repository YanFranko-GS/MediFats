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
        <title>Sobre Nosotros – CLÍNICA FAST</title>
        <meta name="description" content="Conoce la misión, historia y equipo de CLÍNICA FAST, la plataforma de reservas médicas líder en Perú." />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 border-b border-surface-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-1.5 text-primary-600 text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-3 h-0.5 bg-primary-600" /> SOBRE MEDICONNECT
              </span>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 dark:text-white leading-tight mb-4">
                Coniectamos personas<br />
                con la mejor <span className="text-primary-600">atención<br />médica</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 max-w-md">
                En CLÍNICA FAST creemos que la salud de calidad debe ser accesible, rápida y confiable para todos.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  [<Heart className="h-4 w-4 text-primary-600" />, 'Atención de calidad'],
                  [<Shield className="h-4 w-4 text-primary-600" />, 'Tecnología que cuida de ti'],
                  [<Users className="h-4 w-4 text-primary-600" />, 'Especialistas certificados'],
                  [<CheckCircle2 className="h-4 w-4 text-primary-600" />, 'Comprometidos contigo'],
                ].map(([icon, lbl], i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
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
  className="w-full h-75 object-cover rounded-3xl"
/>
              {/* Mission badge */}
              <div className="absolute bottom-6 right-6 bg-primary-600 text-white rounded-2xl px-4 py-3 shadow-xl max-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4" />
                  <p className="text-xs font-bold">Tu salud es nuestra misión</p>
                </div>
                <p className="text-xs text-primary-200">Miles de familias confían en nosotros cada día para cuidar lo más importante.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ──────────────────────────────────────────────────── */}
      <section className="bg-primary-600 py-10">
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

      {/* ── HISTORY / MISSION ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp}>
              <span className="text-primary-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <span className="w-3 h-0.5 bg-primary-600" /> NUESTRA HISTORIA
              </span>
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-slate-800 dark:text-slate-100 mb-4">
                Nacimos para <span className="text-primary-600">transformar</span><br />la experiencia en salud
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3 text-sm">
                CLÍNICA FAST nació en el 2022 con una misión clara: eliminar las barreras entre las personas y la atención médica de calidad.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3 text-sm">
                Sabemos que tu tiempo es valioso y tu salud es lo más importante. Por eso creamos una plataforma intuitiva, segura y confiable que te permite encontrar especialistas, reservar citas y recibir atención de forma rápida y sin complicaciones.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-sm">
                Hoy, seguimos innovando cada día para conectar a más personas con los mejores profesionales de la salud.
              </p>
              <button className="inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-5 py-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-slate-800 transition-colors text-sm">
                Conoce más sobre nuestra historia
              </button>
            </motion.div>

            {/* Right: image + "Nuestro propósito" badge */}
            <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }} className="relative">
              <img
  src="/img/doctor.png"
  alt="Médico realizando una consulta con una tablet"
  className="w-full h-80 object-cover rounded-3xl"
/>
              {/* Purpose badge */}
              <div className="absolute bottom-6 right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-4 py-3 max-w-[180px] border border-surface-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950/40 flex items-center justify-center">
                    <Heart className="h-3.5 w-3.5 text-primary-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Nuestro propósito</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mejorar la calidad de vida de las personas conectándolos con especialistas de confianza.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY DIFFERENT ─────────────────────────────────────────────────── */}
      <section className="py-14 bg-surface-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="text-primary-600 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <span className="w-3 h-0.5 bg-primary-600" /> POR QUÉ ELEGIRNOS
            </span>
            <h2 className="text-2xl lg:text-3xl font-heading font-bold text-slate-800 dark:text-slate-100">
              Lo que nos hace diferentes
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_DIFFERENT.map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-surface-200 dark:border-slate-800 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="text-primary-600 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <span className="w-3 h-0.5 bg-primary-600" /> NUESTRO EQUIPO
            </span>
            <h2 className="text-2xl lg:text-3xl font-heading font-bold text-slate-800 dark:text-slate-100">
              Personas que trabajan por tu salud
            </h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex flex-col items-center w-36">
                {/* Team member image placeholder – round */}
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 border-2 border-surface-200 dark:border-slate-700 overflow-hidden">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="text-[9px] text-slate-300 mt-0.5">Foto</p>
                  </div>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-xs text-center leading-tight">{member.name}</p>
                <p className="text-xs text-slate-500 text-center mt-0.5 leading-tight">{member.role}</p>
                <button className="mt-2 w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center hover:bg-primary-100 transition-colors">
                  <svg className="h-3.5 w-3.5 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-14 bg-surface-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="text-primary-600 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <span className="w-3 h-0.5 bg-primary-600" /> LO QUE DICEN NUESTROS PACIENTES
            </span>
            <h2 className="text-2xl font-heading font-bold text-slate-800 dark:text-slate-100">
              Historias reales, resultados reales
            </h2>
          </motion.div>

          {/* Testimonials grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-surface-200 dark:border-slate-800">
                <div className="text-primary-600 text-4xl font-serif leading-none mb-3">"</div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">{t.text}</p>
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-950/40 flex items-center justify-center shrink-0">
                    <span className="text-primary-600 font-bold text-sm">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2, 3, 4].map(i => (
              <button key={i}
                className={cn('w-2 h-2 rounded-full transition-colors', i === 0 ? 'bg-primary-600' : 'bg-surface-300 dark:bg-slate-700')} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="py-12 bg-primary-600">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-white font-heading font-bold text-xl">Tu salud es nuestra prioridad</h3>
              <p className="text-primary-100 text-sm mt-1">
                Miles de personas ya confían en nosotros para cuidar de lo más importante. Únete hoy.
              </p>
            </div>
            {/* Button */}
            <Link to="/doctors"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg whitespace-nowrap">
              Reservar mi cita ahora <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
