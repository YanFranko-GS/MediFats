import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Check } from 'lucide-react';
import { useAdminMasterStore } from '../store/adminMasterStore';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Badge } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { PERMISSIONS_LIST, type Permission } from '../../../data/roles';
import { cn } from '../../../shared/utils';
import { toast } from 'sonner';

const CATEGORY_ORDER = ['General','Usuarios','Médicos','Citas','Finanzas','Reportes','Seguridad','Contenido','Sistema'];
const ROLE_BADGE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  doctor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  patient: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  receptionist: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  support: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function AdminRoles() {
  const { roles, updateRolePermissions } = useAdminMasterStore();
  const [selectedRoleId, setSelectedRoleId] = useState(roles[1]?.id || roles[0]?.id);
  const [dirty, setDirty] = useState<Record<string, Permission[]>>({});

  const selectedRole = roles.find(r => r.id === selectedRoleId);
  const currentPerms: Permission[] = dirty[selectedRoleId] ?? selectedRole?.permissions ?? [];

  function toggle(p: Permission) {
    if (selectedRole?.isSystem && selectedRole.name === 'super_admin') return;
    const next = currentPerms.includes(p) ? currentPerms.filter(x => x !== p) : [...currentPerms, p];
    setDirty(d => ({ ...d, [selectedRoleId]: next }));
  }

  function save() {
    updateRolePermissions(selectedRoleId, currentPerms);
    setDirty(d => { const n = { ...d }; delete n[selectedRoleId]; return n; });
    toast.success('Permisos actualizados correctamente');
  }

  const grouped = CATEGORY_ORDER.map(cat => ({
    category: cat,
    permissions: PERMISSIONS_LIST.filter(p => p.category === cat),
  })).filter(g => g.permissions.length > 0);

  return (
    <>
      <Helmet><title>Roles y Permisos – Admin</title></Helmet>
      <PageHeader title="Roles y Permisos" subtitle="Gestión RBAC de la plataforma"
        breadcrumb={[{label:'Admin'},{label:'Roles y Permisos'}]}
      />

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1 mb-3">Roles del sistema</p>
          {roles.map(role => (
            <button key={role.id} onClick={() => setSelectedRoleId(role.id)}
              className={cn('w-full text-left p-3 rounded-xl border transition-all',
                selectedRoleId === role.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                  : 'border-surface-200 dark:border-slate-800 hover:border-primary-300 bg-white dark:bg-slate-900')}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-medium text-sm text-slate-800 dark:text-slate-100">{role.label}</span>
                {dirty[role.id] && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Cambios sin guardar"/>}
              </div>
              <div className="flex items-center justify-between">
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', ROLE_BADGE_COLORS[role.name] || 'bg-slate-100 text-slate-600')}>{role.userCount} usuarios</span>
                {role.isSystem && <span className="text-xs text-slate-400">Sistema</span>}
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {selectedRole && (
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary-500" /> {selectedRole.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedRole.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" size="sm">{currentPerms.length}/{PERMISSIONS_LIST.length} permisos</Badge>
                  {dirty[selectedRoleId] && (
                    <Button size="sm" onClick={save}>Guardar cambios</Button>
                  )}
                </div>
              </div>
              <div className="p-5 space-y-6 max-h-[calc(100vh-320px)] overflow-y-auto">
                {grouped.map(({ category, permissions }) => (
                  <div key={category}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-surface-200 dark:bg-slate-800"/>
                      {category}
                      <span className="h-px flex-1 bg-surface-200 dark:bg-slate-800"/>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {permissions.map(p => {
                        const active = currentPerms.includes(p.key);
                        const locked = selectedRole.name === 'super_admin';
                        return (
                          <button key={p.key} onClick={() => toggle(p.key)} disabled={locked}
                            className={cn('flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                              active ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/20' : 'border-surface-200 dark:border-slate-800 hover:border-primary-300',
                              locked && 'opacity-70 cursor-not-allowed')}>
                            <div className={cn('w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors border',
                              active ? 'bg-primary-600 border-primary-600' : 'border-surface-300 dark:border-slate-600')}>
                              {active && <Check className="h-3 w-3 text-white"/>}
                            </div>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
