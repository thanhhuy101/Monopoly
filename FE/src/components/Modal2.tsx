/**
 * Modal2.tsx — Premium "Emperor's Ledger" Deed Card Modal
 *
 * Thay thế Modal.tsx với thiết kế cao cấp Indochine:
 *  - Prop modal  → Deed card với bảng giá thuê đầy đủ, shimmer effect
 *  - Build modal → Confirmation card với current house level
 *  - Win / other → Fallback về card đơn giản
 *
 * Sử dụng: thay `import Modal from './Modal'`
 *          bằng  `import Modal from './Modal2'`  trong Sidebar.tsx / GamePage.tsx
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { SPACES, COLOR_HEX } from '../data/gameData';
import type { ModalButton, ModalConfig } from '../types/game';

// ─── helpers ──────────────────────────────────────────────────────────────────
/** Detect if modal is for a property (has spaceId in buy/build button) */
function getSpaceId(modal: ModalConfig): number | null {
  for (const b of modal.buttons) {
    if (b.spaceId !== undefined) return b.spaceId;
  }
  return null;
}

function getAction(modal: ModalConfig): 'buy' | 'build' | 'other' {
  const actions = modal.buttons.map(b => b.action);
  if (actions.includes('buy'))   return 'buy';
  if (actions.includes('build')) return 'build';
  return 'other';
}

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Spinning diamond sparkle icon */
function Sparkle({ delay = 0, active = false }: { delay?: number; active?: boolean }) {
  return (
    <span
      style={{
        display:  'inline-block',
        width:    8, height: 8,
        background: active ? '#f6be39' : '#9eaba0',
        transform: 'rotate(45deg)',
        flexShrink: 0,
        animation: `sparkle2 2s ${delay}s ease-in-out infinite`,
        boxShadow: active ? '0 0 6px rgba(246,190,57,0.6)' : 'none',
      }}
    />
  );
}

/** Rent row in deed table */
function RentRow({
  label, value, sparkles = 0, highlight = false, active = false,
}: {
  label: string; value: string; sparkles?: number; highlight?: boolean; active?: boolean;
}) {
  if (highlight) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', margin: '8px 0',
        background: active
          ? 'linear-gradient(90deg, #131313 25%, #d4a017 50%, #131313 75%)'
          : '#1a1a1a',
        backgroundSize: active ? '200% 100%' : undefined,
        animation: active ? 'shimmer2 3s linear infinite' : undefined,
        color: active ? '#e5e2e1' : '#555',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🏨</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', fontSize: 13 }}>
            {label}
          </span>
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: active ? '#f6be39' : '#555', fontWeight: 700 }}>
          {value}
        </span>
        {/* glint */}
        {active && <div style={{
          position: 'absolute', top: 0, left: '-150%', width: '50%', height: '100%',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
          transform: 'skewX(-25deg)',
          animation: 'glint2 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: '1px solid rgba(14,14,14,0.12)', paddingBottom: 6, marginBottom: 8,
      fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14,
      opacity: active ? 1 : 0.5,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: active ? 700 : 400 }}>
        {label}
        {sparkles > 0 && (
          <span style={{ display: 'flex', gap: 2, marginLeft: 4 }}>
            {Array.from({ length: sparkles }).map((_, i) => <Sparkle key={i} delay={i * 0.3} active={active} />)}
          </span>
        )}
      </span>
      <span style={{ fontWeight: 700, fontSize: active ? 18 : 16, color: active ? '#b8860b' : undefined }}>{value}</span>
    </div>
  );
}

