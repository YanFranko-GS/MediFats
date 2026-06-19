import { apiClient } from './apiClient';
import { GLOBAL_SETTINGS } from '../../data/globalSettings';
export const settingsAdminService = {
  async getSettings() { return (await apiClient(() => GLOBAL_SETTINGS, { delay: 200 })).data; },
};
