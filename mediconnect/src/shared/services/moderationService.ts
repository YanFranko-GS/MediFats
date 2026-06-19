import { apiClient } from './apiClient';
import { REVIEWS } from '../../data/reviews';
import { DOCTORS } from '../../data/doctors';

export const moderationService = {
  async getPendingReviews() {
    return (await apiClient(() => (REVIEWS as unknown as any[]).slice(0, 15).map((r: any) => {
      const doctor = (DOCTORS as unknown as any[]).find((d: any) => d.id === r.doctorId);
      return {
        ...r,
        doctorName: doctor?.name || 'Doctor desconocido',
        moderationStatus: 'pending' as const,
        flagged: Math.random() > 0.7,
        flagReason: Math.random() > 0.7 ? 'Lenguaje inapropiado' : undefined,
      };
    }), { delay: 400 })).data;
  },
};
