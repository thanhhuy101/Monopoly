import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useGameStore } from '../store/gameStore';
import type { GameStore } from '../store/gameStore';
import type { ModalButton } from '../types/game';

const BTN_CLASS: Record<string, string> = {
  'btn-buy':'mb mb-buy', 'btn-pass':'mb mb-pass', 'btn-ok':'mb mb-ok', 'btn-win':'mb mb-win',
};

export default function Modal() {
  const modal             = useGameStore((s: GameStore) => s.modal);
  const handleModalAction = useGameStore((s: GameStore) => s.handleModalAction);
  return (
    <AnimatePresence>
      {modal && (
        <motion.div id="overlay"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.2 }}>
          <motion.div id="modal"
            initial={{ scale:0.85, y:24, opacity:0 }}
            animate={{ scale:1,    y:0,  opacity:1 }}
            exit={{    scale:0.9,  y:12, opacity:0 }}
            transition={{ type:'spring', stiffness:320, damping:26 }}>
            <div id="micon">{modal.icon}</div>
            <div id="mtitle">{modal.title}</div>
            <div id="mbody">{modal.body}</div>
            <div className="mbrow">
              {modal.buttons.map((btn: ModalButton, i: number) => (
                <motion.button key={i}
                  className={clsx(BTN_CLASS[btn.cls] ?? 'mb', 'cursor-pointer')}
                  onClick={() => handleModalAction(btn)}
                  whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.97 }}>
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
