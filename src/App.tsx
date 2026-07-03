import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import BackgroundVFX from './components/BackgroundVFX';
import Header from './components/Header';
import Navigation from './components/Navigation';
import AuthScreen from './components/AuthScreen';
import DepositModal from './components/DepositModal';
import ToastContainer from './components/ToastContainer';
import Home from './views/Home';
import Rooms from './views/Rooms';
import Profile from './views/Profile';
import Blackjack from './views/Blackjack';
import Durak from './views/Durak';

function MainApp() {
  const { user, currentView } = useAppContext();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020308] p-0 sm:p-6 overflow-hidden relative">
      <BackgroundVFX />

      <div className="phone-frame w-full h-screen sm:h-[860px] sm:max-w-[420px] overflow-hidden flex flex-col relative z-10 transition-all duration-300">
        <ToastContainer />
        <Header />

        <main className="flex-1 overflow-y-auto pb-24 p-4 relative z-10" id="app-container">
          {currentView === 'home' && <Home />}
          {currentView === 'games' && <Rooms />}
          {currentView === 'rooms' && <Rooms />}
          {currentView === 'profile' && <Profile />}
          {currentView === 'game-21' && <Blackjack />}
          {currentView === 'game-durak' && <Durak />}
        </main>

        <Navigation />
      </div>

      {!user && <AuthScreen />}
      <DepositModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
