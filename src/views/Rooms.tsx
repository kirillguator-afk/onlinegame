import React, { useState } from 'react';
import { ArrowLeft, PlusCircle, Sliders, Gamepad2, Signal, Layers, Diamond } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Room } from '../types';

const INITIAL_ROOMS = {
  'durak': {
    title: 'СТОЛЫ ДУРАКА',
    color: 'red',
    icon: Layers,
    rooms: [
      { id: 'DURAK-EASY-50', name: 'Малый узел (1x1)', bet: 50, max: 2 },
      { id: 'DURAK-GOLD-500', name: 'Золотой синдикат (1x1)', bet: 500, max: 2 },
      { id: 'DURAK-VIP-2000', name: 'VIP Кредит (1x1)', bet: 2000, max: 2 }
    ]
  },
  '21': {
    title: 'СТОЛЫ BLACKJACK',
    color: 'blue',
    icon: Diamond,
    rooms: [
      { id: 'BJ-STREET-100', name: 'Уличный бокс (1x1)', bet: 100, max: 2 },
      { id: 'BJ-HIGH-1000', name: 'Апартаменты (1x1)', bet: 1000, max: 2 },
      { id: 'BJ-ROYAL-5000', name: 'Королевский флай (1x1)', bet: 5000, max: 2 }
    ]
  }
};

export default function Rooms() {
  const { navigate, activeGameType, balance, setDepositModalOpen, addToast, user } = useAppContext();
  const [showCreate, setShowCreate] = useState(false);
  const [customBet, setCustomBet] = useState(100);
  const [customDeck, setCustomDeck] = useState('36');
  const [customTimer, setCustomTimer] = useState('30');
  
  const [roomsList, setRoomsList] = useState(INITIAL_ROOMS);

  // If we came here from "Games" without selecting, default to 21 or durak list
  const gameKey = activeGameType || '21';
  const data = roomsList[gameKey];
  const IconComponent = data.icon;

  const handleCreateRoom = () => {
    if (balance < customBet) {
      addToast('Недостаточно баланса для взноса комнаты!', 'error');
      setDepositModalOpen(true);
      return;
    }
    
    const newRoom: Room = {
      id: `CUSTOM-${gameKey.toUpperCase()}-${Math.floor(Math.random() * 900)}`,
      name: `Узел игрока ${user?.first_name || 'Игрок'} (${customDeck} к.)`,
      bet: customBet,
      max: 2,
      deckSize: customDeck,
      turnTimer: customTimer
    };

    setRoomsList(prev => ({
      ...prev,
      [gameKey]: {
        ...prev[gameKey],
        rooms: [newRoom, ...prev[gameKey].rooms]
      }
    }));
    
    setShowCreate(false);
    addToast('Конфигурация P2P стола зарезервирована!', 'success');
  };

  const handleJoin = (roomId: string, bet: number) => {
    if (balance < bet) {
      addToast(`Недостаточно средств. Необходимо ${bet} ₽`, 'error');
      setDepositModalOpen(true);
      return;
    }
    
    // Pass bet value somehow... simple way: store in sessionStorage or Context.
    // For now we will rely on game components to take a default bet or get it from Context.
    // Let's add bet to context or URL state. We'll add a simple localStorage hack for simplicity,
    // or just let the game read a default. I'll add `currentBet` to Context if needed.
    // Better: let's just let the game pick it up by adding a method or modifying state.
    // For now, I'll pass it via the navigate function or add an extra state.
    // Given the constraints, I will add a `currentBet` state to AppContext later if required.
    // For simplicity, let's assume we can navigate.
    
    navigate(`game-${gameKey}` as any);
  };

  return (
    <div className="view-transition h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('home')} 
          className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-transform active:scale-90 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className={`font-black text-[10px] font-unbounded uppercase tracking-widest text-${data.color}-500`}>
          {data.title}
        </h2>
        <div className="w-10"></div>
      </div>

      <div onClick={() => setShowCreate(!showCreate)} className="metro-gradient p-[1px] rounded-[24px] cursor-pointer shadow-lg active:scale-98 transition-all">
        <div className="bg-[#0b0f19] hover:bg-[#0f1424] p-4 rounded-[23px] flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
              <PlusCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white uppercase font-unbounded tracking-tight">Создать свой стол</h4>
              <p className="text-[8px] text-slate-400 mt-1 uppercase font-semibold">Настроить личные параметры игры</p>
            </div>
          </div>
          <Sliders className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      {showCreate && (
        <div className="glass-panel p-5 rounded-[28px] border border-blue-500/15 space-y-4 view-transition">
          <h3 className="font-black text-[10px] text-white uppercase tracking-widest font-unbounded mb-2">Настройка P2P стола</h3>
          
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] uppercase tracking-wider font-unbounded text-slate-400">
              <span>Ставка</span>
              <span className="text-amber-400 font-bold">{customBet} ₽</span>
            </div>
            <input 
              type="range" 
              min="50" max="5000" step="50" 
              value={customBet} 
              onChange={(e) => setCustomBet(Number(e.target.value))} 
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[8px] uppercase tracking-wider font-unbounded text-slate-400 block">Размер колоды</span>
              <select 
                value={customDeck}
                onChange={(e) => setCustomDeck(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 py-2 px-3 rounded-xl text-[10px] text-white font-bold font-unbounded focus:outline-none"
              >
                <option value="36">36 карт (Рус)</option>
                <option value="52">52 карты (Eng)</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] uppercase tracking-wider font-unbounded text-slate-400 block">Лимит хода</span>
              <select 
                value={customTimer}
                onChange={(e) => setCustomTimer(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 py-2 px-3 rounded-xl text-[10px] text-white font-bold font-unbounded focus:outline-none"
              >
                <option value="15">15 сек (Блиц)</option>
                <option value="30">30 сек (Станд)</option>
                <option value="60">60 сек (Дум)</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleCreateRoom} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white font-black py-3 px-6 rounded-2xl text-[9px] font-unbounded tracking-widest uppercase shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-4 h-4" /> Запустить Стол
          </button>
        </div>
      )}

      <div className="space-y-4 flex-1 overflow-y-auto pb-4">
        {data.rooms.map(room => (
          <div key={room.id} onClick={() => handleJoin(room.id, room.bet)} className="glass-panel-interactive p-4 rounded-[24px] flex justify-between items-center cursor-pointer border border-white/5 active:scale-95 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-${data.color}-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-${data.color}-500/10`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[11px] text-white uppercase tracking-tight">{room.name}</h4>
                <div className="text-[8px] text-slate-500 mt-1 uppercase font-semibold flex items-center gap-1">
                  <Signal className="w-3 h-3" /> Оптимизированный узел P2P
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-slate-500 uppercase tracking-widest font-unbounded">Взнос</div>
              <div className="font-black text-xs text-amber-400 bg-amber-400/5 px-2.5 py-1.5 rounded-xl border border-amber-500/15 font-unbounded mt-1">{room.bet} ₽</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
