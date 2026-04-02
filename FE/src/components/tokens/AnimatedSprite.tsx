/**
 * AnimatedSprite.tsx — Shared animation system
 *
 * ALL 4 characters use IDENTICAL keyframes (Tycoon-style):
 *   - IDLE: body breathes up/down 2px, 2s loop
 *   - WALK: body bob + leg-l/leg-r alternate swing, arm-l/arm-r counter-swing, 0.5s loop
 *
 * The shared CSS is injected once via a <style> tag mounted in the DOM.
 * Each character SVG uses the same class names:
 *   .sp-body   → animated by idle or walk keyframe
 *   .sp-leg-l  → left  leg pivot
 *   .sp-leg-r  → right leg pivot
 *   .sp-arm-l  → left  arm pivot
 *   .sp-arm-r  → right arm pivot
 *   .sp-acc    → accessory (hat brim bounce, guitar strum, gown sway, wrench bob)
 *
 * State classes applied to the root <svg>:
 *   .sp-idle  → plays idle animations
 *   .sp-walk  → plays walk animations
 */

import { useEffect, useRef } from 'react';
import React from 'react';
import type { TokenShape } from '../../types/game';

// ─── Inject shared CSS once ───────────────────────────────────────────────────
const SHARED_CSS = `
/* ── IDLE ─────────────────────────────────── */
@keyframes sp_idle_body {
  0%,100% { transform: translateY(0px)   }
  50%     { transform: translateY(-2px)  }
}
@keyframes sp_idle_acc {
  0%,100% { transform: translateY(0px)   }
  50%     { transform: translateY(-1px)  }
}

/* ── WALK ─────────────────────────────────── */
@keyframes sp_walk_body {
  0%,100% { transform: translateY(0px)  rotate(0deg)  }
  25%     { transform: translateY(-3px) rotate(-2deg) }
  75%     { transform: translateY(-3px) rotate(2deg)  }
}
@keyframes sp_walk_leg_l {
  0%,100% { transform: rotate(0deg)   }
  25%     { transform: rotate(26deg)  }
  75%     { transform: rotate(-22deg) }
}
@keyframes sp_walk_leg_r {
  0%,100% { transform: rotate(0deg)   }
  25%     { transform: rotate(-22deg) }
  75%     { transform: rotate(26deg)  }
}
@keyframes sp_walk_arm_l {
  0%,100% { transform: rotate(0deg)   }
  25%     { transform: rotate(-28deg) }
  75%     { transform: rotate(22deg)  }
}
@keyframes sp_walk_arm_r {
  0%,100% { transform: rotate(0deg)   }
  25%     { transform: rotate(22deg)  }
  75%     { transform: rotate(-28deg) }
}
@keyframes sp_walk_acc {
  0%,100% { transform: rotate(0deg) translateX(0px)   }
  25%     { transform: rotate(5deg) translateX(1px)   }
  75%     { transform: rotate(-4deg) translateX(-1px) }
}

/* ── BIND IDLE ────────────────────────────── */
.sp-idle .sp-body  { animation: sp_idle_body 2s ease-in-out infinite }
.sp-idle .sp-acc   { animation: sp_idle_acc  2s ease-in-out infinite 0.1s }

/* ── BIND WALK ────────────────────────────── */
.sp-walk .sp-body  { animation: sp_walk_body  0.5s linear infinite }
.sp-walk .sp-leg-l { animation: sp_walk_leg_l 0.5s linear infinite }
.sp-walk .sp-leg-r { animation: sp_walk_leg_r 0.5s linear infinite 0.25s }
.sp-walk .sp-arm-l { animation: sp_walk_arm_l 0.5s linear infinite }
.sp-walk .sp-arm-r { animation: sp_walk_arm_r 0.5s linear infinite 0.25s }
.sp-walk .sp-acc   { animation: sp_walk_acc   0.5s linear infinite }

/* pivot helpers — set on each limb group via inline style */
.sp-leg-l, .sp-leg-r, .sp-arm-l, .sp-arm-r, .sp-acc { transform-box: fill-box; }
`;

