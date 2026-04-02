import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import type { GameStore } from '../store/gameStore';
import type { FloatMoney } from '../types/game';

export default function FloatingMoney() {
  const floats = useGameStore((s: GameStore) => s.floats);
  return (
    <AnimatePresence>
      {floats.map((f: FloatMoney) => (
        <motion.div key={f.id} className="fmoney"
          style={{ left:f.x, top:f.y, color:f.color }}
          initial={{ opacity:1, y:0, scale:1 }}
          animate={{ opacity:0, y:-55, scale:1.3 }}
          exit={{ opacity:0 }}
          transition={{ duration:1, ease:'easeOut' }}>
          {f.text}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
