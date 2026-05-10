'use client';

import {Canvas, useThree} from '@react-three/fiber';
import {OrbitControls, Environment, RoundedBox, Cylinder, Sphere, ContactShadows} from '@react-three/drei';
import {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import type {FurnitureItem} from '@/data/furnitureCatalog';

// Renders a single furniture piece as a procedural Three.js scene — no
// external model files. The geometry is selected by category and tinted
// from the item's `paletteHex`. This replaces the `<model-viewer>` GLB
// playback (which was showing Khronos sample assets like Duck/Avocado).

type Props = {
  item: FurnitureItem;
  onSceneReady?: (scene: THREE.Scene) => void;
};

type Palette = {primary: string; secondary: string; accent: string; brass: string; ink: string};

export function FurniturePreview3D({item, onSceneReady}: Props) {
  // Centre the piece on the origin and pick a camera distance based on
  // its bounding box.
  const wM = item.dimensionsCm.w / 100;
  const dM = item.dimensionsCm.d / 100;
  const hM = item.dimensionsCm.h / 100;
  const reach = Math.max(wM, dM, hM, 1.2);

  const palette = useMemo<Palette>(() => {
    const safe = item.paletteHex.filter(Boolean);
    return {
      primary:   safe[0] ?? '#B8552E',
      secondary: safe[1] ?? '#B89968',
      accent:    safe[2] ?? '#D9886B',
      brass:     '#B89968',
      ink:       '#1F1A14',
    };
  }, [item.paletteHex]);

  return (
    <Canvas
      shadows
      camera={{position: [reach * 1.4, reach * 0.85, reach * 1.6], fov: 38}}
      style={{background: 'linear-gradient(180deg, #F4EFE6 0%, #DDD3C3 100%)'}}
      gl={{antialias: true, toneMappingExposure: 1.05}}
    >
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[reach * 2, reach * 3, reach * 1.8]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <pointLight position={[-reach, reach * 1.5, -reach]} intensity={0.4} color={palette.brass} />

      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[reach * 4, reach * 4]} />
        <meshStandardMaterial color={'#E5DDD0'} roughness={0.92} />
      </mesh>
      <ContactShadows position={[0, 0.001, 0]} opacity={0.45} scale={reach * 4} blur={2.4} far={reach * 2} />

      <FurnitureGeometry item={item} palette={palette} />
      {onSceneReady && <SceneSnapshot onReady={onSceneReady} />}

      <OrbitControls
        enablePan={false}
        enableZoom
        enableRotate
        target={[0, hM * 0.4, 0]}
        minDistance={reach * 0.9}
        maxDistance={reach * 4}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
      <Environment preset="apartment" />
    </Canvas>
  );
}

// Captures the running Three.js scene so the parent can export it to GLB
// for AR handoff (model-viewer on Android Scene Viewer / WebXR).
function SceneSnapshot({onReady}: {onReady: (s: THREE.Scene) => void}) {
  const {scene} = useThree();
  useEffect(() => {
    onReady(scene);
  }, [scene, onReady]);
  return null;
}

// ── Per-category procedural geometry ───────────────────────────────────────

