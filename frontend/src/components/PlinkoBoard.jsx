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
  debugGrid,
  bet,
}) {
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
          r={5}
          fill="purple"
        />
      );

      if (debugGrid) {
        debugText.push(
          <text
            key={`dbg-${r}-${p}`}
            x={pos.x}
            y={pos.y - 10}
            fontSize="8"
            fill="green"
            textAnchor="middle"
          >
            {r},{p}
          </text>
        );
      }
    }
  }

  const binWidth = WIDTH / (ROWS + 1);

  return (
    <div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>

        {/* PEGS */}
        {pegs}
        {debugGrid && debugText}

        {/* BALL */}
        {motionPath && (
          <motion.circle
            r={10}
            fill="white"
            initial={{ x: motionPath.x[0], y: motionPath.y[0] }}
            animate={{ x: motionPath.x, y: motionPath.y }}
            transition={{ duration: motionPath.duration, ease: "linear" }}
            onUpdate={onUpdate}
            onAnimationComplete={onComplete}
          />
        )}

        {/* BINS */}
        {MULTIPLIERS.map((m, i) => {
          const x = i * binWidth;

          return (
            <g key={i}>
              <rect
                x={x}
                y={HEIGHT - 45}
                width={binWidth}
                height={38}
                fill="gray"
              />

              <text
                x={x + binWidth / 2}
                y={HEIGHT - 20}
                textAnchor="middle"
                fill="white"
                fontSize="10"
              >
                {m}x
              </text>
            </g>
          );
        })}
      </svg>

      {/* SIMPLE PAYOUT */}
      {bet && (
        <div>
          {MULTIPLIERS.map((m) => (
            <div key={m}>
              {m}x → ₹{(bet * m).toFixed(0)}
            </div>
          ))}
        </div>
      )}

      {/* CONFETTI */}
      {!animating && landedBin !== null && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

    </div>
  );
}