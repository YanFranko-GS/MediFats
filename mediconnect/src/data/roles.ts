// AUTO-GENERATED – Fase 14 Mock Data

export type Permission =
  | 'view_dashboard' | 'manage_users' | 'delete_users' | 'impersonate_users'
  | 'manage_doctors' | 'approve_doctors' | 'manage_appointments' | 'cancel_appointments'
  | 'view_finance' | 'manage_finance' | 'export_reports' | 'manage_specialties'
  | 'manage_clinics' | 'view_audit' | 'manage_roles' | 'manage_settings'
  | 'view_analytics' | 'moderate_reviews' | 'manage_support' | 'view_security'
  | 'manage_security' | 'manage_ai' | 'view_activity';

export interface Role {
  id: string;
  name: string;
  label: string;
  description: string;
  color: string;
  permissions: Permission[];
  userCount: number;
  isSystem: boolean;
}

export const PERMISSIONS_LIST: { key: Permission; label: string; category: string }[] = [
  { key: 'view_dashboard', label: 'Ver Dashboard', category: 'General' },
  { key: 'view_analytics', label: 'Ver Analytics', category: 'General' },
  { key: 'view_activity', label: 'Ver Actividad', category: 'General' },
  { key: 'manage_users', label: 'Gestionar Usuarios', category: 'Usuarios' },
  { key: 'delete_users', label: 'Eliminar Usuarios', category: 'Usuarios' },
  { key: 'impersonate_users', label: 'Impersonar Usuarios', category: 'Usuarios' },
  { key: 'manage_roles', label: 'Gestionar Roles', category: 'Usuarios' },
  { key: 'manage_doctors', label: 'Gestionar Médicos', category: 'Médicos' },
  { key: 'approve_doctors', label: 'Aprobar Médicos', category: 'Médicos' },
  { key: 'manage_specialties', label: 'Gestionar Especialidades', category: 'Médicos' },
  { key: 'manage_clinics', label: 'Gestionar Clínicas', category: 'Médicos' },
  { key: 'manage_appointments', label: 'Gestionar Citas', category: 'Citas' },
  { key: 'cancel_appointments', label: 'Cancelar Citas', category: 'Citas' },
  { key: 'view_finance', label: 'Ver Finanzas', category: 'Finanzas' },
  { key: 'manage_finance', label: 'Gestionar Finanzas', category: 'Finanzas' },
  { key: 'export_reports', label: 'Exportar Reportes', category: 'Reportes' },
  { key: 'view_audit', label: 'Ver Auditoría', category: 'Seguridad' },
  { key: 'view_security', label: 'Ver Seguridad', category: 'Seguridad' },
  { key: 'manage_security', label: 'Gestionar Seguridad', category: 'Seguridad' },
  { key: 'moderate_reviews', label: 'Moderar Reseñas', category: 'Contenido' },
  { key: 'manage_support', label: 'Gestionar Soporte', category: 'Contenido' },
  { key: 'manage_settings', label: 'Configuración del Sistema', category: 'Sistema' },
  { key: 'manage_ai', label: 'Gestionar IA', category: 'Sistema' },
];

export const ROLES: Role[] = [
  {
    id: 'role-super-admin',
    name: 'super_admin',
    label: 'Super Admin',
    description: 'Acceso total al sistema sin restricciones',
    color: 'purple',
    permissions: PERMISSIONS_LIST.map(p => p.key),
    userCount: 1,
    isSystem: true,
  },
  {
    id: 'role-admin',
    name: 'admin',
    label: 'Administrador',
    description: 'Gestión completa de la plataforma',
    color: 'blue',
    permissions: [
      'view_dashboard','view_analytics','view_activity','manage_users','manage_doctors',
      'approve_doctors','manage_specialties','manage_clinics','manage_appointments',
      'cancel_appointments','view_finance','export_reports','view_audit','moderate_reviews',
      'manage_support','manage_settings',
    ],
    userCount: 3,
    isSystem: true,
  },
  {
    id: 'role-doctor',
    name: 'doctor',
    label: 'Médico',
    description: 'Acceso al panel médico y gestión de pacientes',
    color: 'teal',
    permissions: ['view_dashboard'],
    userCount: 40,
    isSystem: true,
  },
  {
    id: 'role-patient',
    name: 'patient',
    label: 'Paciente',
    description: 'Acceso al portal del paciente',
    color: 'green',
    permissions: ['view_dashboard'],
    userCount: 160,
    isSystem: true,
  },
  {
    id: 'role-receptionist',
    name: 'receptionist',
    label: 'Recepcionista',
    description: 'Gestión de citas y agenda',
    color: 'amber',
    permissions: ['view_dashboard','manage_appointments','cancel_appointments','view_activity'],
    userCount: 5,
    isSystem: false,
  },
  {
    id: 'role-support',
    name: 'support',
    label: 'Soporte',
    description: 'Atención a usuarios y moderación de contenido',
    color: 'orange',
    permissions: ['view_dashboard','manage_support','moderate_reviews','view_activity'],
    userCount: 8,
    isSystem: false,
  },
];
