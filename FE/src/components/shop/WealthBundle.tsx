import { motion } from 'framer-motion';

interface Props { coins: string; price: string; bgIcon: string; badge?: string; featured?: boolean }

export default function WealthBundle({ coins, price, bgIcon, badge, featured = false }: Props) {
  return (
    <motion.div whileHover={{ backgroundColor: '#2a2a2a' }} whileTap={{ scale: 0.97 }}
      className={`p-6 flex flex-col gap-4 border-l-4 relative overflow-hidden cursor-pointer transition-colors ${featured ? 'bg-[#1a1a1a] border-[#f6be39]' : 'bg-[#2a2a2a] border-[#d4a017]'}`}
      style={featured ? { boxShadow: 'inset 0 0 20px rgba(246,190,57,0.1)' } : undefined}>
      {badge && (
        <div className="absolute top-0 right-0 bg-[#f6be39] text-[#261a00] px-2 py-1 font-['Barlow_Condensed'] font-bold text-[10px] uppercase">{badge}</div>
      )}
      <div className="absolute -right-4 -top-4 text-[#f6be39] opacity-10 pointer-events-none">
        <span className="material-symbols-outlined" style={{ fontSize: 64 }}>{bgIcon}</span>
      </div>
      <div className="flex flex-col relative z-10">
        <span className="font-['Barlow_Condensed'] text-[#f6be39] font-black text-2xl tracking-tighter">{coins}</span>
        <span className="font-['Barlow_Condensed'] text-[#bdcabe] uppercase text-xs font-bold tracking-widest">TỶ PHÚ XU</span>
      </div>
      <div className="mt-4 relative z-10">
        <span className="font-['Barlow_Condensed'] text-white font-bold text-lg">{price} VND</span>
      </div>
    </motion.div>
  );
}
