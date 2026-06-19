import { create } from 'zustand';
import type { Doctor, Appointment } from '../types';

interface BookingState {
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedMode: 'in-person' | 'video' | 'chat';
  reason: string;
  step: 0 | 1 | 2 | 3 | 4; // 0=search, 1=profile, 2=datetime, 3=confirm, 4=success
  lastBooking: Appointment | null;
}

interface BookingStore extends BookingState {
  setDoctor: (doctor: Doctor) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setMode: (mode: BookingState['selectedMode']) => void;
  setReason: (reason: string) => void;
  setStep: (step: BookingState['step']) => void;
  setLastBooking: (appt: Appointment) => void;
  reset: () => void;
}

const initial: BookingState = {
  selectedDoctor: null,
  selectedDate: null,
  selectedTime: null,
  selectedMode: 'in-person',
  reason: '',
  step: 0,
  lastBooking: null,
};

export const useBookingStore = create<BookingStore>((set) => ({
  ...initial,
  setDoctor: (selectedDoctor) => set({ selectedDoctor }),
  setDate: (selectedDate) => set({ selectedDate }),
  setTime: (selectedTime) => set({ selectedTime }),
  setMode: (selectedMode) => set({ selectedMode }),
  setReason: (reason) => set({ reason }),
  setStep: (step) => set({ step }),
  setLastBooking: (lastBooking) => set({ lastBooking }),
  reset: () => set(initial),
}));
