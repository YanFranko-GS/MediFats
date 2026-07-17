import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BlockedSlot { date: string; time: string; }
interface ConsultationRecord {
  appointmentId: string;
  patientId: string;
  motivo: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  createdAt: string;
}

interface DoctorStore {
  // Schedule settings
  consultationDuration: 30 | 15 | 45 | 60 | 90;
  blockedSlots: BlockedSlot[];
  workingHours: { start: string; end: string; days: number[] };
  setConsultationDuration: (d: DoctorStore['consultationDuration']) => void;
  setWorkingHours: (h: Partial<DoctorStore['workingHours']>) => void;
  toggleWorkingDay: (dayIndex: number) => void;
  blockSlot: (date: string, time: string) => void;
  unblockSlot: (date: string, time: string) => void;
  isBlocked: (date: string, time: string) => boolean;

  // Consultations (in-session EMR)
  consultations: ConsultationRecord[];
  saveConsultation: (c: ConsultationRecord) => void;
  getConsultation: (appointmentId: string) => ConsultationRecord | undefined;

  // Profile
  profile: {
    specialty: string;
    experience: number;
    bio: string;
    price: number;
    languages: string[];
    modes: string[];
    certifications: string[];
  };
  updateProfile: (p: Partial<DoctorStore['profile']>) => void;

  // Requests resolved (session)
  resolvedRequestIds: string[];
  resolveRequest: (id: string) => void;

  // Emitted prescriptions (session)
  emittedPrescriptions: any[];
  addPrescription: (p: any) => void;

  // Emitted orders (session)
  emittedOrders: any[];
  addOrder: (o: any) => void;
}

export const useDoctorStore = create<DoctorStore>()(
  persist(
    (set, get) => ({
      consultationDuration: 30,
      blockedSlots: [],
      workingHours: { start: '08:00', end: '18:00', days: [1,2,3,4,5] },
      setConsultationDuration: (d) => set({ consultationDuration: d }),
      setWorkingHours: (h) => set(s => ({ workingHours: { ...s.workingHours, ...h } })),
      toggleWorkingDay: (dayIndex) => set(s => {
        const days = s.workingHours.days.includes(dayIndex)
          ? s.workingHours.days.filter(d => d !== dayIndex)
          : [...s.workingHours.days, dayIndex].sort();
        return { workingHours: { ...s.workingHours, days } };
      }),
      blockSlot: (date, time) => set(s => ({ blockedSlots: [...s.blockedSlots, { date, time }] })),
      unblockSlot: (date, time) => set(s => ({ blockedSlots: s.blockedSlots.filter(b => !(b.date===date && b.time===time)) })),
      isBlocked: (date, time) => get().blockedSlots.some(b => b.date===date && b.time===time),

      consultations: [],
      saveConsultation: (c) => set(s => {
        const rest = s.consultations.filter(x => x.appointmentId !== c.appointmentId);
        return { consultations: [...rest, c] };
      }),
      getConsultation: (id) => get().consultations.find(c => c.appointmentId === id),

      profile: {
        specialty: 'Cardiología',
        experience: 15,
        bio: 'Especialista en Cardiología con 15 años de experiencia. Egresado de la UNMSM. Certificado por la Sociedad Peruana de Cardiología.',
        price: 80,
        languages: ['Español', 'Inglés'],
        modes: ['in-person', 'video'],
        certifications: ['Cardiología Clínica – UNMSM', 'ACLS – AHA', 'Ecocardiografía – SPC'],
      },
      updateProfile: (p) => set(s => ({ profile: { ...s.profile, ...p } })),

      resolvedRequestIds: [],
      resolveRequest: (id) => set(s => ({ resolvedRequestIds: [...new Set([...s.resolvedRequestIds, id])] })),

      emittedPrescriptions: [],
      addPrescription: (p) => set(s => ({ emittedPrescriptions: [p, ...s.emittedPrescriptions] })),

      emittedOrders: [],
      addOrder: (o) => set(s => ({ emittedOrders: [o, ...s.emittedOrders] })),
    }),
    { name: 'mediconnect-doctor' }
  )
);
