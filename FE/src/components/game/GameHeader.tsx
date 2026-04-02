import SettingsMenu from '../shared/SettingsMenu';
import { useGameStore } from '../../store/gameStore';

export default function GameHeader() {
  const testBankruptcy = useGameStore(s => s.testBankruptcy);
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16
      bg-[#0e0e0e] border-b-2 border-[#d4a017] shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#e74c3c] text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}>casino</span>
        <div>
          <h1 className="font-['Orbitron'] text-lg font-black text-[#f5c842] tracking-[4px] leading-tight"
            style={{ textShadow: '0 0 12px rgba(245,200,66,0.5)' }}>
            CỜ TỶ PHÚ
          </h1>
          <p className="font-['Barlow_Condensed'] text-[10px] text-[#7a8fbb] tracking-[3px] uppercase">
            Vietnamese Monopoly
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={testBankruptcy}
          className="flex items-center gap-2 bg-[#e74c3c]/15 border border-[#e74c3c] px-3 py-1.5
            text-[#e74c3c] font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-widest">
          <span className="material-symbols-outlined text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          TEST
        </button>
        <button className="flex items-center gap-2 bg-[#d4a017]/15 border border-[#d4a017] px-4 py-1.5
          text-[#f5c842] font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-widest">
          <span className="material-symbols-outlined text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
          BÀN CỜ
        </button>
        <SettingsMenu />
        <button className="p-2 text-[#7a8fbb] hover:text-[#f5c842] transition-colors relative">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>
      </div>
    </header>
  );
}
