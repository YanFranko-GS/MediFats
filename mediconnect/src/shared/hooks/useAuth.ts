import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

const ROLE_ROUTES: Record<string, string> = {
  patient: '/dashboard/patient',
  doctor: '/dashboard/doctor',
  admin: '/dashboard/admin',
};

export function useAuth() {
  const { user, isAuthenticated, role, login, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const authUser = await authService.login(email, password);
      login(authUser);
      toast.success(`¡Bienvenido, ${authUser.name.split(' ')[0]}!`);
      navigate(ROLE_ROUTES[authUser.role] || '/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/');
    toast.success('Sesión cerrada correctamente');
  };

  return { user, isAuthenticated, role, loading, error, handleLogin, handleLogout };
}
