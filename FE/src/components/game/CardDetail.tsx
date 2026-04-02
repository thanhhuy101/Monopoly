/**
 * CardDetail.tsx — Full-screen Detail Card Modal
 *
 * Convert từ HTML design: modal overlay với gold-frame card, art-deco corners,
 * embossed icon, nội dung thẻ bài, 2 action buttons.
 *
 * Props:
 *   card       — GameCard cần hiển thị
 *   type       — 'chance' | 'chest'  (quyết định màu, icon, tiêu đề)
 *   onConfirm  — callback khi bấm XÁC NHẬN
 *   onSave?    — callback khi bấm LƯU LẠI (optional)
 *   onClose?   — callback click backdrop để đóng
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { GameCard } from '../../types/game';
import { SPACES } from '../../data/gameData';

// ── helpers ───────────────────────────────────────────────────────────────────

/** Tên ô từ target id */
function spaceName(id?: number) {
  if (id === undefined) return '';
  return SPACES[id]?.name ?? `Ô ${id}`;
}

/** Build description text từ card data */
function buildDescription(card: GameCard): { main: string; sub?: string } {
  switch (card.action) {
    case 'money':
      return card.amount && card.amount > 0
        ? { main: `Chúc mừng! Bạn nhận được `, sub: `Số tiền thưởng được cộng ngay vào tài khoản.` }
        : { main: `Ồ không! Bạn mất `,         sub: `Số tiền bị trừ khỏi tài khoản ngay lập tức.` };
    case 'goto':
      return {
        main: `Chuyến du ngoạn bất ngờ! Di chuyển đến `,
        sub:  card.collect ? 'Nếu đi qua ô Bắt đầu, nhận 200₫.' : 'Di chuyển trực tiếp đến ô đích.',
      };
    case 'jail':
      return {
        main: 'Vào tù ngay lập tức!',
        sub:  'Không thu tiền qua ô Bắt đầu. Không dùng thẻ miễn.',
      };
    default:
      return { main: card.text };
  }
}

/** Highlight amount / destination trong text */
function DescText({ card }: { card: GameCard }) {
  const { main } = buildDescription(card);

  if (card.action === 'money' && card.amount !== undefined) {
    return (
      <span>
        {main}
        <span style={{ color: '#f6be39', fontWeight: 700 }}>
          {card.amount > 0 ? '+' : ''}{card.amount}₫
        </span>
        .
      </span>
    );
  }
  if (card.action === 'goto') {
    return (
      <span>
        {main}
        <span style={{ color: '#f6be39', fontWeight: 700 }}>
          {spaceName(card.target)}
        </span>{' '}ngay lập tức.
      </span>
    );
  }
  return <span>{main}</span>;
}

// ── Card type configs ─────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  chance: {
    title:   'Thẻ Cơ Hội',
    icon:    'help',
    tagline: 'Vận may đang mỉm cười với bạn',
    bgOuter: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    bgInner: '#1e2b38',
  },
  chest: {
    title:   'Thẻ Khí Vận',
    icon:    'inventory_2',
    tagline: 'Phúc lợi cộng đồng đến với bạn',
    bgOuter: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
    bgInner: '#7a2218',
  },
} as const;

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  card:       GameCard;
  type:       'chance' | 'chest';
  onConfirm:  () => void;
  onSave?:    () => void;
  onClose?:   () => void;
}

