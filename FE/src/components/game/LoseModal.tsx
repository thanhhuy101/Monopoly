interface Props {
  rank?: number;
  finalAssets?: string;
  playTime?: string;
  onSpectate?: () => void;
  onLeave?: () => void;
}

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700;900&family=Work+Sans:wght@300;400;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .ember-glow {
    text-shadow: 0 0 15px rgba(239,68,68,0.6), 0 0 30px rgba(212,160,23,0.3);
  }
  .glass-panel {
    background: rgba(19,19,19,0.9);
    backdrop-filter: blur(20px);
  }
  .art-deco-border {
    border: 2px solid transparent;
    background:
      linear-gradient(#131313, #131313) padding-box,
      linear-gradient(135deg, #f6be39 0%, #d4a017 50%, #f6be39 100%) border-box;
  }
  .gold-btn {
    background: linear-gradient(135deg, #f6be39 0%, #d4a017 100%);
  }
`;

export default function BankruptcyModal({
  rank = 4,
  finalAssets = "0đ",
  playTime = "42:15",
  onSpectate,
  onLeave,
}: Props) {
  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">

        {/* Modal */}
        <div className="art-deco-border glass-panel rounded-xl max-w-2xl w-full shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="px-8 pt-12 pb-10 flex flex-col items-center text-center">

            {/* Stamp visual */}
            <div className="relative mb-8">
              <div className="w-40 h-40 border-4 border-[#d4a017]/30 relative flex items-center justify-center bg-black/80 overflow-hidden">
                <img
                  className="w-full h-full object-cover opacity-20 grayscale brightness-50"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAwz8jkE5L18XbmloTP_kslezlxD0RJ2K-bIMFakHlFKiz7T63dEmVGr4YYG_vVpqzDTMCh8vAAtx85-ObYrEK7OIVCRMePAYlXUYEXXyDVcV_80vZ1JsHpunsoa7cTVY85oDqz-O_OQNy_LcBKiJLV_996F43fmDKkmlfSr-8zAdCQh3YKtPBzMlcNeapAcdwzoDiWqq_i_vleDhfUyEPr-no9exrww1vIoyLGZgkAoK-febubQlmWQCSI2kBpSG2wOd24R0mqcw"
                  alt="bankruptcy"
                />
                {/* Crack lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-amber-900/40 rotate-45 scale-150" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-amber-900/40 -rotate-45 scale-150" />
                  </div>
                </div>
                {/* Stamp badge */}
                <div className="absolute inset-0 flex items-center justify-center -rotate-12">
                  <div className="border-[4px] border-red-700/80 px-4 py-1 bg-black/80 backdrop-blur-sm">
                    <span className="ember-glow font-['Noto_Serif'] text-3xl font-black text-red-600 tracking-tighter uppercase">
                      PHÁ SẢN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="ember-glow font-['Noto_Serif'] text-6xl font-black text-[#e5e2e1] mb-4 uppercase tracking-tighter">
              PHÁ SẢN
            </h1>

            {/* Subtitle */}
            <div className="space-y-3 mb-10">
              <p className="font-['Noto_Serif'] text-xl text-amber-500/80 italic">
                "Đế chế của bạn đã sụp đổ."
              </p>
              <p className="text-zinc-500 font-light text-xs tracking-widest uppercase max-w-sm mx-auto leading-relaxed">
                Mọi tài sản đã được thanh lý cho ngân hàng. Ván đấu đã kết thúc đối với bạn.
              </p>
            </div>

            {/* Stats grid */}
            <div className="w-full grid grid-cols-2 gap-px bg-[#d4a017]/20 border border-[#d4a017]/20 mb-10">
              <div className="bg-[#1c1b1b]/50 p-6">
                <span className="block text-[10px] font-['Barlow_Condensed'] text-zinc-500 tracking-[0.3em] uppercase mb-1">
                  Xếp Hạng
                </span>
                <span className="text-4xl font-['Noto_Serif'] text-[#e5e2e1] font-black">
                  #{String(rank).padStart(2, "0")}
                </span>
              </div>
              <div className="bg-[#1c1b1b]/50 p-6">
                <span className="block text-[10px] font-['Barlow_Condensed'] text-zinc-500 tracking-[0.3em] uppercase mb-1">
                  Tài Sản Cuối
                </span>
                <span className="text-4xl font-['Noto_Serif'] text-red-500 font-black">
                  {finalAssets}
                </span>
              </div>
              <div className="bg-[#1c1b1b]/50 p-4 col-span-2 border-t border-[#d4a017]/10">
                <div className="flex justify-between items-center px-4">
                  <span className="text-[10px] font-['Barlow_Condensed'] text-zinc-500 tracking-[0.2em] uppercase">
                    Thời Gian Chinh Phục
                  </span>
                  <span className="font-['Noto_Serif'] text-lg text-zinc-400">{playTime}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={onSpectate}
                className="flex-1 py-4 border border-[#d4a017] text-[#f6be39]
                  font-['Barlow_Condensed'] font-bold tracking-[0.2em] uppercase
                  hover:bg-[#f6be39]/5 transition-all duration-300 cursor-pointer bg-transparent"
              >
                THEO DÕI TIẾP
              </button>
              <button
                onClick={onLeave}
                className="flex-1 py-4 gold-btn text-[#261a00]
                  font-['Barlow_Condensed'] font-bold tracking-[0.2em] uppercase
                  shadow-[0_10px_20px_rgba(212,160,23,0.3)] hover:brightness-110
                  active:scale-95 transition-all duration-300 cursor-pointer border-0"
              >
                RỜI PHÒNG
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
