import { useState, useRef, useCallback } from "react";

export const SVG_WIDTH = 800;
export const SVG_HEIGHT = 650;
export const ROWS = 12;
export const PEG_RADIUS = 6;
export const BALL_RADIUS = 11;
const DROP_DURATION = 2.5;

// ✅ optimized frames
const FRAMES = 6;

export function pegPosition(row, pegIndex) {
  const topPad = 80;
  const bottomPad = 120;

  const usableH = SVG_HEIGHT - topPad - bottomPad;
  const rowSpacing = usableH / ROWS;
  const y = topPad + row * rowSpacing;

  const pegsInRow = row + 1;
  const totalWidth = SVG_WIDTH * 0.7;
  const startX = (SVG_WIDTH - totalWidth) / 2;

  const pegSpacing =
    pegsInRow > 1 ? totalWidth / (pegsInRow - 1) : 0;

  const x =
    pegsInRow === 1
      ? SVG_WIDTH / 2
      : startX + pegIndex * pegSpacing;

  return { x, y };
}

export function binCenterX(binIndex) {
  const totalWidth = SVG_WIDTH * 0.7;
  const startX = (SVG_WIDTH - totalWidth) / 2;

  const lastRowPegSpacing = totalWidth / (ROWS - 1);
  const halfSpacing = lastRowPegSpacing / 2;

  const leftmostPegX = startX;
  return leftmostPegX - halfSpacing + binIndex * lastRowPegSpacing;
}

const POINTER_POLE_Y = SVG_HEIGHT - 48;

const EPS = 0.01;
const ROW_Y_ZONES = Array.from({ length: ROWS }, (_, r) =>
  pegPosition(r, 0).y - PEG_RADIUS - BALL_RADIUS + EPS
);

export function useAnimation(onPegHit, onLand) {
  const [animating, setAnimating] = useState(false);
  const [motionPath, setMotionPath] = useState(null);

  const lastPegHit = useRef(-1);

  const startAnimation = useCallback((path, binIndex) => {
    if (!path || path.length !== ROWS) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const binX = binCenterX(binIndex);
    const binY = POINTER_POLE_Y;

    if (prefersReducedMotion) {
      setMotionPath({
        id: Date.now(),
        x: [binX],
        y: [binY],
        duration: 0,
        binIndex,
      });
      onLand?.(binIndex);
      return;
    }

    setAnimating(true);
    lastPegHit.current = -1;

    // ✅ FIXED START POSITION
    const firstPeg = pegPosition(0, 0);

    let currentX = firstPeg.x;
    let currentY = firstPeg.y - PEG_RADIUS - BALL_RADIUS - 40;

    const xs = [currentX];
    const ys = [currentY];

    let pegIdx = 0;

    for (let r = 0; r < ROWS; r++) {
      const peg = pegPosition(r, pegIdx);
      const targetX = peg.x;
      const targetY = peg.y - PEG_RADIUS - BALL_RADIUS;

      // ✅ FIXED FIRST DROP (no sideways movement)
      const ctrlX =
        r === 0
          ? currentX
          : currentX + (targetX - currentX) * 0.5;

      const ctrlY =
        r === 0
          ? currentY + (targetY - currentY) * 0.5
          : currentY - 35;

      for (let i = 1; i <= FRAMES; i++) {
        const t = i / FRAMES;

        const px =
          (1 - t) * (1 - t) * currentX +
          2 * (1 - t) * t * ctrlX +
          t * t * targetX;

        const py =
          (1 - t) * (1 - t) * currentY +
          2 * (1 - t) * t * ctrlY +
          t * t * targetY;

        xs.push(px);
        ys.push(py);
      }

      currentX = targetX;
      currentY = targetY;

      if (path[r] === "R") pegIdx++;
    }

    // Final segment
    const ctrlX = currentX + (binX - currentX) * 0.5;
    const ctrlY = currentY - 35;

    for (let i = 1; i <= FRAMES; i++) {
      const t = i / FRAMES;

      const px =
        (1 - t) * (1 - t) * currentX +
        2 * (1 - t) * t * ctrlX +
        t * t * binX;

      const py =
        (1 - t) * (1 - t) * currentY +
        2 * (1 - t) * t * ctrlY +
        t * t * binY;

      xs.push(px);
      ys.push(py);
    }

    setMotionPath({
      id: Date.now(),
      x: xs,
      y: ys,
      duration: DROP_DURATION,
      binIndex,
    });
  }, [onLand]);

  const handleUpdate = useCallback((latest) => {
    if (!latest?.y) return;
    const y = parseFloat(latest.y);

    for (let i = 0; i < ROWS; i++) {
      if (y >= ROW_Y_ZONES[i] && lastPegHit.current < i) {
        lastPegHit.current = i;
        onPegHit?.();
      }
    }
  }, [onPegHit]);

  const handleComplete = useCallback(() => {
    setAnimating(false);
    if (motionPath) {
      onLand?.(motionPath.binIndex);
    }
    setTimeout(() => {
      setMotionPath(null);
    }, 50);
  }, [motionPath, onLand]);

  return {
    animating,
    motionPath,
    startAnimation,
    handleUpdate,
    handleComplete,
  };
}