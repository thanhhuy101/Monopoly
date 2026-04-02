import { motion, Variants } from 'framer-motion';
import { useEffect, useRef } from 'react';
import AppTopBar from '../shared/AppTopBar';
import BottomNav from '../landing/BottomNav';
import MedalCard from './MedalCard';
import AssetCard from './AssetCard';
import HeaderRight from '../shared/HeaderRight';
import { useAuthStore } from '../../store/authStore';
import { userApi } from '../../services/userApi';
import type { ReactNode } from 'react';

interface MedalItem { icon: string; label: string; color?: 'primary' | 'secondary' | 'tertiary'; locked?: boolean }
interface AssetItem { image: string; title: string; revenueLabel: string; revenue: string; accentColor?: string }
interface StatItem { label: string; value: string; icon?: string }

const MEDALS: MedalItem[] = [
  { icon: 'workspace_premium', label: 'Chúa Tể Thành Phố', color: 'primary' },
  { icon: 'stars', label: 'Triệu Phú Tự Thân', color: 'secondary' },
  { icon: 'apartment', label: 'Ông Trùm Khách Sạn', color: 'tertiary' },
  { icon: 'lock', label: 'Chưa Mở Khóa', locked: true },
];

const ASSETS: AssetItem[] = [
  { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHUkk4L-PmvblAuyNyIbegPKRnDuq9zZMg44tBnp-A3xmiVsb4LvAx1msEVpXhaM2YAY3m_GEYhjAnz83ZLgdIa-a5BNJuo1Kio5GcIBMMYv396BdgV1rnBbmcRD0z6t-QeZ_OTvzEYSsRsS-juV3Wy1WnuN6fbXdMD8jIPeKoxPfxbln4r83Gdm8PNkWTVinbh-2Bq-l9ph8A2jhuGUaFr7UwWCu4skgS8SVvBLmpcP565PICDSL1OXIAZH7Jz3kXF9w97HOlkHI', title: 'Biệt Thự Đà Lạt', revenueLabel: 'Doanh thu theo giờ', revenue: '+2,500', accentColor: '#f6be39' },
  { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBDBSzWNFraYHVLNDEkQVDfF9o8cst-tcH3cUVY_RSpL1e9JMrp8mUiqk8uOnM-E-_Pkuzb35zPw7SDLjrhbNv9yMaHTkBq3YFLIWLoDpV2IzaV-4KsBTxEIv4h3CFtR7YH8HHJS_mtWcZqSJCwwFvO_T4o2ClfGhks8U6OWkXRgP7jIR1-6AssPgigEF3CQ6bhMzuaZJCE-X7sBDggfkJksaxb6InIsjSsqC892Shp5gle8YL_Gvab2dhH2f3VPHALbYmmw4jF74', title: 'Khách Sạn Grand', revenueLabel: 'Doanh thu theo giờ', revenue: '+5,800', accentColor: '#bdcabe' },
];

const QUICK_STATS: StatItem[] = [
  { label: 'Tỷ Lệ Thắng', value: '68.5%' },
  { label: 'Bất Động Sản', value: '142' },
];

const AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU9yupDGLmQYNmjOSuFUr6AYCViM4Zq5zUdvaUaFNnzH6PY-vKQoJoF5EYMFj1nzkSBAQnTSdLl1lNt1jhpc64YtRippXLsZ6jg8lCSQPBemVqbX0VEXKxEgRXKoSNyBYC1tGzaJiqKbiFoo0XVbo_cX39GQ3U7ub3OH8yMbNmvBVVCp74kJcvXXBBUzGYwe2vryvmLYHygi6dAbucfrvRiz74_l737FE0D3VOIocrMbpkdo-ExggJ3ayg-DZQf8m5GOyJkY8FJrc';
const HEADER_AV = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFsYtVh8TZ8kAFpTc9ixUQr8FN5yfV2kz_r0eicpnwMFp5mTEk15EO1xPwoujBUvDoSMAQ5iktBIZiOaQw-qW0DcCiHYE060h0t7-4fI6WBmrmk51nUVJ7MiV3HoSVr3DcpIsiQzvjI_IX46bD2-2nlJhZN52q7e_oCud-I0rnYXlQpP7JLdGJ9i7cB4hp4iJodmS9Pp11YeSO1uRVNwAHn-K6uotNt0a4NC2BQfQZBLaUt_OnDcB-k7UwrvelOvyExRPRDBDS3E';

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, delay } },
});

function SectionHeader({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="material-symbols-outlined text-[#f6be39]">{icon}</span>
      <h3 className="font-['Barlow_Condensed'] uppercase font-black text-sm tracking-[0.2em] text-[#e5e2e1]">{children}</h3>
    </div>
  );
}

