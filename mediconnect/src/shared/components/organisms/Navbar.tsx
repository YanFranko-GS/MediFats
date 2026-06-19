import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Menu, X, Sun, Moon, Monitor, Globe, LogOut, User, 
  ChevronDown, Stethoscope, LayoutDashboard, Zap
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { Avatar } from '../atoms/index';
import { Button } from '../atoms/Button';
import { cn, avatarUrl } from '../../utils';
import { useScrollTop, useClickOutside } from '../../hooks';
import { toast } from 'sonner';



const ROLE_ROUTES: Record<string, string> = {
  patient: '/dashboard/patient',
  doctor: '/dashboard/doctor',
  admin: '/dashboard/admin',
};

const ROLE_LABELS: Record<string, string> = {
  patient: 'Paciente',
  doctor: 'Doctor',
  admin: 'Admin',
};

export function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, switchRole } = useAuthStore();
  const { theme, setTheme, language, setLanguage } = useUIStore();
  const isTop = useScrollTop();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const userMenuRef = useClickOutside<HTMLDivElement>(() => setUserMenuOpen(false));
  const roleMenuRef = useClickOutside<HTMLDivElement>(() => setRoleMenuOpen(false));

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Sesión cerrada correctamente');
  };


  const handleLanguage = () => {
    const next = language === 'es' ? 'en' : 'es';
    setLanguage(next);
    i18n.changeLanguage(next);
  };

  const cycleTheme = () => {
    const themes = ['light', 'dark'] as const;
    const next = themes[(themes.indexOf(theme as 'light' | 'dark') + 1) % themes.length];
    setTheme(next);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isTop
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-transparent'
          : 'bg-white dark:bg-slate-950 border-b border-surface-200 dark:border-slate-800 shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100">
            CLÍNICA <span className="text-primary-600">FAST</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {[
            { to: '/', label: t('nav.home') },
            { to: '/doctors', label: t('nav.doctors') },
            { to: '/specialties', label: t('nav.specialties') },
            { to: '/how-it-works', label: t('nav.howItWorks') },
            { to: '/about', label: t('nav.about') },
          ].map(link => (
            <Link key={link.to} to={link.to}
              className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">


          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Language */}
          <button
            onClick={handleLanguage}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Cambiar idioma"
          >
            <Globe className="h-4 w-4" />
          </button>

          {/* Auth */}
          {isAuthenticated && user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 card shadow-card-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-surface-200 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate(ROLE_ROUTES[user.role]); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-surface-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </button>
                  <button
                    onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-surface-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="h-4 w-4" /> Mi perfil
                  </button>
                  <div className="border-t border-surface-200 dark:border-slate-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate('/login')}>
              {t('auth.login')}
            </Button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1">
          {[
            { to: '/', label: t('nav.home') },
            { to: '/doctors', label: t('nav.doctors') },
            { to: '/specialties', label: t('nav.specialties') },
            { to: '/how-it-works', label: t('nav.howItWorks') },
            { to: '/about', label: t('nav.about') },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

        </div>
      )}
    </header>
  );
}
