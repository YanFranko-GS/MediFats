import { apiClient, paginate } from './apiClient';
import { DOCTORS } from '../../data/doctors';
import { REVIEWS } from '../../data/reviews';
import type { Doctor, Review, DoctorFilters, ApiResponse } from '../types';

const ALL_DOCTORS = DOCTORS as unknown as Doctor[];
const ALL_REVIEWS = REVIEWS as unknown as Review[];

export const doctorService = {
  async getDoctors(
    filters: DoctorFilters = {},
    page = 1,
    pageSize = 12
  ): Promise<ApiResponse<Doctor[]>> {
    return apiClient(() => {
      let result = [...ALL_DOCTORS];

      if (filters.query) {
        const q = filters.query.toLowerCase();
        result = result.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.specialty.toLowerCase().includes(q) ||
            d.bio.toLowerCase().includes(q) ||
            d.location.toLowerCase().includes(q)
        );
      }

      if (filters.specialty) {
        result = result.filter((d) => d.specialty === filters.specialty);
      }

      if (filters.minRating !== undefined) {
        result = result.filter((d) => d.rating >= filters.minRating!);
      }

      if (filters.maxPrice !== undefined) {
        result = result.filter((d) => d.price <= filters.maxPrice!);
      }

      if (filters.language) {
        result = result.filter((d) =>
          d.languages.some((l) => l.toLowerCase().includes(filters.language!.toLowerCase()))
        );
      }

      if (filters.mode) {
        result = result.filter((d) =>
          (d.consultationModes as string[]).includes(filters.mode!)
        );
      }

      // Sort
      const sortBy = filters.sortBy || 'rating';
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        if (sortBy === 'rating') return (b.rating - a.rating) * order;
        if (sortBy === 'price') return (a.price - b.price) * order;
        if (sortBy === 'experience') return (b.experience - a.experience) * order;
        if (sortBy === 'reviews') return (b.reviewCount - a.reviewCount) * order;
        return 0;
      });

      const { items, total, totalPages } = paginate(result, page, pageSize);
      return { data: items, success: true, pagination: { page, pageSize, total, totalPages } } as unknown as Doctor[];
    });
  },

  async getDoctorById(id: string): Promise<Doctor | null> {
    return (await apiClient(() => {
      return ALL_DOCTORS.find((d) => d.id === id) ?? null;
    }, { delay: 600 })).data;
  },

  async getFeaturedDoctors(limit = 8): Promise<Doctor[]> {
    return (await apiClient(() => {
      return [...ALL_DOCTORS]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    }, { errorProbability: 0.02 })).data;
  },

  async getDoctorsBySpecialty(specialtyId: string, limit = 6): Promise<Doctor[]> {
    return (await apiClient(() => {
      return ALL_DOCTORS.filter((d) => d.specialtyId === specialtyId).slice(0, limit);
    })).data;
  },

  async getDoctorReviews(doctorId: string, page = 1, pageSize = 10): Promise<ApiResponse<Review[]>> {
    return apiClient(() => {
      const reviews = ALL_REVIEWS.filter((r) => r.doctorId === doctorId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const { items, total, totalPages } = paginate(reviews, page, pageSize);
      return { data: items, success: true, pagination: { page, pageSize, total, totalPages } } as unknown as Review[];
    });
  },

  async getDoctorSlots(doctorId: string, date: string): Promise<{ time: string; isBooked: boolean }[]> {
    return (await apiClient(() => {
      const doctor = ALL_DOCTORS.find((d) => d.id === doctorId);
      if (!doctor) return [];
      const dayOfWeek = new Date(date).getDay();
      const availability = doctor.availability.find((a) => a.day === dayOfWeek);
      if (!availability) return [];
      return availability.slots;
    }, { delay: 500 })).data;
  },
};
