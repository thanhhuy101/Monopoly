import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import type { GameStore } from '../store/gameStore';

export default function Toast() {
  const toast = useGameStore((s: GameStore) => s.toast);
  return (
    <AnimatePresence>
      {toast && (
        <motion.div key={toast.id} id="toast"
          initial={{ opacity:0, y:-16, x:'-50%' }}
          animate={{ opacity:1, y:0,   x:'-50%' }}
          exit={{    opacity:0, y:-12,  x:'-50%' }}
          transition={{ type:'spring', stiffness:340, damping:28 }}>
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
