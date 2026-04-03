import { useState, useMemo } from "react";
import { useAutoGameStore } from "../../hooks/useGameStore";
import { SPACES, COLOR_HEX } from "../../data/gameData";
import { TradeOffer } from "../../types/game";

/* ──────────────────────────────────────────────
   Types
 ────────────────────────────────────────────── */
interface TradeProperty {
  id: number;
  name: string;
  color: string;
  selected: boolean;
}

interface Props {
  initiatorId: number;
  partnerId: number;
  onConfirm?: () => void;
  onCancel?: () => void;
  onCannotPay?: () => void;
}

/* ──────────────────────────────────────────────
   Global styles
 ────────────────────────────────────────────── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Work+Sans:wght@300;400;600;700&family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
    line-height: 1;
    display: inline-block;
  }
  .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  .glow-sm     { text-shadow: 0 0 8px rgba(246,190,57,0.4); }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .modal-shadow { box-shadow: 0 0 60px rgba(0,0,0,1); }
`;

/* ──────────────────────────────────────────────
   Main Component
 ────────────────────────────────────────────── */
export default function PrivateTrade({ initiatorId, partnerId, onConfirm, onCancel, onCannotPay }: Props) {
  const store = useAutoGameStore();
  const initiator = store.players[initiatorId];
  const partner   = store.players[partnerId];

  // Helper to load owned properties from store
  const getPlayerProps = (playerId: number) => {
    return Object.entries(store.props)
      .filter(([_, ownerId]) => ownerId === playerId)
      .map(([id, _]) => {
        const sp = SPACES[Number(id)];
        return {
          id: sp.id,
          name: sp.name,
          color: sp.color ? COLOR_HEX[sp.color] : "#555",
          selected: false,
        };
      });
  };

  const [myProps, setMyProps] = useState<TradeProperty[]>(() => getPlayerProps(initiatorId));
  const [partnerProps, setPartnerProps] = useState<TradeProperty[]>(() => getPlayerProps(partnerId));
  const [offerCash, setOfferCash] = useState("0");
  const [requestCash, setRequestCash] = useState("0");

  const mySelected   = myProps.filter(p => p.selected);
  const partSelected = partnerProps.filter(p => p.selected);

  const toggleMyProp = (id: number) =>
    setMyProps(prev => prev.map(p => (p.id === id ? { ...p, selected: !p.selected } : p)));

  const togglePartnerProp = (id: number) =>
    setPartnerProps(prev => prev.map(p => (p.id === id ? { ...p, selected: !p.selected } : p)));

  if (!initiator || !partner) return null;

  const handleConfirm = () => {
    const offer: TradeOffer = {
      fromId: initiatorId,
      toId: partnerId,
      fromProps: mySelected.map(p => p.id),
      toProps: partSelected.map(p => p.id),
      fromCash: parseInt(offerCash) || 0,
      toCash: parseInt(requestCash) || 0,
    };
    store.executeTrade(offer);
    onConfirm?.();
  };

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 sm:p-6 z-50">
        <div className="max-w-6xl w-full h-[95vh] lg:h-[85vh] flex flex-col border-4 border-[#d4a017] bg-[#0e0e0e] modal-shadow relative overflow-hidden">

          {/* ── Header (Fixed) ── */}
          <div className="shrink-0 p-6 text-center border-b border-[#353534] bg-[#0e0e0e] z-10">
            <h1 className="glow-sm font-['Noto_Serif'] text-3xl sm:text-4xl font-bold text-[#f6be39] italic tracking-widest uppercase mb-1">
              Private Trade
            </h1>
            <p className="font-['Barlow_Condensed'] text-[#bdcabe] tracking-widest uppercase text-[10px] opacity-60">
              Thỏa thuận trực tiếp giữa các quý tộc
            </p>
          </div>

          {/* ── Trade Content (Scrollable Grid Area) ── */}
          <div className="flex-1 overflow-y-auto lg:overflow-hidden p-4 sm:p-8 no-scrollbar bg-[#0a0a0a]">
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-stretch h-full">

              {/* ── Side A: Initiator ── */}
              <section className="lg:col-span-5 bg-[#161616] border-t-4 border-[#f6be39] shadow-2xl p-5 flex flex-col">
                <div className="flex items-center gap-4 mb-6 shrink-0">
                  <div className="w-14 h-14 border-2 border-[#f6be39] p-0.5 shrink-0 bg-[#0e0e0e] flex items-center justify-center text-3xl">
                    {initiator.emoji}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-['Noto_Serif'] text-lg text-[#f6be39] font-bold italic truncate">
                      {initiator.name === store.players[0].name ? 'BẠN' : initiator.name}
                    </h3>
                    <p className="font-['Barlow_Condensed'] text-[#bdcabe] text-[10px] tracking-widest uppercase opacity-70">
                      Số dư: {initiator.money}₫
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-center border-b border-[#353534] pb-2 mb-3 shrink-0">
                    <span className="font-['Barlow_Condensed'] uppercase text-[11px] font-bold tracking-widest text-[#d3c5ae]">
                      Tài sản đề nghị
                    </span>
                    <span className="text-[10px] text-[#f6be39] font-bold uppercase">{mySelected.length} Đã chọn</span>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-1.5 min-h-[200px]">
                    {myProps.length === 0 && (
                      <div className="h-full flex items-center justify-center text-[#555] font-['Barlow_Condensed'] italic uppercase text-xs">
                        Không có tài sản
                      </div>
                    )}
                    {myProps.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => toggleMyProp(p.id)}
                        className={`flex items-center justify-between p-2.5 border-l-4 cursor-pointer transition-all
                          ${p.selected ? "bg-[#2a2a2a] border-opacity-100" : "bg-[#1c1b1b]/50 border-opacity-30 hover:bg-[#252525]"}`}
                        style={{ borderLeftColor: p.color }}
                      >
                        <span className="font-['Barlow_Condensed'] font-semibold tracking-tight text-xs text-[#e5e2e1]">
                          {p.name}
                        </span>
                        {p.selected ? (
                          <span className="material-symbols-outlined icon-filled text-[#f6be39] text-base">check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined text-[#555] text-base">radio_button_unchecked</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#353534] shrink-0">
                    <label className="font-['Barlow_Condensed'] uppercase text-[10px] font-bold tracking-widest text-[#d3c5ae] block mb-1.5">
                      Tiền mặt kèm theo
                    </label>
                    <div className="relative">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#f6be39] font-bold">₫</span>
                      <input
                        className="w-full bg-[#0e0e0e] border-0 border-b-2 border-[#d4a017]/40 focus:border-[#f6be39] focus:outline-none py-2.5 pl-3 pr-10 font-['Noto_Serif'] text-xl text-[#f6be39] font-bold italic"
                        type="number"
                        value={offerCash}
                        onChange={(e) => setOfferCash(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Center Divider ── */}
              <section className="lg:col-span-1 flex lg:flex-col justify-center items-center py-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#d4a017] flex items-center justify-center bg-[#0e0e0e] shadow-[0_0_20px_rgba(212,160,23,0.3)] shrink-0 z-10">
                  <span className="material-symbols-outlined text-[#f6be39] text-2xl">swap_horiz</span>
                </div>
              </section>

              {/* ── Side B: Partner ── */}
              <section className="lg:col-span-5 bg-[#161616] border-t-4 border-[#bdcabe] shadow-2xl p-5 flex flex-col">
                <div className="flex items-center gap-4 mb-6 justify-end text-right shrink-0">
                  <div className="min-w-0">
                    <h3 className="font-['Noto_Serif'] text-lg text-[#e5e2e1] font-bold italic truncate">{partner.name}</h3>
                    <p className="font-['Barlow_Condensed'] text-[#bdcabe] text-[10px] tracking-widest uppercase opacity-70">
                      Số dư: {partner.money}₫
                    </p>
                  </div>
                  <div className="w-14 h-14 border-2 border-[#bdcabe] p-0.5 shrink-0 bg-[#0e0e0e] flex items-center justify-center text-3xl">
                    {partner.emoji}
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 text-right">
                  <div className="flex justify-between items-center border-b border-[#353534] pb-2 mb-3 shrink-0">
                    <span className="font-['Barlow_Condensed'] uppercase text-[11px] font-bold tracking-widest text-[#d3c5ae]">
                      Yêu cầu nhận lại
                    </span>
                    <span className="text-[10px] text-[#bdcabe] font-bold uppercase">{partSelected.length} Đã chọn</span>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-1.5 min-h-[200px]">
                    {partnerProps.length === 0 && (
                      <div className="h-full flex items-center justify-center text-[#555] font-['Barlow_Condensed'] italic uppercase text-xs">
                        Không có tài sản
                      </div>
                    )}
                    {partnerProps.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => togglePartnerProp(p.id)}
                        className={`flex items-center justify-between p-2.5 border-l-4 cursor-pointer transition-all text-left
                          ${p.selected ? "bg-[#2a2a2a] border-opacity-100" : "bg-[#1c1b1b]/50 border-opacity-30 hover:bg-[#252525]"}`}
                        style={{ borderLeftColor: p.color }}
                      >
                        <span className="font-['Barlow_Condensed'] font-semibold tracking-tight text-xs text-[#e5e2e1]">
                          {p.name}
                        </span>
                        {p.selected ? (
                          <span className="material-symbols-outlined icon-filled text-[#bdcabe] text-base">verified</span>
                        ) : (
                          <button className="p-2 text-[#7a8fbb] hover:text-[#f5c842] transition-colors relative cursor-pointer">
                            <span className="material-symbols-outlined text-xl">notifications</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#353534] shrink-0">
                    <label className="font-['Barlow_Condensed'] uppercase text-[10px] font-bold tracking-widest text-[#d3c5ae] block mb-1.5">
                      Tiền mặt yêu cầu
                    </label>
                    <div className="relative">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bdcabe] font-bold">₫</span>
                      <input
                        className="w-full bg-[#0e0e0e] border-0 border-b-2 border-[#bdcabe]/40 focus:border-[#bdcabe] focus:outline-none py-2.5 pl-3 pr-10 font-['Noto_Serif'] text-xl text-[#e5e2e1] font-bold italic text-right"
                        type="number"
                        value={requestCash}
                        onChange={(e) => setRequestCash(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* ── Footer Actions (Fixed) ── */}
          <div className="shrink-0 p-6 border-t border-[#353534] flex flex-col sm:flex-row items-center justify-center gap-4 bg-[#0a0a0a] z-10">
            <button
              onClick={onCancel}
              className="w-full sm:w-48 py-3.5 border-2 border-[#d4a017] text-[#f6be39] font-['Barlow_Condensed'] font-bold uppercase tracking-widest hover:bg-white/5 active:scale-95 transition-all cursor-pointer bg-transparent text-sm"
            >
              HỦY BỎ
            </button>
            <button
              onClick={handleConfirm}
              className="w-full sm:w-80 py-4 border-0 cursor-pointer bg-linear-to-r from-[#f6be39] to-[#d4a017] text-[#261a00] font-['Barlow_Condensed'] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(212,160,23,0.3)] hover:brightness-110 active:scale-95 transition-all text-sm"
            >
              XÁC NHẬN GIAO DỊCH
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
