'use client';

import {motion} from 'framer-motion';

// SVG-based motion-graphics scenes for the pitch reel.
// Faceless figures in Diwan-branded engineer coveralls, animated with
// framer-motion. No external photos — entirely vector, on-brand at any size.

const C = {
  bone: '#FAFAF7',
  sand: '#F4EFE6',
  limestone: '#DDD3C3',
  brass: '#B89968',
  clay: '#B8552E',
  clayLight: '#D9886B',
  midnight: '#1A1F2E',
  ink: '#1F1A14',
  skin: '#E8C9A8',
};

// A small reusable Najdi-arch chest mark used on coveralls and helmets.
function ChestMark({x, y, size = 1, color = C.bone}: {x: number; y: number; size?: number; color?: string}) {
  return (
    <g transform={`translate(${x},${y}) scale(${size})`}>
      <path d="M -10 5 V -8 a 10 10 0 0 1 20 0 V 5" stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M -5 5 V -3 a 5 5 0 0 1 10 0 V 5" stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.7} />
    </g>
  );
}

// Engineer figure with hard hat, Diwan-branded coverall, holding a tool.
function Engineer({x, y, scale = 1, holdingLaser = false, holdingTablet = false}: {x: number; y: number; scale?: number; holdingLaser?: boolean; holdingTablet?: boolean}) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {/* Hard hat */}
      <ellipse cx="0" cy="-118" rx="38" ry="24" fill={C.clayLight} />
      <rect x="-44" y="-114" width="88" height="8" fill={C.clayLight} rx="2" />
      <ChestMark x={0} y={-128} size={0.7} color={C.bone} />
      {/* Head — faceless, just skin tone */}
      <circle cx="0" cy="-85" r="28" fill={C.skin} />
      {/* Neck */}
      <rect x="-10" y="-62" width="20" height="14" fill={C.skin} />
      {/* Coverall body */}
      <path
        d="M -52 -50 L -56 60 L -50 110 L 50 110 L 56 60 L 52 -50 Q 0 -70 -52 -50 Z"
        fill={C.clay}
      />
      {/* Coverall belt stripe */}
      <rect x="-56" y="40" width="112" height="6" fill={C.midnight} opacity={0.55} />
      {/* Diwan chest mark */}
      <ChestMark x={0} y={-15} size={1.2} color={C.bone} />
      {/* Legs */}
      <rect x="-30" y="110" width="22" height="60" fill={C.clay} />
      <rect x="8" y="110" width="22" height="60" fill={C.clay} />
      {/* Boots */}
      <rect x="-32" y="170" width="26" height="8" fill={C.midnight} rx="2" />
      <rect x="6" y="170" width="26" height="8" fill={C.midnight} rx="2" />

      {/* Tools */}
      {holdingLaser && (
        <g>
          {/* Right arm extended */}
          <path d="M 50 -40 Q 110 -50 130 -65" stroke={C.clay} strokeWidth={22} strokeLinecap="round" fill="none" />
          {/* Laser distance meter */}
          <g transform="translate(140 -75)">
            <rect x="0" y="0" width="56" height="32" fill={C.midnight} rx="4" />
            <rect x="6" y="6" width="44" height="14" fill={C.clayLight} rx="1" />
            <circle cx="60" cy="16" r="3" fill={C.clay} />
          </g>
          {/* Left arm relaxed */}
          <path d="M -50 -40 Q -55 0 -50 40" stroke={C.clay} strokeWidth={22} strokeLinecap="round" fill="none" />
        </g>
      )}
      {holdingTablet && (
        <g>
          {/* Both arms holding tablet in front */}
          <path d="M -45 -35 Q -25 0 -10 30" stroke={C.clay} strokeWidth={20} strokeLinecap="round" fill="none" />
          <path d="M  45 -35 Q  25 0  10 30" stroke={C.clay} strokeWidth={20} strokeLinecap="round" fill="none" />
          {/* Tablet */}
          <g transform="translate(-32 25)">
            <rect x="0" y="0" width="64" height="44" fill={C.midnight} rx="4" />
            <rect x="3" y="3" width="58" height="38" fill={C.bone} rx="2" />
            {/* Mini floor plan inside */}
            <rect x="10" y="10" width="20" height="14" fill="none" stroke={C.clay} strokeWidth={1} />
            <rect x="32" y="10" width="20" height="14" fill="none" stroke={C.clay} strokeWidth={1} />
            <line x1="10" y1="28" x2="52" y2="28" stroke={C.clay} strokeWidth={1} />
          </g>
        </g>
      )}
      {!holdingLaser && !holdingTablet && (
        <g>
          <path d="M -50 -40 Q -65 10 -55 50" stroke={C.clay} strokeWidth={22} strokeLinecap="round" fill="none" />
          <path d="M  50 -40 Q  65 10  55 50" stroke={C.clay} strokeWidth={22} strokeLinecap="round" fill="none" />
        </g>
      )}
    </g>
  );
}

