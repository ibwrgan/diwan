'use client';

import {Canvas} from '@react-three/fiber';
import {OrbitControls, Environment, RoundedBox, Cylinder, Sphere} from '@react-three/drei';
import {useMemo} from 'react';
import * as THREE from 'three';
import type {DesignBrief} from '@/lib/ai/types';
import type {RoomType} from '@/data/roomTypes';

type Props = {
  room: DesignBrief['rooms'][number] & {widthM?: number; heightM?: number};
  palette: string[];
};

// Procedurally renders a Saudi-style room interior. Furniture is composed
// from many primitives (cushions, legs, armrests, headboards, lampshades,
// rugs, bookshelves) to read as real pieces — not flat boxes. Materials
// distinguish fabric / wood / metal / stone.

export function RoomScene3D({room, palette}: Props) {
  const widthM = room.widthM ?? 5;
  const lengthM = room.heightM ?? 4;
  const heightM = 3;

  const colors = useMemo(() => {
    const safe = palette.filter(Boolean);
    return {
      floor:  safe[3] ?? '#DDD3C3',
      wall:   safe[2] ?? '#F4EFE6',
      accent: safe[0] ?? '#B8552E',
      wood:   safe[1] ?? '#8B5A3C',
      ink:    safe[4] ?? '#1F1A14',
      brass:  '#B89968',
      cream:  '#FAFAF7',
    };
  }, [palette]);

  return (
    <Canvas
      shadows
      camera={{position: [widthM * 0.85, heightM * 1.4, lengthM * 1.45], fov: 45}}
      style={{background: 'linear-gradient(180deg, #F4EFE6 0%, #C9BFA6 100%)'}}
      gl={{antialias: true, toneMappingExposure: 1.05}}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[widthM * 1.5, heightM * 2.4, lengthM * 0.8]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-near={0.5}
        shadow-camera-far={Math.max(widthM, lengthM) * 4}
        shadow-camera-left={-widthM}
        shadow-camera-right={widthM * 2}
        shadow-camera-top={lengthM * 2}
        shadow-camera-bottom={-lengthM}
      />
      {/* Warm fill — golden hour bounce */}
      <pointLight position={[widthM * 0.5, heightM * 0.7, lengthM * 0.5]} intensity={0.45} color={colors.brass} distance={Math.max(widthM, lengthM) * 1.5} />

      {/* Floor — wood plank look via subtle stripes */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[widthM / 2, 0, lengthM / 2]}>
        <planeGeometry args={[widthM, lengthM]} />
        <meshStandardMaterial color={colors.floor} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Walls — back wall with a Najdi arch motif */}
      <BackWall widthM={widthM} heightM={heightM} colors={colors} />
      <SideWall lengthM={lengthM} heightM={heightM} colors={colors} />

      {/* Window suggestion on the side wall */}
      <mesh position={[0.06, heightM * 0.55, lengthM * 0.55]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[lengthM * 0.45, heightM * 0.5]} />
        <meshStandardMaterial color={colors.cream} emissive={'#FFF8E7'} emissiveIntensity={0.15} roughness={0.4} />
      </mesh>

      {/* Furniture — varies by room type */}
      <Furniture roomType={room.roomType} widthM={widthM} lengthM={lengthM} colors={colors} />

      {/* Pendant light */}
      <PendantLight x={widthM / 2} y={heightM - 0.3} z={lengthM / 2} colors={colors} />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        target={[widthM / 2, heightM / 3, lengthM / 2]}
        minDistance={Math.min(widthM, lengthM) * 0.6}
        maxDistance={Math.max(widthM, lengthM) * 3}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
      <Environment preset="apartment" />
    </Canvas>
  );
}

type C = ReturnType<typeof Object.assign> & {
  floor: string; wall: string; accent: string; wood: string; ink: string; brass: string; cream: string;
};

