import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem { icon: string; label: string; href: string }

const NAV_ITEMS: NavItem[] = [
  { icon: 'cell_tower',             label: 'SẢNH CHỜ',  href: '/home' },
  { icon: 'payments',               label: 'CỬA HÀNG',  href: '/shop' },
  { icon: 'military_tech',          label: 'BẢNG VÀNG', href: '/leaderboard' },
  { icon: 'person',                 label: 'CÁ NHÂN',   href: '/profile' },
];

export default function BottomNav() {
  const navigate      = useNavigate();
  const { pathname }  = useLocation();

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 px-2
      bg-[#0e0e0e]/95 backdrop-blur-md border-t-2 border-[#d4a017] shadow-[0_-10px_30px_rgba(0,0,0,0.9)]">
      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.href;
        return (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            className={[
              'flex flex-col items-center justify-center p-2 h-full w-1/4 transition-all cursor-pointer',
              "font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-wider",
              isActive
                ? 'bg-[#d4a017] text-[#0e0e0e]'
                : 'text-[#bdcabe] hover:bg-[#353534] hover:text-[#f6be39] active:brightness-125',
            ].join(' ')}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
