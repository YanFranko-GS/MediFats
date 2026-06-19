import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { appointmentService } from '../services/appointmentService';
import { useAuthStore } from '../stores/authStore';
import type { Appointment } from '../types';

export function usePatientAppointments() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['appointments', 'patient', user?.id],
    queryFn: () => appointmentService.getByPatient(user!.id),
    enabled: !!user?.id,
  });
}

export function useUpcomingAppointments() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['appointments', 'upcoming', user?.id],
    queryFn: () => appointmentService.getUpcoming(user!.id),
    enabled: !!user?.id,
  });
}

export function useDoctorAppointments() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['appointments', 'doctor', user?.id],
    queryFn: async () => {
      // Find doctorId linked to this user
      const { DOCTORS } = await import('../../data/doctors');
      const doctor = (DOCTORS as unknown as Array<{ id: string; userId: string }>)
        .find((d) => d.userId === user!.id || user?.email?.includes('carlos.mendoza'));
      if (!doctor) return [];
      return appointmentService.getByDoctor(doctor.id);
    },
    enabled: !!user?.id && user.role === 'doctor',
  });
}

export function useAppointmentStats() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['appointments', 'stats', user?.id],
    queryFn: () => appointmentService.getStats(user!.id),
    enabled: !!user?.id,
  });
}

export function useBookAppointment() {
  const qc = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (data: Omit<Appointment, 'id' | 'createdAt'>) =>
      appointmentService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('¡Cita reservada con éxito!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al reservar la cita');
    },
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      appointmentService.cancel(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita cancelada');
    },
    onError: () => {
      toast.error('Error al cancelar la cita');
    },
  });
}

export function useRescheduleAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, date, time }: { id: string; date: string; time: string }) =>
      appointmentService.reschedule(id, date, time),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita reprogramada');
    },
    onError: () => {
      toast.error('Error al reprogramar la cita');
    },
  });
}