// Customer figure — civilian outfit, with phone showing Pinterest pins.
function Customer({x, y, scale = 1}: {x: number; y: number; scale?: number}) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {/* Hair / head silhouette */}
      <circle cx="0" cy="-85" r="28" fill={C.skin} />
      <path d="M -28 -90 Q -30 -105 -10 -110 Q 0 -115 10 -110 Q 30 -105 28 -90" fill={C.midnight} />
      <rect x="-10" y="-62" width="20" height="14" fill={C.skin} />
      {/* Casual shirt */}
      <path d="M -50 -50 L -54 80 L 54 80 L 50 -50 Q 0 -68 -50 -50 Z" fill={C.brass} />
      {/* Trousers */}
      <rect x="-32" y="80" width="28" height="80" fill={C.midnight} />
      <rect x="4" y="80" width="28" height="80" fill={C.midnight} />
      <rect x="-34" y="160" width="32" height="8" fill={C.ink} rx="2" />
      <rect x="2" y="160" width="32" height="8" fill={C.ink} rx="2" />
      {/* Both arms holding phone */}
      <path d="M -45 -30 Q -22 5 -8 30" stroke={C.brass} strokeWidth={18} strokeLinecap="round" fill="none" />
      <path d="M  45 -30 Q  22 5  8 30" stroke={C.brass} strokeWidth={18} strokeLinecap="round" fill="none" />
      {/* Phone */}
      <g transform="translate(-22 25)">
        <rect x="0" y="0" width="44" height="64" fill={C.midnight} rx="6" />
        <rect x="3" y="6" width="38" height="52" fill={C.bone} rx="2" />
        {/* Pinterest grid inside phone */}
        <rect x="6" y="10" width="14" height="14" fill={C.clay} />
        <rect x="24" y="10" width="14" height="14" fill={C.brass} />
        <rect x="6" y="28" width="14" height="14" fill={C.clayLight} />
        <rect x="24" y="28" width="14" height="14" fill={C.midnight} opacity={0.5} />
      </g>
    </g>
  );
}

