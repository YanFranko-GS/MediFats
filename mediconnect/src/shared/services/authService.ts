import { apiClient } from './apiClient';
import { USERS } from '../../data/users';
import type { User } from '../types';

type AuthUser = Omit<User, 'password'>;

export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    return (await apiClient(() => {
      const user = (USERS as unknown as User[]).find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!user) throw new Error('Credenciales inválidas');
      const { password: _pw, ...safeUser } = user;
      return safeUser as AuthUser;
    }, { errorProbability: 0 })).data;
  },

  async getUserById(id: string): Promise<AuthUser | null> {
    return (await apiClient(() => {
      const user = (USERS as unknown as User[]).find((u) => u.id === id);
      if (!user) return null;
      const { password: _pw, ...safeUser } = user;
      return safeUser as AuthUser;
    }, { delay: 200, errorProbability: 0 })).data;
  },

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
  },
};
