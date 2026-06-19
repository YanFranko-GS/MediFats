import { apiClient } from './apiClient';
import { REQUESTS } from '../../data/requests';

const reqStore: any[] = [...(REQUESTS as unknown as unknown as any[])];

export const requestsService = {
  async getPending(doctorId = 'doc-001') {
    return (await apiClient(() =>
      reqStore.filter(r => r.doctorId === doctorId && r.status === 'pending')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      { delay: 400, errorProbability: 0 }
    )).data;
  },

  async getAll(doctorId = 'doc-001') {
    return (await apiClient(() =>
      reqStore.filter(r => r.doctorId === doctorId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      { delay: 500 }
    )).data;
  },

  async resolve(id: string, action: 'approved' | 'rejected', _reason?: string) {
    return (await apiClient(() => {
      const idx = reqStore.findIndex(r => r.id === id);
      if (idx !== -1) reqStore[idx] = { ...reqStore[idx], status: 'resolved', resolution: action };
      return reqStore[idx];
    }, { delay: 600, errorProbability: 0.01 })).data;
  },
};
