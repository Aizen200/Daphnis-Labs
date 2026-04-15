import { useState, useRef, useCallback } from "react";

export function useSound() {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem("plinko-muted") === "true";
    } catch {
      return false;
    }
  });

  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    // 🔥 CRITICAL FIX
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }

    return ctxRef.current;
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("plinko-muted", String(next));
      } catch {}
      return next;
    });
  }, []);

  const playPegTick = useCallback(() => {
    if (muted) return;

    try {
      const ctx = getCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = 700 + Math.random() * 300;

      gain.gain.value = 0.05;
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.05
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);

    } catch {}
  }, [muted, getCtx]);

  const playWinSound = useCallback(() => {
    if (muted) return;

    try {
      const ctx = getCtx();

      const notes = [523, 659, 784, 1047];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const delay = i * 0.1;

        osc.type = "sine";
        osc.frequency.value = freq;

        gain.gain.value = 0;
        gain.gain.linearRampToValueAtTime(
          0.1,
          ctx.currentTime + delay + 0.02
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + delay + 0.3
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.3);
      });

    } catch {}
  }, [muted, getCtx]);

  return {
    muted,
    toggleMute,
    playPegTick,
    playWinSound,
  };
}