import { useState } from "react";

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Work+Sans:wght@300;400;500;600&family=Barlow+Condensed:wght@400;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
    line-height: 1;
    display: inline-block;
  }
  .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  .gold-glow   { text-shadow: 0 0 8px rgba(246,190,57,0.4); }
  .glass-modal { backdrop-filter: blur(12px); }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #0e0e0e; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4a017; }
  .toggle-track {
    position: relative;
    width: 3rem;
    height: 1.5rem;
    border: 1px solid #4f4634;
    background: #2a2a2a;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    display: inline-block;
    flex-shrink: 0;
  }
  .toggle-track.on { background: rgba(246,190,57,0.2); border-color: #f6be39; }
  .toggle-thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 1.25rem;
    height: 1rem;
    background: #4f4634;
    transition: transform 0.2s, background 0.2s;
  }
  .toggle-track.on .toggle-thumb { transform: translateX(1.25rem); background: #f6be39; }
  .underline-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(212,160,23,0.4);
    outline: none;
    color: #e5e2e1;
    font-family: 'Work Sans', sans-serif;
    padding: 0.5rem 0;
    transition: border-color 0.2s;
  }
  .underline-input:focus { border-bottom-color: #f6be39; }
  .underline-input::placeholder { color: rgba(155,143,122,0.5); }
`;


export default function CreateRoomModal({ onClose, onCreateRoom }: { 
  onClose: () => void; 
  onCreateRoom: (roomData: {
    name: string;
    isPrivate: boolean;
    password?: string;
  }) => void;
}) {
  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [password, setPassword] = useState("");

  const handleCreateRoom = () => {
    if (!roomName.trim()) return; // Validate room name is not empty
    
    onCreateRoom({
      name: roomName,
      isPrivate,
      password: isPrivate ? password : undefined,
    });
  };

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      {/* Overlay */}
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 glass-modal">
        {/* Modal Card */}
        <div className="w-full max-w-[450px] bg-[#0e0e0e] border-2 border-[#d4a017] shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col">

          {/* ── Header ── */}
          <div className="p-6 border-b border-[#4f4634]/30">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="gold-glow font-['Noto_Serif'] text-2xl font-bold text-[#f6be39] uppercase tracking-tight">
                  Imperial Concierge
                </h2>
                <p className="font-['Barlow_Condensed'] text-xs text-[#bdcabe] tracking-[0.2em] uppercase mt-1">
                  Configure New Atelier
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#bdcabe] hover:text-[#f6be39] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* ── Scrollable Body ── */}
          <div className="p-6 space-y-8 overflow-y-auto max-h-[520px] custom-scrollbar">

            {/* 1. Room Name */}
            <div className="space-y-2">
              <label className="font-['Barlow_Condensed'] text-xs text-[#f6be39] uppercase tracking-widest block">
                Tên Phòng
              </label>
              <input
                className="underline-input"
                type="text"
                placeholder="Nhập tên phòng của bạn..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            {/* 2. Private Toggle + Password */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#f6be39]">
                    {isPrivate ? "privacy_tip" : "public"}
                  </span>
                  <span className="font-['Barlow_Condensed'] text-sm text-[#e5e2e1] uppercase tracking-wider">
                    {isPrivate ? "Chế độ Riêng tư" : "Chế độ Công khai"}
                  </span>
                </div>
                {/* Custom Toggle */}
                <div
                  className={`toggle-track${isPrivate ? " on" : ""}`}
                  onClick={() => setIsPrivate((v) => !v)}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>

              {/* Password (only when private) */}
              {isPrivate && (
                <div className="relative">
                  <span className="material-symbols-outlined icon-filled absolute left-0 top-1/2 -translate-y-1/2 text-[#f6be39] text-sm">
                    lock
                  </span>
                  <input
                    className="underline-input pl-9! text-sm"
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Footer CTA ── */}
          <div className="p-6 bg-[#1c1b1b] mt-auto">
            <button 
              onClick={handleCreateRoom}
              className="w-full py-4 bg-linear-to-r from-[#f6be39] to-[#d4a017]
                text-[#261a00] font-['Barlow_Condensed'] font-black text-lg uppercase tracking-[0.2em]
                shadow-[0_4px_15px_rgba(212,160,23,0.3)] active:scale-95 duration-150 cursor-pointer border-0 transition-transform">
              KHỞI HÀNH
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
