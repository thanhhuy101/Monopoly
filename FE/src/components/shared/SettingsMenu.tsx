import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import {
  toggleTheme, isMuted, setVolume, getVolume,
} from '../../utils/musicManager';

export default function SettingsMenu() {
  const navigate = useNavigate();
  const logout = useAuthStore(s => s.logout);
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [volume, setVol] = useState(getVolume);
  const [muted, setMuted] = useState(isMuted);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirmLogout(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleVolume = (v: number) => {
    setVol(v);
    setVolume(v);
    if (v > 0 && muted) {
      toggleTheme();
      setMuted(false);
    }
  };

  const handleMute = () => {
    const playing = toggleTheme();
    setMuted(!playing);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đăng xuất thành công!');
      setOpen(false);
      setConfirmLogout(false);
      navigate('/auth/signin');
    } catch (error) {
      toast.error('Đăng xuất thất bại! Vui lòng thử lại.');
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(o => !o); setConfirmLogout(false); }}
        className="material-symbols-outlined text-[#f6be39] cursor-pointer hover:bg-[#353534] p-1 rounded transition-colors"
        style={{ fontSize: 22, background: 'none', border: 'none' }}
      >
        settings
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-100"
          style={{
            width: 260,
            background: 'rgba(20,20,20,0.97)',
            backdropFilter: 'blur(12px)',
            border: '2px solid #d4a017',
            boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
          }}
        >
          {/* Volume control */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(79,70,52,0.4)' }}>
            <div className="flex items-center justify-between mb-3">
              <span
                className="font-['Barlow_Condensed'] text-[10px] uppercase tracking-[3px] text-[#d3c5ae]"
              >
                Âm lượng
              </span>
              <span className="font-['Barlow_Condensed'] text-[11px] text-[#f6be39]">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleMute}
                className="material-symbols-outlined transition-colors"
                style={{
                  fontSize: 20,
                  color: muted ? '#ff6b6b' : '#f6be39',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                {muted ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={e => handleVolume(Number(e.target.value))}
                className="flex-1 h-1 appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #f6be39 ${volume * 100}%, #4f4634 ${volume * 100}%)`,
                  borderRadius: 2,
                  outline: 'none',
                  accentColor: '#f6be39',
                }}
              />
            </div>
          </div>

          {/* Mute toggle */}
          <button
            onClick={handleMute}
            className="w-full flex items-center gap-3 hover:bg-[#353534] transition-colors"
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid rgba(79,70,52,0.4)',
              cursor: 'pointer',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 18,
                color: muted ? '#ff6b6b' : '#bdcabe',
                fontVariationSettings: "'FILL' 1",
              }}
            >
              {muted ? 'music_off' : 'music_note'}
            </span>
            <span className="font-['Barlow_Condensed'] text-[12px] uppercase tracking-[2px] text-[#bdcabe]">
              {muted ? 'Bật nhạc nền' : 'Tắt nhạc nền'}
            </span>
          </button>

          {/* Logout */}
          {!confirmLogout ? (
            <button
              onClick={() => setConfirmLogout(true)}
              className="w-full flex items-center gap-3 hover:bg-[#353534] transition-colors"
              style={{
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, color: '#ff6b6b' }}
              >
                logout
              </span>
              <span className="font-['Barlow_Condensed'] text-[12px] uppercase tracking-[2px] text-[#ff6b6b]">
                Đăng xuất
              </span>
            </button>
          ) : (
            <div style={{ padding: '14px 20px' }}>
              <p className="font-['Barlow_Condensed'] text-[11px] uppercase tracking-[2px] text-[#d3c5ae] mb-3 text-center">
                Xác nhận đăng xuất?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 font-['Barlow_Condensed'] text-[11px] font-bold uppercase tracking-[2px] hover:brightness-110 transition-all"
                  style={{
                    padding: '8px 0',
                    background: 'transparent',
                    border: '1px solid #4f4634',
                    color: '#bdcabe',
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 font-['Barlow_Condensed'] text-[11px] font-bold uppercase tracking-[2px] hover:brightness-110 transition-all"
                  style={{
                    padding: '8px 0',
                    background: 'linear-gradient(135deg, #ff6b6b, #c0392b)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
