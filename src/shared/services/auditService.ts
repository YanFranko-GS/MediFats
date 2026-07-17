import { apiClient } from './apiClient';
import { AUDIT_LOGS } from '../../data/auditLogs';
export const auditService = {
  async getAuditLogs(): Promise<typeof AUDIT_LOGS> {
    return (await apiClient(() => AUDIT_LOGS, { errorProbability: 0.01, delay: 500 })).data;
  },
};
