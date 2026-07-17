import { apiClient } from './apiClient';
import { HEALTH_METRICS } from '../../data/healthMetrics';
import { FAVORITES } from '../../data/favorites';
import { DOCTORS } from '../../data/doctors';
import type { Doctor } from '../types';

const ALL_METRICS = HEALTH_METRICS as unknown as unknown as any[];
const ALL_FAVORITES = FAVORITES as unknown as unknown as any[];
const ALL_DOCTORS = DOCTORS as unknown as Doctor[];

export const patientService = {
  async getHealthMetrics(patientId: string, months = 12) {
    return (await apiClient(() =>
      ALL_METRICS.filter(m => m.patientId === patientId).slice(-months),
      { delay: 500, errorProbability: 0 }
    )).data;
  },

  async getLatestMetrics(patientId: string) {
    return (await apiClient(() => {
      const metrics = ALL_METRICS.filter(m => m.patientId === patientId);
      return metrics[metrics.length - 1] ?? null;
    }, { delay: 300, errorProbability: 0 })).data;
  },

  async getFavorites(patientId: string): Promise<Doctor[]> {
    return (await apiClient(() => {
      const favDocIds = ALL_FAVORITES
        .filter(f => f.patientId === patientId)
        .map(f => f.doctorId);
      return ALL_DOCTORS.filter(d => favDocIds.includes(d.id));
    }, { delay: 600 })).data;
  },

  async addFavorite(patientId: string, doctorId: string) {
    return (await apiClient(() => ({ patientId, doctorId, addedAt: new Date().toISOString() }),
      { delay: 400, errorProbability: 0.02 }
    )).data;
  },

  async removeFavorite(patientId: string, doctorId: string) {
    return (await apiClient(() => ({ success: true, doctorId }),
      { delay: 300, errorProbability: 0.01 }
    )).data;
  },
};
