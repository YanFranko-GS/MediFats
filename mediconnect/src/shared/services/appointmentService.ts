import { apiClient } from './apiClient';
import { APPOINTMENTS } from '../../data/appointments';
import type { Appointment, AppointmentStatus } from '../types';

// In-memory mutable state (simulates a real DB for this session)
const appointmentStore: Appointment[] = [...(APPOINTMENTS as unknown as Appointment[])];

export const appointmentService = {
  async getByPatient(patientId: string, status?: AppointmentStatus): Promise<Appointment[]> {
    return (await apiClient(() => {
      let results = appointmentStore.filter((a) => a.patientId === patientId);
      if (status) results = results.filter((a) => a.status === status);
      return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    })).data;
  },

  async getByDoctor(doctorId: string, status?: AppointmentStatus): Promise<Appointment[]> {
    return (await apiClient(() => {
      let results = appointmentStore.filter((a) => a.doctorId === doctorId);
      if (status) results = results.filter((a) => a.status === status);
      return results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    })).data;
  },

  async getUpcoming(patientId: string): Promise<Appointment[]> {
    return (await apiClient(() => {
      const now = new Date();
      return appointmentStore
        .filter((a) => a.patientId === patientId && a.status === 'scheduled' && new Date(a.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 10);
    })).data;
  },

  async getById(id: string): Promise<Appointment | null> {
    return (await apiClient(() => {
      return appointmentStore.find((a) => a.id === id) ?? null;
    }, { delay: 300 })).data;
  },

  async create(data: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    return (await apiClient(() => {
      const newAppt: Appointment = {
        ...data,
        id: `appt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      appointmentStore.unshift(newAppt);
      return newAppt;
    }, { delay: 800, errorProbability: 0.02 })).data;
  },

  async cancel(id: string, reason?: string): Promise<Appointment> {
    return (await apiClient(() => {
      const idx = appointmentStore.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error('Cita no encontrada');
      appointmentStore[idx] = {
        ...appointmentStore[idx],
        status: 'cancelled',
        cancelReason: reason,
      };
      return appointmentStore[idx];
    }, { delay: 600, errorProbability: 0.02 })).data;
  },

  async reschedule(id: string, newDate: string, newTime: string): Promise<Appointment> {
    return (await apiClient(() => {
      const idx = appointmentStore.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error('Cita no encontrada');
      appointmentStore[idx] = {
        ...appointmentStore[idx],
        date: newDate,
        time: newTime,
        status: 'rescheduled',
      };
      return appointmentStore[idx];
    }, { delay: 700 })).data;
  },

  async getAll(page = 1, pageSize = 20): Promise<{ items: Appointment[]; total: number }> {
    return (await apiClient(() => {
      const start = (page - 1) * pageSize;
      return {
        items: appointmentStore.slice(start, start + pageSize),
        total: appointmentStore.length,
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
      const mine = appointmentStore.filter((a) => a.patientId === patientId);
      const now = new Date();
      return {
        total: mine.length,
        completed: mine.filter((a) => a.status === 'completed').length,
        cancelled: mine.filter((a) => a.status === 'cancelled').length,
        upcoming: mine.filter((a) => a.status === 'scheduled' && new Date(a.date) >= now).length,
      };
    }, { delay: 400, errorProbability: 0 })).data;
  },
};
