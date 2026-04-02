import { motion } from 'framer-motion';

interface RankStyle { border: string; badgeClass: string; badgeTextColor: string; size: string; rotate: string; scale: string; moneyColor: string }

const RANK_STYLES: Record<number, RankStyle> = {
  1: { border: '#f6be39', badgeClass: 'bg-gradient-to-br from-[#f6be39] to-[#d4a017]', badgeTextColor: '#261a00', size: 'w-44 h-44', rotate: '-rotate-3', scale: 'scale-110', moneyColor: 'text-[#f6be39]' },
  2: { border: '#cac6be', badgeClass: 'bg-[#cac6be]',                                    badgeTextColor: '#32302b', size: 'w-32 h-32', rotate: 'rotate-3',  scale: '',           moneyColor: 'text-[#f6be39]' },
  3: { border: '#8c5a3c', badgeClass: 'bg-[#8c5a3c]',                                    badgeTextColor: 'white',   size: 'w-32 h-32', rotate: '-rotate-2', scale: '',           moneyColor: 'text-[#f6be39]' },
};

interface Props { rank: 1 | 2 | 3; name: string; title: string; wealth: string; image: string }

export default function PodiumCard({ rank, name, title, wealth, image }: Props) {
  const s = RANK_STYLES[rank];
  const isFirst = rank === 1;
  return (
    <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.12, type: 'spring', stiffness: 240, damping: 22 }}
      className={`flex flex-col items-center group ${s.scale}`}>
      <div className={`relative ${isFirst ? 'mb-8' : 'mb-6'}`}>
        {isFirst && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <span className="material-symbols-outlined text-[#f6be39] text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>rewarded_ads</span>
          </div>
        )}
        <div className={`${s.size} border-4 p-1 ${s.rotate} group-hover:rotate-0 transition-transform duration-500`}
          style={{ borderColor: s.border, boxShadow: isFirst ? '0 0 30px rgba(246,190,57,0.3)' : 'none' }}>
          <img src={image} alt={`Rank ${rank}`} className="w-full h-full object-cover" />
        </div>
        <div className={`absolute -bottom-4 -right-4 px-4 py-1 font-['Noto_Serif'] font-black text-xl italic ${s.badgeClass}`}
          style={{ color: s.badgeTextColor, boxShadow: isFirst ? '0 10px 20px rgba(212,160,23,0.3)' : 'none' }}>
          #{rank}
        </div>
      </div>
      <div className="text-center">
        <h3 className={`font-['Noto_Serif'] ${isFirst ? 'text-2xl font-black' : 'text-xl font-bold'} uppercase tracking-wide`}
          style={{ color: isFirst ? '#f6be39' : '#e5e2e1', textShadow: isFirst ? '0 0 8px rgba(246,190,57,0.4)' : 'none' }}>
          {name}
        </h3>
        <p className="font-['Barlow_Condensed'] text-[#9eaba0] uppercase text-xs font-bold tracking-widest mb-2">{title}</p>
        <div className={`px-4 py-2 ${isFirst ? 'px-6 py-3 border-b-4' : 'border-b-2'} bg-[#2a2a2a]`}
          style={{ borderColor: s.border, boxShadow: isFirst ? '0 20px 40px rgba(0,0,0,0.5)' : 'none' }}>
          <span className={`font-['Barlow_Condensed'] ${isFirst ? 'font-black text-xl' : 'font-bold text-lg'} ${s.moneyColor}`}>
            {wealth} <span className="text-xs">₫</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