function FurnitureGeometry({item, palette}: {item: FurnitureItem; palette: Palette}) {
  const wM = item.dimensionsCm.w / 100;
  const dM = item.dimensionsCm.d / 100;
  const hM = item.dimensionsCm.h / 100;

  // Centre on origin: shift each piece so its base sits on y=0 and its
  // centre on x=0, z=0.
  const tags = item.tags.join(' ').toLowerCase();
  const has = (t: string) => tags.includes(t);

  switch (item.category) {
    case 'seating':
      if (has('cushion') || has('pouf')) return <FloorCushion w={wM} d={dM} h={hM} palette={palette} />;
      if (has('bar-stool') || hM > 0.7 && wM < 0.6) return <BarStool h={hM} palette={palette} />;
      if (has('bench') || (wM > 1.2 && dM < 0.55)) return <Bench w={wM} d={dM} h={hM} palette={palette} />;
      if (has('chair') || has('armchair') || (wM < 1.0 && dM < 1.0)) return <Armchair w={wM} d={dM} h={hM} palette={palette} />;
      return <Sofa w={wM} d={dM} h={hM} palette={palette} />;

    case 'tables':
      if (has('console') || (wM > 1.2 && dM < 0.5)) return <ConsoleTable w={wM} d={dM} h={hM} palette={palette} />;
      if (has('side') || has('round') || (wM < 0.7 && dM < 0.7)) return <RoundSideTable w={wM} h={hM} palette={palette} />;
      if (has('desk')) return <Desk w={wM} d={dM} h={hM} palette={palette} />;
      return <DiningTable w={wM} d={dM} h={hM} palette={palette} />;

    case 'beds':
      if (has('headboard') && hM < 1.5) return <HeadboardOnly w={wM} h={hM} palette={palette} />;
      if (has('bunk')) return <BunkBed w={wM} d={dM} h={hM} palette={palette} />;
      return <Bed w={wM} d={dM} h={hM} palette={palette} />;

    case 'storage':
      if (has('nightstand')) return <Nightstand w={wM} d={dM} h={hM} palette={palette} />;
      if (has('bookshelf') || has('shelving')) return <Bookshelf w={wM} d={dM} h={hM} palette={palette} />;
      if (hM > 1.7) return <Wardrobe w={wM} d={dM} h={hM} palette={palette} />;
      return <Credenza w={wM} d={dM} h={hM} palette={palette} />;

    case 'lighting':
      if (has('floor')) return <FloorLamp h={hM} palette={palette} />;
      if (has('table')) return <TableLamp w={wM} h={hM} palette={palette} />;
      if (has('chandelier') || has('cluster')) return <Chandelier w={wM} h={hM} palette={palette} />;
      if (has('sconce')) return <WallSconce w={wM} h={hM} palette={palette} />;
      if (has('lantern')) return <Lantern w={wM} h={hM} palette={palette} />;
      return <Pendant w={wM} h={hM} palette={palette} />;

    case 'rugs':
      return <Rug w={wM} d={dM} palette={palette} />;

    case 'wall-decor':
      if (has('mirror')) return <Mirror w={wM} h={hM} palette={palette} round={has('round')} />;
      if (has('mashrabiya') || has('screen') || has('panel')) return <WallPanel w={wM} h={hM} palette={palette} />;
      if (has('calligraphy')) return <CalligraphyPanel w={wM} h={hM} palette={palette} />;
      if (has('sculpture')) return <WallSculpture w={wM} h={hM} palette={palette} />;
      return <WallPanel w={wM} h={hM} palette={palette} />;

    case 'kitchen':
      if (has('island')) return <KitchenIsland w={wM} d={dM} h={hM} palette={palette} />;
      if (has('bar')) return <BarCounter w={wM} d={dM} h={hM} palette={palette} />;
      if (has('pantry')) return <Wardrobe w={wM} d={dM} h={hM} palette={palette} />;
      return <KitchenIsland w={wM} d={dM} h={hM} palette={palette} />;

    case 'bath':
      if (has('tub')) return <BathTub w={wM} d={dM} h={hM} palette={palette} />;
      if (has('vanity')) return <Vanity w={wM} d={dM} h={hM} palette={palette} />;
      return <Vanity w={wM} d={dM} h={hM} palette={palette} />;

    case 'textiles':
      if (has('drape')) return <Drapes w={wM} h={hM} palette={palette} />;
      if (has('throw') || has('bolster')) return <Cushion w={wM} d={dM} h={hM} palette={palette} />;
      return <Cushion w={wM} d={dM} h={hM} palette={palette} />;

    case 'plants':
      if (has('palm') || has('tree')) return <Tree h={hM} palette={palette} />;
      if (has('planter') || has('stand')) return <PlanterStand w={wM} h={hM} palette={palette} />;
      return <Tree h={hM} palette={palette} />;

    case 'accents':
      if (has('tray') || has('bowl')) return <Tray w={wM} d={dM} palette={palette} />;
      if (has('dallah')) return <Dallah h={hM} palette={palette} />;
      if (has('vase')) return <Vase w={wM} h={hM} palette={palette} />;
      if (has('candle')) return <CandleHolder w={wM} h={hM} palette={palette} />;
      return <Vase w={wM} h={hM} palette={palette} />;

    default:
      return <Cushion w={wM} d={dM} h={hM} palette={palette} />;
  }
}

// ── Geometry primitives ────────────────────────────────────────────────────

