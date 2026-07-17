import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Shield, Ban, Edit2, Key, LogIn, CheckCircle, ChevronUp, ChevronDown, X, Users, AlertTriangle } from 'lucide-react';
import { useAdminUsers } from '../hooks/useAdminMaster';
import { useAdminMasterStore } from '../store/adminMasterStore';
import { PageHeader, KpiCard, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Badge, Skeleton, Avatar } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { cn, formatDate, formatRelative } from '../../../shared/utils';
import { toast } from 'sonner';

interface AdminUsersProps { filterRole?: string; }

const ROLE_LABELS: Record<string, string> = { patient: 'Paciente', doctor: 'Médico', admin: 'Admin', receptionist: 'Recepcionista', support: 'Soporte' };
const ROLE_COLORS: Record<string, any> = { patient: 'primary', doctor: 'secondary', admin: 'error', receptionist: 'warning', support: 'default' } as any;
const STATUS_VARIANTS: Record<string, any> = { active: 'success', suspended: 'warning', blocked: 'error' };
const STATUS_LABELS: Record<string, string> = { active: 'Activo', suspended: 'Suspendido', blocked: 'Bloqueado' };

interface UserModalProps { user: any; onClose: () => void; }

function UserModal({ user, onClose }: UserModalProps) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const { suspendUser, activateUser, blockUser, setImpersonating } = useAdminMasterStore();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Perfil de Usuario</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"><X className="h-4 w-4"/></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar} name={user.name} size="lg" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant={STATUS_VARIANTS[user.status] || 'default'} size="sm" dot>{STATUS_LABELS[user.status]}</Badge>
                <Badge variant="outline" size="sm">{ROLE_LABELS[user.role] || user.role}</Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-surface-50 dark:bg-slate-800/60 rounded-xl p-3">
              <p className="text-slate-500 text-xs mb-0.5">Teléfono</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">{user.phone || '—'}</p>
            </div>
            <div className="bg-surface-50 dark:bg-slate-800/60 rounded-xl p-3">
              <p className="text-slate-500 text-xs mb-0.5">Citas</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">{user.appointmentsCount}</p>
            </div>
            <div className="bg-surface-50 dark:bg-slate-800/60 rounded-xl p-3">
              <p className="text-slate-500 text-xs mb-0.5">Registrado</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">{formatDate(user.registeredAt)}</p>
            </div>
            <div className="bg-surface-50 dark:bg-slate-800/60 rounded-xl p-3">
              <p className="text-slate-500 text-xs mb-0.5">Último acceso</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">{formatRelative(user.lastLogin)}</p>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-surface-200 dark:border-slate-800 flex flex-wrap gap-2">
          {user.status !== 'active' && (
            <Button size="sm" variant="outline" className="text-green-600 border-green-300" onClick={() => { activateUser(user.id); toast.success('Usuario activado'); onClose(); }}>
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Activar
            </Button>
          )}
          {user.status === 'active' && (
            <Button size="sm" variant="outline" className="text-amber-600 border-amber-300" onClick={() => { suspendUser(user.id); toast.success('Usuario suspendido'); onClose(); }}>
              <Ban className="h-3.5 w-3.5 mr-1" /> Suspender
            </Button>
          )}
          <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => { blockUser(user.id); toast.success('Usuario bloqueado'); onClose(); }}>
            <Shield className="h-3.5 w-3.5 mr-1" /> Bloquear
          </Button>
          <Button size="sm" variant="outline" onClick={() => { toast.success(`Email de restablecimiento enviado a ${user.email}`); onClose(); }}>
            <Key className="h-3.5 w-3.5 mr-1" /> Reset contraseña
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white ml-auto" onClick={() => {
            setImpersonating(user.id, user.name);
            toast.success(`Impersonando a ${user.name}. Redirigiendo…`);
            onClose();
          }}>
            <LogIn className="h-3.5 w-3.5 mr-1" /> Impersonar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminUsers({ filterRole }: AdminUsersProps) {
  const { data: users = [], isLoading, isError, refetch } = useAdminUsers();
  const { suspendUser, activateUser, blockUser } = useAdminMasterStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(filterRole || 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [sortKey, setSortKey] = useState<string>('registeredAt');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');

  const filtered = useMemo(() => {
    let res = users;
    if (search) res = res.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter !== 'all') res = res.filter(u => u.role === roleFilter);
    if (statusFilter !== 'all') res = res.filter(u => u.status === statusFilter);
    res = [...res].sort((a, b) => {
      const av = (a as any)[sortKey] ?? ''; const bv = (b as any)[sortKey] ?? '';
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return res;
  }, [users, search, roleFilter, statusFilter, sortKey, sortDir]);

  const stats = useMemo(() => ({
    total: users.length, active: users.filter(u=>u.status==='active').length,
    suspended: users.filter(u=>u.status==='suspended').length, blocked: users.filter(u=>u.status==='blocked').length,
  }), [users]);

  function SortBtn({ col }: { col: string }) {
    const active = sortKey === col;
    return (
      <button onClick={() => { if (active) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(col); setSortDir('asc'); } }}
        className="ml-1 inline-flex flex-col opacity-50 hover:opacity-100 transition-opacity">
        <ChevronUp className={cn('h-2.5 w-2.5', active && sortDir==='asc' && 'opacity-100 text-primary-600')} />
        <ChevronDown className={cn('h-2.5 w-2.5 -mt-0.5', active && sortDir==='desc' && 'opacity-100 text-primary-600')} />
      </button>
    );
  }

  if (isError) return <ErrorState message="Error al cargar usuarios" onRetry={refetch} />;

  return (
    <>
      <Helmet><title>Gestión de Usuarios – Admin</title></Helmet>
      <PageHeader title={filterRole === 'admin' ? 'Administradores' : 'Gestión de Usuarios'}
        subtitle={`${filtered.length} usuarios encontrados`}
        breadcrumb={[{label:'Admin'},{label:'Usuarios'}]}
        action={<Button size="sm"><UserPlus className="h-4 w-4 mr-1.5"/>Nuevo usuario</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? [...Array(4)].map((_,i)=><Skeleton key={i} className="h-24"/>) : <>
          <KpiCard title="Total usuarios" value={stats.total} icon={<Users className="h-5 w-5"/>} />
          <KpiCard title="Activos" value={stats.active} icon={<CheckCircle className="h-5 w-5"/>} iconColor="bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" />
          <KpiCard title="Suspendidos" value={stats.suspended} icon={<AlertTriangle className="h-5 w-5"/>} iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400" />
          <KpiCard title="Bloqueados" value={stats.blocked} icon={<Ban className="h-5 w-5"/>} iconColor="bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400" />
        </>}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-surface-200 dark:border-slate-800 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre o email…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
          </div>
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
            <option value="all">Todos los roles</option>
            {Object.entries(ROLE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30">
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="suspended">Suspendido</option>
            <option value="blocked">Bloqueado</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Usuario <SortBtn col="name"/>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rol</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                  Registrado <SortBtn col="registeredAt"/>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Citas</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
              {isLoading ? [...Array(8)].map((_,i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><Skeleton className="h-8"/></td></tr>
              )) : filtered.map(user => (
                <motion.tr key={user.id} initial={{opacity:0}} animate={{opacity:1}}
                  className="hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.name} size="sm" />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ROLE_COLORS[user.role] || 'default'} size="sm">{ROLE_LABELS[user.role] || user.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[user.status] || 'default'} size="sm" dot>{STATUS_LABELS[user.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell text-xs">{formatDate(user.registeredAt)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium hidden lg:table-cell">{user.appointmentsCount}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedUser(user)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700" title="Ver perfil" aria-label="Ver perfil">
                        <Edit2 className="h-3.5 w-3.5"/>
                      </button>
                      {user.status === 'active' ? (
                        <button onClick={() => { suspendUser(user.id); toast.success(`${user.name} suspendido`); }} className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-500 hover:text-amber-600" title="Suspender" aria-label="Suspender">
                          <Ban className="h-3.5 w-3.5"/>
                        </button>
                      ) : (
                        <button onClick={() => { activateUser(user.id); toast.success(`${user.name} activado`); }} className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-500 hover:text-green-600" title="Activar" aria-label="Activar">
                          <CheckCircle className="h-3.5 w-3.5"/>
                        </button>
                      )}
                      <button onClick={() => { blockUser(user.id); toast.success(`${user.name} bloqueado permanentemente`); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600" title="Bloquear" aria-label="Bloquear">
                        <Shield className="h-3.5 w-3.5"/>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <div className="py-16 text-center text-slate-500 text-sm">No se encontraron usuarios con los filtros aplicados.</div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-surface-200 dark:border-slate-800 text-xs text-slate-500">
          Mostrando {filtered.length} de {users.length} usuarios
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </AnimatePresence>
    </>
  );
}
