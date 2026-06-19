import { apiClient } from './apiClient';
import { MEDICATIONS } from '../../data/medications';

const ALL = MEDICATIONS as unknown as unknown as any[];

export const medicationService = {
  async getByPatient(patientId: string, status?: string) {
    return (await apiClient(() => {
      let res = ALL.filter(m => m.patientId === patientId);
      if (status) res = res.filter(m => m.status === status);
      return res.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }, { delay: 600 })).data;
  },

  async getById(id: string) {
    return (await apiClient(() => ALL.find(m => m.id === id) ?? null, { delay: 300 })).data;
  },

  async getActive(patientId: string) {
    return (await apiClient(() =>
      ALL.filter(m => m.patientId === patientId && m.status === 'active'),
      { delay: 400, errorProbability: 0 }
    )).data;
  },
};
