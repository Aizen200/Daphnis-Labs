import { motion, useReducedMotion } from "framer-motion";
import Confetti from "react-confetti";

const ROWS = 12;
const WIDTH = 800;
const HEIGHT = 650;
const BALL_RADIUS = 12;

const MULTIPLIERS = [10,5,3,1.5,1,0.5,0.5,0.5,1,1.5,3,5,10];

function pegPosition(r, p) {
  const spacingX = 40;
  const spacingY = 40;
  const startX = WIDTH / 2 - (r * spacingX) / 2;

  return {
    x: startX + p * spacingX,
    y: 90 + r * spacingY,
  };
}

export default function PlinkoBoard({
  motionPath,
  onUpdate,
  onComplete,
  landedBin,
  animating,
  debugGrid,
  bet,
}) {
  const shouldReduceMotion = useReducedMotion();
  const pegs = [];
  const debugText = [];

  for (let r = 0; r < ROWS; r++) {
    for (let p = 0; p <= r; p++) {
      const pos = pegPosition(r, p);

      pegs.push(
        <circle
          key={`${r}-${p}`}
          cx={pos.x}
          cy={pos.y}
          r={4}
          fill={debugGrid ? "#6366f1" : "#818cf8"}
          opacity={debugGrid ? 0.3 : 0.6}
          style={{
            filter: "drop-shadow(0 0 8px rgba(99,102,241,0.6))"
          }}
        />
      );

      if (debugGrid) {
        debugText.push(
          <text
            key={`dbg-${r}-${p}`}
            x={pos.x}
            y={pos.y - 12}
            fontSize="7"
            fill="#34d399"
            textAnchor="middle"
            fontFamily="monospace"
            className="font-black"
          >
            {r}:{p}
          </text>
        );
      }
    }
  }

  const binWidth = WIDTH / (ROWS + 1);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl">

      {/* MAIN PLINKO SVG AREA */}
      <div className="w-full glass shadow-2xl rounded-[2.5rem] p-2 md:p-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
        
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto drop-shadow-[0_0_20px_rgba(99,102,241,0.1)]"
        >
          {/* PEGS */}
          <g className="pegs-layer">
            {pegs}
          </g>
          {debugGrid && debugText}

          {/* DYNAMIC BALL COMPONENT */}
          {motionPath && (
            <motion.circle
              key={motionPath.id}
              r={BALL_RADIUS}
              fill="#ffffff"
              initial={false}
              animate={{
                x: motionPath.x,
                y: motionPath.y,
              }}
              transition={{
                duration: shouldReduceMotion ? 0.1 : motionPath.duration,
                ease: "linear",
              }}
              onUpdate={onUpdate}
              onAnimationComplete={onComplete}
              style={{
                translateX: -BALL_RADIUS,
                translateY: -BALL_RADIUS,
                filter: "drop-shadow(0 0 12px rgba(255,255,255,0.8)) stroke(rgba(99,102,241,0.5), 1px)"
              }}
            />
          )}

          {/* MULTIPLIER BINS AT BOTTOM */}
          {MULTIPLIERS.map((m, i) => {
            const x = i * binWidth;
            const isLanded = landedBin === i;

            // Premium Color Scale
            const isHigh = m >= 5;
            const isMid = m >= 1.5 && m < 5;
            
            let stroke = isHigh ? "#818cf8" : isMid ? "#6366f1" : "#4338ca";
            let bg = isHigh ? "rgba(99,102,241,0.2)" : isMid ? "rgba(79,70,229,0.15)" : "rgba(30,27,75,0.4)";

            return (
              <g key={i}>
                <motion.rect
                  x={x + 4}
                  y={HEIGHT - 55}
                  width={binWidth - 8}
                  height={45}
                  rx={10}
                  fill={isLanded ? "#6366f1" : bg}
                  stroke={isLanded ? "#ffffff" : stroke}
                  strokeWidth={isLanded ? 3 : 1.5}
                  opacity={landedBin === null || isLanded ? 1 : 0.4}
                  animate={
                    isLanded && !shouldReduceMotion
                      ? {
                          fill: ["#6366f1", "#818cf8", "#6366f1"],
                          strokeWidth: [3, 5, 3],
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    ease: "anticipate",
                    repeat: isLanded ? 3 : 0,
                  }}
                />

                <text
                  x={x + binWidth / 2}
                  y={HEIGHT - 26}
                  textAnchor="middle"
                  fill={isLanded ? "#ffffff" : stroke}
                  fontSize="12"
                  className="font-black tracking-tighter"
                  style={{ textShadow: isLanded ? "0 0 8px rgba(255,255,255,0.4)" : "none" }}
                >
                  {m}x
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* THEORETICAL PAYOUT TICKER */}
      {bet > 0 && (
        <div className="w-full glass rounded-3xl p-6 shadow-xl border-indigo-500/5 group">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] text-indigo-300 font-bold tracking-[0.3em] uppercase opacity-60">
              PAYOUT MATRIX
            </p>
            <div className="h-[1px] flex-1 mx-4 bg-indigo-500/10"></div>
            <p className="text-[9px] font-mono text-indigo-400/40">Unit: ₹ / Move</p>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {[10, 5, 3, 1.5, 1, 0.5, 0.3].map((m, idx) => (
              <div
                key={`${m}-${idx}`}
                className="flex flex-col items-center glass p-3 rounded-2xl border-indigo-500/10 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-inner bg-slate-950/20"
              >
                <span className="text-indigo-300 font-black text-[10px] tracking-tight mb-1">{m}x</span>
                <span className="text-white text-xs font-black tracking-tighter">
                  ₹{(bet * m).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VICTORY EFFECTS */}
      {!animating && landedBin !== null && !shouldReduceMotion && (
        <Confetti 
          width={window.innerWidth} 
          height={window.innerHeight} 
          recycle={false} 
          numberOfPieces={150}
          gravity={0.15}
          colors={['#6366f1', '#a5b4fc', '#ffffff', '#4338ca']}
        />
      )}
    </div>
  );
}