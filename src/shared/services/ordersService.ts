import { apiClient } from './apiClient';
import { ORDERS } from '../../data/orders';
import { LAB_RESULTS } from '../../data/labResults';

const orderStore: any[] = [...(ORDERS as unknown as unknown as any[])];
const ALL_RESULTS = LAB_RESULTS as unknown as unknown as any[];

export const ordersService = {
  async getOrders(doctorId = 'doc-001', status?: string) {
    return (await apiClient(() => {
      let res = orderStore.filter(o => o.doctorId === doctorId);
      if (status && status !== 'all') res = res.filter(o => o.status === status);
      return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, { delay: 600 })).data;
  },

  async createOrder(order: any) {
    return (await apiClient(() => {
      const newOrder = { ...order, id: `order-${Date.now()}`, createdAt: new Date().toISOString(), status: 'pending' };
      orderStore.unshift(newOrder);
      return newOrder;
    }, { delay: 700, errorProbability: 0.02 })).data;
  },

  async cancelOrder(id: string) {
    return (await apiClient(() => {
      const idx = orderStore.findIndex(o => o.id === id);
      if (idx !== -1) orderStore[idx] = { ...orderStore[idx], status: 'cancelled' };
      return orderStore[idx];
    }, { delay: 400 })).data;
  },

  async getLabResults(doctorId = 'doc-001') {
    return (await apiClient(() =>
      ALL_RESULTS.filter(r => r.doctorId === doctorId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      { delay: 500 }
    )).data;
  },
};
