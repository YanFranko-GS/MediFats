import { apiClient } from './apiClient';
import { DOCTORS } from '../../data/doctors';
import { APPOINTMENTS } from '../../data/appointments';
import { REVIEWS } from '../../data/reviews';

export interface AdminDoctor {
  id: string; name: string; email: string; specialty: string;
  status: 'pending' | 'approved' | 'suspended' | 'blocked';
  rating: number; totalRevenue: number; totalAppointments: number;
  avatar: string; registeredAt: string; verifiedAt?: string; bio: string; fee: number;
}

const PENDING_DOCTORS: AdminDoctor[] = [
  { id:'doc-pending-01', name:'Dr. Roberto Paz', email:'roberto.paz@email.com', specialty:'Gastroenterología', status:'pending', rating:0, totalRevenue:0, totalAppointments:0, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-roberto-paz', registeredAt: new Date(Date.now()-2*86400000).toISOString(), bio:'Especialista con 8 años de experiencia en enfermedades digestivas.', fee:90 },
  { id:'doc-pending-02', name:'Dra. Carmen Vidal', email:'carmen.vidal@email.com', specialty:'Reumatología', status:'pending', rating:0, totalRevenue:0, totalAppointments:0, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=dra-carmen-vidal', registeredAt: new Date(Date.now()-4*86400000).toISOString(), bio:'Especialista en enfermedades autoinmunes y articulares.', fee:110 },
  { id:'doc-pending-03', name:'Dr. Andrés Mora', email:'andres.mora@email.com', specialty:'Neumología', status:'pending', rating:0, totalRevenue:0, totalAppointments:0, avatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-andres-mora', registeredAt: new Date(Date.now()-6*86400000).toISOString(), bio:'Experto en enfermedades respiratorias y tratamiento del asma.', fee:100 },
];

const BASE_DOCTORS: AdminDoctor[] = [
  ...(DOCTORS as unknown as any[]).slice(0, 30).map((d: any) => {
    const appts = (APPOINTMENTS as unknown as any[]).filter(a => a.doctorId === d.id);
    const revs = (REVIEWS as unknown as any[]).filter(r => r.doctorId === d.id);
    return {
      id: d.id, name: d.name, email: d.email || `${d.name.toLowerCase().replace(/\s+/g,'.').replace(/[^a-z.]/g,'')}@mediconnect.pe`,
      specialty: d.specialty, status: 'approved' as const, rating: d.rating,
      totalRevenue: appts.filter((a:any) => a.status === 'completed').length * d.price,
      totalAppointments: appts.length, avatar: d.avatar,
      registeredAt: new Date(Date.now() - Math.random() * 365 * 86400000).toISOString(),
      verifiedAt: new Date(Date.now() - Math.random() * 300 * 86400000).toISOString(),
      bio: d.bio, fee: d.price,
    };
  }),
  ...PENDING_DOCTORS,
];

export const doctorManagementService = {
  async getDoctors(): Promise<AdminDoctor[]> {
    return (await apiClient(() => BASE_DOCTORS, { errorProbability: 0.01 })).data;
  },
  async getPendingDoctors(): Promise<AdminDoctor[]> {
    return (await apiClient(() => BASE_DOCTORS.filter(d => d.status === 'pending'), { delay: 400 })).data;
  },
};
