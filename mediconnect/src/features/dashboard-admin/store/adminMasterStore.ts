import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, Permission } from '../../../data/roles';
import type { GlobalSettings } from '../../../data/globalSettings';
import { ROLES } from '../../../data/roles';
import { GLOBAL_SETTINGS } from '../../../data/globalSettings';

export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  doctorCount: number;
  color: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  doctorCount: number;
  coordinates: { lat: number; lng: number };
}

interface AdminMasterState {
  roles: Role[];
  updateRolePermissions: (roleId: string, permissions: Permission[]) => void;

  settings: GlobalSettings;
  updateSettings: (partial: Partial<GlobalSettings>) => void;

  impersonatingUserId: string | null;
  impersonatingUserName: string | null;
  setImpersonating: (id: string | null, name: string | null) => void;

  suspendedUserIds: string[];
  blockedUserIds: string[];
  suspendUser: (id: string) => void;
  activateUser: (id: string) => void;
  blockUser: (id: string) => void;

  approvedDoctorIds: string[];
  rejectedDoctorIds: string[];
  suspendedDoctorIds: string[];
  approveDoctor: (id: string) => void;
  rejectDoctor: (id: string) => void;
  suspendDoctor: (id: string) => void;
  reactivateDoctor: (id: string) => void;

  specialties: Specialty[];
  addSpecialty: (s: Specialty) => void;
  updateSpecialty: (id: string, partial: Partial<Specialty>) => void;
  deleteSpecialty: (id: string) => void;

  clinics: Clinic[];
  addClinic: (c: Clinic) => void;
  updateClinic: (id: string, partial: Partial<Clinic>) => void;
  deleteClinic: (id: string) => void;

  paidPayoutIds: string[];
  markPayoutPaid: (id: string) => void;

  approvedReviewIds: string[];
  hiddenReviewIds: string[];
  deletedReviewIds: string[];
  approveReview: (id: string) => void;
  hideReview: (id: string) => void;
  deleteReview: (id: string) => void;

  resolvedTicketIds: string[];
  resolveTicket: (id: string) => void;

  blockedIps: string[];
  closedSessionIds: string[];
  blockIp: (ip: string) => void;
  closeSession: (id: string) => void;
}

const DEFAULT_SPECIALTIES: Specialty[] = [
  { id:'sp-001', name:'Cardiología', description:'Enfermedades del corazón y sistema cardiovascular', icon:'Heart', status:'active', doctorCount:8, color:'red' },
  { id:'sp-002', name:'Neurología', description:'Trastornos del sistema nervioso', icon:'Brain', status:'active', doctorCount:6, color:'purple' },
  { id:'sp-003', name:'Pediatría', description:'Medicina infantil y del adolescente', icon:'Baby', status:'active', doctorCount:10, color:'blue' },
  { id:'sp-004', name:'Dermatología', description:'Enfermedades de la piel', icon:'Scan', status:'active', doctorCount:7, color:'amber' },
  { id:'sp-005', name:'Ginecología', description:'Salud reproductiva femenina', icon:'Heart', status:'active', doctorCount:9, color:'pink' },
  { id:'sp-006', name:'Traumatología', description:'Lesiones del sistema músculo-esquelético', icon:'Bone', status:'active', doctorCount:5, color:'orange' },
  { id:'sp-007', name:'Oftalmología', description:'Enfermedades de los ojos', icon:'Eye', status:'active', doctorCount:4, color:'teal' },
  { id:'sp-008', name:'Psicología', description:'Salud mental y bienestar emocional', icon:'Brain', status:'active', doctorCount:12, color:'indigo' },
  { id:'sp-009', name:'Endocrinología', description:'Enfermedades hormonales y metabólicas', icon:'Activity', status:'active', doctorCount:3, color:'green' },
  { id:'sp-010', name:'Gastroenterología', description:'Enfermedades del sistema digestivo', icon:'Stethoscope', status:'active', doctorCount:4, color:'yellow' },
  { id:'sp-011', name:'Medicina General', description:'Atención médica integral y preventiva', icon:'Stethoscope', status:'active', doctorCount:15, color:'blue' },
  { id:'sp-012', name:'Oncología', description:'Diagnóstico y tratamiento del cáncer', icon:'Microscope', status:'inactive', doctorCount:2, color:'gray' },
];

const DEFAULT_CLINICS: Clinic[] = [
  { id:'cl-001', name:'Clínica San Borja', address:'Av. Guardia Civil 337', city:'Lima', phone:'+51 1 610 3333', email:'contacto@clinicasanborja.pe', status:'active', doctorCount:18, coordinates:{ lat:-12.0907, lng:-77.0028 } },
  { id:'cl-002', name:'Clínica Internacional', address:'Av. Garcilazo de la Vega 1420', city:'Lima', phone:'+51 1 619 6161', email:'info@clinicainternacional.pe', status:'active', doctorCount:24, coordinates:{ lat:-12.0588, lng:-77.0500 } },
  { id:'cl-003', name:'Clínica Miraflores', address:'Av. Angamos Oeste 520', city:'Lima', phone:'+51 1 213 5000', email:'contacto@clinicamiraflores.pe', status:'active', doctorCount:12, coordinates:{ lat:-12.1135, lng:-77.0254 } },
  { id:'cl-004', name:'Centro Médico Surco', address:'Av. Velasco Astete 2450', city:'Lima', phone:'+51 1 271 4444', email:'admin@cmssurco.pe', status:'active', doctorCount:8, coordinates:{ lat:-12.1340, lng:-76.9924 } },
  { id:'cl-005', name:'Clínica San Felipe', address:'Av. Gregorio Escobedo 650', city:'Lima', phone:'+51 1 261 9900', email:'info@clinicasanfelipe.pe', status:'inactive', doctorCount:5, coordinates:{ lat:-12.0771, lng:-77.0551 } },
];

