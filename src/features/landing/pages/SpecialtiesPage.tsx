import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Search, Shield, Clock, CheckCircle2, ArrowRight,
  Users, Heart, Star, Calendar, Stethoscope,
  Brain, Eye, Baby, Activity, Scan, ChevronRight,
} from 'lucide-react';
import { useSpecialties } from '../../../shared/hooks/useDoctors';
import { Skeleton } from '../../../shared/components/atoms/index';
import { cn } from '../../../shared/utils';

const POPULAR_TAGS = ['Cardiología','Dermatología','Pediatría','Neurología','Traumatología'];

const SPECIALTY_ICONS: Record<string, React.ReactNode> = {
  Cardiología: <Heart className="h-6 w-6"/>,
  Dermatología: <Scan className="h-6 w-6"/>,
  Neurología: <Brain className="h-6 w-6"/>,
  Pediatría: <Baby className="h-6 w-6"/>,
  Ginecología: <Heart className="h-6 w-6"/>,
  Oftalmología: <Eye className="h-6 w-6"/>,
  Traumatología: <Activity className="h-6 w-6"/>,
  Oncología: <Shield className="h-6 w-6"/>,
  Endocrinología: <Activity className="h-6 w-6"/>,
  Psiquiatría: <Brain className="h-6 w-6"/>,
  Urología: <Users className="h-6 w-6"/>,
  Gastroenterología: <Activity className="h-6 w-6"/>,
  Neumología: <Activity className="h-6 w-6"/>,
  Reumatología: <Activity className="h-6 w-6"/>,
  Nefrología: <Activity className="h-6 w-6"/>,
  Hematología: <Heart className="h-6 w-6"/>,
  Infectología: <Shield className="h-6 w-6"/>,
  'Medicina General': <Stethoscope className="h-6 w-6"/>,
  Otorrinolaringología: <Users className="h-6 w-6"/>,
  'Cirugía General': <Activity className="h-6 w-6"/>,
};

const SPECIALTY_COLORS: Record<string, string> = {
  Cardiología:'text-red-500 bg-red-50 dark:bg-red-950/30',
  Dermatología:'text-orange-500 bg-orange-50 dark:bg-orange-950/30',
  Neurología:'text-purple-500 bg-purple-50 dark:bg-purple-950/30',
  Pediatría:'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
  Ginecología:'text-pink-500 bg-pink-50 dark:bg-pink-950/30',
  Oftalmología:'text-teal-500 bg-teal-50 dark:bg-teal-950/30',
  Traumatología:'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
  Oncología:'text-slate-500 bg-slate-50 dark:bg-slate-800',
  Endocrinología:'text-green-500 bg-green-50 dark:bg-green-950/30',
  Psiquiatría:'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30',
  Urología:'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30',
  Gastroenterología:'text-lime-600 bg-lime-50 dark:bg-lime-950/30',
  Neumología:'text-sky-500 bg-sky-50 dark:bg-sky-950/30',
  Reumatología:'text-violet-500 bg-violet-50 dark:bg-violet-950/30',
  Nefrología:'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
  Hematología:'text-red-600 bg-red-50 dark:bg-red-950/30',
  Infectología:'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  'Medicina General':'text-primary-600 bg-primary-50 dark:bg-primary-950/30',
  Otorrinolaringología:'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30',
  'Cirugía General':'text-slate-600 bg-slate-100 dark:bg-slate-800',
};

const SPECIALTY_DOCS: Record<string, number> = {
  Cardiología:6,Dermatología:12,Neurología:10,Pediatría:8,Ginecología:4,
  Oftalmología:4,Traumatología:3,Oncología:11,Endocrinología:9,Psiquiatría:10,
  Urología:3,Gastroenterología:12,Neumología:11,Reumatología:5,Nefrología:4,
  Hematología:4,Infectología:6,'Medicina General':8,Otorrinolaringología:7,'Cirugía General':5,
};

