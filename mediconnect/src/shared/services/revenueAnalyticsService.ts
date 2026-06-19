import { apiClient } from './apiClient';
import { MONTHLY_METRICS } from '../../data/metrics';

const M = MONTHLY_METRICS as unknown as any[];
const lastMetric = M[M.length - 1];

export const revenueAnalyticsService = {
  async getExecutiveKPIs() {
    return (await apiClient(() => {
      const mrr = lastMetric.revenue;
      const arr = mrr * 12;
      const totalPatients = 180;
      return {
        mrr, arr,
        arpu: Math.round(mrr / totalPatients),
        ltv: Math.round((mrr / totalPatients) * 24),
        cac: 38,
        nps: 72,
        churnRate: 4.2,
        retentionRate: 95.8,
        activeUsersToday: 247,
        activeDoctorsToday: 34,
        consultationsToday: 89,
        conversionRate: 7.8,
        avgSatisfaction: 4.7,
        avgBookingTime: 3.2,
        mrrGoal: 55000,
        mrrProgress: Math.round((mrr / 55000) * 100),
      };
    }, { errorProbability: 0, delay: 400 })).data;
  },
  async getMRRHistory() {
    return (await apiClient(() => M.map((m: any, i: number) => ({
      month: m.month.slice(5),
      mrr: m.revenue,
      arr: m.revenue * 12,
      arpu: Math.round(m.revenue / (140 + i * 3)),
    })), { delay: 500 })).data;
  },
};
