import AuthLayout from '../auth/AuthLayout';

const FEATURED_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD_xI1kebGfEnxKaGNcN-xEaGhLqI9P026s3LlWmmAg4b0dv6DJOw04jiJ1L8l7Ti7UvpoXJnTKUhr6NhptEoxqK6WQxD9dqvK9zDjwapmNDWZJPo9l6hD3b4mVsLAvuWumfkoElU7aZO6fn1ScfbU2c3TQAUS7XJOk2LMFHJ5uYwQB2XS9aq0YV2HzfP4td8VuyfGJTJVjug8y-Dt7ODqLSYyqt75vfmfnfO8TntL5plTtNwEaHasSZ3_pGXS8tKsFU09NLyQk2ZU';

const NEWS_ITEMS = [
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGh2b01JTU_XAeNaMb7Ou1-tvr4JCzwBmt_0E2221nh8u6R6H4gqLNERwGFRRTxrgd2cm6lG5mA3OKNqwbhRXTOIy06R7mkIBFZWzasJJtYdPQSU3fq-iklTqOiT-C0tKolf6NRJZPEQw73hgpO5g-DX66_V9LJCd1mA03o-IzAozanw7w-dWhlhXP1iCxXzhMfmTjoKr6HNDvM6q_r_pkk7Ney_U9LKIb3TE8v6yXoTW8L6EZ4-iG2DoNn-shEXX3QITRqRCzMf0',
    badge: 'Cửa Hàng',
    badgeStyle: 'bg-[#353534] border border-[rgba(212,160,23,0.3)]' as const,
    date: 'Cập Nhật • 12.03.2026',
    title: 'Cập Nhật Bộ Xúc Xắc Cổ Ngọc',
    desc: 'Vật phẩm giới hạn mang lại may mắn tối thượng cho chủ sở hữu trong các ván đấu cao cấp.',
    cta: 'Khám phá ngay',
  },
  {
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApjvoWNPzqZNBL_tmkzBg_dDmLIwKbl21kaU3NKQJBrSTXBzh5VVwxxNR149LzT0q3dzMXfCgxsKRwAYP7Jc0MdAeN9UL3Xgvipos_PW6eCwnbE9DesCOt8lJpnJiGQjhH0yYpsZ5VsYrMUkeMTnKBY4_igTeD802Or9cQZnz3Ay06KKGDENg66NA3ESlRuF6Xfezrsxh_5sLFkHEF3RnZwudiI1Jj4YREiI-XK1cPxakXI85Un2KrDY8P9wJv3aGVwOSCseXutxs',
    badge: 'Giới Hạn',
    badgeStyle: 'bg-[#f6be39] text-[#261a00]' as const,
    date: 'Sự Kiện • 10.03.2026',
    title: 'Sự Kiện Tết Indochine',
    desc: 'Thu thập bao lì xì vàng để đổi lấy trang phục "Hoàng Tộc" độc quyền chỉ có trong mùa xuân này.',
    cta: 'Tham gia ngay',
  },
  {
    img: null,
    badge: null,
    badgeStyle: '' as const,
    date: 'Hệ Thống • 08.03.2026',
    title: 'Thông Báo Bảo Trì',
    desc: 'Nâng cấp máy chủ để chuẩn bị cho mùa giải mới. Thời gian dự kiến: 02:00 - 05:00 sáng mai.',
    cta: 'Lịch trình',
  },
];

