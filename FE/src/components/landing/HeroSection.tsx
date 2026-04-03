import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ModeBtn { icon: string; label: string; route: string }

const MODE_BUTTONS: ModeBtn[] = [
  { icon: 'smart_toy',  label: 'CHƠI VỚI MÁY',  route: '/setup' },
  { icon: 'language',   label: 'ĐẤU TRỰC TUYẾN', route: '/online' },
];

const BOARD_IMG = '/src/assets/room_vip.png';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
});

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="z-10 text-center px-6 max-w-4xl w-full">
      <motion.div variants={fadeUp(0.1)} initial="hidden" animate="show" className="mb-2">
        <span className="font-['Barlow_Condensed'] text-[#f6be39] tracking-[0.3em] text-sm font-semibold uppercase opacity-80">
          Indochine Heritage Edition
        </span>
      </motion.div>

      <motion.h2 variants={fadeUp(0.2)} initial="hidden" animate="show"
        className="font-['Playfair_Display'] text-7xl md:text-9xl text-[#f6be39] font-black uppercase tracking-tighter mb-2"
        style={{ textShadow: '0 0 12px rgba(246,190,57,0.6)' }}>
        CỜ TỶ PHÚ
      </motion.h2>

      <motion.p variants={fadeUp(0.3)} initial="hidden" animate="show"
        className="font-['Noto_Serif'] text-[#bdcabe] tracking-[0.15em] text-lg md:text-xl font-light italic mb-12">
        BẢN THIẾT KẾ ĐÔNG DƯƠNG CAO CẤP
      </motion.p>

      <motion.div variants={fadeUp(0.4)} initial="hidden" animate="show"
        className="relative w-full aspect-video md:aspect-21/9 mb-12 group">
        <div className="absolute inset-0 bg-[#d4a017]/10 border-2 border-[#d4a017]/40" />
        <div className="absolute inset-0 bg-[#201f1f] shadow-2xl border-2 border-[#d4a017] overflow-hidden">
          <img src={BOARD_IMG} alt="Premium Board Game" className="w-full h-full object-cover opacity-50 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="text-left">
              <span className="block font-['Barlow_Condensed'] text-[#f6be39] text-xs tracking-widest uppercase">Trạng Thái Sảnh</span>
              <span className="block font-['Noto_Serif'] text-2xl text-[#e5e2e1]">1,248 Người Đang Đấu</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 bg-[#f6be39] animate-pulse" />
              <span className="font-['Barlow_Condensed'] text-xs text-[#f6be39] uppercase">Máy Chủ VIP 01</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp(0.55)} initial="hidden" animate="show"
        className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
        <motion.button
          onClick={() => navigate('/setup')}
          whileHover={{ filter: 'brightness(1.12)' }} whileTap={{ scale: 0.96 }}
          className="w-full py-5 flex items-center justify-center gap-3 bg-linear-to-br from-[#f6be39] to-[#d4a017] shadow-[0_10px_30px_rgba(212,160,23,0.3)] transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[#402d00] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
          <span className="font-['Barlow_Condensed'] text-3xl font-black text-[#402d00] tracking-widest uppercase">CHƠI NGAY</span>
        </motion.button>

        <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
          {MODE_BUTTONS.map(btn => (
            <motion.button key={btn.label} onClick={() => navigate(btn.route)}
              whileHover={{ backgroundColor: '#2a2a2a', borderColor: '#f6be39' }} whileTap={{ scale: 0.96 }}
              className="border-2 border-[#d4a017]/50 bg-[#1c1b1b] py-4 px-2 transition-all flex flex-col items-center justify-center gap-1 group cursor-pointer">
              <span className="material-symbols-outlined text-[#f6be39] group-hover:scale-110 transition-transform">{btn.icon}</span>
              <span className="font-['Barlow_Condensed'] text-xs font-bold text-[#e5e2e1] uppercase tracking-tighter">{btn.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
