import { motion, AnimatePresence } from 'framer-motion';
import { useAutoGameStore } from '../hooks/useGameStore';
import { useAuthStore } from '../store/authStore';
import type { Player } from '../types/game';

interface CardProps { player: Player; isActive: boolean; index: number }

function PlayerCard({ player, isActive, isMe, onClick }: { player: Player; isActive: boolean; isMe: boolean; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 mb-1 border transition-all cursor-pointer group
        ${isActive
          ? 'bg-[#f5c842]/8 border-[#f5c842]/40'
          : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#f5c842]/30 hover:bg-[#1a1a1a]/80'
        }
        ${player.bankrupt ? 'opacity-30' : ''}
      `}>
      {/* Avatar */}
      <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center text-base border-2"
        style={{
          background: `${player.color}20`,
          borderColor: isActive ? player.color : `${player.color}50`,
          boxShadow: isActive ? `0 0 10px ${player.glow}` : 'none',
        }}>
        {player.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="font-['Barlow_Condensed'] font-bold text-xs text-white uppercase tracking-wider truncate">
            {isMe ? 'BẠN' : player.name}
            {player.isBot && <span className="text-[#7a8fbb]"> 🤖</span>}
          </span>
        </div>
        {player.bankrupt ? (
          <span className="font-['Barlow_Condensed'] font-bold text-xs text-[#e74c3c] uppercase tracking-wider">
            PHÁ SẢN
          </span>
        ) : (
          <motion.div key={player.money}
            initial={{ scale: 1.1 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="font-['Orbitron'] font-bold text-sm text-[#39ff85]">
            ${player.money.toLocaleString()}
          </motion.div>
        )}
      </div>

      {/* Position */}
      {!player.bankrupt && (
        <div className="text-right shrink-0">
          <p className="font-['Barlow_Condensed'] text-[9px] text-[#7a8fbb] uppercase tracking-widest">VỊ TRÍ:</p>
          <p className="font-['Barlow_Condensed'] font-bold text-xs text-[#bdcabe]">{player.pos}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function PlayerList() {
  const store = useAutoGameStore();
  const { user } = useAuthStore();
  
  const players = store.players;
  const cur = store.cur;

  // Identify "me"
  const me = players.find(p => p.uid === user?.id) || players.find(p => !p.isBot) || players[0];

  const handlePlayerClick = (playerId: number) => {
    store.setViewingPlayerId(playerId);
    store.setActiveTab('TÀI SẢN');
  };

  return (
    <div>
      <AnimatePresence>
        {players.map((p, i) => (
          <PlayerCard 
            key={p.id} 
            player={p} 
            isActive={i === cur && !p.bankrupt} 
            isMe={p.id === me.id}
            onClick={() => handlePlayerClick(p.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
