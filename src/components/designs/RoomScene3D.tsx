'use client';

import {Canvas} from '@react-three/fiber';
import {OrbitControls, Environment} from '@react-three/drei';
import {useMemo} from 'react';
import type {DesignBrief} from '@/lib/ai/types';
import type {RoomType} from '@/data/roomTypes';

type Props = {
  room: DesignBrief['rooms'][number] & {widthM?: number; heightM?: number};
  palette: string[];
};

// Procedurally renders a room from its dimensions and the concept's palette.
// Each room type gets a different furniture arrangement so the same plan
// produces visibly different rooms.

export function RoomScene3D({room, palette}: Props) {
  const widthM = room.widthM ?? 5;
  const lengthM = room.heightM ?? 4;
  const heightM = 3;

  const colors = useMemo(() => {
    const safe = palette.filter(Boolean);
    return {
      floor: safe[3] ?? '#DDD3C3',
      wall:  safe[2] ?? '#F4EFE6',
      accent: safe[0] ?? '#B8552E',
      wood:  safe[1] ?? '#B89968',
      ink:   safe[4] ?? '#1F1A14',
    };
  }, [palette]);

  return (
    <Canvas
      shadows
      camera={{position: [widthM * 0.7, heightM * 1.5, lengthM * 1.3], fov: 50}}
      style={{background: 'linear-gradient(180deg, #F4EFE6 0%, #DDD3C3 100%)'}}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[widthM, heightM * 2, lengthM * 0.8]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-widthM, heightM * 1.2, -lengthM]} intensity={0.4} color="#B89968" />

      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[widthM / 2, 0, lengthM / 2]}>
        <planeGeometry args={[widthM, lengthM]} />
        <meshStandardMaterial color={colors.floor} roughness={0.9} />
      </mesh>

      {/* Walls — back and left only so the camera can see in */}
      <mesh receiveShadow position={[widthM / 2, heightM / 2, 0]}>
        <boxGeometry args={[widthM, heightM, 0.1]} />
        <meshStandardMaterial color={colors.wall} roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[0, heightM / 2, lengthM / 2]}>
        <boxGeometry args={[0.1, heightM, lengthM]} />
        <meshStandardMaterial color={colors.wall} roughness={0.95} />
      </mesh>

      {/* Furniture — varies by room type */}
      <Furniture roomType={room.roomType} widthM={widthM} lengthM={lengthM} colors={colors} />

      {/* Light fixture (single pendant suggestion) */}
      <mesh position={[widthM / 2, heightM - 0.5, lengthM / 2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.6} />
      </mesh>

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

function Furniture({
  roomType,
  widthM,
  lengthM,
  colors,
}: {
  roomType: RoomType;
  widthM: number;
  lengthM: number;
  colors: {floor: string; wall: string; accent: string; wood: string; ink: string};
}) {
  switch (roomType) {
    case 'majlis-men':
    case 'majlis-women':
      return (
        <>
          {/* Low majlis seating around the perimeter */}
          <Box pos={[widthM * 0.5, 0.25, 0.45]} size={[widthM * 0.7, 0.5, 0.7]} color={colors.accent} />
          <Box pos={[0.45, 0.25, lengthM * 0.5]} size={[0.7, 0.5, lengthM * 0.6]} color={colors.accent} />
          <Box pos={[widthM - 0.45, 0.25, lengthM * 0.5]} size={[0.7, 0.5, lengthM * 0.6]} color={colors.accent} />
          {/* Central low table */}
          <Box pos={[widthM / 2, 0.2, lengthM / 2 + 0.3]} size={[widthM * 0.4, 0.4, 0.8]} color={colors.wood} />
          {/* Rug */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[widthM / 2, 0.005, lengthM / 2 + 0.3]}>
            <planeGeometry args={[widthM * 0.7, lengthM * 0.5]} />
            <meshStandardMaterial color={colors.ink} roughness={1} />
          </mesh>
        </>
      );
    case 'family-living':
      return (
        <>
          {/* Sectional sofa */}
          <Box pos={[widthM * 0.5, 0.45, 0.5]} size={[widthM * 0.7, 0.9, 0.8]} color={colors.accent} />
          <Box pos={[0.5, 0.45, lengthM * 0.4]} size={[0.8, 0.9, lengthM * 0.4]} color={colors.accent} />
          {/* Coffee table */}
          <Box pos={[widthM * 0.5, 0.18, lengthM * 0.45]} size={[widthM * 0.35, 0.36, 0.7]} color={colors.wood} />
          {/* TV unit */}
          <Box pos={[widthM * 0.5, 0.4, lengthM - 0.25]} size={[widthM * 0.6, 0.8, 0.35]} color={colors.ink} />
        </>
      );
    case 'master-bedroom':
      return (
        <>
          {/* Bed */}
          <Box pos={[widthM * 0.5, 0.4, lengthM * 0.45]} size={[widthM * 0.55, 0.8, lengthM * 0.7]} color={colors.wood} />
          {/* Headboard */}
          <Box pos={[widthM * 0.5, 0.9, 0.1]} size={[widthM * 0.65, 1.6, 0.15]} color={colors.accent} />
          {/* Side tables */}
          <Box pos={[widthM * 0.18, 0.25, 0.35]} size={[0.5, 0.5, 0.5]} color={colors.wood} />
          <Box pos={[widthM * 0.82, 0.25, 0.35]} size={[0.5, 0.5, 0.5]} color={colors.wood} />
        </>
      );
    case 'kids-bedroom':
      return (
        <>
          <Box pos={[widthM * 0.3, 0.35, lengthM * 0.5]} size={[widthM * 0.4, 0.7, lengthM * 0.6]} color={colors.accent} />
          <Box pos={[widthM * 0.8, 0.5, lengthM * 0.7]} size={[widthM * 0.3, 1, 0.5]} color={colors.wood} />
        </>
      );
    case 'kitchen':
      return (
        <>
          {/* Cabinetry */}
          <Box pos={[widthM * 0.5, 0.45, 0.3]} size={[widthM * 0.85, 0.9, 0.55]} color={colors.wood} />
          <Box pos={[widthM * 0.5, 1.3, 0.2]} size={[widthM * 0.85, 0.7, 0.35]} color={colors.wall} />
          {/* Island */}
          <Box pos={[widthM * 0.5, 0.45, lengthM * 0.55]} size={[widthM * 0.55, 0.9, 0.85]} color={colors.floor} />
        </>
      );
    case 'dining':
      return (
        <>
          {/* Long dining table */}
          <Box pos={[widthM * 0.5, 0.4, lengthM * 0.5]} size={[widthM * 0.18, 0.8, lengthM * 0.65]} color={colors.wood} />
          {/* Chairs (simplified: 8 boxes) */}
          {[-1, 1].map((side) =>
            [0.2, 0.4, 0.6, 0.8].map((t) => (
              <Box
                key={`${side}-${t}`}
                pos={[widthM * 0.5 + side * widthM * 0.16, 0.25, lengthM * t]}
                size={[0.4, 0.5, 0.4]}
                color={colors.accent}
              />
            )),
          )}
        </>
      );
    case 'office':
      return (
        <>
          <Box pos={[widthM * 0.5, 0.4, lengthM * 0.4]} size={[widthM * 0.6, 0.8, 0.7]} color={colors.wood} />
          <Box pos={[widthM * 0.5, 0.5, lengthM * 0.7]} size={[0.5, 1, 0.5]} color={colors.accent} />
          {/* Bookshelf */}
          <Box pos={[widthM - 0.2, 1, lengthM / 2]} size={[0.35, 2, lengthM * 0.7]} color={colors.wood} />
        </>
      );
    case 'bathroom':
      return (
        <>
          {/* Vanity */}
          <Box pos={[widthM * 0.5, 0.45, 0.3]} size={[widthM * 0.7, 0.9, 0.55]} color={colors.floor} />
          {/* Mirror */}
          <Box pos={[widthM * 0.5, 1.4, 0.1]} size={[widthM * 0.5, 0.7, 0.05]} color={colors.ink} />
          {/* Tub */}
          <Box pos={[widthM * 0.5, 0.3, lengthM - 0.45]} size={[widthM * 0.7, 0.6, 0.7]} color={colors.wall} />
        </>
      );
    default:
      // Generic furniture for any other room type
      return (
        <Box pos={[widthM * 0.5, 0.4, lengthM * 0.5]} size={[widthM * 0.55, 0.8, lengthM * 0.5]} color={colors.accent} />
      );
  }
}

function Box({pos, size, color}: {pos: [number, number, number]; size: [number, number, number]; color: string}) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}
