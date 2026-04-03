import { motion } from 'framer-motion';
import { useAutoGameStore } from '../../hooks/useGameStore';
import { useAuthStore } from '../../store/authStore';

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
  const store = useAutoGameStore();
  const dice = store.dice;
  const phase = store.phase;
  const roll = store.roll;
  const players = store.players;
  const cur = store.cur;
  const { user } = useAuthStore();

  const rolling = phase === 'rolling';
  const walking = phase === 'walking';
  const curPlayer = players[cur];
  const isBot = curPlayer?.isBot;

  // Identify local player
  const me = players.find(p => p.uid === user?.id) || players.find(p => !p.isBot) || players[0];
  const isMyTurn = curPlayer?.id === me.id;

  const canRoll = phase === 'roll' && isMyTurn && !isBot;

  // Determine button text
  let btnText = 'TUNG XÚC XẮC';
  if (walking) btnText = 'Đang Di Chuyển...';
  else if (rolling) btnText = 'Đang Tung...';
  else if (phase === 'roll') {
    if (isBot) btnText = '🤖 Máy Đang Suy Nghĩ...';
    else if (!isMyTurn) btnText = `Đợi ${curPlayer?.name}...`;
  } else if (phase === 'modal') {
    if (isMyTurn) btnText = 'Đang Chọn...';
    else btnText = `${curPlayer?.name} đang suy nghĩ...`;
  }

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
        {btnText}
      </motion.button>
    </div>
  );
}
