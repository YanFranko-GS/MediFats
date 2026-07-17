import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Search, Clock, Shield, Stethoscope, Heart, Calendar,
  CheckCircle2, ArrowRight, ChevronLeft, ChevronRight,
  Users, MapPin, Star, Zap, Lock, HeartHandshake,
  Mail
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSpecialties } from '../../../shared/hooks/useDoctors';
import { cn } from '../../../shared/utils';

// ── Placeholder image box ──────────────────────────────────────────────────
function ImgPlaceholder({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn('relative bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center', className)}>
      <div className="text-center p-4">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-2 flex items-center justify-center">
          <Users className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-xs text-slate-400 font-medium">{label || 'Imagen'}</p>
        <p className="text-xs text-slate-300 mt-0.5">Se adapta al contenido</p>
      </div>
    </div>
  );
}

// ── Pulse trace: signature decorative element (ECG-style thread) ──────────
function PulseTrace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 60" preserveAspectRatio="none" className={cn('w-full h-full', className)} aria-hidden="true">
      <path
        d="M0 30 H150 L172 30 L185 8 L200 52 L215 30 L230 30 H600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEPS = [
  { num: '1', icon: <Users className="h-7 w-7" />, title: 'Elige tu especialista', desc: 'Busca por especialidad, síntoma o nombre del médico que necesitas.' },
  { num: '2', icon: <Calendar className="h-7 w-7" />, title: 'Selecciona fecha y hora', desc: 'Elige el día y la hora que mejor se adapte a tu agenda.' },
  { num: '3', icon: <Shield className="h-7 w-7" />, title: 'Confirma tu cita', desc: 'Completa tu reserva de forma segura y recibe la confirmación al instante.' },
  { num: '4', icon: <Heart className="h-7 w-7" />, title: 'Asiste a tu consulta', desc: 'Acude a tu cita presencial o conéctate a tu consulta virtual y recibe la atención que mereces.' },
];

const WHY_US = [
  { icon: <Shield className="h-6 w-6" />, title: 'Profesionales certificados', desc: 'Médicos altamente capacitados y verificados.' },
  { icon: <Lock className="h-6 w-6" />, title: 'Seguridad total', desc: 'Protegemos tu información con los más altos estándares de seguridad.' },
  { icon: <Clock className="h-6 w-6" />, title: 'Ahorra tiempo', desc: 'Reserva en minutos y evita largas esperas.' },
  { icon: <Heart className="h-6 w-6" />, title: 'Atención de calidad', desc: 'Tu bienestar es nuestra prioridad en cada consulta.' },
];

const STATS = [
  { icon: <Calendar className="h-5 w-5" />, value: '+50,000', label: 'Citas reservadas' },
  { icon: <Users className="h-5 w-5" />, value: '+500', label: 'Especialistas certificados' },
  { icon: <MapPin className="h-5 w-5" />, value: '+50', label: 'Clínicas aliadas' },
  { icon: <Shield className="h-5 w-5" />, value: '98%', label: 'Pacientes satisfechos' },
];

const CLINICS = ['Clínica San Pablo', 'Clínica Ricardo Palma', 'AUNA', 'Clínica Internacional', 'Sanitas'];

