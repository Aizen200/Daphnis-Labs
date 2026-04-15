import { motion } from "framer-motion";
import Confetti from "react-confetti";

const ROWS = 12;
const WIDTH = 800;
const HEIGHT = 650;

const MULTIPLIERS = [10,5,3,1.5,1,0.5,0.3,0.5,1,1.5,3,5,10];

function pegPosition(r, p) {
  const spacingX = 40;
  const spacingY = 40;
  const startX = WIDTH / 2 - (r * spacingX) / 2;

  return {
    x: startX + p * spacingX,
    y: 80 + r * spacingY,
  };
}

export default function PlinkoBoard({
  motionPath,
  onUpdate,
  onComplete,
  landedBin,
  animating,
}) {
  const pegs = [];

  for (let r = 0; r < ROWS; r++) {
    for (let p = 0; p <= r; p++) {
      const pos = pegPosition(r, p);
      pegs.push(
        <circle
          key={`${r}-${p}`}
          cx={pos.x}
          cy={pos.y}
          r={5}
          fill="#c084fc"
          opacity={0.8}
          style={{
            filter: "drop-shadow(0 0 6px rgba(192,132,252,0.6))"
          }}
        />
      );
    }
  }

  const binWidth = WIDTH / (ROWS + 1);

  return (
    <div className="
      relative w-full max-w-[800px]
      bg-indigo-950/40 backdrop-blur
      border border-purple-500/20
      rounded-2xl p-4
      shadow-[0_0_60px_rgba(139,92,246,0.1)]
    ">

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full">

        {/* PEGS */}
        {pegs}

        {/* BALL */}
        {motionPath && (
          <motion.circle
            r={10}
            fill="#e9d5ff"
            initial={{ x: motionPath.x[0], y: motionPath.y[0] }}
            animate={{ x: motionPath.x, y: motionPath.y }}
            transition={{ duration: motionPath.duration, ease: "linear" }}
            onUpdate={onUpdate}
            onAnimationComplete={onComplete}
            style={{
              filter: "drop-shadow(0 0 10px rgba(168,85,247,0.9))"
            }}
          />
        )}

        {/* BINS */}
        {MULTIPLIERS.map((m, i) => {
          const x = i * binWidth;

          let color =
            m >= 5 ? "#a855f7" :   // HIGH
            m >= 1 ? "#6366f1" :   // MID
            "#334155";             // LOW

          return (
            <g key={i}>
              <rect
                x={x}
                y={HEIGHT - 60}
                width={binWidth - 4}
                height={45}
                rx={10}
                fill={color}
                opacity={landedBin === i ? 1 : 0.7}
                style={{
                  filter:
                    landedBin === i
                      ? "drop-shadow(0 0 15px rgba(168,85,247,0.9))"
                      : "none",
                  transition: "all 0.3s ease",
                }}
              />

              <text
                x={x + binWidth / 2}
                y={HEIGHT - 30}
                textAnchor="middle"
                fill="#fff"
                fontSize="12"
                fontWeight="bold"
              >
                {m}x
              </text>
            </g>
          );
        })}
      </svg>

      {/* CONFETTI */}
      {!animating && landedBin !== null && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
    </div>
  );
}