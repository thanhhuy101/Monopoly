/**
 * ChestCard.tsx — Thẻ Khí Vận (Community Chest)
 * Converted từ HTML design: 3D rotated card với art-deco frame
 * màu gradient đỏ (#c0392b → #e74c3c), nghiêng rotateY(+12deg) (ngược với ChanceCard)
 *
 * Props:
 *   card?      — GameCard hiện tại (optional)
 *   size?      — 'sm' | 'md' | 'lg' (default: 'md')
 *   hover?     — true → unfold về thẳng khi hover (default: true)
 *   showDetail — true → hiện glass-panel detail bên dưới
 */

import { useState } from 'react';
import type { GameCard } from '../../types/game';

interface Props {
  card?:      GameCard;
  size?:      'sm' | 'md' | 'lg';
  hover?:     boolean;
  showDetail?: boolean;
}

const SIZES = {
  sm: { w: 160, h: 230, font: 18, icon: 48, label: 8  },
  md: { w: 216, h: 315, font: 26, icon: 72, label: 10 },
  lg: { w: 288, h: 420, font: 34, icon: 96, label: 12 },
};

export default function ChestCard({
  card,
  size      = 'lg',
  hover     = true,
  showDetail = false,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const dim = SIZES[size];

  /* ChestCard nghiêng sang PHẢI (+12deg) — ngược với ChanceCard */
  const transform = hovered && hover
    ? 'rotateY(0deg) rotateX(0deg)'
    : 'rotateY(12deg) rotateX(5deg)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

      {/* ── 3D card ───────────────────────────────────────── */}
      <div
        style={{ perspective: 1000, cursor: hover ? 'pointer' : 'default' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          width:         dim.w,
          height:        dim.h,
          transformStyle:'preserve-3d',
          transform,
          transition:    'transform 0.7s ease',
          /* card-thickness-right: shadow ke phải */
          boxShadow: [
            '1px 1px 0px #d4a017',
            '2px 2px 0px #d4a017',
            '3px 3px 0px #d4a017',
            '4px 4px 0px #d4a017',
            '10px 20px 40px rgba(0,0,0,0.8)',
          ].join(', '),
          background: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
          border:     '4px solid #d4a017',
          padding:    4,
          flexShrink: 0,
        }}>

          {/* Inner frame */}
          <div style={{
            width: '100%', height: '100%',
            border:   '2px solid rgba(246,190,57,0.3)',
            position: 'relative',
            overflow: 'hidden',
            display:  'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        `${dim.w * 0.12}px ${dim.w * 0.09}px`,
            boxSizing:      'border-box',
          }}>

            {/* Art-deco: inner rectangle outline */}
            <div style={{
              position: 'absolute', inset: 16,
              border:   '1px solid rgba(246,190,57,0.18)',
              pointerEvents: 'none',
            }} />

            {/* Art-deco: L-shaped corners (design uses individual lines) */}
            {/* top-left */}
            <div style={{ position:'absolute', top:8, left:8, width:40, height:1, background:'#f6be39' }} />
            <div style={{ position:'absolute', top:8, left:8, width:1, height:40, background:'#f6be39' }} />
            {/* bottom-right */}
            <div style={{ position:'absolute', bottom:8, right:8, width:40, height:1, background:'#f6be39' }} />
            <div style={{ position:'absolute', bottom:8, right:8, width:1, height:40, background:'#f6be39' }} />

            {/* Title */}
            <span style={{
              fontFamily:    "'Noto Serif', serif",
              fontSize:      dim.font,
              fontWeight:    700,
              fontStyle:     'italic',
              color:         '#f6be39',
              letterSpacing: -0.5,
              textShadow:    '0 0 8px rgba(246,190,57,0.4)',
              textAlign:     'center',
            }}>
              KHÍ VẬN
            </span>

            {/* Icon */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize:             dim.icon,
                  color:                'rgba(246,190,57,0.85)',
                  fontVariationSettings:"'FILL' 1",
                  filter:               'drop-shadow(0 0 15px rgba(246,190,57,0.6))',
                  lineHeight:           1,
                }}
              >
                inventory_2
              </span>
              {/* Rotated diamond decoration */}
              <div style={{
                position:  'absolute',
                inset:     -24,
                border:    '2px solid rgba(246,190,57,0.1)',
                transform: 'rotate(45deg)',
                opacity:   0.3,
                pointerEvents: 'none',
              }} />
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: 1, width: 40, background: 'rgba(246,190,57,0.4)', margin: '0 auto 10px' }} />
              <p style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                color:         '#cac6be',
                fontSize:      dim.label,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}>
                The Grand Casino Atelier
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail glass panel (right-aligned, mirrored) ──── */}
      {showDetail && card && (
        <div style={{
          width:          dim.w * 1.4,
          background:     'rgba(53,53,52,0.4)',
          backdropFilter: 'blur(12px)',
          borderRight:    '4px solid #f6be39',   /* right border — ngược với ChanceCard */
          padding:        '20px 20px',
          display:        'flex',
          flexDirection:  'column',
          gap:            12,
        }}>
          {/* Header — right-aligned */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, textAlign: 'right' }}>
            <span style={{ fontFamily: "'Noto Serif', serif", fontSize: 16, color: '#e5e2e1' }}>
              Phúc lợi hiện hữu
            </span>
            <span className="material-symbols-outlined" style={{ color: '#f6be39', fontVariationSettings: "'FILL' 1", fontSize: 20 }}>
              payments
            </span>
          </div>

          {/* Effect row — reversed */}
          <div style={{
            background:    '#0e0e0e',
            padding:       '12px 14px',
            display:       'flex',
            justifyContent:'space-between',
            alignItems:    'center',
            border:        '1px solid rgba(79,70,52,0.3)',
          }}>
            <span style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              color:         '#f6be39', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1, fontSize: 13,
            }}>
              {card.action === 'money' && card.amount !== undefined
                ? `${card.amount > 0 ? '+' : ''}${card.amount}₫`
                : card.text}
            </span>
            <span style={{ fontFamily: "'Work Sans', sans-serif", color: '#cac6be', fontSize: 13, textAlign: 'right' }}>
              {card.action === 'money' ? (card.amount && card.amount > 0 ? 'Phúc lợi cộng đồng' : 'Chi phí cộng đồng') :
               card.action === 'goto'  ? 'Di chuyển đặc biệt' : 'Vào tù'}
            </span>
          </div>

          {/* Flavour text — right-aligned */}
          <p style={{
            fontSize: 12, color: '#cac6be', fontStyle: 'italic', opacity: 0.8,
            fontFamily: "'Work Sans', sans-serif", lineHeight: 1.6, textAlign: 'right',
          }}>
            "{card.text}"
          </p>
        </div>
      )}
    </div>
  );
}