export default function CardDetail({ card, type, onConfirm, onSave, onClose }: Props) {
  const cfg = TYPE_CONFIG[type];
  const desc = buildDescription(card);

  return (
    <AnimatePresence>
      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position:       'fixed', inset: 0, zIndex: 1000,
          background:     'rgba(14,14,14,0.92)',
          backdropFilter: 'blur(10px)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        16,
        }}
      >
        {/* ── Central card container ───────────────────────────── */}
        <motion.div
          key="card"
          initial={{ scale: 0.88, opacity: 0, y: 32 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{    scale: 0.9,  opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          onClick={e => e.stopPropagation()}
          style={{
            position:     'relative',
            width:        '100%',
            maxWidth:     440,
            aspectRatio:  '3/4',
            padding:      4,
          }}
        >
          {/* Gold frame */}
          <div style={{
            width:      '100%',
            height:     '100%',
            border:     '4px solid #d4a017',
            padding:    8,
            boxShadow:  '0 0 60px rgba(212,160,23,0.3)',
            background: cfg.bgOuter,
            position:   'relative',
            overflow:   'hidden',
            display:    'flex',
            flexDirection: 'column',
          }}>

            {/* Art-deco corners */}
            {[
              { top: 0,         left:  0,        borderTop: '4px solid #f6be39', borderLeft:  '4px solid #f6be39' },
              { top: 0,         right: 0,        borderTop: '4px solid #f6be39', borderRight: '4px solid #f6be39' },
              { bottom: 0,      left:  0,        borderBottom: '4px solid #f6be39', borderLeft: '4px solid #f6be39' },
              { bottom: 0,      right: 0,        borderBottom: '4px solid #f6be39', borderRight:'4px solid #f6be39' },
            ].map((s, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: 48, height: 48,
                zIndex: 10,
                ...s,
              }} />
            ))}

            {/* Inner card canvas */}
            <div style={{
              flex:          1,
              background:    cfg.bgInner,
              boxShadow:     'inset 0 0 40px rgba(0,0,0,0.8)',
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              justifyContent:'space-between',
              padding:       '32px 28px',
              position:      'relative',
              overflow:      'hidden',
            }}>

              {/* Background art-deco flourish (subtle) */}
              <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                opacity:  0.06, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(45deg, #f6be39 0px, transparent 1px, transparent 20px, #f6be39 21px)',
                backgroundSize: '28px 28px',
              }} />

              {/* ── Header ───────────────────────────────────────── */}
              <div style={{ width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <h2 style={{
                  fontFamily:    "'Noto Serif', serif",
                  fontStyle:     'italic',
                  color:         '#f6be39',
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  fontSize:      18,
                  fontWeight:    700,
                  textShadow:    '0 0 8px rgba(246,190,57,0.4)',
                  marginBottom:  10,
                }}>
                  {cfg.title}
                </h2>
                <div style={{ height: 1, width: 96, background: 'rgba(212,160,23,0.5)', margin: '0 auto' }} />
              </div>

              {/* ── Icon area ─────────────────────────────────────── */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                {/* Diamond frame rotated 45° */}
                <div style={{
                  width: 100, height: 100,
                  border:    '2px solid #d4a017',
                  transform: 'rotate(45deg)',
                  display:   'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  flexShrink: 0,
                }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize:             72,
                      color:                '#f6be39',
                      fontVariationSettings:"'FILL' 1",
                      transform:            'rotate(-45deg)',
                      filter:               'drop-shadow(0 0 12px rgba(246,190,57,0.5))',
                      lineHeight:           1,
                    }}
                  >
                    {cfg.icon}
                  </span>
                </div>

                {/* Floating decoration badge */}
                <div style={{
                  position: 'absolute', top: -14, right: -14,
                  width: 40, height: 40,
                  border:    '1px solid rgba(246,190,57,0.3)',
                  transform: 'rotate(12deg)',
                  display:   'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{
                    fontSize: 20, color: 'rgba(246,190,57,0.4)',
                    transform: 'rotate(-12deg)', lineHeight: 1,
                  }}>monetization_on</span>
                </div>
              </div>

              {/* ── Card text content ─────────────────────────────── */}
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, padding: '0 4px' }}>
                {/* Main description */}
                <p style={{
                  fontFamily: "'Noto Serif', serif",
                  fontSize:   20, fontWeight: 700,
                  color:      '#e5e2e1',
                  lineHeight: 1.5, letterSpacing: -0.2,
                }}>
                  <DescText card={card} />
                </p>

                {/* Sub text */}
                {desc.sub && (
                  <p style={{
                    fontFamily: "'Work Sans', sans-serif",
                    fontSize:   14, fontStyle: 'italic',
                    color:      '#cac6be', lineHeight: 1.5,
                  }}>
                    {desc.sub}
                  </p>
                )}

                {/* Flavour tagline */}
                <div style={{ paddingTop: 12 }}>
                  <span style={{
                    fontFamily:    "'Barlow Condensed', sans-serif",
                    color:         'rgba(246,190,57,0.55)',
                    letterSpacing: 4,
                    fontSize:      10,
                    textTransform: 'uppercase',
                  }}>
                    {cfg.tagline}
                  </span>
                </div>
              </div>

              {/* ── Action buttons ────────────────────────────────── */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, position: 'relative', zIndex: 1 }}>
                {/* Confirm */}
                <motion.button
                  onClick={onConfirm}
                  whileHover={{ filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    width:      '100%',
                    padding:    '14px 24px',
                    background: 'linear-gradient(135deg, #f6be39 0%, #d4a017 100%)',
                    color:      '#261a00',
                    border:     'none',
                    cursor:     'pointer',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize:   16,
                    letterSpacing: 5,
                    textTransform: 'uppercase',
                  }}
                >
                  XÁC NHẬN
                </motion.button>

                {/* Save (optional) */}
                {onSave && (
                  <motion.button
                    onClick={onSave}
                    whileHover={{ background: 'rgba(212,160,23,0.12)' }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      width:      '100%',
                      padding:    '11px 24px',
                      background: 'transparent',
                      color:      '#f6be39',
                      border:     '2px solid #d4a017',
                      cursor:     'pointer',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize:   12,
                      letterSpacing: 4,
                      textTransform: 'uppercase',
                      transition: 'background .2s',
                    }}
                  >
                    LƯU LẠI
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