const TESTIMONIALS = [
  { name: 'Lucía Ramírez', role: 'Paciente de Dermatología', avatar: 'lucia-ramirez', rating: 5, comment: 'Excelente atención desde que reservé mi cita hasta la consulta. Todo fue rápido y el doctor muy profesional. ¡Totalmente recomendado!', image: 'img/dermatologa.png' },
  { name: 'Carlos Mendoza', role: 'Paciente de Cardiología', avatar: 'carlos-mendoza', rating: 5, comment: 'Excelente plataforma, me ahorra tiempo y me da la confianza saber que los médicos están verificados.', image: 'img/pacienteCardiologo.png' },
  { name: 'María López', role: 'Paciente de Pediatría', avatar: 'maria-lopez', rating: 5, comment: 'Pude reservar la cita para mi hija sin salir de casa. La atención pediátrica fue maravillosa.', image: 'img/mamacardi.png' },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const { data: specialties } = useSpecialties();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/doctors?q=${encodeURIComponent(q)}&specialty=${encodeURIComponent(specialtyFilter)}`);
  };

  const SPECIALTY_ICONS: Record<string, React.ReactNode> = {
    'Medicina General': <Stethoscope className="h-5 w-5" />,
    'Pediatría': <Users className="h-5 w-5" />,
    'Ginecología': <Heart className="h-5 w-5" />,
    'Cardiología': <Heart className="h-5 w-5" />,
    'Dermatología': <Shield className="h-5 w-5" />,
    'Neurología': <Zap className="h-5 w-5" />,
    'Traumatología': <Users className="h-5 w-5" />,
    'Oftalmología': <Search className="h-5 w-5" />,
    'Otorrinolaringología': <HeartHandshake className="h-5 w-5" />,
    'Psicología': <Heart className="h-5 w-5" />,
  };

  const SPECIALTY_SUBS: Record<string, string> = {
    'Medicina General': 'Atención primaria', 'Pediatría': 'Cuidado infantil',
    'Ginecología': 'Salud femenina', 'Cardiología': 'Corazón y vasos',
    'Dermatología': 'Piel y cabello', 'Neurología': 'Sistema nervioso',
    'Traumatología': 'Huesos y músculos', 'Oftalmología': 'Salud visual',
    'Otorrinolaringología': 'Oído, nariz y garganta', 'Psicología': 'Salud mental',
  };

  const SPECIALTY_ACCENTS: Record<string, string> = {
    'Medicina General': 'bg-clinical-600', 'Pediatría': 'bg-sky-500',
    'Ginecología': 'bg-pink-500', 'Cardiología': 'bg-vital-500',
    'Dermatología': 'bg-amber-500', 'Neurología': 'bg-violet-500',
    'Traumatología': 'bg-orange-500', 'Oftalmología': 'bg-teal-500',
    'Otorrinolaringología': 'bg-yellow-500', 'Psicología': 'bg-indigo-500',
  };

  const displaySpecialties = Object.keys(SPECIALTY_ICONS);

  return (
    <>
      <Helmet>
        <title>CLÍNICA FAST – Reserva Inteligente de Citas Médicas</title>
        <meta name="description" content="Reserva tu cita médica de forma rápida, fácil y segura. Médicos especializados, atención de calidad y a un clic de distancia." />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-mist-50 dark:bg-slate-900 overflow-hidden">
        {/* Ambient halo */}
        <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-clinical-100/70 dark:bg-clinical-900/20 blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/3 -left-32 w-[360px] h-[360px] rounded-full bg-vital-50/80 dark:bg-vital-900/10 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-6 py-14 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="eyebrow mb-5">+10,000 pacientes confían en nosotros</span>
              <h1 className="font-display text-[2.75rem] lg:text-[3.6rem] font-semibold text-ink-900 dark:text-white leading-[1.05] tracking-tight mb-5">
                {t('landing.heroTitle1')}<br />
                {t('landing.heroTitle2')}<span className="italic text-clinical-700 dark:text-clinical-300">{t('landing.heroTitle3')}</span><br />
                {t('landing.heroTitle4')}
              </h1>
              <p className="text-ink-500 dark:text-slate-400 text-lg leading-relaxed mb-7 max-w-md">
                {t('landing.heroSubtitle')}
              </p>
              {/* Badges */}
              <div className="flex flex-wrap gap-x-5 gap-y-2.5 mb-9 text-sm text-ink-700 dark:text-slate-400">
                {[
                  [<Calendar className="h-4 w-4 text-vital-500" />, 'Citas rápidas en minutos'],
                  [<Users className="h-4 w-4 text-vital-500" />, 'Médicos verificados'],
                  [<Heart className="h-4 w-4 text-vital-500" />, 'Atención personalizada'],
                  [<Shield className="h-4 w-4 text-vital-500" />, 'Seguridad y confidencialidad'],
                ].map(([icon, txt], i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs font-medium">
                    {icon as React.ReactNode} {txt as string}
                  </span>
                ))}
              </div>
              {/* Buttons */}
              <div className="flex flex-wrap gap-3 mb-9">
                <Link to="/doctors" className="btn-clinical">
                  {t('landing.bookNow')} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/specialties" className="btn-clinical-outline">
                  {t('landing.viewSpecialties')}
                </Link>
              </div>
              {/* Clinic logos */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-ink-500/70 dark:text-slate-500">Más de 50 clínicas y centros médicos aliados</span>
                <div className="flex gap-2 flex-wrap">
                  {['Clínica\nSan Pablo', 'Medicenter', 'SaludTotal'].map(c => (
                    <span key={c} className="px-2.5 py-1 rounded-lg border border-clinical-200/70 dark:border-slate-700 text-xs text-ink-500 dark:text-slate-400 font-medium">{c.replace('\n', ' ')}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right – hero image + floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Imagen */}
              <img
                src="/img/doctora1.png"
                alt="Doctora"
                className="w-full h-[520px] object-contain"
              />

              {/* Card 1 */}
              <div className="absolute top-10 right-0 bg-white dark:bg-slate-800 rounded-2xl shadow-clinical px-5 py-4 w-[220px] border border-clinical-100/60 dark:border-slate-700">
                <p className="text-[11px] text-ink-500/70 mb-2">
                  Profesionales certificados
                </p>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-clinical-50 dark:bg-clinical-900/20">
                    <Shield className="h-5 w-5 text-clinical-700" />
                  </div>

                  <div>
                    <p className="text-2xl font-display font-semibold text-ink-900 dark:text-slate-100 leading-none">
                      +500
                    </p>
                    <p className="text-xs text-ink-500">
                      especialistas
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-clinical px-5 py-4 w-[220px] border border-clinical-100/60 dark:border-slate-700">
                <p className="text-[11px] text-ink-500/70 mb-2">
                  Pacientes satisfechos
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-display font-semibold text-ink-900 dark:text-white">
                    4.9
                  </span>

                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-vital-500 text-vital-500"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-ink-500 mt-1">
                  +10,000 reseñas
                </p>
              </div>

              {/* Card 3 */}
              <div className="absolute bottom-10 right-0 bg-white dark:bg-slate-800 rounded-2xl shadow-clinical px-5 py-4 w-[220px] border border-clinical-100/60 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-clinical-50 dark:bg-clinical-900/20">
                    <Clock className="h-5 w-5 text-clinical-700" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-slate-100">
                      Atención rápida
                    </p>

                    <p className="text-xs text-ink-500">
                      Reserva en minutos
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Pulse trace divider */}
        <div className="relative h-8 text-clinical-200 dark:text-slate-800">
          <PulseTrace />
        </div>
      </section>

      {/* ── SEARCH BAR ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-clinical-800 to-clinical-600 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-white font-display font-semibold text-2xl lg:text-3xl mb-6 tracking-tight">
            {t('landing.searchDoctor')}
          </h2>

          <form
            onSubmit={handleSearch}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-clinical p-4 flex flex-col lg:flex-row items-center gap-4"
          >
            {/* Especialidad */}
            <div className="flex flex-col flex-1 w-full lg:w-auto min-w-[220px] px-4 py-2 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
              <label className="text-xs font-semibold text-ink-500 uppercase mb-1">
                Especialidad
              </label>

              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="text-sm text-ink-700 bg-transparent focus:outline-none"
              >
                <option value="">Seleccione una especialidad</option>
                {displaySpecialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Ubicación */}
            <div className="flex flex-col flex-1 w-full lg:w-auto min-w-[220px] px-4 py-2 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
              <label className="text-xs font-semibold text-ink-500 uppercase mb-1">
                Ubicación
              </label>

              <input
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Ingresa tu ubicación"
                className="text-sm text-ink-700 bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Fecha */}
            <div className="flex flex-col flex-1 w-full lg:w-auto min-w-[180px] px-4 py-2">
              <label className="text-xs font-semibold text-ink-500 uppercase mb-1">
                Fecha
              </label>

              <input
                type="date"
                className="text-sm text-ink-700 bg-transparent focus:outline-none"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="px-10 py-4 rounded-xl bg-vital-500 hover:bg-vital-600 text-white font-semibold transition whitespace-nowrap shadow-vital"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* ── SPECIALTIES GRID ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="mb-10">
            <span className="eyebrow mb-3">Especialidades</span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight">
              Encuentra la especialidad<br />que necesitas
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {displaySpecialties.map((sp, i) => (
              <motion.div key={sp} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={`/doctors?specialty=${sp}`}
                  className="relative flex flex-col items-center text-center p-5 pt-6 rounded-2xl border border-mist-200 dark:border-slate-800 hover:shadow-clinical-sm hover:-translate-y-0.5 transition-all bg-white dark:bg-slate-900 group overflow-hidden">
                  <span className={cn('absolute top-0 left-0 right-0 h-1', SPECIALTY_ACCENTS[sp] || 'bg-clinical-600')} />
                  <div className="w-12 h-12 rounded-2xl bg-mist-100 dark:bg-clinical-950/30 text-clinical-700 flex items-center justify-center mb-3 group-hover:bg-clinical-100 transition-colors">
                    {SPECIALTY_ICONS[sp] || <Stethoscope className="h-5 w-5" />}
                  </div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-slate-100 leading-tight">{sp}</p>
                  <p className="text-xs text-ink-500/70 mt-0.5">{SPECIALTY_SUBS[sp] || ''}</p>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/specialties" className="inline-flex items-center gap-2 text-clinical-700 dark:text-clinical-300 font-semibold text-sm hover:underline">
              Ver todas las especialidades <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-mist-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="eyebrow mb-3">¿Por qué elegirnos?</span>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight mb-5">
                Cuidamos de ti en<br />cada paso
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  { icon: <Calendar className="h-5 w-5 text-clinical-700" />, t: 'Reserva fácil y rápida', d: 'Agenda tu cita en minutos, 24/7 desde cualquier lugar.' },
                  { icon: <Users className="h-5 w-5 text-clinical-700" />, t: 'Médicos especializados', d: 'Profesionales verificados con amplia experiencia.' },
                  { icon: <Heart className="h-5 w-5 text-clinical-700" />, t: 'Atención de calidad', d: 'Nos enfocamos en tu bienestar y satisfacción.' },
                  { icon: <Bell className="h-5 w-5 text-clinical-700" />, t: 'Recordatorios automáticos', d: 'Te recordamos tu cita para que nunca la olvides.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-clinical-50 dark:bg-clinical-950/30 flex items-center justify-center shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900 dark:text-slate-100">{item.t}</p>
                      <p className="text-xs text-ink-500 dark:text-slate-400">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-clinical-outline text-sm px-5 py-2.5">
                Conoce más sobre nosotros
              </Link>
            </motion.div>

            {/* Right image + badge */}
            <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }} className="relative">
              <img
                src="img/familia.png"
                alt="Familia"
                className="w-full h-80 lg:h-96 rounded-3xl object-cover shadow-clinical"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 right-6 bg-clinical-800 text-white rounded-2xl px-4 py-3 shadow-xl max-w-[170px]">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-vital-400" />
                  <p className="text-xs font-bold">Tu salud es nuestra prioridad</p>
                </div>
                <p className="text-xs text-clinical-200">Atención humana, cercana y segura para ti y tu familia.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ──────────────────────────────────────────────────── */}
      <section className="bg-clinical-900 py-12">
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

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp}>
              <span className="eyebrow mb-3">Cómo funciona</span>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight mb-9">
                Reservar tu cita es<br />así de fácil
              </h2>
              <div className="space-y-0">
                {[
                  { n: '1', t: 'Elige tu especialidad', d: 'Selecciona la especialidad que necesitas.' },
                  { n: '2', t: 'Elige fecha y hora', d: 'Selecciona el día y la hora que mejor te convenga.' },
                  { n: '3', t: 'Confirma tu cita', d: 'Recibe la confirmación y asiste a tu cita.' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 relative pb-8 last:pb-0">
                    {i < 2 && <span className="absolute left-4 top-8 bottom-0 w-px bg-clinical-200 dark:bg-slate-700" aria-hidden="true" />}
                    <div className="w-8 h-8 rounded-full bg-clinical-700 text-white flex items-center justify-center text-sm font-bold shrink-0 z-10">{step.n}</div>
                    <div>
                      <p className="font-semibold text-ink-900 dark:text-slate-100 text-sm">{step.t}</p>
                      <p className="text-xs text-ink-500 dark:text-slate-400">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/doctors" className="btn-clinical mt-4 text-sm px-6 py-3">
                Reservar mi cita ahora
              </Link>
            </motion.div>

            {/* Phone mockup placeholder */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex justify-center">
              <img
                src="img/celular.png"
                alt="Mockup App"
                className="w-full h-[460px] rounded-[2rem] object-cover shadow-clinical"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-mist-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="eyebrow justify-center mb-3">Testimonios</span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight">
              Lo que dicen nuestros pacientes
            </h2>
          </motion.div>
          <div className="relative">
            {/* Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-mist-200 dark:border-slate-800 px-8 py-10 shadow-clinical">
              <div className="grid md:grid-cols-[280px_1fr] gap-10 items-center">
                {/* Paciente */}
                <div className="flex items-center gap-4">
                  {TESTIMONIALS[testimonialIdx].image ? (
                    <img
                      src={TESTIMONIALS[testimonialIdx].image}
                      alt={TESTIMONIALS[testimonialIdx].name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-clinical-100 flex items-center justify-center text-clinical-700 font-bold text-xl">
                      {TESTIMONIALS[testimonialIdx].name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-ink-900 dark:text-white">
                      {TESTIMONIALS[testimonialIdx].name}
                    </h3>
                    <p className="text-sm text-ink-500">
                      {TESTIMONIALS[testimonialIdx].role}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {[...Array(TESTIMONIALS[testimonialIdx].rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-vital-500 text-vital-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Comentario */}
                <div>
                  <p className="font-display text-xl text-ink-700 dark:text-slate-300 leading-8 italic">
                    "{TESTIMONIALS[testimonialIdx].comment}"
                  </p>
                </div>
              </div>
            </div>
            {/* Navegación */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() =>
                  setTestimonialIdx(
                    (i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                  )
                }
                className="w-10 h-10 rounded-full border border-clinical-200 dark:border-slate-700 flex items-center justify-center hover:bg-clinical-50 dark:hover:bg-slate-800 transition"
              >
                <ChevronLeft className="w-4 h-4 text-ink-500" />
              </button>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    testimonialIdx === i
                      ? "bg-vital-500"
                      : "bg-slate-300 dark:bg-slate-700"
                  )}
                />
              ))}
              <button
                onClick={() =>
                  setTestimonialIdx(
                    (i) => (i + 1) % TESTIMONIALS.length
                  )
                }
                className="w-10 h-10 rounded-full border border-clinical-200 dark:border-slate-700 flex items-center justify-center hover:bg-clinical-50 dark:hover:bg-slate-800 transition"
              >
                <ChevronRight className="w-4 h-4 text-ink-500" />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* ── NEWSLETTER ────────────────────────────────────────────────────── */}
      <section className="py-14 bg-gradient-to-r from-clinical-900 to-clinical-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Mail className="h-7 w-7 text-vital-400" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-white font-display font-semibold text-lg tracking-tight">Mantente saludable, recibe nuestros consejos</h3>
              <p className="text-clinical-200 text-sm mt-1">Suscríbete y recibe tips de salud, novedades y promociones exclusivas.</p>
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              <input placeholder="Ingresa tu correo electrónico" className="flex-1 lg:w-64 px-4 py-2.5 rounded-xl text-sm text-ink-700 bg-white focus:outline-none" />
              <button className="bg-vital-500 hover:bg-vital-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLINICS ───────────────────────────────────────────────────────── */}

    </>
  );
}

// Need Bell import
function Bell(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
