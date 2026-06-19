import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export function useAdminKPIs() {
  return useQuery({
    queryKey: ['admin', 'kpis'],
    queryFn: () => adminService.getKPIs(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMonthlyMetrics(months = 12) {
  return useQuery({
    queryKey: ['admin', 'metrics', months],
    queryFn: () => adminService.getMonthlyMetrics(months),
  });
}

export function useDoctorPerformance() {
  return useQuery({
    queryKey: ['admin', 'doctor-performance'],
    queryFn: () => adminService.getDoctorPerformance(),
  });
}

export function useSpecialtyBreakdown() {
  return useQuery({
    queryKey: ['admin', 'specialty-breakdown'],
    queryFn: () => adminService.getSpecialtyBreakdown(),
  });
}

export function useAppointmentFunnel() {
  return useQuery({
    queryKey: ['admin', 'funnel'],
    queryFn: () => adminService.getAppointmentFunnel(),
  });
}

export function useDemandHeatmap() {
  return useQuery({
    queryKey: ['admin', 'heatmap'],
    queryFn: () => adminService.getDemandHeatmap(),
  });
}

export function useRecentActivity(limit = 20) {
  return useQuery({
    queryKey: ['admin', 'activity', limit],
    queryFn: () => adminService.getRecentActivity(limit),
    refetchInterval: 30_000, // auto-refresh every 30s
  });
}

export function useUserGrowth() {
  return useQuery({
    queryKey: ['admin', 'user-growth'],
    queryFn: () => adminService.getUserGrowth(),
  });
}

export function useRetentionMetrics() {
  return useQuery({
    queryKey: ['admin', 'retention'],
    queryFn: () => adminService.getRetentionMetrics(),
  });
}
