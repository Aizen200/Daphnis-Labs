export default function BetControls({ bet, setBet, dropColumn, setDropColumn }) {
  return (
    <div className="flex flex-col gap-6 w-full">

      {/* BET CONTROLS */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] uppercase font-bold text-indigo-300/60 tracking-[0.2em] mb-1">Bet Amount (Cents)</p>

        <div className="grid grid-cols-4 gap-2">
          {[10, 25, 50, 100].map((val) => (
            <button
              key={val}
              onClick={() => setBet(val)}
              className={`
                py-2.5 text-xs font-black rounded-xl border transition-all active:scale-95
                ${bet === val
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  : "bg-slate-900/50 border-indigo-500/10 text-indigo-300/60 hover:border-indigo-500/30 hover:text-indigo-200"}
              `}
            >
              ₹{val}
            </button>
          ))}
        </div>

        <div className="relative group">
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Math.max(1, Number(e.target.value)))}
            className="
              w-full px-4 py-3 rounded-xl
              bg-slate-950/60
              border border-indigo-500/10
              text-sm font-bold text-indigo-100 
              focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30
              transition-all placeholder-indigo-900/40 mt-1 shadow-inner
            "
            placeholder="Custom Amount"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-500/40 pointer-events-none mt-0.5">INR</span>
        </div>
      </div>

      {/* SLIDER CONTROLS */}
      <div className="flex flex-col gap-4 pt-2 border-t border-indigo-500/5">
        
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
             <p className="text-[10px] uppercase font-bold text-indigo-300/60 tracking-[0.2em]">Drop Column</p>
             <p className="text-[9px] text-indigo-500/40 font-mono uppercase">Discrete Aiming [0-12]</p>
          </div>
          <span className="text-sm font-black text-indigo-200 bg-indigo-600/20 px-3 py-1 rounded-lg border border-indigo-500/30 shadow-sm transition-all">
            {dropColumn}
          </span>
        </div>

        <div className="relative pt-2 pb-1 px-1">
          <input
            type="range"
            min="0"
            max="12"
            value={dropColumn}
            onChange={(e) => setDropColumn(Number(e.target.value))}
            className="w-full h-2 bg-slate-950 rounded-full appearance-none cursor-pointer border border-indigo-500/10 shadow-inner"
            style={{
              background: `linear-gradient(to right, #6366f1 ${(dropColumn/12)*100}%, #0f172a ${(dropColumn/12)*100}%)`
            }}
          />
          <style dangerouslySetInnerHTML={{__html: `
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: #818cf8;
              cursor: pointer;
              border: 4px solid #111827;
              box-shadow: 0 0 15px rgba(99,102,241,0.6);
              transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            input[type=range]::-webkit-slider-thumb:hover {
              transform: scale(1.15);
              background: #a5b4fc;
            }
          `}} />
        </div>

        <div className="flex justify-between text-[8px] font-black text-indigo-400/30 uppercase tracking-[0.2em]">
          <span>L-Bound</span>
          <span className="w-1 h-1 rounded-full bg-indigo-500/20"></span>
          <span>R-Bound</span>
        </div>

      </div>

    </div>
  );
}