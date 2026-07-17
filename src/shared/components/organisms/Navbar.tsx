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
  const { theme, setTheme, language, setLanguage, fontSize, setFontSize } = useUIStore();
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
          ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-transparent'
          : 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-mist-200 dark:border-slate-800 shadow-clinical-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-clinical-700 rounded-lg flex items-center justify-center">
            <Stethoscope className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-lg text-ink-900 dark:text-slate-100 tracking-tight">
            Clínica <span className="text-clinical-700 dark:text-clinical-300 italic">Fast</span>
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
              className="px-3 py-2 text-sm font-medium text-ink-700 dark:text-slate-400 hover:text-clinical-700 dark:hover:text-slate-100 rounded-lg hover:bg-mist-100 dark:hover:bg-slate-800 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* Text Size Accessibility */}
          <div className="hidden sm:flex items-center bg-surface-100 dark:bg-slate-800 rounded-lg p-0.5" aria-label="Tamaño de texto">
            <button
              onClick={() => {
                const sizes = ['sm', 'md', 'lg', 'xl'] as const;
                const currentIndex = sizes.indexOf(fontSize);
                if (currentIndex > 0) setFontSize(sizes[currentIndex - 1]);
              }}
              disabled={fontSize === 'sm'}
              className="px-2.5 py-1 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
              aria-label="Disminuir texto"
            >
              A-
            </button>
            <button
              onClick={() => {
                const sizes = ['sm', 'md', 'lg', 'xl'] as const;
                const currentIndex = sizes.indexOf(fontSize);
                if (currentIndex < sizes.length - 1) setFontSize(sizes[currentIndex + 1]);
              }}
              disabled={fontSize === 'xl'}
              className="px-2.5 py-1 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
              aria-label="Aumentar texto"
            >
              A+
            </button>
          </div>
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
          
          {/* Mobile Text Size */}
          <div className="pt-2 pb-1 border-t border-surface-200 dark:border-slate-800 mt-2">
            <p className="px-3 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Tamaño de texto</p>
            <div className="flex gap-2 px-3">
              <button
                onClick={() => {
                  const sizes = ['sm', 'md', 'lg', 'xl'] as const;
                  const currentIndex = sizes.indexOf(fontSize);
                  if (currentIndex > 0) setFontSize(sizes[currentIndex - 1]);
                }}
                disabled={fontSize === 'sm'}
                className="flex-1 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-surface-100 dark:bg-slate-800 hover:bg-surface-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
              >
                A-
              </button>
              <button
                onClick={() => {
                  const sizes = ['sm', 'md', 'lg', 'xl'] as const;
                  const currentIndex = sizes.indexOf(fontSize);
                  if (currentIndex < sizes.length - 1) setFontSize(sizes[currentIndex + 1]);
                }}
                disabled={fontSize === 'xl'}
                className="flex-1 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-surface-100 dark:bg-slate-800 hover:bg-surface-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
              >
                A+
              </button>
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
