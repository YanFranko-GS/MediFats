import { useTranslation } from 'react-i18next';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientHome from './PatientHome';
import PatientAppointments from './PatientAppointments';
import PatientHistory from './PatientHistory';
import PatientDoctors from './PatientDoctors';
import PatientProfile from './PatientProfile';
import PatientFindDoctors from './PatientFindDoctors';
import PatientFavorites from './PatientFavorites';
import PatientPrescriptions from './PatientPrescriptions';
import PatientResults from './PatientResults';
import PatientTelemedicine from './PatientTelemedicine';
import PatientMessages from './PatientMessages';
import PatientReviews from './PatientReviews';
import PatientNotifications from './PatientNotifications';
import PatientHealth from './PatientHealth';
import PatientAssistant from './PatientAssistant';
import PatientSettings from './PatientSettings';

export default function PatientDashboard() {
  return (
    <Routes>
      <Route index element={<PatientHome />} />
      <Route path="appointments" element={<PatientAppointments />} />
      <Route path="history" element={<PatientHistory />} />
      <Route path="doctors" element={<PatientDoctors />} />
      <Route path="profile" element={<PatientProfile />} />
      <Route path="find-doctors" element={<PatientFindDoctors />} />
      <Route path="favorites" element={<PatientFavorites />} />
      <Route path="prescriptions" element={<PatientPrescriptions />} />
      <Route path="results" element={<PatientResults />} />
      <Route path="telemedicine" element={<PatientTelemedicine />} />
      <Route path="messages" element={<PatientMessages />} />
      <Route path="reviews" element={<PatientReviews />} />
      <Route path="notifications" element={<PatientNotifications />} />
      <Route path="health" element={<PatientHealth />} />
      <Route path="assistant" element={<PatientAssistant />} />
      <Route path="settings" element={<PatientSettings />} />
    </Routes>
  );
}
