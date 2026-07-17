import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, Ban, Star, TrendingUp, Clock, X, Edit2, Stethoscope } from 'lucide-react';
import { useAdminDoctors } from '../hooks/useAdminMaster';
import { useAdminMasterStore } from '../store/adminMasterStore';
import { PageHeader, KpiCard, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Badge, Skeleton, Avatar } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { cn, formatDate, formatCurrency } from '../../../shared/utils';
import { toast } from 'sonner';

const STATUS_MAP: Record<string, { label: string; variant: any; dot?: boolean }> = {
  pending:   { label: 'Pendiente', variant: 'warning', dot: true },
  approved:  { label: 'Aprobado',  variant: 'success', dot: true },
  suspended: { label: 'Suspendido',variant: 'error',   dot: true },
  blocked:   { label: 'Bloqueado', variant: 'error' },
};

function DoctorDetailModal({ doctor, onClose }: { doctor: any; onClose: () => void }) {
  const { approveDoctor, rejectDoctor, suspendDoctor, reactivateDoctor } = useAdminMasterStore();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Expediente del Médico</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 text-slate-400"><X className="h-4 w-4"/></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-4">
            <Avatar src={doctor.avatar} name={doctor.name} size="lg" />
            <div className="flex-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{doctor.name}</p>
              <p className="text-sm text-slate-500">{doctor.email}</p>
              <p className="text-sm text-primary-600 font-medium mt-0.5">{doctor.specialty}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant={STATUS_MAP[doctor.status]?.variant || 'default'} size="sm" dot={STATUS_MAP[doctor.status]?.dot}>{STATUS_MAP[doctor.status]?.label || doctor.status}</Badge>
                <Badge variant="outline" size="sm"><Star className="h-3 w-3 mr-0.5 fill-amber-400 text-amber-400"/>{doctor.rating.toFixed(1)}</Badge>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 bg-surface-50 dark:bg-slate-800/60 rounded-xl p-3">{doctor.bio}</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-surface-50 dark:bg-slate-800/60 rounded-xl p-3">
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{doctor.totalAppointments}</p>
              <p className="text-xs text-slate-500 mt-0.5">Citas totales</p>
            </div>
            <div className="bg-surface-50 dark:bg-slate-800/60 rounded-xl p-3">
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(doctor.totalRevenue)}</p>
              <p className="text-xs text-slate-500 mt-0.5">Ingresos</p>
            </div>
            <div className="bg-surface-50 dark:bg-slate-800/60 rounded-xl p-3">
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(doctor.fee)}</p>
              <p className="text-xs text-slate-500 mt-0.5">Tarifa/cita</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Registrado: {formatDate(doctor.registeredAt)}{doctor.verifiedAt ? ` · Verificado: ${formatDate(doctor.verifiedAt)}` : ''}</p>
        </div>
        <div className="p-5 border-t border-surface-200 dark:border-slate-800 flex flex-wrap gap-2">
          {doctor.status === 'pending' && <>
            <Button size="sm" variant="success" onClick={() => { approveDoctor(doctor.id); toast.success(`Dr. ${doctor.name} aprobado`); onClose(); }}>
              <CheckCircle className="h-3.5 w-3.5 mr-1"/> Aprobar
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => { rejectDoctor(doctor.id); toast.error(`Solicitud rechazada`); onClose(); }}>
              <XCircle className="h-3.5 w-3.5 mr-1"/> Rechazar
            </Button>
          </>}
          {doctor.status === 'approved' && (
            <Button size="sm" variant="outline" className="text-amber-600 border-amber-300" onClick={() => { suspendDoctor(doctor.id); toast.success('Médico suspendido'); onClose(); }}>
              <Ban className="h-3.5 w-3.5 mr-1"/> Suspender
            </Button>
          )}
          {doctor.status === 'suspended' && (
            <Button size="sm" variant="success" onClick={() => { reactivateDoctor(doctor.id); toast.success('Médico reactivado'); onClose(); }}>
              <CheckCircle className="h-3.5 w-3.5 mr-1"/> Reactivar
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminDoctors() {
  const { data: doctors = [], isLoading, isError, refetch } = useAdminDoctors();
  const { approveDoctor, rejectDoctor, suspendDoctor } = useAdminMasterStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<any>(null);

  const filtered = useMemo(() => {
    let r = doctors;
    if (search) r = r.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') r = r.filter(d => d.status === statusFilter);
    return r;
  }, [doctors, search, statusFilter]);

  const stats = useMemo(() => ({
    total: doctors.length,
    pending: doctors.filter(d=>d.status==='pending').length,
    approved: doctors.filter(d=>d.status==='approved').length,
    suspended: doctors.filter(d=>d.status==='suspended').length,
  }), [doctors]);

  if (isError) return <ErrorState message="Error al cargar médicos" onRetry={refetch} />;

  return (
    <>
      <Helmet><title>Gestión de Médicos – Admin</title></Helmet>
      <PageHeader title="Gestión de Médicos" subtitle={`${filtered.length} médicos registrados`}
        breadcrumb={[{label:'Admin'},{label:'Médicos'}]} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? [...Array(4)].map((_,i)=><Skeleton key={i} className="h-24"/>) : <>
          <KpiCard title="Total médicos" value={stats.total} icon={<Stethoscope className="h-5 w-5"/>} />
          <KpiCard title="Pendientes" value={stats.pending} icon={<Clock className="h-5 w-5"/>} iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400" change={undefined} />
          <KpiCard title="Aprobados" value={stats.approved} icon={<CheckCircle className="h-5 w-5"/>} iconColor="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" />
          <KpiCard title="Suspendidos" value={stats.suspended} icon={<Ban className="h-5 w-5"/>} iconColor="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400" />
        </>}
      </div>

      {stats.pending > 0 && !isLoading && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-600 shrink-0"/>
          <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
            {stats.pending} médico{stats.pending !== 1 ? 's' : ''} pendiente{stats.pending !== 1 ? 's' : ''} de aprobación
          </p>
          <Button size="sm" variant="outline" className="ml-auto border-amber-400 text-amber-700" onClick={() => setStatusFilter('pending')}>
            Ver pendientes
          </Button>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-surface-200 dark:border-slate-800 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre o especialidad…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"/>
          </div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_MAP).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Médico</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Especialidad</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Ingresos</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
              {isLoading ? [...Array(8)].map((_,i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><Skeleton className="h-8"/></td></tr>
              )) : filtered.map(doc => (
                <motion.tr key={doc.id} initial={{opacity:0}} animate={{opacity:1}}
                  className="hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={doc.avatar} name={doc.name} size="sm"/>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" size="sm">{doc.specialty}</Badge></td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_MAP[doc.status]?.variant || 'default'} size="sm" dot>{STATUS_MAP[doc.status]?.label || doc.status}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="flex items-center gap-1 text-amber-500 font-medium">
                      <Star className="h-3.5 w-3.5 fill-amber-400"/>{doc.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium hidden lg:table-cell">{formatCurrency(doc.totalRevenue)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelected(doc)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600" title="Ver expediente" aria-label="Ver expediente">
                        <Edit2 className="h-3.5 w-3.5"/>
                      </button>
                      {doc.status === 'pending' && <>
                        <button onClick={() => { approveDoctor(doc.id); toast.success(`${doc.name} aprobado`); }} className="p-1.5 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600" title="Aprobar" aria-label="Aprobar">
                          <CheckCircle className="h-3.5 w-3.5"/>
                        </button>
                        <button onClick={() => { rejectDoctor(doc.id); toast.error('Solicitud rechazada'); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600" title="Rechazar" aria-label="Rechazar">
                          <XCircle className="h-3.5 w-3.5"/>
                        </button>
                      </>}
                      {doc.status === 'approved' && (
                        <button onClick={() => { suspendDoctor(doc.id); toast.success('Médico suspendido'); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600" title="Suspender" aria-label="Suspender">
                          <Ban className="h-3.5 w-3.5"/>
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <div className="py-16 text-center text-slate-500 text-sm">No se encontraron médicos con los filtros aplicados.</div>
          )}
        </div>
      </div>
      <AnimatePresence>{selected && <DoctorDetailModal doctor={selected} onClose={() => setSelected(null)}/>}</AnimatePresence>
    </>
  );
}
