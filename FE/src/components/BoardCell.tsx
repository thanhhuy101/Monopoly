import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { SPACES, COLOR_HEX } from '../data/gameData';
import { useGameStore } from '../store/gameStore';
import type { SpaceType, Player } from '../types/game';

const TYPE_CLASS: Partial<Record<SpaceType, string>> = {
  go: 'cell-go', jail: 'cell-jail', free: 'cell-free', gotojail: 'cell-gotojail',
  tax: 'cell-tax', chance: 'cell-chance', chest: 'cell-chest', railroad: 'cell-railroad', utility: 'cell-utility',
};
const CORNER_IDS = new Set([0, 10, 20, 30]);
const TOKEN_OFFSETS: [number, number][] = [[4, 4], [18, 4], [4, 18], [18, 18]];
const STEP_SPRING = { type: 'spring', stiffness: 520, damping: 22, mass: 0.6 } as const;
const WARP_SPRING = { type: 'spring', stiffness: 280, damping: 22 } as const;

interface Props { spaceId: number; row: number; col: number }

export default function BoardCell({ spaceId, row, col }: Props) {
  const players = useGameStore((s: { players: Player[] }) => s.players);
  const props = useGameStore((s: { props: Record<number, number> }) => s.props);
  const houses = useGameStore((s: { houses: Record<number, number> }) => s.houses);

  const sp = SPACES[spaceId];
  const ownerId = props[spaceId];
  const owner = ownerId !== undefined ? players[ownerId] : null;
  const houseCount = houses[spaceId] ?? 0;
  const tokensHere = useMemo(
    () => players.filter(p => !p.bankrupt && p.pos === spaceId),
    [players, spaceId],
  );

  const isCorner = CORNER_IDS.has(spaceId);
  const rotClass = isCorner
    ? (spaceId === 20 || spaceId === 30 ? 'rotate-180' : '')
    : row === 0
      ? 'rotate-180'
      : col === 0
        ? 'rotate-90'
        : col === 10
          ? 'rotate-n90'
          : '';
  const colorHex = sp.color ? (COLOR_HEX as Record<string, string>)[sp.color] : undefined;

  return (
    <div id={`cell-${spaceId}`}
      className={clsx('cell', (TYPE_CLASS as Record<string, string | undefined>)[sp.type], CORNER_IDS.has(spaceId) && 'cell-corner', rotClass)}
      style={{ gridColumn: col + 1, gridRow: row + 1 }}>
      {sp.type === 'prop' && colorHex && (
        <div className="color-strip" style={{ background: colorHex, boxShadow: `0 0 8px ${colorHex}` }} />
      )}
      {sp.icon && <span className="cell-icon">{sp.icon}</span>}
      <span className="cell-name">{sp.name}</span>
      {sp.price !== undefined && <span className="cell-price">{sp.price}₫</span>}
      {houseCount > 0 && <span className="cell-bld">{houseCount >= 5 ? '🏨' : '🏠'.repeat(houseCount)}</span>}
      {owner && (
        <div className="cell-ring" style={{ borderColor: owner.color, boxShadow: `inset 0 0 6px ${owner.color}50` }} />
      )}
      <AnimatePresence>
        {tokensHere.map((p, i) => {
          const [tx, ty] = TOKEN_OFFSETS[i] ?? [4, 4];
          return (
            <motion.div key={p.id} layoutId={`token-${p.id}`} className="token"
              style={{ background: p.color, left: tx, top: ty, boxShadow: `0 2px 8px rgba(0,0,0,.6),0 0 10px ${p.color}`, zIndex: p.isWalking ? 30 : 20 }}
              layout transition={p.isWalking ? STEP_SPRING : WARP_SPRING}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: p.isWalking ? [0, -5, 0] : 0 }}
              exit={{ scale: 0.4, opacity: 0 }}>
              {p.emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
