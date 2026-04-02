import { motion, Variants } from 'framer-motion';

const OPERA_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK93MzjZOEGNCO1FVUUOHqaSgk5ZDu5G_t-4aboy-znt7i1XNVLgdgeAhPAWaEdZ4K1CiB1Yw0Sdrp9DhPBhtScRt9-DrDyEw6jTiOWRhlNzEDVYXVuh0bcTFH4k7PFLXQA3VXbB1mWhIXA-AT0RJjYXYxkNuqyDm4LNnN73dWwOTzArIJ4u4lqkfOyXE7HMCTQPjSKfrepCJKvtvUyyzhIX83a0arlOmGc8jho72iTYKpLPb5j1Qqw8Z6kdmZOV-NsDYLM218U1A';

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
});

export default function FeaturedProperties() {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
      className="mt-24 px-6 w-full max-w-6xl pb-16">
      <motion.div variants={fadeUp(0)} className="flex items-center gap-4 mb-8">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#d4a017]" />
        <h3 className="font-['Noto_Serif'] text-2xl text-[#f6be39] tracking-widest uppercase italic whitespace-nowrap">
          Bộ Sưu Tập Thẻ Ấn Tượng
        </h3>
        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#d4a017]" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[400px]">
        {/* Opera House */}
        <motion.div variants={fadeUp(0.1)}
          className="md:col-span-2 md:row-span-2 bg-[#201f1f] relative overflow-hidden group border-2 border-[#d4a017]/20 cursor-pointer">
          <img src={OPERA_IMG} alt="Nhà Hát Lớn"
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
            <span className="text-[#bdcabe] font-['Barlow_Condensed'] text-sm uppercase tracking-[0.2em] mb-1">Dinh Thự Đắt Giá</span>
            <h4 className="font-['Playfair_Display'] text-4xl text-[#f6be39] mb-4">NHÀ HÁT LỚN</h4>
            <div className="flex justify-between items-center pt-4 border-t border-[#d4a017]/30">
              <span className="font-['Barlow_Condensed'] text-[#f6be39] text-xl">4,500,000 $</span>
              <span className="material-symbols-outlined text-[#f6be39]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
          </div>
        </motion.div>

        {/* Bank */}
        <motion.div variants={fadeUp(0.2)}
          className="bg-[#2a2a2a] p-6 flex flex-col justify-between border-2 border-[#d4a017]/20 hover:border-[#d4a017] transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[#f6be39] text-4xl">account_balance</span>
          <div>
            <h4 className="font-['Noto_Serif'] text-lg text-[#e5e2e1] mb-1">NGÂN HÀNG ĐÔNG DƯƠNG</h4>
            <span className="font-['Barlow_Condensed'] text-[#f6be39] text-sm uppercase">Cổ Phiếu Hiếm</span>
          </div>
        </motion.div>

        {/* Diamond */}
        <motion.div variants={fadeUp(0.3)}
          className="bg-[#2a2a2a] p-6 flex flex-col justify-between border-2 border-[#d4a017]/20 hover:border-[#d4a017] transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[#bdcabe] text-4xl">diamond</span>
          <div>
            <h4 className="font-['Noto_Serif'] text-lg text-[#e5e2e1] mb-1">KHO BÁU HOÀNG GIA</h4>
            <span className="font-['Barlow_Condensed'] text-[#bdcabe] text-sm uppercase">Sự Kiện Đặc Biệt</span>
          </div>
        </motion.div>

        {/* Leaderboard banner */}
        <motion.div variants={fadeUp(0.4)}
          className="md:col-span-2 bg-[#1c1b1b] p-6 flex items-center justify-between border-2 border-[#d4a017]/20 relative group overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px,rgba(212,160,23,0.4) 1px,transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="z-10">
            <h4 className="font-['Playfair_Display'] text-3xl text-[#f6be39] mb-2">BẢNG VÀNG DANH VỌNG</h4>
            <p className="font-['Work_Sans'] text-sm text-[#9b8f7a] max-w-[200px]">Trở thành huyền thoại tài chính trong mùa giải 2024.</p>
          </div>
          <motion.button whileHover={{ backgroundColor: '#d4a017', color: '#0e0e0e' }} whileTap={{ scale: 0.95 }}
            className="z-10 bg-[#d4a017]/20 border border-[#d4a017] p-4 transition-all text-[#f6be39]">
            <span className="material-symbols-outlined">military_tech</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
