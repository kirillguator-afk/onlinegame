import React from 'react';
import { Zap, Layers, Diamond } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { navigate, setActiveGameType } = useAppContext();

  const handleGameSelect = (type: '21' | 'durak') => {
    setActiveGameType(type);
    navigate('rooms');
  };

  return (
    <div className="view-transition space-y-5 pb-6">
      <div className="metro-gradient rounded-[28px] p-5 relative overflow-hidden shadow-xl border border-white/10">
        <div className="relative z-10 max-w-[75%]">
          <span className="text-[8px] font-bold bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-widest font-unbounded">P2P NODE</span>
          <h2 className="text-base font-black mt-3 mb-1.5 uppercase leading-snug font-unbounded">ДЕЦЕНТРАЛИЗОВАННЫЙ КЛУБ</h2>
          <p className="text-[10px] text-blue-100 opacity-95 leading-relaxed">Молниеносный коннект без серверов-посредников по технологии WebRTC.</p>
          <button 
            onClick={() => navigate('games')} 
            className="mt-4 bg-white text-blue-900 font-black text-[9px] font-unbounded py-3 px-6 rounded-2xl shadow-lg active:scale-95 transition-transform uppercase tracking-wider"
          >
            К столам
          </button>
        </div>
        <Zap className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 transform -rotate-12" />
      </div>

      <div>
        <h3 className="font-bold text-[9px] text-slate-500 uppercase tracking-widest font-unbounded mb-3 px-1">Выберите дисциплину</h3>
        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => handleGameSelect('durak')} className="glass-panel-interactive p-4 rounded-[24px] flex flex-col items-center gap-4 cursor-pointer border-red-500/10 hover:border-red-500/35">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-lg">
              <Layers className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-[11px] text-white uppercase font-unbounded tracking-tight">ДУРАК</h4>
              <span className="text-[8px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full font-bold mt-1.5 inline-block uppercase tracking-wider font-unbounded">P2P ROOM</span>
            </div>
          </div>
          
          <div onClick={() => handleGameSelect('21')} className="glass-panel-interactive p-4 rounded-[24px] flex flex-col items-center gap-4 cursor-pointer border-blue-500/10 hover:border-blue-500/35">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg">
              <Diamond className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-[11px] text-white uppercase font-unbounded tracking-tight">21 ОЧКО</h4>
              <span className="text-[8px] text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full font-bold mt-1.5 inline-block uppercase tracking-wider font-unbounded">BLACKJACK</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-[24px] border border-white/5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] font-bold text-slate-300 font-unbounded uppercase tracking-wider">Мониторинг сети</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-950 p-2.5 rounded-2xl border border-white/5">
            <span className="text-[8px] text-slate-500 block uppercase font-unbounded">Столов открыто</span>
            <span className="font-black text-xs font-unbounded text-white mt-1 block">34</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-2xl border border-white/5">
            <span className="text-[8px] text-slate-500 block uppercase font-unbounded">Активные пиры</span>
            <span className="font-black text-xs font-unbounded text-white mt-1 block">489</span>
          </div>
        </div>
      </div>
    </div>
  );
}