const SPECIALTY_DESC: Record<string, string> = {
  Cardiología:'Cuidado del corazón y sistema cardiovascular.',
  Dermatología:'Salud de la piel, cabello y uñas.',
  Neurología:'Diagnóstico y tratamiento de enfermedades del sistema nervioso.',
  Pediatría:'Atención médica especializada para la salud infantil.',
  Ginecología:'Salud femenina: prevención, diagnóstico y tratamiento.',
  Oftalmología:'Cuidado de la salud visual y enfermedades oculares.',
  Traumatología:'Diagnóstico, tratamiento y rehabilitación de lesiones.',
  Oncología:'Diagnóstico y tratamiento del cáncer y enfermedades oncológicas.',
  Endocrinología:'Trastornos hormonales y metabólicos como diabetes, tiroides y más.',
  Psiquiatría:'Salud mental: evaluación, diagnóstico y tratamiento.',
  Urología:'Salud del sistema urinario y reproductor masculino.',
  Gastroenterología:'Enfermedades del sistema digestivo, hígado y páncreas.',
  Neumología:'Enfermedades respiratorias y cuidado pulmonar.',
  Reumatología:'Enfermedades musculoesqueléticas y autoinmunes.',
  Nefrología:'Cuidado de los riñones y enfermedades renales.',
  Hematología:'Estudio y tratamiento de trastornos de la sangre.',
  Infectología:'Enfermedades infecciosas y tratamientos especializados.',
  'Medicina General':'Atención médica integral para toda la familia.',
  Otorrinolaringología:'Salud del oído, nariz y garganta.',
  'Cirugía General':'Procedimientos quirúrgicos para diversas condiciones.',
};

const HERO_BADGES = [
  [<Users className="h-4 w-4 text-vital-500"/>, 'Médicos especialistas'],
  [<Heart className="h-4 w-4 text-vital-500"/>, 'Atención personalizada'],
  [<Calendar className="h-4 w-4 text-vital-500"/>, 'Reservas en minutos'],
  [<Shield className="h-4 w-4 text-vital-500"/>, 'Cuidado confiable'],
];

const fadeUp = { initial:{ opacity:0, y:20 }, whileInView:{ opacity:1, y:0 }, viewport:{ once:true }, transition:{ duration:0.5 } };