function Sofa({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  const baseH = Math.min(h * 0.5, 0.36);
  const backH = h - baseH;
  const cushW = (w - 0.32) / 3;
  return (
    <group position={[-w / 2, 0, -d / 2]}>
      {/* Base */}
      <RoundedBox args={[w, baseH, d]} radius={0.04} smoothness={3} position={[w / 2, baseH / 2 + 0.08, d / 2]} castShadow receiveShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.85} />
      </RoundedBox>
      {/* Back */}
      <RoundedBox args={[w, backH * 0.85, 0.18]} radius={0.05} smoothness={3} position={[w / 2, baseH + (backH * 0.85) / 2 + 0.08, d / 2 - d / 2 + 0.09]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.85} />
      </RoundedBox>
      {/* Armrests */}
      <RoundedBox args={[0.18, baseH + backH * 0.65, d]} radius={0.05} position={[0.09, (baseH + backH * 0.65) / 2 + 0.08, d / 2]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.85} />
      </RoundedBox>
      <RoundedBox args={[0.18, baseH + backH * 0.65, d]} radius={0.05} position={[w - 0.09, (baseH + backH * 0.65) / 2 + 0.08, d / 2]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.85} />
      </RoundedBox>
      {/* Cushions */}
      {[0, 1, 2].map((i) => (
        <RoundedBox
          key={i}
          args={[cushW, 0.14, d * 0.78]}
          radius={0.04}
          position={[0.18 + cushW / 2 + i * (cushW + 0.005), baseH + 0.07 + 0.08, d / 2 + 0.04]}
          castShadow
        >
          <meshStandardMaterial color={palette.accent} roughness={0.7} />
        </RoundedBox>
      ))}
      {/* Legs */}
      {[[0.12, 0.12], [w - 0.12, 0.12], [0.12, d - 0.12], [w - 0.12, d - 0.12]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.025, 0.025, 0.08]} position={[x, 0.04, z]} castShadow>
          <meshStandardMaterial color={palette.brass} metalness={0.8} roughness={0.3} />
        </Cylinder>
      ))}
    </group>
  );
}

function Armchair({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group position={[-w / 2, 0, -d / 2]}>
      {/* Seat */}
      <RoundedBox args={[w * 0.85, 0.14, d * 0.85]} radius={0.04} position={[w / 2, 0.45, d / 2]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.8} />
      </RoundedBox>
      {/* Back */}
      <RoundedBox args={[w * 0.85, h - 0.5, 0.12]} radius={0.04} position={[w / 2, 0.5 + (h - 0.5) / 2, 0.12]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.8} />
      </RoundedBox>
      {/* Armrests */}
      <RoundedBox args={[0.12, 0.45, d * 0.7]} radius={0.04} position={[w * 0.08, 0.42 + 0.225, d / 2]} castShadow>
        <meshStandardMaterial color={palette.secondary} roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.45, d * 0.7]} radius={0.04} position={[w * 0.92, 0.42 + 0.225, d / 2]} castShadow>
        <meshStandardMaterial color={palette.secondary} roughness={0.6} />
      </RoundedBox>
      {/* Legs */}
      {[[0.1, 0.1], [w - 0.1, 0.1], [0.1, d - 0.1], [w - 0.1, d - 0.1]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.022, 0.022, 0.42]} position={[x, 0.21, z]} castShadow>
          <meshStandardMaterial color={palette.brass} metalness={0.7} roughness={0.32} />
        </Cylinder>
      ))}
    </group>
  );
}

function FloorCushion({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <RoundedBox args={[w, h, d]} radius={0.05} smoothness={4} position={[0, h / 2, 0]} castShadow>
      <meshStandardMaterial color={palette.primary} roughness={0.85} />
    </RoundedBox>
  );
}

function BarStool({h, palette}: {h: number; palette: Palette}) {
  return (
    <group>
      <Cylinder args={[0.18, 0.18, 0.05]} position={[0, h - 0.025, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.7} />
      </Cylinder>
      <Cylinder args={[0.025, 0.025, h - 0.05]} position={[0, (h - 0.05) / 2, 0]} castShadow>
        <meshStandardMaterial color={palette.brass} metalness={0.8} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.22, 0.22, 0.02]} position={[0, 0.01, 0]}>
        <meshStandardMaterial color={palette.brass} metalness={0.8} roughness={0.3} />
      </Cylinder>
    </group>
  );
}

function Bench({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, 0.08, d]} radius={0.02} position={[0, h - 0.04, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.55} />
      </RoundedBox>
      {[[-w / 2 + 0.1, -d / 2 + 0.1], [w / 2 - 0.1, -d / 2 + 0.1], [-w / 2 + 0.1, d / 2 - 0.1], [w / 2 - 0.1, d / 2 - 0.1]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.025, 0.025, h - 0.08]} position={[x, (h - 0.08) / 2, z]} castShadow>
          <meshStandardMaterial color={palette.secondary} roughness={0.55} />
        </Cylinder>
      ))}
    </group>
  );
}

