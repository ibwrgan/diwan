'use client';

import {Canvas} from '@react-three/fiber';
import {OrbitControls, Environment, ContactShadows} from '@react-three/drei';
import {useEffect, useMemo, useRef, useState} from 'react';
import {Camera as CameraIcon, X, RotateCw, AlertCircle} from 'lucide-react';
import type {FurnitureItem} from '@/data/furnitureCatalog';
import {FurnitureGeometry, type Palette} from './FurniturePreview3D';

// Camera AR fallback for browsers/devices without Scene Viewer / WebXR /
// Quick Look. Opens the device camera via getUserMedia, shows the live
// feed fullscreen, and overlays the procedural Three.js furniture model
// on top with drag-to-rotate + pinch-to-scale gestures. Not "true" AR
// (no surface tracking) but lets the user see how a piece looks in
// their room on any device with a camera.

type Props = {
  item: FurnitureItem;
  onClose: () => void;
};

export function CameraARFallback({item, onClose}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotY, setRotY] = useState(0);

  const palette = useMemo<Palette>(() => {
    const safe = item.paletteHex.filter(Boolean);
    return {
      primary: safe[0] ?? '#B8552E',
      secondary: safe[1] ?? '#B89968',
      accent: safe[2] ?? '#D9886B',
      brass: '#B89968',
      ink: '#1F1A14',
    };
  }, [item.paletteHex]);

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;
    (async () => {
      try {
        // Prefer back camera on mobile; fall back to any camera otherwise.
        stream = await navigator.mediaDevices.getUserMedia({
          video: {facingMode: {ideal: 'environment'}, width: {ideal: 1920}, height: {ideal: 1080}},
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setStreamReady(true);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Camera unavailable';
        setError(msg);
      }
    })();
    return () => {
      cancelled = true;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Pinch-to-scale + drag-to-rotate via pointer events
  const dragRef = useRef<{x: number; rot: number} | null>(null);
  const pinchRef = useRef<{dist: number; scale: number} | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = {x: e.clientX, rot: rotY};
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    setRotY(dragRef.current.rot + dx * 0.008);
  }
  function onPointerUp(e: React.PointerEvent) {
    dragRef.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const next = Math.max(0.4, Math.min(2.5, scale - e.deltaY * 0.001));
    setScale(next);
  }
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = {dist: Math.hypot(dx, dy), scale};
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const d = Math.hypot(dx, dy);
      const next = Math.max(0.4, Math.min(2.5, pinchRef.current.scale * (d / pinchRef.current.dist)));
      setScale(next);
    }
  }
  function onTouchEnd() {
    pinchRef.current = null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 3D model overlay */}
      <div
        className="absolute inset-0"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{touchAction: 'none'}}
      >
        <Canvas
          shadows
          camera={{position: [0, 1.6, 3.2], fov: 48}}
          style={{background: 'transparent'}}
          gl={{alpha: true, antialias: true}}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 4, 2]} intensity={1.0} castShadow />
          <pointLight position={[-2, 2.5, -2]} intensity={0.4} color={palette.brass} />
          <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={6} blur={2.2} far={1.8} />

          <group rotation={[0, rotY, 0]} scale={scale}>
            <FurnitureGeometry item={item} palette={palette} />
          </group>

          <OrbitControls
            enablePan={false}
            enableZoom
            enableRotate={false}
            target={[0, item.dimensionsCm.h / 200, 0]}
            minDistance={1.5}
            maxDistance={6}
          />
          <Environment preset="apartment" />
        </Canvas>
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex flex-col">
          <span className="font-mono uppercase text-bone/85" style={{fontSize: '10px', letterSpacing: '0.22em'}}>
            DIWAN · LIVE PREVIEW
          </span>
          <h2 className="font-serif font-bold text-bone mt-1" style={{fontSize: '17px'}}>
            {item.nameEn}
          </h2>
          <span className="font-mono text-bone/65 tabular" style={{fontSize: '11px'}}>
            {item.dimensionsCm.w}×{item.dimensionsCm.d}×{item.dimensionsCm.h} cm
          </span>
        </div>
        <button
          onClick={onClose}
          className="bg-bone/15 hover:bg-bone/25 backdrop-blur-sm text-bone p-2 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom hint bar */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-5 bg-gradient-to-t from-black/75 to-transparent">
        <div className="max-w-md mx-auto flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => { setRotY(0); setScale(1); }}
              className="inline-flex items-center gap-1.5 bg-bone/15 hover:bg-bone/25 backdrop-blur-sm text-bone rounded-full px-4 py-2 transition-colors"
              style={{fontSize: '12px'}}
            >
              <RotateCw className="h-3.5 w-3.5" />
              Reset
            </button>
            <span className="inline-flex items-center gap-1.5 bg-bone/15 backdrop-blur-sm text-bone rounded-full px-4 py-2" style={{fontSize: '12px'}}>
              <CameraIcon className="h-3.5 w-3.5" />
              {Math.round(scale * 100)}%
            </span>
          </div>
          <p className="text-bone/85 text-center font-sans" style={{fontSize: '12px'}}>
            Drag to rotate · pinch or scroll to scale · point your camera at where you want the piece
          </p>
        </div>
      </div>

      {error && (
        <div className="relative z-20 m-auto max-w-sm bg-bone rounded-sm p-6 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-clay-700" />
          <h3 className="font-serif font-bold" style={{fontSize: '17px'}}>Camera permission needed</h3>
          <p className="font-sans text-ink-60" style={{fontSize: '13px'}}>
            Allow camera access in your browser to preview {item.nameEn} in your room.
          </p>
          <p className="font-mono text-ink-60" style={{fontSize: '10px'}}>
            {error}
          </p>
          <button onClick={onClose} className="btn-ghost mt-2">
            Close
          </button>
        </div>
      )}

      {!streamReady && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 pointer-events-none">
          <span className="font-mono uppercase text-bone" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
            Opening camera…
          </span>
        </div>
      )}
    </div>
  );
}