export default function NewsPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-7xl mx-auto" style={{ marginTop: -40 }}>
        {/* Featured News */}
        <section className="mb-12">
          <div className="relative group overflow-hidden border-2 border-[#d4a017]" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
            <div className="aspect-[21/9] w-full relative">
              <img
                alt="Featured News"
                className="w-full h-full object-cover"
                src={FEATURED_IMG}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#f6be39] text-[#261a00] font-['Barlow_Condensed'] font-black px-3 py-1 text-xs tracking-tighter uppercase">
                    Sự Kiện Đặc Biệt
                  </span>
                  <span className="text-[#bdcabe] font-['Barlow_Condensed'] text-xs tracking-widest uppercase">
                    15 Tháng 3, 2026
                  </span>
                </div>
                <h2
                  className="text-3xl md:text-5xl font-['Noto_Serif'] font-bold text-[#f6be39] mb-4 leading-tight uppercase"
                  style={{ textShadow: '0 0 8px rgba(246,190,57,0.4)' }}
                >
                  Giải Đấu Tỷ Phú 2026 - Mùa Xuân
                </h2>
                <p className="text-[#d3c5ae] font-['Work_Sans'] text-lg max-w-xl">
                  Tham gia cuộc so tài của những bậc thầy bất động sản để giành lấy chiếc cúp Vàng
                  L'Indochine danh giá và 10.000.000 Kim Cương.
                </p>
              </div>
              <button
                className="font-['Barlow_Condensed'] font-black py-4 px-10 text-lg uppercase tracking-widest text-[#261a00] hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
                style={{ background: 'linear-gradient(135deg, #f6be39, #d4a017)' }}
              >
                Xem Chi Tiết
                <span className="material-symbols-outlined font-bold">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Secondary News Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {NEWS_ITEMS.map((item, i) => (
            <div key={i} className="bg-[#201f1f] border-t-4 border-[#d4a017] flex flex-col shadow-xl">
              {/* Image */}
              {item.img ? (
                <div className="aspect-video relative overflow-hidden">
                  <img alt={item.title} className="w-full h-full object-cover" src={item.img} />
                  {item.badge && (
                    <div className={`absolute top-4 right-4 px-3 py-1 ${item.badgeStyle}`}>
                      <span className="font-['Barlow_Condensed'] text-[10px] uppercase font-bold tracking-widest">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video relative overflow-hidden bg-[#0e0e0e] flex items-center justify-center border-b border-[rgba(79,70,52,0.2)]">
                  <span className="material-symbols-outlined text-6xl text-[rgba(246,190,57,0.2)]">
                    settings_suggest
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-[rgba(212,160,23,0.2)] rotate-45 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#f6be39] text-3xl -rotate-45">
                        build
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {/* Content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[#bdcabe] font-['Barlow_Condensed'] text-[10px] tracking-[0.2em] uppercase mb-2 block">
                    {item.date}
                  </span>
                  <h3 className="font-['Noto_Serif'] text-xl text-[#e5e2e1] mb-3 uppercase leading-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[#d3c5ae] font-['Work_Sans'] text-sm mb-6 opacity-80">
                  {item.desc}
                </p>
                <a
                  href="#"
                  className="text-[#f6be39] font-['Barlow_Condensed'] text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:translate-x-1 transition-transform"
                >
                  {item.cta}
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* Archive CTA */}
        <section className="mt-20 py-12 border-2 border-[rgba(79,70,52,0.3)] flex flex-col items-center text-center px-6">
          <span className="material-symbols-outlined text-[#f6be39] text-4xl mb-4">
            auto_stories
          </span>
          <h2 className="font-['Noto_Serif'] text-2xl text-[#f6be39] uppercase tracking-widest mb-4">
            Lưu Trữ Hoàng Gia
          </h2>
          <p className="font-['Work_Sans'] text-[#d3c5ae] max-w-lg mb-8">
            Khám phá lại những sự kiện lịch sử và các giải đấu đã qua trong thư viện tin tức của
            Monopoly L'Indochine.
          </p>
          <button className="border-2 border-[#d4a017] text-[#f6be39] font-['Barlow_Condensed'] font-bold py-3 px-12 uppercase tracking-[0.2em] hover:bg-[rgba(212,160,23,0.1)] transition-colors active:scale-95">
            Xem Tất Cả Tin Tức
          </button>
        </section>
      </div>
    </AuthLayout>
  );
}