function DiningTable({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, 0.06, d]} radius={0.02} position={[0, h - 0.03, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[w * 0.96, 0.012, d * 0.96]} radius={0.005} position={[0, h - 0.07, 0]}>
        <meshStandardMaterial color={palette.brass} metalness={0.8} roughness={0.3} />
      </RoundedBox>
      {[[-w / 2 + 0.15, -d / 2 + 0.15], [w / 2 - 0.15, -d / 2 + 0.15], [-w / 2 + 0.15, d / 2 - 0.15], [w / 2 - 0.15, d / 2 - 0.15]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.035, 0.035, h - 0.06]} position={[x, (h - 0.06) / 2, z]} castShadow>
          <meshStandardMaterial color={palette.primary} roughness={0.5} />
        </Cylinder>
      ))}
    </group>
  );
}

function ConsoleTable({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, 0.05, d]} radius={0.015} position={[0, h - 0.025, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.5} />
      </RoundedBox>
      {[[-w / 2 + 0.08, 0], [w / 2 - 0.08, 0]].map(([x, z], i) => (
        <RoundedBox key={i} args={[0.05, h - 0.05, d * 0.85]} radius={0.01} position={[x, (h - 0.05) / 2, z]} castShadow>
          <meshStandardMaterial color={palette.brass} metalness={0.8} roughness={0.3} />
        </RoundedBox>
      ))}
    </group>
  );
}

function RoundSideTable({w, h, palette}: {w: number; h: number; palette: Palette}) {
  const r = w / 2;
  return (
    <group>
      <Cylinder args={[r, r, 0.05]} position={[0, h - 0.025, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.5} />
      </Cylinder>
      <Cylinder args={[r * 0.5, r * 0.6, h - 0.05]} position={[0, (h - 0.05) / 2, 0]} castShadow>
        <meshStandardMaterial color={palette.brass} metalness={0.75} roughness={0.32} />
      </Cylinder>
      <Cylinder args={[r * 0.7, r * 0.7, 0.015]} position={[0, 0.008, 0]}>
        <meshStandardMaterial color={palette.brass} metalness={0.8} roughness={0.3} />
      </Cylinder>
    </group>
  );
}

function Desk({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return <DiningTable w={w} d={d} h={h} palette={palette} />;
}

function Bed({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  const headboardH = h - 0.6;
  return (
    <group>
      {/* Frame */}
      <RoundedBox args={[w, 0.22, d]} radius={0.02} position={[0, 0.21, 0]} castShadow>
        <meshStandardMaterial color={palette.secondary} roughness={0.6} />
      </RoundedBox>
      {/* Mattress */}
      <RoundedBox args={[w * 0.94, 0.18, d * 0.94]} radius={0.04} position={[0, 0.41, 0]} castShadow>
        <meshStandardMaterial color={'#FAFAF7'} roughness={0.85} />
      </RoundedBox>
      {/* Duvet at foot */}
      <RoundedBox args={[w * 0.94, 0.08, d * 0.32]} radius={0.03} position={[0, 0.51, d * 0.3]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.85} />
      </RoundedBox>
      {/* Pillows */}
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[w * 0.4, 0.08, d * 0.18]} radius={0.03} position={[s * w * 0.22, 0.55, -d * 0.32]} castShadow>
          <meshStandardMaterial color={'#F0E6D6'} roughness={0.85} />
        </RoundedBox>
      ))}
      {/* Headboard */}
      <RoundedBox args={[w * 1.05, headboardH, 0.12]} radius={0.03} position={[0, 0.6 + headboardH / 2, -d / 2 - 0.06]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.78} />
      </RoundedBox>
      <Cylinder args={[0.018, 0.018, w * 1.0]} position={[0, 0.6 + headboardH * 0.7, -d / 2 - 0.04]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
      </Cylinder>
    </group>
  );
}

function HeadboardOnly({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, h, 0.12]} radius={0.04} position={[0, h / 2, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.8} />
      </RoundedBox>
      <Cylinder args={[0.022, 0.022, w * 0.95]} position={[0, h * 0.78, 0.075]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
      </Cylinder>
    </group>
  );
}

function BunkBed({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  const lower = h * 0.35;
  const upper = h * 0.85;
  return (
    <group>
      <RoundedBox args={[w, 0.16, d]} radius={0.02} position={[0, lower, 0]} castShadow>
        <meshStandardMaterial color={'#FAFAF7'} roughness={0.85} />
      </RoundedBox>
      <RoundedBox args={[w, 0.16, d]} radius={0.02} position={[0, upper, 0]} castShadow>
        <meshStandardMaterial color={'#FAFAF7'} roughness={0.85} />
      </RoundedBox>
      {/* Posts */}
      {[[-w / 2 + 0.08, -d / 2 + 0.08], [w / 2 - 0.08, -d / 2 + 0.08], [-w / 2 + 0.08, d / 2 - 0.08], [w / 2 - 0.08, d / 2 - 0.08]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.04, 0.04, h]} position={[x, h / 2, z]} castShadow>
          <meshStandardMaterial color={palette.secondary} roughness={0.55} />
        </Cylinder>
      ))}
    </group>
  );
}

