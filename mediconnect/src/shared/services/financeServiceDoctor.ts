import { apiClient } from './apiClient';
import { FINANCE_DOCTOR } from '../../data/financeDoctor';
import { APPOINTMENTS } from '../../data/appointments';
import type { Appointment } from '../types';

const ALL_FINANCE = FINANCE_DOCTOR as unknown as unknown as any[];
const ALL_APPTS = APPOINTMENTS as unknown as Appointment[];

export const financeServiceDoctor = {
  async getMonthly(months = 12) {
    return (await apiClient(() => ALL_FINANCE.slice(-months), { delay: 500, errorProbability: 0 })).data;
  },

  async getKPIs(doctorId = 'doc-001') {
    return (await apiClient(() => {
      const last = ALL_FINANCE[ALL_FINANCE.length - 1];
      const prev = ALL_FINANCE[ALL_FINANCE.length - 2];
      const yearData = ALL_FINANCE.slice(-12);
      const yearRevenue = yearData.reduce((s: number, m: any) => s + m.revenue, 0);
      const docAppts = ALL_APPTS.filter(a => a.doctorId === doctorId && a.status === 'completed');
      return {
        monthRevenue: last.revenue,
        monthRevenueChange: parseFloat((((last.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)),
        yearRevenue,
        monthConsultations: last.consultations,
        avgTicket: last.avgTicket,
        cancellationRate: parseFloat(((last.cancellations / last.consultations) * 100).toFixed(1)),
        totalPatients: docAppts.length,
        videoconsultations: last.videoconsultations,
      };
    }, { delay: 400, errorProbability: 0 })).data;
  },

  async getTransactions(doctorId = 'doc-001', page = 1, pageSize = 15) {
    return (await apiClient(() => {
      const completed = ALL_APPTS
        .filter(a => a.doctorId === doctorId && a.status === 'completed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const start = (page - 1) * pageSize;
      return { items: completed.slice(start, start + pageSize), total: completed.length };
    }, { delay: 600 })).data;
  },
};
