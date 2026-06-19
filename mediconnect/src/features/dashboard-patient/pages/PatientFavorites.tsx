import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Calendar, Trash2 } from 'lucide-react';
import { DOCTORS } from '../../../data/doctors';
import { usePatientStore } from '../../../shared/stores/patientStore';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { cn, formatCurrency } from '../../../shared/utils';
import { toast } from 'sonner';

const ALL_DOCTORS = DOCTORS as unknown as unknown as any[];

export default function PatientFavorites() {
  const { t } = useTranslation();
  const { favoriteIds, removeFavorite } = usePatientStore();
  const favorites = ALL_DOCTORS.filter(d => favoriteIds.includes(d.id));

  const handleRemove = (doctorId: string, name: string) => {
    removeFavorite(doctorId);
    toast.success(`${name} eliminado de favoritos`);
  };

  return (
    <>
      <Helmet><title>{t('patientDashboard.favoritesTitle')}</title></Helmet>
      <PageHeader title="Médicos Favoritos" subtitle={`${favorites.length} médicos guardados`}
        breadcrumb={[{ label: t('patientDashboard.dashboard'), href: '/dashboard/patient' }, { label: 'Favoritos' }]} />

      {favorites.length === 0 ? (
        <div className="card p-16 text-center">
          <Heart className="h-14 w-14 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('patientDashboard.noFavorites')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t('patientDashboard.saveFavorites')}</p>
          <Link to="/dashboard/patient/find-doctors" className="btn-primary text-sm inline-flex items-center gap-2">
            <Heart className="h-4 w-4" /> Buscar médicos
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((doc: any, i: number) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className="card p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <img src={doc.avatar} alt={doc.name} className="w-14 h-14 rounded-xl object-cover bg-primary-50" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">{doc.specialty}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.hospital}</p>
                  </div>
                  <button onClick={() => handleRemove(doc.id, doc.name)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(j => <span key={j} className={j <= Math.round(doc.rating) ? 'text-amber-400 text-sm' : 'text-slate-200 dark:text-slate-700 text-sm'}>★</span>)}
                  <span className="text-xs text-slate-400 ml-1">{doc.rating} · {doc.reviewCount} reseñas</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(doc.price)}<span className="text-xs font-normal text-slate-400">/consulta</span></span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', doc.isAvailable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500')}>
                    {doc.isAvailable ? '● Disponible' : 'No disponible'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-100 dark:border-slate-800">
                  <Link to={`/doctor/${doc.id}`} className="btn-primary text-xs py-2 text-center flex items-center justify-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Reservar
                  </Link>
                  <Link to="/dashboard/patient/messages" className="btn-outline text-xs py-2 text-center flex items-center justify-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" /> Mensaje
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
