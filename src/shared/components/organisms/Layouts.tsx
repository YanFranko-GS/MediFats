import React from 'react';
import { Heart } from 'lucide-react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Chatbot } from './Chatbot';
import { OfflineBanner } from '../molecules/StatusComponents';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../utils';
import type { UserRole } from '../../types';

// ─── PROTECTED ROUTE ────────────────────────────────────────────────────────
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    const routes: Record<string, string> = {
      patient: '/dashboard/patient',
      doctor: '/dashboard/doctor',
      admin: '/dashboard/admin',
    };
    return <Navigate to={routes[role || 'patient'] || '/'} replace />;
  }

  return <>{children}</>;
}

// ─── PUBLIC LAYOUT ──────────────────────────────────────────────────────────
export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-slate-950">
      <OfflineBanner />
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  );
}

// ─── DASHBOARD LAYOUT ───────────────────────────────────────────────────────
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-slate-950">
      <OfflineBanner />
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-950 border-b border-surface-200 dark:border-slate-800">
        <span className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100">
          CLÍNICA <span className="text-primary-600">FAST</span>
        </span>
        <button onClick={toggleSidebar} className="p-2 -mr-2 text-slate-600 dark:text-slate-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <Sidebar />
      <main className={cn('transition-all duration-300', sidebarOpen ? 'md:pl-60' : 'md:pl-16')}>
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
      <Chatbot />
    </div>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-clinical-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="font-display font-semibold text-xl text-white mb-3 tracking-tight">
              Clínica <span className="text-vital-400 italic">Fast</span>
            </h3>
            <p className="text-sm text-clinical-200">
              {t('footer.description')}
            </p>
          </div>
          {[
            {
              title: t('footer.platform'),
              links: [
                { label: t('nav.doctors'), to: '/doctors' },
                { label: t('nav.specialties'), to: '/specialties' },
                { label: t('nav.howItWorks'), to: '/how-it-works' },
                { label: t('nav.about'), to: '/about' },
              ]
            },
            {
              title: t('footer.forDoctors'),
              links: [
                { label: t('footer.joinAsDoctor'), to: '/login' },
                { label: t('footer.doctorPanel'), to: '/dashboard/doctor' },
                { label: t('footer.manageSchedule'), to: '/dashboard/doctor' },
                { label: t('footer.support'), to: '/about' },
              ]
            },
            {
              title: t('footer.legal'),
              links: [
                { label: t('footer.terms'), to: '/about' },
                { label: t('footer.privacy'), to: '/about' },
                { label: t('footer.cookies'), to: '/about' },
                { label: t('footer.accessibility'), to: '/about' },
              ]
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-clinical-200 hover:text-vital-400 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-clinical-700/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-clinical-300">© 2025 Clínica Fast. {t('footer.rights')}.</p>
          <p className="text-xs text-clinical-300 flex items-center gap-1">{t('footer.madeWith')} <Heart className="h-3 w-3 fill-vital-500 text-vital-500"/> {t('footer.forPeru')}</p>
        </div>
      </div>
    </footer>
  );
}