// Scene 1: customer brings inspiration → AI design → engineer measures
export function ServiceScene({progress}: {progress: number}) {
  // Phases:
  // 0-25%: customer + Pinterest pins floating
  // 25-50%: AI render emerges (right side)
  // 50-75%: engineer arrives with laser
  // 75-100%: floor plan completes

  const aiOpacity = clamp01((progress - 0.18) / 0.25);
  const engineerX = 600 + (1 - clamp01((progress - 0.45) / 0.2)) * 600;
  const laserProgress = clamp01((progress - 0.6) / 0.3);
  const planProgress = clamp01((progress - 0.7) / 0.3);

  return (
    <svg viewBox="0 0 1600 900" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="grid-srv" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={C.brass} strokeOpacity={0.18} strokeWidth={1} />
        </pattern>
        <linearGradient id="bg-srv" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.sand} />
          <stop offset="100%" stopColor={C.bone} />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#bg-srv)" />
      <rect width="1600" height="900" fill="url(#grid-srv)" />

      {/* LEFT HALF: Customer with phone, Pinterest pins floating */}
      <g>
        {/* Floating Pinterest pins */}
        {[0, 1, 2, 3].map((i) => {
          const fx = 200 + i * 100;
          const fy = 220 - (i % 2) * 40;
          const colorList = [C.clay, C.brass, C.clayLight, C.midnight];
          return (
            <motion.rect
              key={i}
              x={fx}
              y={fy}
              width={60}
              height={75}
              rx={4}
              fill={colorList[i]}
              opacity={0.85}
              animate={{y: [fy, fy - 12, fy], opacity: [0.85, 1, 0.85]}}
              transition={{duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut'}}
            />
          );
        })}

        <Customer x={300} y={620} scale={1.2} />

        {/* Arrow from customer to AI render */}
        <motion.path
          d="M 480 480 Q 580 460 680 480"
          stroke={C.clay}
          strokeWidth={3}
          fill="none"
          strokeDasharray="6 5"
          initial={{pathLength: 0}}
          animate={{pathLength: aiOpacity}}
          transition={{duration: 0.6}}
        />
      </g>

      {/* CENTER: AI-rendered design preview window */}
      <motion.g initial={{opacity: 0, y: 20}} animate={{opacity: aiOpacity, y: 0}} transition={{duration: 0.8}}>
        <rect x="700" y="200" width="280" height="200" fill={C.midnight} rx="8" />
        <rect x="710" y="210" width="260" height="160" fill={C.sand} rx="4" />
        {/* Mini interior render — geometric stylization */}
        <rect x="720" y="320" width="240" height="50" fill={C.clay} />
        <rect x="730" y="220" width="80" height="100" fill={C.clayLight} opacity={0.7} />
        <rect x="820" y="240" width="60" height="80" fill={C.brass} />
        <rect x="890" y="260" width="70" height="60" fill={C.clay} opacity={0.6} />
        <text x="840" y="395" fill={C.bone} fontSize="14" fontFamily="monospace" textAnchor="middle">
          AI · DIWAN
        </text>
      </motion.g>

      {/* RIGHT HALF: Empty room with engineer measuring */}
      <g>
        {/* Empty room outline (3D-ish perspective) */}
        <motion.path
          d="M 920 380 L 1500 380 L 1500 800 L 920 800 Z"
          fill="none"
          stroke={C.midnight}
          strokeWidth={3}
          initial={{pathLength: 0}}
          animate={{pathLength: 1}}
          transition={{duration: 1.2, ease: 'easeInOut'}}
        />
        {/* Wall vanishing point lines */}
        <motion.line
          x1="1500"
          y1="380"
          x2="1450"
          y2="430"
          stroke={C.midnight}
          strokeWidth={2}
          opacity={0.5}
          initial={{pathLength: 0}}
          animate={{pathLength: 1}}
          transition={{duration: 1.2, delay: 0.6}}
        />

        {/* Floor plan being drawn (bottom-right corner) */}
        <motion.g initial={{opacity: 0}} animate={{opacity: planProgress}} transition={{duration: 0.6}}>
          <rect x="1080" y="600" width="380" height="170" fill={C.bone} stroke={C.midnight} strokeWidth={2} />
          <motion.path
            d="M 1100 620 L 1240 620 L 1240 690 L 1100 690 Z"
            fill="none"
            stroke={C.clay}
            strokeWidth={2}
            strokeDasharray="4 4"
            initial={{pathLength: 0}}
            animate={{pathLength: planProgress}}
            transition={{duration: 1}}
          />
          <motion.path
            d="M 1240 620 L 1440 620 L 1440 750 L 1240 750 L 1240 690"
            fill="none"
            stroke={C.clay}
            strokeWidth={2}
            strokeDasharray="4 4"
            initial={{pathLength: 0}}
            animate={{pathLength: planProgress}}
            transition={{duration: 1, delay: 0.3}}
          />
          <motion.path
            d="M 1100 690 L 1100 760 L 1240 760 L 1240 690"
            fill="none"
            stroke={C.clay}
            strokeWidth={2}
            strokeDasharray="4 4"
            initial={{pathLength: 0}}
            animate={{pathLength: planProgress}}
            transition={{duration: 1, delay: 0.6}}
          />
          <text x="1170" y="660" fill={C.midnight} fontSize="14" fontFamily="monospace" textAnchor="middle">
            مجلس
          </text>
          <text x="1340" y="690" fill={C.midnight} fontSize="14" fontFamily="monospace" textAnchor="middle">
            صالة
          </text>
          <text x="1170" y="730" fill={C.midnight} fontSize="14" fontFamily="monospace" textAnchor="middle">
            مطبخ
          </text>
        </motion.g>

        {/* Engineer with laser */}
        <motion.g
          initial={{x: 600, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          transition={{duration: 0.8, delay: 0.4}}
        >
          <Engineer x={1050} y={700} scale={1.1} holdingLaser={true} />
        </motion.g>

        {/* Laser beam */}
        <motion.line
          x1="1200"
          y1="635"
          x2="1500"
          y2="450"
          stroke={C.clay}
          strokeWidth={2}
          strokeDasharray="6 4"
          initial={{pathLength: 0}}
          animate={{pathLength: laserProgress}}
          transition={{duration: 0.6}}
        />

        {/* Laser dot on wall */}
        <motion.circle
          cx="1500"
          cy="450"
          r="6"
          fill={C.clay}
          initial={{opacity: 0}}
          animate={{opacity: [0, 1, 1, 1, 0.6, 1].slice(0, laserProgress > 0.4 ? 6 : 1)}}
          transition={{duration: 1.2, repeat: laserProgress > 0.4 ? Infinity : 0}}
        />

        {/* Distance readout */}
        <motion.g
          initial={{opacity: 0}}
          animate={{opacity: laserProgress}}
          transition={{duration: 0.4, delay: 0.3}}
        >
          <rect x="1340" y="420" width="120" height="40" fill={C.midnight} rx="4" />
          <text x="1400" y="447" fill={C.clayLight} fontSize="22" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            4.85 m
          </text>
        </motion.g>
      </g>

      {/* Connector wave between halves to suggest flow */}
      <motion.path
        d="M 480 540 Q 700 580 920 540"
        stroke={C.brass}
        strokeWidth={2}
        strokeDasharray="3 6"
        fill="none"
        opacity={0.5}
        animate={{strokeDashoffset: [0, -36]}}
        transition={{duration: 4, repeat: Infinity, ease: 'linear'}}
      />

      {/* Brand watermark */}
      <text x="60" y="850" fill={C.ink} opacity={0.35} fontSize="14" fontFamily="serif" letterSpacing="6">
        DIWAN — AI DESIGN · MEASUREMENT · DELIVERY
      </text>
    </svg>
  );
}

// Scene 2: installation — workers placing furniture in a designed room
export function InstallScene({progress}: {progress: number}) {
  const sofaY = 800 - clamp01(progress / 0.3) * 250;
  const rugWidth = clamp01((progress - 0.25) / 0.25) * 480;
  const lightY = 100 + clamp01((progress - 0.4) / 0.3) * 180;
  const fittingsOpacity = clamp01((progress - 0.6) / 0.3);

  return (
    <svg viewBox="0 0 1600 900" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="grid-inst" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={C.brass} strokeOpacity={0.15} strokeWidth={1} />
        </pattern>
      </defs>

      <rect width="1600" height="900" fill={C.sand} />
      <rect width="1600" height="900" fill="url(#grid-inst)" />

      {/* Room walls */}
      <path d="M 200 200 L 1400 200 L 1400 750 L 200 750 Z" fill={C.bone} stroke={C.midnight} strokeWidth={3} />
      <path d="M 200 750 L 1400 750" stroke={C.clay} strokeWidth={4} opacity={0.6} />

      {/* Mashrabiya pattern on back wall */}
      <g opacity={0.35}>
        {Array.from({length: 8}).map((_, i) => (
          <g key={i} transform={`translate(${320 + i * 130} 280)`}>
            <path
              d="M 0 0 L 30 0 L 60 60 L 30 120 L 0 120 L -30 60 Z"
              fill="none"
              stroke={C.clay}
              strokeWidth={2}
            />
          </g>
        ))}
      </g>

      {/* Pendant light coming down */}
      <motion.g animate={{y: 0}} initial={{y: -200}} transition={{duration: 0.6}}>
        <line x1="800" y1="200" x2="800" y2={lightY} stroke={C.midnight} strokeWidth={2} />
        <ellipse cx="800" cy={lightY} rx="60" ry="22" fill={C.brass} />
        <ellipse cx="800" cy={lightY + 4} rx="40" ry="14" fill={C.clayLight} />
        <circle cx="800" cy={lightY + 30} r="80" fill={C.brass} opacity={0.18} />
      </motion.g>

      {/* Rug sliding in */}
      <rect x={(1600 - rugWidth) / 2} y={620} width={rugWidth} height={100} fill={C.clay} opacity={0.9} rx={2} />
      <rect x={(1600 - rugWidth) / 2 + 10} y={630} width={Math.max(0, rugWidth - 20)} height={80} fill={C.clayLight} opacity={0.6} rx={2} />

      {/* Sofa rising into place */}
      <motion.g animate={{y: 0}} initial={{opacity: 0}} transition={{duration: 0.5}}>
        <g transform={`translate(560 ${sofaY})`}>
          {/* Sofa back */}
          <rect x="0" y="0" width="480" height="60" fill={C.midnight} rx="8" />
          {/* Sofa seat */}
          <rect x="-10" y="55" width="500" height="80" fill={C.clay} rx="6" />
          {/* Cushions */}
          <rect x="20" y="20" width="120" height="50" fill={C.brass} rx="4" opacity={0.85} />
          <rect x="180" y="20" width="120" height="50" fill={C.clayLight} rx="4" opacity={0.85} />
          <rect x="340" y="20" width="120" height="50" fill={C.brass} rx="4" opacity={0.85} />
        </g>
      </motion.g>

      {/* Side fittings appearing */}
      <motion.g animate={{opacity: fittingsOpacity}} initial={{opacity: 0}}>
        {/* Side table left */}
        <rect x="280" y={sofaY + 40} width="80" height="80" fill={C.midnight} />
        <rect x="285" y={sofaY + 30} width="70" height="14" fill={C.brass} />
        {/* Side table right */}
        <rect x="1240" y={sofaY + 40} width="80" height="80" fill={C.midnight} />
        <rect x="1245" y={sofaY + 30} width="70" height="14" fill={C.brass} />
        {/* Plant pots */}
        <rect x="1100" y="600" width="50" height="80" fill={C.midnight} rx="4" />
        <path d="M 1115 600 Q 1125 530 1145 600" fill={C.clay} opacity={0.7} />
      </motion.g>

      {/* Two engineers actively installing */}
      <Engineer x={420} y={770} scale={0.85} holdingTablet={true} />
      <Engineer x={1180} y={770} scale={0.85} holdingLaser={true} />

      {/* Brand watermark */}
      <text x="60" y="850" fill={C.ink} opacity={0.35} fontSize="14" fontFamily="serif" letterSpacing="6">
        DIWAN — INSTALL · ELECTRICAL · PLUMBING · AFTERCARE
      </text>
    </svg>
  );
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
