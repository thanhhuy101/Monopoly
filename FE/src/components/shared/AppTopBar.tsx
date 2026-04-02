import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  title?: string;
  showBack?: boolean;
  showWallet?: boolean;
  rightSlot?: ReactNode;
}

export default function AppTopBar({
  title = 'CỜ TỶ PHÚ',
  showBack = false,
  showWallet = false,
  rightSlot,
}: Props) {
  const navigate = useNavigate();

  return (
    <header className="bg-[#0e0e0e] fixed top-0 w-full z-50 flex justify-between items-center
      px-6 py-4 h-20 border-b-2 border-[#d4a017] shadow-[0_10px_30px_rgba(0,0,0,0.8)]">

      <div className="flex items-center gap-4">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="text-[#f6be39] hover:bg-[#353534] p-1 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <span className="material-symbols-outlined text-[#f6be39] cursor-pointer select-none">menu</span>
        )}
        <h1
          className="font-['Noto_Serif'] uppercase tracking-widest text-xl font-black text-[#f6be39]"
          style={{ textShadow: '0 0 8px rgba(246,190,57,0.4)' }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {showWallet && (
          <button className="hover:bg-[#353534] transition-colors p-2 text-[#f6be39]">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </button>
        )}
        {rightSlot}
      </div>
    </header>
  );
}
