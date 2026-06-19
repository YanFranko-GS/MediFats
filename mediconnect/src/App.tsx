import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { PublicLayout, DashboardLayout, ProtectedRoute } from './shared/components/organisms/Layouts';
import { Spinner } from './shared/components/atoms/index';
import { useUIStore } from './shared/stores/uiStore';
import './shared/i18n';

const LandingPage = lazy(() => import('./features/landing/pages/LandingPage'));
const DoctorsPage = lazy(() => import('./features/landing/pages/DoctorsPage'));
const SpecialtiesPage = lazy(() => import('./features/landing/pages/SpecialtiesPage'));
const DoctorProfilePage = lazy(() => import('./features/doctor-profile/pages/DoctorProfilePage'));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const PatientDashboard = lazy(() => import('./features/dashboard-patient/pages/PatientDashboard'));
const DoctorDashboard = lazy(() => import('./features/dashboard-doctor/pages/DoctorDashboard'));
const AdminDashboard = lazy(() => import('./features/dashboard-admin/pages/AdminDashboard'));
const AboutPage = lazy(() => import('./features/landing/pages/AboutPage'));
const HowItWorksPage = lazy(() => import('./features/landing/pages/HowItWorksPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-slate-950">
      <div className="text-center space-y-3">
        <Spinner size="lg" />
        <p className="text-sm text-slate-500 font-medium">Cargando...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { theme } = useUIStore();

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast');
    if (theme === 'dark') root.classList.add('dark');
    if (theme === 'high-contrast') root.classList.add('high-contrast');
  }, [theme]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/doctors" element={<PublicLayout><DoctorsPage /></PublicLayout>} />
            <Route path="/specialties" element={<PublicLayout><SpecialtiesPage /></PublicLayout>} />
            <Route path="/doctor/:id" element={<PublicLayout><DoctorProfilePage /></PublicLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
            <Route path="/dashboard/patient/*" element={
              <ProtectedRoute requiredRole="patient">
                <DashboardLayout><PatientDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/doctor/*" element={
              <ProtectedRoute requiredRole="doctor">
                <DashboardLayout><DoctorDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout><AdminDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors closeButton
          toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' } }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