let cssInjected = false;
function injectSharedCSS() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.id = 'animated-sprite-shared';
  style.textContent = SHARED_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

// ─── Colour helpers ────────────────────────────────────────────────────────────
const adj = (hex: string, amt: number): string => {
  const n = parseInt(hex.replace('#',''), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amt);
  const g = clamp(((n >> 8) & 0xff) + amt);
  const b = clamp((n & 0xff) + amt);
  return `#${((r << 16)|(g << 8)|b).toString(16).padStart(6,'0')}`;
};
const dark = (c: string, a = 55) => adj(c, -a);
const lite = (c: string, a = 70) => adj(c,  a);

// ─── Shared geometry constants ────────────────────────────────────────────────
// All characters fit in a 32×48 viewBox.
// Pivot rows (used as transform-origin y for limbs):
//   Shoulders: y=22   Hips: y=34

const SKIN   = '#f5cba7';
const SHOE   = '#1a1a1a';

// ─── CHARACTER SHAPES ─────────────────────────────────────────────────────────
interface CharProps { color: string }

/** 🎩 TYCOON — top hat, monocle, cane */
function TycoonBody({ color }: CharProps) {
  const suit = color;
  const hi   = lite(color, 80);
  const lo   = dark(color, 55);
  const hat  = dark(color, 70);

  return (
    <>
      {/* ── TOP HAT (accessory — bobs separately) ── */}
      <g className="sp-acc" style={{ transformOrigin: '16px 8px' }}>
        <rect x="10" y="2"  width="12" height="9"  rx="1"   fill={hat} />
        <rect x="8"  y="10" width="16" height="3"  rx="1"   fill={lo}  />
        {/* band */}
        <rect x="10" y="9"  width="12" height="2"  fill={hi} opacity=".45" />
        {/* shine */}
        <rect x="11" y="3"  width="4"  height="7"  rx="1"   fill={hi} opacity=".22" />
      </g>

      {/* ── BODY GROUP (torso + head — bobs together) ── */}
      <g className="sp-body">
        {/* Head */}
        <rect x="11" y="13" width="10" height="9" rx="3" fill={SKIN} />
        {/* Eyes */}
        <rect x="13" y="16" width="2"  height="2" rx=".5" fill="#333" />
        <rect x="17" y="16" width="2"  height="2" rx=".5" fill="#333" />
        {/* Monocle */}
        <circle cx="18.5" cy="17" r="2.5" fill="none" stroke={lo} strokeWidth=".8" />
        <line   x1="21" y1="19" x2="22" y2="21" stroke={lo} strokeWidth=".7" />
        {/* Moustache */}
        <rect x="13" y="20" width="6" height="1.5" rx=".7" fill={lo} />

        {/* Suit jacket */}
        <rect x="9" y="22" width="14" height="12" rx="2" fill={suit} />
        {/* Shirt + tie */}
        <rect x="14" y="22" width="4"  height="12" fill="white" opacity=".75" />
        <polygon points="16,24 14.5,29 16,31 17.5,29" fill={hi} />
        {/* Lapels */}
        <polygon points="9,22  14,26 14,22" fill={lo} />
        <polygon points="23,22 18,26 18,22" fill={lo} />
        {/* Pocket square */}
        <rect x="10" y="24" width="3" height="2" rx=".4" fill="white" opacity=".65" />
        {/* Buttons */}
        <circle cx="16" cy="32" r=".7" fill={hi} opacity=".8" />
        <circle cx="16" cy="30" r=".7" fill={hi} opacity=".8" />
      </g>

      {/* ── LEFT ARM (pivot at shoulder) ── */}
      <g className="sp-arm-l" style={{ transformOrigin: '11px 23px' }}>
        <rect x="5"  y="22" width="4" height="10" rx="2" fill={suit} />
        <rect x="5"  y="30" width="4" height="2"  rx="1" fill="white" opacity=".7" />
        <rect x="5.5" y="32" width="3" height="3"  rx="1.5" fill={SKIN} />
        {/* Cane */}
        <rect x="7"  y="33" width="1.5" height="13" rx=".75" fill={lo} />
        <rect x="5"  y="32" width="5"   height="1.5" rx=".75" fill={lo} />
      </g>

      {/* ── RIGHT ARM ── */}
      <g className="sp-arm-r" style={{ transformOrigin: '21px 23px' }}>
        <rect x="23" y="22" width="4" height="10" rx="2" fill={suit} />
        <rect x="23" y="30" width="4" height="2"  rx="1" fill="white" opacity=".7" />
        <rect x="23.5" y="32" width="3" height="3" rx="1.5" fill={SKIN} />
      </g>

      {/* ── LEFT LEG (pivot at hip) ── */}
      <g className="sp-leg-l" style={{ transformOrigin: '13px 34px' }}>
        <rect x="10" y="34" width="5" height="11" rx="2" fill={lo} />
        <rect x="9"  y="43" width="7" height="3"  rx="1.5" fill={SHOE} />
      </g>

      {/* ── RIGHT LEG ── */}
      <g className="sp-leg-r" style={{ transformOrigin: '19px 34px' }}>
        <rect x="17" y="34" width="5" height="11" rx="2" fill={lo} />
        <rect x="16" y="43" width="7" height="3"  rx="1.5" fill={SHOE} />
      </g>
    </>
  );
}