function BackWall({widthM, heightM, colors}: {widthM: number; heightM: number; colors: C}) {
  // Back wall + a subtle Najdi arch silhouette as a feature panel
  return (
    <group>
      <mesh receiveShadow position={[widthM / 2, heightM / 2, 0]}>
        <boxGeometry args={[widthM, heightM, 0.12]} />
        <meshStandardMaterial color={colors.wall} roughness={0.95} />
      </mesh>
      {/* Mashrabiya feature — recessed panel with Najdi arch */}
      <mesh position={[widthM / 2, heightM / 2, 0.07]}>
        <boxGeometry args={[widthM * 0.4, heightM * 0.65, 0.04]} />
        <meshStandardMaterial color={colors.wood} roughness={0.65} />
      </mesh>
      {/* Najdi arch top */}
      <mesh position={[widthM / 2, heightM * 0.78, 0.085]}>
        <torusGeometry args={[widthM * 0.18, 0.04, 8, 24, Math.PI]} />
        <meshStandardMaterial color={colors.brass} metalness={0.65} roughness={0.35} />
      </mesh>
    </group>
  );
}

function SideWall({lengthM, heightM, colors}: {lengthM: number; heightM: number; colors: C}) {
  return (
    <mesh receiveShadow position={[0, heightM / 2, lengthM / 2]}>
      <boxGeometry args={[0.12, heightM, lengthM]} />
      <meshStandardMaterial color={colors.wall} roughness={0.95} />
    </mesh>
  );
}

function PendantLight({x, y, z, colors}: {x: number; y: number; z: number; colors: C}) {
  return (
    <group position={[x, y, z]}>
      {/* Cord */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.6]} />
        <meshStandardMaterial color={colors.ink} />
      </mesh>
      {/* Brass shade */}
      <mesh castShadow>
        <coneGeometry args={[0.18, 0.2, 16, 1, true]} />
        <meshPhysicalMaterial color={colors.brass} metalness={0.85} roughness={0.18} clearcoat={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Bulb glow */}
      <pointLight position={[0, -0.05, 0]} intensity={0.55} color={'#FFE6B0'} distance={3} />
      <Sphere args={[0.06, 16, 16]} position={[0, -0.08, 0]}>
        <meshStandardMaterial color={'#FFE6B0'} emissive={'#FFE6B0'} emissiveIntensity={1.5} />
      </Sphere>
    </group>
  );
}

// ── Reusable furniture primitives ──────────────────────────────────────────

