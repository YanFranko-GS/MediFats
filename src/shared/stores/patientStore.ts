import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PatientReview {
  id: string;
  appointmentId: string;
  doctorId: string;
  rating: number;
  comment: string;
  date: string;
}

interface PatientStore {
  // Favorites (session-level)
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Senior mode
  seniorMode: boolean;
  setSeniorMode: (v: boolean) => void;

  // Reduce motion
  reduceMotion: boolean;
  setReduceMotion: (v: boolean) => void;

  // Profile form (persisted)
  profile: {
    phone: string;
    address: string;
    bloodType: string;
    birthDate: string;
    eps: string;
    affiliateNum: string;
    emergencyName: string;
    emergencyPhone: string;
    emergencyRelation: string;
    avatarUrl?: string;
  };
  updateProfile: (p: Partial<PatientStore['profile']>) => void;

  // Reviews written by the patient for specific appointments (persisted)
  reviewsByAppointment: Record<string, PatientReview>;
  addOrUpdateReview: (review: PatientReview) => void;
  removeReview: (appointmentId: string) => void;

  // Dismissed/deleted notification ids (persisted, client-side only)
  dismissedNotificationIds: string[];
  dismissNotification: (id: string) => void;
}

export const usePatientStore = create<PatientStore>()(
  persist(
    (set, get) => ({
      favoriteIds: ['doc-001', 'doc-002', 'doc-003'],
      addFavorite: (id) => set(s => ({ favoriteIds: [...new Set([...s.favoriteIds, id])] })),
      removeFavorite: (id) => set(s => ({ favoriteIds: s.favoriteIds.filter(f => f !== id) })),
      isFavorite: (id) => get().favoriteIds.includes(id),

      seniorMode: false,
      setSeniorMode: (seniorMode) => {
        set({ seniorMode });
        if (seniorMode) {
          document.documentElement.style.fontSize = '20px';
          document.documentElement.classList.add('senior-mode');
        } else {
          document.documentElement.style.fontSize = '16px';
          document.documentElement.classList.remove('senior-mode');
        }
      },

      reduceMotion: false,
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),

      profile: {
        phone: '+51 999 123 456',
        address: 'La Molina, Lima',
        bloodType: 'O+',
        birthDate: '1990-03-15',
        eps: 'EsSalud',
        affiliateNum: 'ES-20454812',
        emergencyName: 'Jorge López',
        emergencyPhone: '+51 999 654 321',
        emergencyRelation: 'Esposo',
      },
      updateProfile: (p) => set(s => ({ profile: { ...s.profile, ...p } })),

      reviewsByAppointment: {},
      addOrUpdateReview: (review) => set(s => ({
        reviewsByAppointment: { ...s.reviewsByAppointment, [review.appointmentId]: review },
      })),
      removeReview: (appointmentId) => set(s => {
        const next = { ...s.reviewsByAppointment };
        delete next[appointmentId];
        return { reviewsByAppointment: next };
      }),

      dismissedNotificationIds: [],
      dismissNotification: (id) => set(s => ({
        dismissedNotificationIds: [...new Set([...s.dismissedNotificationIds, id])],
      })),
    }),
    { name: 'mediconnect-patient' }
  )
);
