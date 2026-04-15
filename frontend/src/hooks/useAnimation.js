import { useState, useRef, useCallback } from "react";

export const SVG_WIDTH = 800;
export const SVG_HEIGHT = 650;
export const ROWS = 12;
export const PEG_RADIUS = 6;
export const BALL_RADIUS = 11;
const DROP_DURATION = 2.5;

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
  const totalBins = ROWS + 1;
  const totalWidth = SVG_WIDTH * 0.7;
  const startX = (SVG_WIDTH - totalWidth) / 2;
  const spacing = totalWidth / (totalBins - 1);

  return startX + binIndex * spacing;
}

const ROW_Y_ZONES = Array.from({ length: ROWS }, (_, r) =>
  pegPosition(r, 0).y - PEG_RADIUS - BALL_RADIUS
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
    const binY = SVG_HEIGHT - 60;

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

    let currentX = SVG_WIDTH / 2;
    let currentY = 20;

    const xs = [currentX];
    const ys = [currentY];

    let pegIdx = 0;
    const FRAMES = 15;

    for (let r = 0; r < ROWS; r++) {
      const peg = pegPosition(r, pegIdx);

      const targetX = peg.x;
      const targetY = peg.y - PEG_RADIUS - BALL_RADIUS;

      const ctrlX = currentX + (targetX - currentX) * 0.5;
      const ctrlY =
        r === 0
          ? currentY + (targetY - currentY) * 0.2
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