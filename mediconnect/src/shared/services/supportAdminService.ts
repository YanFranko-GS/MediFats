import { apiClient } from './apiClient';
import { SUPPORT_TICKETS } from '../../data/supportTickets';
export const supportAdminService = {
  async getTickets() { return (await apiClient(() => SUPPORT_TICKETS, { delay: 500 })).data; },
};
