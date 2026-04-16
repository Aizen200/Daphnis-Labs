import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

import PlinkoBoard from "../components/PlinkoBoard";
import BetControls from "../components/BetControls";
import ResultPanel from "../components/ResultPanel";
import MuteToggle from "../components/MuteToggle";

import { useGameState } from "../hooks/useGameState";
import { useAnimation } from "../hooks/useAnimation";
import { useSound } from "../hooks/useSound";

export default function GamePage() {
  const [bet, setBet] = useState(10);
  const [dropColumn, setDropColumn] = useState(6);
  const [landedBin, setLandedBin] = useState(null);

  const [tiltMode, setTiltMode] = useState(false);
  const [debugGrid, setDebugGrid] = useState(false);

  // 🔥 SECRET MODE
  const [secretMode, setSecretMode] = useState(false);
  const secretRef = useRef("");

  const game = useGameState();
  const sound = useSound();

  const onPegHit = () => sound.playPegTick();

  const onLand = async (bin) => {
    setLandedBin(bin);
    game.finishAnimation();
    await game.reveal();
    sound.playWinSound();
  };

  const {
    animating,
    motionPath,
    startAnimation,
    handleUpdate,
    handleComplete,
  } = useAnimation(onPegHit, onLand);

 const handleDrop = useCallback(async () => {
  if (animating || game.loading) return;

  setLandedBin(null);

  try {
    const result = await game.dropBall(bet * 100, dropColumn);

    console.log("RESULT:", result);

    setTimeout(() => {
      if (result && result.path) {
        startAnimation([...result.path], result.binIndex);
      }
    }, 0);

  } catch (err) {
    console.error(err);
  }
}, [animating, game.loading, bet, dropColumn, startAnimation]);

  // ✅ KEYBOARD + SECRET THEME
  useEffect(() => {
    function handleKeyDown(e) {
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }

      if (e.target.tagName === "INPUT") return;

      if (e.code === "KeyT") setTiltMode((t) => !t);
      if (e.code === "KeyG") setDebugGrid((g) => !g);

      if (e.code === "ArrowLeft") {
        setDropColumn((c) => Math.max(0, c - 1));
      }

      if (e.code === "ArrowRight") {
        setDropColumn((c) => Math.min(12, c + 1));
      }

      if (e.code === "Space") {
        handleDrop();
      }

      // 🔥 SECRET THEME
      const secret = "opensesame";

      secretRef.current += e.key.toLowerCase();

      if (!secret.startsWith(secretRef.current)) {
        secretRef.current = "";
      }

      if (secretRef.current === secret) {
        setSecretMode(true);

        setTimeout(() => {
          setSecretMode(false);
          secretRef.current = "";
        }, 8000);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDrop]);

  return (
    <div
      className={`min-h-screen font-sans p-4 sm:p-6 lg:p-10 flex justify-center transition-all duration-500 origin-center ${
        secretMode
          ? "bg-black text-yellow-300 drop-shadow-[0_0_20px_rgba(255,255,0,0.6)]"
          : "bg-gradient-to-br from-[#05070f] via-[#0b0e1a] to-[#05070f] text-slate-100"
      } ${
        tiltMode
          ? "rotate-[3deg] scale-[1.03] sepia-[0.3] hue-rotate-30 saturate-150"
          : ""
      }`}
    >
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT PANEL */}
        <aside className="lg:col-span-4 flex flex-col gap-6">

          <header className="glass p-6 rounded-2xl border-b-[3px] border-b-indigo-500 shadow-xl">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">
              PLINKO<span className="text-indigo-400">.</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-400/80 mt-1">
              Provably Fair Arcade
            </p>
          </header>

          <div className="glass p-5 rounded-2xl">
            <p className="text-[10px] uppercase text-indigo-300/60 mb-1 font-bold">
              Balance
            </p>
            <p className="text-3xl font-black">₹1000</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <BetControls
              bet={bet}
              setBet={setBet}
              dropColumn={dropColumn}
              setDropColumn={setDropColumn}
            />
          </div>

          <div className="glass rounded-2xl p-6 min-h-[140px] flex items-center justify-center">
            <ResultPanel
              landedBin={landedBin}
              bet={bet}
              multiplier={game.result?.payoutMultiplier}
            />
          </div>

          <button
            onClick={handleDrop}
            disabled={animating || game.loading}
            className="w-full py-5 rounded-2xl font-black text-xl uppercase text-white bg-indigo-600 hover:bg-indigo-500 transition-all disabled:opacity-50"
          >
            {game.loading ? "Processing..." : "DROP BALL ▼"}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/verify"
              className="flex items-center justify-center p-3 text-sm font-semibold border rounded-xl"
            >
              🔍 Verify
            </Link>
            <MuteToggle muted={sound.muted} setMuted={sound.toggleMute} />
          </div>
        </aside>
        <main className="lg:col-span-8 flex flex-col pt-4 lg:pt-0">
          {debugGrid && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-900/30">
              DEBUG GRID ACTIVE
            </div>
          )}

          <div className="w-full flex-1 flex items-center justify-center">
            <PlinkoBoard
              motionPath={motionPath}
              onUpdate={handleUpdate}
              onComplete={handleComplete}
              landedBin={landedBin}
              animating={animating}
              debugGrid={debugGrid}
              bet={bet}
            />
          </div>
        </main>
      </div>
    </div>
  );
}