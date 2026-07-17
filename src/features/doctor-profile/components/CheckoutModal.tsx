import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, QrCode, Building, CheckCircle2, AlertCircle, Upload, Check } from 'lucide-react';
import { Modal } from '../../../shared/components/molecules/CardModal';
import { formatCurrency, getPriceBySpecialty } from '../../../shared/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string) => void;
  doctor: any;
  selectedDate: Date;
  selectedTime: string;
  selectedMode: string;
}

const MODE_LABELS: Record<string, string> = {
  'in-person': 'Presencial',
  'video': 'Videollamada',
  'chat': 'Chat médico',
};

export function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  doctor,
  selectedDate,
  selectedTime,
  selectedMode,
}: CheckoutModalProps) {
  const [method, setMethod] = useState<'card' | 'yape' | 'transfer'>('card');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Transfer state
  const [voucherUploaded, setVoucherUploaded] = useState(false);

  const price = getPriceBySpecialty(doctor?.specialty || '');

  const canSubmit = () => {
    if (!acceptedPolicy) return false;
    if (method === 'card') {
      return cardNumber.length >= 15 && cardName.length > 3 && cardExpiry.length === 5 && cardCvv.length >= 3;
    }
    if (method === 'transfer') return voucherUploaded;
    if (method === 'yape') return true;
    return false;
  };

  const handleSubmit = () => {
    if (canSubmit()) onConfirm(method);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Completar reserva" size="2xl">
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Resumen de cita */}
        <div className="space-y-4">
          <div className="p-4 bg-surface-50 dark:bg-slate-800/50 rounded-xl border border-surface-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 border-b border-surface-200 dark:border-slate-700 pb-2">Resumen de Cita</h3>
            <div className="flex items-center gap-3 mb-4">
              <img src={doctor?.avatar} alt={doctor?.name} className="w-12 h-12 rounded-xl object-cover bg-primary-50"/>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{doctor?.name}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400">{doctor?.specialty}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Fecha</span>
                <span className="font-medium text-slate-800 dark:text-slate-100 capitalize">
                  {format(selectedDate, 'EEEE dd MMMM yyyy', { locale: es })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Hora</span>
                <span className="font-medium text-slate-800 dark:text-slate-100">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Modalidad</span>
                <span className="font-medium text-slate-800 dark:text-slate-100">{MODE_LABELS[selectedMode]}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-surface-200 dark:border-slate-700 flex justify-between items-center">
              <span className="font-semibold text-slate-800 dark:text-slate-100">Total a pagar</span>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(price)}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <input type="checkbox" checked={acceptedPolicy} onChange={e => setAcceptedPolicy(e.target.checked)} className="peer sr-only" />
                <div className="w-5 h-5 rounded border-2 border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" />
                </div>
              </div>
              <div className="text-xs text-amber-800 dark:text-amber-300">
                <p className="font-bold mb-0.5">Política de no devolución obligatoria</p>
                <p>Acepto que una vez realizada la reserva y efectuado el pago, no se admiten cambios ni devoluciones de dinero bajo ninguna circunstancia según los términos y condiciones de la clínica.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Pagos */}
        <div className="space-y-4">
          <div className="flex p-1 bg-surface-100 dark:bg-slate-800 rounded-lg">
            {[
              { id: 'card', label: 'Tarjeta', icon: CreditCard },
              { id: 'yape', label: 'Yape / Plin', icon: QrCode },
              { id: 'transfer', label: 'Transferencia', icon: Building },
            ].map(tab => (
              <button key={tab.id} onClick={() => setMethod(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${method === tab.id ? 'bg-white dark:bg-slate-700 shadow text-slate-800 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              {method === 'card' && (
                <motion.div key="card" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  {/* Visual Card */}
                  <div className="relative w-full h-48 rounded-2xl p-6 text-white shadow-xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-5"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-8 rounded bg-gradient-to-r from-yellow-200 to-yellow-500 opacity-90 flex items-center justify-center">
                        <div className="w-8 h-4 border border-yellow-700/30 rounded-sm opacity-50"></div>
                      </div>
                      <CreditCard className="h-8 w-8 opacity-50" />
                    </div>
                    
                    <div className="text-2xl font-mono tracking-widest mb-4 opacity-90">
                      {cardNumber ? cardNumber.match(/.{1,4}/g)?.join(' ') : '0000 0000 0000 0000'}
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Titular</p>
                        <p className="font-medium text-sm tracking-widest uppercase truncate max-w-[150px]">
                          {cardName || 'NOMBRE APELLIDO'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Vence</p>
                        <p className="font-medium text-sm tracking-widest">
                          {cardExpiry || 'MM/AA'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Número de tarjeta</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="input-base text-sm" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0,16))} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Nombre en la tarjeta</label>
                      <input type="text" placeholder="Como aparece en la tarjeta" className="input-base text-sm uppercase" value={cardName} onChange={e => setCardName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Vencimiento (MM/AA)</label>
                      <input type="text" placeholder="MM/AA" className="input-base text-sm" value={cardExpiry} onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        if(val.length >= 2) val = val.slice(0,2) + '/' + val.slice(2,4);
                        setCardExpiry(val);
                      }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">CVV</label>
                      <input type="password" placeholder="***" className="input-base text-sm tracking-widest" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0,4))} />
                    </div>
                  </div>
                </motion.div>
              )}

              {method === 'yape' && (
                <motion.div key="yape" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div className="max-w-[280px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-[6px] border-slate-800 dark:border-slate-900 bg-white relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 dark:bg-slate-900 rounded-b-xl z-10"></div>
                    
                    <div className="bg-[#742284] px-4 pt-8 pb-6 text-center text-white relative">
                      <p className="font-bold text-lg mb-1">¡Yapea tu consulta!</p>
                      <p className="text-[#00E39F] font-bold text-3xl">{formatCurrency(price)}</p>
                    </div>
                    
                    <div className="bg-white p-6 text-center">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 inline-block mb-3">
                        <QrCode className="h-32 w-32 text-slate-800" />
                      </div>
                      <p className="text-slate-500 text-xs font-medium mb-1">A nombre de</p>
                      <p className="text-slate-800 font-bold text-sm">MEDICONNECT SAC</p>
                    </div>
                    
                    <div className="bg-slate-50 p-4 border-t border-slate-100">
                      <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#742284]">
                        <div className="w-4 h-4 rounded-full bg-[#00E39F] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        Aprobación automática
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {method === 'transfer' && (
                <motion.div key="transfer" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="bg-[#002A8D] px-4 py-3 text-white flex justify-between items-center">
                      <span className="font-bold text-sm tracking-wider">BANCO DE CRÉDITO</span>
                      <div className="w-8 h-8 rounded-full bg-[#FF7700] flex items-center justify-center font-bold text-white text-xs">BCP</div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 space-y-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Cuenta Corriente Soles</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-lg">191-98765432-0-99</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Código de Cuenta Interbancaria (CCI)</span>
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300">00219100987654329950</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Titular de la cuenta</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">MEDICONNECT SAC</span>
                      </div>
                      <div className="flex flex-col pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Monto a transferir</span>
                        <span className="font-bold text-[#FF7700] text-xl">{formatCurrency(price)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!voucherUploaded ? (
                    <button onClick={() => setVoucherUploaded(true)} className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-[#002A8D]/30 hover:border-[#002A8D] dark:border-slate-600 dark:hover:border-slate-400 rounded-xl p-5 text-center transition-colors group">
                      <div className="w-12 h-12 bg-[#002A8D]/10 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="h-5 w-5 text-[#002A8D] dark:text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-[#002A8D] dark:text-slate-300">Adjuntar constancia de transferencia</p>
                      <p className="text-xs text-slate-500 mt-1">Sube la captura de pantalla o PDF del voucher</p>
                    </button>
                  ) : (
                    <div className="w-full border border-green-500 bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-green-700 dark:text-green-400">Constancia recibida</p>
                          <p className="text-xs text-green-600/80 dark:text-green-400/80">voucher_transferencia.jpg</p>
                        </div>
                      </div>
                      <button onClick={() => setVoucherUploaded(false)} className="text-xs font-semibold text-slate-500 hover:text-red-500 underline transition-colors">
                        Eliminar
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                    <span>La cita se agendará en estado <strong>"Pendiente"</strong>. Tu reserva se confirmará automáticamente en cuanto nuestro equipo valide la operación (máx. 2 horas).</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-surface-200 dark:border-slate-700 flex justify-end gap-3">
        <button onClick={onClose} className="btn-ghost px-4 py-2 text-sm">Cancelar</button>
        <button onClick={handleSubmit} disabled={!canSubmit()} className="btn-primary px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          Pagar {formatCurrency(price)} y Reservar
        </button>
      </div>
    </Modal>
  );
}
