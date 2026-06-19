import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { patientService } from '../services/patientService';
import { medicationService } from '../services/medicationService';
import { resultsService } from '../services/resultsService';
import { messagesService } from '../services/messagesService';
import { notificationsService } from '../services/notificationsService';
import { healthService } from '../services/healthService';
import { toast } from 'sonner';

function usePatientId() {
  return useAuthStore.getState().user?.id ?? 'u-patient-1';
}

// ── HEALTH ───────────────────────────────────────────────────────────────────
export function useHealthHistory(months = 12) {
  const pid = usePatientId();
  return useQuery({
    queryKey: ['health', 'history', pid, months],
    queryFn: () => healthService.getHistory(pid, months),
    staleTime: 1000 * 60 * 10,
  });
}

export function useLatestHealth() {
  const pid = usePatientId();
  return useQuery({
    queryKey: ['health', 'latest', pid],
    queryFn: () => healthService.getLatest(pid),
    staleTime: 1000 * 60 * 5,
  });
}

// ── MEDICATIONS ──────────────────────────────────────────────────────────────
export function useMedications(status?: string) {
  const pid = usePatientId();
  return useQuery({
    queryKey: ['medications', pid, status],
    queryFn: () => medicationService.getByPatient(pid, status),
  });
}

export function useActiveMedications() {
  const pid = usePatientId();
  return useQuery({
    queryKey: ['medications', 'active', pid],
    queryFn: () => medicationService.getActive(pid),
    staleTime: 1000 * 60 * 10,
  });
}

// ── RESULTS ──────────────────────────────────────────────────────────────────
export function useMedicalResults(category?: string) {
  const pid = usePatientId();
  return useQuery({
    queryKey: ['results', pid, category],
    queryFn: () => resultsService.getByPatient(pid, category),
  });
}

export function usePendingResults() {
  const pid = usePatientId();
  return useQuery({
    queryKey: ['results', 'pending', pid],
    queryFn: () => resultsService.getPending(pid),
    staleTime: 1000 * 60 * 5,
  });
}

// ── MESSAGES ─────────────────────────────────────────────────────────────────
export function useConversations() {
  const pid = usePatientId();
  return useQuery({
    queryKey: ['conversations', pid],
    queryFn: () => messagesService.getConversations(pid),
    refetchInterval: 15_000,
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messagesService.getMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 10_000,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  const user = useAuthStore.getState().user;
  return useMutation({
    mutationFn: ({ conversationId, text }: { conversationId: string; text: string }) =>
      messagesService.sendMessage(
        conversationId, text,
        user?.id ?? '', user?.name ?? '', user?.avatar ?? ''
      ),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['messages', vars.conversationId] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export function useNotifications(filter?: 'all' | 'unread' | 'important') {
  const pid = usePatientId();
  return useQuery({
    queryKey: ['notifications', pid, filter],
    queryFn: () => notificationsService.getByPatient(pid, filter),
    refetchInterval: 30_000,
  });
}

export function useUnreadCount() {
  const pid = usePatientId();
  return useQuery({
    queryKey: ['notifications', 'count', pid],
    queryFn: () => notificationsService.getUnreadCount(pid),
    refetchInterval: 15_000,
    staleTime: 0,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  const pid = usePatientId();
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(pid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Todas las notificaciones marcadas como leídas');
    },
  });
}

// ── FAVORITES ─────────────────────────────────────────────────────────────────
export function useFavorites() {
  const pid = usePatientId();
  return useQuery({
    queryKey: ['favorites', pid],
    queryFn: () => patientService.getFavorites(pid),
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  const pid = usePatientId();
  return useMutation({
    mutationFn: (doctorId: string) => patientService.removeFavorite(pid, doctorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Eliminado de favoritos');
    },
  });
}
