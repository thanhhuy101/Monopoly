import { motion } from 'framer-motion';

interface Props { icon: string; title: string; subtitle: string; featured?: boolean }

export default function TokenCard({ icon, title, subtitle, featured = false }: Props) {
  return (
    <motion.div whileHover={{ borderColor: '#f6be39' }}
      className={`p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 group border-b-4 ${featured ? 'border-[#f6be39]' : 'border-[#4f4634] hover:border-[#f6be39]'}`}
      style={{ background: 'rgba(53,53,52,0.6)', backdropFilter: 'blur(12px)' }}>
      <div className={`w-24 h-24 mb-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${featured ? 'border-[#f6be39] text-[#f6be39] group-hover:bg-[#f6be39] group-hover:text-[#402d00]' : 'border-[#4f4634] text-[#4f4634] group-hover:border-[#f6be39] group-hover:text-[#f6be39]'}`}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, fontVariationSettings: featured ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
      </div>
      <h3 className="font-['Noto_Serif'] text-2xl font-bold text-white mb-2">{title}</h3>
      <p className={`font-['Barlow_Condensed'] uppercase tracking-widest text-sm mb-4 ${featured ? 'text-[#f6be39]' : 'text-[#bdcabe]'}`}>{subtitle}</p>
      <motion.button whileTap={{ scale: 0.97 }}
        className={`border-2 px-8 py-2 font-['Barlow_Condensed'] font-bold uppercase transition-all ${featured ? 'border-[#f6be39] text-[#f6be39] hover:bg-[#f6be39] hover:text-[#402d00]' : 'border-[#4f4634] text-[#4f4634] hover:border-[#f6be39] hover:text-[#f6be39]'}`}>
        Xem Chi Tiết
      </motion.button>
    </motion.div>
  );
}
