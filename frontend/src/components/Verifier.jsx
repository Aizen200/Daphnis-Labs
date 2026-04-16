import { useState } from "react";
import { verifyRound, getRound } from "../utils/api.js";

export default function Verifier() {
  const searchParams = new URLSearchParams(window.location.search);

  const [roundId, setRoundId] = useState("");
  const [serverSeed, setServerSeed] = useState(searchParams.get("serverSeed") || "");
  const [clientSeed, setClientSeed] = useState(searchParams.get("clientSeed") || "");
  const [nonce, setNonce] = useState(searchParams.get("nonce") || "");
  const [dropColumn, setDropColumn] = useState(searchParams.get("dropColumn") || "6");

  const [dbRound, setDbRound] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchRound = async () => {
    if (!roundId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getRound(roundId);
      setDbRound(data);
      if (data.serverSeed) setServerSeed(data.serverSeed);
      if (data.clientSeed) setClientSeed(data.clientSeed);
      if (data.nonce) setNonce(data.nonce);
      if (data.dropColumn !== undefined) setDropColumn(String(data.dropColumn));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!serverSeed || !clientSeed || !nonce || !dropColumn) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await verifyRound({
        serverSeed,
        clientSeed,
        nonce,
        dropColumn: parseInt(dropColumn, 10),
      });

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h2>Provably Fair Verifier</h2>

      <div>
        <input
          value={roundId}
          onChange={(e) => setRoundId(e.target.value)}
          placeholder="Round ID"
        />
        <button onClick={handleFetchRound} disabled={loading || !roundId}>
          Fetch
        </button>
      </div>

      <div>
        <input
          value={serverSeed}
          onChange={(e) => setServerSeed(e.target.value)}
          placeholder="Server Seed"
        />

        <input
          value={clientSeed}
          onChange={(e) => setClientSeed(e.target.value)}
          placeholder="Client Seed"
        />

        <input
          value={nonce}
          onChange={(e) => setNonce(e.target.value)}
          placeholder="Nonce"
        />

        <input
          type="number"
          value={dropColumn}
          onChange={(e) => setDropColumn(e.target.value)}
        />
      </div>

      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Working..." : "Verify"}
      </button>

      {error && <p>{error}</p>}

      {result && (
        <div>
          <p>Bin: {result.binIndex}</p>
          <p>Multiplier: {result.payoutMultiplier}x</p>
          <p>Path: {result.path?.join(" → ")}</p>
        </div>
      )}

    </div>
  );
}