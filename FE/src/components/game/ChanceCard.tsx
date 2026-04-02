/**
 * ChanceCard.tsx — Thẻ Cơ Hội
 * Converted từ HTML design: 3D rotated card với art-deco frame
 * màu gradient xanh đậm (#2c3e50 → #34495e), nghiêng rotateY(-12deg)
 *
 * Props:
 *   card?    — GameCard hiện tại (optional, hiện detail bên dưới)
 *   size?    — 'sm' | 'md' | 'lg' (default: 'md')
 *   hover?   — true → unfold về thẳng khi hover (default: true)
 */

import { useState } from 'react';
import type { GameCard } from '../../types/game';

interface Props {
  card?:  GameCard;
  size?:  'sm' | 'md' | 'lg';
  hover?: boolean;
  /** Hiện phần detail glass-panel bên dưới card */
  showDetail?: boolean;
}

const SIZES = {
  sm: { w: 160, h: 230, font: 18, icon: 48, label: 8  },
  md: { w: 216, h: 315, font: 26, icon: 72, label: 10 },
  lg: { w: 288, h: 420, font: 34, icon: 96, label: 12 },
};

export default function ChanceCard({
  card,
  size      = 'lg',
  hover     = true,
  showDetail = false,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const dim = SIZES[size];

  const transform = hovered && hover
    ? 'rotateY(0deg) rotateX(0deg)'
    : 'rotateY(-12deg) rotateX(5deg)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

      {/* ── 3D card container ─────────────────────────────── */}
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
          /* card-thickness: stepped offset shadow mimicking physical depth */
          boxShadow: [
            '-1px 1px 0px #d4a017',
            '-2px 2px 0px #d4a017',
            '-3px 3px 0px #d4a017',
            '-4px 4px 0px #d4a017',
            '-10px 20px 40px rgba(0,0,0,0.8)',
          ].join(', '),
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
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

            {/* Art-deco corners */}
            {['top-left','top-right','bottom-left','bottom-right'].map(pos => (
              <div key={pos} style={{
                position: 'absolute',
                top:    pos.includes('top')    ? 8 : undefined,
                bottom: pos.includes('bottom') ? 8 : undefined,
                left:   pos.includes('left')   ? 8 : undefined,
                right:  pos.includes('right')  ? 8 : undefined,
                width:  28, height: 28,
                borderTop:    pos.includes('top')    ? '2px solid #f6be39' : undefined,
                borderBottom: pos.includes('bottom') ? '2px solid #f6be39' : undefined,
                borderLeft:   pos.includes('left')   ? '2px solid #f6be39' : undefined,
                borderRight:  pos.includes('right')  ? '2px solid #f6be39' : undefined,
              }} />
            ))}

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
              CƠ HỘI
            </span>

            {/* Icon */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize:          dim.icon,
                  color:             'rgba(246,190,57,0.85)',
                  fontVariationSettings: "'FILL' 1",
                  filter:            'drop-shadow(0 0 15px rgba(246,190,57,0.6))',
                  lineHeight:        1,
                }}
              >
                help
              </span>
              {/* Decorative ring */}
              <div style={{
                position: 'absolute',
                inset:    -16,
                border:   '1px solid rgba(246,190,57,0.18)',
                borderRadius: '50%',
                transform: 'scale(1.5)',
                opacity:  0.2,
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

      {/* ── Detail glass panel ────────────────────────────── */}
      {showDetail && card && (
        <div style={{
          width:          dim.w * 1.4,
          background:     'rgba(53,53,52,0.4)',
          backdropFilter: 'blur(12px)',
          borderLeft:     '4px solid #f6be39',
          padding:        '20px 20px',
          display:        'flex',
          flexDirection:  'column',
          gap:            12,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ color: '#f6be39', fontVariationSettings: "'FILL' 1", fontSize: 20 }}>
              confirmation_number
            </span>
            <span style={{ fontFamily: "'Noto Serif', serif", fontSize: 16, color: '#e5e2e1' }}>
              Hiệu ứng lá bài
            </span>
          </div>

          {/* Effect row */}
          <div style={{
            background:   '#0e0e0e',
            padding:      '12px 14px',
            display:      'flex',
            justifyContent:'space-between',
            alignItems:   'center',
            border:       '1px solid rgba(79,70,52,0.3)',
          }}>
            <span style={{ fontFamily: "'Work Sans', sans-serif", color: '#cac6be', fontSize: 13 }}>
              {card.action === 'money' ? (card.amount && card.amount > 0 ? 'Thưởng tiền' : 'Phạt tiền') :
               card.action === 'goto'  ? 'Di chuyển đến'  : 'Vào tù'}
            </span>
            <span style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              color:         '#f6be39', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1, fontSize: 13,
            }}>
              {card.action === 'money' && card.amount !== undefined
                ? `${card.amount > 0 ? '+' : ''}${card.amount}₫`
                : card.text}
            </span>
          </div>

          {/* Flavour text */}
          <p style={{
            fontSize: 12, color: '#cac6be', fontStyle: 'italic', opacity: 0.8,
            fontFamily: "'Work Sans', sans-serif", lineHeight: 1.6,
          }}>
            "{card.text}"
          </p>
        </div>
      )}
    </div>
  );
}
