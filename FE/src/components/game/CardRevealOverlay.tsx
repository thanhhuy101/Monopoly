import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import type { GameStore } from '../../store/gameStore';
import CardDetail from './CardDetail';

/* ── Shared sizes ─────────────────────────────────────────── */
const W = 240;
const H = 350;

/* ── Card face (no card text — just visual) ───────────────── */
function CardFace({ type }: { type: 'chance' | 'chest' }) {
  const isChance = type === 'chance';
  const bg = isChance
    ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
    : 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)';
  const title = isChance ? 'CƠ HỘI' : 'KHÍ VẬN';
  const icon  = isChance ? 'help' : 'inventory_2';

  return (
    <div style={{
      width: W, height: H,
      background: bg,
      border: '4px solid #d4a017',
      padding: 4,
      boxShadow: [
        `${isChance ? '-' : ''}4px 4px 0px #d4a017`,
        '0 20px 60px rgba(0,0,0,0.8)',
        '0 0 80px rgba(212,160,23,0.2)',
      ].join(', '),
    }}>
      <div style={{
        width: '100%', height: '100%',
        border: '2px solid rgba(246,190,57,0.3)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '28px 20px', boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Corner accents */}
        {['top-left','top-right','bottom-left','bottom-right'].map(pos => (
          <div key={pos} style={{
            position: 'absolute',
            top:    pos.includes('top')    ? 8 : undefined,
            bottom: pos.includes('bottom') ? 8 : undefined,
            left:   pos.includes('left')   ? 8 : undefined,
            right:  pos.includes('right')  ? 8 : undefined,
            width: 28, height: 28,
            borderTop:    pos.includes('top')    ? '2px solid #f6be39' : undefined,
            borderBottom: pos.includes('bottom') ? '2px solid #f6be39' : undefined,
            borderLeft:   pos.includes('left')   ? '2px solid #f6be39' : undefined,
            borderRight:  pos.includes('right')  ? '2px solid #f6be39' : undefined,
          }} />
        ))}

        {/* Title */}
        <span style={{
          fontFamily: "'Noto Serif', serif",
          fontSize: 28, fontWeight: 700, fontStyle: 'italic',
          color: '#f6be39', letterSpacing: -0.5,
          textShadow: '0 0 12px rgba(246,190,57,0.5)',
        }}>
          {title}
        </span>

        {/* Icon */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{
            fontSize: 80, color: 'rgba(246,190,57,0.85)',
            fontVariationSettings: "'FILL' 1",
            filter: 'drop-shadow(0 0 20px rgba(246,190,57,0.6))',
          }}>
            {icon}
          </span>
          <div style={{
            position: 'absolute', inset: -20,
            border: '1px solid rgba(246,190,57,0.18)',
            borderRadius: isChance ? '50%' : 0,
            transform: isChance ? 'scale(1.5)' : 'rotate(45deg)',
            opacity: 0.25,
          }} />
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ height: 1, width: 50, background: 'rgba(246,190,57,0.4)', margin: '0 auto 12px' }} />
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            color: '#cac6be', fontSize: 10,
            letterSpacing: 3, textTransform: 'uppercase',
          }}>
            The Grand Casino Atelier
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Card back ────────────────────────────────────────────── */
function CardBack() {
  return (
    <div style={{
      width: W, height: H,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      border: '4px solid #d4a017',
      padding: 4,
      boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 80px rgba(212,160,23,0.2)',
    }}>
      <div style={{
        width: '100%', height: '100%',
        border: '2px solid rgba(246,190,57,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `repeating-linear-gradient(
          45deg, transparent, transparent 10px,
          rgba(246,190,57,0.04) 10px, rgba(246,190,57,0.04) 20px
        )`,
      }}>
        <span className="material-symbols-outlined" style={{
          fontSize: 64, color: 'rgba(246,190,57,0.3)',
          fontVariationSettings: "'FILL' 1",
        }}>
          casino
        </span>
      </div>
    </div>
  );
}

/* ── Inner content: manages reveal → detail transition ────── */
function RevealContent({ reveal }: { reveal: NonNullable<GameStore['cardReveal']> }) {
  const dismiss = useGameStore((s: GameStore) => s.dismissCardReveal);
  const [phase, setPhase] = useState<'card' | 'detail'>('card');
  const [hovered, setHovered] = useState(false);

  if (phase === 'detail') {
    return (
      <CardDetail
        card={reveal.card}
        type={reveal.type}
        onConfirm={dismiss}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 250,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
        backdropFilter: 'blur(6px)',
        perspective: 1200,
      }}
    >
      {/* Card with 3D flip */}
      <motion.div
        initial={{ rotateY: 180, scale: 0.6, opacity: 0 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
        transition={{
          rotateY: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          scale:   { duration: 0.6, ease: 'easeOut' },
          opacity: { duration: 0.4 },
        }}
        style={{
          transformStyle: 'preserve-3d',
          position: 'relative',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setPhase('detail')}
      >
        {/* Front face */}
        <div style={{ backfaceVisibility: 'hidden', position: 'relative' }}>
          <CardFace type={reveal.type} />

          {/* Hover overlay: "RÚT THẺ" */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.55)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span className="material-symbols-outlined" style={{
                  fontSize: 40, color: '#f6be39',
                  fontVariationSettings: "'FILL' 1",
                  filter: 'drop-shadow(0 0 12px rgba(246,190,57,0.6))',
                }}>
                  style
                </span>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 18, fontWeight: 700,
                  color: '#f6be39', letterSpacing: 4,
                  textTransform: 'uppercase',
                  textShadow: '0 0 10px rgba(246,190,57,0.5)',
                }}>
                  RÚT THẺ
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back face */}
        <div style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          position: 'absolute', top: 0, left: 0,
        }}>
          <CardBack />
        </div>
      </motion.div>

      {/* Glow ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          position: 'absolute',
          width: W + 120, height: H + 120,
          borderRadius: '50%',
          background: reveal.type === 'chance'
            ? 'radial-gradient(ellipse, rgba(44,62,80,0.3) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(192,57,43,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* Shimmer particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, x: (i - 2.5) * 40 }}
          animate={{ opacity: [0, 1, 0], y: [20, -60 - i * 15], x: (i - 2.5) * 50 }}
          transition={{ duration: 1.8, delay: 0.6 + i * 0.12, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 4, height: 4, borderRadius: '50%',
            background: '#f6be39',
            boxShadow: '0 0 8px rgba(246,190,57,0.8)',
            pointerEvents: 'none',
          }}
        />
      ))}
    </motion.div>
  );
}

/* ── Main overlay ─────────────────────────────────────────── */
export default function CardRevealOverlay() {
  const reveal = useGameStore((s: GameStore) => s.cardReveal);

  return (
    <AnimatePresence>
      {reveal && <RevealContent key="card-reveal" reveal={reveal} />}
    </AnimatePresence>
  );
}