/** 🚂 ENGINEER — overalls, cap, wrench */
function EngineerBody({ color }: CharProps) {
  const denim = color;
  const lo    = dark(color, 60);
  const hi    = lite(color, 80);

  return (
    <>
      {/* Cap + acc */}
      <g className="sp-acc" style={{ transformOrigin: '16px 8px' }}>
        <rect x="10" y="4"  width="12" height="8"  rx="2" fill={lo}    />
        <rect x="8"  y="11" width="16" height="3"  rx="1" fill={dark(color,75)} />
        <rect x="8"  y="13" width="9"  height="2"  rx="1" fill={dark(color,75)} />
        <rect x="12" y="5"  width="8"  height="5"  rx=".5" fill={hi} opacity=".45" />
      </g>

      <g className="sp-body">
        <rect x="11" y="15" width="10" height="9" rx="3" fill={SKIN} />
        <rect x="13" y="18" width="2"  height="2" rx=".5" fill="#333" />
        <rect x="17" y="18" width="2"  height="2" rx=".5" fill="#333" />
        <path d="M13 23 Q16 25.5 19 23" fill="none" stroke="#b04" strokeWidth="1" strokeLinecap="round" />
        {/* Overalls */}
        <rect x="9"  y="24" width="14" height="11" rx="2" fill={denim} />
        {/* Bib */}
        <rect x="12" y="24" width="8"  height="7"  rx="1" fill={lo} opacity=".4" />
        {/* Straps */}
        <rect x="12" y="24" width="2"  height="11" fill={lo} opacity=".45" />
        <rect x="18" y="24" width="2"  height="11" fill={lo} opacity=".45" />
        {/* Pocket */}
        <rect x="11" y="26" width="4"  height="3"  rx=".5" fill={lo} opacity=".4" />
        {/* Buttons */}
        <circle cx="12.5" cy="24.5" r=".8" fill={hi} />
        <circle cx="19.5" cy="24.5" r=".8" fill={hi} />
      </g>

      <g className="sp-arm-l" style={{ transformOrigin: '11px 25px' }}>
        <rect x="5"  y="24" width="4" height="9" rx="2" fill={denim} />
        <rect x="5"  y="31" width="4" height="2" rx="1" fill={hi} opacity=".4" />
        <rect x="5.5" y="33" width="3" height="3" rx="1.5" fill={SKIN} />
        {/* Wrench */}
        <rect x="7"  y="35" width="1.5" height="9"  rx=".75" fill="#aaa" />
        <rect x="5.5" y="34" width="4"  height="2"  rx="1"   fill="#aaa" />
        <rect x="5"  y="43" width="5"   height="2"  rx="1"   fill="#888" />
      </g>

      <g className="sp-arm-r" style={{ transformOrigin: '21px 25px' }}>
        <rect x="23" y="24" width="4" height="9" rx="2" fill={denim} />
        <rect x="23" y="31" width="4" height="2" rx="1" fill={hi} opacity=".4" />
        <rect x="23.5" y="33" width="3" height="3" rx="1.5" fill={SKIN} />
      </g>

      <g className="sp-leg-l" style={{ transformOrigin: '13px 35px' }}>
        <rect x="10" y="35" width="5" height="10" rx="2" fill={lo} />
        <rect x="9"  y="43" width="7" height="3"  rx="1.5" fill={SHOE} />
      </g>

      <g className="sp-leg-r" style={{ transformOrigin: '19px 35px' }}>
        <rect x="17" y="35" width="5" height="10" rx="2" fill={lo} />
        <rect x="16" y="43" width="7" height="3"  rx="1.5" fill={SHOE} />
      </g>
    </>
  );
}