function Credenza({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.025} position={[0, h / 2, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.6} />
      </RoundedBox>
      {/* Door splits */}
      {[-1, 0, 1].map((s) => (
        <RoundedBox key={s} args={[0.005, h * 0.92, 0.005]} radius={0.001} position={[s * w * 0.32, h / 2, d / 2 + 0.001]}>
          <meshStandardMaterial color={palette.ink} />
        </RoundedBox>
      ))}
      {/* Pulls */}
      {[-1, 0, 1].map((s) => (
        <Cylinder key={s} args={[0.012, 0.012, 0.16]} position={[s * w * 0.16, h / 2, d / 2 + 0.005]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
        </Cylinder>
      ))}
      {/* Legs */}
      {[[-w / 2 + 0.1, -d / 2 + 0.1], [w / 2 - 0.1, -d / 2 + 0.1], [-w / 2 + 0.1, d / 2 - 0.1], [w / 2 - 0.1, d / 2 - 0.1]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.025, 0.025, 0.12]} position={[x, 0.06, z]} castShadow>
          <meshStandardMaterial color={palette.brass} metalness={0.8} roughness={0.3} />
        </Cylinder>
      ))}
    </group>
  );
}

function Wardrobe({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.02} position={[0, h / 2, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.6} />
      </RoundedBox>
      {/* Door splits */}
      <RoundedBox args={[0.005, h * 0.96, 0.005]} radius={0.001} position={[0, h / 2, d / 2 + 0.001]}>
        <meshStandardMaterial color={palette.ink} />
      </RoundedBox>
      {/* Long brass pulls */}
      {[-1, 1].map((s) => (
        <Cylinder key={s} args={[0.012, 0.012, h * 0.4]} position={[s * w * 0.04, h / 2, d / 2 + 0.005]}>
          <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
        </Cylinder>
      ))}
    </group>
  );
}

