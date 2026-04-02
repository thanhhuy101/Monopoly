import AppTopBar from '../shared/AppTopBar';
import HeaderRight from '../shared/HeaderRight';
import BottomNav from './BottomNav';
import HeroSection from './HeroSection';
import FeaturedProperties from './FeaturedProperties';

export default function LandingPage() {
  return (
    <div className="dark">
      <AppTopBar showWallet rightSlot={<HeaderRight />} />
      <main
        className="relative min-h-screen pt-16 pb-20 flex flex-col items-center justify-center bg-[#0e0e0e]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px,rgba(212,160,23,0.05) 1px,transparent 0)', backgroundSize: '40px 40px' }}
      >
        <div className="absolute top-20 left-6 w-16 h-16 border-t-2 border-l-2 border-[#d4a017] opacity-40 pointer-events-none" />
        <div className="absolute top-20 right-6 w-16 h-16 border-t-2 border-r-2 border-[#d4a017] opacity-40 pointer-events-none" />
        <div className="absolute bottom-24 left-6 w-16 h-16 border-b-2 border-l-2 border-[#d4a017] opacity-40 pointer-events-none" />
        <div className="absolute bottom-24 right-6 w-16 h-16 border-b-2 border-r-2 border-[#d4a017] opacity-40 pointer-events-none" />
        <HeroSection />
        <FeaturedProperties />
      </main>
      <BottomNav />
    </div>
  );
}
