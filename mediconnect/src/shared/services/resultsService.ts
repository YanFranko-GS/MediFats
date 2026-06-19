import { apiClient } from './apiClient';
import { MEDICAL_RESULTS } from '../../data/results';

const ALL = MEDICAL_RESULTS as unknown as unknown as any[];

export const resultsService = {
  async getByPatient(patientId: string, category?: string) {
    return (await apiClient(() => {
      let res = ALL.filter(r => r.patientId === patientId);
      if (category) res = res.filter(r => r.category === category);
      return res.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, { delay: 700 })).data;
  },

  async getById(id: string) {
    return (await apiClient(() => ALL.find(r => r.id === id) ?? null, { delay: 400 })).data;
  },

  async getPending(patientId: string) {
    return (await apiClient(() =>
      ALL.filter(r => r.patientId === patientId && r.status !== 'available'),
      { delay: 300, errorProbability: 0 }
    )).data;
  },
};
