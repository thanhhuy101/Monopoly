import { motion } from 'framer-motion';
import AppTopBar from '../shared/AppTopBar';
import BottomNav from '../landing/BottomNav';
import PodiumCard from './PodiumCard';
import LedgerRow from './LedgerRow';
import HeaderRight from '../shared/HeaderRight';

interface TopPlayer { rank: 1 | 2 | 3; name: string; title: string; wealth: string; image: string }
interface LedgerPlayer { rank: number; name: string; title: string; wealth: string; image: string }

const TOP3: TopPlayer[] = [
  { rank: 2, name: 'Nguyễn Gia',   title: 'Thánh Địa Ốc', wealth: '945.000.000.000',   image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMyuaKw0DuoweSYF982fALQw0wNv4OENbJ5Dsf0tZ4RgNn4SwiMTN3Jhtb84vH9fNfp7LdNM29mXe9Zl0PxcIiAoDxSgyuYTtkjEf6JZxfG7Iv1JXMJ49NZhPNUHpqz3R3ZODuOmDwK9lhyemaa068cmX3te9HwxW0q1rWelKdyElt-oii_uVuycr1MfOQTJ9DGxFz6hmURdgYMOWjBXFSDe8zvKZLS_0uedQCLiaiBXxrJb3srlcJFF1fiNaiW2u5GHHm9FUU75w' },
  { rank: 1, name: 'Lê Hoàng Đế',  title: 'Đại Tỷ Phú',   wealth: '2.580.000.000.000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLD_C-4zctLGPBhuC-1IRUp0DZFJlb_zRdj4IwpV_d39sfbdh4eA1167u9Y2umn-Zf6oTCROvzqER4hqgTBh8JLvdlS04L7lrQXiaBdnN0qOUgyppuqzQBn2BH66Tv7z06_ZWDXmATL9ZIM7S6Ds9g0P2--uUtlae3cOpQpbCFIjcTSKoBb0sjZ6yNGjvgs16IpAQNIyLkGsqBQ8fbvqXrZ5AVJHDOwmEfH_hChhan90grmvu0G2dOMjN7dl9UnlG3-hHlom3TKko' },
  { rank: 3, name: 'Trần Phú',     title: 'Triệu Phú',     wealth: '720.500.000.000',   image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZqfVvnEYJw6B1-bZ-BVHhARkm2BQZYVagWW4g4bZYCMYohv-8fUDcVXy3GdglbBYmKWrX9R5RCPuG6WUIyjk3F-TnnKaUExOpRDHm6bV2ZG_Gs10tCHm34cLWLTNNdEOm-kNi8R2bhPSGgA1NWowyBUx8szrdH9D7zIFnC5S4TSRInvPUghPXhhJ7MWlSK2fZg-6SmPrWlYGsuLfxWX5mcFuCM_H2STSm3_Y3KKxjH0fSRZDHu9ePqmTmBJNw4hFoYh1B7HUkuPo' },
];

const LEDGER: LedgerPlayer[] = [
  { rank: 4,  name: 'Phạm Thành Công', title: 'ĐẠI ĐIỀN CHỦ', wealth: '512.000.000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXj0cbCiIWYPY0pgXTHSVEJqEHWiL-2u5ZOORTd52p4jPyBKe5F-VWlgugYm4qQfPKOa5G9k5AeGqH_oJ4LOvJeRGXrvCj3jLujhQaOG_l1K-3awg6ABVNXuShR6b3JpdPHvWbp2rnU_bL_CBeGTK76DMj1ZQBFnxJE28M1QBuNxj8DaqpxZr_T0G7UCR60WZPE8JsevrpdNq-Bh6ipEmGui6yFWQICNqvWt4mKeeOVaCKqN0Ie71wAfZHtFGhHXhCZNEeXw5gg0Y' },
  { rank: 5,  name: 'Hoàng Mỹ Nhân',   title: 'TRIỆU PHÚ',     wealth: '480.200.000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnI5kytCfK6Mg9itOuWuEzsrTgCkNrZNeN1eQ-ic6jVJQZhcNpS4F0SOf53IuUOr-LC6-koZEIjy3FncCHHO9miXaiBU0aZ02MSmxzwqUauBGs0tD7oDC0IDFbWghv4_hNbj_PWpRENPUgZbGJZL7Ccik7bvoXpbiADiG1xm_IPiwglF6xSQn5xRV3ae2m2sM2MYi4H40rNbMJASOVzzX52MyNUy_7peZ6M0dWLkDh2FvdbNHF1A1J_9QHTVJDbavOVtP1ywo' },
  { rank: 6,  name: 'Bùi Bí Ẩn',       title: 'TRIỆU PHÚ',     wealth: '350.700.000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9-5DqSue-2xmG1kyyEN-8xNMEDtiogdznhypOeZMPtB-kovV2r_Dq8SaEJAMflLFtjW4HhfWn7WMKEiB1uzb0hvpq_mi7yMlzTzJLxzHChDS97Gvl7dcTh0AtTAN-TiSv6_n3hD4UIyOTsHdWwbvQRNlDs6Ya7RTPZxmko7hEz-oP1OlusOZ4cmJaanSZVVlTcIq3IB8YBxL5lS4LlEH5frYMHP48T6m5sQClHlY7aF9wt_zVk6beHs4puWs_P05E4hX9gbZ3DDo' },
  { rank: 7,  name: 'Vũ Quý Tộc',      title: 'ĐIỀN CHỦ',      wealth: '299.100.000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7gcRWd1BmB6VksreB5PUwrVMRewrDtl_UIr_A877-6a74TjxlPWegUoPJAryXcbh0pJNwKhqXzf2m8EBfkNjitPGx1CnvEtyG9aQuizwx9AgL7DhwGju_NwxvKMtYpHI_leiSR5yS9sWQRJG4RMS_H2TEQwJPK1Za7VIL6y_Cs4sJOksYMVG44pbQyDsQqLuoCjIc3y-6Q2Y-P2sMhG0hYGJGUTCT1sefjbiocIzqaRTu8wrpTtLvbozRc9pMO2qKgWZPPe0IXfQ' },
  { rank: 8,  name: 'Lý Thắng Lợi',    title: 'ĐIỀN CHỦ',      wealth: '245.000.000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_5sNclPSjQE5BD3t2RhJRs3iGnngoAuNwDo-mrdPGKuUjFGGyFnpClek4QbiHPLtgMNWMAHPDaCzLHpAqL5Paoi5XaTZIMsAR3NNnKsiGBNMRqlPJPiiGOCNq5wL0w_T1EXF-juErH8yZCr7nlzDjfShYn8f0XmKheYV0ImSx1mC4-8qbMSZkCX-z5ZVMxAvriS4bxoTuh9yTUXXmrRy0mGnaK43RXvuPMyaJcC35NUgbI9qK2KheC5OJb01erGC7gYvgCAE00Fc' },
  { rank: 9,  name: 'Mai Hạnh Phúc',   title: 'PHÚ HỘ',        wealth: '188.400.000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5bGfp0pMuPJMjMnv2m3mTlPFg0clfHnyhD44sRh9QIUsjaznKn4z1Q7v4UaAY8FfU9iXiuA2-SnsBLE59yDYiTAG-LvO8nO6TIK4_rlU5uFYkDcGoCkWsC820NOLMN0CZMwJp1GEYuizyomFQp5HZAP_JGi2ZOqcZZKfnGQuxA4wD-adBNf9KYpJdCNeda92KbPpjh5XC6WuwUA' },
  { rank: 10, name: 'Đặng Đại Phú',    title: 'PHÚ HỘ',        wealth: '150.000.000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs0qJ3PyWOuTMrO3Dvtk4a6EvqERD2JyWrq_4NwBGOskkjwiZmbtS6V1OdD-rfaENVPy0qASaQe7TkF9l7pQF_o_sUvuGT_sMNgWe2TBlC6Yp5HLfpRVsEJVRrUXmYWTQZl1PgsyFBRUMtWJ1l4cWTwlg8pgV1yqGJgnYBN-xyRvW8yJw67tsK--7dJE6aw3qRaWLjPyfyCWvRj2OuzELTbZW7s7LftU91afJmnV8C5eATyT03KlMo3Y309RLj4NSv-X6RlIoE5TA' },
];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end px-4 pt-14!">
          {PODIUM_ORDER.map(r => { const p = TOP3.find(x => x.rank === r)!; return <PodiumCard key={r} {...p} />; })}
        </div>

        <div className="bg-[#0e0e0e] border-2 border-[#4f4634]/20 mb-12">
          <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-[#4f4634]/10 bg-[#1c1b1b] font-['Barlow_Condensed'] text-[10px] uppercase tracking-widest text-[#cac6be] font-bold">
            <div className="col-span-1">Hạng</div>
            <div className="col-span-6 md:col-span-7">Đại Gia</div>
            <div className="col-span-5 md:col-span-4 text-right">Tổng Tài Sản</div>
          </div>
          {LEDGER.map((row, i) => <LedgerRow key={row.rank} {...row} striped={i % 2 !== 0} />)}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col items-center mb-24">
          <motion.button whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.96 }}
            className="bg-linear-to-br from-[#f6be39] to-[#d4a017] px-12 py-4 text-[#261a00] font-['Barlow_Condensed'] font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(212,160,23,0.3)] transition-all">
            THÁCH ĐẤU NGAY
          </motion.button>
          <p className="mt-4 font-['Barlow_Condensed'] text-[10px] text-[#cac6be] tracking-widest uppercase">Leo hạng để nhận phần thưởng độc quyền</p>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
