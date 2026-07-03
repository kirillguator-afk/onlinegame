import React from 'react';
import { Gamepad2, Gem, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Header() {
  const { balance, setDepositModalOpen } = useAppContext();

  return (
    <header className="glass-panel px-4 py-3 flex justify-between items-center z-40 border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 relative overflow-hidden">
          <span className="absolute inset-0 bg-white/10 animate-pulse"></span>
          <Gamepad2 className="text-white w-4 h-4 z-10 animate-pulse" />
        </div>
        <div>
          <h1 className="text-[9px] font-black tracking-widest text-slate-400">METRO</h1>
          <h2 className="text-xs font-black italic tracking-widest metro-text-gradient leading-none">CASH</h2>
        </div>
      </div>
      
      <div className="bg-slate-900/90 rounded-full pl-3 pr-1 py-1 flex items-center gap-2 border border-blue-500/15 shadow-inner">
        <Gem className="text-blue-400 w-3 h-3 animate-bounce" />
        <span className="font-bold text-[11px] font-unbounded text-emerald-400 tracking-tight">
          {balance.toLocaleString('ru-RU')} ₽
        </span>
        <button 
          onClick={() => setDepositModalOpen(true)}
          className="bg-gradient-to-tr from-emerald-500 to-teal-500 hover:opacity-95 w-5 h-5 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-md"
        >
          <Plus className="w-3 h-3 text-white" />
        </button>
      </div>
    </header>
  );
}
