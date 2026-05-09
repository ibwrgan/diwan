'use client';

import {motion} from 'framer-motion';

// Professional motion-graphics scenes for the pitch reel.
// Real architectural photography backgrounds with refined SVG overlays
// (laser dots, distance readouts, floor plan tracing, AI mood-board cards,
// timeline progress, supplier-network nodes). NO illustrated figures.

const C = {
  bone: '#FAFAF7',
  sand: '#F4EFE6',
  brass: '#B89968',
  clay: '#B8552E',
  clayLight: '#D9886B',
  midnight: '#1A1F2E',
  ink: '#1F1A14',
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

// SCENE 4 — AI design + free measurement
// Background: clean empty Saudi villa interior photo.
// Overlays:
//   1) iPad mood-board card slides in from left, then morphs into "Diwan AI"
//      render preview (right side of frame).
//   2) Laser dot lands on a wall, dotted measurement lines extend across
//      the room with monospace distance readouts (ITU-style).
//   3) A clean blueprint floor-plan traces itself in the bottom-right
//      corner with مجلس / صالة / مطبخ labels.
export function ServiceScene({progress}: {progress: number}) {
  const moodOpacity = clamp01(progress / 0.18);
  const renderOpacity = clamp01((progress - 0.22) / 0.18);
  const laserProgress = clamp01((progress - 0.42) / 0.22);
  const planProgress = clamp01((progress - 0.65) / 0.32);

  return (
    <div className="absolute inset-0">
      {/* Real photograph background — empty room */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{backgroundImage: `url('/pitch/empty-room.jpg')`}}
      />
      {/* Slight overlay for legibility */}
      <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(26,31,46,0.35), rgba(26,31,46,0.15))'}} />

      <svg
        viewBox="0 0 1600 900"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* iPad mood-board card — slides in from left */}
        <motion.g
          initial={{opacity: 0, x: -80}}
          animate={{opacity: moodOpacity, x: 0}}
          transition={{duration: 0.7, ease: 'easeOut'}}
        >
          <g transform="translate(120 130)">
            {/* iPad bezel */}
            <rect x="0" y="0" width="380" height="280" rx="18" fill={C.midnight} />
            {/* Screen */}
            <rect x="14" y="14" width="352" height="252" rx="6" fill={C.bone} />
            {/* Header bar */}
            <rect x="14" y="14" width="352" height="28" fill={C.sand} />
            <text x="190" y="33" fill={C.ink} fontSize="11" textAnchor="middle" fontFamily="monospace" letterSpacing="2">
              YOUR INSPIRATIONS
            </text>
            {/* Mood-board grid 3×3 with brand-color tiles */}
            {[
              {x: 22, y: 50,  c: C.clay},
              {x: 134, y: 50,  c: C.brass},
              {x: 246, y: 50,  c: C.midnight},
              {x: 22, y: 124, c: C.clayLight},
              {x: 134, y: 124, c: C.sand},
              {x: 246, y: 124, c: C.clay},
              {x: 22, y: 198, c: C.brass},
              {x: 134, y: 198, c: C.midnight},
              {x: 246, y: 198, c: C.clayLight},
            ].map((t, i) => (
              <motion.rect
                key={i}
                x={t.x}
                y={t.y}
                width="100"
                height="64"
                rx="3"
                fill={t.c}
                opacity={0.85}
                initial={{opacity: 0}}
                animate={{opacity: 0.85}}
                transition={{duration: 0.3, delay: 0.4 + i * 0.05}}
              />
            ))}
          </g>
        </motion.g>

        {/* Animated arrow + label "AI DESIGN" between mood-board and render */}
        <motion.g
          initial={{opacity: 0}}
          animate={{opacity: renderOpacity}}
          transition={{duration: 0.4}}
        >
          <line
            x1="510"
            y1="270"
            x2="700"
            y2="270"
            stroke={C.clay}
            strokeWidth="3"
            strokeDasharray="8 6"
          />
          <polygon points="700,260 720,270 700,280" fill={C.clay} />
          <rect x="540" y="248" width="140" height="22" rx="3" fill={C.midnight} />
          <text x="610" y="263" fill={C.bone} fontSize="11" textAnchor="middle" fontFamily="monospace" letterSpacing="2">
            DIWAN · AI
          </text>
        </motion.g>

        {/* Generated render preview window */}
        <motion.g
          initial={{opacity: 0, scale: 0.94}}
          animate={{opacity: renderOpacity, scale: 1}}
          transition={{duration: 0.6, ease: 'easeOut'}}
        >
          <g transform="translate(740 130)">
            <rect x="0" y="0" width="380" height="280" rx="6" fill={C.midnight} />
            {/* Faux interior render — abstracted */}
            <rect x="6" y="6" width="368" height="268" rx="3" fill="url(#renderGrad)" />
            <defs>
              <linearGradient id="renderGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.brass} stopOpacity="0.3" />
                <stop offset="50%" stopColor={C.clayLight} stopOpacity="0.4" />
                <stop offset="100%" stopColor={C.clay} stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Stylized majlis silhouettes */}
            <rect x="40" y="180" width="300" height="60" fill={C.clay} opacity="0.85" rx="4" />
            <rect x="60" y="120" width="80" height="60" fill={C.brass} opacity="0.7" />
            <rect x="160" y="80" width="100" height="100" fill={C.clayLight} opacity="0.5" />
            <line x1="40" y1="240" x2="340" y2="240" stroke={C.midnight} strokeOpacity="0.5" strokeWidth="2" />
            {/* Caption strip */}
            <rect x="6" y="248" width="368" height="26" fill={C.midnight} opacity="0.8" />
            <text x="190" y="266" fill={C.bone} fontSize="11" textAnchor="middle" fontFamily="monospace" letterSpacing="2">
              GENERATED IN 8s · MODERN NAJDI
            </text>
          </g>
        </motion.g>

        {/* Right side: measurement overlay */}
        <motion.g
          initial={{opacity: 0}}
          animate={{opacity: laserProgress}}
          transition={{duration: 0.4}}
        >
          {/* Laser beam crossing the empty room */}
          <line
            x1="1180"
            y1="690"
            x2="1500"
            y2="430"
            stroke={C.clay}
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          {/* Origin point (the "device") */}
          <circle cx="1180" cy="690" r="8" fill={C.clay} />
          <circle cx="1180" cy="690" r="14" fill="none" stroke={C.clay} strokeWidth="1.5" opacity="0.6" />

          {/* Pulsing target dot on wall */}
          <motion.circle
            cx="1500"
            cy="430"
            r="9"
            fill={C.clay}
            animate={{r: [9, 13, 9], opacity: [1, 0.6, 1]}}
            transition={{duration: 1.6, repeat: Infinity, ease: 'easeInOut'}}
          />
          <motion.circle
            cx="1500"
            cy="430"
            r="20"
            fill="none"
            stroke={C.clay}
            strokeWidth="1.5"
            animate={{r: [20, 32, 20], opacity: [0.7, 0, 0.7]}}
            transition={{duration: 1.6, repeat: Infinity, ease: 'easeOut'}}
          />

          {/* Distance readout */}
          <g transform="translate(1280 380)">
            <rect x="0" y="0" width="170" height="56" rx="4" fill={C.midnight} />
            <text x="14" y="22" fill={C.brass} fontSize="10" fontFamily="monospace" letterSpacing="2">
              DISTANCE
            </text>
            <text x="14" y="46" fill={C.bone} fontSize="22" fontFamily="monospace" fontWeight="bold">
              4.85 m
            </text>
          </g>

          {/* Secondary readout (height) */}
          <g transform="translate(1300 530)">
            <rect x="0" y="0" width="150" height="44" rx="4" fill={C.midnight} opacity="0.92" />
            <text x="12" y="18" fill={C.brass} fontSize="9" fontFamily="monospace" letterSpacing="2">
              CEILING H
            </text>
            <text x="12" y="38" fill={C.bone} fontSize="18" fontFamily="monospace" fontWeight="bold">
              3.20 m
            </text>
          </g>

          {/* Top-right corner label */}
          <g transform="translate(1400 130)">
            <rect x="0" y="0" width="160" height="28" rx="14" fill={C.bone} />
            <circle cx="18" cy="14" r="6" fill={C.clay} />
            <text x="34" y="19" fill={C.ink} fontSize="11" fontFamily="monospace" letterSpacing="2">
              MEASURING · LIVE
            </text>
          </g>
        </motion.g>

        {/* Floor plan tracing in bottom-right */}
        <motion.g
          initial={{opacity: 0}}
          animate={{opacity: planProgress}}
          transition={{duration: 0.5}}
        >
          <g transform="translate(1080 600)">
            <rect x="0" y="0" width="420" height="220" rx="4" fill={C.bone} stroke={C.midnight} strokeWidth="1.5" />
            <text x="14" y="22" fill={C.ink} fontSize="10" fontFamily="monospace" letterSpacing="3">
              D-2D-LAYOUT-001 · DIWAN
            </text>
            {/* Plan walls */}
            <motion.path
              d="M 30 50 L 200 50 L 200 130 L 30 130 Z"
              fill="none"
              stroke={C.clay}
              strokeWidth="2"
              initial={{pathLength: 0}}
              animate={{pathLength: planProgress}}
              transition={{duration: 1}}
            />
            <motion.path
              d="M 200 50 L 380 50 L 380 200 L 200 200 L 200 130"
              fill="none"
              stroke={C.clay}
              strokeWidth="2"
              initial={{pathLength: 0}}
              animate={{pathLength: planProgress}}
              transition={{duration: 1, delay: 0.3}}
            />
            <motion.path
              d="M 30 130 L 30 200 L 200 200"
              fill="none"
              stroke={C.clay}
              strokeWidth="2"
              initial={{pathLength: 0}}
              animate={{pathLength: planProgress}}
              transition={{duration: 1, delay: 0.6}}
            />
            <text x="115" y="93" fill={C.midnight} fontSize="12" fontFamily="monospace" textAnchor="middle">مجلس</text>
            <text x="290" y="128" fill={C.midnight} fontSize="12" fontFamily="monospace" textAnchor="middle">صالة</text>
            <text x="115" y="170" fill={C.midnight} fontSize="12" fontFamily="monospace" textAnchor="middle">مطبخ</text>
          </g>
        </motion.g>

        {/* Brand watermark */}
        <text x="60" y="850" fill={C.bone} opacity="0.45" fontSize="13" fontFamily="serif" letterSpacing="6">
          DIWAN — AI DESIGN · ON-SITE MEASUREMENT
        </text>
      </svg>
    </div>
  );
}

