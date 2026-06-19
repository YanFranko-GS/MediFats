// AUTO-GENERATED – Fase 14 Mock Data

export interface FunnelStep {
  step: number;
  label: string;
  description: string;
  count: number;
  conversionRate: number; // vs previous step
  dropOffRate: number;
  icon: string;
}

export interface FunnelMonth {
  month: string;
  year: number;
  steps: FunnelStep[];
}

function generateSteps(visitors: number): FunnelStep[] {
  const s1 = visitors;
  const s2 = Math.round(s1 * 0.62);
  const s3 = Math.round(s2 * 0.55);
  const s4 = Math.round(s3 * 0.70);
  const s5 = Math.round(s4 * 0.78);
  const s6 = Math.round(s5 * 0.91);
  const s7 = Math.round(s6 * 0.45);
  const steps = [s1, s2, s3, s4, s5, s6, s7];
  const labels = [
    { label: 'Visitantes únicos', desc: 'Usuarios que llegaron a la landing page', icon: 'Globe' },
    { label: 'Búsqueda realizada', desc: 'Usuarios que buscaron un médico', icon: 'Search' },
    { label: 'Perfil visto', desc: 'Usuarios que vieron al menos un perfil de doctor', icon: 'User' },
    { label: 'Reserva iniciada', desc: 'Usuarios que hicieron clic en "Reservar"', icon: 'CalendarPlus' },
    { label: 'Reserva completada', desc: 'Usuarios que completaron el pago', icon: 'CheckCircle' },
    { label: 'Consulta realizada', desc: 'Pacientes que asistieron a la consulta', icon: 'Stethoscope' },
    { label: 'Paciente recurrente', desc: 'Pacientes que reservaron una segunda cita', icon: 'Repeat' },
  ];
  return steps.map((count, i) => ({
    step: i + 1,
    label: labels[i].label,
    description: labels[i].desc,
    icon: labels[i].icon,
    count,
    conversionRate: i === 0 ? 100 : Math.round((count / steps[i - 1]) * 1000) / 10,
    dropOffRate: i === 0 ? 0 : Math.round(((steps[i - 1] - count) / steps[i - 1]) * 1000) / 10,
  }));
}

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const BASE_VISITORS = [4200, 4500, 5100, 5800, 6200, 7100, 6800, 7400, 8000, 8500, 9200, 9800];

export const FUNNEL_DATA: FunnelMonth[] = MONTHS.map((month, i) => ({
  month,
  year: 2026,
  steps: generateSteps(BASE_VISITORS[i]),
}));

export const CURRENT_FUNNEL = generateSteps(9800);
