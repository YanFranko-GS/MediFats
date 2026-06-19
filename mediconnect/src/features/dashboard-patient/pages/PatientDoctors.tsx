import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Calendar, Star } from 'lucide-react';
import { usePatientAppointments } from '../../../shared/hooks/useAppointments';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton } from '../../../shared/components/atoms/index';
import { formatCurrency, formatDate } from '../../../shared/utils';

export default function PatientDoctors() {
  const { t } = useTranslation();
  const { data: appointments, isLoading } = usePatientAppointments();

  // Deduplicate doctors
  const doctorMap: Record<string, { doctorId: string; doctorName: string; doctorAvatar: string; doctorSpecialty: string; lastVisit: string; totalVisits: number; totalSpent: number }> = {};
  (appointments || []).filter(a => a.status === 'completed').forEach(a => {
    if (!doctorMap[a.doctorId]) {
      doctorMap[a.doctorId] = { doctorId: a.doctorId, doctorName: a.doctorName, doctorAvatar: a.doctorAvatar, doctorSpecialty: a.doctorSpecialty, lastVisit: a.date, totalVisits: 0, totalSpent: 0 };
    }
    doctorMap[a.doctorId].totalVisits++;
    doctorMap[a.doctorId].totalSpent += a.price;
    if (a.date > doctorMap[a.doctorId].lastVisit) doctorMap[a.doctorId].lastVisit = a.date;
  });
  const myDoctors = Object.values(doctorMap).sort((a, b) => b.totalVisits - a.totalVisits);

  return (
    <>
      <Helmet><title>Mis Médicos – MediConnect</title></Helmet>
      <PageHeader title="Mis Médicos" subtitle="Especialistas con quienes has tenido consultas"
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Mis Médicos' }]} />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : myDoctors.length === 0 ? (
        <div className="card p-16 text-center">
          <Stethoscope className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">Aún no tienes médicos en tu historial</p>
          <Link to="/doctors" className="btn-primary text-sm">{t('patientDashboard.findDoctors')}</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myDoctors.map((doc, i) => (
            <motion.div key={doc.doctorId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="card card-hover p-5">
                <div className="flex items-center gap-3 mb-4">
                  <img src={doc.doctorAvatar} alt={doc.doctorName} className="w-14 h-14 rounded-xl object-cover bg-primary-50" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{doc.doctorName}</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400">{doc.doctorSpecialty}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div><p className="text-lg font-bold font-data text-primary-600">{doc.totalVisits}</p><p className="text-xs text-slate-400">Consultas</p></div>
                  <div><p className="text-lg font-bold font-data text-green-600">{formatCurrency(doc.totalSpent)}</p><p className="text-xs text-slate-400">Total</p></div>
                  <div><p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">{formatDate(doc.lastVisit, 'dd MMM')}</p><p className="text-xs text-slate-400">Última visita</p></div>
                </div>
                <Link to={`/doctor/${doc.doctorId}`} className="btn-outline w-full text-sm text-center block py-2">
                  Reservar nueva cita
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
