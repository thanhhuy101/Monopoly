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

const DICE: DiceItem[] = [
  { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlG4NKPTJadjRlDyuuPRQ9dXNzpW6CvlZBcX8_P_XHv-acCvdCmYZSBpYQUPCpueQ1A_XYQ1cSBiknl2pYWfTh5tiDxmqtmzcz2JKvJoYRU__ORn0OePFTllOKlkPDoiPrKBFn2HDIbje1nOI7M5tLocBwsnexxLd29g02UPaqCp8RQVRwVBCl_Jx0p82rlnWBXFEnuzoXwd30w5YbYw7OgpiyzhRRPV2z1KbkwP3Bf7lBtHi_rjSL-EU5kVChkRRNVPwNJsgwDkY', title: 'Xúc Xắc Ngà Voi', description: 'Chế tác từ ngà thượng hạng, mang lại cảm giác nhẹ nhàng và thanh thoát trong mỗi lượt gieo.', price: '150,000' },
  { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaSN6bgy1arS_WDc-TBZnswwIPE71mpCm6LdNvkNPStajrGLfYHfMOr3GD9yuAUfr2aDVvI_1mgDIf9qUf2onEmgikZiVnjDFtnR6iHbupjXFLi46UOe-e0pD20PPm5M4ErknyyUXdpV8khzjBUuLnLWKX6bgSkzpCP7nBQEIfdeubW66w3suhz_cZ8BO7OMBS6vB73J4ZdEqrTkVvk1OyadU4aV2UaLMOSrS7bmXnMyvMcXsONyasx944ignEABEtsa8bwnMkR-I', title: 'Xúc Xắc Hoàng Kim', description: 'Đúc bằng vàng ròng 24K nguyên khối, biểu tượng tuyệt đối của sự giàu sang và quyền lực.', price: '500,000', badge: 'Bán Chạy', glowing: true },
  { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGSTUBhwcGahGCtNoqBsmwXY1rG_55xI4gH6KkVBitZaHA57zSZhAbPSduIAdDYOLkZ_JuJq7zvT52YU2HJl5BqYxgTLhiwSOgyjxhL8nX2sqTa8D5N8mo8QNHOXfwvvUoOquu_tvtbx46bJIQa5ugSTMFauVwqNt8BZt2QYSB-h5pkx5-k_fdXT8SF000OQXFZb29wNC61HOyMUoh-K6WCsvksTbnjKBn-IaGCPQcj7tftjCPcqRwgLyH6_qR0BzoZcuSNa3hx2o', title: 'Xúc Xắc Cổ Ngọc', description: 'Chạm khắc từ ngọc bích nghìn năm, mang theo vận may cổ xưa đến với những ván cờ định mệnh.', price: '350,000' },
];

const TOKENS: TokenItem[] = [
  { icon: 'stars',         title: 'Long Thần',   subtitle: 'Hoàng Gia Chi Bảo',   featured: true },
  { icon: 'castle',        title: 'Hoàng Thành', subtitle: 'Trấn Quốc Uy Nghi' },
  { icon: 'local_florist', title: 'Bạch Liên',   subtitle: 'Thanh Cao Thoát Tục' },
];

const BUNDLES: BundleItem[] = [
  { coins: '50.000',    price: '100.000',   bgIcon: 'monetization_on' },
  { coins: '120.000',   price: '200.000',   bgIcon: 'payments' },
  { coins: '350.000',   price: '500.000',   bgIcon: 'payments',  badge: '+15% Bonus' },
  { coins: '1.000.000', price: '1.000.000', bgIcon: 'diamond',   badge: 'Best Value', featured: true },
];

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
    <div className="dark min-h-screen bg-[#0e0e0e] text-[#e5e2e1] pb-24" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      <AppTopBar title="CỬA HÀNG" showWallet rightSlot={<HeaderRight />} />

      <main className="pt-24! px-6 max-w-7xl mx-auto">
        <motion.section initial="hidden" animate="show" variants={fadeUp(0)} className="text-center mb-16">
          <h1 className="font-['Noto_Serif'] text-5xl md:text-6xl font-black text-[#f6be39] uppercase tracking-tighter mb-2"
            style={{ textShadow: '0 0 12px rgba(246,190,57,0.6)' }}>CỬA HÀNG TỶ PHÚ</h1>
          <p className="font-['Barlow_Condensed'] text-[#bdcabe] uppercase tracking-widest text-lg">Premium High-Stakes Atelier</p>
        </motion.section>

        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mb-20">
          <motion.div variants={fadeUp(0)}><SectionHeading>BỘ XÚC XẮC THƯỢNG HẠNG</SectionHeading></motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DICE.map((d, i) => <motion.div key={d.title} variants={fadeUp(i * 0.1)} className="h-full"><DiceCard {...d} /></motion.div>)}
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mb-20">
          <motion.div variants={fadeUp(0)}><SectionHeading>BIỂU TƯỢNG ĐỘC QUYỀN</SectionHeading></motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOKENS.map((t, i) => <motion.div key={t.title} variants={fadeUp(i * 0.1)}><TokenCard {...t} /></motion.div>)}
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mb-32">
          <motion.div variants={fadeUp(0)}><SectionHeading>NGUỒN VỐN ĐẦU TƯ</SectionHeading></motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BUNDLES.map((b, i) => <motion.div key={b.coins} variants={fadeUp(i * 0.08)}><WealthBundle {...b} /></motion.div>)}
          </div>
        </motion.section>
      </main>
      <BottomNav />
    </div>
  );
}
