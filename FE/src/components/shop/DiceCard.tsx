import { motion } from 'framer-motion';

interface Props {
  image: string; title: string; description: string;
  price: string; badge?: string; glowing?: boolean;
}

export default function DiceCard({ image, title, description, price, badge, glowing = false }: Props) {
  return (
    <motion.div whileHover={{ y: -4, boxShadow: '0 0 20px rgba(212,160,23,0.4)' }} transition={{ duration: 0.3 }}
      className={`bg-[#0e0e0e] flex flex-col h-full group relative overflow-hidden border-2 transition-colors duration-500 ${glowing ? 'border-[#f6be39]' : 'border-[#4f4634] hover:border-[#f6be39]'}`}>
      {badge && (
        <div className="absolute top-0 right-0 bg-[#f6be39] text-[#261a00] px-3 py-1 font-['Barlow_Condensed'] font-black text-xs uppercase tracking-widest z-10">
          {badge}
        </div>
      )}
      <div className="h-64 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0e0e0e] to-transparent" />
      </div>
      <div className="p-6 flex flex-col grow">
        <h3 className={`font-['Noto_Serif'] text-xl mb-2 ${glowing ? 'text-[#f6be39]' : 'text-[#ffdfa0]'}`}
          style={glowing ? { textShadow: '0 0 12px rgba(246,190,57,0.6)' } : undefined}>
          {title}
        </h3>
        <p className="text-[#d3c5ae] text-sm mb-6 grow">{description}</p>
        <div className="mt-auto flex justify-between items-center">
          <span className="font-['Barlow_Condensed'] font-bold text-xl text-white">{price} GOLD</span>
          <motion.button whileTap={{ scale: 0.95 }}
            className="bg-linear-to-br from-[#f6be39] to-[#d4a017] px-4 py-2 text-[#261a00] font-['Barlow_Condensed'] font-bold uppercase tracking-tighter transition-all"
            style={glowing ? { boxShadow: '0 0 15px rgba(246,190,57,0.4)' } : undefined}>
            Sở Hữu
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
