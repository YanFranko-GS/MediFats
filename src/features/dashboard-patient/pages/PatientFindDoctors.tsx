import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, CheckCircle2, Heart } from 'lucide-react';
import { useDoctors, useSpecialties } from '../../../shared/hooks/useDoctors';
import { usePatientStore } from '../../../shared/stores/patientStore';
import { SkeletonCard, AvatarImg } from '../../../shared/components/atoms/index';
import { EmptySearch, ErrorState, PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { cn, formatCurrency } from '../../../shared/utils';
import type { DoctorFilters } from '../../../shared/types';

export default function PatientFindDoctors() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = usePatientStore();
  const [localQ, setLocalQ] = useState('');
  const [filters, setFilters] = useState<DoctorFilters>({ sortBy: 'rating', sortOrder: 'desc' });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { data: specialties } = useSpecialties();
  const { data: result, isLoading, isError, refetch } = useDoctors(filters, page);
  const doctors = (result as any)?.data?.data ?? (result as any)?.data ?? [];
  const total = (result as any)?.data?.pagination?.total ?? doctors.length;
  const totalPages = (result as any)?.data?.pagination?.totalPages ?? 1;

  const apply = () => { setFilters(f => ({ ...f, query: localQ })); setPage(1); };

  const toggleFav = (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    isFavorite(docId) ? removeFavorite(docId) : addFavorite(docId);
  };

  return (
    <>
      <Helmet><title>Buscar Médicos – Clínica Fast</title></Helmet>
      <PageHeader title="Buscar Médicos" subtitle="Encuentra tu especialista ideal"
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Buscar Médicos' }]} />

      {/* Search + filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl px-4 py-2.5 min-w-0">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input value={localQ} onChange={e => setLocalQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && apply()}
              placeholder="Buscar por nombre, especialidad o síntoma..."
              className="flex-1 min-w-0 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none" />
            {localQ && <button onClick={() => { setLocalQ(''); setFilters(f => ({ ...f, query: '' })); }}><X className="h-3.5 w-3.5 text-slate-400" /></button>}
          </div>
          <div className="flex gap-2">
            <button onClick={apply} className="btn-primary px-5 py-2.5 text-sm flex-1 sm:flex-none">Buscar</button>
            <button onClick={() => setShowFilters(!showFilters)}
              className={cn('flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors shrink-0',
                showFilters ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-950/30 dark:border-primary-800 dark:text-primary-400'
                  : 'bg-white dark:bg-slate-900 border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>
              <SlidersHorizontal className="h-4 w-4" /> Filtros
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-surface-100 dark:border-slate-800">
            <select value={filters.specialty || ''} onChange={e => { setFilters(f => ({ ...f, specialty: e.target.value })); setPage(1); }} className="input-base text-xs py-2 col-span-2">
              <option value="">{t('patientDashboard.specialty')}</option>
              {(specialties || []).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <select value={filters.minRating || ''} onChange={e => { setFilters(f => ({ ...f, minRating: e.target.value ? Number(e.target.value) : undefined })); setPage(1); }} className="input-base text-xs py-2">
              <option value="">Rating mín.</option>
              {[4.5, 4.0, 3.5].map(r => <option key={r} value={r}>★ {r}+</option>)}
            </select>
            <select value={filters.maxPrice || ''} onChange={e => { setFilters(f => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : undefined })); setPage(1); }} className="input-base text-xs py-2">
              <option value="">Precio máx.</option>
              {[100, 150, 200, 300].map(p => <option key={p} value={p}>≤ ${p}</option>)}
            </select>
            <select value={filters.mode || ''} onChange={e => { setFilters(f => ({ ...f, mode: e.target.value as any || undefined })); setPage(1); }} className="input-base text-xs py-2">
              <option value="">Modalidad</option>
              <option value="in-person">Presencial</option>
              <option value="video">Video</option>
              <option value="chat">Chat</option>
            </select>
            <select value={filters.sortBy || 'rating'} onChange={e => { setFilters(f => ({ ...f, sortBy: e.target.value as any })); setPage(1); }} className="input-base text-xs py-2">
              <option value="rating">Mejor rating</option>
              <option value="price">Menor precio</option>
              <option value="experience">Más experiencia</option>
            </select>
          </div>
        )}
      </div>

      {isError ? <ErrorState onRetry={refetch} /> : isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : doctors.length === 0 ? <EmptySearch /> : (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{total} médicos encontrados</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {doctors.map((doc: any, i: number) => (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/doctor/${doc.id}`} className="card card-hover block p-5 group relative">
                  <button onClick={e => toggleFav(e, doc.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors z-10">
                    <Heart className={cn('h-4 w-4 transition-colors', isFavorite(doc.id) ? 'fill-red-500 text-red-500' : 'text-slate-300')} />
                  </button>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <AvatarImg src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-xl bg-primary-50 object-cover" />
                      {doc.isVerified && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center"><CheckCircle2 className="h-2.5 w-2.5 text-white" /></div>}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate group-hover:text-primary-600 transition-colors">{doc.name}</p>
                      <p className="text-xs text-primary-600 dark:text-primary-400">{doc.specialty}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{doc.experience} años exp.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(j => <span key={j} className={j <= Math.round(doc.rating) ? 'text-amber-400 text-xs' : 'text-slate-200 dark:text-slate-700 text-xs'}>★</span>)}
                    <span className="text-xs text-slate-400 ml-1">{doc.rating} ({doc.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs text-slate-400">desde</p><p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{formatCurrency(doc.price)}</p></div>
                    <span className={cn('text-xs font-medium px-2 py-1 rounded-full', doc.isAvailable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800')}>
                      {doc.isAvailable ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"/>Disponible</span> : <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"/>Ocupado</span>}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={page === 1}
                className="px-3 py-2 rounded-xl border border-surface-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors">
                Anterior
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={cn('w-9 h-9 rounded-xl text-sm font-medium transition-colors',
                    page === i + 1 ? 'bg-primary-600 text-white' : 'border border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-slate-800')}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={page === totalPages}
                className="px-3 py-2 rounded-xl border border-surface-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors">
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