export default function ProfilePage() {
  const { user, accessToken, updateUser } = useAuthStore();
  const hasFetched = useRef(false);

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken || hasFetched.current) return;
      
      hasFetched.current = true;
      try {
        console.log('Fetching profile data...');
        const profileData = await userApi.getProfile();
        console.log('Profile data fetched:', profileData);
        // Update auth store with fresh profile data
        updateUser(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [accessToken, updateUser]);

  const STATS: StatItem[] = [
    { label: 'Tài Sản Hiện Tại', value: user ? `${user.coins?.toLocaleString() || '0'}` : '0', icon: 'monetization_on' },
    { label: 'Danh Hiệu', value: user?.displayName || 'ĐẠI GIA BẤT ĐỘNG SẢN' },
  ];

  return (
    <div className="dark min-h-screen bg-[#131313] text-[#e5e2e1] pb-24" style={{ fontFamily: "'Work Sans', sans-serif", userSelect: 'none' }}>
      <AppTopBar showBack rightSlot={<HeaderRight avatarUrl={user?.avatarUrl || HEADER_AV} />} />

      <main className="pt-32! px-6! md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* LEFT PANEL */}
          <motion.div initial="hidden" animate="show" className="lg:col-span-4 flex flex-col gap-6">
            <motion.div variants={fadeUp(0)}
              className="bg-[#2a2a2a] border-2 border-[#d4a017] p-8 relative shadow-[0_20px_40px_rgba(0,0,0,0.6)] grow">
              <div className="absolute -top-4 -left-4 bg-[#f6be39] text-[#402d00] px-4 py-1 font-['Barlow_Condensed'] font-black text-sm uppercase tracking-widest">Cấp {user?.level || 42}</div>
              <div className="w-full aspect-square border-4 border-[#d4a017] p-1 mb-6 relative overflow-hidden group">
                <img src={user?.avatarUrl || AVATAR} alt="Avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black to-transparent p-4">
                  <p className="font-['Noto_Serif'] text-2xl text-[#f6be39] font-black uppercase" style={{ textShadow: '0 0 8px rgba(246,190,57,0.4)' }}>{user?.displayName || 'Trần Gia Bảo'}</p>
                </div>
              </div>
              <div className="space-y-4">
                {STATS.map((row: StatItem) => (
                  <div key={row.label} className="flex justify-between items-end border-b-2 border-[#4f4634]/20 pb-2">
                    <span className="font-['Barlow_Condensed'] uppercase text-xs font-bold text-[#cac6be]">{row.label}</span>
                    <div className="flex items-center gap-2">
                      {row.icon && <span className="material-symbols-outlined text-[#f6be39] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{row.icon}</span>}
                      <span className="font-['Noto_Serif'] text-xl text-[#f6be39] font-bold" style={{ textShadow: '0 0 8px rgba(246,190,57,0.4)' }}>{row.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp(0.1)} className="grid grid-cols-2 gap-4">
              {QUICK_STATS.map((s: StatItem) => (
                <div key={s.label} className="bg-[#1c1b1b] p-4 border-t-2 border-[#f6be39]">
                  <p className="font-['Barlow_Condensed'] uppercase text-[10px] font-bold text-[#cac6be] tracking-widest mb-1">{s.label}</p>
                  <p className="font-['Noto_Serif'] text-2xl text-[#f6be39]">{s.value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div initial="hidden" animate="show" className="lg:col-span-8 flex flex-col gap-8">
            <motion.div variants={fadeUp(0)} className="flex justify-between items-baseline mb-2">
              <h2 className="font-['Noto_Serif'] text-3xl text-[#f6be39] uppercase tracking-widest" style={{ textShadow: '0 0 8px rgba(246,190,57,0.4)' }}>Hồ Sơ Đại Gia</h2>
              <div className="h-0.5 grow mx-6 bg-[#4f4634]/30" />
            </motion.div>

            <motion.section variants={fadeUp(0.1)}>
              <SectionHeader icon="military_tech">Bộ Sưu Tập Huy Chương</SectionHeader>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {MEDALS.map((m, i) => <motion.div key={m.label} variants={fadeUp(0.12 + i * 0.07)}><MedalCard {...m} /></motion.div>)}
              </div>
            </motion.section>

            <motion.section variants={fadeUp(0.2)}>
              <div className="pt-4"><SectionHeader icon="account_balance">Tài Sản Chiến Lược</SectionHeader></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ASSETS.map((a, i) => <motion.div key={a.title} variants={fadeUp(0.22 + i * 0.08)}><AssetCard {...a} /></motion.div>)}
              </div>
            </motion.section>

            <motion.div variants={fadeUp(0.3)}>
              <motion.button whileHover={{ filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
                className="w-full py-4 bg-linear-to-br from-[#f6be39] to-[#d4a017] text-[#261a00] font-['Barlow_Condensed'] font-black uppercase tracking-[0.4em] shadow-[0_10px_20px_rgba(212,160,23,0.3)] transition-all">
                Xem Chi Tiết Tài Sản
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
