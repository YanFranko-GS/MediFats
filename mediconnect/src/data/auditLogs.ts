// AUTO-GENERATED – Fase 14 Mock Data

export type AuditAction =
  | 'user.created' | 'user.updated' | 'user.deleted' | 'user.suspended'
  | 'user.activated' | 'user.role_changed' | 'user.impersonated' | 'user.password_reset'
  | 'doctor.approved' | 'doctor.rejected' | 'doctor.suspended' | 'doctor.reactivated'
  | 'appointment.cancelled' | 'appointment.rescheduled' | 'appointment.completed'
  | 'finance.payout_marked' | 'review.approved' | 'review.hidden' | 'review.deleted'
  | 'settings.updated' | 'role.permissions_updated' | 'report.exported' | 'security.user_blocked';

export interface AuditLog {
  id: string;
  action: AuditAction;
  adminId: string;
  adminName: string;
  targetType: 'user' | 'doctor' | 'appointment' | 'review' | 'system' | 'finance';
  targetId: string;
  targetName: string;
  description: string;
  details: Record<string, string>;
  ip: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const IPS = ['192.168.1.101','10.0.0.55','172.16.0.22','192.168.0.15','10.10.10.88'];
const ADMINS = [
  { id: 'u-admin-1', name: 'Admin MediConnect' },
  { id: 'u-admin-2', name: 'Carlos Torres' },
  { id: 'u-admin-3', name: 'Ana Rodríguez' },
];

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function daysAgo(d: number): string {
  const dt = new Date(); dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

const LOG_TEMPLATES: Array<{
  action: AuditAction;
  targetType: AuditLog['targetType'];
  severity: AuditLog['severity'];
  make: () => { targetId: string; targetName: string; description: string; details: Record<string,string> };
}> = [
  {
    action: 'user.suspended', targetType: 'user', severity: 'high',
    make: () => ({ targetId: 'u-pat-0010', targetName: 'Jorge Ramírez', description: 'Usuario suspendido por comportamiento inapropiado', details: { motivo: 'Múltiples reportes de abuso', duracion: '30 días' } }),
  },
  {
    action: 'doctor.approved', targetType: 'doctor', severity: 'medium',
    make: () => ({ targetId: 'doc-042', targetName: 'Dr. Luis Vargas', description: 'Médico aprobado tras verificación de credenciales', details: { especialidad: 'Neurología', documentos: 'Verificados' } }),
  },
  {
    action: 'appointment.cancelled', targetType: 'appointment', severity: 'low',
    make: () => ({ targetId: 'appt-00234', targetName: 'Cita #234', description: 'Cita cancelada por admin por solicitud del paciente', details: { paciente: 'María López', reembolso: 'Procesado' } }),
  },
  {
    action: 'settings.updated', targetType: 'system', severity: 'medium',
    make: () => ({ targetId: 'system', targetName: 'Configuración Global', description: 'Configuración de política de cancelación actualizada', details: { campo: 'Horas antelación', anterior: '24h', nuevo: '48h' } }),
  },
  {
    action: 'user.role_changed', targetType: 'user', severity: 'high',
    make: () => ({ targetId: 'u-pat-0025', targetName: 'Sofia Chen', description: 'Rol cambiado de Paciente a Recepcionista', details: { rolAnterior: 'patient', rolNuevo: 'receptionist' } }),
  },
  {
    action: 'report.exported', targetType: 'system', severity: 'low',
    make: () => ({ targetId: 'report-001', targetName: 'Reporte Mensual', description: 'Reporte de ingresos exportado en formato PDF', details: { periodo: 'Mayo 2026', formato: 'PDF' } }),
  },
  {
    action: 'review.hidden', targetType: 'review', severity: 'medium',
    make: () => ({ targetId: 'rev-089', targetName: 'Reseña #89', description: 'Reseña ocultada por contenido inapropiado', details: { doctor: 'Dr. Ana Torres', motivo: 'Lenguaje ofensivo' } }),
  },
  {
    action: 'user.deleted', targetType: 'user', severity: 'critical',
    make: () => ({ targetId: 'u-pat-0099', targetName: 'Usuario Anónimo', description: 'Cuenta eliminada permanentemente por solicitud GDPR', details: { motivo: 'Derecho al olvido', datosEliminados: 'Sí' } }),
  },
  {
    action: 'doctor.rejected', targetType: 'doctor', severity: 'medium',
    make: () => ({ targetId: 'doc-pending-05', targetName: 'Dr. Roberto Paz', description: 'Solicitud de médico rechazada por documentación incompleta', details: { motivo: 'Falta certificado de colegiatura', estado: 'Pendiente nueva solicitud' } }),
  },
  {
    action: 'finance.payout_marked', targetType: 'finance', severity: 'low',
    make: () => ({ targetId: 'payout-012', targetName: 'Pago Dr. Mendoza', description: 'Pago mensual marcado como completado', details: { monto: '$2,450', metodo: 'Transferencia bancaria' } }),
  },
  {
    action: 'security.user_blocked', targetType: 'user', severity: 'critical',
    make: () => ({ targetId: 'u-pat-0088', targetName: 'IP Sospechosa', description: 'Usuario bloqueado por múltiples intentos de acceso fallidos', details: { intentos: '15', ip: '45.32.11.200' } }),
  },
  {
    action: 'role.permissions_updated', targetType: 'system', severity: 'high',
    make: () => ({ targetId: 'role-support', targetName: 'Rol Soporte', description: 'Permisos del rol Soporte actualizados', details: { permisosAgregados: 'view_finance', permisosEliminados: 'manage_users' } }),
  },
  {
    action: 'user.impersonated', targetType: 'user', severity: 'high',
    make: () => ({ targetId: 'u-pat-0015', targetName: 'Patricia García', description: 'Admin impersonó usuario para diagnóstico de problema', details: { duracion: '5 minutos', motivo: 'Soporte técnico' } }),
  },
  {
    action: 'appointment.rescheduled', targetType: 'appointment', severity: 'low',
    make: () => ({ targetId: 'appt-00567', targetName: 'Cita #567', description: 'Cita reprogramada por admin a petición del doctor', details: { nuevaFecha: '2026-06-20', nuevaHora: '10:00' } }),
  },
];

export const AUDIT_LOGS: AuditLog[] = Array.from({ length: 200 }, (_, i) => {
  const tmpl = LOG_TEMPLATES[i % LOG_TEMPLATES.length];
  const { targetId, targetName, description, details } = tmpl.make();
  const admin = rnd(ADMINS);
  return {
    id: `audit-${String(i + 1).padStart(4, '0')}`,
    action: tmpl.action,
    adminId: admin.id,
    adminName: admin.name,
    targetType: tmpl.targetType,
    targetId,
    targetName,
    description,
    details,
    ip: rnd(IPS),
    timestamp: daysAgo(Math.floor(i / 8)),
    severity: tmpl.severity,
  };
}).reverse();
