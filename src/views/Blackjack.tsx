import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Sound } from '../lib/sound';

type Card = { suit: string; value: string; weight: number; color: string };
type GameStatus = 'idle' | 'playing' | 'win' | 'lose' | 'bust' | 'dealer_bust' | 'push' | 'blackjack';

export default function Blackjack() {
  const { navigate, balance, setBalance, addToast, setDepositModalOpen } = useAppContext();
  
  const [bet] = useState(100);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');

  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'В', 'Д', 'К', 'Т'];
    let newDeck: Card[] = [];
    
    for (let suit of suits) {
      for (let value of values) {
        let weight = parseInt(value);
        if (['В', 'Д', 'К'].includes(value)) weight = 10;
        if (value === 'Т') weight = 11;
        newDeck.push({ suit, value, weight, color: (suit === '♥' || suit === '♦') ? 'red' : 'black' });
      }
    }
    return newDeck.sort(() => Math.random() - 0.5);
  };

  const calculateScore = (hand: Card[]) => {
    let score = 0, aces = 0;
    for (let card of hand) {
      score += card.weight;
      if (card.value === 'Т') aces++;
    }
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    return score;
  };

  const startGame = () => {
    if (balance < bet) {
      addToast('У вас недостаточно средств!', 'error');
      setDepositModalOpen(true);
      return;
    }
    setBalance(prev => prev - bet);
    const newDeck = createDeck();
    const pHand = [newDeck.pop()!, newDeck.pop()!];
    const dHand = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setStatus('playing');
    Sound.playDeal();

    if (calculateScore(pHand) === 21) endGame('blackjack', pHand, dHand);
  };

  const hit = () => {
    if (status !== 'playing') return;
    Sound.playDeal();
    const newHand = [...playerHand, deck.pop()!];
    setPlayerHand(newHand);
    if (calculateScore(newHand) > 21) endGame('bust', newHand, dealerHand);
  };

  const stand = () => {
    if (status !== 'playing') return;
    let dHand = [...dealerHand];
    let dScore = calculateScore(dHand);
    let currentDeck = [...deck];
    
    while (dScore < 17) {
      dHand.push(currentDeck.pop()!);
      dScore = calculateScore(dHand);
    }
    setDealerHand(dHand);
    const pScore = calculateScore(playerHand);
    if (dScore > 21) endGame('dealer_bust', playerHand, dHand);
    else if (pScore > dScore) endGame('win', playerHand, dHand);
    else if (pScore < dScore) endGame('lose', playerHand, dHand);
    else endGame('push', playerHand, dHand);
  };

  const endGame = (finalStatus: GameStatus, pHand: Card[], dHand: Card[]) => {
    setStatus(finalStatus);
    let winAmount = 0;
    if (finalStatus === 'blackjack') { winAmount = bet * 2.5; addToast(`Вы собрали 21! +${winAmount} ₽`, 'success'); Sound.playWin(); }
    else if (finalStatus === 'win' || finalStatus === 'dealer_bust') { winAmount = bet * 2; addToast(`Дилер побежден! +${winAmount} ₽`, 'success'); Sound.playWin(); }
    else if (finalStatus === 'bust') { addToast('Перебор очков. Раунд за дилером.', 'error'); Sound.playLose(); }
    else if (finalStatus === 'lose') { addToast('Вы проиграли раздачу.', 'error'); Sound.playLose(); }
    else if (finalStatus === 'push') { winAmount = bet; addToast('Ничья. Взнос возвращен.', 'info'); }

    if (winAmount > 0) setBalance(prev => prev + winAmount);
  };

  const renderCard = (card: Card, hidden = false, index = 0) => {
    const rot = (index - 1) * 5;
    if (hidden) return <div key={`hidden-${index}`} className="card card-back card-deal" style={{ '--rot': `${rot}deg` } as any}></div>;
    return (
      <div key={`${card.suit}-${card.value}-${index}`} className={`card ${card.color} card-deal`} style={{ '--rot': `${rot}deg`, animationDelay: `${index * 0.1}s` } as any}>
        <div className="text-[10px] font-unbounded leading-none">{card.value}</div>
        <div className="card-center">{card.suit}</div>
        <div className="text-right rotate-180 text-[10px] font-unbounded leading-none">{card.value}</div>
      </div>
    );
  };

  let message = 'Раунд готов к началу!';
  if (status === 'playing') message = 'Ваш ход! Еще карту или хватит?';
  else if (status === 'blackjack') message = `БЛЭКДЖЕК! ПУЛ ${bet * 2.5} ₽`;
  else if (status === 'win' || status === 'dealer_bust') message = `ПОБЕДА! КУШ ${bet * 2} ₽`;
  else if (status === 'bust') message = `ПЕРЕБОР ОЧКОВ! ЛИМИТ ПРЕВЫШЕН.`;
  else if (status === 'lose') message = 'ПОБЕДА ДИЛЕРА. ОЧКИ ВЫШЕ.';
  else if (status === 'push') message = 'НИЧЬЯ. СДЕЛКА АННУЛИРОВАНА.';

  return (
    <div className="view-transition h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => navigate('games')} className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 text-slate-400 flex items-center justify-center active:scale-90 transition-transform">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <h2 className="font-black text-[9px] font-unbounded uppercase leading-none text-slate-300">Стол Blackjack</h2>
          <span className="text-[9px] text-amber-400 font-bold font-unbounded tracking-wider uppercase mt-1 inline-block">Ставка: {bet} ₽</span>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 felt-table-bj rounded-[32px] p-4 flex flex-col justify-between relative overflow-hidden border border-emerald-500/20">
        <div className="text-center relative z-10 pt-4">
          <span className="text-[8px] font-bold text-emerald-100 bg-emerald-950/80 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest font-unbounded">
            Дилер: <span className="text-amber-400 font-black">{status === 'playing' ? '?' : calculateScore(dealerHand)}</span>
          </span>
          <div className="flex justify-center gap-[-25px] min-h-[104px] mt-3">
            {dealerHand.map((c, i) => renderCard(c, status === 'playing' && i === 1, i))}
          </div>
        </div>

        <div className="text-center font-black text-[9px] text-amber-400 uppercase tracking-widest z-10 py-2.5 bg-black/40 backdrop-blur-md rounded-xl mx-6 border border-white/5 font-unbounded">
          {message}
        </div>

        <div className="text-center relative z-10">
          <div className="flex justify-center gap-[-25px] min-h-[104px] mb-3">
            {playerHand.map((c, i) => renderCard(c, false, i))}
          </div>
          <span className="text-[8px] font-bold text-emerald-100 bg-emerald-950/80 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest font-unbounded">
            Ваши Очки: <span className="text-blue-400 font-black">{calculateScore(playerHand)}</span>
          </span>
        </div>
      </div>

      <div className="mt-4 glass-panel p-4 rounded-[24px] border border-white/5">
        {status === 'idle' && (
          <button onClick={startGame} className="w-full metro-gradient py-4 rounded-2xl font-black text-[10px] font-unbounded uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-transform text-white">
            Подтвердить Готовность
          </button>
        )}
        {status === 'playing' && (
          <div className="flex gap-3">
            <button onClick={hit} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 py-4 rounded-2xl font-black text-[9px] font-unbounded uppercase tracking-widest text-white active:scale-95 transition-transform">Взять еще</button>
            <button onClick={stand} className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 py-4 rounded-2xl font-black text-[9px] font-unbounded uppercase tracking-widest text-white active:scale-95 transition-transform">Пас / Хватит</button>
          </div>
        )}
        {status !== 'idle' && status !== 'playing' && (
          <button onClick={() => { setStatus('idle'); setPlayerHand([]); setDealerHand([]); }} className="w-full bg-slate-900 border border-white/5 py-4 rounded-2xl font-black text-[10px] font-unbounded uppercase tracking-widest text-slate-300 active:scale-95 transition-transform">
            Следующий раунд
          </button>
        )}
      </div>
    </div>
  );
}