// SCENE 6 — Materials, supplier network, install, maintenance
// Background: real Najdi-styled interior in mid-installation.
// Overlays:
//   1) Material swatches sliding in as floating cards (left side).
//   2) Supplier network diagram fading in (top-right): central Diwan node
//      with N supplier nodes, single PO arrow back.
//   3) Installation timeline progress bar at bottom.
//   4) "12-MONTH WARRANTY" badge stamping into place at end.
export function InstallScene({progress}: {progress: number}) {
  const swatchOpacity = clamp01(progress / 0.2);
  const networkOpacity = clamp01((progress - 0.22) / 0.2);
  const timelineProgress = clamp01((progress - 0.4) / 0.4);
  const badgeProgress = clamp01((progress - 0.7) / 0.2);

  const SWATCHES = [
    {label: 'CARVED CEDAR', color: '#7A4A2A'},
    {label: 'HAMMERED BRASS', color: C.brass},
    {label: 'LIMESTONE', color: '#D8CFB8'},
    {label: 'CLAY VELVET', color: C.clayLight},
    {label: 'MUD PLASTER', color: '#B58A60'},
  ];

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{backgroundImage: `url('/pitch/install-progress.jpg')`}}
      />
      <div className="absolute inset-0" style={{background: 'linear-gradient(180deg, rgba(26,31,46,0.18), rgba(26,31,46,0.55))'}} />

      <svg
        viewBox="0 0 1600 900"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Material swatch cards on the left */}
        {SWATCHES.map((s, i) => (
          <motion.g
            key={s.label}
            initial={{opacity: 0, x: -60}}
            animate={{opacity: swatchOpacity, x: 0}}
            transition={{duration: 0.5, delay: i * 0.12}}
          >
            <g transform={`translate(80 ${160 + i * 100})`}>
              <rect x="0" y="0" width="280" height="80" rx="6" fill={C.bone} />
              <rect x="6" y="6" width="68" height="68" rx="3" fill={s.color} />
              <text x="90" y="35" fill={C.ink} fontSize="12" fontFamily="monospace" letterSpacing="2">
                {s.label}
              </text>
              <text x="90" y="58" fill={C.midnight} opacity="0.6" fontSize="10" fontFamily="monospace">
                SPECIFIED · DIWAN
              </text>
              <circle cx="258" cy="40" r="6" fill={C.clay} />
            </g>
          </motion.g>
        ))}

        {/* Supplier network diagram, top-right */}
        <motion.g
          initial={{opacity: 0}}
          animate={{opacity: networkOpacity}}
          transition={{duration: 0.6}}
        >
          <g transform="translate(1050 110)">
            {/* Central Diwan node */}
            <circle cx="220" cy="160" r="46" fill={C.clay} />
            <text x="220" y="158" fill={C.bone} fontSize="13" fontFamily="serif" textAnchor="middle" fontWeight="bold">
              DIWAN
            </text>
            <text x="220" y="174" fill={C.bone} fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.85">
              SINGLE PO
            </text>

            {/* 6 satellite supplier nodes */}
            {[
              {x: 60,  y: 30,  label: 'CRAFT'},
              {x: 380, y: 30,  label: 'TEXTILE'},
              {x: 30,  y: 160, label: 'STONE'},
              {x: 410, y: 160, label: 'METAL'},
              {x: 60,  y: 290, label: 'WOOD'},
              {x: 380, y: 290, label: 'LIGHT'},
            ].map((s, i) => (
              <motion.g
                key={s.label}
                initial={{opacity: 0}}
                animate={{opacity: networkOpacity}}
                transition={{duration: 0.4, delay: 0.2 + i * 0.08}}
              >
                <line
                  x1="220"
                  y1="160"
                  x2={s.x}
                  y2={s.y}
                  stroke={C.brass}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.7"
                />
                <circle cx={s.x} cy={s.y} r="22" fill={C.bone} stroke={C.brass} strokeWidth="2" />
                <text x={s.x} y={s.y + 4} fill={C.ink} fontSize="9" fontFamily="monospace" textAnchor="middle">
                  {s.label}
                </text>
              </motion.g>
            ))}
            <text x="220" y="360" fill={C.bone} fontSize="11" fontFamily="monospace" textAnchor="middle" letterSpacing="2">
              WIDE SUPPLIER NETWORK
            </text>
          </g>
        </motion.g>

        {/* Installation timeline at bottom */}
        <motion.g
          initial={{opacity: 0}}
          animate={{opacity: clamp01(timelineProgress * 4)}}
          transition={{duration: 0.4}}
        >
          <g transform="translate(80 720)">
            <text x="0" y="0" fill={C.bone} fontSize="11" fontFamily="monospace" letterSpacing="3" opacity="0.85">
              PROJECT TIMELINE · DAY 1 → DAY 30
            </text>
            <rect x="0" y="14" width="1440" height="14" rx="7" fill={C.midnight} opacity="0.55" />
            <motion.rect
              x="0"
              y="14"
              width={1440 * timelineProgress}
              height="14"
              rx="7"
              fill={C.clay}
              transition={{duration: 0.5}}
            />
            {/* Phase markers */}
            {[
              {pct: 0.18, label: 'BRIEF'},
              {pct: 0.55, label: 'PRODUCTION'},
              {pct: 0.85, label: 'INSTALL'},
              {pct: 0.99, label: 'HANDOVER'},
            ].map((m) => (
              <g key={m.label} transform={`translate(${1440 * m.pct} 0)`}>
                <line x1="0" y1="14" x2="0" y2="34" stroke={C.bone} strokeWidth="2" opacity="0.7" />
                <text x="0" y="50" fill={C.bone} fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="1.5" opacity="0.85">
                  {m.label}
                </text>
              </g>
            ))}
          </g>
        </motion.g>

        {/* 12-month warranty badge — appears at end */}
        <motion.g
          initial={{opacity: 0, scale: 0.6, rotate: -8}}
          animate={{opacity: badgeProgress, scale: 1, rotate: 0}}
          transition={{duration: 0.5, ease: 'easeOut'}}
        >
          <g transform="translate(700 520)">
            <circle cx="0" cy="0" r="100" fill={C.clay} />
            <circle cx="0" cy="0" r="90" fill="none" stroke={C.bone} strokeWidth="2" opacity="0.6" />
            <text x="0" y="-22" fill={C.bone} fontSize="14" fontFamily="serif" textAnchor="middle" fontWeight="bold" letterSpacing="3">
              DIWAN
            </text>
            <text x="0" y="-2" fill={C.bone} fontSize="36" fontFamily="serif" textAnchor="middle" fontWeight="bold">
              12
            </text>
            <text x="0" y="22" fill={C.bone} fontSize="12" fontFamily="monospace" textAnchor="middle" letterSpacing="2">
              MONTHS
            </text>
            <text x="0" y="42" fill={C.bone} fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="2" opacity="0.8">
              MAINTENANCE
            </text>
          </g>
        </motion.g>

        {/* Brand watermark */}
        <text x="60" y="850" fill={C.bone} opacity="0.45" fontSize="13" fontFamily="serif" letterSpacing="6">
          DIWAN — MATERIALS · INSTALL · 12-MONTH AFTERCARE
        </text>
      </svg>
    </div>
  );
}
