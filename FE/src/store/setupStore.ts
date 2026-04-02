import { create } from 'zustand';
import { PLAYER_SETUP } from '../data/gameData';
import type { TokenShape } from '../types/game';

export interface PlayerSlot {
  name: string;
  emoji: string;
  color: string;
  glow: string;
  tokenShape: TokenShape;
  isBot: boolean;
  enabled: boolean;
}

interface SetupState {
  slots: PlayerSlot[];
  setBot: (index: number, isBot: boolean) => void;
  setEnabled: (index: number, enabled: boolean) => void;
}

export const useSetupStore = create<SetupState>((set) => ({
  slots: PLAYER_SETUP.map((p, i) => ({
    ...p,
    isBot: i > 0,      // Player 1 = human, rest = bot by default
    enabled: true,
  })),

  setBot: (index, isBot) =>
    set(s => ({
      slots: s.slots.map((sl, i) => (i === index ? { ...sl, isBot } : sl)),
    })),

  setEnabled: (index, enabled) =>
    set(s => ({
      slots: s.slots.map((sl, i) => (i === index ? { ...sl, enabled } : sl)),
    })),
}));
