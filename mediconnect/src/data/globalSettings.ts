// AUTO-GENERATED – Fase 14 Mock Data

export interface GlobalSettings {
  branding: {
    platformName: string;
    logoUrl: string;
    primaryColor: string;
    accentColor: string;
    favicon: string;
  };
  system: {
    language: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
  appointments: {
    defaultDurationMinutes: number;
    maxDailyAppointmentsPerDoctor: number;
    maxAdvanceBookingDays: number;
    cancellationPolicyHours: number;
    allowSameDayBooking: boolean;
    requirePaymentUpfront: boolean;
  };
  notifications: {
    emailReminders: boolean;
    smsReminders: boolean;
    reminderHoursBefore: number;
    sendWelcomeEmail: boolean;
    sendCancellationEmail: boolean;
  };
  security: {
    force2FA: boolean;
    sessionTimeoutMinutes: number;
    minPasswordLength: number;
    requireSpecialChars: boolean;
    maxLoginAttempts: number;
  };
  commission: {
    platformFeePercent: number;
    doctorSharePercent: number;
  };
}

export const GLOBAL_SETTINGS: GlobalSettings = {
  branding: {
    platformName: 'MediConnect',
    logoUrl: '/logo.png',
    primaryColor: '#2563eb',
    accentColor: '#0ea5e9',
    favicon: '/favicon.ico',
  },
  system: {
    language: 'es',
    timezone: 'America/Lima',
    currency: 'PEN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
  },
  appointments: {
    defaultDurationMinutes: 30,
    maxDailyAppointmentsPerDoctor: 20,
    maxAdvanceBookingDays: 60,
    cancellationPolicyHours: 24,
    allowSameDayBooking: false,
    requirePaymentUpfront: true,
  },
  notifications: {
    emailReminders: true,
    smsReminders: false,
    reminderHoursBefore: 24,
    sendWelcomeEmail: true,
    sendCancellationEmail: true,
  },
  security: {
    force2FA: false,
    sessionTimeoutMinutes: 60,
    minPasswordLength: 8,
    requireSpecialChars: true,
    maxLoginAttempts: 5,
  },
  commission: {
    platformFeePercent: 20,
    doctorSharePercent: 80,
  },
};
