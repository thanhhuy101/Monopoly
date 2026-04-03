/**
 * Board3D.tsx — React Three Fiber + local .glb model
 *
 * Model: "Monopoly" by Yanez Designs (CC-BY)
 * Rendered locally via Three.js — full control over meshes, camera, lighting.
 *
 * Architecture:
 *   ┌─────────────────────────────────┐
 *   │  <Canvas> R3F                   │
 *   │  ┌───────────────────────────┐  │
 *   │  │  .glb model               │  │
 *   │  │  + <Html> token overlays  │  │
 *   │  └───────────────────────────┘  │
 *   └─────────────────────────────────┘
 *   BoardCenter overlay (absolute HTML)
 */

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import AnimatedSprite from './tokens/AnimatedSprite';
import modelUrl from '../models/monopoly.glb?url';

// ─── Meshes to hide (add names here after inspecting model) ─────────────────
const HIDDEN_MESHES: string[] = [
  // Money
  'One_Dollar_04_-_Default_0', 'One_Dollar_05_-_Default_0',
  'Fivw_Dollar_06_-_Default_0', 'Fivw_Dollar_10_-_Default_0',
  'Ten_Dollar_11_-_Default_0', 'Ten_Dollar_12_-_Default_0',
  'Twenty_Dollar_16_-_Default_0', 'Twenty_Dollar_17_-_Default_0',
  'Fiffy_Dollar_18_-_Default_0', 'Fiffy_Dollar_22_-_Default_0',
  'One_Hundred_Dollar_23_-_Default_0', 'One_Hundred_Dollar_24_-_Default_0',
  'Five_Hundred_Dollar_20_-_Default_0', 'Five_Hundred_Dollar_21_-_Default_0',
  // Cards
  'Community_Chest_15_-_Default_0',
  'Chance_14_-_Default_0', 'Chance_13_-_Default_0',
  // Dice
  'Dice_05_-_Default_0', 'Dice_02_-_Default_0',
  'Dice001_05_-_Default_0', 'Dice001_02_-_Default_0',
  // Game pieces
  'House_07_-_Default_0', 'Hotel_08_-_Default_0',
  'Iron_09_-_Default_0', 'Top_Hat_09_-_Default_0',
  'Wheel_Barrow_09_-_Default_0', 'Thimble_09_-_Default_0',
  // Boxes
  'Box001_14_-_Default_0', 'Box001_03_-_Default_0',
];

// ─── Compute 40 cell positions from board dimensions ────────────────────────
// Layout space IDs:
//   Bottom (row): 0(GO)  1   2   3   4   5   6   7   8   9  10(JAIL)
//   Left   (col): 11  12  13  14  15  16  17  18  19
//   Top    (row): 20  21  22  23  24  25  26  27  28  29  30(GOTOJAIL)
//   Right  (col): 31  32  33  34  35  36  37  38  39
function computeCellPositions(bx: number, bz: number): [number, number, number][] {
  // Monopoly board proportions: corner cells are ~2× wider than regular cells
  // Each edge: 2 corners (2×) + 9 regular = 13 regular cell-widths
  const cwX = bx / 13;                    // regular cell width (x)
  const cwZ = bz / 13;                    // regular cell width (z)
  const cx = bx / 2 - cwX;               // corner center = half_board - corner_half
  const cz = bz / 2 - cwZ;
  const ex = cwX + cwX / 2;              // corner→first cell = corner_half + cell_half = 1.5×cw
  const ez = cwZ + cwZ / 2;
  const y = 0.08;

  return [
    // ── Bottom row (0–10) ── z = +cz, x from +cx to -cx
    [cx, y, cz],
    ...Array.from({ length: 9 }, (_, i): [number, number, number] =>
      [cx - ex - i * cwX, y, cz]),
    [-cx, y, cz],

    // ── Left col (11–19) ── x = -cx, z from +cz to -cz
    ...Array.from({ length: 9 }, (_, i): [number, number, number] =>
      [-cx, y, cz - ez - i * cwZ]),

    // ── Top row (20–30) ── z = -cz, x from -cx to +cx
    [-cx, y, -cz],
    ...Array.from({ length: 9 }, (_, i): [number, number, number] =>
      [-cx + ex + i * cwX, y, -cz]),
    [cx, y, -cz],

    // ── Right col (31–39) ── x = +cx, z from -cz to +cz
    ...Array.from({ length: 9 }, (_, i): [number, number, number] =>
      [cx, y, -cz + ez + i * cwZ]),
  ];
}

