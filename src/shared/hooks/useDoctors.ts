import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { doctorService } from '../services/doctorService';
import { specialtyService } from '../services/specialtyService';
import type { DoctorFilters } from '../types';

export function useDoctors(filters: DoctorFilters = {}, page = 1) {
  return useQuery({
    queryKey: ['doctors', filters, page],
    queryFn: () => doctorService.getDoctors(filters, page),
    placeholderData: (prev) => prev,
  });
}

export function useFeaturedDoctors(limit = 8) {
  return useQuery({
    queryKey: ['doctors', 'featured', limit],
    queryFn: () => doctorService.getFeaturedDoctors(limit),
    staleTime: 1000 * 60 * 10,
  });
}

export function useDoctor(id: string | undefined) {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: () => doctorService.getDoctorById(id!),
    enabled: !!id,
  });
}

export function useDoctorReviews(doctorId: string | undefined, page = 1) {
  return useQuery({
    queryKey: ['doctor-reviews', doctorId, page],
    queryFn: () => doctorService.getDoctorReviews(doctorId!, page),
    enabled: !!doctorId,
  });
}

export function useDoctorSlots(doctorId: string | undefined, date: string | null) {
  return useQuery({
    queryKey: ['doctor-slots', doctorId, date],
    queryFn: () => doctorService.getDoctorSlots(doctorId!, date!),
    enabled: !!doctorId && !!date,
  });
}

export function useDoctorsBySpecialty(specialtyId: string | undefined) {
  return useQuery({
    queryKey: ['doctors-by-specialty', specialtyId],
    queryFn: () => doctorService.getDoctorsBySpecialty(specialtyId!),
    enabled: !!specialtyId,
  });
}

export function useSpecialties() {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: () => specialtyService.getAll(),
    staleTime: 1000 * 60 * 30,
  });
}
