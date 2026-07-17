import { apiClient } from './apiClient';
import { APPOINTMENTS } from '../../data/appointments';
import type { Appointment } from '../types';

const STORAGE_KEY = 'mediconnect_appointments_v4';

const getStore = (): Appointment[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading appointments in scheduleService', e);
  }
  return [...(APPOINTMENTS as unknown as Appointment[])];
};

function getDocId(userId: string): string {
  // Map doctor user ID to doctor ID
  if (userId === 'u-doctor-1') return 'doc-001';
  return 'doc-001';
}

export const scheduleService = {
  async getByDay(doctorUserId: string, date: string) {
    return (await apiClient(() => {
      const docId = getDocId(doctorUserId);
      const store = getStore();
      return store.filter(a => a.doctorId === docId && a.date.startsWith(date))
        .sort((a, b) => a.time.localeCompare(b.time));
    }, { delay: 400 })).data;
  },

  async getByWeek(doctorUserId: string, startDate: string, endDate: string) {
    return (await apiClient(() => {
      const docId = getDocId(doctorUserId);
      const store = getStore();
      return store.filter(a => {
        if (a.doctorId !== docId) return false;
        return a.date >= startDate && a.date <= endDate;
      }).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    }, { delay: 500 })).data;
  },

  async getTodayAppointments(doctorUserId: string) {
    return (await apiClient(() => {
      const docId = getDocId(doctorUserId);
      const today = new Date().toISOString().slice(0, 10);
      const store = getStore();
      return store.filter(a => a.doctorId === docId && a.date.startsWith(today))
        .sort((a, b) => a.time.localeCompare(b.time));
    }, { delay: 300, errorProbability: 0 })).data;
  },
};
