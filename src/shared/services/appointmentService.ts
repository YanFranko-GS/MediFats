import { apiClient } from './apiClient';
import { APPOINTMENTS } from '../../data/appointments';
import type { Appointment, AppointmentStatus } from '../types';
import { getAppointmentDateTime } from '../utils';

const STORAGE_KEY = 'mediconnect_appointments_v4';

const getStore = (): Appointment[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading appointments', e);
  }
  return [...(APPOINTMENTS as unknown as Appointment[])];
};

const saveAppointments = (store: Appointment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Error saving appointments', e);
  }
};

export const appointmentService = {
  async getByPatient(patientId: string, status?: AppointmentStatus): Promise<Appointment[]> {
    return (await apiClient(() => {
      const store = getStore();
      let results = store.filter((a) => a.patientId === patientId);
      if (status) results = results.filter((a) => a.status === status);
      return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    })).data;
  },

  async getByDoctor(doctorId: string, status?: AppointmentStatus): Promise<Appointment[]> {
    return (await apiClient(() => {
      const store = getStore();
      let results = store.filter((a) => a.doctorId === doctorId);
      if (status) results = results.filter((a) => a.status === status);
      return results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    })).data;
  },

  async getUpcoming(patientId: string): Promise<Appointment[]> {
    return (await apiClient(() => {
      const store = getStore();
      const now = new Date();
      return store
        .filter((a) => a.patientId === patientId && a.status === 'scheduled' && new Date(a.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 10);
    })).data;
  },

  async getById(id: string): Promise<Appointment | null> {
    return (await apiClient(() => {
      const store = getStore();
      return store.find((a) => a.id === id) ?? null;
    }, { delay: 300 })).data;
  },

  async create(data: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    return (await apiClient(() => {
      const store = getStore();
      const newAppt: Appointment = {
        ...data,
        id: `appt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      store.unshift(newAppt);
      saveAppointments(store);
      return newAppt;
    }, { delay: 800, errorProbability: 0.02 })).data;
  },

  async cancel(id: string, reason?: string): Promise<Appointment> {
    return (await apiClient(() => {
      const store = getStore();
      const idx = store.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error('Cita no encontrada');
      store[idx] = {
        ...store[idx],
        status: 'cancelled',
        cancelReason: reason,
      };
      saveAppointments(store);
      return store[idx];
    }, { delay: 600, errorProbability: 0.02 })).data;
  },

  async reschedule(id: string, newDate: string, newTime: string): Promise<Appointment> {
    return (await apiClient(() => {
      const store = getStore();
      const idx = store.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error('Cita no encontrada');
      store[idx] = {
        ...store[idx],
        date: newDate,
        time: newTime,
        status: 'rescheduled',
      };
      saveAppointments(store);
      return store[idx];
    }, { delay: 700 })).data;
  },

  async getAll(page = 1, pageSize = 20): Promise<{ items: Appointment[]; total: number }> {
    return (await apiClient(() => {
      const store = getStore();
      const start = (page - 1) * pageSize;
      return {
        items: store.slice(start, start + pageSize),
        total: store.length,
      };
    })).data;
  },

  async getStats(patientId: string): Promise<{
    total: number;
    completed: number;
    cancelled: number;
    upcoming: number;
  }> {
    return (await apiClient(() => {
      const store = getStore();
      const mine = store.filter((a) => a.patientId === patientId);
      const now = new Date();
      return {
        total: mine.length,
        completed: mine.filter((a) => a.status === 'completed').length,
        cancelled: mine.filter((a) => a.status === 'cancelled').length,
        upcoming: mine.filter((a) => a.status === 'scheduled' && getAppointmentDateTime(a) >= now).length,
      };
    }, { delay: 400, errorProbability: 0 })).data;
  },
};
