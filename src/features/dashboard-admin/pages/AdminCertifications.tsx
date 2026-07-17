import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, XCircle, Clock, Award } from 'lucide-react';
import { PageHeader } from '../../../shared/components/molecules/StatusComponents';
import { Badge, Avatar } from '../../../shared/components/atoms/index';
import { Button } from '../../../shared/components/atoms/Button';
import { toast } from 'sonner';

const CERTS = [
  { id:'cert-001', doctorName:'Dr. Roberto Paz', doctorAvatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-roberto-paz', specialty:'Gastroenterología', certName:'Especialidad en Gastroenterología – UNMSM', issuer:'Universidad Nacional Mayor de San Marcos', year:2018, status:'pending' },
  { id:'cert-002', doctorName:'Dra. Carmen Vidal', doctorAvatar:'https://api.dicebear.com/7.x/personas/svg?seed=dra-carmen-vidal', specialty:'Reumatología', certName:'Board Certification – American College of Rheumatology', issuer:'ACR', year:2020, status:'pending' },
  { id:'cert-003', doctorName:'Dr. Carlos Mendoza', doctorAvatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-carlos-mendoza', specialty:'Cardiología', certName:'Especialidad en Cardiología Intervencionista', issuer:'Colegio Médico del Perú', year:2017, status:'approved' },
  { id:'cert-004', doctorName:'Dra. Ana Torres', doctorAvatar:'https://api.dicebear.com/7.x/personas/svg?seed=dra-ana-torres', specialty:'Dermatología', certName:'Certificado de Dermatología Estética', issuer:'IADERM', year:2021, status:'approved' },
  { id:'cert-005', doctorName:'Dr. Andrés Mora', doctorAvatar:'https://api.dicebear.com/7.x/personas/svg?seed=dr-andres-mora', specialty:'Neumología', certName:'Especialización en Neumología Clínica', issuer:'UPCH', year:2019, status:'pending' },
];
const STATUS_MAP: Record<string,{label:string;variant:any}> = { pending:{label:'Pendiente',variant:'warning'}, approved:{label:'Aprobado',variant:'success'}, rejected:{label:'Rechazado',variant:'error'} };

export default function AdminCertifications() {
  const [certs, setCerts] = React.useState(CERTS);
  function update(id: string, status: string) {
    setCerts(c => c.map(x => x.id===id?{...x,status}:x));
    toast.success(status==='approved'?'Certificación aprobada':'Certificación rechazada');
  }
  const pending = certs.filter(c=>c.status==='pending');
  return (
    <>
      <Helmet><title>Certificaciones – Admin</title></Helmet>
      <PageHeader title="Certificaciones Médicas" subtitle={`${pending.length} pendientes de revisión`}
        breadcrumb={[{label:'Admin'},{label:'Gestión Médica'},{label:'Certificaciones'}]}/>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 dark:bg-slate-800/50 border-b border-surface-200 dark:border-slate-800">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Médico</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Certificación</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Emisor / Año</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Estado</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
            {certs.map(c => (
              <tr key={c.id} className="hover:bg-surface-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2"><Avatar src={c.doctorAvatar} name={c.doctorName} size="sm"/>
                    <div><p className="font-medium text-slate-800 dark:text-slate-100">{c.doctorName}</p><p className="text-xs text-slate-500">{c.specialty}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell"><p className="font-medium text-slate-700 dark:text-slate-300 text-xs">{c.certName}</p></td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500">{c.issuer} · {c.year}</td>
                <td className="px-4 py-3"><Badge variant={STATUS_MAP[c.status]?.variant||'default'} size="sm" dot>{STATUS_MAP[c.status]?.label||c.status}</Badge></td>
                <td className="px-4 py-3 text-right">
                  {c.status==='pending' && <div className="flex gap-1 justify-end">
                    <Button size="sm" variant="success" onClick={()=>update(c.id,'approved')}><CheckCircle className="h-3.5 w-3.5 mr-1"/>Aprobar</Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={()=>update(c.id,'rejected')}><XCircle className="h-3.5 w-3.5 mr-1"/>Rechazar</Button>
                  </div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
