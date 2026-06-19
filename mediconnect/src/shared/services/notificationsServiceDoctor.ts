import { apiClient } from './apiClient';
import { NOTIFICATIONS_DOCTOR } from '../../data/notificationsDoctor';

const store: any[] = [...(NOTIFICATIONS_DOCTOR as unknown as unknown as any[])];

export const notificationsServiceDoctor = {
  async getAll(doctorId: string, filter?: string) {
    return (await apiClient(() => {
      let res = store.filter(n => n.doctorId === doctorId);
      if (filter === 'unread') res = res.filter(n => !n.read);
      if (filter === 'important') res = res.filter(n => n.important);
      return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, { delay: 400, errorProbability: 0 })).data;
  },

  async getUnreadCount(doctorId: string) {
    return (await apiClient(() => store.filter(n => n.doctorId === doctorId && !n.read).length,
      { delay: 200, errorProbability: 0 }
    )).data;
  },

  async markRead(id: string) {
    return (await apiClient(() => {
      const n = store.find(n => n.id === id);
      if (n) n.read = true;
      return { success: true };
    }, { delay: 200, errorProbability: 0 })).data;
  },

  async markAllRead(doctorId: string) {
    return (await apiClient(() => {
      store.filter(n => n.doctorId === doctorId).forEach(n => { n.read = true; });
      return { success: true };
    }, { delay: 300, errorProbability: 0 })).data;
  },
};
