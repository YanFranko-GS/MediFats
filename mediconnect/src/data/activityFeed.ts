// AUTO-GENERATED – Fase 14 Mock Data

export type ActivityEventType =
  | 'appointment.booked' | 'appointment.cancelled' | 'appointment.completed'
  | 'user.registered' | 'doctor.approved' | 'doctor.suspended'
  | 'payment.confirmed' | 'review.published' | 'review.flagged'
  | 'report.exported' | 'user.login' | 'system.alert';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  actorName: string;
  actorAvatar: string;
  actorRole: string;
  metadata: Record<string, string>;
  timestamp: string;
  icon: string;
  color: string;
}

function minutesAgo(m: number): string {
  const d = new Date(); d.setMinutes(d.getMinutes() - m); return d.toISOString();
}

const EVENTS: ActivityEvent[] = [
  { id:'act-001', type:'appointment.booked', title:'Nueva reserva realizada', description:'María López reservó cita con Dr. Mendoza para el 20/06', actorName:'María López', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=maria-lopez', actorRole:'Paciente', metadata:{ doctor:'Dr. Carlos Mendoza', fecha:'20/06/2026', hora:'10:00', monto:'$80' }, timestamp:minutesAgo(2), icon:'Calendar', color:'blue' },
  { id:'act-002', type:'payment.confirmed', title:'Pago confirmado', description:'Pago de $120 confirmado para consulta de Cardiología', actorName:'Luis Castillo', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', actorRole:'Paciente', metadata:{ monto:'$120', metodo:'Tarjeta Visa', especialidad:'Cardiología' }, timestamp:minutesAgo(5), icon:'CreditCard', color:'green' },
  { id:'act-003', type:'user.registered', title:'Nuevo paciente registrado', description:'Carmen Flores se registró como nuevo paciente en la plataforma', actorName:'Carmen Flores', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', actorRole:'Paciente', metadata:{ email:'carmen.flores@email.com', ciudad:'Lima' }, timestamp:minutesAgo(12), icon:'UserPlus', color:'teal' },
  { id:'act-004', type:'doctor.approved', title:'Médico aprobado', description:'Dr. Luis Vargas aprobado como neurólogo en la plataforma', actorName:'Admin MediConnect', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=admin-mediconnect', actorRole:'Admin', metadata:{ doctor:'Dr. Luis Vargas', especialidad:'Neurología' }, timestamp:minutesAgo(18), icon:'UserCheck', color:'purple' },
  { id:'act-005', type:'review.published', title:'Reseña publicada', description:'Nueva reseña de 5 estrellas para Dr. Ana Torres', actorName:'Roberto Huanca', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', actorRole:'Paciente', metadata:{ doctor:'Dra. Ana Torres', rating:'5', especialidad:'Dermatología' }, timestamp:minutesAgo(25), icon:'Star', color:'amber' },
  { id:'act-006', type:'appointment.cancelled', title:'Cancelación procesada', description:'Lucía Quispe canceló su cita con Dr. Ramos', actorName:'Lucía Quispe', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=user6', actorRole:'Paciente', metadata:{ doctor:'Dr. Pedro Ramos', reembolso:'$60', motivo:'Personal' }, timestamp:minutesAgo(34), icon:'XCircle', color:'red' },
  { id:'act-007', type:'appointment.booked', title:'Nueva reserva realizada', description:'Jorge Ramírez reservó consulta de Pediatría', actorName:'Jorge Ramírez', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=user7', actorRole:'Paciente', metadata:{ doctor:'Dra. Sofía Chen', fecha:'22/06/2026', hora:'15:30', monto:'$70' }, timestamp:minutesAgo(41), icon:'Calendar', color:'blue' },
  { id:'act-008', type:'payment.confirmed', title:'Pago confirmado', description:'Pago de $90 confirmado para teleconsulta', actorName:'Patricia González', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', actorRole:'Paciente', metadata:{ monto:'$90', metodo:'PayPal', tipo:'Teleconsulta' }, timestamp:minutesAgo(50), icon:'CreditCard', color:'green' },
  { id:'act-009', type:'report.exported', title:'Reporte exportado', description:'Reporte mensual de ingresos exportado en PDF', actorName:'Carlos Torres', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos-torres', actorRole:'Admin', metadata:{ tipo:'Ingresos', periodo:'Mayo 2026', formato:'PDF' }, timestamp:minutesAgo(65), icon:'FileDown', color:'indigo' },
  { id:'act-010', type:'system.alert', title:'Alerta de seguridad', description:'Múltiples intentos de acceso fallidos detectados desde IP 45.32.11.200', actorName:'Sistema', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=system', actorRole:'Sistema', metadata:{ ip:'45.32.11.200', intentos:'15', accion:'IP bloqueada' }, timestamp:minutesAgo(72), icon:'Shield', color:'red' },
  { id:'act-011', type:'user.registered', title:'Nuevo médico registrado', description:'Dr. Roberto Paz se registró y está pendiente de aprobación', actorName:'Dr. Roberto Paz', actorAvatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-roberto-paz', actorRole:'Doctor', metadata:{ especialidad:'Gastroenterología', estado:'Pendiente' }, timestamp:minutesAgo(85), icon:'UserPlus', color:'teal' },
  { id:'act-012', type:'appointment.completed', title:'Consulta completada', description:'Teleconsulta de Cardiología marcada como completada', actorName:'Dr. Carlos Mendoza', actorAvatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza', actorRole:'Doctor', metadata:{ paciente:'Ana García', duracion:'45 min', tipo:'Online' }, timestamp:minutesAgo(95), icon:'CheckCircle', color:'green' },
  { id:'act-013', type:'review.flagged', title:'Reseña reportada', description:'Reseña denunciada por contenido inapropiado', actorName:'Dr. Pedro Ramos', actorAvatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-pedro-ramos', actorRole:'Doctor', metadata:{ motivo:'Lenguaje ofensivo', estado:'Pendiente revisión' }, timestamp:minutesAgo(110), icon:'Flag', color:'orange' },
  { id:'act-014', type:'appointment.booked', title:'Nueva reserva realizada', description:'Sandra Morales reservó cita de Endocrinología', actorName:'Sandra Morales', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=user8', actorRole:'Paciente', metadata:{ doctor:'Dra. Elena Vargas', fecha:'25/06/2026', hora:'09:00', monto:'$95' }, timestamp:minutesAgo(125), icon:'Calendar', color:'blue' },
  { id:'act-015', type:'payment.confirmed', title:'Pago confirmado', description:'Pago de $75 confirmado para consulta presencial', actorName:'Marco Quispe', actorAvatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=user9', actorRole:'Paciente', metadata:{ monto:'$75', metodo:'Efectivo', tipo:'Presencial' }, timestamp:minutesAgo(140), icon:'CreditCard', color:'green' },
];

// Generate 150 events by repeating with time offset
export const ACTIVITY_FEED: ActivityEvent[] = Array.from({ length: 150 }, (_, i) => {
  const base = EVENTS[i % EVENTS.length];
  const extraMinutes = Math.floor(i / EVENTS.length) * 180;
  const ts = new Date(base.timestamp);
  ts.setMinutes(ts.getMinutes() - extraMinutes);
  return { ...base, id: `act-${String(i + 1).padStart(3, '0')}`, timestamp: ts.toISOString() };
});