// Default fallback (will be overridden by dynamic computation)
const DEFAULT_CELL_POS = computeCellPositions(4.0, 4.0);

// Offset khi nhiều player cùng ô (3D offsets)
const STACK_OFF: [number, number, number][] = [
  [0, 0, 0], [0.12, 0, -0.12], [-0.12, 0, 0.12], [0.12, 0, 0.12],
];

// ─── Board Model Component ──────────────────────────────────────────────────
const TARGET_SIZE = 4; // model sẽ fit trong box ~4 units

function BoardModel({ calib, onBoardMeasured }: {
  calib: boolean;
  onBoardMeasured: (bx: number, bz: number, scale: number) => void;
}) {
  const { scene } = useGLTF(modelUrl);

  // 1. Reset cached state → 2. Hide meshes → 3. Auto-center from board BB
  useEffect(() => {
    // Reset transforms (useGLTF caches scene — may have stale scale/position from previous render)
    scene.scale.setScalar(1);
    scene.position.set(0, 0, 0);

    // Set visibility: show board, hide everything else
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.visible = !HIDDEN_MESHES.includes(child.name);
      }
    });

    // Compute bounding box from board meshes only (by name, not visibility)
    const box = new THREE.Box3();
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !HIDDEN_MESHES.includes(child.name)) {
        box.expandByObject(child);
      }
    });

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = TARGET_SIZE / maxDim;

    scene.scale.setScalar(scale);
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    // Scaled board dimensions
    const bx = size.x * scale;
    const bz = size.z * scale;
    console.log(`Board auto-fit: board=${size.x.toFixed(0)}x${size.z.toFixed(0)}, scale=${scale.toFixed(4)}, scaled=${bx.toFixed(2)}x${bz.toFixed(2)}`);

    onBoardMeasured(bx, bz, scale);
  }, [scene, onBoardMeasured]);

  // Log mesh names + world positions in calib mode
  useEffect(() => {
    if (calib) {
      console.log('=== Model meshes (name → world position) ===');
      const wp = new THREE.Vector3();
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.getWorldPosition(wp);
          console.log(`  Mesh: "${child.name}"  pos: [${wp.x.toFixed(3)}, ${wp.y.toFixed(3)}, ${wp.z.toFixed(3)}]  visible: ${child.visible}`);
        }
      });
      console.log('=== End of mesh list ===');
    }
  }, [calib, scene]);

  return <primitive object={scene} />;
}

