import { apiClient } from './apiClient';
import { LOGIN_ATTEMPTS, ACTIVE_SESSIONS, SECURITY_ALERTS } from '../../data/securityLogs';
export const securityAdminService = {
  async getLoginAttempts() { return (await apiClient(() => LOGIN_ATTEMPTS, { delay: 400 })).data; },
  async getActiveSessions() { return (await apiClient(() => ACTIVE_SESSIONS, { delay: 300 })).data; },
  async getSecurityAlerts() { return (await apiClient(() => SECURITY_ALERTS, { delay: 300 })).data; },
};
