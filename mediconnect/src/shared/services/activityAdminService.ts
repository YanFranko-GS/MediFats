import { apiClient } from './apiClient';
import { ACTIVITY_FEED } from '../../data/activityFeed';
export const activityAdminService = {
  async getActivityFeed(limit = 50) {
    return (await apiClient(() => ACTIVITY_FEED.slice(0, limit), { delay: 300 })).data;
  },
};
