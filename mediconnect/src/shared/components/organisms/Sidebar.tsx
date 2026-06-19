import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, User, ClipboardList, DollarSign, RotateCcw,
  Users, BarChart2, Settings, Stethoscope,
  Star, FileText, Bell, ChevronLeft, ChevronRight,
  Activity, TrendingUp, Heart, Pill, FlaskConical,
  Video, MessageCircle, Search, Bot, ChevronDown,
  Shield, BookOpen, MessageSquare, Cpu, Map, Award,
  Lock, ScrollText, BarChart, GitBranch, Flame, UserCheck, LogOut, Globe,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useUnreadCount } from '../../hooks/usePatient';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../atoms/index';
import { cn } from '../../utils';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  badge?: number | string;
  children?: NavItem[];
}

function usePatientNav(): NavItem[] {
  const { data: unread } = useUnreadCount();
  const { t } = useTranslation();
  return [
    { label: t('sidebar.dashboard'), to: '/dashboard/patient', icon: <LayoutDashboard className="h-4 w-4" /> },
    {
      label: t('sidebar.appointments'), to: '/dashboard/patient/appointments', icon: <Calendar className="h-4 w-4" />,
      children: [
        { label: t('sidebar.upcoming'), to: '/dashboard/patient/appointments?tab=scheduled', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.history'), to: '/dashboard/patient/appointments?tab=completed', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.cancelled'), to: '/dashboard/patient/appointments?tab=cancelled', icon: <ChevronRight className="h-3 w-3" /> },
      ],
    },
    { label: t('sidebar.findDoctors'), to: '/dashboard/patient/find-doctors', icon: <Search className="h-4 w-4" /> },
    { label: t('sidebar.favorites'), to: '/dashboard/patient/favorites', icon: <Heart className="h-4 w-4" /> },
    { label: t('sidebar.medicalHistory'), to: '/dashboard/patient/history', icon: <ClipboardList className="h-4 w-4" /> },
    { label: t('sidebar.prescriptions'), to: '/dashboard/patient/prescriptions', icon: <Pill className="h-4 w-4" /> },
    { label: t('sidebar.results'), to: '/dashboard/patient/results', icon: <FlaskConical className="h-4 w-4" /> },
    { label: t('sidebar.telemedicine'), to: '/dashboard/patient/telemedicine', icon: <Video className="h-4 w-4" /> },
    { label: t('sidebar.messages'), to: '/dashboard/patient/messages', icon: <MessageCircle className="h-4 w-4" /> },
    { label: t('sidebar.myReviews'), to: '/dashboard/patient/reviews', icon: <Star className="h-4 w-4" /> },
    { label: t('sidebar.notifications'), to: '/dashboard/patient/notifications', icon: <Bell className="h-4 w-4" />, badge: (unread ?? 0) > 0 ? unread : undefined },
    { label: t('sidebar.health'), to: '/dashboard/patient/health', icon: <Activity className="h-4 w-4" /> },
    { label: t('sidebar.assistant'), to: '/dashboard/patient/assistant', icon: <Bot className="h-4 w-4" /> },
    { label: t('sidebar.profile'), to: '/dashboard/patient/profile', icon: <User className="h-4 w-4" /> },
    { label: t('sidebar.settings'), to: '/dashboard/patient/settings', icon: <Settings className="h-4 w-4" /> },
  ];
}

function useDoctorNav(): NavItem[] {
  const { t } = useTranslation();
  return [
    { label: t('sidebar.dashboard'), to: '/dashboard/doctor', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: t('sidebar.schedule'), to: '/dashboard/doctor/schedule', icon: <Calendar className="h-4 w-4" /> },
    { label: t('sidebar.patients'), to: '/dashboard/doctor/patients', icon: <Users className="h-4 w-4" /> },
    { label: t('sidebar.records'), to: '/dashboard/doctor/patients', icon: <ClipboardList className="h-4 w-4" /> },
    { label: t('sidebar.consultations'), to: '/dashboard/doctor/consultation/appt-00001', icon: <Stethoscope className="h-4 w-4" /> },
    { label: t('sidebar.prescriptions'), to: '/dashboard/doctor/prescriptions', icon: <Pill className="h-4 w-4" /> },
    { label: t('sidebar.orders'), to: '/dashboard/doctor/orders', icon: <FlaskConical className="h-4 w-4" /> },
    { label: t('sidebar.messages'), to: '/dashboard/doctor/messages', icon: <MessageCircle className="h-4 w-4" /> },
    { label: t('sidebar.telemedicine'), to: '/dashboard/doctor/telemedicine', icon: <Video className="h-4 w-4" /> },
    { label: t('sidebar.requests'), to: '/dashboard/doctor/requests', icon: <RotateCcw className="h-4 w-4" /> },
    { label: t('sidebar.reviews'), to: '/dashboard/doctor/reviews', icon: <Star className="h-4 w-4" /> },
    { label: t('sidebar.analytics'), to: '/dashboard/doctor/analytics', icon: <BarChart2 className="h-4 w-4" /> },
    { label: t('sidebar.notifications'), to: '/dashboard/doctor/notifications', icon: <Bell className="h-4 w-4" /> },
    { label: t('sidebar.assistant'), to: '/dashboard/doctor/assistant', icon: <Bot className="h-4 w-4" /> },
    { label: t('sidebar.profile'), to: '/dashboard/doctor/profile', icon: <User className="h-4 w-4" /> },
    { label: t('sidebar.settings'), to: '/dashboard/doctor/settings', icon: <Settings className="h-4 w-4" /> },
  ];
}

