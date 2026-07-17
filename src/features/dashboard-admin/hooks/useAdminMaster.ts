import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userManagementService } from '../../../shared/services/userManagementService';
import { doctorManagementService } from '../../../shared/services/doctorManagementService';
import { auditService } from '../../../shared/services/auditService';
import { securityAdminService } from '../../../shared/services/securityAdminService';
import { supportAdminService } from '../../../shared/services/supportAdminService';
import { activityAdminService } from '../../../shared/services/activityAdminService';
import { revenueAnalyticsService } from '../../../shared/services/revenueAnalyticsService';
import { funnelAdminService } from '../../../shared/services/funnelAdminService';
import { heatmapAdminService } from '../../../shared/services/heatmapAdminService';
import { reportsAdminService } from '../../../shared/services/reportsAdminService';
import { moderationService } from '../../../shared/services/moderationService';
import { settingsAdminService } from '../../../shared/services/settingsAdminService';
import { useAdminMasterStore } from '../store/adminMasterStore';

// ─── USERS ───────────────────────────────────────────────────────────────────
export function useAdminUsers() {
  const { suspendedUserIds, blockedUserIds } = useAdminMasterStore();
  const q = useQuery({ queryKey: ['admin','users'], queryFn: () => userManagementService.getUsers() });
  const users = (q.data || []).map(u => ({
    ...u,
    status: blockedUserIds.includes(u.id) ? 'blocked' as const
           : suspendedUserIds.includes(u.id) ? 'suspended' as const
           : 'active' as const,
  }));
  return { ...q, data: users };
}

// ─── DOCTORS ─────────────────────────────────────────────────────────────────
export function useAdminDoctors() {
  const { approvedDoctorIds, rejectedDoctorIds, suspendedDoctorIds } = useAdminMasterStore();
  const q = useQuery({ queryKey: ['admin','doctors'], queryFn: () => doctorManagementService.getDoctors() });
  const doctors = (q.data || []).map(d => ({
    ...d,
    status: suspendedDoctorIds.includes(d.id) ? 'suspended' as const
           : rejectedDoctorIds.includes(d.id) ? 'blocked' as const
           : approvedDoctorIds.includes(d.id) ? 'approved' as const
           : d.status,
  }));
  return { ...q, data: doctors };
}

// ─── AUDIT ───────────────────────────────────────────────────────────────────
export function useAuditLogs() {
  return useQuery({ queryKey: ['admin','audit'], queryFn: () => auditService.getAuditLogs(), staleTime: 30000 });
}

// ─── SECURITY ────────────────────────────────────────────────────────────────
export function useLoginAttempts() {
  return useQuery({ queryKey: ['admin','security','attempts'], queryFn: () => securityAdminService.getLoginAttempts() });
}
export function useActiveSessions() {
  const { closedSessionIds } = useAdminMasterStore();
  const q = useQuery({ queryKey: ['admin','security','sessions'], queryFn: () => securityAdminService.getActiveSessions() });
  return { ...q, data: (q.data || []).filter(s => !closedSessionIds.includes(s.id)) };
}
export function useSecurityAlerts() {
  return useQuery({ queryKey: ['admin','security','alerts'], queryFn: () => securityAdminService.getSecurityAlerts() });
}

// ─── SUPPORT ─────────────────────────────────────────────────────────────────
export function useSupportTickets() {
  const { resolvedTicketIds } = useAdminMasterStore();
  const q = useQuery({ queryKey: ['admin','support'], queryFn: () => supportAdminService.getTickets() });
  const tickets = (q.data || []).map(t => ({
    ...t, status: resolvedTicketIds.includes(t.id) ? 'resolved' as const : t.status,
  }));
  return { ...q, data: tickets };
}

// ─── ACTIVITY ────────────────────────────────────────────────────────────────
export function useActivityFeed(limit = 50) {
  return useQuery({ queryKey: ['admin','activity', limit], queryFn: () => activityAdminService.getActivityFeed(limit), refetchInterval: 15000 });
}

// ─── EXECUTIVE KPIs ──────────────────────────────────────────────────────────
export function useExecutiveKPIs() {
  return useQuery({ queryKey: ['admin','executive-kpis'], queryFn: () => revenueAnalyticsService.getExecutiveKPIs(), staleTime: 60000 });
}
export function useMRRHistory() {
  return useQuery({ queryKey: ['admin','mrr-history'], queryFn: () => revenueAnalyticsService.getMRRHistory() });
}

// ─── FUNNEL ──────────────────────────────────────────────────────────────────
export function useFunnelData() {
  return useQuery({ queryKey: ['admin','funnel'], queryFn: () => funnelAdminService.getCurrentFunnel() });
}
export function useMonthlyFunnel() {
  return useQuery({ queryKey: ['admin','funnel-monthly'], queryFn: () => funnelAdminService.getMonthlyFunnel() });
}

// ─── HEATMAP ─────────────────────────────────────────────────────────────────
export function useScheduleHeatmap() {
  return useQuery({ queryKey: ['admin','heatmap-schedule'], queryFn: () => heatmapAdminService.getScheduleHeatmap() });
}
export function useSpecialtyHeatmap() {
  return useQuery({ queryKey: ['admin','heatmap-specialty'], queryFn: () => heatmapAdminService.getSpecialtyHeatmap() });
}

// ─── REPORTS ─────────────────────────────────────────────────────────────────
export function useReportDefinitions() {
  return useQuery({ queryKey: ['admin','reports'], queryFn: () => reportsAdminService.getReports() });
}
export function useScheduledReports() {
  return useQuery({ queryKey: ['admin','scheduled-reports'], queryFn: () => reportsAdminService.getScheduled() });
}

// ─── MODERATION ──────────────────────────────────────────────────────────────
export function usePendingReviews() {
  const { approvedReviewIds, hiddenReviewIds, deletedReviewIds } = useAdminMasterStore();
  const q = useQuery({ queryKey: ['admin','moderation'], queryFn: () => moderationService.getPendingReviews() });
  const data = (q.data || []).filter(r => !deletedReviewIds.includes(r.id)).map(r => ({
    ...r,
    moderationStatus: approvedReviewIds.includes(r.id) ? 'approved' as const
                    : hiddenReviewIds.includes(r.id) ? 'hidden' as const
                    : 'pending' as const,
  }));
  return { ...q, data };
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export function useSystemSettings() {
  return useQuery({ queryKey: ['admin','settings'], queryFn: () => settingsAdminService.getSettings(), staleTime: 300000 });
}
