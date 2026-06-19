import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';

type AuthUser = Omit<User, 'password'>;

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  switchRole: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      role: null,

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          role: user.role,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          role: null,
        }),

      switchRole: (user) =>
        set({
          user,
          isAuthenticated: true,
          role: user.role,
        }),
    }),
    {
      name: 'mediconnect-auth',
    }
  )
);
