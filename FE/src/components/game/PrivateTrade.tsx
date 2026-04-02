import { useState } from "react";

/* ──────────────────────────────────────────────
   Types
────────────────────────────────────────────── */
interface Property {
  id: string;
  name: string;
  color: string;
  selected: boolean;
}

interface Props {
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
`;

/* ──────────────────────────────────────────────
   Static data
────────────────────────────────────────────── */
const MY_PROPERTIES_INIT: Property[] = [
  { id: "p1", name: "PARK PLACE",        color: "#ef4444", selected: true  },
  { id: "p2", name: "BOARDWALK",         color: "#ef4444", selected: true  },
  { id: "p3", name: "PENNSYLVANIA AVE",  color: "#3b82f6", selected: false },
  { id: "p4", name: "PACIFIC AVE",       color: "#22c55e", selected: true  },
  { id: "p5", name: "NORTH CAROLINA AVE",color: "#22c55e", selected: true  },
];

const PARTNER_PROPERTIES_INIT: Property[] = [
  { id: "q1", name: "ST. JAMES PLACE",  color: "#f97316", selected: true  },
  { id: "q2", name: "TENNESSEE AVE",    color: "#f97316", selected: true  },
  { id: "q3", name: "VENTNOR AVE",      color: "#eab308", selected: false },
  { id: "q4", name: "MARVIN GARDENS",   color: "#eab308", selected: false },
];

/* ──────────────────────────────────────────────
   Main Component
────────────────────────────────────────────── */
export default function PrivateTrade({ onConfirm, onCancel, onCannotPay }: Props) {
  const [myProps, setMyProps] = useState<Property[]>(MY_PROPERTIES_INIT);
  const [partnerProps] = useState<Property[]>(PARTNER_PROPERTIES_INIT);
  const [offerCash, setOfferCash] = useState("2,500,000");

  const mySelected   = myProps.filter((p) => p.selected).length;
  const partSelected = partnerProps.filter((p) => p.selected).length;

  const toggleMyProp = (id: string) =>
    setMyProps((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      <div className="bg-[#0e0e0e] text-[#e5e2e1] font-['Work_Sans'] min-h-screen flex items-start justify-center px-6 py-12">
        <div className="max-w-6xl w-full">

          {/* ── Header ── */}
          <div className="mb-8 text-center">
            <h1 className="glow-sm font-['Noto_Serif'] text-4xl font-bold text-[#f6be39] italic tracking-widest uppercase mb-2">
              Private Trade
            </h1>
            <p className="font-['Barlow_Condensed'] text-[#bdcabe] tracking-widest uppercase text-xs opacity-60">
              Thỏa thuận trực tiếp giữa các quý tộc
            </p>
          </div>

          {/* ── Trade Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-start">

            {/* ── Side A: You ── */}
            <section className="lg:col-span-5 bg-[#201f1f] border-t-4 border-[#f6be39] shadow-2xl p-6 relative">
              <div className="absolute -top-3 left-4 bg-[#f6be39] text-[#261a00] px-3 py-0.5 text-[10px] font-black uppercase tracking-tight">
                Initiator
              </div>

              {/* Profile */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 border-2 border-[#f6be39] p-0.5 shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlS8y564PdASNrXRWEZjq-Gf7PeTHzMsHqpntYak7U1vt3AobPigN5l_ELUej6r-IVe6lLCW_5tpbLFODlCNoHSl8M3IsgDSAEh5D46b2WKDvZ0MgZOsFMIwguga8C8s08oG6xBIr8J2GuA39DD83N4sIq5KXm_kAcj4udwM5Qij2FzannCcDCpTL2HzYdnoFdnd7c4VbrgfNJtFtDNizFucvSnVSwiP_1QcwcTDkuxW5YOcGRhy_Fw32zYQp7J1-heF8O3Fjhd0g"
                    alt="Your avatar"
                  />
                </div>
                <div>
                  <h3 className="font-['Noto_Serif'] text-xl text-[#f6be39] font-bold italic">BẠN</h3>
                  <p className="font-['Barlow_Condensed'] text-[#bdcabe] text-xs tracking-widest">
                    RANK: GRANDMASTER
                  </p>
                </div>
              </div>

              {/* Property list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#353534] pb-2">
                  <span className="font-['Barlow_Condensed'] uppercase text-xs font-bold tracking-widest text-[#d3c5ae]">
                    Danh sách Bất Động Sản
                  </span>
                  <span className="text-xs text-[#f6be39] font-bold">{mySelected} SELECTED</span>
                </div>

                <div className="space-y-2 h-[320px] overflow-y-auto pr-2 no-scrollbar">
                  {myProps.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => toggleMyProp(p.id)}
                      className={`flex items-center justify-between p-3 border-l-4 cursor-pointer transition-colors
                        ${p.selected
                          ? "bg-[#1c1b1b] hover:bg-[#2a2a2a]"
                          : "bg-[#1c1b1b] hover:bg-[#2a2a2a] opacity-50"
                        }`}
                      style={{ borderLeftColor: p.color }}
                    >
                      <span className="font-['Barlow_Condensed'] font-bold tracking-tight text-sm">
                        {p.name}
                      </span>
                      {p.selected ? (
                        <span className="material-symbols-outlined icon-filled text-[#f6be39] text-sm">
                          check_circle
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-[#9b8f7a] text-sm">
                          radio_button_unchecked
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Cash input */}
                <div className="mt-6 pt-6 border-t border-[#353534]">
                  <label className="font-['Barlow_Condensed'] uppercase text-xs font-bold tracking-widest text-[#d3c5ae] block mb-2">
                    Tiền mặt đề nghị
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f6be39] font-bold">$</span>
                    <input
                      className="w-full bg-[#0e0e0e] border-0 border-b-2 border-[#d4a017]/40
                        focus:border-[#f6be39] focus:outline-none focus:ring-0
                        py-4 pl-8 pr-4 font-['Noto_Serif'] text-2xl text-[#f6be39] font-bold italic transition-all"
                      type="text"
                      value={offerCash}
                      onChange={(e) => setOfferCash(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Center ── */}
            <section className="lg:col-span-1 flex lg:flex-col justify-center items-center gap-6 py-8">
              <div className="hidden lg:block w-px h-24 bg-gradient-to-b from-transparent via-[#d4a017] to-transparent opacity-30" />
              <div className="w-12 h-12 rounded-full border-2 border-[#d4a017] flex items-center justify-center bg-[#0e0e0e] shadow-[0_0_20px_rgba(212,160,23,0.3)]">
                <span className="material-symbols-outlined text-[#f6be39]">swap_horiz</span>
              </div>
              <div className="hidden lg:block w-px h-24 bg-gradient-to-b from-transparent via-[#d4a017] to-transparent opacity-30" />
            </section>

            {/* ── Side B: Partner ── */}
            <section className="lg:col-span-5 bg-[#201f1f] border-t-4 border-[#bdcabe] shadow-2xl p-6 relative">
              <div className="absolute -top-3 right-4 bg-[#bdcabe] text-[#28332b] px-3 py-0.5 text-[10px] font-black uppercase tracking-tight">
                Partner
              </div>

              {/* Profile */}
              <div className="flex items-center gap-4 mb-8 justify-end text-right">
                <div>
                  <h3 className="font-['Noto_Serif'] text-xl text-[#e5e2e1] font-bold italic">
                    MONTE CARLO
                  </h3>
                  <p className="font-['Barlow_Condensed'] text-[#bdcabe] text-xs tracking-widest">
                    RANK: TYCOON
                  </p>
                </div>
                <div className="w-16 h-16 border-2 border-[#bdcabe] p-0.5 shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-2kmbF9xsDGw6omu1XqLtraU-mbTCPc-ZQY7BY1cgmiSsHeGwg_c4LEkmwUr9jXWee0FyimEoY0i_h-Gi1UUOQqADUONcOsmhQGpw-K3-QVw9NUh9wvjfWmCzhmLX5n5z7STK9Dg4QTp_c7B2UDVdq-xZHsC7Z9RuiKvqKUQPEiZxxrC1HrIlrAwvTerquUr256iJqgTaJiO5U7TBCXxBA_725QSdQu3TOZnMltNY97q00WhztJuWlpEEaHIP1i7DvukxUrtk1ag"
                    alt="Partner avatar"
                  />
                </div>
              </div>

              {/* Partner asset list (read-only) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#353534] pb-2">
                  <span className="font-['Barlow_Condensed'] uppercase text-xs font-bold tracking-widest text-[#d3c5ae]">
                    Đề nghị nhận lại
                  </span>
                  <span className="text-xs text-[#bdcabe] font-bold">{partSelected} SELECTED</span>
                </div>

                <div className="space-y-2 h-[320px] overflow-y-auto pr-2 no-scrollbar">
                  {partnerProps.map((p) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-3 bg-[#1c1b1b] border-l-4 transition-colors
                        ${!p.selected ? "opacity-30" : ""}`}
                      style={{ borderLeftColor: p.color }}
                    >
                      <span className="font-['Barlow_Condensed'] font-bold tracking-tight text-sm">
                        {p.name}
                      </span>
                      {p.selected && (
                        <span className="material-symbols-outlined icon-filled text-[#bdcabe] text-sm">
                          verified
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Cash received (display only) */}
                <div className="mt-6 pt-6 border-t border-[#353534]">
                  <label className="font-['Barlow_Condensed'] uppercase text-xs font-bold tracking-widest text-[#d3c5ae] block mb-2 text-right">
                    Tiền mặt nhận lại
                  </label>
                  <div className="bg-[#0e0e0e] py-4 px-6 text-right">
                    <span className="font-['Noto_Serif'] text-2xl text-[#e5e2e1] font-bold italic tracking-tighter">
                      $ 0
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── Action Buttons ── */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={onCancel}
              className="w-full sm:w-64 px-8 py-4 border-2 border-[#d4a017] text-[#f6be39]
                font-['Barlow_Condensed'] font-bold uppercase tracking-widest
                hover:bg-[#353534] active:scale-95 transition-all cursor-pointer bg-transparent"
            >
              HỦY BỎ
            </button>
            {onCannotPay && (
              <button
                onClick={onCannotPay}
                className="w-full sm:w-64 px-8 py-4 border-2 border-[#dc2626] text-[#dc2626]
                  font-['Barlow_Condensed'] font-bold uppercase tracking-widest
                  hover:bg-[#dc2626] hover:text-white active:scale-95 transition-all cursor-pointer bg-transparent"
              >
                KHÔNG THỀ THANH TOÁN
              </button>
            )}
            <button
              onClick={onConfirm}
              className="w-full sm:w-96 px-8 py-4 border-0 cursor-pointer
                bg-gradient-to-r from-[#f6be39] to-[#d4a017] text-[#261a00]
                font-['Barlow_Condensed'] font-black uppercase tracking-[0.2em]
                shadow-[0_10px_30px_rgba(212,160,23,0.3)] hover:brightness-110 active:scale-95 transition-all"
            >
              XÁC NHẬN GIAO DỊCH
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
