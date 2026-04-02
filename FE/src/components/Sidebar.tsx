import { motion } from 'framer-motion';
import PlayerList from './PlayerList';
import GameLog from './GameLog';
import { useGameStore } from '../store/gameStore';
import type { GameStore } from '../store/gameStore';

export default function Sidebar() {
  const init = useGameStore((s: GameStore) => s.init);
  return (
    <div id="sidebar">
      <div className="panel"><div className="ptitle">👥 Người Chơi</div><PlayerList /></div>
      <div className="panel"><div className="ptitle">📜 Nhật Ký</div><GameLog /></div>
      <motion.button id="restart-btn" onClick={() => init()}
        whileHover={{ borderColor:'#ff3aac', color:'#ff3aac', boxShadow:'0 0 12px rgba(255,58,172,.3)' }}
        whileTap={{ scale:0.97 }}>
        ↺ Chơi Lại
      </motion.button>
    </div>
  );
}