function Bookshelf({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, h, d * 0.85]} radius={0.02} position={[0, h / 2, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.6} />
      </RoundedBox>
      {/* Shelves */}
      {[0.25, 0.5, 0.75].map((p, i) => (
        <RoundedBox key={i} args={[w * 0.95, 0.018, d * 0.8]} radius={0.005} position={[0, h * p, 0]}>
          <meshStandardMaterial color={palette.secondary} roughness={0.55} />
        </RoundedBox>
      ))}
      {/* Books on the middle shelf */}
      {[-0.32, -0.16, 0, 0.16, 0.32].map((dx, i) => (
        <RoundedBox key={i} args={[0.05, 0.18, 0.12]} radius={0.005} position={[dx * w, h * 0.5 + 0.1, d * 0.18]}>
          <meshStandardMaterial color={i % 2 ? palette.accent : palette.secondary} roughness={0.7} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Nightstand({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.025} position={[0, h / 2, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.6} />
      </RoundedBox>
      <Cylinder args={[0.012, 0.012, 0.16]} position={[0, h / 2 + h * 0.15, d / 2 + 0.005]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
      </Cylinder>
    </group>
  );
}

function Pendant({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group position={[0, h * 0.7, 0]}>
      <Cylinder args={[0.005, 0.005, 0.5]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color={palette.ink} />
      </Cylinder>
      <mesh castShadow>
        <coneGeometry args={[w / 2, h * 0.45, 24, 1, true]} />
        <meshPhysicalMaterial color={palette.brass} metalness={0.85} roughness={0.18} clearcoat={0.7} side={THREE.DoubleSide} />
      </mesh>
      <Sphere args={[0.06, 16, 16]} position={[0, -h * 0.16, 0]}>
        <meshStandardMaterial color={'#FFE6B0'} emissive={'#FFE6B0'} emissiveIntensity={1.5} />
      </Sphere>
      <pointLight position={[0, -h * 0.18, 0]} intensity={0.6} color={'#FFE6B0'} distance={3} />
    </group>
  );
}

function FloorLamp({h, palette}: {h: number; palette: Palette}) {
  return (
    <group>
      <Cylinder args={[0.18, 0.22, 0.04]} position={[0, 0.02, 0]}>
        <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.012, 0.012, h - 0.4]} position={[0, (h - 0.4) / 2 + 0.04, 0]}>
        <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
      </Cylinder>
      <mesh position={[0, h - 0.18, 0]} castShadow>
        <coneGeometry args={[0.18, 0.34, 20, 1, true]} />
        <meshStandardMaterial color={'#F0E6D6'} side={THREE.DoubleSide} roughness={0.7} emissive={'#FFE6B0'} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function TableLamp({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group>
      <Cylinder args={[w / 2, w / 2 * 1.15, h * 0.3]} position={[0, h * 0.15, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.5} />
      </Cylinder>
      <Cylinder args={[0.008, 0.008, h * 0.35]} position={[0, h * 0.5, 0]}>
        <meshStandardMaterial color={palette.brass} metalness={0.8} roughness={0.3} />
      </Cylinder>
      <mesh position={[0, h * 0.85, 0]} castShadow>
        <coneGeometry args={[w * 0.35, h * 0.3, 20, 1, true]} />
        <meshStandardMaterial color={'#F0E6D6'} side={THREE.DoubleSide} roughness={0.75} emissive={'#FFE6B0'} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Chandelier({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group position={[0, h * 0.5, 0]}>
      <Cylinder args={[w / 2, w / 2, 0.04]} position={[0, 0, 0]}>
        <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.2} />
      </Cylinder>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const r = w / 2 * 0.85;
        const x = Math.cos((deg * Math.PI) / 180) * r;
        const z = Math.sin((deg * Math.PI) / 180) * r;
        return (
          <group key={i} position={[x, 0, z]}>
            <Cylinder args={[0.005, 0.005, h * 0.4]} position={[0, -h * 0.2, 0]}>
              <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
            </Cylinder>
            <Sphere args={[0.05, 16, 16]} position={[0, -h * 0.4, 0]}>
              <meshStandardMaterial color={'#FFE6B0'} emissive={'#FFE6B0'} emissiveIntensity={1.4} />
            </Sphere>
          </group>
        );
      })}
    </group>
  );
}

function WallSconce({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group position={[0, h / 2, 0]}>
      <RoundedBox args={[w * 0.6, h * 0.3, 0.05]} radius={0.005} position={[0, 0, 0]}>
        <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.2} />
      </RoundedBox>
      <Cylinder args={[w * 0.18, w * 0.22, h * 0.45]} position={[0, h * 0.35, 0.06]}>
        <meshStandardMaterial color={'#F0E6D6'} side={THREE.DoubleSide} emissive={'#FFE6B0'} emissiveIntensity={0.5} />
      </Cylinder>
    </group>
  );
}

function Lantern({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, h, w]} radius={0.02} position={[0, h / 2, 0]} castShadow>
        <meshPhysicalMaterial color={palette.secondary} metalness={0.4} roughness={0.5} />
      </RoundedBox>
      <Sphere args={[0.06, 16, 16]} position={[0, h * 0.55, 0]}>
        <meshStandardMaterial color={'#FFE6B0'} emissive={'#FFE6B0'} emissiveIntensity={1.5} />
      </Sphere>
    </group>
  );
}

function Rug({w, d, palette}: {w: number; d: number; palette: Palette}) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={palette.primary} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <ringGeometry args={[Math.min(w, d) * 0.4, Math.min(w, d) * 0.43, 64, 1, 0, Math.PI * 2]} />
        <meshStandardMaterial color={palette.accent} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0]}>
        <ringGeometry args={[Math.min(w, d) * 0.18, Math.min(w, d) * 0.22, 64, 1, 0, Math.PI * 2]} />
        <meshStandardMaterial color={palette.brass} roughness={1} />
      </mesh>
    </group>
  );
}

function Mirror({w, h, palette, round}: {w: number; h: number; palette: Palette; round?: boolean}) {
  const r = Math.min(w, h) / 2;
  if (round) {
    return (
      <group position={[0, h / 2, 0]}>
        <Cylinder args={[r, r, 0.04, 48]} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[r * 0.92, r * 0.92, 0.05, 48]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
          <meshPhysicalMaterial color={'#E8EDF2'} metalness={0.6} roughness={0.05} clearcoat={1} />
        </Cylinder>
      </group>
    );
  }
  return (
    <group position={[0, h / 2, 0]}>
      <RoundedBox args={[w, h, 0.04]} radius={0.01}>
        <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[w * 0.92, h * 0.92, 0.05]} radius={0.005} position={[0, 0, 0.005]}>
        <meshPhysicalMaterial color={'#E8EDF2'} metalness={0.6} roughness={0.05} clearcoat={1} />
      </RoundedBox>
    </group>
  );
}

