import { motion, Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import AppTopBar from '../shared/AppTopBar';
import BottomNav from '../landing/BottomNav';
import HeaderRight from '../shared/HeaderRight';
import DiceCard from './DiceCard';
import TokenCard from './TokenCard';
import WealthBundle from './WealthBundle';

interface DiceItem   { image: string; title: string; description: string; price: string; badge?: string; glowing?: boolean }
interface TokenItem  { icon: string; title: string; subtitle: string; featured?: boolean }
interface BundleItem { coins: string; price: string; bgIcon: string; badge?: string; featured?: boolean }

// Mock data - sẽ được phát triển sau
const DICE: DiceItem[] = [];
const TOKENS: TokenItem[] = [];
const BUNDLES: BundleItem[] = [];

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, delay } },
});

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className="h-0.5 w-12 bg-[#f6be39]" />
      <h2 className="font-['Noto_Serif'] text-2xl font-bold text-[#ffdfa0] uppercase tracking-wider">{children}</h2>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="dark min-h-screen bg-[#0e0e0e] text-[#e5e2e1] pb-24 flex justify-center items-center scroll-auto" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      <AppTopBar title="CỬA HÀNG" showWallet rightSlot={<HeaderRight />} />

      <main className="pt-28! px-4 max-w-5xl mx-auto">
        <motion.section initial="hidden" animate="show" variants={fadeUp(0)} className="text-center mb-16">
          <h1 className="font-['Noto_Serif'] text-5xl md:text-6xl font-black text-[#f6be39] uppercase tracking-tighter mb-2"
            style={{ textShadow: '0 0 12px rgba(246,190,57,0.6)' }}>CỬA HÀNG TỶ PHÚ</h1>
          <p className="font-['Barlow_Condensed'] text-[#bdcabe] uppercase tracking-widest text-lg">Premium High-Stakes Atelier</p>
        </motion.section>

        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mb-32">
          <div className="text-center py-16">
            <p className="text-[#bdcabe] text-lg mb-4">Chức năng cửa hàng sẽ được phát triển trong phiên bản tương lai</p>
            <p className="text-[#d4a017] text-sm italic">Vui lòng quay lại sau để trải nghiệm mua sắm vật phẩm độc quyền</p>
          </div>
        </motion.section>
      </main>
      <BottomNav />
    </div>
  );
}
