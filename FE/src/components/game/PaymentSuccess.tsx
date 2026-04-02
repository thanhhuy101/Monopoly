interface Props {
  onContinue?: () => void;
  onViewLedger?: () => void;
}

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700;800&family=Barlow+Condensed:wght@400;700;900&family=Work+Sans:wght@300;400;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
    line-height: 1;
    display: inline-block;
  }
  .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  .gold-glow   { text-shadow: 0 0 12px rgba(246,190,57,0.6); }

  .art-deco-bg {
    background-image:
      radial-gradient(circle at 50% 50%, rgba(246,190,57,0.1) 0%, transparent 50%),
      linear-gradient(45deg,  #0e0e0e 25%, transparent 25%),
      linear-gradient(-45deg, #0e0e0e 25%, transparent 25%),
      linear-gradient(45deg,  transparent 75%, #0e0e0e 75%),
      linear-gradient(-45deg, transparent 75%, #0e0e0e 75%);
    background-size: 100% 100%, 40px 40px, 40px 40px, 40px 40px, 40px 40px;
  }

  .shimmer {
    background: linear-gradient(135deg, #f6be39 0%, #d4a017 50%, #f6be39 100%);
    background-size: 200% 200%;
    position: relative;
    overflow: hidden;
  }
  .shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.2);
    transform: translateX(-100%);
    transition: transform 0.5s;
  }
  .shimmer:hover::after { transform: translateX(100%); }
`;

export default function PaymentSuccess({ onContinue, onViewLedger }: Props) {
  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      <div className="art-deco-bg bg-[#0e0e0e] text-[#e5e2e1] font-['Work_Sans'] min-h-screen overflow-hidden relative flex items-center justify-center p-6">

        {/* ── Ambient blobs ── */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#f6be39]" style={{ filter: "blur(80px)" }} />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-[#d4a017]" style={{ filter: "blur(100px)" }} />
          <img
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-30"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeiNYiC3QazOtithFoaPQz6fiYzpP1DkBSb5YodOxS1lbThDlxxg6JfgLqWF7FThVSzeydItaLM2KLTQn73zuobSJDAu6wOFVqGO0cUO79YqXQH0EwLrTSYUYgzOIlVnMOkW2sIOj9n-dFvAZBwLYZiVnU0Q5aPeBavn9zhnwEGQ94_Y35FIWwG0MGmmj4e-0JA2ANm9zpNRvxUhb-Ddb6kldWR7oPUAy9eu6vjl_wQofpy-CobkJ6Udm7PaYumMwX706rSWiIJRw"
            alt="golden fireworks"
          />
        </div>

        {/* ── Success canvas ── */}
        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">

          {/* Handshake frame */}
          <div className="relative mb-12">
            <div className="absolute inset-0 scale-110 border-[3px] border-[#d4a017] opacity-20 rotate-45" />
            <div className="absolute inset-0 scale-105 border border-[#f6be39] opacity-40 -rotate-12" />

            <div className="bg-[#2a2a2a] p-8 border-t-2 border-l-2 border-[#d4a017] relative shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
              <div className="w-64 h-64 flex items-center justify-center">
                <img
                  style={{ filter: "grayscale(1) invert(1) brightness(1.5) sepia(1) saturate(5) hue-rotate(-10deg)" }}
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhedfxgqQkh7Et1tKHu0MkKqrbrcdUdADw5bDmS6ExXkPn2h36tv8jbm5lzdeFSRRuJbYPdpWBrBWGsWm6VBoylvDgoaYZr0m-uV1HWlkNwJzlh2ndbGKXlnZc3gqRKHTE53mCr3sdpk-OSx2px0P1G1qaxsZ7QEOvLAbz-bT8-x4LGctXnbDDwXXssYoeKO8HfHbcA5eAkNRg4ALyeH66bSbgixzWSl6Ze0v-k1bOXx1n8HpvIg4su1jss8TR3NmWSznz-1ndhyw"
                  alt="Handshake"
                />
              </div>
              {/* Check badge */}
              <div className="absolute -top-4 -right-4 bg-[#f6be39] text-[#261a00] p-2">
                <span className="material-symbols-outlined icon-filled text-3xl">check_circle</span>
              </div>
            </div>
          </div>

          {/* Text hierarchy */}
          <div className="space-y-6 max-w-lg">
            <div className="space-y-2">
              <p className="font-['Barlow_Condensed'] text-[#f6be39] uppercase tracking-[0.3em] text-sm font-bold">
                Transaction Confirmed
              </p>
              <h1 className="gold-glow font-['Noto_Serif'] text-5xl md:text-6xl font-extrabold text-[#f6be39] leading-none uppercase">
                THANH TOÁN THÀNH CÔNG
              </h1>
            </div>

            <div className="h-1 w-24 bg-[#d4a017] mx-auto" />

            <p className="text-[#d3c5ae] text-lg md:text-xl font-light leading-relaxed px-4">
              Mọi nợ nần đã được giải quyết, bạn có thể tiếp tục cuộc chơi.
              <span className="block mt-2 italic text-[#bdcabe]">
                The Ledger has been settled. Your prestige remains intact.
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={onContinue}
              className="shimmer py-4 px-12 border-0 cursor-pointer active:scale-95 transition-transform shadow-[0_10px_30px_rgba(212,160,23,0.3)]"
            >
              <span className="relative z-10 font-['Barlow_Condensed'] font-black text-[#261a00] tracking-widest text-xl uppercase">
                TIẾP TỤC
              </span>
            </button>

            <button
              onClick={onViewLedger}
              className="py-3 px-12 border-2 border-[#4f4634] hover:border-[#f6be39]
                font-['Barlow_Condensed'] text-[#d3c5ae] uppercase tracking-widest text-sm
                transition-colors cursor-pointer bg-transparent"
            >
              Xem lịch sử Ledger
            </button>
          </div>
        </div>

        {/* ── Corner decorations ── */}
        <div className="fixed top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#d4a017] m-8 opacity-30 pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-[#d4a017] m-8 opacity-30 pointer-events-none" />

        {/* ── PAID stamp ── */}
        <div className="fixed top-12 right-12 hidden md:flex flex-col items-end opacity-40 pointer-events-none">
          <span className="font-['Barlow_Condensed'] text-xs uppercase tracking-tight text-[#e5e2e1]">
            Status: Cleared
          </span>
          <span className="font-['Noto_Serif'] text-2xl font-black italic text-[#e5e2e1]">PAID</span>
        </div>

        {/* ── Footer ── */}
        <footer className="fixed bottom-0 w-full py-6 flex justify-center gap-12 text-[10px] uppercase tracking-[0.4em] text-[#9b8f7a] opacity-50 z-20 font-['Barlow_Condensed'] pointer-events-none">
          <span>Macau</span>
          <span>•</span>
          <span>Monte Carlo</span>
          <span>•</span>
          <span>Las Vegas</span>
        </footer>
      </div>
    </>
  );
}
