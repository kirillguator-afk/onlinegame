import React from 'react';
import { Trophy, Handshake } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Profile() {
  const { user, balance, setDepositModalOpen } = useAppContext();

  return (
    <div className="view-transition space-y-6">
      <div className="glass-panel p-6 rounded-[32px] flex flex-col items-center text-center relative border border-white/5 overflow-hidden">
        <div className="absolute -right-12 -top-12 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl"></div>
        
        <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-indigo-500/80 flex items-center justify-center mb-4 overflow-hidden shadow-xl shadow-indigo-500/15 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-pink-500/20"></div>
          <span className="text-3xl font-black text-indigo-400 uppercase font-unbounded z-10">
            {user?.first_name?.charAt(0) || 'M'}
          </span>
        </div>
        <h2 className="text-sm font-black text-white font-unbounded">
          {user?.first_name || 'Игрок'}
        </h2>
        <p className="text-[9px] text-slate-500 font-mono mt-1 border border-white/5 bg-slate-950/60 px-3 py-1 rounded-full">
          ID: {user?.id || '0000000'}
        </p>
        
        <div className="bg-slate-950/80 w-full rounded-2xl p-4 mt-6 flex justify-between items-center border border-white/5 shadow-inner">
          <div className="text-left">
            <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest font-unbounded">Доступно</div>
            <div className="text-lg font-black text-emerald-400 font-unbounded mt-1">{balance.toLocaleString('ru-RU')} ₽</div>
          </div>
          <button 
            onClick={() => setDepositModalOpen(true)}
            className="bg-gradient-to-tr from-blue-600 to-indigo-600 px-4 py-2.5 rounded-xl font-bold text-[9px] font-unbounded uppercase shadow-md active:scale-95 transition-transform text-white"
          >
            Пополнить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-[24px] text-center border border-white/5 flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-3">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-[8px] text-slate-500 uppercase font-bold font-unbounded">Матчей</div>
          <div className="font-black text-base text-white mt-1 font-unbounded">14</div>
        </div>
        <div className="glass-panel p-4 rounded-[24px] text-center border border-white/5 flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-3">
            <Handshake className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-[8px] text-slate-500 uppercase font-bold font-unbounded">Побед</div>
          <div className="font-black text-base text-white mt-1 font-unbounded">9</div>
        </div>
      </div>
    </div>
  );
}
