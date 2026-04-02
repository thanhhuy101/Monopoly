import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import type { GameStore } from '../../store/gameStore';

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

function Die({ value, rolling }: { value: number; rolling: boolean }) {
  const on = new Set((DOT_POSITIONS[value] ?? []).map(([r, c]) => r * 3 + c));
  return (
    <motion.div className="die"
      animate={rolling ? { rotate: [0, 22, -18, 0], scale: [1, 1.12, 1.08, 1] } : {}}
      transition={{ duration: 0.5 }}>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className={on.has(i) ? 'dot' : 'dot dot-off'} />
      ))}
    </motion.div>
  );
}

export default function DicePanel() {
  const dice = useGameStore((s: GameStore) => s.dice);
  const phase = useGameStore((s: GameStore) => s.phase);
  const roll = useGameStore((s: GameStore) => s.roll);
  const players = useGameStore((s: GameStore) => s.players);
  const cur = useGameStore((s: GameStore) => s.cur);

  const rolling = phase === 'rolling';
  const walking = phase === 'walking';
  const isBot = players[cur]?.isBot;
  const canRoll = phase === 'roll' && !isBot;

  return (
    <div className="flex flex-col items-center gap-2 py-3">
      {/* Dice */}
      <div className="flex gap-3">
        <Die value={dice[0]} rolling={rolling} />
        <Die value={dice[1]} rolling={rolling} />
      </div>

      {/* Roll button */}
      <motion.button onClick={roll} disabled={!canRoll}
        whileHover={canRoll ? { scale: 1.03 } : {}}
        whileTap={canRoll ? { scale: 0.97 } : {}}
        className={`w-full py-3 flex items-center justify-center gap-2
          font-['Orbitron'] font-bold text-xs uppercase tracking-[2px]
          ${canRoll
            ? 'bg-linear-to-r from-[#f6be39] to-[#d4a017] text-[#261a00] shadow-[0_4px_15px_rgba(212,160,23,0.3)] cursor-pointer'
            : 'bg-[#2a2a2a] text-[#7a8fbb] cursor-not-allowed'
          }`}>
        <span className="material-symbols-outlined text-base"
          style={{ fontVariationSettings: "'FILL' 1" }}>casino</span>
        {walking ? 'Đang Di Chuyển...' : rolling ? 'Đang Tung...' : isBot && phase === 'roll' ? '🤖 Máy Đang Suy Nghĩ...' : 'TUNG XÚC XẮC'}
      </motion.button>
    </div>
  );
}
