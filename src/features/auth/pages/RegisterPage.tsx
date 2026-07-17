import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Stethoscope, Eye, EyeOff, ArrowRight, Phone, MapPin, Droplet, Calendar, Mail, Shield, User, Heart, Lock } from 'lucide-react';
import { toast } from 'sonner';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;
const EPS_LIST = ['EsSalud', 'RIMAC', 'Pacífico', 'La Positiva', 'Mapfre', 'SIS', 'Sanitas', 'Ninguno'] as const;

const registerSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  phone: z.string().regex(/^\+?[\d\s-]{9,}$/, 'Número de teléfono inválido'),
  address: z.string().min(5, 'La dirección es muy corta'),
  bloodType: z.enum(BLOOD_TYPES, { message: 'Selecciona un tipo de sangre' }),
  birthDate: z.string().min(1, 'Selecciona tu fecha de nacimiento'),
  email: z.string().email('Correo electrónico inválido'),
  eps: z.enum(EPS_LIST, { message: 'Selecciona una EPS' }),
  affiliateNum: z.string().min(3, 'Número de afiliado inválido'),
  emergencyName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  emergencyPhone: z.string().regex(/^\+?[\d\s-]{9,}$/, 'Número de teléfono inválido'),
  emergencyRelation: z.string().min(2, 'Ingresa el parentesco'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: 'maria.lopez@email.com', // Pre-filled from a previous step as requested
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('¡Registro completado con éxito!');
      navigate('/login');
    } catch (error) {
      toast.error('Ocurrió un error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Registro de Paciente – MediConnect</title></Helmet>
      <div className="min-h-screen bg-surface-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl text-slate-800 dark:text-slate-100">
                CLÍNICA <span className="text-primary-600">FAST</span>
              </span>
            </div>
            <h2 className="text-3xl font-heading font-bold text-slate-800 dark:text-slate-100">Crea tu cuenta</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Completa tus datos para acceder a tu historial médico y reservar citas</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-surface-200 dark:border-slate-800">
              
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-6">
                <ArrowLeft className="h-4 w-4" /> Volver al login
              </Link>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
                
                {/* Información Personal */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4 border-b border-surface-100 dark:border-slate-800 pb-2">
                    <User className="h-5 w-5 text-primary-600" /> Información Personal
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="label-base">Nombre completo</label>
                      <input type="text" placeholder="Ej: María López" className={`input-base ${errors.fullName ? 'border-red-400' : ''}`} {...register('fullName')} />
                      {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
                    </div>

                    <div>
                      <label className="label-base flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" /> Teléfono</label>
                      <input type="tel" placeholder="+51 999 123 456" className={`input-base ${errors.phone ? 'border-red-400' : ''}`} {...register('phone')} />
                      {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="label-base flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> Dirección</label>
                      <input type="text" placeholder="La Molina, Lima" className={`input-base ${errors.address ? 'border-red-400' : ''}`} {...register('address')} />
                      {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                    </div>

                    <div>
                      <label className="label-base flex items-center gap-1.5"><Droplet className="h-3.5 w-3.5 text-red-400" /> Tipo de sangre</label>
                      <select className={`input-base ${errors.bloodType ? 'border-red-400' : ''}`} {...register('bloodType')}>
                        <option value="">Seleccionar...</option>
                        {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                      </select>
                      {errors.bloodType && <p className="mt-1 text-xs text-red-500">{errors.bloodType.message}</p>}
                    </div>

                    <div>
                      <label className="label-base flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" /> Fecha de nacimiento</label>
                      <input type="date" className={`input-base ${errors.birthDate ? 'border-red-400' : ''}`} {...register('birthDate')} />
                      {errors.birthDate && <p className="mt-1 text-xs text-red-500">{errors.birthDate.message}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="label-base flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" /> Correo electrónico <span className="text-xs font-normal text-slate-400 ml-1">(no editable)</span></label>
                      <input type="email" readOnly className="input-base bg-surface-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed" {...register('email')} />
                    </div>
                  </div>
                </div>

                {/* Seguro Médico */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4 border-b border-surface-100 dark:border-slate-800 pb-2">
                    <Shield className="h-5 w-5 text-green-600" /> Seguro Médico
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-base">EPS / Aseguradora</label>
                      <select className={`input-base ${errors.eps ? 'border-red-400' : ''}`} {...register('eps')}>
                        <option value="">Seleccionar...</option>
                        {EPS_LIST.map(eps => <option key={eps} value={eps}>{eps}</option>)}
                      </select>
                      {errors.eps && <p className="mt-1 text-xs text-red-500">{errors.eps.message}</p>}
                    </div>

                    <div>
                      <label className="label-base">Número de afiliado</label>
                      <input type="text" placeholder="ES-20454812" className={`input-base ${errors.affiliateNum ? 'border-red-400' : ''}`} {...register('affiliateNum')} />
                      {errors.affiliateNum && <p className="mt-1 text-xs text-red-500">{errors.affiliateNum.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Contacto de Emergencia */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4 border-b border-surface-100 dark:border-slate-800 pb-2">
                    <Heart className="h-5 w-5 text-red-500" /> Contacto de Emergencia
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="label-base">Nombre completo</label>
                      <input type="text" placeholder="Jorge López" className={`input-base ${errors.emergencyName ? 'border-red-400' : ''}`} {...register('emergencyName')} />
                      {errors.emergencyName && <p className="mt-1 text-xs text-red-500">{errors.emergencyName.message}</p>}
                    </div>

                    <div>
                      <label className="label-base">Teléfono</label>
                      <input type="tel" placeholder="+51 999 654 321" className={`input-base ${errors.emergencyPhone ? 'border-red-400' : ''}`} {...register('emergencyPhone')} />
                      {errors.emergencyPhone && <p className="mt-1 text-xs text-red-500">{errors.emergencyPhone.message}</p>}
                    </div>

                    <div>
                      <label className="label-base">Parentesco</label>
                      <input type="text" placeholder="Esposo" className={`input-base ${errors.emergencyRelation ? 'border-red-400' : ''}`} {...register('emergencyRelation')} />
                      {errors.emergencyRelation && <p className="mt-1 text-xs text-red-500">{errors.emergencyRelation.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Seguridad */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4 border-b border-surface-100 dark:border-slate-800 pb-2">
                    <Lock className="h-5 w-5 text-slate-600 dark:text-slate-400" /> Seguridad de la cuenta
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="label-base">Contraseña</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                          className={`input-base pr-10 ${errors.password ? 'border-red-400' : ''}`}
                          {...register('password')} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                      <p className="mt-2 text-xs text-slate-400">La contraseña debe tener al menos 8 caracteres.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-200 dark:border-slate-800">
                  <button type="submit" disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3">
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Completar registro <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