function WallPanel({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group position={[0, h / 2, 0]}>
      <RoundedBox args={[w, h, 0.04]} radius={0.015} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.65} />
      </RoundedBox>
      {/* Mashrabiya pattern dots */}
      {Array.from({length: 6}).map((_, row) =>
        Array.from({length: 8}).map((__, col) => (
          <Cylinder
            key={`${row}-${col}`}
            args={[0.015, 0.015, 0.05, 8]}
            rotation={[Math.PI / 2, 0, 0]}
            position={[(col - 3.5) * (w / 9), (row - 2.5) * (h / 7), 0.025]}
          >
            <meshStandardMaterial color={palette.brass} metalness={0.7} roughness={0.3} />
          </Cylinder>
        )),
      )}
    </group>
  );
}

function CalligraphyPanel({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group position={[0, h / 2, 0]}>
      <RoundedBox args={[w, h, 0.04]} radius={0.01} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.6} />
      </RoundedBox>
      {/* Stylized strokes — three brass sweeps */}
      <RoundedBox args={[w * 0.7, 0.04, 0.005]} radius={0.005} position={[0, h * 0.05, 0.025]}>
        <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
      </RoundedBox>
      <RoundedBox args={[w * 0.5, 0.06, 0.005]} radius={0.005} position={[-w * 0.08, -h * 0.08, 0.025]}>
        <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
      </RoundedBox>
      <Sphere args={[0.025, 16, 16]} position={[w * 0.18, -h * 0.1, 0.025]}>
        <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
      </Sphere>
    </group>
  );
}

function WallSculpture({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group position={[0, h / 2, 0]}>
      {Array.from({length: 5}).map((_, i) => (
        <Cylinder
          key={i}
          args={[0.04 + i * 0.01, 0.04 + i * 0.01, 0.04, 16]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[(i - 2) * (w / 6), Math.sin(i) * h * 0.2, 0]}
        >
          <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.2} />
        </Cylinder>
      ))}
    </group>
  );
}

function KitchenIsland({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, h - 0.05, d]} radius={0.02} position={[0, (h - 0.05) / 2, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.55} />
      </RoundedBox>
      <RoundedBox args={[w * 1.02, 0.05, d * 1.05]} radius={0.01} position={[0, h - 0.025, 0]} castShadow>
        <meshStandardMaterial color={'#E5DDD0'} roughness={0.4} />
      </RoundedBox>
      {/* Drawer pulls */}
      {[-w * 0.28, 0, w * 0.28].map((dx, i) => (
        <Cylinder key={i} args={[0.012, 0.012, 0.14]} position={[dx, h * 0.55, d / 2 + 0.005]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
        </Cylinder>
      ))}
    </group>
  );
}

