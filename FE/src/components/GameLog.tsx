import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import type { GameStore } from '../store/gameStore';

function getTime(index: number, total: number) {
  const base = 14 * 60 + 22; // 14:22
  const minute = base + (total - 1 - index);
  const h = Math.floor(minute / 60) % 24;
  const m = minute % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function GameLog() {
  const log = useGameStore((s: GameStore) => s.log);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [log]);

  const entries = log.slice(0, 30);

  return (
    <div ref={ref} className="max-h-40 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2a3a5c transparent' }}>
      <AnimatePresence initial={false}>
        {entries.map((entry: string, i: number) => (
          <motion.div key={entry + i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-2 py-1.5 border-b border-[#2a2a2a]/40 text-[11px] font-semibold leading-snug
              ${i === 0 ? 'text-[#f5c842]' : 'text-[#7a8fbb]'}`}>
            <span className="shrink-0 font-['Orbitron'] text-[10px] text-[#e74c3c] font-bold">
              {getTime(i, entries.length)}
            </span>
            <span>{entry}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
