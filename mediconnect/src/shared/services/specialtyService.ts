import { apiClient } from './apiClient';
import { SPECIALTIES } from '../../data/specialties';
import type { Specialty } from '../types';

const ALL_SPECIALTIES = SPECIALTIES as unknown as Specialty[];

export const specialtyService = {
  async getAll(): Promise<Specialty[]> {
    return (await apiClient(() => ALL_SPECIALTIES, { errorProbability: 0.01 })).data;
  },

  async getById(id: string): Promise<Specialty | null> {
    return (await apiClient(() => {
      return ALL_SPECIALTIES.find((s) => s.id === id) ?? null;
    }, { delay: 300 })).data;
  },

  async getByName(name: string): Promise<Specialty | null> {
    return (await apiClient(() => {
      return ALL_SPECIALTIES.find((s) => s.name.toLowerCase() === name.toLowerCase()) ?? null;
    }, { delay: 200 })).data;
  },
};