export const useAdminMasterStore = create<AdminMasterState>()(
  persist(
    (set) => ({
      roles: ROLES,
      updateRolePermissions: (roleId, permissions) =>
        set(s => ({ roles: s.roles.map(r => r.id === roleId ? { ...r, permissions } : r) })),

      settings: GLOBAL_SETTINGS,
      updateSettings: (partial) =>
        set(s => ({ settings: { ...s.settings, ...partial } })),

      impersonatingUserId: null,
      impersonatingUserName: null,
      setImpersonating: (id, name) => set({ impersonatingUserId: id, impersonatingUserName: name }),

      suspendedUserIds: [],
      blockedUserIds: [],
      suspendUser: (id) => set(s => ({ suspendedUserIds: [...s.suspendedUserIds.filter(x => x !== id), id], blockedUserIds: s.blockedUserIds.filter(x => x !== id) })),
      activateUser: (id) => set(s => ({ suspendedUserIds: s.suspendedUserIds.filter(x => x !== id), blockedUserIds: s.blockedUserIds.filter(x => x !== id) })),
      blockUser: (id) => set(s => ({ blockedUserIds: [...s.blockedUserIds.filter(x => x !== id), id], suspendedUserIds: s.suspendedUserIds.filter(x => x !== id) })),

      approvedDoctorIds: [],
      rejectedDoctorIds: [],
      suspendedDoctorIds: [],
      approveDoctor: (id) => set(s => ({ approvedDoctorIds: [...s.approvedDoctorIds.filter(x => x !== id), id], rejectedDoctorIds: s.rejectedDoctorIds.filter(x => x !== id), suspendedDoctorIds: s.suspendedDoctorIds.filter(x => x !== id) })),
      rejectDoctor: (id) => set(s => ({ rejectedDoctorIds: [...s.rejectedDoctorIds.filter(x => x !== id), id] })),
      suspendDoctor: (id) => set(s => ({ suspendedDoctorIds: [...s.suspendedDoctorIds.filter(x => x !== id), id], approvedDoctorIds: s.approvedDoctorIds.filter(x => x !== id) })),
      reactivateDoctor: (id) => set(s => ({ suspendedDoctorIds: s.suspendedDoctorIds.filter(x => x !== id), approvedDoctorIds: [...s.approvedDoctorIds.filter(x => x !== id), id] })),

      specialties: DEFAULT_SPECIALTIES,
      addSpecialty: (s2) => set(s => ({ specialties: [...s.specialties, s2] })),
      updateSpecialty: (id, partial) => set(s => ({ specialties: s.specialties.map(sp => sp.id === id ? { ...sp, ...partial } : sp) })),
      deleteSpecialty: (id) => set(s => ({ specialties: s.specialties.filter(sp => sp.id !== id) })),

      clinics: DEFAULT_CLINICS,
      addClinic: (c) => set(s => ({ clinics: [...s.clinics, c] })),
      updateClinic: (id, partial) => set(s => ({ clinics: s.clinics.map(cl => cl.id === id ? { ...cl, ...partial } : cl) })),
      deleteClinic: (id) => set(s => ({ clinics: s.clinics.filter(cl => cl.id !== id) })),

      paidPayoutIds: [],
      markPayoutPaid: (id) => set(s => ({ paidPayoutIds: [...s.paidPayoutIds, id] })),

      approvedReviewIds: [],
      hiddenReviewIds: [],
      deletedReviewIds: [],
      approveReview: (id) => set(s => ({ approvedReviewIds: [...s.approvedReviewIds, id], hiddenReviewIds: s.hiddenReviewIds.filter(x => x !== id) })),
      hideReview: (id) => set(s => ({ hiddenReviewIds: [...s.hiddenReviewIds, id], approvedReviewIds: s.approvedReviewIds.filter(x => x !== id) })),
      deleteReview: (id) => set(s => ({ deletedReviewIds: [...s.deletedReviewIds, id] })),

      resolvedTicketIds: [],
      resolveTicket: (id) => set(s => ({ resolvedTicketIds: [...s.resolvedTicketIds, id] })),

      blockedIps: [],
      closedSessionIds: [],
      blockIp: (ip) => set(s => ({ blockedIps: [...s.blockedIps, ip] })),
      closeSession: (id) => set(s => ({ closedSessionIds: [...s.closedSessionIds, id] })),
    }),
    { name: 'mediconnect-admin-master-v2' }
  )
);
