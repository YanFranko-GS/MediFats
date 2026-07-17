import { apiClient } from './apiClient';
import { DOCTOR_PATIENTS } from '../../data/doctorPatients';
import { APPOINTMENTS } from '../../data/appointments';
import type { Appointment } from '../types';

const ALL_PATIENTS = DOCTOR_PATIENTS as unknown as unknown as any[];
const ALL_APPTS = APPOINTMENTS as unknown as Appointment[];

export const patientServiceDoctor = {
  async getPatients(doctorId = 'doc-001', filter?: { q?: string; status?: string }) {
    return (await apiClient(() => {
      let res = [...ALL_PATIENTS];
      if (filter?.q) {
        const q = filter.q.toLowerCase();
        res = res.filter(p => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
      }
      if (filter?.status && filter.status !== 'all') {
        res = res.filter(p => p.status === filter.status);
      }
      return res;
    }, { delay: 600 })).data;
  },

  async getPatientById(id: string) {
    return (await apiClient(() => ALL_PATIENTS.find(p => p.id === id) ?? null, { delay: 400 })).data;
  },

  async getPatientHistory(patientId: string, doctorId = 'doc-001') {
    return (await apiClient(() =>
      ALL_APPTS.filter(a => a.patientId === patientId && a.doctorId === doctorId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      { delay: 500 }
    )).data;
  },
};
