import { apiClient } from './apiClient';
import { CURRENT_FUNNEL, FUNNEL_DATA } from '../../data/funnelData';
export const funnelAdminService = {
  async getCurrentFunnel() { return (await apiClient(() => CURRENT_FUNNEL, { delay: 400 })).data; },
  async getMonthlyFunnel() { return (await apiClient(() => FUNNEL_DATA, { delay: 500 })).data; },
};
