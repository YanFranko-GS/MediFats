// AUTO-GENERATED – Fase 14 Mock Data

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'billing' | 'technical' | 'appointments' | 'account' | 'other';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'support';
  senderAvatar: string;
  content: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  userRole: 'patient' | 'doctor';
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: TicketMessage[];
}

function daysAgo(d: number): string {
  const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString();
}

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'ticket-001', subject: 'No puedo cancelar mi cita', userId: 'u-patient-1',
    userName: 'María López', userEmail: 'maria.lopez@email.com',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria-lopez',
    userRole: 'patient', status: 'open', priority: 'high', category: 'appointments',
    createdAt: daysAgo(0), updatedAt: daysAgo(0),
    messages: [
      { id: 'msg-001-1', senderId: 'u-patient-1', senderName: 'María López', senderRole: 'user', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria-lopez', content: 'Hola, tengo una cita para mañana y no puedo cancelarla desde la app. El botón aparece desactivado. ¿Pueden ayudarme?', timestamp: daysAgo(0) },
    ],
  },
  {
    id: 'ticket-002', subject: 'Error al procesar pago con tarjeta', userId: 'u-pat-0004',
    userName: 'Luis Castillo', userEmail: 'luis.castillo@email.com',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    userRole: 'patient', status: 'pending', priority: 'urgent', category: 'billing',
    createdAt: daysAgo(1), updatedAt: daysAgo(0),
    messages: [
      { id: 'msg-002-1', senderId: 'u-pat-0004', senderName: 'Luis Castillo', senderRole: 'user', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', content: 'Mi tarjeta fue cobrada dos veces por la misma consulta. Necesito un reembolso urgente.', timestamp: daysAgo(1) },
      { id: 'msg-002-2', senderId: 'u-admin-1', senderName: 'Soporte MediConnect', senderRole: 'support', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin-mediconnect', content: 'Estimado Luis, hemos recibido tu solicitud. Estamos investigando el doble cargo con nuestro equipo de finanzas. Te contactaremos en 24 horas.', timestamp: daysAgo(0) },
    ],
  },
  {
    id: 'ticket-003', subject: 'No aparece mi historia clínica actualizada', userId: 'u-pat-0005',
    userName: 'Carmen Flores', userEmail: 'carmen.flores@email.com',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
    userRole: 'patient', status: 'open', priority: 'medium', category: 'technical',
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
    messages: [
      { id: 'msg-003-1', senderId: 'u-pat-0005', senderName: 'Carmen Flores', senderRole: 'user', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', content: 'Mi médico dice que subió mis resultados al sistema pero yo no los veo en mi perfil. ¿Es un bug?', timestamp: daysAgo(2) },
    ],
  },
  {
    id: 'ticket-004', subject: 'Solicitud de verificación de credenciales', userId: 'u-doctor-1',
    userName: 'Dr. Carlos Mendoza', userEmail: 'dr.carlos.mendoza@email.com',
    userAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza',
    userRole: 'doctor', status: 'resolved', priority: 'high', category: 'account',
    createdAt: daysAgo(5), updatedAt: daysAgo(3),
    messages: [
      { id: 'msg-004-1', senderId: 'u-doctor-1', senderName: 'Dr. Carlos Mendoza', senderRole: 'user', senderAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza', content: 'Necesito actualizar mi certificado de especialidad. El que aparece en mi perfil está desactualizado.', timestamp: daysAgo(5) },
      { id: 'msg-004-2', senderId: 'u-admin-1', senderName: 'Soporte MediConnect', senderRole: 'support', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin-mediconnect', content: 'Dr. Mendoza, puede subir su nuevo certificado desde Perfil > Documentos. Si tiene problemas, escríbanos.', timestamp: daysAgo(4) },
      { id: 'msg-004-3', senderId: 'u-doctor-1', senderName: 'Dr. Carlos Mendoza', senderRole: 'user', senderAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza', content: 'Perfecto, pude actualizarlo. Muchas gracias.', timestamp: daysAgo(3) },
    ],
  },
  {
    id: 'ticket-005', subject: 'La aplicación se cierra sola en iOS 17', userId: 'u-pat-0006',
    userName: 'Roberto Huanca', userEmail: 'roberto.huanca@email.com',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5',
    userRole: 'patient', status: 'open', priority: 'medium', category: 'technical',
    createdAt: daysAgo(3), updatedAt: daysAgo(3),
    messages: [
      { id: 'msg-005-1', senderId: 'u-pat-0006', senderName: 'Roberto Huanca', senderRole: 'user', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', content: 'Tengo iPhone 14 con iOS 17.5 y la app se cierra cuando intento ver los resultados de laboratorio.', timestamp: daysAgo(3) },
    ],
  },
  {
    id: 'ticket-006', subject: 'Quiero cambiar el médico asignado', userId: 'u-pat-0007',
    userName: 'Lucía Quispe', userEmail: 'lucia.quispe@email.com',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6',
    userRole: 'patient', status: 'closed', priority: 'low', category: 'appointments',
    createdAt: daysAgo(10), updatedAt: daysAgo(8),
    messages: [
      { id: 'msg-006-1', senderId: 'u-pat-0007', senderName: 'Lucía Quispe', senderRole: 'user', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6', content: '¿Puedo cambiar el médico de mi próxima consulta sin perder la cita?', timestamp: daysAgo(10) },
      { id: 'msg-006-2', senderId: 'u-admin-1', senderName: 'Soporte MediConnect', senderRole: 'support', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin-mediconnect', content: 'Hola Lucía, sí puedes cancelar y reservar con otro médico. La cancelación dentro de las 48h es gratuita.', timestamp: daysAgo(9) },
    ],
  },
  {
    id: 'ticket-007', subject: 'Mis pagos no aparecen en el estado de cuenta', userId: 'u-doctor-1',
    userName: 'Dr. Carlos Mendoza', userEmail: 'dr.carlos.mendoza@email.com',
    userAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza',
    userRole: 'doctor', status: 'pending', priority: 'urgent', category: 'billing',
    createdAt: daysAgo(1), updatedAt: daysAgo(0),
    messages: [
      { id: 'msg-007-1', senderId: 'u-doctor-1', senderName: 'Dr. Carlos Mendoza', senderRole: 'user', senderAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza', content: 'Las consultas del mes de mayo no aparecen en mi módulo de finanzas. Son aproximadamente $2,400 pendientes.', timestamp: daysAgo(1) },
    ],
  },
];