function useAdminNav(): NavItem[] {
  const { t } = useTranslation();
  return [
    { label: t('sidebar.dashboard'), to: '/dashboard/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
    {
      label: t('sidebar.users'), to: '/dashboard/admin/users', icon: <Users className="h-4 w-4" />,
      children: [
        { label: t('sidebar.allUsers'), to: '/dashboard/admin/users', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.admins'), to: '/dashboard/admin/users/admins', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.roles'), to: '/dashboard/admin/roles', icon: <ChevronRight className="h-3 w-3" /> },
      ],
    },
    {
      label: t('sidebar.medicalManagement'), to: '/dashboard/admin/doctors', icon: <Stethoscope className="h-4 w-4" />,
      children: [
        { label: t('sidebar.doctors'), to: '/dashboard/admin/doctors', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.specialties'), to: '/dashboard/admin/specialties', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.clinics'), to: '/dashboard/admin/clinics', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.certifications'), to: '/dashboard/admin/certifications', icon: <ChevronRight className="h-3 w-3" /> },
      ],
    },
    {
      label: t('sidebar.appointments'), to: '/dashboard/admin/appointments', icon: <Calendar className="h-4 w-4" />,
      children: [
        { label: t('sidebar.allAppointments'), to: '/dashboard/admin/appointments', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.reschedules'), to: '/dashboard/admin/appointments/reschedules', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.cancellations'), to: '/dashboard/admin/appointments/cancellations', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.globalAgenda'), to: '/dashboard/admin/appointments/agenda', icon: <ChevronRight className="h-3 w-3" /> },
      ],
    },
    {
      label: t('sidebar.finance'), to: '/dashboard/admin/finance', icon: <DollarSign className="h-4 w-4" />,
      children: [
        { label: t('sidebar.overview'), to: '/dashboard/admin/finance', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.transactions'), to: '/dashboard/admin/finance/transactions', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.payouts'), to: '/dashboard/admin/finance/payouts', icon: <ChevronRight className="h-3 w-3" /> },
      ],
    },
    {
      label: t('sidebar.analytics'), to: '/dashboard/admin/analytics', icon: <BarChart className="h-4 w-4" />,
      children: [
        { label: t('sidebar.execKpis'), to: '/dashboard/admin/analytics', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.revenue'), to: '/dashboard/admin/analytics/revenue', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.funnel'), to: '/dashboard/admin/analytics/funnel', icon: <ChevronRight className="h-3 w-3" /> },
        { label: t('sidebar.heatmaps'), to: '/dashboard/admin/analytics/heatmaps', icon: <ChevronRight className="h-3 w-3" /> },
      ],
    },
    {
      label: t('sidebar.reviews'), to: '/dashboard/admin/moderation', icon: <Star className="h-4 w-4" />,
      children: [
        { label: t('sidebar.moderation'), to: '/dashboard/admin/moderation', icon: <ChevronRight className="h-3 w-3" /> },
      ],
    },
    {
      label: t('sidebar.support'), to: '/dashboard/admin/support', icon: <MessageSquare className="h-4 w-4" />,
      children: [
        { label: t('sidebar.tickets'), to: '/dashboard/admin/support', icon: <ChevronRight className="h-3 w-3" /> },
      ],
    },
    { label: t('sidebar.assistant'), to: '/dashboard/admin/ai', icon: <Bot className="h-4 w-4" /> },
    { label: t('sidebar.reports'), to: '/dashboard/admin/reports', icon: <FileText className="h-4 w-4" /> },
    { label: t('sidebar.security'), to: '/dashboard/admin/security', icon: <Shield className="h-4 w-4" /> },
    { label: t('sidebar.audit'), to: '/dashboard/admin/audit', icon: <ScrollText className="h-4 w-4" /> },
    { label: t('sidebar.activity'), to: '/dashboard/admin/activity', icon: <Activity className="h-4 w-4" /> },
    { label: t('sidebar.settings'), to: '/dashboard/admin/settings', icon: <Settings className="h-4 w-4" /> },
  ];
}

