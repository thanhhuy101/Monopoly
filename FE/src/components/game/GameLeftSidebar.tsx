import { useState } from 'react';
import { useAutoGameStore } from '../../hooks/useGameStore';
import { useAuthStore } from '../../store/authStore';
import { SPACES, COLOR_HEX } from '../../data/gameData';
import PrivateTrade from './PrivateTrade';

const NAV_ITEMS = [
  { icon: 'grid_view',     label: 'BÀN CỜ' },
  { icon: 'table_chart',   label: 'TÀI SẢN' },
  { icon: 'swap_horiz',    label: 'GIAO DỊCH' },
  { icon: 'military_tech', label: 'XẾP HẠNG' },
  { icon: 'list_alt',      label: 'LỊCH SỬ' },
];

function TradePanel() {
  const store = useAutoGameStore();
  const { user } = useAuthStore();
  const [tradingWith, setTradingWith] = useState<number | null>(null);

  const players = store.players;
  const me = players.find(p => p.uid === user?.id) || players.find(p => !p.isBot) || players[0];
  const others = players.filter(p => p.id !== me.id && !p.bankrupt);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-4 border-b border-[#2a2a2a] bg-white/2 font-['Barlow_Condensed']">
        <p className="text-[10px] text-[#7a8fbb] uppercase tracking-[0.2em] font-bold mb-1">
          GIAO DỊCH TRỰC TIẾP
        </p>
        <p className="text-[9px] text-[#555] uppercase tracking-widest leading-relaxed">
          Trao đổi tài sản và tiền mặt với các hội viên khác để hoàn tất nhóm màu.
        </p>
      </div>

      <div className="p-3 flex flex-col gap-2 overflow-y-auto flex-1 no-scrollbar">
        {others.map(p => (
          <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">{p.emoji}</span>
              <div className="min-w-0">
                <p className="font-['Barlow_Condensed'] text-xs text-[#e5e2e1] uppercase font-bold tracking-wide truncate">
                  {p.name}
                </p>
                <p className="font-['Barlow_Condensed'] text-[9px] text-[#7a8fbb] uppercase tracking-widest">
                  {p.money}₫ • {Object.values(store.props).filter(ownerId => ownerId === p.id).length} BĐS
                </p>
              </div>
            </div>
            <button
              onClick={() => setTradingWith(p.id)}
              className="px-3 py-1.5 rounded bg-[#f5c842]/10 text-[#f5c842] hover:bg-[#f5c842] hover:text-[#0e0e0e] text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              MỜI
            </button>
          </div>
        ))}
        {others.length === 0 && (
          <div className="py-10 text-center opacity-30">
            <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
            <p className="font-['Barlow_Condensed'] text-xs uppercase tracking-widest">Không có ai để giao dịch</p>
          </div>
        )}
      </div>

      {tradingWith !== null && (
        <PrivateTrade
          initiatorId={me.id}
          partnerId={tradingWith}
          onConfirm={() => setTradingWith(null)}
          onCancel={() => setTradingWith(null)}
        />
      )}
    </div>
  );
}
function AssetsPanel() {
  const store = useAutoGameStore();
  const { user } = useAuthStore();
  
  const props   = store.props;
  const houses  = store.houses;
  const players = store.players;
  const viewingPlayerId = store.viewingPlayerId;

  // Identify "me"
  const me = players.find(p => p.uid === user?.id) || players.find(p => !p.isBot) || players[0];
  
  // Determine which player's assets to show
  const targetId = viewingPlayerId !== null ? viewingPlayerId : me.id;
  const targetPlayer = players.find(p => p.id === targetId) || me;

  const owned = Object.entries(props)
    .filter(([, playerId]) => playerId === targetId)
    .map(([spaceId]) => Number(spaceId))
    .sort((a, b) => a - b);

  const isViewingOthers = targetId !== me.id;

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
    <div className="flex flex-col h-full overflow-hidden">
      {isViewingOthers && (
        <div className="px-4 py-3 bg-[#f5c842]/10 border-b border-[#f5c842]/20 flex items-center justify-between">
          <p className="font-['Barlow_Condensed'] text-[10px] text-[#f5c842] uppercase tracking-[0.2em] font-bold">
            TÀI SẢN CỦA: {targetPlayer.name}
          </p>
          <button 
            onClick={() => store.setViewingPlayerId(null)}
            className="text-[#f5c842] hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
      
      <div className="px-3 py-2 flex flex-col gap-1.5 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 320px)' }}>
        {owned.map(spaceId => {
          const sp = SPACES[spaceId];
          const h  = houses[spaceId] ?? 0;
          const colorHex = sp.color ? COLOR_HEX[sp.color] : undefined;

          const icon = sp.type === 'railroad' ? '🚂'
            : sp.type === 'utility' ? (sp.icon ?? '⚡')
            : null;

          const houseLabel = h === 0 ? null
            : h < 5 ? '🏠'.repeat(h)
            : '🏨';

          return (
            <div key={spaceId}
              onClick={() => store._openViewModal(sp)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/3 hover:bg-white/10 transition-colors cursor-pointer"
            >
              {colorHex ? (
                <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: colorHex }} />
              ) : (
                <span className="text-sm shrink-0 w-3 text-center">{icon}</span>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-['Barlow_Condensed'] text-[11px] text-[#e5e2e1] uppercase tracking-wide truncate font-semibold">
                  {sp.name}
                </p>
                <p className="font-['Barlow_Condensed'] text-[9px] text-[#7a8fbb] uppercase tracking-widest">
                  ${sp.price ?? 0}
                </p>
              </div>

              {houseLabel && (
                <span className="text-xs shrink-0">{houseLabel}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GameLeftSidebar() {
  const store = useAutoGameStore();
  const activeTab = store.activeTab;
  const setActiveTab = store.setActiveTab;
  
  const players = store.players;
  const cur = store.cur;
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
            {cp.name}
          </p>
          <p className="font-['Barlow_Condensed'] text-[10px] text-[#7a8fbb] uppercase tracking-widest">
            {cp.isBot ? 'BOT' : 'NGƯỜI CHƠI'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-2">
        {NAV_ITEMS.map(item => (
          <button key={item.label}
            onClick={() => {
              setActiveTab(item.label);
              if (item.label !== 'TÀI SẢN') store.setViewingPlayerId(null);
            }}
            className={`w-full flex items-center gap-3 px-5 py-3.5 font-['Barlow_Condensed'] font-bold text-sm uppercase tracking-wider transition-colors cursor-pointer
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
        {activeTab === 'GIAO DỊCH' && <TradePanel />}
      </div>
    </aside>
  );
}
