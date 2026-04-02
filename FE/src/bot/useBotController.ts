import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { decideBotAction } from './botBrain';

const BOT_ROLL_DELAY = 1200;
const BOT_MODAL_DELAY = 1500;

export function useBotController() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function tryBotAction() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      const state = useGameStore.getState();
      const player = state.players[state.cur];
      if (!player || !player.isBot || player.bankrupt) return;

      const decision = decideBotAction(state);
      if (!decision) return;

      const delay = decision === 'roll' ? BOT_ROLL_DELAY : BOT_MODAL_DELAY + 500; // Extra time for cards to be read

      timerRef.current = setTimeout(() => {
        const current = useGameStore.getState();
        const curPlayer = current.players[current.cur];
        if (!curPlayer?.isBot) return;

        if (decision === 'roll' && current.phase === 'roll') {
          current.roll();
        } else if (decision === 'dismissCard' && current.cardReveal) {
          current.dismissCardReveal();
        } else if (typeof decision === 'object' && current.phase === 'modal') {
          current.handleModalAction(decision.modalAction);
        }
      }, delay);
    }

    const unsub = useGameStore.subscribe(tryBotAction);

    // Check immediately on mount
    tryBotAction();

    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
