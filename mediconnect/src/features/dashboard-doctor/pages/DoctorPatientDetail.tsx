import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, User, ClipboardList, Pill, FlaskConical, AlertTriangle, Scissors, Users, Activity, Calendar, MessageCircle, Mail, Phone, Building2, Stethoscope } from 'lucide-react';
import { useDoctorPatient, usePatientHistory } from '../../../shared/hooks/useDoctor';
import { PageHeader, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton } from '../../../shared/components/atoms/index';
import { cn, formatDate, formatCurrency, statusColors } from '../../../shared/utils';

const TABS = ['info','history','diagnoses','medications','allergies','results'] as const;
const TAB_LABELS: Record<string,string> = { info:'Info General', history:'Historial Clínico', diagnoses:'Diagnósticos', medications:'Medicamentos', allergies:'Alergias/Cirugías', results:'Resultados' };
const TAB_ICONS: Record<string,React.ReactNode> = {
  info:<User className="h-4 w-4"/>, history:<ClipboardList className="h-4 w-4"/>,
  diagnoses:<Activity className="h-4 w-4"/>, medications:<Pill className="h-4 w-4"/>,
  allergies:<AlertTriangle className="h-4 w-4"/>, results:<FlaskConical className="h-4 w-4"/>,
};

export default function DoctorPatientDetail() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<typeof TABS[number]>('info');
  const { data: patient, isLoading, isError, refetch } = useDoctorPatient(id);
  const { data: history } = usePatientHistory(id);

  const MOCK_DIAGNOSES = ['Hipertensión arterial esencial (I10)','Dislipidemia (E78.5)','Diabetes tipo 2 (E11)'];
  const MOCK_MEDS = ['Losartán 50mg · 1 vez/día','Atorvastatina 20mg · Noche','Metformina 850mg · 2 veces/día'];
  const MOCK_ALLERGIES = (patient as any)?.allergies?.length > 0 ? (patient as any).allergies : ['Sin alergias conocidas'];
  const MOCK_SURGERIES = ['Apendicectomía (2015)','Colecistectomía laparoscópica (2019)'];
  const MOCK_RESULTS = ['Hemograma completo – 12 Mar 2025 – Normal','Perfil lipídico – 15 Feb 2025 – Colesterol elevado','ECG – 05 Ene 2025 – Sin alteraciones'];

  if (isLoading) return <div className="space-y-4 p-6">{[...Array(3)].map((_,i)=><Skeleton key={i} className="h-20"/>)}</div>;
  if (isError || !patient) return <ErrorState onRetry={refetch} className="min-h-screen"/>;

  const p = patient as any;

  return (
    <>
      <Helmet><title>{p.name} – Expediente Médico</title></Helmet>
      <div className="mb-5 flex items-center gap-3">
        <Link to="/dashboard/doctor/patients" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-4 w-4"/> Volver a pacientes
        </Link>
      </div>

      {/* Patient header */}
      <div className="card p-5 mb-5">
        <div className="flex items-start gap-5 flex-wrap">
          <img src={p.avatar} alt={p.name} className="w-16 h-16 rounded-2xl object-cover bg-primary-50 shrink-0"/>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-heading font-bold text-slate-800 dark:text-slate-100">{p.name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{p.age} años · {p.gender==='M'?'Masculino':'Femenino'} · {p.bloodType}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to="/dashboard/doctor/messages" className="btn-outline text-xs flex items-center gap-1.5 px-3 py-2"><MessageCircle className="h-3.5 w-3.5"/>Mensaje</Link>
                <Link to="/dashboard/doctor/schedule" className="btn-primary text-xs flex items-center gap-1.5 px-3 py-2"><Calendar className="h-3.5 w-3.5"/>Agendar</Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400"/>{p.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400"/>{p.phone}</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-slate-400"/>{p.eps}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400"/>Última visita: {formatDate(p.lastVisit,'dd MMM yyyy')}</span>
              <span className="flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5 text-slate-400"/>{p.totalVisits} consultas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-800 rounded-xl p-1 mb-5 overflow-x-auto">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
              tab===t?'bg-primary-600 text-white':'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200')}>
            {TAB_ICONS[t]}{TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={tab} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}}>
        {tab==='info' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {label:'Nombre completo',v:p.name},{label:'DNI',v:'47321089'},{label:'Fecha nac.',v:'15/03/1988'},
              {label:'Sexo',v:p.gender==='M'?'Masculino':'Femenino'},{label:'Tipo de sangre',v:p.bloodType},
              {label:'Teléfono',v:p.phone},{label:'Email',v:p.email},{label:'Dirección',v:'Miraflores, Lima'},
              {label:'EPS',v:p.eps},{label:'N° afiliado',v:'ES-20454812'},{label:'Contacto emergencia',v:'Jorge López'},
              {label:'Tel. emergencia',v:'+51 999 654 321'},
            ].map(({label,v})=>(
              <div key={label} className="card p-4">
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{v}</p>
              </div>
            ))}
          </div>
        )}

        {tab==='history' && (
          <div className="card overflow-hidden divide-y divide-surface-100 dark:divide-slate-800">
            {(history||[]).length===0?(
              <div className="py-12 text-center text-slate-400 text-sm">Sin historial de consultas</div>
            ):(history||[]).slice(0,15).map((a:any,i:number)=>(
              <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                  <ClipboardList className="h-4 w-4 text-primary-600"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Consulta de {a.doctorSpecialty}</p>
                  <p className="text-xs text-slate-400">{formatDate(a.date,'dd MMM yyyy')} · {a.time} · {a.mode}</p>
                  {a.reason && <p className="text-xs text-slate-500 italic mt-0.5">"{a.reason}"</p>}
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusColors[a.status])}>
                  {a.status==='completed'?'Completada':a.status==='cancelled'?'Cancelada':'Programada'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab==='diagnoses' && (
          <div className="space-y-3">
            {MOCK_DIAGNOSES.map((d,i)=>(
              <div key={i} className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
                  <Activity className="h-4 w-4 text-red-500"/>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{d}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Diagnóstico activo · {formatDate(new Date(2024,i*3,15).toISOString(),'MMM yyyy')}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 px-2 py-0.5 rounded-full">Activo</span>
              </div>
            ))}
          </div>
        )}

        {tab==='medications' && (
          <div className="space-y-3">
            {MOCK_MEDS.map((m,i)=>(
              <div key={i} className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                  <Pill className="h-4 w-4 text-purple-600"/>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{m.split('·')[0].trim()}</p>
                  <p className="text-xs text-slate-400">{m.split('·').slice(1).join('·').trim()}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">Activo</span>
              </div>
            ))}
          </div>
        )}

        {tab==='allergies' && (
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-500"/>Alergias conocidas</h3>
              {MOCK_ALLERGIES.map((a:string,i:number)=>(
                <div key={i} className="flex items-center gap-2 py-2 border-b border-surface-100 dark:border-slate-800 last:border-0">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"/>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{a}</span>
                </div>
              ))}
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-2"><Scissors className="h-4 w-4 text-blue-500"/>Historial quirúrgico</h3>
              {MOCK_SURGERIES.map((s,i)=>(
                <div key={i} className="flex items-center gap-2 py-2 border-b border-surface-100 dark:border-slate-800 last:border-0">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"/>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='results' && (
          <div className="space-y-3">
            {MOCK_RESULTS.map((r,i)=>{
              const [type, date, summary] = r.split('–').map(s=>s.trim());
              return (
                <div key={i} className="card p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center shrink-0">
                    <FlaskConical className="h-4 w-4 text-orange-500"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{type}</p>
                    <p className="text-xs text-slate-400">{date}</p>
                  </div>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium',
                    summary.toLowerCase().includes('normal')||summary.toLowerCase().includes('sin')?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400')}>
                    {summary}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </>
  );
}