/** 🎸 ROCKSTAR — wild hair, sunglasses, guitar on back */
function RockstarBody({ color }: CharProps) {
  const shirt = color;
  const lo    = dark(color, 55);
  const hi    = lite(color, 75);

  return (
    <>
      {/* Guitar on back (acc — sways with walk) */}
      <g className="sp-acc" style={{ transformOrigin: '23px 30px' }}>
        <ellipse cx="23" cy="32" rx="5"   ry="6"   fill={lo}    />
        <ellipse cx="23" cy="32" rx="4.5" ry="5.5" fill={shirt} />
        <rect    x="19"  y="26"  width="6" height="5" fill={lo}    />
        <rect    x="19.5" y="26.5" width="5" height="4" fill={shirt} />
        <ellipse cx="23" cy="22" rx="3.5" ry="3.5" fill={lo}    />
        <ellipse cx="23" cy="22" rx="3"   ry="3"   fill={shirt} />
        <circle  cx="23" cy="32" r="1.8"  fill={lo}    opacity=".7" />
        <rect    x="22"  y="8"   width="2" height="15" rx="1" fill={dark(color,80)} />
        <rect    x="21"  y="6"   width="4" height="4"  rx=".5" fill={dark(color,80)} />
        {[22.2,22.7,23.2,23.7].map((x,i) => (
          <line key={i} x1={x} y1="9" x2={x} y2="36" stroke="white" strokeWidth=".35" opacity=".4" />
        ))}
      </g>

      <g className="sp-body">
        {/* Wild hair */}
        <path d="M9 14 Q10 6 12 5 Q16 2 20 5 Q22 6 23 14" fill={lo} />
        <path d="M9 15 Q7 8 9 6 Q8 9 9 14"    fill={lo} />
        <path d="M23 14 Q25 8 23 6 Q24 9 23 14" fill={lo} />
        <path d="M12 7 Q15 4 20 6" fill="none" stroke={hi} strokeWidth="1.2" opacity=".35" strokeLinecap="round" />
        {/* Head */}
        <rect x="11" y="14" width="10" height="9" rx="3" fill={SKIN} />
        {/* Sunglasses */}
        <rect x="11.5" y="16" width="4"   height="3" rx="1" fill="#111" />
        <rect x="16.5" y="16" width="4"   height="3" rx="1" fill="#111" />
        <rect x="15.5" y="16.5" width="1" height="1.5" fill="#555" />
        <rect x="12"   y="16.5" width="1.5" height="1" rx=".3" fill="white" opacity=".25" />
        <rect x="17"   y="16.5" width="1.5" height="1" rx=".3" fill="white" opacity=".25" />
        {/* Smirk */}
        <path d="M14 22 Q17 24 18.5 21" fill="none" stroke="#a04" strokeWidth="1" strokeLinecap="round" />
        {/* T-shirt */}
        <rect x="9" y="23" width="14" height="11" rx="2" fill={shirt} />
        {/* Band logo */}
        <polygon points="16,25 17,27.5 19.5,27.5 17.5,29 18.3,31.5 16,30 13.7,31.5 14.5,29 12.5,27.5 15,27.5"
          fill={hi} opacity=".5" />
      </g>

      <g className="sp-arm-l" style={{ transformOrigin: '11px 24px' }}>
        <rect x="5"  y="23" width="4" height="9" rx="2" fill={shirt} />
        <rect x="5.5" y="32" width="3" height="3" rx="1.5" fill={SKIN} />
        {/* Guitar pick */}
        <polygon points="7,33 9.5,34.5 8.5,37" fill={hi} opacity=".9" />
      </g>

      <g className="sp-arm-r" style={{ transformOrigin: '21px 24px' }}>
        <rect x="23" y="23" width="4" height="9" rx="2" fill={shirt} />
        <rect x="23.5" y="32" width="3" height="3" rx="1.5" fill={SKIN} />
      </g>

      <g className="sp-leg-l" style={{ transformOrigin: '13px 34px' }}>
        <rect x="10" y="34" width="5" height="11" rx="2" fill={lo} />
        {/* rip */}
        <rect x="11" y="37" width="3" height="1" rx=".5" fill={hi} opacity=".35" />
        <rect x="9"  y="43" width="7" height="3"  rx="1.5" fill={SHOE} />
      </g>

      <g className="sp-leg-r" style={{ transformOrigin: '19px 34px' }}>
        <rect x="17" y="34" width="5" height="11" rx="2" fill={lo} />
        <rect x="16" y="43" width="7" height="3"  rx="1.5" fill={SHOE} />
      </g>
    </>
  );
}

