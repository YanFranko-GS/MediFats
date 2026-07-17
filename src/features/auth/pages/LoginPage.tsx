import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Stethoscope, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useAuthStore } from '../../../shared/stores/authStore';
import { avatarUrl } from '../../../shared/utils';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});
type FormData = z.infer<typeof schema>;

const DEMO_USERS = [
  { role: 'patient' as const, name: 'María López', email: 'maria.lopez@email.com', password: 'paciente123', label: 'Paciente', color: 'blue' },
  { role: 'doctor' as const, name: 'Dr. Carlos Mendoza', email: 'dr.carlos.mendoza@email.com', password: 'doctor123', label: 'Doctor', color: 'teal' },
  { role: 'admin' as const, name: 'Admin', email: 'admin@mediconnect.com', password: 'admin123', label: 'Admin', color: 'purple' },
];

const ROLE_ROUTES: Record<string, string> = {
  patient: '/dashboard/patient',
  doctor: '/dashboard/doctor',
  admin: '/dashboard/admin',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from;
  const { handleLogin, loading } = useAuth();
  const { login } = useAuthStore();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await handleLogin(data.email, data.password);
  };

  const handleDemoLogin = async (demo: typeof DEMO_USERS[0]) => {
    try {
      const { authService } = await import('../../../shared/services/authService');
      const user = await authService.login(demo.email, demo.password);
      login(user);
      toast.success(`¡Bienvenido, ${user.name.split(' ')[0]}!`);
      navigate(ROLE_ROUTES[user.role]);
    } catch {
      toast.error('Error al iniciar sesión');
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión – SMARTSALUD</title>
        <meta name="description" content="Accede a tu cuenta de SMARTSALUD para gestionar tus citas médicas." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary-600 flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute rounded-full border border-white"
                style={{ width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            ))}
          </div>
          <Link to="/" className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-white">SMARTSALUD</span>
          </Link>

          <div className="relative z-10 space-y-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl font-heading font-bold text-white leading-tight mb-4">
                Tu salud,<br />en las mejores manos
              </h1>
              <p className="text-primary-100 text-lg">
                Accede a más de 100 especialistas médicos y gestiona tus citas desde cualquier lugar.
              </p>
            </motion.div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '100+', label: 'Médicos' },
                { value: '50K+', label: 'Pacientes' },
                { value: '4.9 / 5', label: 'Calificación' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold font-data text-white">{s.value}</p>
                  <p className="text-xs text-primary-100 mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-primary-200 text-sm relative z-10">
            © 2025 SMARTSALUD · La plataforma de salud de confianza
          </p>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100">CLÍNICA <span className="text-primary-600">FAST</span></span>
            </div>

            <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> {t('common.back')}
            </Link>

            <h2 className="text-2xl font-heading font-bold text-slate-800 dark:text-slate-100 mb-1">{t('auth.welcomeBack')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Ingresa tus credenciales para continuar</p>

            {/* Demo quick access */}
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-amber-600" />
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Acceso rápido (demo)</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_USERS.map((u) => (
                  <button key={u.role} onClick={() => handleDemoLogin(u)}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all group">
                    <img src={avatarUrl(u.name)} alt={u.name} className="w-8 h-8 rounded-full" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary-600">{u.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-200 dark:border-slate-700" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-slate-900 px-3 text-slate-400">o ingresa manualmente</span></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="label-base">{t('auth.email')}</label>
                <input id="email" type="email" autoComplete="email" placeholder="tu@correo.com"
                  className={`input-base ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                  {...register('email')} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="label-base">{t('auth.password')}</label>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••"
                    className={`input-base pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                    {...register('password')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-2">
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>{t('auth.loginButton')} <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-surface-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Credenciales de prueba:</p>
              {DEMO_USERS.map((u) => (
                <button key={u.role} onClick={() => { setValue('email', u.email); setValue('password', u.password); }}
                  className="w-full flex items-center justify-between py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-left">
                  <span className="font-medium capitalize">{u.label}:</span>
                  <span className="font-mono text-slate-400">{u.email}</span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:underline">Regístrate aquí</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
