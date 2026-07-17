import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorHome from './DoctorHome';
import DoctorSchedule from './DoctorSchedule';
import DoctorPatients from './DoctorPatients';
import DoctorPatientDetail from './DoctorPatientDetail';
import DoctorConsultation from './DoctorConsultation';
import DoctorPrescriptions from './DoctorPrescriptions';
import DoctorOrders from './DoctorOrders';
import DoctorTelemedicine from './DoctorTelemedicine';
import DoctorMessages from './DoctorMessages';
import DoctorRequests from './DoctorRequests';
import DoctorFinance from './DoctorFinance';
import DoctorAnalytics from './DoctorAnalytics';
import DoctorReviews from './DoctorReviews';
import DoctorProfile from './DoctorProfile';
import DoctorSettings from './DoctorSettings';
import DoctorNotifications from './DoctorNotifications';
import DoctorAssistant from './DoctorAssistant';

export default function DoctorDashboard() {
  return (
    <Routes>
      <Route index element={<DoctorHome />} />
      <Route path="schedule" element={<DoctorSchedule />} />
      <Route path="patients" element={<DoctorPatients />} />
      <Route path="patients/:id" element={<DoctorPatientDetail />} />
      <Route path="consultation/:appointmentId" element={<DoctorConsultation />} />
      <Route path="prescriptions" element={<DoctorPrescriptions />} />
      <Route path="orders" element={<DoctorOrders />} />
      <Route path="telemedicine" element={<DoctorTelemedicine />} />
      <Route path="messages" element={<DoctorMessages />} />
      <Route path="requests" element={<DoctorRequests />} />
      <Route path="finance" element={<DoctorFinance />} />
      <Route path="analytics" element={<DoctorAnalytics />} />
      <Route path="reviews" element={<DoctorReviews />} />
      <Route path="profile" element={<DoctorProfile />} />
      <Route path="settings" element={<DoctorSettings />} />
      <Route path="notifications" element={<DoctorNotifications />} />
      <Route path="assistant" element={<DoctorAssistant />} />
    </Routes>
  );
}