/** 👑 EMPRESS — crown, gown, sceptre */
function EmpressBody({ color }: CharProps) {
  const gown = color;
  const lo   = dark(color, 55);
  const hi   = lite(color, 85);
  const gem  = '#ff3366';

  return (
    <>
      {/* Crown (acc — floats with idle) */}
      <g className="sp-acc" style={{ transformOrigin: '16px 8px' }}>
        <polygon points="10,13 12,5 16,10 20,5 22,13" fill={lo}   />
        <polygon points="11,13 13,7 16,10.5 19,7 21,13" fill={gown} />
        <circle cx="12" cy="6.5" r="1.5" fill={gem} />
        <circle cx="16" cy="10.5" r="1.5" fill={gem} />
        <circle cx="20" cy="6.5" r="1.5" fill={gem} />
        <rect x="10" y="12" width="12" height="3" rx=".5" fill={lo}  />
        <rect x="11" y="12.5" width="10" height="2" fill={hi} opacity=".35" />
      </g>

      {/* Gown skirt — wide, sways with sp-acc's walk */}
      <g className="sp-acc" style={{ transformOrigin: '16px 42px' }}>
        <path d="M9 30 Q5 38 4 47 L28 47 Q27 38 23 30 Z" fill={lo}   />
        <path d="M10 30 Q6 38 5 47 L27 47 Q26 38 22 30 Z" fill={gown} />
        {/* shimmer lines */}
        {[8,12,16,20,24].map((x,i)=>(
          <line key={i} x1={x} y1="33" x2={x-1} y2="47" stroke={hi} strokeWidth=".5" opacity=".2" />
        ))}
        <path d="M5 47 Q16 43 27 47" fill="none" stroke={hi} strokeWidth="1.2" opacity=".4" />
      </g>

      <g className="sp-body">
        {/* Hair */}
        <path d="M10 15 Q8 18 10 23" fill={lo} />
        <path d="M22 15 Q24 18 22 23" fill={lo} />
        {/* Head */}
        <rect x="11" y="15" width="10" height="9" rx="3" fill={SKIN} />
        {/* Eyes + lashes */}
        <rect x="12.5" y="18" width="3" height="2" rx=".7" fill="#333" />
        <rect x="16.5" y="18" width="3" height="2" rx=".7" fill="#333" />
        <line x1="12.5" y1="18" x2="11.5" y2="17" stroke="#333" strokeWidth=".7" />
        <line x1="14"   y1="18" x2="14"   y2="16.5" stroke="#333" strokeWidth=".7" />
        <line x1="19.5" y1="18" x2="20.5" y2="17" stroke="#333" strokeWidth=".7" />
        {/* Lips + blush */}
        <path d="M13.5 23 Q16 24.5 18.5 23" fill={gem} opacity=".65" />
        <ellipse cx="13" cy="22" rx="1.5" ry="1" fill={gem} opacity=".18" />
        <ellipse cx="19" cy="22" rx="1.5" ry="1" fill={gem} opacity=".18" />
        {/* Bodice */}
        <rect x="11" y="24" width="10" height="7" rx="2" fill={gown} />
        <rect x="15" y="24" width="2"  height="7" fill={hi}   opacity=".28" />
        <rect x="11" y="27" width="10" height="1" fill={lo}   opacity=".28" />
        {/* Necklace */}
        <path d="M12 25 Q16 28 20 25" fill="none" stroke={hi} strokeWidth=".9" />
        <circle cx="16" cy="27" r="1.2" fill={gem} />
      </g>

      {/* Sceptre arm */}
      <g className="sp-arm-l" style={{ transformOrigin: '11px 25px' }}>
        <rect x="6"  y="24" width="4" height="8" rx="2" fill={gown} />
        <rect x="6.5" y="32" width="3" height="3" rx="1.5" fill={SKIN} />
        {/* Sceptre */}
        <rect x="8"  y="34" width="1.5" height="11" rx=".75" fill={lo}  />
        <circle cx="8.75" cy="34" r="2.2" fill={gown} />
        <circle cx="8.75" cy="34" r="1.1" fill={gem}  />
      </g>

      <g className="sp-arm-r" style={{ transformOrigin: '21px 25px' }}>
        <rect x="22" y="24" width="4" height="8" rx="2" fill={gown} />
        <rect x="22.5" y="32" width="3" height="3" rx="1.5" fill={SKIN} />
      </g>

      {/* No visible legs — covered by gown */}
      <g className="sp-leg-l" style={{ transformOrigin: '13px 35px' }}>
        <rect x="11" y="35" width="4" height="9" rx="2" fill={lo} opacity=".4" />
      </g>
      <g className="sp-leg-r" style={{ transformOrigin: '19px 35px' }}>
        <rect x="17" y="35" width="4" height="9" rx="2" fill={lo} opacity=".4" />
      </g>
    </>
  );
}

// ─── Registry ─────────────────────────────────────────────────────────────────
const BODIES: Record<TokenShape, (p: CharProps) => React.ReactElement> = {
  hat:    TycoonBody,
  car:    EngineerBody,
  guitar: RockstarBody,
  crown:  EmpressBody,
};

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  shape:   TokenShape;
  color:   string;
  state?:  'idle' | 'walk';
  size?:   number;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedSprite({
  shape,
  color,
  state  = 'idle',
  size   = 48,
  className,
  style,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);

  // Inject shared CSS on first render
  useEffect(() => { injectSharedCSS(); }, []);

  const Body = BODIES[shape];

  return (
    <svg
      ref={ref}
      viewBox="0 0 32 48"
      width={Math.round(size * 0.667)}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={[state === 'walk' ? 'sp-walk' : 'sp-idle', className].filter(Boolean).join(' ')}
      style={{ overflow: 'visible', ...style }}
    >
      {/* Ground shadow */}
      <ellipse cx="16" cy="46.5" rx="9" ry="1.8" fill="rgba(0,0,0,0.28)" />
      <Body color={color} />
    </svg>
  );
}

export type { TokenShape };
