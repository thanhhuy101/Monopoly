/**
 * AuthLayout.tsx
 * Header + background từ màn hình SignUp, dùng chung cho 3 trang auth.
 * Nav tabs: HƯỚNG DẪN · TIN TỨC · ĐĂNG KÝ · ĐĂNG NHẬP
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';

const BG_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuClJsycyXhRdlpHftor9QGnciuIZLwaA3d_bKeN4pK1vhDOUHiVrCWNH71LjkALvXnPgLl_9tdOK3wEOEGOkoaEx0m0wR2fRZLQTRcQK139lr8WNdEHelkx2I-SPQ2v7wujQTs-9ndLO6BGDbuF-KLiXAAccqeLOi5CW1JrlFWsOoabQ9qPeCY-KpUJ7hvnBTAjTSZ84TrstIDXPKxzgrksiJtXkbID_CPmkyP_EwyXaT93KQRAkLykQgTgB3P3s6tcXRhAvnNulkA';

const NAV = [
  { label: 'HƯỚNG DẪN', path: '/guide'       },
  { label: 'TIN TỨC',   path: '/news'        },
  { label: 'ĐĂNG KÝ',   path: '/auth/signup' },
  { label: 'ĐĂNG NHẬP', path: '/auth/signin' },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && pathname.startsWith('/auth/')) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, pathname, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: '#131313', color: '#e5e2e1',
      fontFamily: "'Work Sans', sans-serif" }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', height: 68,
        background: '#0e0e0e',
        borderBottom: '2px solid #d4a017',
        boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
        boxSizing: 'border-box',
      }}>
        {/* Logo */}
        <button onClick={() => navigate(user ? '/home' : '/auth/signin')} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontSize: 22, fontWeight: 700, letterSpacing: 6,
          color: '#f6be39', fontFamily: "'Playfair Display', serif",
          textShadow: '0 0 8px rgba(246,190,57,0.4)',
        }}>
          Cờ Tỷ Phú
        </button>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {NAV.map(({ label, path }) => {
            const active = pathname === path;
            return (
              <button key={path} onClick={() => navigate(path)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14, fontWeight: 700, letterSpacing: 3,
                color: active ? '#f6be39' : '#bdcabe',
                opacity: active ? 1 : 0.7,
                borderBottom: active ? '2px solid #f6be39' : '2px solid transparent',
                transition: 'all .2s',
              }}
                onMouseOver={e => { if (!active) { e.currentTarget.style.color='#f6be39'; e.currentTarget.style.opacity='1'; }}}
                onMouseOut={e  => { if (!active) { e.currentTarget.style.color='#bdcabe'; e.currentTarget.style.opacity='0.7'; }}}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Utility icons */}
        <div style={{ display: 'flex', gap: 12 }}>
          {(['help_outline','language'] as const).map(icon => (
            <button key={icon} style={{
              background:'none', border:'none', cursor:'pointer',
              color:'#f6be39', lineHeight:1, transition:'filter .2s',
            }}
              onMouseOver={e => e.currentTarget.style.filter='brightness(1.3)'}
              onMouseOut={e  => e.currentTarget.style.filter='none'}
            >
              <span className="material-symbols-outlined" style={{ fontSize:22 }}>{icon}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Background (gold radials + art-deco image từ SignUp) ── */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:600, height:600,
          borderRadius:'50%', background:'#d4a017', filter:'blur(150px)', opacity:0.2,
          transform:'translate(40%,-40%)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, width:600, height:600,
          borderRadius:'50%', background:'#f6be39', filter:'blur(150px)', opacity:0.15,
          transform:'translate(-40%,40%)' }} />
        <img src={BG_IMG} alt="" style={{
          width:'100%', height:'100%', objectFit:'cover',
          opacity:0.18, mixBlendMode:'overlay',
        }} />
      </div>

      {/* ── Main slot ───────────────────────────────────────────── */}
      <main style={{
        flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        padding:'88px 24px 48px',
        position:'relative', zIndex:10,
      }}>
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{
        position:'relative', zIndex:10,
        padding:'14px 32px',
        borderTop:'1px solid rgba(79,70,52,0.2)',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        flexWrap:'wrap', gap:12,
        fontFamily:"'Barlow Condensed', sans-serif",
        fontSize:10, letterSpacing:4, textTransform:'uppercase',
        color:'rgba(212,160,23,0.35)',
      }}>
        <span>© 2025 Cờ Tỷ Phú — Phòng VIP Indochine. All rights reserved.</span>
        <div style={{ display:'flex', gap:24 }}>
          {['Quy Định Bảo Mật','Trung Tâm Hỗ Trợ','Liên Hệ'].map(l => (
            <button key={l} style={{
              background:'none', border:'none', cursor:'pointer',
              color:'rgba(212,160,23,0.35)',
              fontFamily:"'Barlow Condensed', sans-serif",
              fontSize:10, letterSpacing:4, textTransform:'uppercase', transition:'color .2s',
            }}
              onMouseOver={e => e.currentTarget.style.color='#f6be39'}
              onMouseOut={e  => e.currentTarget.style.color='rgba(212,160,23,0.35)'}
            >{l}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}
