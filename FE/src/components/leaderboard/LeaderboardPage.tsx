import { motion } from 'framer-motion';
import AppTopBar from '../shared/AppTopBar';
import BottomNav from '../landing/BottomNav';
import PodiumCard from './PodiumCard';
import LedgerRow from './LedgerRow';
import HeaderRight from '../shared/HeaderRight';

interface TopPlayer { rank: 1 | 2 | 3; name: string; title: string; wealth: string; image: string }
interface LedgerPlayer { rank: number; name: string; title: string; wealth: string; image: string }

// Mock data - sẽ được phát triển sau
const TOP3: TopPlayer[] = [];
const LEDGER: LedgerPlayer[] = [];

const PODIUM_ORDER: (1 | 2 | 3)[] = [2, 1, 3];

export default function LeaderboardPage() {
  return (
    <div className="dark min-h-screen bg-[#131313] text-[#e5e2e1] pb-24 flex justify-center items-center scroll-auto" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      <AppTopBar rightSlot={<HeaderRight />} />

      <main className="pt-28! px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="font-['Noto_Serif'] text-9xl font-black tracking-tighter uppercase select-none">ELITE</span>
          </div>
          <h2 className="font-['Noto_Serif'] text-4xl md:text-5xl font-black text-[#f6be39] uppercase tracking-widest relative z-10"
            style={{ textShadow: '0 0 8px rgba(246,190,57,0.4)' }}>Bảng Vàng Danh Vọng</h2>
          <p className="font-['Barlow_Condensed'] text-[#cac6be] uppercase tracking-[0.3em] mt-2 text-sm">Vinh danh những bậc thầy bất động sản</p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-[2px] w-12 bg-[#d4a017]" /><div className="h-[2px] w-4 bg-[#f6be39]" /><div className="h-[2px] w-12 bg-[#d4a017]" />
          </div>
        </motion.div>

        <div className="text-center py-16 mb-16">
          <p className="text-[#bdcabe] text-lg mb-4">Chức năng bảng vàng sẽ được phát triển trong phiên bản tương lai</p>
          <p className="text-[#d4a017] text-sm italic">Vinh danh những người chơi xuất sắc nhất</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
