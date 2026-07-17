import { apiClient } from './apiClient';
import { HEATMAP_DATA, SPECIALTY_HEATMAP, HEATMAP_DAYS, HEATMAP_SPECIALTIES } from '../../data/heatmapData';
export const heatmapAdminService = {
  async getScheduleHeatmap() { return (await apiClient(() => ({ cells: HEATMAP_DATA, days: HEATMAP_DAYS }), { delay: 500 })).data; },
  async getSpecialtyHeatmap() { return (await apiClient(() => ({ cells: SPECIALTY_HEATMAP, specialties: HEATMAP_SPECIALTIES, days: HEATMAP_DAYS }), { delay: 500 })).data; },
};
