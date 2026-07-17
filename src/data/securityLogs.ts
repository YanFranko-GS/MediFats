// AUTO-GENERATED – Fase 14 Mock Data

export interface LoginAttempt {
  id: string;
  email: string;
  ip: string;
  userAgent: string;
  country: string;
  status: 'failed' | 'blocked';
  timestamp: string;
  attempts: number;
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userAvatar: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActivity: string;
  startedAt: string;
  isCurrent: boolean;
}

export interface SecurityAlert {
  id: string;
  type: 'unusual_location' | 'brute_force' | 'multiple_accounts' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip: string;
  timestamp: string;
  resolved: boolean;
}

function daysAgo(d: number, h = 0): string {
  const dt = new Date(); dt.setDate(dt.getDate() - d); dt.setHours(dt.getHours() - h);
  return dt.toISOString();
}

export const LOGIN_ATTEMPTS: LoginAttempt[] = [
  { id: 'la-001', email: 'admin@mediconnect.com', ip: '45.32.11.200', userAgent: 'Mozilla/5.0', country: 'CN', status: 'blocked', timestamp: daysAgo(0, 2), attempts: 15 },
  { id: 'la-002', email: 'dr.mendoza@email.com', ip: '198.51.100.42', userAgent: 'Chrome/120', country: 'RU', status: 'failed', timestamp: daysAgo(0, 4), attempts: 7 },
  { id: 'la-003', email: 'maria.lopez@email.com', ip: '203.0.113.55', userAgent: 'Safari/17', country: 'BR', status: 'failed', timestamp: daysAgo(1), attempts: 3 },
  { id: 'la-004', email: 'admin@mediconnect.com', ip: '172.16.254.1', userAgent: 'Bot/1.0', country: 'US', status: 'blocked', timestamp: daysAgo(1, 3), attempts: 22 },
  { id: 'la-005', email: 'soporte@fake.com', ip: '10.10.10.200', userAgent: 'Python/3.11', country: 'UA', status: 'blocked', timestamp: daysAgo(2), attempts: 50 },
  { id: 'la-006', email: 'patricia.garcia@email.com', ip: '192.0.2.88', userAgent: 'Firefox/125', country: 'AR', status: 'failed', timestamp: daysAgo(2, 6), attempts: 4 },
  { id: 'la-007', email: 'dr.torres@email.com', ip: '45.33.32.156', userAgent: 'Edge/120', country: 'MX', status: 'failed', timestamp: daysAgo(3), attempts: 2 },
  { id: 'la-008', email: 'admin@test.com', ip: '198.18.0.44', userAgent: 'curl/7.88', country: 'KR', status: 'blocked', timestamp: daysAgo(3, 8), attempts: 30 },
  { id: 'la-009', email: 'usuario@spam.com', ip: '100.25.66.12', userAgent: 'Scrapy/2.11', country: 'IN', status: 'blocked', timestamp: daysAgo(4), attempts: 18 },
  { id: 'la-010', email: 'jorge.ramirez@email.com', ip: '54.32.11.90', userAgent: 'Chrome/121', country: 'CO', status: 'failed', timestamp: daysAgo(5), attempts: 5 },
  { id: 'la-011', email: 'unknown@domain.io', ip: '195.110.124.4', userAgent: 'Go-http/1.1', country: 'DE', status: 'blocked', timestamp: daysAgo(6), attempts: 40 },
  { id: 'la-012', email: 'admin@mediconnect.com', ip: '37.19.206.12', userAgent: 'Python/requests', country: 'VN', status: 'blocked', timestamp: daysAgo(7), attempts: 12 },
];

export const ACTIVE_SESSIONS: ActiveSession[] = [
  { id: 'sess-001', userId: 'u-admin-1', userName: 'Admin MediConnect', userRole: 'admin', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin-mediconnect', device: 'MacBook Pro', browser: 'Chrome 126', ip: '192.168.1.101', location: 'Lima, PE', lastActivity: daysAgo(0, 0), startedAt: daysAgo(0, 2), isCurrent: true },
  { id: 'sess-002', userId: 'u-doctor-1', userName: 'Dr. Carlos Mendoza', userRole: 'doctor', userAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza', device: 'iPhone 15', browser: 'Safari 17', ip: '190.65.12.44', location: 'Lima, PE', lastActivity: daysAgo(0, 1), startedAt: daysAgo(0, 3), isCurrent: false },
  { id: 'sess-003', userId: 'u-patient-1', userName: 'María López', userRole: 'patient', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria-lopez', device: 'Samsung Galaxy S24', browser: 'Chrome Android', ip: '190.41.55.22', location: 'Miraflores, Lima', lastActivity: daysAgo(0, 2), startedAt: daysAgo(0, 5), isCurrent: false },
  { id: 'sess-004', userId: 'u-admin-2', userName: 'Carlos Torres', userRole: 'admin', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos-torres', device: 'Dell XPS 15', browser: 'Firefox 127', ip: '192.168.2.55', location: 'San Isidro, Lima', lastActivity: daysAgo(0, 0), startedAt: daysAgo(0, 1), isCurrent: false },
  { id: 'sess-005', userId: 'u-pat-0003', userName: 'Patricia González', userRole: 'patient', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', device: 'iPad Pro', browser: 'Safari 17', ip: '200.48.99.13', location: 'Surco, Lima', lastActivity: daysAgo(0, 3), startedAt: daysAgo(0, 6), isCurrent: false },
];

export const SECURITY_ALERTS: SecurityAlert[] = [
  { id: 'alert-001', type: 'brute_force', severity: 'critical', description: 'Ataque de fuerza bruta detectado desde IP 45.32.11.200 – 15 intentos fallidos en 10 minutos', ip: '45.32.11.200', timestamp: daysAgo(0, 2), resolved: false },
  { id: 'alert-002', type: 'unusual_location', severity: 'high', description: 'Acceso desde ubicación inusual detectado para admin@mediconnect.com (China)', ip: '45.32.11.200', timestamp: daysAgo(0, 4), resolved: false },
  { id: 'alert-003', type: 'multiple_accounts', severity: 'medium', description: 'Misma IP creando múltiples cuentas en menos de 1 hora', ip: '198.51.100.42', timestamp: daysAgo(1), resolved: true },
  { id: 'alert-004', type: 'suspicious_activity', severity: 'high', description: 'Patrón de scraping detectado – 500 solicitudes en 5 minutos desde IP 100.25.66.12', ip: '100.25.66.12', timestamp: daysAgo(2), resolved: true },
  { id: 'alert-005', type: 'brute_force', severity: 'critical', description: 'Bot automatizado detectado intentando credenciales comunes', ip: '195.110.124.4', timestamp: daysAgo(3), resolved: true },
];
