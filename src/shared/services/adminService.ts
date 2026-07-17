import { apiClient } from './apiClient';
import { APPOINTMENTS } from '../../data/appointments';
import { MONTHLY_METRICS } from '../../data/metrics';
import { DOCTORS } from '../../data/doctors';
import { USERS } from '../../data/users';
import { REVIEWS } from '../../data/reviews';
import type { Appointment, Doctor, MonthlyMetric, AdminKPIs, Review } from '../types';

const ALL_APPTS = APPOINTMENTS as unknown as Appointment[];
const ALL_DOCTORS = DOCTORS as unknown as Doctor[];
const ALL_USERS = USERS as unknown as Array<{ id: string; role: string; name: string; email: string; createdAt: string }>;
const ALL_METRICS = MONTHLY_METRICS as unknown as MonthlyMetric[];
const ALL_REVIEWS = REVIEWS as unknown as Review[];

export const adminService = {
  async getKPIs(): Promise<AdminKPIs> {
    return (await apiClient(() => {
      const last = ALL_METRICS[ALL_METRICS.length - 1];
      const prev = ALL_METRICS[ALL_METRICS.length - 2];
      const totalRevenue = ALL_METRICS.reduce((s, m) => s + m.revenue, 0);
      const totalAppts = ALL_APPTS.length;
      const cancelled = ALL_APPTS.filter((a) => a.status === 'cancelled').length;
      const completed = ALL_APPTS.filter((a) => a.status === 'completed').length;
      const avgRating = ALL_REVIEWS.reduce((s, r) => s + r.rating, 0) / ALL_REVIEWS.length;

      return {
        totalRevenue,
        totalAppointments: totalAppts,
        totalPatients: ALL_USERS.filter((u) => u.role === 'patient').length,
        totalDoctors: ALL_DOCTORS.length,
        avgRating: parseFloat(avgRating.toFixed(2)),
        cancellationRate: parseFloat(((cancelled / totalAppts) * 100).toFixed(1)),
        completionRate: parseFloat(((completed / totalAppts) * 100).toFixed(1)),
        revenueGrowth: parseFloat((((last.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)),
        appointmentGrowth: parseFloat((((last.appointments - prev.appointments) / prev.appointments) * 100).toFixed(1)),
      };
    }, { errorProbability: 0 })).data;
  },

  async getMonthlyMetrics(months = 12): Promise<MonthlyMetric[]> {
    return (await apiClient(() => {
      return ALL_METRICS.slice(-months);
    }, { errorProbability: 0.01 })).data;
  },

  async getDoctorPerformance(): Promise<Array<{
    doctorId: string;
    doctorName: string;
    specialty: string;
    avatar: string;
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    avgRating: number;
    revenue: number;
  }>> {
    return (await apiClient(() => {
      return ALL_DOCTORS.slice(0, 20).map((doc) => {
        const docAppts = ALL_APPTS.filter((a) => a.doctorId === doc.id);
        const docReviews = ALL_REVIEWS.filter((r) => r.doctorId === doc.id);
        const avgRating = docReviews.length
          ? docReviews.reduce((s, r) => s + r.rating, 0) / docReviews.length
          : doc.rating;
        return {
          doctorId: doc.id,
          doctorName: doc.name,
          specialty: doc.specialty,
          avatar: doc.avatar,
          totalAppointments: docAppts.length,
          completedAppointments: docAppts.filter((a) => a.status === 'completed').length,
          cancelledAppointments: docAppts.filter((a) => a.status === 'cancelled').length,
          avgRating: parseFloat(avgRating.toFixed(2)),
          revenue: docAppts.filter((a) => a.status === 'completed').length * doc.price,
        };
      }).sort((a, b) => b.totalAppointments - a.totalAppointments);
    })).data;
  },

  async getSpecialtyBreakdown(): Promise<Array<{ specialty: string; count: number; revenue: number }>> {
    return (await apiClient(() => {
      const map: Record<string, { count: number; revenue: number }> = {};
      ALL_APPTS.filter((a) => a.status === 'completed').forEach((a) => {
        if (!map[a.doctorSpecialty]) map[a.doctorSpecialty] = { count: 0, revenue: 0 };
        map[a.doctorSpecialty].count++;
        map[a.doctorSpecialty].revenue += a.price;
      });
      return Object.entries(map)
        .map(([specialty, v]) => ({ specialty, ...v }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    })).data;
  },

  async getAppointmentFunnel(): Promise<Array<{ stage: string; count: number; percentage: number }>> {
    return (await apiClient(() => {
      const total = ALL_APPTS.length;
      const completed = ALL_APPTS.filter((a) => a.status === 'completed').length;
      const cancelled = ALL_APPTS.filter((a) => a.status === 'cancelled').length;
      const scheduled = ALL_APPTS.filter((a) => a.status === 'scheduled').length;

      const stages = [
        { stage: 'Visitas a perfiles', count: Math.round(total * 3.2) },
        { stage: 'Búsquedas realizadas', count: Math.round(total * 2.1) },
        { stage: 'Reservas iniciadas', count: Math.round(total * 1.4) },
        { stage: 'Reservas confirmadas', count: total },
        { stage: 'Consultas completadas', count: completed },
      ];

      return stages.map((s) => ({
        ...s,
        percentage: parseFloat(((s.count / stages[0].count) * 100).toFixed(1)),
      }));
    }, { errorProbability: 0.01 })).data;
  },

  async getDemandHeatmap(): Promise<Array<{ day: string; hour: string; value: number }>> {
    return (await apiClient(() => {
      const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
      const data: Array<{ day: string; hour: string; value: number }> = [];
      DAYS.forEach((day, di) => {
        HOURS.forEach((hour, hi) => {
          // Peaks: midweek, mid-morning
          const dayPeak = di === 2 ? 1.3 : di >= 4 ? 0.6 : 1.0;
          const hourPeak = hi >= 1 && hi <= 3 ? 1.4 : hi >= 6 ? 0.8 : 1.0;
          data.push({
            day,
            hour,
            value: Math.round(15 * dayPeak * hourPeak + Math.random() * 5),
          });
        });
      });
      return data;
    }, { delay: 400 })).data;
  },

  async getRecentActivity(limit = 20): Promise<Array<{
    id: string;
    type: string;
    description: string;
    user: string;
    timestamp: string;
    meta?: string;
  }>> {
    return (await apiClient(() => {
      const recent = ALL_APPTS
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      return recent.map((a) => ({
        id: a.id,
        type: a.status === 'cancelled' ? 'cancel' : a.status === 'completed' ? 'complete' : 'book',
        description: a.status === 'cancelled'
          ? `Cita cancelada con ${a.doctorName}`
          : a.status === 'completed'
          ? `Consulta completada con ${a.doctorName}`
          : `Nueva cita reservada con ${a.doctorName}`,
        user: a.patientName,
        timestamp: a.createdAt,
        meta: a.doctorSpecialty,
      }));
    }, { delay: 500 })).data;
  },

  async getUserGrowth(): Promise<Array<{ month: string; patients: number; doctors: number; total: number }>> {
    return (await apiClient(() => {
      return ALL_METRICS.map((m, i) => ({
        month: m.month,
        patients: m.newPatients,
        doctors: m.newDoctors,
        total: m.newPatients + m.newDoctors,
      }));
    }, { errorProbability: 0 })).data;
  },

  async getRetentionMetrics(): Promise<{
    returningPatients: number;
    newPatients: number;
    churnRate: number;
    avgSessionsPerPatient: number;
  }> {
    return (await apiClient(() => {
      const patientApptCounts: Record<string, number> = {};
      ALL_APPTS.forEach((a) => {
        patientApptCounts[a.patientId] = (patientApptCounts[a.patientId] || 0) + 1;
      });
      const returning = Object.values(patientApptCounts).filter((c) => c > 1).length;
      const total = Object.keys(patientApptCounts).length;
      return {
        returningPatients: returning,
        newPatients: total - returning,
        churnRate: parseFloat(((1 - returning / total) * 100).toFixed(1)),
        avgSessionsPerPatient: parseFloat(
          (ALL_APPTS.length / total).toFixed(1)
        ),
      };
    }, { errorProbability: 0 })).data;
  },
};
