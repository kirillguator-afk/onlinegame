import React, { useState } from 'react';
import { X, Banknote, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function DepositModal() {
  const { isDepositModalOpen, setDepositModalOpen, processDeposit } = useAppContext();
  const [amount, setAmount] = useState<string>('');

  if (!isDepositModalOpen) return null;

  const handleDeposit = () => {
    processDeposit(parseInt(amount) || 0);
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-xs rounded-[32px] p-6 transition-all duration-300 border border-emerald-500/20">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[10px] font-black text-white uppercase tracking-widest font-unbounded">Депозит</h2>
          <button 
            onClick={() => setDepositModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 flex items-center justify-center transition-transform active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mb-5 leading-relaxed">
          Безопасное мгновенное пополнение счёта через СБП. Чек от ФНС формируется автоматически.
        </p>
        
        <div className="space-y-4">
          <div className="relative">
            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Сумма (от 100 ₽)" 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-10 pr-4 text-white font-black font-unbounded text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[500, 1000, 5000].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val.toString())}
                className="bg-slate-900 hover:bg-slate-800 border border-white/5 py-2 rounded-xl text-xs font-bold transition-all text-slate-300"
              >
                {val}
              </button>
            ))}
          </div>
          <button 
            onClick={handleDeposit}
            className="w-full metro-gradient py-4 rounded-2xl font-black uppercase text-[9px] font-unbounded shadow-lg hover:opacity-90 active:scale-95 transition-all text-white flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Оплатить СБП
          </button>
        </div>
      </div>
    </div>
  );
}
