export default function ResultPanel({ landedBin, bet, multiplier }) {
  const win = bet * (multiplier || 0);

  return (
    <div className="flex flex-col items-center justify-center p-2 text-center h-full">
      <p className="text-[10px] uppercase font-bold text-indigo-300/40 tracking-[0.2em] mb-3">
        Round Outcome
      </p>

      {landedBin === null ? (
        <div className="text-indigo-500/30 font-black text-xs py-4 uppercase tracking-[0.2em] animate-pulse">
          Scanning Path...
        </div>
      ) : (
        <>
          <div className="text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-bounce relative z-10 neon-text">
            {multiplier}x
          </div>

          <div className="mt-3 text-xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
            + ₹{win.toFixed(0)}
          </div>
        </>
      )}
    </div>
  );
}