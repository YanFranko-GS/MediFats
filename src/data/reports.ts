// AUTO-GENERATED – Fase 14 Mock Data

export type ReportFormat = 'PDF' | 'Excel' | 'CSV';
export type ReportFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annual';
export type ReportCategory = 'finance' | 'doctors' | 'patients' | 'appointments' | 'reviews';

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  icon: string;
  availableFormats: ReportFormat[];
  estimatedSize: string;
  lastGenerated?: string;
  parameters: Array<{
    key: string;
    label: string;
    type: 'period' | 'date_range' | 'select';
    options?: string[];
  }>;
}

export interface ScheduledReport {
  id: string;
  reportId: string;
  reportName: string;
  frequency: ReportFrequency;
  format: ReportFormat;
  recipients: string[];
  nextRun: string;
  lastRun?: string;
  active: boolean;
}

function daysAgo(d: number): string {
  const dt = new Date(); dt.setDate(dt.getDate() - d); return dt.toISOString();
}
function daysFromNow(d: number): string {
  const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString();
}

export const REPORT_DEFINITIONS: ReportDefinition[] = [
  { id:'rep-001', name:'Ingresos por Período', description:'Resumen completo de ingresos, comisiones y pagos a doctores por período seleccionado', category:'finance', icon:'DollarSign', availableFormats:['PDF','Excel','CSV'], estimatedSize:'2-5 MB', lastGenerated:daysAgo(2), parameters:[{ key:'period', label:'Período', type:'period', options:['Este mes','Trimestre actual','Este año','Personalizado'] }] },
  { id:'rep-002', name:'Top Doctores por Ingresos', description:'Ranking de doctores ordenados por ingresos generados y número de consultas realizadas', category:'doctors', icon:'TrendingUp', availableFormats:['PDF','Excel'], estimatedSize:'1-2 MB', lastGenerated:daysAgo(7), parameters:[{ key:'period', label:'Período', type:'period', options:['Este mes','Trimestre actual','Este año'] }] },
  { id:'rep-003', name:'Nuevos Pacientes', description:'Análisis de registro de nuevos pacientes, fuentes de adquisición y demografía', category:'patients', icon:'UserPlus', availableFormats:['PDF','Excel','CSV'], estimatedSize:'1-3 MB', lastGenerated:daysAgo(3), parameters:[{ key:'period', label:'Período', type:'period', options:['Esta semana','Este mes','Este año'] }] },
  { id:'rep-004', name:'Pacientes Inactivos', description:'Lista de pacientes sin reservas en los últimos 30/60/90 días con datos de contacto', category:'patients', icon:'UserMinus', availableFormats:['Excel','CSV'], estimatedSize:'500 KB - 2 MB', parameters:[{ key:'days', label:'Días sin actividad', type:'select', options:['30 días','60 días','90 días'] }] },
  { id:'rep-005', name:'Cancelaciones y Reprogramaciones', description:'Análisis de tasas de cancelación por doctor, especialidad y período', category:'appointments', icon:'XCircle', availableFormats:['PDF','Excel'], estimatedSize:'1-2 MB', lastGenerated:daysAgo(14), parameters:[{ key:'period', label:'Período', type:'period', options:['Este mes','Trimestre actual','Este año'] }] },
  { id:'rep-006', name:'Citas por Especialidad', description:'Distribución de citas médicas por especialidad, modalidad y estado', category:'appointments', icon:'BarChart2', availableFormats:['PDF','Excel','CSV'], estimatedSize:'1-4 MB', parameters:[{ key:'period', label:'Período', type:'period', options:['Este mes','Trimestre actual','Este año'] }] },
  { id:'rep-007', name:'Análisis de Reseñas', description:'Distribución de ratings, tendencias de satisfacción y análisis por doctor', category:'reviews', icon:'Star', availableFormats:['PDF','Excel'], estimatedSize:'500 KB - 1 MB', lastGenerated:daysAgo(10), parameters:[{ key:'period', label:'Período', type:'period', options:['Este mes','Trimestre actual','Este año'] }] },
  { id:'rep-008', name:'Reporte Ejecutivo Mensual', description:'Dashboard ejecutivo completo: KPIs, MRR, ARR, NPS, Churn Rate y proyecciones', category:'finance', icon:'Briefcase', availableFormats:['PDF'], estimatedSize:'3-8 MB', lastGenerated:daysAgo(1), parameters:[{ key:'month', label:'Mes', type:'select', options:['Enero','Febrero','Marzo','Abril','Mayo','Junio'] }] },
];

export const SCHEDULED_REPORTS: ScheduledReport[] = [
  { id:'sched-001', reportId:'rep-001', reportName:'Ingresos por Período', frequency:'monthly', format:'PDF', recipients:['ceo@mediconnect.com','finance@mediconnect.com'], nextRun:daysFromNow(18), lastRun:daysAgo(12), active:true },
  { id:'sched-002', reportId:'rep-008', reportName:'Reporte Ejecutivo Mensual', frequency:'monthly', format:'PDF', recipients:['ceo@mediconnect.com'], nextRun:daysFromNow(18), lastRun:daysAgo(12), active:true },
  { id:'sched-003', reportId:'rep-003', reportName:'Nuevos Pacientes', frequency:'weekly', format:'Excel', recipients:['marketing@mediconnect.com'], nextRun:daysFromNow(3), lastRun:daysAgo(4), active:true },
  { id:'sched-004', reportId:'rep-005', reportName:'Cancelaciones y Reprogramaciones', frequency:'weekly', format:'Excel', recipients:['ops@mediconnect.com'], nextRun:daysFromNow(3), lastRun:daysAgo(4), active:false },
];