function BarCounter({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return <KitchenIsland w={w} d={d} h={h} palette={palette} />;
}

function BathTub({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.18} smoothness={6} position={[0, h / 2, 0]} castShadow>
        <meshStandardMaterial color={'#FAFAF7'} roughness={0.4} metalness={0.1} />
      </RoundedBox>
      {/* Inner inset */}
      <RoundedBox args={[w * 0.85, h * 0.7, d * 0.78]} radius={0.16} position={[0, h * 0.6, 0]}>
        <meshStandardMaterial color={palette.secondary} roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

function Vanity({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <group>
      <RoundedBox args={[w, h - 0.05, d]} radius={0.02} position={[0, (h - 0.05) / 2, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.55} />
      </RoundedBox>
      <RoundedBox args={[w * 1.02, 0.04, d * 1.04]} radius={0.005} position={[0, h - 0.02, 0]} castShadow>
        <meshStandardMaterial color={'#E5DDD0'} roughness={0.4} />
      </RoundedBox>
      <Cylinder args={[0.015, 0.015, 0.28]} position={[0, h + 0.14, d * 0.1]}>
        <meshStandardMaterial color={palette.brass} metalness={0.9} roughness={0.18} />
      </Cylinder>
    </group>
  );
}

function Drapes({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group>
      {Array.from({length: 8}).map((_, i) => (
        <Cylinder
          key={i}
          args={[w / 22, w / 22, h, 8]}
          position={[(i - 3.5) * (w / 9), h / 2, 0]}
          castShadow
        >
          <meshStandardMaterial color={palette.primary} roughness={0.85} />
        </Cylinder>
      ))}
      {/* Rod */}
      <Cylinder args={[0.018, 0.018, w * 1.05]} position={[0, h - 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
      </Cylinder>
    </group>
  );
}

function Cushion({w, d, h, palette}: {w: number; d: number; h: number; palette: Palette}) {
  return (
    <RoundedBox args={[w, h, d]} radius={0.04} position={[0, h / 2, 0]} castShadow>
      <meshStandardMaterial color={palette.primary} roughness={0.85} />
    </RoundedBox>
  );
}

function Tree({h, palette}: {h: number; palette: Palette}) {
  return (
    <group>
      {/* Pot */}
      <Cylinder args={[0.22, 0.16, h * 0.18]} position={[0, h * 0.09, 0]} castShadow>
        <meshStandardMaterial color={palette.secondary} roughness={0.7} />
      </Cylinder>
      {/* Trunk */}
      <Cylinder args={[0.04, 0.06, h * 0.55]} position={[0, h * 0.18 + (h * 0.55) / 2, 0]} castShadow>
        <meshStandardMaterial color={'#5C3A24'} roughness={0.7} />
      </Cylinder>
      {/* Foliage clusters */}
      {[
        {x: 0, y: 0.78, r: 0.32},
        {x: 0.18, y: 0.85, r: 0.22},
        {x: -0.18, y: 0.82, r: 0.24},
        {x: 0, y: 0.95, r: 0.18},
      ].map((c, i) => (
        <Sphere key={i} args={[c.r, 16, 16]} position={[c.x, h * c.y, 0]} castShadow>
          <meshStandardMaterial color={palette.primary} roughness={0.85} />
        </Sphere>
      ))}
    </group>
  );
}

function PlanterStand({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group>
      {[0, 120, 240].map((deg, i) => {
        const x = Math.cos((deg * Math.PI) / 180) * (w / 4);
        const z = Math.sin((deg * Math.PI) / 180) * (w / 4);
        return (
          <Cylinder key={i} args={[0.012, 0.012, h]} position={[x, h / 2, z]} rotation={[0, 0, 0]} castShadow>
            <meshStandardMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
          </Cylinder>
        );
      })}
      <Cylinder args={[w * 0.4, w * 0.35, h * 0.3]} position={[0, h * 0.85, 0]} castShadow>
        <meshStandardMaterial color={palette.primary} roughness={0.7} />
      </Cylinder>
    </group>
  );
}

function Tray({w, d, palette}: {w: number; d: number; palette: Palette}) {
  return (
    <group>
      <Cylinder args={[w / 2, w / 2, 0.03, 48]} position={[0, 0.015, 0]} castShadow>
        <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[w / 2 * 0.9, w / 2 * 0.9, 0.04, 48]} position={[0, 0.038, 0]}>
        <meshPhysicalMaterial color={palette.brass} metalness={0.85} roughness={0.25} />
      </Cylinder>
    </group>
  );
}

function Dallah({h, palette}: {h: number; palette: Palette}) {
  return (
    <group>
      {/* Body */}
      <Cylinder args={[0.09, 0.12, h * 0.55]} position={[0, h * 0.27, 0]} castShadow>
        <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.18} />
      </Cylinder>
      {/* Top */}
      <Cylinder args={[0.07, 0.09, h * 0.18]} position={[0, h * 0.65, 0]} castShadow>
        <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.18} />
      </Cylinder>
      {/* Spout */}
      <RoundedBox args={[0.18, 0.04, 0.04]} radius={0.015} position={[0.12, h * 0.55, 0]} rotation={[0, 0, -0.3]} castShadow>
        <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.18} />
      </RoundedBox>
      {/* Lid */}
      <Sphere args={[0.06, 16, 16]} position={[0, h * 0.78, 0]}>
        <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.18} />
      </Sphere>
      {/* Handle */}
      <RoundedBox args={[0.02, h * 0.4, 0.02]} radius={0.005} position={[-0.13, h * 0.3, 0]} rotation={[0, 0, 0.4]}>
        <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.18} />
      </RoundedBox>
    </group>
  );
}

function Vase({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <Cylinder args={[w / 2, w / 2 * 0.7, h, 24]} position={[0, h / 2, 0]} castShadow>
      <meshStandardMaterial color={palette.primary} roughness={0.5} metalness={0.1} />
    </Cylinder>
  );
}

function CandleHolder({w, h, palette}: {w: number; h: number; palette: Palette}) {
  return (
    <group>
      <Cylinder args={[w / 2, w / 2 * 1.2, 0.04]} position={[0, 0.02, 0]} castShadow>
        <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.012, 0.012, h * 0.8]} position={[0, h * 0.4, 0]} castShadow>
        <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[w * 0.18, w * 0.18, 0.06]} position={[0, h * 0.83, 0]}>
        <meshPhysicalMaterial color={palette.brass} metalness={0.9} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.018, 0.018, 0.06]} position={[0, h * 0.92, 0]}>
        <meshStandardMaterial color={'#FAFAF7'} roughness={0.7} emissive={'#FFE6B0'} emissiveIntensity={0.4} />
      </Cylinder>
    </group>
  );
}
