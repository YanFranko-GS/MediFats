// ─── USER & AUTH ────────────────────────────────────────────────────────────

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  createdAt: string;
  lastLogin: string;
}

export interface AuthState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

// ─── DOCTOR ─────────────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  specialty: string;
  specialtyId: string;
  subSpecialty?: string;
  experience: number; // years
  price: number; // USD per consultation
  rating: number; // 0-5
  reviewCount: number;
  languages: string[];
  bio: string;
  education: Education[];
  certifications: string[];
  hospital: string;
  location: string;
  availability: DayAvailability[];
  consultationModes: ('in-person' | 'video' | 'chat')[];
  isVerified: boolean;
  isAvailable: boolean;
  nextAvailable: string;
  totalAppointments: number;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface DayAvailability {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  slots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  time: string; // "09:00"
  isBooked: boolean;
}

// ─── SPECIALTY ──────────────────────────────────────────────────────────────

export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  doctorCount: number;
  color: string;
}

// ─── APPOINTMENT ────────────────────────────────────────────────────────────

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
export type ConsultationMode = 'in-person' | 'video' | 'chat';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  doctorSpecialty: string;
  date: string; // ISO
  time: string; // "09:00"
  duration: number; // minutes
  status: AppointmentStatus;
  mode: ConsultationMode;
  reason: string;
  notes?: string;
  price: number;
  createdAt: string;
  cancelReason?: string;
}

// ─── REVIEW ─────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  doctorId: string;
  rating: number;
  comment: string;
  createdAt: string;
  appointmentId: string;
}

// ─── METRICS / KPI ──────────────────────────────────────────────────────────

export interface MonthlyMetric {
  month: string; // "2024-01"
  appointments: number;
  revenue: number;
  newPatients: number;
  newDoctors: number;
  cancellations: number;
  completions: number;
}

export interface AdminKPIs {
  totalRevenue: number;
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  avgRating: number;
  cancellationRate: number;
  completionRate: number;
  revenueGrowth: number;
  appointmentGrowth: number;
}

// ─── CHATBOT ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ─── SEARCH & FILTERS ───────────────────────────────────────────────────────

export interface DoctorFilters {
  query?: string;
  specialty?: string;
  minRating?: number;
  maxPrice?: number;
  language?: string;
  mode?: ConsultationMode;
  availability?: string;
  sortBy?: 'rating' | 'price' | 'experience' | 'reviews';
  sortOrder?: 'asc' | 'desc';
}

// ─── API RESPONSE ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// ─── UI ──────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'high-contrast';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type Language = 'es' | 'en';
