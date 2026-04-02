import { useNavigate } from 'react-router-dom';
import AuthLayout from '../auth/AuthLayout';
import HERO_IMG from '../../assets/hero.png';
import BOARD_IMG from '../../assets/board.png';

export default function GuidePage() {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <div className="w-full max-w-7xl mx-auto" style={{ marginTop: -40 }}>
        {/* Hero Section */}
        <section className="relative h-102.25 flex items-center justify-center overflow-hidden border-b-4 border-[#d4a017]">
          <img
            alt="Luxury Indochine Interior"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            src={HERO_IMG}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0e0e0e] via-transparent to-transparent" />
          <div className="relative z-10 text-center px-4">
            <p className="font-['Barlow_Condensed'] text-[#f6be39] tracking-[0.4em] mb-2 uppercase text-sm">
              Học Viện Tỷ Phú
            </p>
            <h2
              className="font-['Noto_Serif'] text-5xl md:text-7xl text-[#f6be39] uppercase font-bold tracking-widest"
              style={{ textShadow: '0 0 8px rgba(246,190,57,0.4)' }}
            >
              HƯỚNG DẪN CƠ BẢN
            </h2>
            <div className="mt-6 flex justify-center">
              <div className="h-0.5 w-24 bg-[#d4a017]" />
            </div>
          </div>
        </section>

        {/* Tutorial Steps */}
        <section className="px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Step 1: Roll & Move */}
          <div className="md:col-span-7 bg-[#1c1b1b] border-l-4 border-[#d4a017] p-8 relative group hover:bg-[#2a2a2a] transition-all duration-500 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-8xl font-black font-['Barlow_Condensed'] text-white">01</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#f6be39] p-3">
                  <span
                    className="material-symbols-outlined text-[#261a00] text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    casino
                  </span>
                </div>
                <h3 className="font-['Noto_Serif'] text-2xl text-[#ffdfa0] uppercase tracking-tight">
                  Tung Xúc Xắc &amp; Di Chuyển
                </h3>
              </div>
              <p className="font-['Barlow_Condensed'] text-xl text-[#bdcabe] mb-4 leading-relaxed tracking-wide">
                Bắt đầu hành trình đế vương bằng cách tung hai viên xúc xắc ngà voi. Tổng điểm sẽ
                quyết định số bước tiến của bạn trên đại lộ Đông Dương đầy cơ hội.
              </p>
              <ul className="space-y-3 font-['Work_Sans'] text-[#e7e2da] opacity-80">
                <li className="flex items-start gap-2">
                  <span className="text-[#d4a017]">◆</span> Di chuyển theo chiều kim đồng hồ quanh
                  bàn cờ.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4a017]">◆</span> Nếu tung được hai mặt giống nhau, bạn
                  nhận thêm một lượt đi.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2: Property Management */}
          <div className="md:col-span-5 bg-[#201f1f] border-2 border-[#d4a017] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#f6be39] opacity-5 rotate-12" />
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-[#f6be39] text-4xl">
                    real_estate_agent
                  </span>
                  <h3 className="font-['Noto_Serif'] text-2xl text-[#ffdfa0] uppercase tracking-tight">
                    Mua &amp; Quản Lý Tài Sản
                  </h3>
                </div>
                <p className="font-['Barlow_Condensed'] text-lg text-[#bdcabe] mb-6 leading-relaxed">
                  Mỗi ô đất là một viên ngọc quý của L'Indochine. Khi dừng chân tại ô chưa có chủ,
                  hãy quyết đoán đầu tư để xây dựng đế chế.
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-[#353534] border border-[#4f4634]">
                  <p className="font-['Barlow_Condensed'] text-sm text-[#f6be39] uppercase mb-1">
                    Xây dựng
                  </p>
                  <p className="text-sm text-[#cac6be]">
                    Nâng cấp từ nhà phố lên khách sạn hạng sang để tối đa hóa lợi nhuận thu về từ đối
                    thủ.
                  </p>
                </div>
                <div className="p-4 bg-[#353534] border border-[#4f4634]">
                  <p className="font-['Barlow_Condensed'] text-sm text-[#f6be39] uppercase mb-1">
                    Thuế &amp; Lệ phí
                  </p>
                  <p className="text-sm text-[#cac6be]">
                    Bất kỳ ai dừng chân tại lãnh địa của bạn đều phải trả một khoản phí xứng tầm.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Interlude */}
          <div className="md:col-span-12 h-64 overflow-hidden border-y-2 border-[#d4a017]">
            <img
              alt="Monopoly Luxury Board"
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000"
              src={BOARD_IMG}
            />
          </div>

          {/* Step 3: Chance & Community */}
          <div className="md:col-span-6 bg-[#1c1b1b] p-10 border-r-4 border-[#d4a017] shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <span
                className="material-symbols-outlined text-[#f6be39] text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mystery
              </span>
              <h3 className="font-['Noto_Serif'] text-2xl text-[#ffdfa0] uppercase tracking-tight">
                Cơ Hội &amp; Khí Vận
              </h3>
            </div>
            <div className="space-y-6">
              <p className="font-['Barlow_Condensed'] text-xl text-[#bdcabe] leading-relaxed">
                Định mệnh nằm trong tay những tấm thẻ bài. Một bước có thể đưa bạn lên đỉnh vinh
                quang hoặc rơi vào vòng lao lý.
              </p>
              <div className="flex gap-4">
                <div
                  className="flex-1 border border-[#d4a017] p-4"
                  style={{
                    background: 'rgba(53,53,52,0.4)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <span className="material-symbols-outlined text-[#f6be39] mb-2">celebration</span>
                  <p className="font-['Barlow_Condensed'] text-xs uppercase text-[#f6be39]">
                    Cơ Hội
                  </p>
                  <p className="text-xs text-[#e7e2da]">
                    Phần thưởng bất ngờ hoặc lệnh di chuyển khẩn cấp.
                  </p>
                </div>
                <div
                  className="flex-1 border border-[#d4a017] p-4"
                  style={{
                    background: 'rgba(53,53,52,0.4)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <span className="material-symbols-outlined text-[#bdcabe] mb-2">
                    account_balance
                  </span>
                  <p className="font-['Barlow_Condensed'] text-xs uppercase text-[#bdcabe]">
                    Khí Vận
                  </p>
                  <p className="text-xs text-[#e7e2da]">
                    Các khoản thuế công hoặc lợi tức từ cộng đồng.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: How to Win */}
          <div className="md:col-span-6 bg-[#d4a017] p-1 text-[#503a00]">
            <div className="bg-[#0e0e0e] h-full p-10 flex flex-col justify-center border border-[#503a00]">
              <div className="text-center mb-8">
                <span
                  className="material-symbols-outlined text-[#f6be39] text-6xl mb-4"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  emoji_events
                </span>
                <h3
                  className="font-['Noto_Serif'] text-3xl text-[#ffdfa0] uppercase font-bold tracking-widest"
                  style={{ textShadow: '0 0 8px rgba(246,190,57,0.4)' }}
                >
                  Mục Tiêu Chiến Thắng
                </h3>
              </div>
              <p className="font-['Barlow_Condensed'] text-center text-xl text-[#d9e6da] mb-8 italic">
                "Kẻ cuối cùng còn đứng vững trên thị trường sẽ là chủ nhân của L'Indochine."
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-[#4f4634] pb-2">
                  <span className="font-['Barlow_Condensed'] font-bold text-[#f6be39]">1.</span>
                  <p className="text-sm text-[#e5e2e1]">
                    Loại bỏ tất cả đối thủ thông qua chiến lược thâu tóm tài sản.
                  </p>
                </div>
                <div className="flex items-center gap-4 border-b border-[#4f4634] pb-2">
                  <span className="font-['Barlow_Condensed'] font-bold text-[#f6be39]">2.</span>
                  <p className="text-sm text-[#e5e2e1]">
                    Tránh phá sản bằng cách quản lý dòng tiền thông minh.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-['Barlow_Condensed'] font-bold text-[#f6be39]">3.</span>
                  <p className="text-sm text-[#e5e2e1]">
                    Trở thành Tỷ Phú duy nhất sở hữu toàn bộ bản đồ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 pb-24 text-center">
          <button
            onClick={() => navigate('/auth/signup')}
            className="px-12 py-5 font-['Barlow_Condensed'] font-black text-xl uppercase tracking-[0.2em] text-[#261a00] hover:brightness-110 active:scale-95 transition-all"
            style={{
              background: 'linear-gradient(to right, #f6be39, #d4a017)',
              boxShadow: '0 0 20px rgba(246,190,57,0.3)',
            }}
          >
            BẮT ĐẦU VÁN ĐẤU
          </button>
          <p className="mt-6 font-['Barlow_Condensed'] text-[#cac6be] opacity-50 text-sm tracking-widest uppercase">
            Trải nghiệm đỉnh cao của sự giàu sang
          </p>
        </section>
      </div>
    </AuthLayout>
  );
}
