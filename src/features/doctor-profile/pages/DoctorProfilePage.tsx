import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, Clock, Globe, Star, CheckCircle2, ChevronLeft, ChevronRight, Video, MessageCircle, Building2, Award, GraduationCap, Calendar } from 'lucide-react';
import { useDoctor, useDoctorReviews, useDoctorSlots } from '../../../shared/hooks/useDoctors';
import { useBookingStore } from '../../../shared/stores/bookingStore';
import { useAuthStore } from '../../../shared/stores/authStore';
import { Skeleton, Avatar } from '../../../shared/components/atoms/index';
import { ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { cn, formatCurrency, formatRelative, getPriceBySpecialty } from '../../../shared/utils';
import { toast } from 'sonner';
import { CheckoutModal } from '../components/CheckoutModal';

const MODE_ICONS: Record<string, React.ReactNode> = {
  'in-person': <Building2 className="h-4 w-4"/>,
  'video': <Video className="h-4 w-4"/>,
  'chat': <MessageCircle className="h-4 w-4"/>,
};
const MODE_LABELS: Record<string, string> = {
  'in-person':'Presencial','video':'Videollamada','chat':'Chat médico',
};

function generateWeekDays() {
  return Array.from({ length: 7 }, (_, i) => addDays(startOfDay(new Date()), i));
}

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const setDoctor = useBookingStore(s => s.setDoctor);
  const setDate = useBookingStore(s => s.setDate);
  const setTime = useBookingStore(s => s.setTime);
  const setMode = useBookingStore(s => s.setMode);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'in-person'|'video'|'chat'>('in-person');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const { data: doctor, isLoading, isError, refetch } = useDoctor(id);
  const { data: reviewData } = useDoctorReviews(id);
  const reviews = (reviewData as any)?.data?.data ?? (reviewData as any)?.data ?? [];
  const { data: slots, isLoading: loadingSlots } = useDoctorSlots(id, format(selectedDate, 'yyyy-MM-dd'));

  const weekDays = generateWeekDays().map((d, i) => addDays(d, weekOffset * 7));

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      toast.info('Inicia sesión para reservar una cita');
      navigate('/login');
      return;
    }
    if (!selectedTime) { toast.error('Selecciona un horario'); return; }
    
    if (doctor) {
      setIsValidating(true);
      try {
        const { appointmentService } = await import('../../../shared/services/appointmentService');
        const patientAppointments = await appointmentService.getByPatient(user!.id);
        
        const targetDateStr = format(selectedDate, 'yyyy-MM-dd');
        const hasConflict = patientAppointments.some(
          appt => appt.date === targetDateStr && appt.time === selectedTime && !['cancelled', 'no-show', 'completed'].includes(appt.status)
        );
        
        if (hasConflict) {
          toast.error('Horario no disponible', { description: 'Ya tienes otra cita agendada exactamente a esta misma fecha y hora.' });
          setIsValidating(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
      setIsValidating(false);

      setDoctor(doctor as any);
      setDate(format(selectedDate, 'yyyy-MM-dd'));
      setTime(selectedTime);
      setMode(selectedMode);
      setBookingOpen(true);
    }
  };

  const handleConfirmBooking = async (paymentMethod: string) => {
    try {
      const { appointmentService } = await import('../../../shared/services/appointmentService');
      const { doctorService } = await import('../../../shared/services/doctorService');
      const status = paymentMethod === 'transfer' ? 'pending_approval' : 'scheduled';
      const price = getPriceBySpecialty(doctor!.specialty);

      await appointmentService.create({
        patientId: user!.id,
        patientName: user!.name,
        patientAvatar: user!.avatar,
        doctorId: doctor!.id,
        doctorName: doctor!.name,
        doctorAvatar: doctor!.avatar,
        doctorSpecialty: doctor!.specialty,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime!,
        duration: 30,
        status: status as any,
        mode: selectedMode,
        reason: 'Consulta médica',
        price: price,
        paymentMethod: paymentMethod as any,
        paymentVoucherUrl: paymentMethod === 'transfer' ? 'voucher_transferencia.jpg' : undefined,
      });

      await doctorService.blockDoctorSlot(doctor!.id, format(selectedDate, 'yyyy-MM-dd'), selectedTime!);

      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setBookingOpen(false);
      toast.success('¡Cita reservada con éxito!', { description: `${doctor!.name} · ${format(selectedDate,'dd MMM',{locale:es})} ${selectedTime}` });
      navigate('/dashboard/patient');
    } catch {
      toast.error('Error al reservar la cita. Inténtalo de nuevo.');
    }
  };

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Skeleton className="h-48 rounded-2xl"/>
      <div className="grid md:grid-cols-3 gap-6">
        <Skeleton className="h-64 col-span-2"/>
        <Skeleton className="h-64"/>
      </div>
    </div>
  );
  if (isError || !doctor) return <ErrorState onRetry={refetch} className="min-h-screen"/>;

  return (
    <>
      <Helmet>
        <title>{doctor.name} – {doctor.specialty} | SMARTSALUD</title>
        <meta name="description" content={`Reserva una cita con ${doctor.name}, especialista en ${doctor.specialty}.`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"Person",
          "name":doctor.name,"jobTitle":`Médico especialista en ${doctor.specialty}`,
          "description":doctor.bio,
        })}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4"/> Volver a resultados
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Profile card */}
            <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} className="card p-6">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative shrink-0">
                  <img src={doctor.avatar} alt={doctor.name}
                    className="w-28 h-28 rounded-2xl bg-primary-50 object-cover"/>
                  {doctor.isVerified && (
                    <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3"/> Verificado
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-slate-100">{doctor.name}</h1>
                      <p className="text-primary-600 dark:text-primary-400 font-semibold">{doctor.specialty}</p>
                      {doctor.subSpecialty && <p className="text-sm text-slate-500">{doctor.subSpecialty}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold font-data text-slate-800 dark:text-slate-100">{formatCurrency(getPriceBySpecialty(doctor.specialty))}</p>
                      <p className="text-xs text-slate-400">por consulta</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400"/>
                      <span className="font-semibold">{doctor.rating}</span>
                      <span className="text-slate-400">({doctor.reviewCount} reseñas)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4 text-slate-400"/>
                      {doctor.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <Globe className="h-4 w-4 text-slate-400"/>
                      {doctor.languages.join(', ')}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {(doctor.consultationModes as string[]).map(m => (
                      <span key={m} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full border border-primary-100 dark:border-primary-900">
                        {MODE_ICONS[m]} {MODE_LABELS[m]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About */}
            <div className="card p-6">
              <h2 className="text-base font-heading font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary-600"/> Acerca del doctor
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{doctor.bio}</p>
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-slate-400"/> Educación
                  </h3>
                  {(doctor.education as unknown as any[]).map((e, i) => (
                    <div key={i} className="text-sm mb-2">
                      <p className="font-medium text-slate-700 dark:text-slate-300">{e.degree}</p>
                      <p className="text-slate-500 text-xs">{e.institution} · {e.year}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-slate-400"/> Certificaciones
                  </h3>
                  {(doctor.certifications as string[]).map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-400 mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0"/>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="card p-6">
                <h2 className="text-base font-heading font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Reseñas de pacientes
                </h2>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((r: any) => (
                    <div key={r.id} className="border-b border-surface-100 dark:border-slate-800 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar src={r.patientAvatar} name={r.patientName} size="sm"/>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.patientName}</p>
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(j=><span key={j} className={j<=r.rating?'text-amber-400 text-xs':'text-slate-200 text-xs'}>★</span>)}
                            <span className="text-xs text-slate-400 ml-1">{formatRelative(r.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="space-y-5">
            <div className="card p-5 sticky top-24">
              <h2 className="text-base font-heading font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-600"/> Reservar cita
              </h2>

              {/* Mode selector */}
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Modalidad</p>
                <div className="grid grid-cols-1 gap-2">
                  {(doctor.consultationModes as string[]).map(m => (
                    <button key={m} onClick={() => setSelectedMode(m as any)}
                      className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                        selectedMode === m
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300')}>
                      {MODE_ICONS[m]} {MODE_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Week nav */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Selecciona fecha</p>
                  <div className="flex gap-1">
                    <button onClick={() => setWeekOffset(w => Math.max(0, w - 1))} disabled={weekOffset === 0}
                      className="p-1 rounded hover:bg-surface-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors">
                      <ChevronLeft className="h-3.5 w-3.5"/>
                    </button>
                    <button onClick={() => setWeekOffset(w => w + 1)}
                      className="p-1 rounded hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors">
                      <ChevronRight className="h-3.5 w-3.5"/>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day, i) => (
                    <button key={i} onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                      className={cn('flex flex-col items-center py-2 rounded-lg text-center transition-all',
                        isSameDay(day, selectedDate)
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-surface-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400')}>
                      <span className="text-xs font-medium">{format(day,'EEE',{locale:es}).slice(0,2)}</span>
                      <span className="text-sm font-bold">{format(day,'d')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slots */}
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Horarios disponibles</p>
                {loadingSlots ? (
                  <div className="grid grid-cols-3 gap-1.5">
                    {[...Array(6)].map((_,i) => <Skeleton key={i} className="h-9"/>)}
                  </div>
                ) : !slots || slots.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">Sin horarios disponibles</p>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
                    {slots.filter((s: any) => !s.isBooked).map((slot: any) => (
                      <button key={slot.id || slot.time} onClick={() => setSelectedTime(slot.time)}
                        className={cn('py-2 rounded-lg text-xs font-medium border transition-all',
                          selectedTime === slot.time
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-700')}>
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedTime && (
                <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-950/30 rounded-lg text-sm">
                  <p className="text-primary-700 dark:text-primary-400 font-medium">
                    {format(selectedDate,'EEEE dd MMM',{locale:es})} · {selectedTime}
                  </p>
                  <p className="text-primary-600 dark:text-primary-500 text-xs mt-0.5">
                    {MODE_LABELS[selectedMode]} · {formatCurrency(getPriceBySpecialty(doctor.specialty))}
                  </p>
                </div>
              )}

              <button onClick={handleBookNow} disabled={isValidating}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait">
                {isValidating ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Validando...</>
                ) : isAuthenticated ? 'Confirmar cita' : 'Iniciar sesión para reservar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onConfirm={handleConfirmBooking}
        doctor={doctor}
        selectedDate={selectedDate}
        selectedTime={selectedTime!}
        selectedMode={selectedMode}
      />
    </>
  );
}
