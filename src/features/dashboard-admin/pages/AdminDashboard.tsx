import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Skeleton } from '../../../shared/components/atoms/index';

const AdminHome = lazy(() => import('./AdminHome'));
const AdminUsers = lazy(() => import('./AdminUsers'));
const AdminRoles = lazy(() => import('./AdminRoles'));
const AdminDoctors = lazy(() => import('./AdminDoctors'));
const AdminSpecialties = lazy(() => import('./AdminSpecialties'));
const AdminClinics = lazy(() => import('./AdminClinics'));
const AdminCertifications = lazy(() => import('./AdminCertifications'));
const AdminAppointments = lazy(() => import('./AdminAppointments'));
const AdminFinance = lazy(() => import('./AdminFinance'));
const AdminAnalytics = lazy(() => import('./AdminAnalytics'));
const AdminAnalyticsRevenue = lazy(() => import('./AdminAnalyticsRevenue'));
const AdminAnalyticsFunnel = lazy(() => import('./AdminAnalyticsFunnel'));
const AdminAnalyticsHeatmaps = lazy(() => import('./AdminAnalyticsHeatmaps'));
const AdminModeration = lazy(() => import('./AdminModeration'));
const AdminSupport = lazy(() => import('./AdminSupport'));
const AdminAI = lazy(() => import('./AdminAI'));
const AdminReports = lazy(() => import('./AdminReports'));
const AdminSecurity = lazy(() => import('./AdminSecurity'));
const AdminAudit = lazy(() => import('./AdminAudit'));
const AdminActivity = lazy(() => import('./AdminActivity'));
const AdminSettings = lazy(() => import('./AdminSettings'));

function PageFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/admins" element={<AdminUsers filterRole="admin" />} />
        <Route path="roles" element={<AdminRoles />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="specialties" element={<AdminSpecialties />} />
        <Route path="clinics" element={<AdminClinics />} />
        <Route path="certifications" element={<AdminCertifications />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="appointments/reschedules" element={<AdminAppointments filter="rescheduled" />} />
        <Route path="appointments/cancellations" element={<AdminAppointments filter="cancelled" />} />
        <Route path="appointments/agenda" element={<AdminAppointments view="agenda" />} />
        <Route path="finance" element={<AdminFinance />} />
        <Route path="finance/transactions" element={<AdminFinance tab="transactions" />} />
        <Route path="finance/payouts" element={<AdminFinance tab="payouts" />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="analytics/revenue" element={<AdminAnalyticsRevenue />} />
        <Route path="analytics/funnel" element={<AdminAnalyticsFunnel />} />
        <Route path="analytics/heatmaps" element={<AdminAnalyticsHeatmaps />} />
        <Route path="moderation" element={<AdminModeration />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="ai" element={<AdminAI />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="security" element={<AdminSecurity />} />
        <Route path="audit" element={<AdminAudit />} />
        <Route path="activity" element={<AdminActivity />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </Suspense>
  );
}
