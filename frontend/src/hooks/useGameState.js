import { useState, useCallback, useRef } from "react";
import { commitRound, startRound, revealRound } from "../utils/api.js";

export function useGameState() {
  const [phase, setPhase] = useState("idle");
  const [roundId, setRoundId] = useState(null);
  const [commitHex, setCommitHex] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [result, setResult] = useState(null);
  const [serverSeed, setServerSeed] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clientSeedRef = useRef(
    `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );

  const resetRound = useCallback(() => {
    setPhase("idle");
    setRoundId(null);
    setCommitHex(null);
    setNonce(null);
    setResult(null);
    setServerSeed(null);
    setError(null);

    clientSeedRef.current = `user-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
  }, []);

  const dropBall = useCallback(async (betCents, dropColumn) => {
    // 🔥 CRITICAL FIX
    if (loading || phase === "animating") return null;

    try {
      setLoading(true);
      setError(null);

      // STEP 1: COMMIT
      const commit = await commitRound();

      if (!commit?.roundId) throw new Error("Commit failed");

      setRoundId(commit.roundId);
      setCommitHex(commit.commitHex);
      setNonce(commit.nonce);
      setPhase("committed");

      // STEP 2: START GAME
      const gameResult = await startRound(commit.roundId, {
        clientSeed: clientSeedRef.current,
        betCents,
        dropColumn,
      });

      if (!gameResult?.path) throw new Error("Invalid game result");

      setResult(gameResult);
      setPhase("animating");

      return gameResult;

    } catch (err) {
      console.error(err);
      setError(err.message || "Game failed");
      setPhase("idle");
      return null;

    } finally {
      setLoading(false);
    }
  }, [loading, phase]);

  const finishAnimation = useCallback(() => {
    setPhase("finished");
  }, []);

  const reveal = useCallback(async () => {
    if (!roundId) return;

    try {
      const data = await revealRound(roundId);
      setServerSeed(data.serverSeed);
      setPhase("revealed");
    } catch (err) {
      setError(err.message);
    }
  }, [roundId]);

  return {
    phase,
    roundId,
    commitHex,
    nonce,
    result,
    serverSeed,
    clientSeed: clientSeedRef.current,
    error,
    loading,
    dropBall,
    finishAnimation,
    reveal,
    resetRound,
  };
}