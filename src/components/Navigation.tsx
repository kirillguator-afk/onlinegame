import React from 'react';
import { Compass, Dices, Contact } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { View } from '../types';

export default function Navigation() {
  const { currentView, navigate } = useAppContext();

  const getBtnClass = (viewPrefix: string) => {
    const isActive = currentView.startsWith(viewPrefix);
    return `nav-btn flex flex-col items-center gap-1 transition-all duration-300 w-1/3 ${isActive ? 'text-blue-500' : 'text-slate-400 hover:text-blue-400'}`;
  };

  const getIconClass = (viewPrefix: string) => {
    const isActive = currentView.startsWith(viewPrefix);
    return `nav-icon-box p-1 rounded-lg transition-all ${isActive ? 'bg-blue-500/10 scale-110' : ''}`;
  };

  return (
    <nav className="glass-panel absolute bottom-0 w-full flex justify-around p-3 z-40 rounded-t-[28px] border-t border-white/5 shadow-2xl">
      <button onClick={() => navigate('home')} className={getBtnClass('home')}>
        <div className={getIconClass('home')}><Compass className="w-5 h-5" /></div>
        <span className="text-[8px] font-bold uppercase tracking-widest font-unbounded">Главная</span>
      </button>
      <button onClick={() => navigate('games')} className={getBtnClass('game')}>
        <div className={getIconClass('game')}><Dices className="w-5 h-5" /></div>
        <span className="text-[8px] font-bold uppercase tracking-widest font-unbounded">Столы</span>
      </button>
      <button onClick={() => navigate('profile')} className={getBtnClass('profile')}>
        <div className={getIconClass('profile')}><Contact className="w-5 h-5" /></div>
        <span className="text-[8px] font-bold uppercase tracking-widest font-unbounded">Профиль</span>
      </button>
    </nav>
  );
}
