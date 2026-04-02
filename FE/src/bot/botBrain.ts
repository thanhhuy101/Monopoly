import type { GameState, ModalButton } from '../types/game';
import { SPACES } from '../data/gameData';

export type BotDecision = 'roll' | 'dismissCard' | { modalAction: ModalButton };

// How many properties belong to a color group
const GROUP_SIZE: Record<number, number> = {
  0: 2, 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 2,
};

function countOwnedInGroup(props: Record<number, number>, playerId: number, group: number): number {
  let count = 0;
  for (const [spaceId, owner] of Object.entries(props)) {
    if (owner === playerId) {
      const sp = SPACES[Number(spaceId)];
      if (sp?.group === group) count++;
    }
  }
  return count;
}

function hasMonopoly(props: Record<number, number>, playerId: number, group: number): boolean {
  return countOwnedInGroup(props, playerId, group) >= (GROUP_SIZE[group] ?? 3);
}

function chooseBestButton(state: GameState): ModalButton {
  const { modal, players, cur, props } = state;
  const player = players[cur];
  const buttons = modal!.buttons;

  const buyBtn = buttons.find(b => b.action === 'buy');
  const buildBtn = buttons.find(b => b.action === 'build');
  const passBtn = buttons.find(b => b.action === 'pass');
  const restartBtn = buttons.find(b => b.action === 'restart');

  if (restartBtn) return restartBtn;

  if (buyBtn && buyBtn.spaceId !== undefined) {
    const sp = SPACES[buyBtn.spaceId];
    const price = buyBtn.price ?? sp.price ?? 0;
    const moneyAfter = player.money - price;

    // Complete a monopoly → buy aggressively
    if (sp.group !== undefined) {
      const owned = countOwnedInGroup(props, player.id, sp.group);
      const total = GROUP_SIZE[sp.group] ?? 3;
      if (owned >= total - 1 && moneyAfter >= 50) return buyBtn;
      if (owned >= 1 && moneyAfter >= 100) return buyBtn;
    }

    // Buy railroads/utilities if affordable
    if ((sp.type === 'railroad' || sp.type === 'utility') && moneyAfter >= 100) return buyBtn;

    // General: buy if keeping a reserve of 150+
    if (moneyAfter >= 150) return buyBtn;

    return passBtn ?? buttons[buttons.length - 1];
  }

  if (buildBtn && buildBtn.spaceId !== undefined) {
    const sp = SPACES[buildBtn.spaceId];
    const cost = buildBtn.cost ?? 100;

    if (sp.group !== undefined && hasMonopoly(props, player.id, sp.group) && player.money - cost >= 200) {
      return buildBtn;
    }

    return passBtn ?? buttons[buttons.length - 1];
  }

  return passBtn ?? buttons[buttons.length - 1];
}

export function decideBotAction(state: GameState): BotDecision | null {
  const player = state.players[state.cur];
  if (!player || player.bankrupt || !player.isBot) return null;

  if (state.phase === 'roll') return 'roll';
  if (state.cardReveal && state.cardReveal.playerId === state.cur) return 'dismissCard';

  if (state.phase === 'modal' && state.modal) {
    return { modalAction: chooseBestButton(state) };
  }

  return null;
}
