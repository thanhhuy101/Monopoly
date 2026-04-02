import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SPACES, COLOR_HEX } from '../../data/gameData';
import type { GameStore } from '../../store/gameStore';

const NAV_ITEMS = [
  { icon: 'grid_view',     label: 'BÀN CỜ' },
  { icon: 'table_chart',   label: 'TÀI SẢN' },
  { icon: 'swap_horiz',    label: 'GIAO DỊCH' },
  { icon: 'military_tech', label: 'XẾP HẠNG' },
  { icon: 'list_alt',      label: 'LỊCH SỬ' },
];

function AssetsPanel() {
  const props   = useGameStore((s: GameStore) => s.props);
  const houses  = useGameStore((s: GameStore) => s.houses);
  const players = useGameStore((s: GameStore) => s.players);

  // Always show the human player's assets (first non-bot player)
  const myId = players.find(p => !p.isBot)?.id ?? 0;

  const owned = Object.entries(props)
    .filter(([, playerId]) => playerId === myId)
    .map(([spaceId]) => Number(spaceId))
    .sort((a, b) => a - b);

  if (owned.length === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <span className="material-symbols-outlined text-3xl text-[#7a8fbb]/40 block mb-2">real_estate_agent</span>
        <p className="font-['Barlow_Condensed'] text-xs text-[#7a8fbb] uppercase tracking-widest">
          Chưa có tài sản
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 py-2 flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
      {owned.map(spaceId => {
        const sp = SPACES[spaceId];
        const h  = houses[spaceId] ?? 0;
        const colorHex = sp.color ? COLOR_HEX[sp.color] : undefined;

        // Icon based on type
        const icon = sp.type === 'railroad' ? '🚂'
          : sp.type === 'utility' ? (sp.icon ?? '⚡')
          : null; // prop uses color bar

        // House indicator
        const houseLabel = h === 0 ? null
          : h < 5 ? '🏠'.repeat(h)
          : '🏨';

        return (
          <div key={spaceId}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/3 hover:bg-white/60 transition-colors"
          >
            {/* Color dot / icon */}
            {colorHex ? (
              <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: colorHex }} />
            ) : (
              <span className="text-sm shrink-0 w-3 text-center">{icon}</span>
            )}

            {/* Name + price */}
            <div className="min-w-0 flex-1">
              <p className="font-['Barlow_Condensed'] text-[11px] text-[#e5e2e1] uppercase tracking-wide truncate font-semibold">
                {sp.name}
              </p>
              <p className="font-['Barlow_Condensed'] text-[9px] text-[#7a8fbb] uppercase tracking-widest">
                ${sp.price ?? 0}
              </p>
            </div>

            {/* Houses */}
            {houseLabel && (
              <span className="text-xs shrink-0">{houseLabel}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function GameLeftSidebar() {
  const [activeTab, setActiveTab] = useState('BÀN CỜ');
  const players = useGameStore((s: GameStore) => s.players);
  const cur = useGameStore((s: GameStore) => s.cur);
  const cp = players[cur];

  return (
    <aside className="w-55 shrink-0 bg-[#0e0e0e] border-r border-[#2a2a2a] flex flex-col h-full">
      {/* User profile */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#2a2a2a]">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border-2"
          style={{ background: `${cp.color}28`, borderColor: `${cp.color}70` }}>
          {cp.emoji}
        </div>
        <div className="min-w-0">
          <p className="font-['Barlow_Condensed'] font-bold text-[#f5c842] text-sm uppercase tracking-wider truncate">
            ĐẠI GIA SÀI GÒN
          </p>
          <p className="font-['Barlow_Condensed'] text-[10px] text-[#7a8fbb] uppercase tracking-widest">
            CẤP BẬC: HOÀNG KIM
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-2">
        {NAV_ITEMS.map(item => (
          <button key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`w-full flex items-center gap-3 px-5 py-3.5 font-['Barlow_Condensed'] font-bold text-sm uppercase tracking-wider transition-colors
              ${activeTab === item.label
                ? 'text-[#f5c842] border-l-3 border-[#f5c842] bg-[#f5c842]/5'
                : 'text-[#7a8fbb] border-l-3 border-transparent hover:text-[#bdcabe] hover:bg-white/3'
              }`}>
            <span className="material-symbols-outlined text-xl"
              style={activeTab === item.label ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="flex-1 border-t border-[#2a2a2a] overflow-hidden">
        {activeTab === 'TÀI SẢN' && <AssetsPanel />}
      </div>
    </aside>
  );
}
