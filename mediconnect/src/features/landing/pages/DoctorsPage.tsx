import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Search, Heart, MapPin, Star, Shield, CheckCircle2,
  Users, Clock, Calendar, Video, MessageSquare, ChevronLeft, ChevronRight,
  SlidersHorizontal, X,
} from 'lucide-react';
import { useDoctors, useSpecialties } from '../../../shared/hooks/useDoctors';
import { SkeletonCard } from '../../../shared/components/atoms/index';
import { ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { cn, formatCurrency } from '../../../shared/utils';
import type { DoctorFilters } from '../../../shared/types';

function ImgPlaceholder({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn('bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex items-center justify-center shrink-0', className)}>
      <Users className="h-5 w-5 text-slate-300" />
    </div>
  );
}

const POPULAR_TAGS = ['Cardiología', 'Dermatología', 'Pediatría', 'Neurología', 'Traumatología'];
const HERO_STATS = [
  { icon: <Shield className="h-5 w-5 text-primary-600" />, value: '100%', label: 'Perfiles verificados', sub: 'Médicos verificados' },
  { icon: <Star className="h-5 w-5 text-amber-500" />, value: '4.9', label: 'Pacientes satisfechos', sub: '+10,000 reseñas' },
  { icon: <Clock className="h-5 w-5 text-primary-600" />, value: '', label: 'Atención rápida', sub: 'Reservas en minutos' },
];
const TRUST_ITEMS = [
  { icon: <Shield className="h-5 w-5 text-primary-600" />, t: 'Perfiles verificados', d: 'Todos nuestros médicos pasan por un riguroso proceso.' },
  { icon: <Calendar className="h-5 w-5 text-primary-600" />, t: 'Información detallada', d: 'Conoce su experiencia, estudios y opiniones de pacientes.' },
  { icon: <Users className="h-5 w-5 text-primary-600" />, t: 'Reservas seguras', d: 'Tu información está protegida en todo momento.' },
  { icon: <Heart className="h-5 w-5 text-primary-600" />, t: 'Atención de calidad', d: 'Médicos comprometidos con tu bienestar.' },
];

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<DoctorFilters>({
    query: searchParams.get('q') || '',
    specialty: searchParams.get('specialty') || '',
    sortBy: 'rating', sortOrder: 'desc',
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const { data: specialties } = useSpecialties();
  const { data: result, isLoading, isError, refetch } = useDoctors(filters, page);

  const doctors = (result as any)?.data?.data ?? (result as any)?.data ?? [];
  const pagination = (result as any)?.data?.pagination ?? null;
  const totalPages = pagination?.totalPages ?? 1;

  useEffect(() => { setPage(1); }, [filters]);

  const applyQuery = () => {
    setFilters(f => ({ ...f, query: localQuery }));
    setSearchParams(localQuery ? { q: localQuery } : {});
  };

  const toggleFav = (id: string) => setFavorites(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <>
      <Helmet>
        <title>Médicos Especialistas – CLÍNICA FAST</title>
        <meta name="description" content="Encuentra y reserva cita con más de 100 médicos especialistas certificados." />
      </Helmet>

      {/* HERO */}
      <section className="bg-white dark:bg-slate-900 border-b border-surface-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-1.5 text-primary-600 text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-3 h-0.5 bg-primary-600" /> +100 médicos certificados
              </span>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 dark:text-white leading-tight mb-3">
                Encuentra al<br />
                <span className="text-primary-600">especialista ideal</span><br />
                para ti
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-4 leading-relaxed max-w-sm">
                Conecta con los mejores especialistas del país y reserva tu cita de forma rápida, fácil y segura.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  [<Users className="h-4 w-4 text-primary-600" />, 'Especialistas certificados'],
                  [<Heart className="h-4 w-4 text-primary-600" />, 'Atención de calidad'],
                  [<Calendar className="h-4 w-4 text-primary-600" />, 'Reserva en minutos'],
                  [<Shield className="h-4 w-4 text-primary-600" />, 'Seguridad y confianza'],
                ].map(([icon, lbl], i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {icon as React.ReactNode} {lbl as string}
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Hero image + stat cards */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="relative hidden lg:flex items-center justify-end"
            >
              <div className="relative w-[520px] h-[520px]">

                {/* Imagen doctora */}
                <img
                  src="/img/doctora1.png"
                  alt="Doctora"
                  className="absolute left-0 bottom-0 h-full w-auto object-contain"
                />

                {/* Cards */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-6">

                  {/* Card 1 */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-5 py-4 w-[220px]">
                    <p className="text-[11px] text-slate-400 mb-2">
                      Profesionales certificados
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                        <Shield className="h-5 w-5 text-primary-600" />
                      </div>

                      <div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white leading-none">
                          100%
                        </p>
                        <p className="text-xs text-slate-500">
                          perfiles verificados
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-5 py-4 w-[220px]">
                    <p className="text-[11px] text-slate-400 mb-2">
                      Pacientes satisfechos
                    </p>

                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-slate-800 dark:text-white">
                        4.9
                      </span>

                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">
                      +10,000 reseñas
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-5 py-4 w-[220px]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                        <Clock className="h-5 w-5 text-primary-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                          Atención rápida
                        </p>
                        <p className="text-xs text-slate-500">
                          Reserva en minutos
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="bg-primary-700 py-8 sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 items-center bg-white dark:bg-slate-900 rounded-xl p-2 shadow-lg">
            <div className="flex-1 flex items-center gap-2 px-3 min-w-48">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input value={localQuery} onChange={e => setLocalQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyQuery()}
                placeholder="Buscar médico, especialidad o síntoma..."
                className="flex-1 text-sm text-slate-700 dark:text-slate-200 bg-transparent focus:outline-none placeholder-slate-400" />
              {localQuery && <button onClick={() => { setLocalQuery(''); setFilters(f => ({ ...f, query: '' })); }}><X className="h-4 w-4 text-slate-400" /></button>}
            </div>
            <div className="h-8 w-px bg-surface-200 dark:bg-slate-700 hidden sm:block" />
            <select value={filters.specialty} onChange={e => setFilters(f => ({ ...f, specialty: e.target.value }))}
              className="text-sm text-slate-600 dark:text-slate-300 bg-transparent focus:outline-none px-2 py-1">
              <option value="">Todas las especialidades</option>
              {(specialties as unknown as any[] || []).map((s: any) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <div className="h-8 w-px bg-surface-200 dark:bg-slate-700 hidden sm:block" />
            <select className="text-sm text-slate-600 dark:text-slate-300 bg-transparent focus:outline-none px-2 py-1">
              <option>Todas las ubicaciones</option>
              <option>Lima</option><option>Arequipa</option><option>Trujillo</option>
            </select>
            <button onClick={applyQuery}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
              Buscar
            </button>
          </div>
          {/* Popular tags */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-primary-200 text-xs font-medium">Búsquedas populares:</span>
            {POPULAR_TAGS.map(tag => (
              <button key={tag} onClick={() => setFilters(f => ({ ...f, specialty: tag }))}
                className="px-3 py-1 rounded-full border border-primary-400/50 text-primary-100 text-xs hover:bg-primary-600/50 transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS LIST */}
      <section className="py-10 bg-surface-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-primary-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <span className="w-3 h-0.5 bg-primary-600" /> MÉDICOS DISPONIBLES
              </span>
              <h2 className="text-xl font-heading font-bold text-slate-800 dark:text-slate-100">
                Más de 100 especialistas listos para atenderte
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">Selecciona un médico para ver su perfil completo y disponibilidad.</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors">
                <MapPin className="h-4 w-4" /> Ver en mapa
              </button>
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors">
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </button>
            </div>
          </div>

          {isError && <ErrorState message="Error al cargar médicos" onRetry={refetch} />}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />) :
              (doctors as unknown as any[]).map((doc: any) => (
                <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 p-4 hover:shadow-md transition-all">
                  {/* Availability + fav */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                      doc.isAvailable ? 'bg-green-50 text-green-600 dark:bg-green-950/30' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30')}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', doc.isAvailable ? 'bg-green-500' : 'bg-amber-500')} />
                      {doc.isAvailable ? 'Disponible' : 'Ocupado'}
                    </span>
                    <button onClick={() => toggleFav(doc.id)} className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors">
                      <Heart className={cn('h-4 w-4 transition-colors', favorites.has(doc.id) ? 'fill-red-500 text-red-500' : 'text-slate-300')} />
                    </button>
                  </div>
                  {/* Doctor info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative shrink-0">
                      <img src={doc.avatar} alt={doc.name}
                        className="w-14 h-14 rounded-xl object-cover bg-primary-50"
                        onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/personas/svg?seed=${doc.id}`; }} />
                      {doc.isVerified !== false && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight">{doc.name}</p>
                      <p className="text-primary-600 text-xs font-medium mt-0.5">{doc.specialty}</p>
                      <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />{doc.clinic || 'Clínica asociada'}
                      </p>
                    </div>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={cn('h-3 w-3', i < Math.round(doc.rating) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-200 dark:text-slate-700')} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    ))}
                    <span className="text-xs text-slate-500">({doc.reviewCount || doc.reviews || 0})</span>
                  </div>
                  {/* Modalities */}
                  <div className="flex gap-1.5 mb-4 flex-wrap">
                    {['In-Person', 'Video', 'Chat'].map(m => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full border border-surface-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">{m}</span>
                    ))}
                  </div>
                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Desde</p>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-base">S/ {doc.price}</p>
                    </div>
                    <Link to={`/doctor/${doc.id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                      Ver perfil
                    </Link>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-surface-200 dark:border-slate-700 flex items-center justify-center disabled:opacity-40 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(Math.min(totalPages, 10))].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={cn('w-9 h-9 rounded-xl text-sm font-medium transition-colors',
                    page === i + 1 ? 'bg-primary-600 text-white' : 'border border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800')}>
                  {i + 1}
                </button>
              ))}
              {totalPages > 10 && <span className="text-slate-400">...</span>}
              {totalPages > 10 && (
                <button onClick={() => setPage(totalPages)}
                  className="w-9 h-9 rounded-xl border border-surface-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors">
                  {totalPages}
                </button>
              )}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border border-surface-200 dark:border-slate-700 flex items-center justify-center disabled:opacity-40 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Trust bar */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-surface-200 dark:border-slate-800">
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center shrink-0">{item.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.t}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