// ─── Calibration Spheres ─────────────────────────────────────────────────────
function CalibDots({ cellPos }: { cellPos: [number, number, number][] }) {
  return (
    <>
      {cellPos.map(([x, y, z], i) => (
        <group key={i} position={[x, y + 0.05, z]}>
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color={i === 0 ? '#39ff85' : '#f5c842'} />
          </mesh>
          <Html center style={{ pointerEvents: 'none' }}>
            <div style={{
              fontSize: 8, fontWeight: 700, color: '#fff',
              background: i === 0 ? '#39ff85' : '#f5c842cc',
              padding: '0 3px', borderRadius: 2, whiteSpace: 'nowrap',
            }}>
              {i}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

// ─── Token Component (placed in 3D scene) ────────────────────────────────────
function Token3D({ player, stackIdx, cellPos }: {
  player: { id: number; pos: number; color: string; tokenShape: string; name: string; isWalking: boolean };
  stackIdx: number;
  cellPos: [number, number, number][];
}) {
  const [cx, cy, cz] = cellPos[player.pos] ?? [0, 0.08, 0];
  const [ox, oy, oz] = STACK_OFF[stackIdx] ?? [0, 0, 0];

  return (
    <group position={[cx + ox, cy + oy, cz + oz]}>
      <Html center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          filter: [
            'drop-shadow(0 6px 10px rgba(0,0,0,.8))',
            `drop-shadow(0 0 14px ${player.color}90)`,
          ].join(' '),
        }}>
          <AnimatedSprite
            shape={player.tokenShape as 'hat' | 'car' | 'guitar' | 'crown'}
            color={player.color}
            size={38}
            state={player.isWalking ? 'walk' : 'idle'}
          />
          <div style={{
            position: 'absolute',
            bottom: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            background: `${player.color}dd`,
            color: '#fff',
            fontSize: 7,
            fontFamily: 'Orbitron,sans-serif',
            fontWeight: 700,
            padding: '1px 5px',
            borderRadius: 3,
            whiteSpace: 'nowrap',
            letterSpacing: 0.5,
          }}>
            {player.name}
          </div>
        </div>
      </Html>
    </group>
  );
}

// ─── Building 3D Components ──────────────────────────────────────────────────
function BuildingMesh({ geometry, material, targetPos, scale }: { geometry: any; material: any; targetPos: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startY = targetPos[1] + 3; // start 3 units higher
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      if (meshRef.current.position.y > targetPos[1]) {
        meshRef.current.position.y -= delta * 8; // fall speed
        if (meshRef.current.position.y < targetPos[1]) {
          meshRef.current.position.y = targetPos[1]; // snap
        }
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[targetPos[0], startY, targetPos[2]]}
      scale={scale} // Scale exactly like the board
      castShadow
      receiveShadow
    />
  );
}

function PropertyBuildings({ cellPos, scale }: { cellPos: [number, number, number][]; scale: number }) {
  const houses = useGameStore(s => s.houses);
  const { nodes } = useGLTF(modelUrl) as any;
  const houseMesh = nodes['House_07_-_Default_0'];
  const hotelMesh = nodes['Hotel_08_-_Default_0'];

  if (!houseMesh || !hotelMesh || scale === 1) return null; // Wait for calc

  return (
    <>
      {Object.entries(houses).map(([idxStr, count]) => {
        const spaceId = Number(idxStr);
        const pos = cellPos[spaceId];
        if (!pos || count === 0) return null;

        // Tăng khoảng trống để không bị dính vào nhau
        const HOUSE_OFFSETS: [number, number][] = [
          [-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]
        ];

        // Is Hotel?
        if (count >= 5) {
          return (
            <BuildingMesh
              key={`${spaceId}-hotel`}
              geometry={hotelMesh.geometry}
              material={hotelMesh.material}
              targetPos={pos}
              scale={scale * 0.8} // Khách sạn nhỏ đi 1 chút
            />
          );
        }

        // Render Houses
        return Array.from({ length: Math.min(count, 4) }).map((_, i) => (
          <BuildingMesh
            key={`${spaceId}-house-${i}`}
            geometry={houseMesh.geometry}
            material={houseMesh.material}
            targetPos={[pos[0] + HOUSE_OFFSETS[i][0], pos[1], pos[2] + HOUSE_OFFSETS[i][1]]}
            scale={scale * 0.65} // Nhà nhỏ hơn nhiều để trống không gian
          />
        ));
      })}
    </>
  );
}

// ─── Camera Controller (focus on current player) ────────────────────────────
const DEFAULT_CAM_POS = new THREE.Vector3(0, 5, 0);
const DEFAULT_CAM_TARGET = new THREE.Vector3(0, 0, 0);
const LERP_SPEED = 0.035;

function CameraController({ cellPos }: { cellPos: [number, number, number][] }) {
  const camera = useThree(s => s.camera);
  const phase = useGameStore(s => s.phase);
  const cur = useGameStore(s => s.cur);
  const players = useGameStore(s => s.players);

  const targetPos = useRef(DEFAULT_CAM_POS.clone());
  const targetLookAt = useRef(DEFAULT_CAM_TARGET.clone());
  const currentLookAt = useRef(DEFAULT_CAM_TARGET.clone());

  useFrame(() => {
    const isFocused = phase === 'rolling' || phase === 'walking' || phase === 'landed' || phase === 'modal';
    const p = players[cur];

    if (isFocused && p) {
      const [cx, , cz] = cellPos[p.pos] ?? [0, 0.08, 0];
      targetPos.current.set(cx, 3, cz + 1.5);
      targetLookAt.current.set(cx, 0, cz);
    } else {
      targetPos.current.copy(DEFAULT_CAM_POS);
      targetLookAt.current.copy(DEFAULT_CAM_TARGET);
    }

    camera.position.lerp(targetPos.current, LERP_SPEED);
    currentLookAt.current.lerp(targetLookAt.current, LERP_SPEED);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

// ─── Loading Fallback ────────────────────────────────────────────────────────
function LoadingFallback() {
  return (
    <Html center>
      <div style={{ textAlign: 'center' }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <style>{`
            @keyframes boardspin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
            @keyframes boardpulse{0%,100%{opacity:.4}50%{opacity:1}}
            .bs{animation:boardspin 2s linear infinite;transform-origin:32px 32px}
            .bp{animation:boardpulse 1.4s ease-in-out infinite}
          `}</style>
          <rect x="8" y="8" width="48" height="48" rx="4" fill="none" stroke="#2a3a5c" strokeWidth="2"/>
          <rect x="16" y="8" width="32" height="8" fill="#0f1d34"/>
          <rect x="16" y="48" width="32" height="8" fill="#0f1d34"/>
          <rect x="8" y="16" width="8" height="32" fill="#0f1d34"/>
          <rect x="48" y="16" width="8" height="32" fill="#0f1d34"/>
          <g className="bs">
            <circle cx="32" cy="32" r="10" fill="none" stroke="#3af4ff" strokeWidth="2" strokeDasharray="16 16"/>
          </g>
          <circle cx="32" cy="32" r="4" fill="#f5c842" className="bp"/>
        </svg>
        <p style={{ color: '#3af4ff', fontFamily: 'Orbitron,sans-serif', fontSize: 11, letterSpacing: 3, marginTop: 12 }}>
          LOADING 3D BOARD
        </p>
      </div>
    </Html>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Board3D() {
  const [calib, setCalib] = useState(false);
  const [cellPos, setCellPos] = useState(DEFAULT_CELL_POS);
  const [boardScale, setBoardScale] = useState(1);
  const players = useGameStore(s => s.players);

  const handleBoardMeasured = useCallback((bx: number, bz: number, scale: number) => {
    setCellPos(computeCellPositions(bx, bz));
    setBoardScale(scale);
  }, []);

  return (
    <div
      id="board-wrap-3d"
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 100px)',
        userSelect: 'none',
      }}
    >
      {/* ── 3D Canvas ──────────────────────────────────────────────────── */}
      <Canvas
        camera={{ position: [0, 5, 0], fov: 50 }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 8,
          background: '#0a1828',
        }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#0a1828']} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-3, 4, -3]} intensity={0.4} />

        {/* Camera auto-focus on current player */}
        <CameraController cellPos={cellPos} />

        <Suspense fallback={<LoadingFallback />}>
          {/* Board model */}
          <BoardModel calib={calib} onBoardMeasured={handleBoardMeasured} />

          {/* Player tokens */}
          {players.filter(p => !p.bankrupt).map(p => {
            const stackIdx = players.filter(
              q => !q.bankrupt && q.id < p.id && q.pos === p.pos
            ).length;
            return <Token3D key={p.id} player={p} stackIdx={stackIdx} cellPos={cellPos} />;
          })}

          {/* Buildings (Houses / Hotels) */}
          <PropertyBuildings cellPos={cellPos} scale={boardScale} />

          {/* Calibration dots */}
          {calib && <CalibDots cellPos={cellPos} />}
        </Suspense>
      </Canvas>

      {/* ── Neon border overlay ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        border: '3px solid var(--neon-blue, #3af4ff)',
        borderRadius: 8,
        pointerEvents: 'none',
        boxShadow: '0 0 50px rgba(58,244,255,.18), 0 0 0 1px rgba(58,244,255,.08)',
      }} />


      {/* ── Controls bar (top-right) ───────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 10, right: 10,
        display: 'flex', gap: 6, zIndex: 60,
        pointerEvents: 'all',
      }}>
        <button
          onClick={() => setCalib(c => !c)}
          title="Toggle calibration (xem vị trí ô + tên mesh)"
          style={{
            background: calib ? '#f5c842' : 'rgba(10,24,40,.85)',
            color: calib ? '#000' : '#f5c842',
            border: '1px solid #f5c84250',
            padding: '5px 10px',
            fontFamily: 'Orbitron,sans-serif',
            fontSize: 9, fontWeight: 700,
            cursor: 'pointer', borderRadius: 4,
            backdropFilter: 'blur(6px)',
            letterSpacing: 1,
          }}
        >
          {calib ? '✕ CLOSE' : '⚙ CALIB'}
        </button>
      </div>

      {/* ── Credit (CC-BY) ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 8, right: 10,
        fontSize: 8, color: '#4f4634',
        fontFamily: 'sans-serif',
        pointerEvents: 'none',
      }}>
        3D Model: Yanez Designs · CC-BY
      </div>
    </div>
  );
}

// Preload model
useGLTF.preload(modelUrl);