function Sofa({x, z, w, d, color, brass}: {x: number; z: number; w: number; d: number; color: string; brass: string}) {
  // Sofa base + back + 2 armrests + 3 cushions + 4 small wooden legs
  const baseH = 0.34;
  const backH = 0.55;
  const cushW = (w - 0.32) / 3;
  return (
    <group position={[x, 0, z]}>
      {/* Base */}
      <RoundedBox args={[w, baseH, d]} radius={0.04} smoothness={3} position={[0, baseH / 2 + 0.1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.85} />
      </RoundedBox>
      {/* Back */}
      <RoundedBox args={[w, backH, 0.18]} radius={0.05} smoothness={3} position={[0, baseH + backH / 2 + 0.1, -d / 2 + 0.09]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.85} />
      </RoundedBox>
      {/* Left armrest */}
      <RoundedBox args={[0.18, baseH + backH * 0.7, d]} radius={0.05} smoothness={3} position={[-w / 2 + 0.09, (baseH + backH * 0.7) / 2 + 0.1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.85} />
      </RoundedBox>
      {/* Right armrest */}
      <RoundedBox args={[0.18, baseH + backH * 0.7, d]} radius={0.05} smoothness={3} position={[w / 2 - 0.09, (baseH + backH * 0.7) / 2 + 0.1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.85} />
      </RoundedBox>
      {/* 3 seat cushions */}
      {[-1, 0, 1].map((i) => (
        <RoundedBox
          key={i}
          args={[cushW, 0.14, d * 0.78]}
          radius={0.04}
          smoothness={3}
          position={[i * (cushW + 0.02), baseH + 0.07 + 0.1, 0.05]}
          castShadow
        >
          <meshStandardMaterial color={color} roughness={0.7} />
        </RoundedBox>
      ))}
      {/* 4 small brass legs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <Cylinder
          key={i}
          args={[0.025, 0.025, 0.1]}
          position={[sx * (w / 2 - 0.12), 0.05, sz * (d / 2 - 0.12)]}
        >
          <meshStandardMaterial color={brass} metalness={0.8} roughness={0.3} />
        </Cylinder>
      ))}
    </group>
  );
}

function Chair({x, z, color, brass, rotY = 0}: {x: number; z: number; color: string; brass: string; rotY?: number}) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* Seat */}
      <RoundedBox args={[0.46, 0.06, 0.46]} radius={0.04} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.7} />
      </RoundedBox>
      {/* Back */}
      <RoundedBox args={[0.46, 0.5, 0.06]} radius={0.03} position={[0, 0.7, -0.2]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.7} />
      </RoundedBox>
      {/* 4 legs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <Cylinder
          key={i}
          args={[0.018, 0.018, 0.45]}
          position={[sx * 0.2, 0.225, sz * 0.2]}
          castShadow
        >
          <meshStandardMaterial color={brass} metalness={0.7} roughness={0.32} />
        </Cylinder>
      ))}
    </group>
  );
}

function Table({x, z, w, d, color, brass}: {x: number; z: number; w: number; d: number; color: string; brass: string}) {
  return (
    <group position={[x, 0, z]}>
      {/* Top */}
      <RoundedBox args={[w, 0.06, d]} radius={0.025} position={[0, 0.74, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
      </RoundedBox>
      {/* Trim line under top */}
      <RoundedBox args={[w * 0.94, 0.012, d * 0.94]} radius={0.005} position={[0, 0.71, 0]}>
        <meshStandardMaterial color={brass} metalness={0.8} roughness={0.3} />
      </RoundedBox>
      {/* 4 legs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <Cylinder
          key={i}
          args={[0.03, 0.03, 0.7]}
          position={[sx * (w / 2 - 0.1), 0.36, sz * (d / 2 - 0.1)]}
          castShadow
        >
          <meshStandardMaterial color={color} roughness={0.55} />
        </Cylinder>
      ))}
    </group>
  );
}

function Bed({x, z, w, d, color, accent, brass}: {x: number; z: number; w: number; d: number; color: string; accent: string; brass: string}) {
  return (
    <group position={[x, 0, z]}>
      {/* Frame */}
      <RoundedBox args={[w, 0.22, d]} radius={0.02} position={[0, 0.21, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.6} />
      </RoundedBox>
      {/* Mattress */}
      <RoundedBox args={[w * 0.94, 0.18, d * 0.94]} radius={0.04} position={[0, 0.41, 0]} castShadow>
        <meshStandardMaterial color={'#FAFAF7'} roughness={0.8} />
      </RoundedBox>
      {/* Duvet folded near foot */}
      <RoundedBox args={[w * 0.94, 0.08, d * 0.36]} radius={0.03} position={[0, 0.51, d * 0.28]} castShadow>
        <meshStandardMaterial color={accent} roughness={0.85} />
      </RoundedBox>
      {/* 2 pillows */}
      {[-1, 1].map((s) => (
        <RoundedBox
          key={s}
          args={[w * 0.4, 0.08, d * 0.18]}
          radius={0.03}
          position={[s * w * 0.22, 0.55, -d * 0.32]}
          castShadow
        >
          <meshStandardMaterial color={'#F0E6D6'} roughness={0.85} />
        </RoundedBox>
      ))}
      {/* Headboard */}
      <RoundedBox args={[w * 1.05, 1.05, 0.12]} radius={0.03} position={[0, 0.95, -d / 2 - 0.06]} castShadow receiveShadow>
        <meshStandardMaterial color={accent} roughness={0.78} />
      </RoundedBox>
      {/* Brass bar on headboard */}
      <Cylinder args={[0.018, 0.018, w * 1.0]} position={[0, 1.1, -d / 2 - 0.04]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={brass} metalness={0.85} roughness={0.25} />
      </Cylinder>
    </group>
  );
}

function NightStand({x, z, color, brass}: {x: number; z: number; color: string; brass: string}) {
  return (
    <group position={[x, 0, z]}>
      <RoundedBox args={[0.5, 0.5, 0.4]} radius={0.025} position={[0, 0.27, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.6} />
      </RoundedBox>
      {/* Drawer pull */}
      <Cylinder args={[0.012, 0.012, 0.16]} position={[0, 0.4, 0.21]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <meshStandardMaterial color={brass} metalness={0.85} roughness={0.25} />
      </Cylinder>
      {/* Lamp */}
      <Cylinder args={[0.06, 0.06, 0.02]} position={[0, 0.535, 0]}>
        <meshStandardMaterial color={brass} metalness={0.7} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.005, 0.005, 0.22]} position={[0, 0.66, 0]}>
        <meshStandardMaterial color={brass} metalness={0.7} roughness={0.3} />
      </Cylinder>
      <mesh position={[0, 0.82, 0]}>
        <coneGeometry args={[0.12, 0.18, 16, 1, true]} />
        <meshStandardMaterial color={'#F0E6D6'} side={THREE.DoubleSide} roughness={0.7} emissive={'#FFE6B0'} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Rug({x, z, w, d, color, accent}: {x: number; z: number; w: number; d: number; color: string; accent: string}) {
  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      {/* Border stripe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <ringGeometry args={[Math.min(w, d) * 0.42, Math.min(w, d) * 0.45, 32, 1, 0, Math.PI * 2]} />
        <meshStandardMaterial color={accent} roughness={1} />
      </mesh>
    </group>
  );
}

function Plant({x, z, color, accent}: {x: number; z: number; color: string; accent: string}) {
  return (
    <group position={[x, 0, z]}>
      {/* Pot */}
      <Cylinder args={[0.16, 0.12, 0.28]} position={[0, 0.14, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Cylinder>
      {/* Foliage cluster */}
      <Sphere args={[0.22, 16, 16]} position={[0, 0.42, 0]} castShadow>
        <meshStandardMaterial color={accent} roughness={0.85} />
      </Sphere>
      <Sphere args={[0.16, 16, 16]} position={[0.12, 0.55, 0.05]}>
        <meshStandardMaterial color={accent} roughness={0.85} />
      </Sphere>
    </group>
  );
}

function Bookshelf({x, z, w, d, color, accent}: {x: number; z: number; w: number; d: number; color: string; accent: string}) {
  return (
    <group position={[x, 0, z]}>
      {/* Frame */}
      <RoundedBox args={[w, 1.9, d]} radius={0.02} position={[0, 0.95, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.6} />
      </RoundedBox>
      {/* Shelves visible as horizontal lines */}
      {[0.45, 0.85, 1.25, 1.65].map((y, i) => (
        <RoundedBox key={i} args={[w * 0.97, 0.02, d * 0.92]} radius={0.005} position={[0, y, 0]}>
          <meshStandardMaterial color={accent} roughness={0.6} />
        </RoundedBox>
      ))}
      {/* Some "books" — small accent boxes */}
      {[0.12, 0.55].map((y0, row) => (
        <group key={row} position={[0, 0.5 + y0, d * 0.35]}>
          {[-0.3, -0.15, 0, 0.15, 0.3].map((dx, i) => (
            <RoundedBox key={i} args={[0.05, 0.18, 0.12]} radius={0.005} position={[dx, 0, 0]}>
              <meshStandardMaterial color={i % 2 ? accent : color} roughness={0.7} />
            </RoundedBox>
          ))}
        </group>
      ))}
    </group>
  );
}

function VanityKitchen({x, z, w, d, color, accent, brass}: {x: number; z: number; w: number; d: number; color: string; accent: string; brass: string}) {
  return (
    <group position={[x, 0, z]}>
      {/* Lower cabinet */}
      <RoundedBox args={[w, 0.85, d]} radius={0.02} position={[0, 0.475, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.55} />
      </RoundedBox>
      {/* Counter top */}
      <RoundedBox args={[w * 1.02, 0.05, d * 1.04]} radius={0.01} position={[0, 0.92, 0]} castShadow>
        <meshStandardMaterial color={'#E5DDD0'} roughness={0.4} metalness={0.05} />
      </RoundedBox>
      {/* Upper cabinet */}
      <RoundedBox args={[w * 0.98, 0.7, d * 0.6]} radius={0.02} position={[0, 1.65, -d * 0.18]} castShadow>
        <meshStandardMaterial color={accent} roughness={0.55} />
      </RoundedBox>
      {/* Drawer pulls */}
      {[-w * 0.28, 0, w * 0.28].map((dx, i) => (
        <Cylinder key={i} args={[0.012, 0.012, 0.14]} position={[dx, 0.55, d / 2 + 0.005]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <meshStandardMaterial color={brass} metalness={0.85} roughness={0.25} />
        </Cylinder>
      ))}
      {/* Faucet */}
      <Cylinder args={[0.015, 0.015, 0.28]} position={[0, 1.06, d * 0.1]}>
        <meshStandardMaterial color={brass} metalness={0.9} roughness={0.18} />
      </Cylinder>
    </group>
  );
}

// ── Per-room compositions ───────────────────────────────────────────────────

function Furniture({roomType, widthM, lengthM, colors}: {roomType: RoomType; widthM: number; lengthM: number; colors: C}) {
  switch (roomType) {
    case 'majlis-men':
    case 'majlis-women':
      return (
        <>
          <Rug x={widthM / 2} z={lengthM / 2 + 0.2} w={widthM * 0.72} d={lengthM * 0.55} color={colors.ink} accent={colors.accent} />
          {/* Three perimeter sofas */}
          <Sofa x={widthM / 2} z={lengthM - 0.55} w={widthM * 0.72} d={0.85} color={colors.accent} brass={colors.brass} />
          {/* Side cushion stacks (low majlis vibe) */}
          {[0.35, 0.85, 1.45].map((zPos, i) => (
            <RoundedBox key={i} args={[0.7, 0.32, 0.7]} radius={0.05} position={[0.5, 0.16, zPos]} castShadow>
              <meshStandardMaterial color={i % 2 ? colors.accent : colors.wood} roughness={0.8} />
            </RoundedBox>
          ))}
          {[0.35, 0.85, 1.45].map((zPos, i) => (
            <RoundedBox key={i} args={[0.7, 0.32, 0.7]} radius={0.05} position={[widthM - 0.5, 0.16, zPos]} castShadow>
              <meshStandardMaterial color={i % 2 ? colors.wood : colors.accent} roughness={0.8} />
            </RoundedBox>
          ))}
          {/* Center coffee table */}
          <Table x={widthM / 2} z={lengthM / 2 + 0.2} w={widthM * 0.4} d={0.9} color={colors.wood} brass={colors.brass} />
          {/* Plant in a corner */}
          <Plant x={0.5} z={0.5} color={colors.wood} accent={colors.accent} />
        </>
      );
    case 'family-living':
      return (
        <>
          <Rug x={widthM / 2} z={lengthM / 2} w={widthM * 0.7} d={lengthM * 0.6} color={colors.wood} accent={colors.accent} />
          <Sofa x={widthM / 2} z={0.65} w={widthM * 0.78} d={0.95} color={colors.accent} brass={colors.brass} />
          <Table x={widthM / 2} z={lengthM * 0.5} w={widthM * 0.42} d={0.85} color={colors.wood} brass={colors.brass} />
          {/* TV unit */}
          <RoundedBox args={[widthM * 0.7, 0.45, 0.4]} radius={0.02} position={[widthM / 2, 0.225, lengthM - 0.25]} castShadow>
            <meshStandardMaterial color={colors.ink} roughness={0.5} />
          </RoundedBox>
          {/* TV screen */}
          <RoundedBox args={[widthM * 0.45, 0.7, 0.05]} radius={0.005} position={[widthM / 2, 0.85, lengthM - 0.18]}>
            <meshStandardMaterial color={'#0a0a0a'} roughness={0.18} metalness={0.4} />
          </RoundedBox>
          <Plant x={widthM - 0.4} z={lengthM - 0.5} color={colors.wood} accent={colors.accent} />
        </>
      );
    case 'master-bedroom':
      return (
        <>
          <Rug x={widthM / 2} z={lengthM * 0.55} w={widthM * 0.72} d={lengthM * 0.55} color={colors.wood} accent={colors.accent} />
          <Bed x={widthM / 2} z={lengthM * 0.5} w={widthM * 0.62} d={lengthM * 0.55} color={colors.wood} accent={colors.accent} brass={colors.brass} />
          <NightStand x={widthM * 0.18} z={lengthM * 0.22} color={colors.wood} brass={colors.brass} />
          <NightStand x={widthM * 0.82} z={lengthM * 0.22} color={colors.wood} brass={colors.brass} />
          <Bookshelf x={widthM - 0.25} z={lengthM - 0.7} w={0.4} d={0.85} color={colors.wood} accent={colors.accent} />
        </>
      );
    case 'kids-bedroom':
      return (
        <>
          <Rug x={widthM / 2} z={lengthM / 2} w={widthM * 0.6} d={lengthM * 0.5} color={colors.accent} accent={colors.wood} />
          <Bed x={widthM * 0.32} z={lengthM * 0.5} w={widthM * 0.42} d={lengthM * 0.65} color={colors.accent} accent={colors.wood} brass={colors.brass} />
          <Bookshelf x={widthM * 0.78} z={lengthM * 0.65} w={widthM * 0.32} d={0.45} color={colors.wood} accent={colors.accent} />
          <Plant x={widthM - 0.4} z={0.4} color={colors.wood} accent={colors.accent} />
        </>
      );
    case 'kitchen':
      return (
        <>
          <VanityKitchen x={widthM / 2} z={0.4} w={widthM * 0.85} d={0.7} color={colors.wood} accent={colors.wall} brass={colors.brass} />
          {/* Island */}
          <RoundedBox args={[widthM * 0.55, 0.92, 0.95]} radius={0.02} position={[widthM / 2, 0.46, lengthM * 0.55]} castShadow receiveShadow>
            <meshStandardMaterial color={colors.floor} roughness={0.55} />
          </RoundedBox>
          {/* Island countertop */}
          <RoundedBox args={[widthM * 0.58, 0.05, 1.0]} radius={0.01} position={[widthM / 2, 0.95, lengthM * 0.55]} castShadow>
            <meshStandardMaterial color={'#E5DDD0'} roughness={0.4} />
          </RoundedBox>
          {/* 3 bar stools */}
          {[-0.4, 0, 0.4].map((dx, i) => (
            <group key={i} position={[widthM / 2 + dx, 0, lengthM * 0.55 + 0.7]}>
              <Cylinder args={[0.18, 0.18, 0.05]} position={[0, 0.78, 0]} castShadow>
                <meshStandardMaterial color={colors.accent} roughness={0.7} />
              </Cylinder>
              <Cylinder args={[0.025, 0.025, 0.78]} position={[0, 0.39, 0]} castShadow>
                <meshStandardMaterial color={colors.brass} metalness={0.8} roughness={0.3} />
              </Cylinder>
            </group>
          ))}
        </>
      );
    case 'dining':
      return (
        <>
          <Rug x={widthM / 2} z={lengthM / 2} w={widthM * 0.55} d={lengthM * 0.85} color={colors.wood} accent={colors.accent} />
          <Table x={widthM / 2} z={lengthM / 2} w={widthM * 0.35} d={lengthM * 0.7} color={colors.wood} brass={colors.brass} />
          {/* Chairs along both long sides */}
          {[-1, 1].map((side) =>
            [0.18, 0.38, 0.58, 0.78].map((t) => (
              <Chair
                key={`${side}-${t}`}
                x={widthM / 2 + side * widthM * 0.2}
                z={lengthM * t}
                color={colors.accent}
                brass={colors.brass}
                rotY={side === -1 ? Math.PI / 2 : -Math.PI / 2}
              />
            )),
          )}
          {/* Head + foot chairs */}
          <Chair x={widthM / 2} z={lengthM * 0.07} color={colors.accent} brass={colors.brass} rotY={Math.PI} />
          <Chair x={widthM / 2} z={lengthM * 0.93} color={colors.accent} brass={colors.brass} />
          <Plant x={widthM - 0.4} z={0.4} color={colors.wood} accent={colors.accent} />
        </>
      );
    case 'office':
      return (
        <>
          <Rug x={widthM / 2} z={lengthM * 0.5} w={widthM * 0.5} d={lengthM * 0.5} color={colors.wood} accent={colors.accent} />
          <Table x={widthM / 2} z={lengthM * 0.4} w={widthM * 0.6} d={0.75} color={colors.wood} brass={colors.brass} />
          <Chair x={widthM / 2} z={lengthM * 0.7} color={colors.accent} brass={colors.brass} rotY={Math.PI} />
          <Bookshelf x={widthM - 0.25} z={lengthM / 2} w={0.4} d={lengthM * 0.7} color={colors.wood} accent={colors.accent} />
          <Plant x={0.55} z={lengthM - 0.5} color={colors.wood} accent={colors.accent} />
        </>
      );
    case 'bathroom':
      return (
        <>
          {/* Vanity with double sink hint */}
          <RoundedBox args={[widthM * 0.7, 0.85, 0.55]} radius={0.02} position={[widthM / 2, 0.475, 0.4]} castShadow receiveShadow>
            <meshStandardMaterial color={colors.wood} roughness={0.55} />
          </RoundedBox>
          <RoundedBox args={[widthM * 0.72, 0.04, 0.6]} radius={0.005} position={[widthM / 2, 0.92, 0.4]} castShadow>
            <meshStandardMaterial color={'#E5DDD0'} roughness={0.4} />
          </RoundedBox>
          {/* Mirror */}
          <RoundedBox args={[widthM * 0.55, 0.85, 0.04]} radius={0.005} position={[widthM / 2, 1.5, 0.07]}>
            <meshPhysicalMaterial color={'#E8EDF2'} metalness={0.6} roughness={0.05} clearcoat={1} />
          </RoundedBox>
          {/* Free-standing tub */}
          <group position={[widthM / 2, 0, lengthM - 0.6]}>
            <RoundedBox args={[widthM * 0.7, 0.55, 0.85]} radius={0.18} smoothness={5} position={[0, 0.32, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={colors.cream} roughness={0.4} metalness={0.1} />
            </RoundedBox>
          </group>
          {/* Plant */}
          <Plant x={widthM - 0.4} z={0.6} color={colors.wood} accent={colors.accent} />
        </>
      );
    case 'prayer':
      return (
        <>
          <Rug x={widthM / 2} z={lengthM * 0.55} w={widthM * 0.65} d={lengthM * 0.7} color={colors.accent} accent={colors.brass} />
          {/* Mihrab niche on back wall — already rendered by BackWall arch */}
          {/* Lectern */}
          <RoundedBox args={[0.45, 0.6, 0.35]} radius={0.02} position={[widthM / 2, 0.3, lengthM * 0.7]} castShadow>
            <meshStandardMaterial color={colors.wood} roughness={0.55} />
          </RoundedBox>
        </>
      );
    case 'storage':
      return (
        <>
          <Bookshelf x={widthM * 0.5} z={lengthM * 0.5} w={widthM * 0.85} d={0.55} color={colors.wood} accent={colors.accent} />
        </>
      );
    default:
      return (
        <Sofa x={widthM / 2} z={lengthM * 0.4} w={widthM * 0.6} d={0.9} color={colors.accent} brass={colors.brass} />
      );
  }
}
