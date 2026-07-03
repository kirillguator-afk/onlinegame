import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, User, Toast, ToastType, GameType } from '../types';
import { Sound } from '../lib/sound';

interface AppContextType {
  user: User | null;
  balance: number;
  currentView: View;
  activeGameType: GameType | null;
  toasts: Toast[];
  isDepositModalOpen: boolean;
  setUser: (user: User | null) => void;
  setBalance: (updater: ((prev: number) => number) | number) => void;
  navigate: (view: View) => void;
  setActiveGameType: (type: GameType | null) => void;
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  setDepositModalOpen: (open: boolean) => void;
  processDeposit: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalanceState] = useState<number>(1000);
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeGameType, setActiveGameType] = useState<GameType | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);

  const navigate = (view: View) => setCurrentView(view);
  
  const setBalance = (valOrUpdater: ((prev: number) => number) | number) => {
      if(typeof valOrUpdater === 'function'){
          setBalanceState(prev => valOrUpdater(prev));
      } else {
          setBalanceState(valOrUpdater);
      }
  }

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const processDeposit = (amount: number) => {
    if (!amount || amount < 100) {
      addToast('Минимальная сумма — 100 ₽', 'error');
      return;
    }
    setBalanceState((prev) => prev + amount);
    setDepositModalOpen(false);
    addToast(`Успешный демо-депозит на ${amount} ₽!`, 'success');
    Sound.playWin();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        balance,
        currentView,
        activeGameType,
        toasts,
        isDepositModalOpen,
        setUser,
        setBalance,
        navigate,
        setActiveGameType,
        addToast,
        removeToast,
        setDepositModalOpen,
        processDeposit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