// ─── DEED CARD (buy modal for property) ───────────────────────────────────────
function DeedCard({ modal, spaceId }: { modal: ModalConfig; spaceId: number }) {
  const sp           = SPACES[spaceId];
  const colorHex     = sp.color ? COLOR_HEX[sp.color] : '#555';
  const rent         = sp.rent ?? [0, 0, 0, 0, 0, 0];
  const price        = sp.price ?? 0;
  const houseCost    = 100;
  const mortgageVal  = Math.round(price / 2);
  const handleAction = useGameStore(s => s.handleModalAction);
  const houses       = useGameStore(s => s.houses);
  const h            = houses[spaceId] ?? 0;

  const buyBtn  = modal.buttons.find(b => b.action === 'buy');
  const passBtn = modal.buttons.find(b => b.action === 'pass');
  const okBtn   = modal.buttons.find(b => b.action === 'pass' && !buyBtn);

  return (
    <div style={{
      width: '100%', maxWidth: 420,
      background: '#e7e2da',
      color: '#131313',
      border: `2px solid #d4a017`,
      boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 10px rgba(212,160,23,0.3)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>

      {/* Color bar */}
      <div style={{
        height: 88, background: colorHex,
        borderBottom: '2px solid #131313',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        paddingBottom: 12, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.15,
          backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.15) 10px,rgba(255,255,255,0.15) 20px)',
        }} />
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'white', fontSize: 11, letterSpacing: 6, textTransform: 'uppercase', opacity: 0.9 }}>
          Title Deed
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '24px 28px', flex: 1 }}>

        {/* Property name */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
          {sp.name}
        </h1>
        <div style={{ width: 56, height: 2, background: '#d4a017', margin: '0 auto 24px' }} />

        {/* Rent table */}
        <div style={{ marginBottom: 8 }}>
          <RentRow label="Rent"          value={`$${rent[0]}`} active={h === 0} />
          <RentRow label="With 1 House"  value={`$${rent[1]}`} sparkles={1} active={h === 1} />
          <RentRow label="With 2 Houses" value={`$${rent[2]}`} sparkles={2} active={h === 2} />
          <RentRow label="With 3 Houses" value={`$${rent[3]}`} sparkles={3} active={h === 3} />
          <RentRow label="With 4 Houses" value={`$${rent[4]}`} sparkles={4} active={h === 4} />
          <RentRow label="With Hotel"    value={`$${rent[5]}`} highlight active={h >= 5} />
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderTop: '2px solid rgba(14,14,14,0.15)',
          paddingTop: 16, marginTop: 8, gap: 8,
        }}>
          {[
            { label: 'Mortgage Value', val: `$${mortgageVal}` },
            { label: 'House Cost',     val: `$${houseCost} each` },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderLeft: i ? '1px solid rgba(14,14,14,0.15)' : 'none' }}>
              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.55, marginBottom: 4, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {s.label}
              </p>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18 }}>
                {s.val}
              </p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 8, letterSpacing: 2, fontStyle: 'italic', opacity: 0.4, textAlign: 'center', marginTop: 16, lineHeight: 1.6, fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase' }}>
          Nếu sở hữu toàn bộ nhóm màu, tiền thuê đất trống sẽ tăng gấp đôi.
        </p>
      </div>

      {/* Action footer */}
      <div style={{ display: 'grid', gridTemplateColumns: buyBtn ? '1fr 1fr' : '1fr', height: 56, borderTop: '2px solid #131313' }}>
        {passBtn && (
          <button
            onClick={() => handleAction(passBtn)}
            style={{
              background: '#131313', color: '#f6be39',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'background .15s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#2a2a2a')}
            onMouseOut={e  => (e.currentTarget.style.background = '#131313')}
          >
            <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 18 }}>close</span>
            Bỏ Qua
          </button>
        )}
        {buyBtn && (
          <button
            onClick={() => handleAction(buyBtn)}
            style={{
              background: 'linear-gradient(135deg, #f6be39, #d4a017)',
              color: '#261a00',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              position: 'relative', overflow: 'hidden',
              transition: 'filter .15s',
            }}
            onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.12)')}
            onMouseOut={e  => (e.currentTarget.style.filter = 'none')}
          >
            <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 18 }}>add_business</span>
            Mua Ngay — ${price}
          </button>
        )}
        {okBtn && !buyBtn && (
          <button
            onClick={() => handleAction(okBtn)}
            style={{
              background: '#d4a017', color: '#261a00',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
            }}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
}

// ─── RAILROAD CARD ───────────────────────────────────────────────────────────
function RailroadCard({ modal, spaceId }: { modal: ModalConfig; spaceId: number }) {
  const sp           = SPACES[spaceId];
  const price        = sp.price ?? 0;
  const mortgageVal  = Math.round(price / 2);
  const handleAction = useGameStore(s => s.handleModalAction);

  const buyBtn  = modal.buttons.find(b => b.action === 'buy');
  const passBtn = modal.buttons.find(b => b.action === 'pass');

  return (
    <div style={{
      width: '100%', maxWidth: 420,
      background: '#e7e2da', color: '#131313',
      border: '2px solid #d4a017',
      boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 10px rgba(212,160,23,0.3)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        height: 88, background: '#2a2a2a',
        borderBottom: '2px solid #131313',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.15) 10px,rgba(255,255,255,0.15) 20px)',
        }} />
        <span style={{ fontSize: 32, marginBottom: 4 }}>🚂</span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#f6be39', fontSize: 11, letterSpacing: 6, textTransform: 'uppercase' }}>
          Railroad
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 28px', flex: 1 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
          {sp.name}
        </h1>
        <div style={{ width: 56, height: 2, background: '#d4a017', margin: '0 auto 24px' }} />

        {/* Rent table */}
        <div style={{ marginBottom: 8 }}>
          <RentRow label="Sở hữu 1 nhà ga"  value="$25" sparkles={1} />
          <RentRow label="Sở hữu 2 nhà ga"  value="$50" sparkles={2} />
          <RentRow label="Sở hữu 3 nhà ga"  value="$100" sparkles={3} />
          <RentRow label="Sở hữu 4 nhà ga"  value="$200" highlight />
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderTop: '2px solid rgba(14,14,14,0.15)',
          paddingTop: 16, marginTop: 8, gap: 8,
        }}>
          {[
            { label: 'Giá Mua', val: `$${price}` },
            { label: 'Thế Chấp', val: `$${mortgageVal}` },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderLeft: i ? '1px solid rgba(14,14,14,0.15)' : 'none' }}>
              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.55, marginBottom: 4, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {s.label}
              </p>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18 }}>
                {s.val}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: buyBtn ? '1fr 1fr' : '1fr', height: 56, borderTop: '2px solid #131313' }}>
        {passBtn && (
          <button onClick={() => handleAction(passBtn)}
            style={{ background: '#131313', color: '#f6be39', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background .15s' }}
            onMouseOver={e => (e.currentTarget.style.background = '#2a2a2a')}
            onMouseOut={e  => (e.currentTarget.style.background = '#131313')}>
            <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 18 }}>close</span>
            Bỏ Qua
          </button>
        )}
        {buyBtn && (
          <button onClick={() => handleAction(buyBtn)}
            style={{ background: 'linear-gradient(135deg, #f6be39, #d4a017)', color: '#261a00', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative', overflow: 'hidden', transition: 'filter .15s' }}
            onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.12)')}
            onMouseOut={e  => (e.currentTarget.style.filter = 'none')}>
            <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 18 }}>add_business</span>
            Mua Ngay — ${price}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── UTILITY CARD ────────────────────────────────────────────────────────────
function UtilityCard({ modal, spaceId }: { modal: ModalConfig; spaceId: number }) {
  const sp           = SPACES[spaceId];
  const price        = sp.price ?? 0;
  const mortgageVal  = Math.round(price / 2);
  const handleAction = useGameStore(s => s.handleModalAction);

  const buyBtn  = modal.buttons.find(b => b.action === 'buy');
  const passBtn = modal.buttons.find(b => b.action === 'pass');

  return (
    <div style={{
      width: '100%', maxWidth: 420,
      background: '#e7e2da', color: '#131313',
      border: '2px solid #d4a017',
      boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 0 10px rgba(212,160,23,0.3)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        height: 88, background: '#1a3a2a',
        borderBottom: '2px solid #131313',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.15) 10px,rgba(255,255,255,0.15) 20px)',
        }} />
        <span style={{ fontSize: 32, marginBottom: 4 }}>{sp.icon ?? '⚡'}</span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#f6be39', fontSize: 11, letterSpacing: 6, textTransform: 'uppercase' }}>
          Utility
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 28px', flex: 1 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
          {sp.name}
        </h1>
        <div style={{ width: 56, height: 2, background: '#d4a017', margin: '0 auto 24px' }} />

        {/* Rent rules */}
        <div style={{ marginBottom: 8 }}>
          <RentRow label="Sở hữu 1 tiện ích" value="4× 🎲" sparkles={1} />
          <RentRow label="Sở hữu 2 tiện ích" value="10× 🎲" highlight />
        </div>

        <p style={{ fontSize: 10, letterSpacing: 1, fontStyle: 'italic', opacity: 0.5, textAlign: 'center', marginTop: 12, lineHeight: 1.6, fontFamily: "'Barlow Condensed', sans-serif" }}>
          Tiền thuê = hệ số × tổng xúc xắc của người thuê
        </p>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderTop: '2px solid rgba(14,14,14,0.15)',
          paddingTop: 16, marginTop: 16, gap: 8,
        }}>
          {[
            { label: 'Giá Mua', val: `$${price}` },
            { label: 'Thế Chấp', val: `$${mortgageVal}` },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderLeft: i ? '1px solid rgba(14,14,14,0.15)' : 'none' }}>
              <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.55, marginBottom: 4, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {s.label}
              </p>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18 }}>
                {s.val}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: buyBtn ? '1fr 1fr' : '1fr', height: 56, borderTop: '2px solid #131313' }}>
        {passBtn && (
          <button onClick={() => handleAction(passBtn)}
            style={{ background: '#131313', color: '#f6be39', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background .15s' }}
            onMouseOver={e => (e.currentTarget.style.background = '#2a2a2a')}
            onMouseOut={e  => (e.currentTarget.style.background = '#131313')}>
            <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 18 }}>close</span>
            Bỏ Qua
          </button>
        )}
        {buyBtn && (
          <button onClick={() => handleAction(buyBtn)}
            style={{ background: 'linear-gradient(135deg, #f6be39, #d4a017)', color: '#261a00', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative', overflow: 'hidden', transition: 'filter .15s' }}
            onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.12)')}
            onMouseOut={e  => (e.currentTarget.style.filter = 'none')}>
            <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 18 }}>add_business</span>
            Mua Ngay — ${price}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── BUILD CARD ───────────────────────────────────────────────────────────────
function BuildCard({ modal, spaceId }: { modal: ModalConfig; spaceId: number }) {
  const sp           = SPACES[spaceId];
  const colorHex     = sp.color ? COLOR_HEX[sp.color] : '#555';
  const handleAction = useGameStore(s => s.handleModalAction);
  const houses       = useGameStore(s => s.houses);
  const h            = houses[spaceId] ?? 0;
  const cost         = h < 4 ? 100 : 200;
  const buildBtn     = modal.buttons.find(b => b.action === 'build');
  const passBtn      = modal.buttons.find(b => b.action === 'pass');

  const nextLabel = h < 4 ? `🏠 Nhà thứ ${h + 1}` : '🏨 Khách Sạn';
  const currentLabel = h === 0 ? 'Trống' : h < 5 ? `${h} nhà 🏠` : '🏨 Khách Sạn';

  return (
    <div style={{
      width: '100%', maxWidth: 400,
      background: '#e7e2da', color: '#131313',
      border: '2px solid #d4a017',
      boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header strip */}
      <div style={{
        height: 64, background: colorHex,
        borderBottom: '2px solid #131313',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 24 }}>🔨</span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'white', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase' }}>
          Xây Dựng
        </span>
      </div>

      <div style={{ padding: '24px 28px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, textAlign: 'center', marginBottom: 20 }}>
          {sp.name}
        </h2>

        {/* Current / next state */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Hiện Tại', val: currentLabel },
            { label: 'Xây Thêm', val: nextLabel },
          ].map((s, i) => (
            <div key={i} style={{
              background: i === 1 ? '#131313' : 'rgba(14,14,14,0.06)',
              color: i === 1 ? '#f6be39' : '#131313',
              padding: '12px 16px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.6, marginBottom: 6, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {s.label}
              </p>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18 }}>
                {s.val}
              </p>
            </div>
          ))}
        </div>

        {/* Cost */}
        <div style={{
          background: 'linear-gradient(90deg, #131313 25%, #d4a017 50%, #131313 75%)',
          backgroundSize: '200% 100%', animation: 'shimmer2 3s linear infinite',
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#e5e2e1', letterSpacing: 2, fontSize: 13, textTransform: 'uppercase' }}>Chi Phí</span>
          <span style={{ fontFamily: "'Playfair Display', serif", color: '#f6be39', fontSize: 24, fontWeight: 700 }}>${cost}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 56, borderTop: '2px solid #131313' }}>
        {passBtn && (
          <button onClick={() => handleAction(passBtn)}
            style={{ background: '#131313', color: '#f6be39', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
            Bỏ Qua
          </button>
        )}
        {buildBtn && (
          <button onClick={() => handleAction(buildBtn)}
            style={{ background: 'linear-gradient(135deg,#f6be39,#d4a017)', color: '#261a00', border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 18 }}>add_business</span>
            Xây Thêm
          </button>
        )}
      </div>
    </div>
  );
}

// ─── GENERIC CARD (win, jail, tax, cards…) ────────────────────────────────────
function GenericCard({ modal }: { modal: ModalConfig }) {
  const handleAction = useGameStore(s => s.handleModalAction);
  return (
    <div style={{
      width: '100%', maxWidth: 360,
      background: '#111827', color: '#e5e2e1',
      border: '1px solid #3af4ff',
      borderRadius: 16, padding: '26px 26px 20px',
      textAlign: 'center',
      boxShadow: '0 0 60px rgba(58,244,255,.18), 0 20px 60px rgba(0,0,0,.7)',
    }}>
      <div style={{ fontSize: 34, marginBottom: 6 }}>{modal.icon}</div>
      <div style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 17, fontWeight: 900, color: '#f5c842', marginBottom: 8, textShadow: '0 0 18px rgba(245,200,66,.4)' }}>
        {modal.title}
      </div>
      <div style={{ fontSize: 12.5, color: '#7a8fbb', lineHeight: 1.6, marginBottom: 16, whiteSpace: 'pre-line' }}>
        {modal.body}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {modal.buttons.map((btn: ModalButton, i: number) => (
          <button key={i} onClick={() => handleAction(btn)}
            style={{
              padding: '10px 22px', border: 'none', borderRadius: 50,
              fontFamily: 'Nunito,sans-serif', fontSize: 13, fontWeight: 800, cursor: 'pointer',
              background: btn.cls === 'btn-buy' || btn.cls === 'btn-win'
                ? 'linear-gradient(135deg,#f6be39,#d4a017)'
                : btn.cls === 'btn-ok'
                  ? 'linear-gradient(135deg,#39ff85,#00b840)'
                  : '#1a2236',
              color: btn.cls === 'btn-buy' || btn.cls === 'btn-win'
                ? '#261a00'
                : btn.cls === 'btn-ok' ? '#001a08' : '#7a8fbb',
            }}>
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Shared CSS injected once ─────────────────────────────────────────────────
const SHARED_CSS = `
  @keyframes shimmer2 {
    0%   { background-position: -200% 0 }
    100% { background-position:  200% 0 }
  }
  @keyframes sparkle2 {
    0%,100% { opacity:.5; transform:scale(1) rotate(45deg) }
    50%     { opacity:1;  transform:scale(1.2) rotate(45deg) }
  }
  @keyframes glint2 {
    0%   { left:-150% }
    100% { left: 150% }
  }
`;
let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.id = 'modal2-css';
  el.textContent = SHARED_CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

// ─── Root Modal2 ──────────────────────────────────────────────────────────────
export default function Modal2() {
  injectCSS();

  const modal = useGameStore(s => s.modal);

  const spaceId = modal ? getSpaceId(modal) : null;
  const action  = modal ? getAction(modal)  : 'other';
  const spType  = spaceId !== null ? SPACES[spaceId]?.type : null;
  const isProp  = spType === 'prop' || spType === 'railroad' || spType === 'utility';

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(14,14,14,0.88)',
            backdropFilter: 'blur(12px)',
            zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <motion.div
            initial={{ scale: 0.88, y: 28, opacity: 0 }}
            animate={{ scale: 1,    y: 0,  opacity: 1 }}
            exit={{    scale: 0.92, y: 14, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}
          >
            {/* Close button */}
            <button
              onClick={() => useGameStore.getState().handleModalAction(
                modal.buttons.find(b => b.action === 'pass') ?? modal.buttons[modal.buttons.length - 1]
              )}
              style={{
                position: 'absolute', top: -40, right: 0,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#f6be39', fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              CLOSE
              <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: 18 }}>close</span>
            </button>

            {/* Card selection */}
            {spType === 'prop' && action === 'buy'   && <DeedCard  modal={modal} spaceId={spaceId!} />}
            {spType === 'prop' && action === 'build' && <BuildCard modal={modal} spaceId={spaceId!} />}
            {spType === 'railroad' && action === 'buy' && <RailroadCard modal={modal} spaceId={spaceId!} />}
            {spType === 'utility'  && action === 'buy' && <UtilityCard  modal={modal} spaceId={spaceId!} />}
            {(!isProp || action === 'other') && <GenericCard modal={modal} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
