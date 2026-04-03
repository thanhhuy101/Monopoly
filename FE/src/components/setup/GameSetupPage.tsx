import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSetupStore } from '../../store/setupStore';
import type { PlayerSlot } from '../../store/setupStore';

function PlayerSlotCard({ slot, index }: { slot: PlayerSlot; index: number }) {
  const setBot = useSetupStore(s => s.setBot);
  const setEnabled = useSetupStore(s => s.setEnabled);
  const isHuman = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center gap-4 px-5 py-4 border transition-all
        ${!slot.enabled ? 'opacity-30 border-[#2a2a2a] bg-[#111]' : 'border-[#d4a017]/40 bg-[#1a1a1a]'}
      `}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded shrink-0 flex items-center justify-center text-2xl border-2"
        style={{
          background: `${slot.color}20`,
          borderColor: `${slot.color}80`,
        }}>
        {slot.emoji}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-['Barlow_Condensed'] font-bold text-sm text-white uppercase tracking-wider truncate">
          {slot.name}
        </p>
        <p className="font-['Barlow_Condensed'] text-xs text-[#7a8fbb] uppercase tracking-widest">
          {isHuman ? 'BẠN' : slot.isBot ? '🤖 MÁY' : '👤 NGƯỜI'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {!isHuman && slot.enabled && (
          <div className="flex border border-[#d4a017]/40 overflow-hidden">
            <button
              onClick={() => setBot(index, true)}
              className={`px-3 py-1.5 font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer
                ${slot.isBot
                  ? 'bg-[#d4a017] text-[#261a00]'
                  : 'bg-[#111] text-[#7a8fbb] hover:bg-[#2a2a2a]'
                }`}>
              MÁY
            </button>
            <button
              onClick={() => setBot(index, false)}
              className={`px-3 py-1.5 font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer
                ${!slot.isBot
                  ? 'bg-[#d4a017] text-[#261a00]'
                  : 'bg-[#111] text-[#7a8fbb] hover:bg-[#2a2a2a]'
                }`}>
              NGƯỜI
            </button>
          </div>
        )}

        {!isHuman && (
          <button
            onClick={() => setEnabled(index, !slot.enabled)}
            className={`w-8 h-8 flex items-center justify-center border transition-all cursor-pointer
              ${slot.enabled
                ? 'border-[#e74c3c]/50 text-[#e74c3c] hover:bg-[#e74c3c]/10'
                : 'border-[#39ff85]/50 text-[#39ff85] hover:bg-[#39ff85]/10'
              }`}>
            <span className="material-symbols-outlined text-sm">
              {slot.enabled ? 'close' : 'add'}
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function GameSetupPage() {
  const navigate = useNavigate();
  const slots = useSetupStore(s => s.slots);
  const enabledCount = slots.filter(s => s.enabled).length;
  const canStart = enabledCount >= 2;

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: 'radial-gradient(circle at 2px 2px,rgba(212,160,23,0.05) 1px,transparent 0)', backgroundSize: '40px 40px' }}>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={() => navigate('/home')}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#d4a017] font-['Barlow_Condensed'] text-sm uppercase tracking-widest hover:opacity-80 transition-opacity cursor-pointer">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        QUAY LẠI
      </motion.button>

      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <span className="font-['Barlow_Condensed'] text-[#f6be39] tracking-[0.3em] text-xs font-semibold uppercase opacity-80">
            Indochine Heritage Edition
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl text-[#f6be39] font-black uppercase tracking-tight mt-1"
            style={{ textShadow: '0 0 12px rgba(246,190,57,0.4)' }}>
            THIẾT LẬP VÁN CHƠI
          </h1>
          <div className="w-16 h-0.5 bg-[#d4a017] mx-auto mt-3" />
        </motion.div>

        {/* Player slots */}
        <div className="flex flex-col gap-2 mb-8">
          {slots.map((slot, i) => (
            <PlayerSlotCard key={i} slot={slot} index={i} />
          ))}
        </div>

        {/* Player count info */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center font-['Barlow_Condensed'] text-xs text-[#7a8fbb] uppercase tracking-widest mb-4">
          {enabledCount} NGƯỜI CHƠI {!canStart && '— CẦN TỐI THIỂU 2'}
        </motion.p>

        {/* Start button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => canStart && navigate('/game')}
          disabled={!canStart}
          whileHover={canStart ? { filter: 'brightness(1.12)' } : {}}
          whileTap={canStart ? { scale: 0.97 } : {}}
          className={`w-full py-5 flex items-center justify-center gap-3 transition-all
            ${canStart
              ? 'bg-linear-to-br from-[#f6be39] to-[#d4a017] shadow-[0_10px_30px_rgba(212,160,23,0.3)] cursor-pointer'
              : 'bg-[#2a2a2a] cursor-not-allowed'
            }`}>
          <span className={`material-symbols-outlined text-2xl ${canStart ? 'text-[#402d00]' : 'text-[#555]'}`}
            style={{ fontVariationSettings: "'FILL' 1" }}>
            play_arrow
          </span>
          <span className={`font-['Barlow_Condensed'] text-2xl font-black tracking-widest uppercase
            ${canStart ? 'text-[#402d00]' : 'text-[#555]'}`}>
            BẮT ĐẦU CHƠI
          </span>
        </motion.button>
      </div>
    </div>
  );
}
