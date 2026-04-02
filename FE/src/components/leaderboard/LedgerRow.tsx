import { motion } from 'framer-motion';

interface Props { rank: number; name: string; title: string; wealth: string; image: string; striped?: boolean }

export default function LedgerRow({ rank, name, title, wealth, image, striped = false }: Props) {
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      transition={{ delay: rank * 0.04, duration: 0.35 }}
      className={`grid grid-cols-12 items-center gap-4 px-8 py-6 border-b border-[#4f4634]/10 hover:bg-[#201f1f] transition-colors ${striped ? 'bg-[#1c1b1b]/30' : ''}`}>
      <div className="col-span-1 font-['Noto_Serif'] text-2xl font-black text-[#cac6be] italic">{String(rank).padStart(2, '0')}</div>
      <div className="col-span-6 md:col-span-7 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#2a2a2a] border border-[#4f4634] shrink-0 overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-['Noto_Serif'] text-sm font-bold uppercase tracking-tight text-[#e5e2e1]">{name}</h4>
          <span className="font-['Barlow_Condensed'] text-[10px] text-[#9eaba0] bg-[#2a2a2a] px-2 py-0.5 border-l-2 border-[#d4a017]">{title}</span>
        </div>
      </div>
      <div className="col-span-5 md:col-span-4 text-right">
        <span className="font-['Barlow_Condensed'] font-bold text-[#f6be39] text-lg">{wealth} <span className="text-xs opacity-60">K</span></span>
      </div>
    </motion.div>
  );
}
