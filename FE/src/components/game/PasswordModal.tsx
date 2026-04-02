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
  .underline-input {
    background: transparent;
    border: 0;
    border-bottom: 1px solid rgba(155,143,122,0.3);
    color: #e5e2e1;
    outline: none;
    padding: 0.5rem 0;
    transition: border-color 0.2s;
    width: 100%;
  }
  .underline-input:focus { border-bottom-color: #f6be39; }
  .underline-input::placeholder { color: rgba(155,143,122,0.5); }
`;

interface PasswordModalProps {
  onClose: () => void;
  onJoin: (password: string) => void;
  roomName: string;
}

export default function PasswordModal({ onClose, onJoin, roomName }: PasswordModalProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onJoin(password);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      {/* Overlay */}
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 glass-modal">
        {/* Modal Card */}
        <div className="w-full max-w-[400px] bg-[#0e0e0e] border-2 border-[#d4a017] shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col">

          {/* ── Header ── */}
          <div className="p-6 border-b border-[#4f4634]">
            <div className="flex items-center justify-between">
              <h2 className="font-['Noto_Serif'] text-2xl font-bold text-[#f6be39] uppercase tracking-tight">
                Private Room
              </h2>
              <button 
                onClick={onClose}
                className="text-[#d3c5ae] hover:text-[#f6be39] transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="p-6 space-y-6 flex-1">
            {/* Room Info */}
            <div className="text-center space-y-2">
              <p className="text-[#d3c5ae] text-sm">Joining:</p>
              <h3 className="font-['Noto_Serif'] text-xl font-bold text-[#e5e2e1]">{roomName}</h3>
            </div>

            {/* Password Input */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-['Barlow_Condensed'] text-sm text-[#d3c5ae] uppercase tracking-wider">
                  Password Required
                </span>
                <div className="relative mt-2">
                  <span className="material-symbols-outlined icon-filled absolute left-0 top-1/2 -translate-y-1/2 text-[#f6be39] text-sm">
                    lock
                  </span>
                  <input
                    className="underline-input pl-9! text-sm"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                </div>
              </label>
            </div>

            {/* Error Message (shown when password is wrong) */}
            {/* This can be added later with state management */}
          </div>

          {/* ── Footer CTA ── */}
          <div className="p-6 bg-[#1c1b1b] mt-auto">
            <button 
              onClick={handleSubmit}
              className="w-full py-3 bg-linear-to-r from-[#f6be39] to-[#d4a017]
                text-[#261a00] font-['Barlow_Condensed'] font-black text-lg uppercase tracking-[0.2em]
                shadow-[0_4px_15px_rgba(212,160,23,0.3)] active:scale-95 duration-150 cursor-pointer border-0 transition-transform">
              Join Room
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
