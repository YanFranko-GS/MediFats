import { apiClient } from './apiClient';
import { NOTIFICATIONS } from '../../data/notifications';

const notifStore: any[] = [...(NOTIFICATIONS as unknown as unknown as any[])];

export const notificationsService = {
  async getByPatient(patientId: string, filter?: 'all' | 'unread' | 'important') {
    return (await apiClient(() => {
      let res = notifStore.filter(n => n.patientId === patientId);
      if (filter === 'unread') res = res.filter(n => !n.read);
      if (filter === 'important') res = res.filter(n => n.important);
      return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, { delay: 400, errorProbability: 0 })).data;
  },

  async getUnreadCount(patientId: string) {
    return (await apiClient(() =>
      notifStore.filter(n => n.patientId === patientId && !n.read).length,
      { delay: 200, errorProbability: 0 }
    )).data;
  },

  async markAsRead(notifId: string) {
    return (await apiClient(() => {
      const n = notifStore.find(n => n.id === notifId);
      if (n) n.read = true;
      return { success: true };
    }, { delay: 200, errorProbability: 0 })).data;
  },

  async markAllRead(patientId: string) {
    return (await apiClient(() => {
      notifStore.filter(n => n.patientId === patientId).forEach(n => { n.read = true; });
      return { success: true };
    }, { delay: 300, errorProbability: 0 })).data;
  },
};
