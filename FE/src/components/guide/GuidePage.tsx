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

        {/* Detailed Rules Section */}
        <section className="px-6 py-16 bg-[#1a1a1a]">
          <div className="text-center mb-12">
            <h2
              className="font-['Noto_Serif'] text-4xl text-[#f6be39] uppercase font-bold tracking-widest mb-4"
              style={{ textShadow: '0 0 8px rgba(246,190,57,0.4)' }}
            >
              LUẬT CHƠI CHI TIẾT
            </h2>
            <div className="h-0.5 w-32 bg-[#d4a017] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* How to Play */}
            <div className="bg-[#2a2a2a] border-l-4 border-[#d4a017] p-8">
              <h3 className="font-['Noto_Serif'] text-2xl text-[#ffdfa0] uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#f6be39] text-3xl">menu_book</span>
                Cách Chơi
              </h3>
              <div className="space-y-4 font-['Barlow_Condensed'] text-[#e7e2da]">
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">1.</span>
                  <div>
                    <p className="font-semibold mb-1">Bắt đầu ván đấu</p>
                    <p className="text-sm opacity-80">Mỗi người chơi nhận $1500 và một quân cờ riêng. Tung xúc xắc để xác định người đi trước.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">2.</span>
                  <div>
                    <p className="font-semibold mb-1">Di chuyển</p>
                    <p className="text-sm opacity-80">Tung 2 xúc xắc và di chuyển theo tổng điểm. Nếu tung được đôi, được đi thêm lượt nhưng nếu tung 3 lần liên tiếp sẽ vào tù.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">3.</span>
                  <div>
                    <p className="font-semibold mb-1">Mua tài sản</p>
                    <p className="text-sm opacity-80">Khi dừng ở ô đất chưa có chủ, bạn có thể mua hoặc để ngân hàng đấu giá. Mua cả nhóm màu để được xây nhà.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">4.</span>
                  <div>
                    <p className="font-semibold mb-1">Thu tiền thuê</p>
                    <p className="text-sm opacity-80">Khi người khác dừng ở đất của bạn, họ phải trả tiền thuê. Giá thuê tăng khi bạn xây thêm nhà.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Rules */}
            <div className="bg-[#252525] border-l-4 border-[#d4a017] p-8">
              <h3 className="font-['Noto_Serif'] text-2xl text-[#ffdfa0] uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#f6be39] text-3xl">home</span>
                Quy Tắc Tài Sản
              </h3>
              <div className="space-y-4 font-['Barlow_Condensed'] text-[#e7e2da]">
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">•</span>
                  <div>
                    <p className="font-semibold mb-1">Xây dựng</p>
                    <p className="text-sm opacity-80">Phải sở hữu cả nhóm màu mới được xây nhà. Xây tuần tự: 1 nhà → 2 nhà → 3 nhà → 4 nhà → khách sạn.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">•</span>
                  <div>
                    <p className="font-semibold mb-1">Thế chấp</p>
                    <p className="text-sm opacity-80">Có thể thế chấp đất để vay tiền = 1/2 giá trị. Trả nợ + 10% để lấy lại. Không thể thu tiền thuê khi đất đang thế chấp.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">•</span>
                  <div>
                    <p className="font-semibold mb-1">Bán nhà</p>
                    <p className="text-sm opacity-80">Bán nhà được 1/2 giá xây. Phải bán hết nhà trên nhóm màu trước khi thế chấp đất.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">•</span>
                  <div>
                    <p className="font-semibold mb-1">Đường sắt & Tiện ích</p>
                    <p className="text-sm opacity-80">Đường sắt: 1 cái $50, 2 cái $100, 3 cái $200, 4 cái $400. Tiện ích: 4x tổng xúc xắc nếu có 1 cái, 10x nếu có 2 cái.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chance & Community Chest */}
            <div className="bg-[#2a2a2a] border-l-4 border-[#d4a017] p-8">
              <h3 className="font-['Noto_Serif'] text-2xl text-[#ffdfa0] uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#f6be39] text-3xl">mystery</span>
                Thẻ Cơ Hội & Khí Vận
              </h3>
              <div className="space-y-4 font-['Barlow_Condensed'] text-[#e7e2da]">
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">•</span>
                  <div>
                    <p className="font-semibold mb-1">Thẻ Cơ Hội (Chance)</p>
                    <p className="text-sm opacity-80">Di chuyển đến các ô đặc biệt, nhận/phạt tiền, vào tù, hoặc ra tù miễn phí. Có thể thay đổi đột ngột tình thế.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">•</span>
                  <div>
                    <p className="font-semibold mb-1">Thẻ Khí Vận (Community Chest)</p>
                    <p className="text-sm opacity-80">Thường là các khoản thuế/phí xã hội, sinh nhật nhận tiền, hoặc các sự kiện cộng đồng khác.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">•</span>
                  <div>
                    <p className="font-semibold mb-1">Thẻ đặc biệt</p>
                    <p className="text-sm opacity-80">"Ra tù miễn phí" có thể giữ đến khi cần hoặc bán cho người khác. Giá bán do thỏa thuận.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bankruptcy Rules */}
            <div className="bg-[#252525] border-l-4 border-[#d4a017] p-8">
              <h3 className="font-['Noto_Serif'] text-2xl text-[#ffdfa0] uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#f6be39] text-3xl">gavel</span>
                Phá Sản & Loại Bỏ
              </h3>
              <div className="space-y-4 font-['Barlow_Condensed'] text-[#e7e2da]">
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">•</span>
                  <div>
                    <p className="font-semibold mb-1">Khi nào phá sản?</p>
                    <p className="text-sm opacity-80">Khi nợ nhiều hơn tổng tài sản và không có cách trả nợ. Phải trả hết tiền trước khi tuyên bố phá sản.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">•</span>
                  <div>
                    <p className="font-semibold mb-1">Cách xử lý</p>
                    <p className="text-sm opacity-80">1. Bán nhà và thế chấp đất <br /> 2. Giao dịch với người chơi khác <br /> 3. Nếu vẫn không trả được, bị loại khỏi trò chơi.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#d4a017] font-bold">•</span>
                  <div>
                    <p className="font-semibold mb-1">Tài sản thừa kế</p>
                    <p className="text-sm opacity-80">Tất cả tài sản của người phá sản chuyển cho người chủ nợ. Người chơi còn lại tiếp tục đấu.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Winning Conditions */}
        <section className="px-6 py-16 bg-[#d4a017]">
          <div className="text-center mb-12">
            <h2
              className="font-['Noto_Serif'] text-4xl text-[#261a00] uppercase font-bold tracking-widest mb-4"
              style={{ textShadow: '0 0 8px rgba(38,26,0,0.4)' }}
            >
              ĐIỀU KIỆN CHIẾN THẮNG
            </h2>
            <div className="h-0.5 w-32 bg-[#261a00] mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-[#0e0e0e] border-4 border-[#261a00] p-10 text-center">
              <span
                className="material-symbols-outlined text-[#f6be39] text-6xl mb-6"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emoji_events
              </span>
              
              <div className="space-y-6 font-['Barlow_Condensed'] text-[#e7e2da]">
                <div className="bg-[#1a1a1a] p-6 border border-[#d4a017]/30">
                  <h3 className="text-2xl text-[#f6be39] font-bold mb-3 uppercase">Chiến Thắng Tuyệt Đối</h3>
                  <p className="text-lg leading-relaxed">
                    Là người chơi cuối cùng còn lại sau khi tất cả đối thủ đều phá sản.
                    Bạn trở thành Tỷ Phú độc quyền, sở hữu toàn bộ thị trường Đông Dương.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#252525] p-4 border border-[#d4a017]/20">
                    <span className="text-[#d4a017] text-2xl mb-2 block">💰</span>
                    <p className="text-sm font-semibold mb-1">Quản lý tài chính</p>
                    <p className="text-xs opacity-80">Giữ cân bằng thu-chi, tránh rủi ro không cần thiết</p>
                  </div>
                  <div className="bg-[#252525] p-4 border border-[#d4a017]/20">
                    <span className="text-[#d4a017] text-2xl mb-2 block">🏠</span>
                    <p className="text-sm font-semibold mb-1">Đầu tư thông minh</p>
                    <p className="text-xs opacity-80">Tập trung vào nhóm màu giá trị, xây dựng chiến lược</p>
                  </div>
                  <div className="bg-[#252525] p-4 border border-[#d4a017]/20">
                    <span className="text-[#d4a017] text-2xl mb-2 block">🎯</span>
                    <p className="text-sm font-semibold mb-1">Thời cơ vàng</p>
                    <p className="text-xs opacity-80">Biết khi nào nên mua, bán hay thế chấp tài sản</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-linear-to-r from-[#d4a017]/20 to-transparent border border-[#d4a017]/50">
                  <p className="text-[#f6be39] font-bold text-lg italic">
                    "Không chỉ may mắn, mà còn là chiến lược, kiên nhẫn và bản lĩnh của một nhà tư bản true."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AuthLayout>
  );
}
