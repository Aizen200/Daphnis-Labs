import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import PlinkoBoard from "../components/PlinkoBoard";
import BetControls from "../components/BetControls";
import GameInfo from "../components/GameInfo";
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

    const result = await game.dropBall(bet * 100, dropColumn);

    if (result) {
      startAnimation(result.path, result.binIndex);
    }
  }, [animating, game.loading, bet, dropColumn]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === "INPUT") return;
      if (e.code === "KeyT") setTiltMode((t) => !t);
      if (e.code === "KeyG") setDebugGrid((g) => !g);
      if (e.code === "ArrowLeft") setDropColumn((c) => Math.max(0, c - 1));
      if (e.code === "ArrowRight") setDropColumn((c) => Math.min(12, c + 1));
      if (e.code === "Space") {
        e.preventDefault();
        handleDrop();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDrop]);

  return (
    <div>

      {/* LEFT PANEL */}
      <div>

        <h1>PLINKO</h1>
        <p>Arcade</p>

        <div>
          <p>Balance</p>
          <p>₹1000</p>
        </div>

        <BetControls
          bet={bet}
          setBet={setBet}
          dropColumn={dropColumn}
          setDropColumn={setDropColumn}
        />

        <ResultPanel landedBin={landedBin} bet={bet} />

        <button onClick={handleDrop}>
          DROP
        </button>

        <p>Use ← → or SPACE</p>

        <MuteToggle muted={sound.muted} setMuted={sound.toggleMute} />

        <Link to="/verify">Verify</Link>

      </div>

      {/* RIGHT SIDE */}
      <div>

        {debugGrid && (
          <div>
            <p>DEBUG MODE</p>
          </div>
        )}

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

    </div>
  );
}