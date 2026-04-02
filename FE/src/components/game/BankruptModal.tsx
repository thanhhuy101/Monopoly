const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Barlow+Condensed:wght@400;700;900&family=Work+Sans:wght@300;400;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
    line-height: 1;
    display: inline-block;
  }
  .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  .gold-bevel  { box-shadow: inset 0 0 10px rgba(246,190,57,0.2), 0 10px 30px rgba(0,0,0,0.8); }
  .indochine-pattern {
    background-image: radial-gradient(circle at 2px 2px, #d4a017 1px, transparent 0);
    background-size: 24px 24px;
    opacity: 0.05;
  }
`;

interface BankruptModalProps {
  onLiquidate: () => void;
  onTrade: () => void;
  onClose: () => void;
}

export default function BankruptModal({ onLiquidate, onTrade, onClose }: BankruptModalProps) {
  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      {/* Overlay */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0e0e0e]/90 backdrop-blur-md">

        {/* Decorative background images */}
        <div className="absolute top-10 right-10 w-64 h-64 opacity-20 hidden lg:block pointer-events-none">
          <img
            className="w-full h-full object-cover grayscale brightness-50 mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl3RZ6RVPdCSuGkMoC2BxBIXGMqGND8o1dnU0uFc7J3tzl0_U7nsrlETo639q3S7IfrXnlCx6cbWnhkW1TZ01gAZvUUaG6uQwDHbeBP80Pqix6IhOPXCKCmUpccNiDIsfr2GU75IAbp8W7PA3sk2PML1vEncK66hvpe44U7eja6hf0joUtJ__U1jP1gc2aDbnSKysVerS477eeQ70ozi6_pAUSPRnoybVjy2SI_XrAdgHtMMYJqPuRJAF4SflaFoTwtUdNhRzISGE"
            alt="Vintage casino tokens"
          />
        </div>
        <div className="absolute bottom-10 left-10 w-64 h-64 opacity-20 hidden lg:block pointer-events-none">
          <img
            className="w-full h-full object-cover grayscale brightness-50 mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT9PWctZP5hzIs0K75PyyJLMenUs7Gh8s08GqZ26Vd55eyd-3JoVhmRATqToeXHI2Oc235S99drU0j2fhkKDLQFxUtA_JU9TbtSMytlO1flRSz66xa7lm7Yq9oFxDewcfGEO1M-r-M_2HNUC23_6waqe7c0CKicJJZ7bxPI5SkRg-JMonCl4QlP-_hyExyzFeq6D42D4YS0KCqXbGvFShVFvn1ojQK6hoacb7-7vBFGUmawK3TfqheD0YldoPlsqcr0ofWB52FAXw"
            alt="Art Deco Architecture"
          />
        </div>

        {/* Modal Card */}
        <div className="relative w-full max-w-2xl bg-[#0e0e0e] border-[4px] border-[#d4a017] gold-bevel overflow-hidden">

          {/* Indochine dot pattern */}
          <div className="absolute inset-0 indochine-pattern pointer-events-none" />

          {/* Corner ornaments */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#f6be39] m-1" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#f6be39] m-1" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#f6be39] m-1" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#f6be39] m-1" />

          {/* Content */}
          <div className="relative z-10 p-10 md:p-14 flex flex-col items-center text-center">

            {/* Warning icon */}
            <div className="mb-8 relative">
              <div className="absolute -inset-4 border border-[#d4a017]/30 rotate-45" />
              <div className="w-20 h-20 flex items-center justify-center border-2 border-[#f6be39] text-[#f6be39]">
                <span
                  className="material-symbols-outlined icon-filled"
                  style={{ fontSize: "3rem" }}
                >
                  warning
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1
              className="font-['Noto_Serif'] text-3xl md:text-4xl text-[#f6be39] font-bold uppercase tracking-widest mb-6"
              style={{ textShadow: "0 0 8px rgba(246,190,57,0.4)" }}
            >
              BẠN KHÔNG ĐỦ TIỀN ĐỂ TRẢ NỢ
            </h1>

            {/* Body text */}
            <p className="font-['Work_Sans'] text-[#d3c5ae] text-lg leading-relaxed max-w-lg mb-12">
              Hãy thanh lý tài sản cho ngân hàng hoặc giao dịch với người khác để trả nợ.
              <span className="block mt-4 text-[#bdcabe] font-semibold uppercase font-['Barlow_Condensed'] tracking-widest">
                Lựa chọn giải pháp tài chính ngay lập tức.
              </span>
            </p>

            {/* Action buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Liquidate */}
              <button
                onClick={onLiquidate}
                className="relative flex items-center justify-center px-8 py-5
                  bg-gradient-to-br from-[#f6be39] to-[#d4a017]
                  hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border-0"
              >
                <span className="font-['Barlow_Condensed'] text-[#261a00] font-black text-xl uppercase tracking-widest">
                  THANH LÝ TÀI SẢN
                </span>
                <div className="absolute inset-0 border border-white/20 pointer-events-none" />
              </button>

              {/* Trade */}
              <button
                onClick={onTrade}
                className="relative flex items-center justify-center px-8 py-5
                  bg-transparent border-2 border-[#d4a017] text-[#f6be39]
                  hover:bg-[#d4a017]/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="font-['Barlow_Condensed'] font-bold text-xl uppercase tracking-widest">
                  GIAO DỊCH NGƯỜI CHƠI
                </span>
              </button>
            </div>

            {/* Footer hint */}
            <div className="mt-12 opacity-40 font-['Barlow_Condensed'] uppercase tracking-[0.3em] text-xs flex items-center gap-4 text-[#e5e2e1]">
              <div className="h-px w-8 bg-[#f6be39]" />
              THE GRAND CASINO EXECUTIVE OFFICE
              <div className="h-px w-8 bg-[#f6be39]" />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
