import React from 'react';
import { Shield, Send, User, Loader2, Unlock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AuthScreen() {
  const { setUser, addToast } = useAppContext();
  const [loading, setLoading] = React.useState(false);

  const handleSimulateAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        id: 900000 + Math.floor(Math.random() * 99999),
        first_name: 'Демо Игрок',
        username: 'demo_user'
      });
      addToast('Вы вошли под Демо счетом!', 'success');
      setLoading(false);
    }, 1000);
  };

  const handleTgAuth = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, we would redirect to a bot and poll.
    // For this demo without a real bot, fallback to simulate after a delay.
    setTimeout(() => {
      addToast('Время авторизации вышло. Войдите как гость.', 'warning');
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="absolute inset-0 z-[100] bg-[#020409] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 rounded-3xl metro-gradient flex items-center justify-center shadow-2xl shadow-purple-500/20 mb-8 animate-bounce relative">
        <Unlock className="text-white w-10 h-10 absolute z-10" />
        <div className="absolute inset-0 bg-blue-500/10 rounded-3xl animate-ping" style={{ animationDuration: '2s' }}></div>
        <div className="absolute inset-2 bg-slate-950 rounded-2xl flex items-center justify-center">
          <Shield className="text-blue-400 w-8 h-8 animate-pulse" />
        </div>
      </div>
      <h2 className="text-xl font-black mb-2 text-white font-unbounded tracking-tight leading-snug">
        METRO CASH <span className="text-blue-400 font-black">P2P</span>
      </h2>
      <p className="text-slate-400 text-[11px] mb-8 max-w-xs leading-relaxed">
        Для защиты баланса узлов WebRTC и честных сделок, пожалуйста, подтвердите свою личность.
      </p>
      
      <div className="w-full max-w-xs space-y-4">
        <a 
          href="#" 
          onClick={handleTgAuth}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition-all duration-300 transform active:scale-95 text-[10px] font-unbounded"
        >
          <Send className="w-5 h-5" /> ТЕЛЕГРАМ ВХОД
        </a>
        
        <button 
          onClick={handleSimulateAuth}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-white/5 text-slate-300 font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 transform active:scale-95 text-[10px]"
        >
          <User className="w-4 h-4" /> Гостевой Счёт (Демо)
        </button>
        
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 mt-6">
            <div className="flex items-center gap-3 text-slate-300 text-xs font-bold bg-slate-900 px-5 py-2.5 rounded-full border border-blue-500/20">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" /> Рукопожатие P2P...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
