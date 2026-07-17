// AUTO-GENERATED – Fase 14 Mock Data

export interface HeatmapCell {
  day: number;      // 0=Mon...6=Sun
  hour: number;     // 8..20
  value: number;    // 0-100 demand index
  appointments: number;
}

export interface SpecialtyHeatmapCell {
  specialty: string;
  day: number;
  value: number;
}

const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const SPECIALTIES = ['Cardiología','Neurología','Pediatría','Dermatología','Ginecología','Traumatología','Oftalmología','Psicología'];

// Peak hours: 9-11, 16-18 weekdays; 9-12 Saturday; very low Sunday
function demandAt(day: number, hour: number): number {
  if (day === 6) return Math.max(0, 5 + Math.floor(Math.random() * 15)); // Sunday very low
  if (day === 5) { // Saturday
    if (hour >= 9 && hour <= 12) return 55 + Math.floor(Math.random() * 30);
    return 10 + Math.floor(Math.random() * 20);
  }
  // Weekday
  if (hour >= 9 && hour <= 11) return 75 + Math.floor(Math.random() * 25);
  if (hour >= 16 && hour <= 18) return 65 + Math.floor(Math.random() * 25);
  if (hour >= 12 && hour <= 14) return 40 + Math.floor(Math.random() * 20);
  if (hour >= 8 && hour <= 9) return 30 + Math.floor(Math.random() * 20);
  if (hour >= 18 && hour <= 20) return 20 + Math.floor(Math.random() * 20);
  return 15 + Math.floor(Math.random() * 25);
}

export const HEATMAP_DATA: HeatmapCell[] = [];
for (let day = 0; day < 7; day++) {
  for (let hour = 8; hour <= 20; hour++) {
    const value = demandAt(day, hour);
    HEATMAP_DATA.push({ day, hour, value, appointments: Math.floor(value * 0.8) });
  }
}

export const SPECIALTY_HEATMAP: SpecialtyHeatmapCell[] = [];
const specialtyPeaks: Record<string, number[]> = {
  Cardiología: [1, 2, 3], Neurología: [0, 2, 4], Pediatría: [0, 1, 5],
  Dermatología: [2, 3, 4], Ginecología: [1, 3, 5], Traumatología: [0, 4, 5],
  Oftalmología: [1, 2, 3], Psicología: [2, 3, 4],
};
SPECIALTIES.forEach(sp => {
  const peaks = specialtyPeaks[sp] || [1, 2, 3];
  for (let day = 0; day < 7; day++) {
    const base = peaks.includes(day) ? 60 + Math.floor(Math.random() * 35) : 10 + Math.floor(Math.random() * 30);
    SPECIALTY_HEATMAP.push({ specialty: sp, day, value: Math.min(100, base) });
  }
});

export { DAYS as HEATMAP_DAYS, SPECIALTIES as HEATMAP_SPECIALTIES };
