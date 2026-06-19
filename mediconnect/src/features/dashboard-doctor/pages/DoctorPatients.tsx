import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Calendar, Download, Eye, UserCheck, UserX } from 'lucide-react';
import { useDoctorPatients } from '../../../shared/hooks/useDoctor';
import { PageHeader, ErrorState } from '../../../shared/components/molecules/StatusComponents';
import { Skeleton, Badge } from '../../../shared/components/atoms/index';
import { cn, formatDate } from '../../../shared/utils';
import { toast } from 'sonner';

export default function DoctorPatients() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE = 10;
  const { data: patients, isLoading, isError, refetch } = useDoctorPatients({ q, status });
  const visible = (patients || []).slice((page-1)*PAGE, page*PAGE);
  const pages = Math.ceil((patients||[]).length/PAGE);

  return (
    <>
      <Helmet><title>Mis Pacientes – Dashboard Médico</title></Helmet>
      <PageHeader title="Mis Pacientes" subtitle={`${(patients||[]).length} pacientes registrados`}
        breadcrumb={[{label:'Dashboard Médico',href:'/dashboard/doctor'},{label:'Pacientes'}]} />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-surface-200 dark:border-slate-700 rounded-xl px-4 py-2.5 flex-1 min-w-[200px] max-w-sm">
          <Search className="h-4 w-4 text-slate-400 shrink-0"/>
          <input value={q} onChange={e=>{setQ(e.target.value);setPage(1);}} placeholder="Buscar paciente..." className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none flex-1"/>
        </div>
        <div className="flex gap-1 bg-surface-100 dark:bg-slate-800 rounded-lg p-1">
          {[['all','Todos'],['active','Activos'],['inactive','Inactivos']].map(([v,l])=>(
            <button key={v} onClick={()=>{setStatus(v);setPage(1);}}
              className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors', status===v?'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm':'text-slate-500 dark:text-slate-400')}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {isError ? <ErrorState onRetry={refetch}/> : isLoading ? (
        <div className="space-y-2">{[...Array(6)].map((_,i)=><Skeleton key={i} className="h-16"/>)}</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
                <tr>{['Paciente','Edad','Sexo','Teléfono','Última cita','Diagnóstico','Estado','Acciones'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
                {visible.map((p:any,i:number)=>(
                  <motion.tr key={p.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                    className="hover:bg-surface-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover bg-primary-50 shrink-0"/>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">{p.name}</p>
                          <p className="text-xs text-slate-400 truncate">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{p.age}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{p.gender==='M'?'Masc.':'Fem.'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{p.phone}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(p.lastVisit,'dd/MM/yy')}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-[120px] truncate">{p.diagnoses?.[0]||'—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status==='active'?'success':'default'} size="sm" dot>{p.status==='active'?'Activo':'Inactivo'}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/dashboard/doctor/patients/${p.id}`} title="Ver expediente" className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 transition-colors"><Eye className="h-4 w-4"/></Link>
                        <Link to="/dashboard/doctor/messages" title="Enviar mensaje" className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 transition-colors"><MessageCircle className="h-4 w-4"/></Link>
                        <Link to="/dashboard/doctor/schedule" title="Programar cita" className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 transition-colors"><Calendar className="h-4 w-4"/></Link>
                        <button title="Descargar expediente" onClick={()=>toast.success(`Expediente de ${p.name} descargado`)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 transition-colors"><Download className="h-4 w-4"/></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {visible.length===0 && <div className="py-12 text-center text-slate-400 text-sm">No se encontraron pacientes</div>}
          </div>
          <div className="px-5 py-4 border-t border-surface-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-400">Mostrando {visible.length} de {(patients||[]).length}</p>
            <div className="flex gap-1">
              {Array.from({length:Math.min(pages,5)},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setPage(p)}
                  className={cn('w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                    page===p?'bg-primary-600 text-white':'border border-surface-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-slate-800')}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
