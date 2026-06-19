import { apiClient } from './apiClient';
import { USERS } from '../../data/users';
import { APPOINTMENTS } from '../../data/appointments';

export interface AdminUser {
  id: string; name: string; email: string; phone: string; role: string;
  status: 'active' | 'suspended' | 'blocked'; avatar: string;
  registeredAt: string; lastLogin: string; appointmentsCount: number;
}

const BASE_USERS: AdminUser[] = (USERS as unknown as any[]).map((u, i) => ({
  id: u.id, name: u.name, email: u.email,
  phone: u.phone || `+51 9${String(10000000 + i * 137).slice(0,8)}`,
  role: u.role, status: 'active' as const, avatar: u.avatar,
  registeredAt: u.createdAt, lastLogin: u.lastLogin || u.createdAt,
  appointmentsCount: (APPOINTMENTS as unknown as any[]).filter(a => a.patientId === u.id || a.doctorId === u.id).length,
}));

export const userManagementService = {
  async getUsers(): Promise<AdminUser[]> {
    return (await apiClient(() => BASE_USERS, { errorProbability: 0.01 })).data;
  },
  async getUserById(id: string): Promise<AdminUser | undefined> {
    return (await apiClient(() => BASE_USERS.find(u => u.id === id), { delay: 300 })).data;
  },
};
