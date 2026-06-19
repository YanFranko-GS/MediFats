import { apiClient } from './apiClient';
import { HEALTH_METRICS } from '../../data/healthMetrics';

const ALL = HEALTH_METRICS as unknown as unknown as any[];

export const healthService = {
  async getHistory(patientId: string, months = 12) {
    return (await apiClient(() =>
      ALL.filter(m => m.patientId === patientId).slice(-months),
      { delay: 600, errorProbability: 0 }
    )).data;
  },

  async getLatest(patientId: string) {
    return (await apiClient(() => {
      const items = ALL.filter(m => m.patientId === patientId);
      return items[items.length - 1] ?? null;
    }, { delay: 300, errorProbability: 0 })).data;
  },

  getBMI(weight: number, heightM: number) {
    const bmi = weight / (heightM * heightM);
    const category =
      bmi < 18.5 ? { label: 'Bajo peso', color: 'text-blue-500' } :
      bmi < 25   ? { label: 'Normal', color: 'text-green-500' } :
      bmi < 30   ? { label: 'Sobrepeso', color: 'text-amber-500' } :
                   { label: 'Obesidad', color: 'text-red-500' };
    return { value: parseFloat(bmi.toFixed(1)), ...category };
  },
};
