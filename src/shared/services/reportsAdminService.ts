import { apiClient } from './apiClient';
import { REPORT_DEFINITIONS, SCHEDULED_REPORTS } from '../../data/reports';
export const reportsAdminService = {
  async getReports() { return (await apiClient(() => REPORT_DEFINITIONS, { delay: 300 })).data; },
  async getScheduled() { return (await apiClient(() => SCHEDULED_REPORTS, { delay: 300 })).data; },
};