const roleColors: Record<string, string> = { patient: 'bg-blue-500', doctor: 'bg-teal-500', admin: 'bg-purple-500' };
const roleLabels: Record<string, string> = { patient: 'Paciente', doctor: 'Doctor', admin: 'Administrador' };

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const isActive = location.pathname === item.to || (!item.children && location.pathname.startsWith(item.to) && item.to !== '/dashboard/patient');
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <div className={cn('sidebar-link relative', isActive && 'sidebar-link-active', collapsed && 'justify-center px-2')}
        onClick={hasChildren ? () => setExpanded(e => !e) : undefined}
        style={{ cursor: hasChildren ? 'pointer' : undefined }}>
        {hasChildren ? (
          <>
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <><span className="flex-1 truncate text-sm">{item.label}</span>
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform shrink-0', expanded && 'rotate-180')} /></>}
          </>
        ) : (
          <Link to={item.to} title={collapsed ? item.label : undefined} className="flex items-center gap-3 w-full">
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="flex-1 truncate text-sm">{item.label}</span>}
            {!collapsed && item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none font-bold min-w-[18px] text-center">
                {item.badge}
              </span>
            )}
          </Link>
        )}
        {collapsed && item.badge && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </div>
      {hasChildren && expanded && !collapsed && (
        <div className="ml-7 mt-0.5 space-y-0.5 border-l border-surface-200 dark:border-slate-700 pl-3">
          {item.children!.map(child => (
            <Link key={child.to} to={child.to}
              className={cn('block py-1.5 px-2 text-xs rounded-lg transition-colors',
                location.pathname === child.to || location.search.includes(child.to.split('?')[1] ?? '____')
                  ? 'text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200')}>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, language, setLanguage } = useUIStore();
  const { t, i18n } = useTranslation();
  const patientNav = usePatientNav();
  const doctorNav = useDoctorNav();
  const adminNav = useAdminNav();

  if (!user) return null;

  const handleLanguage = () => {
    const next = language === 'es' ? 'en' : 'es';
    setLanguage(next);
    i18n.changeLanguage(next);
  };

  const navItems = user.role === 'patient' ? patientNav : user.role === 'doctor' ? doctorNav : adminNav;

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={toggleSidebar} aria-hidden="true" />
      )}
      <aside className={cn(
        'fixed left-0 top-0 bottom-0 z-30 flex flex-col bg-white dark:bg-slate-950 border-r border-surface-200 dark:border-slate-800 transition-all duration-300',
        sidebarOpen ? 'w-60' : 'w-16',
        !sidebarOpen && 'max-md:w-0 max-md:overflow-hidden'
      )} aria-label="Navegación lateral">

        <div className={cn('p-3 border-b border-surface-200 dark:border-slate-800 overflow-hidden', !sidebarOpen && 'px-2')}>
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={user.avatar} name={user.name} size="sm" />
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                <span className={cn('inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full text-white', roleColors[user.role])}>
                  {roleLabels[user.role]}
                </span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {navItems.map(item => (
            <NavLink key={item.to} item={item} collapsed={!sidebarOpen} />
          ))}
        </nav>

        <div className="p-2 border-t border-surface-200 dark:border-slate-800 flex flex-col gap-1">
          <button onClick={handleLanguage}
            className={cn('sidebar-link text-slate-500 hover:bg-surface-100 dark:hover:bg-slate-800', !sidebarOpen && 'justify-center px-2')}
            aria-label="Cambiar idioma">
            <Globe className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">{language === 'es' ? 'English' : 'Español'}</span>}
          </button>
          <button onClick={() => { logout(); window.location.href = '/'; }}
            className={cn('sidebar-link text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20', !sidebarOpen && 'justify-center px-2')}
            aria-label="Cerrar sesión">
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">{t('auth.logout')}</span>}
          </button>
          <button onClick={toggleSidebar}
            className="sidebar-link w-full justify-center text-slate-500"
            aria-label={sidebarOpen ? 'Colapsar menú' : 'Expandir menú'}>
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
