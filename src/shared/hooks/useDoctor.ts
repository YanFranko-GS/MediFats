import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { scheduleService } from '../services/scheduleService';
import { patientServiceDoctor } from '../services/patientServiceDoctor';
import { financeServiceDoctor } from '../services/financeServiceDoctor';
import { ordersService } from '../services/ordersService';
import { requestsService } from '../services/requestsService';
import { messagesServiceDoctor } from '../services/messagesServiceDoctor';
import { notificationsServiceDoctor } from '../services/notificationsServiceDoctor';
import { toast } from 'sonner';

// The demo dataset only ships one authenticatable doctor account (Dr. Carlos
// Mendoza / doc-001); every other "doctor" record is a browsable directory
// profile for the patient-facing search, not a real login. Exported so other
// doctor-dashboard modules reference this single source of truth instead of
// duplicating the id as a magic string.
export const DOCTOR_ID = 'doc-001';
function useDoctorUserId() { return useAuthStore.getState().user?.id ?? 'u-doctor-1'; }

// ── SCHEDULE ─────────────────────────────────────────────────────────────────
export function useTodaySchedule() {
  const uid = useDoctorUserId();
  return useQuery({
    queryKey: ['doctor-schedule', 'today', uid],
    queryFn: () => scheduleService.getTodayAppointments(uid),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDaySchedule(date: string) {
  const uid = useDoctorUserId();
  return useQuery({
    queryKey: ['doctor-schedule', 'day', uid, date],
    queryFn: () => scheduleService.getByDay(uid, date),
    enabled: !!date,
  });
}

export function useWeekSchedule(startDate: string, endDate: string) {
  const uid = useDoctorUserId();
  return useQuery({
    queryKey: ['doctor-schedule', 'week', uid, startDate],
    queryFn: () => scheduleService.getByWeek(uid, startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

// ── PATIENTS ─────────────────────────────────────────────────────────────────
export function useDoctorPatients(filter?: { q?: string; status?: string }) {
  return useQuery({
    queryKey: ['doctor-patients', DOCTOR_ID, filter],
    queryFn: () => patientServiceDoctor.getPatients(DOCTOR_ID, filter),
  });
}

export function useDoctorPatient(id: string | undefined) {
  return useQuery({
    queryKey: ['doctor-patient', id],
    queryFn: () => patientServiceDoctor.getPatientById(id!),
    enabled: !!id,
  });
}

export function usePatientHistory(patientId: string | undefined) {
  return useQuery({
    queryKey: ['doctor-patient-history', patientId],
    queryFn: () => patientServiceDoctor.getPatientHistory(patientId!),
    enabled: !!patientId,
  });
}

// ── FINANCE ──────────────────────────────────────────────────────────────────
export function useDoctorFinanceKPIs() {
  return useQuery({
    queryKey: ['doctor-finance', 'kpis'],
    queryFn: () => financeServiceDoctor.getKPIs(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDoctorFinanceMonthly(months = 12) {
  return useQuery({
    queryKey: ['doctor-finance', 'monthly', months],
    queryFn: () => financeServiceDoctor.getMonthly(months),
  });
}

export function useDoctorTransactions(page = 1) {
  return useQuery({
    queryKey: ['doctor-finance', 'transactions', page],
    queryFn: () => financeServiceDoctor.getTransactions(DOCTOR_ID, page),
  });
}

// ── ORDERS ────────────────────────────────────────────────────────────────────
export function useDoctorOrders(status?: string) {
  return useQuery({
    queryKey: ['doctor-orders', DOCTOR_ID, status],
    queryFn: () => ordersService.getOrders(DOCTOR_ID, status),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (order: any) => ordersService.createOrder(order),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['doctor-orders'] }); toast.success('Orden médica creada'); },
    onError: () => toast.error('Error al crear orden'),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersService.cancelOrder(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['doctor-orders'] }); toast.success('Orden cancelada'); },
  });
}

export function useDoctorLabResults() {
  return useQuery({
    queryKey: ['doctor-lab-results', DOCTOR_ID],
    queryFn: () => ordersService.getLabResults(DOCTOR_ID),
  });
}

// ── REQUESTS ─────────────────────────────────────────────────────────────────
export function usePendingRequests() {
  return useQuery({
    queryKey: ['doctor-requests', DOCTOR_ID, 'pending'],
    queryFn: () => requestsService.getPending(DOCTOR_ID),
    refetchInterval: 30_000,
  });
}

export function useAllRequests() {
  return useQuery({
    queryKey: ['doctor-requests', DOCTOR_ID, 'all'],
    queryFn: () => requestsService.getAll(DOCTOR_ID),
  });
}

export function useResolveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: 'approved' | 'rejected'; reason?: string }) =>
      requestsService.resolve(id, action, reason),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['doctor-requests'] });
      toast.success(vars.action === 'approved' ? 'Solicitud aprobada' : 'Solicitud rechazada');
    },
  });
}

// ── MESSAGES ─────────────────────────────────────────────────────────────────
export function useDoctorConversations() {
  const uid = useDoctorUserId();
  return useQuery({
    queryKey: ['doctor-messages', 'conversations', uid],
    queryFn: () => messagesServiceDoctor.getConversations(uid),
    refetchInterval: 15_000,
  });
}

export function useDoctorMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['doctor-messages', 'chat', conversationId],
    queryFn: () => messagesServiceDoctor.getMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 10_000,
  });
}

export function useSendDoctorMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, text }: { conversationId: string; text: string }) =>
      messagesServiceDoctor.send(conversationId, text),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['doctor-messages', 'chat', vars.conversationId] });
      qc.invalidateQueries({ queryKey: ['doctor-messages', 'conversations'] });
    },
  });
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export function useDoctorNotifications(filter?: string) {
  return useQuery({
    queryKey: ['doctor-notifications', DOCTOR_ID, filter],
    queryFn: () => notificationsServiceDoctor.getAll(DOCTOR_ID, filter),
    refetchInterval: 30_000,
  });
}

export function useDoctorUnreadCount() {
  return useQuery({
    queryKey: ['doctor-notifications', 'count', DOCTOR_ID],
    queryFn: () => notificationsServiceDoctor.getUnreadCount(DOCTOR_ID),
    refetchInterval: 15_000,
    staleTime: 0,
  });
}

export function useMarkDoctorNotifRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsServiceDoctor.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['doctor-notifications'] }),
  });
}

export function useMarkAllDoctorNotifsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsServiceDoctor.markAllRead(DOCTOR_ID),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['doctor-notifications'] }); toast.success('Todas leídas'); },
  });
}