export default function SpecialtiesPage() {
  const { data: specialties = [], isLoading } = useSpecialties();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');

  const DISPLAY_SPECIALTIES = Object.keys(SPECIALTY_ICONS);
  const filtered = query
    ? DISPLAY_SPECIALTIES.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : DISPLAY_SPECIALTIES;

  return (
    <>
      <Helmet>
        <title>Especialidades Médicas – Clínica Fast</title>
        <meta name="description" content="Explora más de 20 especialidades médicas y encuentra el especialista que necesitas." />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-mist-50 dark:bg-slate-900 overflow-hidden border-b border-mist-200 dark:border-slate-800">
        <div className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full bg-clinical-100/70 dark:bg-clinical-900/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
              <span className="eyebrow mb-4">+20 especialidades médicas</span>
              <h1 className="font-display text-4xl lg:text-[3.2rem] font-semibold text-ink-900 dark:text-white leading-[1.08] tracking-tight mb-4">
                Encuentra la<br />
                <span className="italic text-clinical-700 dark:text-clinical-300">especialidad ideal</span><br />
                para ti
              </h1>
              <p className="text-ink-500 dark:text-slate-400 mb-5 leading-relaxed max-w-md text-lg">
                Contamos con las mejores especialidades médicas y profesionales certificados para cuidar tu salud.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-0">
                {HERO_BADGES.map(([icon, lbl], i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-ink-700 dark:text-slate-400 font-medium">
                    {icon as React.ReactNode} {lbl as string}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: image + stat cards */}
            <motion.div
  initial={{ opacity: 0, x: 16 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.15 }}
  className="relative hidden lg:flex items-center justify-end"
>
  <div className="relative w-[500px] h-[500px]">

    {/* Imagen */}
    <img
      src="/img/doctora1.png"
      alt="Doctora"
      className="absolute left-0 bottom-0 h-full object-contain"
    />

    {/* Cards laterales */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-6">

      {/* Card 1 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-clinical px-5 py-4 w-[220px] border border-clinical-100/60 dark:border-slate-700">
        <p className="text-xs text-ink-500/70 mb-1">
          Profesionales certificados
        </p>

        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-clinical-700" />
          <div>
            <p className="font-display font-semibold text-xl text-ink-900 dark:text-white">
              +500
            </p>
            <p className="text-xs text-ink-500">
              especialistas
            </p>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-clinical px-5 py-4 w-[220px] border border-clinical-100/60 dark:border-slate-700">
        <p className="text-xs text-ink-500/70 mb-1">
          Pacientes satisfechos
        </p>

        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-2xl text-ink-900 dark:text-white">
            4.9
          </span>

          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="h-4 w-4 fill-vital-500 text-vital-500"
                viewBox="0 0 24 24"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-500/70 mt-1">
          +10,000 reseñas
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-clinical px-5 py-4 w-[220px] border border-clinical-100/60 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="h-5 w-5 text-clinical-700" />
          <span className="text-sm font-semibold text-ink-900 dark:text-slate-200">
            Atención rápida
          </span>
        </div>

        <p className="text-xs text-ink-500/70">
          Reserva en minutos
        </p>
      </div>

    </div>

  </div>
</motion.div>
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-clinical-800 to-clinical-600 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-white font-display font-semibold text-lg tracking-tight mb-4">Encuentra tu especialidad ideal</h2>
          <div className="flex flex-wrap gap-3 items-center bg-white dark:bg-slate-900 rounded-xl p-2 shadow-clinical">
            <div className="flex-1 flex items-center gap-2 px-3 min-w-48 border-r border-mist-200 dark:border-slate-700">
              <Search className="h-4 w-4 text-ink-500/60 shrink-0"/>
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Buscar especialidad, síntoma o tratamiento..."
                className="flex-1 text-sm text-ink-700 dark:text-slate-200 bg-transparent focus:outline-none placeholder-slate-400"/>
            </div>
            <div className="px-3 border-r border-mist-200 dark:border-slate-700">
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                className="text-sm text-ink-700 dark:text-slate-300 bg-transparent focus:outline-none py-1">
                <option value="">Todas las categorías</option>
                <option>Especialidades quirúrgicas</option>
                <option>Medicina interna</option>
                <option>Salud mental</option>
              </select>
            </div>
            <div className="px-3">
              <select value={doctorFilter} onChange={e => setDoctorFilter(e.target.value)}
                className="text-sm text-ink-700 dark:text-slate-300 bg-transparent focus:outline-none py-1">
                <option value="">Todos los médicos</option>
                <option>Disponibles ahora</option>
                <option>Mejor valorados</option>
              </select>
            </div>
            <button className="bg-vital-500 hover:bg-vital-600 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors shadow-vital">
              Buscar
            </button>
          </div>
          {/* Popular tags */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-clinical-200 text-xs font-medium">Popular:</span>
            {POPULAR_TAGS.map(tag => (
              <button key={tag} onClick={() => setQuery(tag)}
                className={cn('px-3 py-1 rounded-full border text-xs transition-colors',
                  query === tag ? 'bg-white text-clinical-800 border-white' : 'border-white/30 text-white/90 hover:bg-white/10')}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALTIES GRID ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-9">
            <motion.div {...fadeUp}>
              <span className="eyebrow mb-2">Especialidades médicas</span>
              <h2 className="font-display text-3xl font-semibold text-ink-900 dark:text-slate-100 tracking-tight">
                Explora nuestras especialidades
              </h2>
              <p className="text-sm text-ink-500 dark:text-slate-400 mt-1">
                Selecciona una especialidad para ver médicos disponibles y reservar tu cita.
              </p>
            </motion.div>
            <div className="flex gap-2 shrink-0">
              <button className="px-4 py-2 rounded-xl border border-clinical-200 dark:border-slate-700 text-sm text-ink-700 dark:text-slate-400 hover:bg-clinical-50 dark:hover:bg-slate-800 transition-colors">
                Ver todas las especialidades
              </button>
              <button className="p-2 rounded-xl border border-clinical-200 dark:border-slate-700 text-ink-500 hover:bg-clinical-50 dark:hover:bg-slate-800 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(20)].map((_,i)=><Skeleton key={i} className="h-40"/>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {filtered.map((sp, i) => (
                <motion.div key={sp}
                  initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ delay: i * 0.04, duration: 0.4 }}>
                  <Link to={`/doctors?specialty=${encodeURIComponent(sp)}`}
                    className="flex flex-col p-5 rounded-2xl border border-mist-200 dark:border-slate-800 hover:shadow-clinical-sm hover:-translate-y-0.5 transition-all bg-white dark:bg-slate-900 group h-full">
                    {/* Icon */}
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110', SPECIALTY_COLORS[sp] || 'bg-clinical-50 text-clinical-700')}>
                      {SPECIALTY_ICONS[sp] || <Stethoscope className="h-5 w-5"/>}
                    </div>
                    {/* Name */}
                    <p className="font-semibold text-ink-900 dark:text-slate-100 text-sm mb-1 leading-tight">{sp}</p>
                    {/* Description */}
                    <p className="text-xs text-ink-500/70 dark:text-slate-500 leading-relaxed mb-3 flex-1">
                      {SPECIALTY_DESC[sp] || 'Especialistas certificados y verificados.'}
                    </p>
                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-ink-500">{SPECIALTY_DOCS[sp] || 4} especialistas</span>
                      <ChevronRight className="h-4 w-4 text-clinical-700 group-hover:translate-x-0.5 transition-transform"/>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="py-14 bg-mist-50 dark:bg-slate-950">
  <div className="max-w-screen-2xl mx-auto px-6">
    <div className="bg-white dark:bg-slate-900 border border-clinical-100 dark:border-slate-800 rounded-3xl px-8 py-8 overflow-hidden shadow-clinical-sm">

      <div className="flex items-center justify-between gap-12">

        {/* Imagen */}
        <div className="hidden lg:flex items-center justify-center relative flex-shrink-0 w-[280px]">

          <div className="absolute w-56 h-56 rounded-full bg-clinical-100 dark:bg-clinical-900/20" />

          <img
            src="/img/manodoctor.png"
            alt="Aplicación móvil"
            className="relative z-10 h-[250px] w-auto object-contain"
          />

        </div>

        {/* Texto */}
        <div className="flex-1 max-w-[480px]">

          <h3 className="font-display text-4xl font-semibold text-clinical-700 dark:text-clinical-300 mb-4 leading-tight tracking-tight">
            Reserva tu cita en minutos
          </h3>

          <p className="text-lg text-ink-500 dark:text-slate-400 leading-relaxed mb-6">
            Encuentra al especialista que necesitas y agenda tu cita
            de forma rápida, fácil y segura.
          </p>

          <Link
            to="/doctors"
            className="btn-clinical"
          >
            Reservar mi cita ahora
          </Link>

        </div>

        {/* Pasos */}
        <div className="hidden lg:flex items-center gap-8 flex-shrink-0">

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-clinical-50 dark:bg-clinical-950/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-clinical-700" />
            </div>

            <span className="font-medium text-ink-700 dark:text-slate-300 max-w-[120px]">
              Elige tu especialidad
            </span>
          </div>

          <div className="w-px h-12 bg-mist-200 dark:bg-slate-700" />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-clinical-50 dark:bg-clinical-950/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-clinical-700" />
            </div>

            <span className="font-medium text-ink-700 dark:text-slate-300 max-w-[140px]">
              Selecciona fecha y hora
            </span>
          </div>

          <div className="w-px h-12 bg-mist-200 dark:bg-slate-700" />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-clinical-50 dark:bg-clinical-950/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-clinical-700" />
            </div>

            <span className="font-medium text-ink-700 dark:text-slate-300 max-w-[120px]">
              Confirma tu reserva
            </span>
          </div>

        </div>

      </div>
    </div>
  </div>
</section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <section className="py-8 bg-white dark:bg-slate-900 border-t border-mist-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:<Clock className="h-5 w-5 text-clinical-700"/>, t:'Atención rápida', d:'Reservas en minutos' },
              { icon:<Users className="h-5 w-5 text-clinical-700"/>, t:'Médicos certificados', d:'Profesionales de confianza' },
              { icon:<Shield className="h-5 w-5 text-clinical-700"/>, t:'Seguridad', d:'Tus datos están protegidos' },
              { icon:<Star className="h-5 w-5 text-vital-500"/>, t:'Calidad garantizada', d:'Excelencia en cada atención' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-clinical-50 dark:bg-clinical-950/30 flex items-center justify-center shrink-0">{item.icon}</div>
                <div>
                  <p className="text-xs font-semibold text-clinical-700 dark:text-clinical-300">{item.t}</p>
                  <p className="text-xs text-ink-500 dark:text-slate-400">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
