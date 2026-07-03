import React, { useState, useEffect } from 'react';
import { ChevronLeft, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Sound } from '../lib/sound';

type DurakCard = { suit: string; value: string; power: number; color: string; id: string };
type TablePair = { attack: DurakCard; defense: DurakCard | null };
type DurakState = 'START' | 'ATTACK' | 'DEFENSE' | 'FINISHED';

export default function Durak() {
  const { navigate, balance, setBalance, addToast, setDepositModalOpen } = useAppContext();
  
  const [bet] = useState(50);
  const [gameState, setGameState] = useState<DurakState>('START');
  const [deck, setDeck] = useState<DurakCard[]>([]);
  const [playerHand, setPlayerHand] = useState<DurakCard[]>([]);
  const [aiHand, setAiHand] = useState<DurakCard[]>([]);
  const [tableCards, setTableCards] = useState<TablePair[]>([]);
  const [trump, setTrump] = useState<DurakCard | null>(null);

  const startGame = () => {
    if (balance < bet) {
      addToast('У вас недостаточно средств!', 'error');
      setDepositModalOpen(true);
      return;
    }
    setBalance(prev => prev - bet);
    
    const suits = ['♠', '♥', '♦', '♣'];
    const values = [
      { name: '6', power: 6 }, { name: '7', power: 7 }, { name: '8', power: 8 },
      { name: '9', power: 9 }, { name: '10', power: 10 }, { name: 'В', power: 11 },
      { name: 'Д', power: 12 }, { name: 'К', power: 13 }, { name: 'Т', power: 14 }
    ];
    let newDeck: DurakCard[] = [];
    suits.forEach(suit => {
      const color = (suit === '♥' || suit === '♦') ? 'red' : 'black';
      values.forEach(v => {
        newDeck.push({ suit, value: v.name, power: v.power, color, id: Math.random().toString(36).substring(2, 9) });
      });
    });
    newDeck = newDeck.sort(() => Math.random() - 0.5);

    const initialTrump = newDeck[0];
    newDeck.push(newDeck.shift()!);

    let pHand = [], aHand = [];
    for (let i = 0; i < 6; i++) {
      pHand.push(newDeck.pop()!);
      aHand.push(newDeck.pop()!);
    }

    setDeck(newDeck);
    setTrump(initialTrump);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setTableCards([]);
    setGameState('ATTACK');
    addToast('Игра началась! Ваш ход.', 'success');
  };

  const checkGameOver = (pHand: DurakCard[], aHand: DurakCard[]) => {
    if (pHand.length === 0 && aHand.length === 0) {
      setGameState('FINISHED');
      addToast('Ничья! Ставка возвращена.', 'info');
      setBalance(prev => prev + bet);
      return true;
    } else if (pHand.length === 0 && aHand.length > 0) {
      setGameState('FINISHED');
      addToast(`Победа! Вы забрали банк: ${bet * 2} ₽`, 'success');
      setBalance(prev => prev + bet * 2);
      Sound.playWin();
      return true;
    } else if (aHand.length === 0 && pHand.length > 0) {
      setGameState('FINISHED');
      addToast('Игра окончена. Вы остались в дураках.', 'error');
      Sound.playLose();
      return true;
    }
    return false;
  };

  const endTurnDrawCards = (pHand: DurakCard[], aHand: DurakCard[], currentDeck: DurakCard[]) => {
    while (pHand.length < 6 && currentDeck.length > 0) pHand.push(currentDeck.pop()!);
    while (aHand.length < 6 && currentDeck.length > 0) aHand.push(currentDeck.pop()!);
    setPlayerHand([...pHand]);
    setAiHand([...aHand]);
    setDeck([...currentDeck]);
    checkGameOver(pHand, aHand);
  };

  const canBeat = (defCard: DurakCard, attCard: DurakCard) => {
    if (defCard.suit === attCard.suit) return defCard.power > attCard.power;
    if (trump && defCard.suit === trump.suit && attCard.suit !== trump.suit) return true;
    return false;
  };

  const handlePlayerCardClick = (cardId: string) => {
    const cardIdx = playerHand.findIndex(c => c.id === cardId);
    if (cardIdx === -1) return;
    const card = playerHand[cardIdx];

    if (gameState === 'ATTACK') {
      if (tableCards.length === 0) {
        playAttackCard(card, cardIdx);
      } else {
        const canAttack = tableCards.some(pair => pair.attack.value === card.value || (pair.defense && pair.defense.value === card.value));
        if (canAttack) playAttackCard(card, cardIdx);
        else addToast('Подкинуть можно только карту совпадающего номинала!', 'warning');
      }
    } else if (gameState === 'DEFENSE') {
      const openPairIdx = tableCards.findIndex(pair => pair.defense === null);
      if (openPairIdx === -1) return;
      const attackCard = tableCards[openPairIdx].attack;
      if (canBeat(card, attackCard)) {
        Sound.playDeal();
        const newTable = [...tableCards];
        newTable[openPairIdx].defense = card;
        setTableCards(newTable);
        const newHand = [...playerHand];
        newHand.splice(cardIdx, 1);
        setPlayerHand(newHand);
        
        if (newTable.every(pair => pair.defense !== null)) {
          setTimeout(() => aiAttackStep(newHand, aiHand, newTable, deck), 800);
        }
      } else {
        addToast('Нельзя побить эту карту!', 'error');
      }
    }
  };

  const playAttackCard = (card: DurakCard, cardIdx: DurakCard | number) => {
    Sound.playDeal();
    const newTable = [...tableCards, { attack: card, defense: null }];
    setTableCards(newTable);
    const newHand = [...playerHand];
    if (typeof cardIdx === 'number') newHand.splice(cardIdx, 1);
    setPlayerHand(newHand);
    setTimeout(() => aiDefenseStep(newHand, aiHand, newTable, deck), 1000);
  };

  const aiDefenseStep = (pHand: DurakCard[], aHand: DurakCard[], tCards: TablePair[], currentDeck: DurakCard[]) => {
    const openPairIdx = tCards.findIndex(pair => pair.defense === null);
    if (openPairIdx === -1) return;
    const attackCard = tCards[openPairIdx].attack;
    
    let candidates = aHand.filter(c => canBeat(c, attackCard));
    if (candidates.length === 0) {
      addToast('Соперник не смог побить и забирает!', 'info');
      tCards.forEach(pair => {
        aHand.push(pair.attack);
        if (pair.defense) aHand.push(pair.defense);
      });
      setTableCards([]);
      endTurnDrawCards(pHand, aHand, currentDeck);
      setGameState('ATTACK');
      return;
    }

    candidates.sort((a, b) => {
      const aIsTrump = trump && a.suit === trump.suit;
      const bIsTrump = trump && b.suit === trump.suit;
      if (aIsTrump && !bIsTrump) return 1;
      if (!aIsTrump && bIsTrump) return -1;
      return a.power - b.power;
    });

    const defCard = candidates[0];
    const defCardIdx = aHand.findIndex(c => c.id === defCard.id);
    
    Sound.playDeal();
    tCards[openPairIdx].defense = defCard;
    aHand.splice(defCardIdx, 1);
    setTableCards([...tCards]);
    setAiHand([...aHand]);
    addToast('Соперник отбился. Можете подкинуть карту!', 'info');
  };

  const aiAttackStep = (pHand: DurakCard[], aHand: DurakCard[], tCards: TablePair[], currentDeck: DurakCard[]) => {
    if (tCards.length === 0) {
      aHand.sort((a, b) => {
        const aIsTrump = trump && a.suit === trump.suit;
        const bIsTrump = trump && b.suit === trump.suit;
        if (aIsTrump && !bIsTrump) return 1;
        if (!aIsTrump && bIsTrump) return -1;
        return a.power - b.power;
      });
      if (aHand.length === 0) return;
      const card = aHand.shift()!;
      Sound.playDeal();
      setTableCards([{ attack: card, defense: null }]);
      setAiHand([...aHand]);
      setGameState('DEFENSE');
      addToast('Соперник атакует! Отбивайтесь.', 'warning');
    } else {
      const validValues = new Set();
      tCards.forEach(pair => {
        validValues.add(pair.attack.value);
        if (pair.defense) validValues.add(pair.defense.value);
      });

      const candidates = aHand.filter(c => validValues.has(c.value));
      const safeCandidates = candidates.filter(c => trump && (c.suit !== trump.suit || c.power < 11));
      const finalCandidates = safeCandidates.length > 0 ? safeCandidates : candidates;

      if (finalCandidates.length > 0 && tCards.length < 6 && pHand.length > 0) {
        const card = finalCandidates[0];
        const idx = aHand.findIndex(c => c.id === card.id);
        aHand.splice(idx, 1);
        Sound.playDeal();
        setTableCards([...tCards, { attack: card, defense: null }]);
        setAiHand([...aHand]);
        addToast('Соперник подкинул карту!', 'warning');
      } else {
        addToast('Соперник сказал: БИТО!', 'success');
        setTableCards([]);
        endTurnDrawCards(pHand, aHand, currentDeck);
        setGameState('ATTACK');
      }
    }
  };

  const actionBtnClick = () => {
    if (gameState === 'ATTACK') {
      if (tableCards.length === 0) {
        addToast('Вы должны сделать хотя бы один ход!', 'warning');
        return;
      }
      setTableCards([]);
      endTurnDrawCards([...playerHand], [...aiHand], [...deck]);
      setGameState('DEFENSE');
      setTimeout(() => aiAttackStep([...playerHand], [...aiHand], [], [...deck]), 1000);
    } else if (gameState === 'DEFENSE') {
      const newHand = [...playerHand];
      tableCards.forEach(pair => {
        newHand.push(pair.attack);
        if (pair.defense) newHand.push(pair.defense);
      });
      setPlayerHand(newHand);
      setTableCards([]);
      endTurnDrawCards(newHand, [...aiHand], [...deck]);
      setGameState('DEFENSE');
      setTimeout(() => aiAttackStep(newHand, [...aiHand], [], [...deck]), 1200);
    }
  };

  const renderCard = (card: DurakCard, isHand = false, index = 0, total = 1) => {
    const rot = isHand ? (index - (total - 1) / 2) * 5 : 0;
    return (
      <div 
        key={card.id}
        onClick={() => isHand && handlePlayerCardClick(card.id)}
        className={`card ${card.color} ${isHand ? 'cursor-pointer hover:-translate-y-4 transition-all duration-200' : ''} shadow-md`}
        style={isHand ? { '--rot': `${rot}deg`, marginLeft: index === 0 ? '0px' : '-20px' } as any : {}}
      >
        <div className="text-[10px] font-unbounded leading-none">{card.value}</div>
        <div className="card-center">{card.suit}</div>
        <div className="text-right rotate-180 text-[10px] font-unbounded leading-none">{card.value}</div>
      </div>
    );
  };

  return (
    <div className="view-transition h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => navigate('games')} className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 text-slate-400 flex items-center justify-center active:scale-90 transition-transform"><ChevronLeft className="w-4 h-4" /></button>
        <div className="text-center">
          <h2 className="font-black text-[9px] font-unbounded uppercase leading-none text-rose-500">ДУРАК ОНЛАЙН</h2>
          <span className="text-[9px] text-slate-500 mt-1 inline-block font-unbounded uppercase tracking-wider">Пул: {bet * 2} ₽</span>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 felt-table-durak rounded-[32px] relative overflow-hidden flex flex-col justify-between p-3">
        <div className="flex justify-center z-10 pt-4">
          <div className="bg-black/75 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-[10px]">
              <User className="text-rose-400 w-3 h-3" />
            </div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest font-unbounded">Соперник: <span className="text-amber-400">{aiHand.length} карт</span></span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative my-2">
          {trump && deck.length > 0 && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 bg-black/50 p-2.5 rounded-2xl border border-white/5">
              <div className="relative w-12 h-16">
                <div className={`w-12 h-16 bg-white border border-red-500 rounded-lg absolute left-[-15px] top-4 rotate-90 flex flex-col justify-between p-1 text-[10px] font-black shadow-md ${trump.color === 'red' ? 'text-red-500' : 'text-slate-900'}`}>
                  <div>{trump.value}</div>
                  <div className="text-center text-lg">{trump.suit}</div>
                  <div className="text-right rotate-180">{trump.value}</div>
                </div>
                <div className="w-12 h-16 card-back rounded-lg absolute left-0 top-0 flex items-center justify-center shadow-lg border border-blue-500"></div>
              </div>
              <span className="text-[9px] font-black text-slate-400 font-unbounded">{deck.length} к.</span>
            </div>
          )}

          <div className="flex gap-2 items-center justify-center min-h-[120px] w-full pr-14 flex-wrap">
            {tableCards.length === 0 ? (
              <div className="text-center text-slate-500 text-[8px] font-unbounded border-2 border-dashed border-slate-700 rounded-xl p-4 w-28 h-20 flex items-center justify-center">
                {gameState === 'ATTACK' ? 'ХОДИТЕ КАРТОЙ' : 'ОЖИДАНИЕ АТАКИ'}
              </div>
            ) : (
              tableCards.map((pair, idx) => (
                <div key={`pair-${idx}`} className="relative w-14 h-20">
                  <div className="absolute left-0 top-0 transform scale-75 origin-top-left">
                    {renderCard(pair.attack)}
                  </div>
                  {pair.defense && (
                    <div className="absolute left-3 top-3 transform scale-75 origin-top-left z-10">
                      {renderCard(pair.defense)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="h-28 w-full flex justify-center items-end pb-1.5 gap-1.5 relative transition-opacity duration-500">
          {playerHand.map((card, i) => renderCard(card, true, i, playerHand.length))}
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        {gameState === 'START' ? (
          <button onClick={startGame} className="flex-1 bg-gradient-to-tr from-emerald-600 to-teal-600 border border-white/5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white font-unbounded active:scale-95 shadow-md">
            Начать Игру
          </button>
        ) : (
          <button 
            onClick={actionBtnClick} 
            className={`flex-1 ${gameState === 'ATTACK' ? 'bg-gradient-to-tr from-emerald-600 to-teal-600' : 'bg-gradient-to-tr from-amber-600 to-yellow-600'} border border-white/5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white font-unbounded active:scale-95 shadow-md`}
          >
            {gameState === 'ATTACK' ? (tableCards.length > 0 ? 'Бито' : 'Пас') : 'Беру'}
          </button>
        )}
        <button onClick={() => navigate('games')} className="flex-1 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-rose-400 font-unbounded">
          Сдаться
        </button>
      </div>
    </div>
  );
}
