export type View = 'home' | 'games' | 'profile' | 'rooms' | 'game-21' | 'game-durak';

export interface User {
  id: number;
  first_name: string;
  username?: string;
}

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface Room {
  id: string;
  name: string;
  bet: number;
  max: number;
  deckSize?: string;
  turnTimer?: string;
}

export interface LobbyData {
  title: string;
  color: string;
  icon: any; 
  rooms: Room[];
}

export type GameType = '21' | 'durak';
