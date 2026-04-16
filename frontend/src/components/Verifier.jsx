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

  const MULTIPLIERS = [10,5,3,1.5,1,0.5,0.3,0.5,1,1.5,3,5,10];

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

const multiplier = result?.payoutMultiplier ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070f] via-[#0b0e1a] to-[#05070f] text-white flex justify-center p-6">

      <div className="w-full max-w-5xl flex flex-col gap-8">

        {/* HEADER */}
        <div className="border-b border-indigo-500/20 pb-4">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            🔍 DIAGNOSTIC <span className="text-indigo-400">VERIFIER</span>
          </h1>
          <p className="text-xs text-indigo-300/40 uppercase tracking-widest mt-2">
            Validate deterministic outcomes natively
          </p>
        </div>

        {/* FETCH */}
        <div className="flex gap-3 items-center glass bg-white/5 backdrop-blur-lg border border-indigo-500/20 p-5 rounded-2xl">
          <input
            value={roundId}
            onChange={(e) => setRoundId(e.target.value)}
            placeholder="Fetch Round by ID (optional)"
            className="flex-1 px-4 py-3 bg-slate-950/60 border border-indigo-500/20 rounded-xl text-sm text-white placeholder:text-indigo-400/40 focus:outline-none focus:border-indigo-400"
          />
          <button
            onClick={handleFetchRound}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold"
          >
            Fetch DB
          </button>
        </div>

        {/* INPUTS */}
        <div className="grid grid-cols-2 gap-4 glass bg-white/5 backdrop-blur-lg border border-indigo-500/20 p-6 rounded-2xl">

          <input
            value={serverSeed}
            onChange={(e) => setServerSeed(e.target.value)}
            placeholder="Server Seed"
            className="col-span-2 px-4 py-3 bg-slate-950/60 border border-indigo-500/20 rounded-xl text-sm text-white"
          />

          <input
            value={clientSeed}
            onChange={(e) => setClientSeed(e.target.value)}
            placeholder="Client Seed"
            className="col-span-2 px-4 py-3 bg-slate-950/60 border border-indigo-500/20 rounded-xl text-sm text-white"
          />

          <input
            type="number"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            placeholder="Nonce"
            className="px-4 py-3 bg-slate-950/60 border border-indigo-500/20 rounded-xl text-sm text-white"
          />

          <input
            type="number"
            value={dropColumn}
            onChange={(e) => setDropColumn(e.target.value)}
            placeholder="Drop Column"
            className="px-4 py-3 bg-slate-950/60 border border-indigo-500/20 rounded-xl text-sm text-white"
          />
        </div>

        {/* VERIFY BUTTON */}
        <button
          onClick={handleVerify}
          className="w-full py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition shadow-lg"
        >
          VERIFY EXECUTION ENGINE
        </button>

        {error && <div className="text-red-400">{error}</div>}

        {/* RESULTS */}
        {result && (
          <div className="space-y-6">

            {/* BIN + MULTIPLIER */}
            <div className="grid grid-cols-2 gap-6">
              <div className="glass bg-white/5 border border-indigo-500/20 p-6 rounded-2xl text-center">
                <p className="text-xs text-indigo-300/50">FINAL BIN INDEX</p>
                <h1 className="text-5xl font-black">{result.binIndex}</h1>
              </div>

              <div className="glass bg-white/5 border border-indigo-500/20 p-6 rounded-2xl text-center">
                <p className="text-xs text-indigo-300/50">PAYOUT MULTIPLIER</p>
                <h1 className="text-5xl font-black text-emerald-400">
                  {multiplier}x
                </h1>
              </div>
            </div>

            {/* HASHES */}
            <div className="glass bg-white/5 border border-indigo-500/20 p-5 rounded-xl">
              <p className="text-xs text-indigo-300/50 mb-2">COMMIT HASH</p>
              <code className="text-xs break-all">{result.commitHex}</code>
            </div>

            <div className="glass bg-white/5 border border-indigo-500/20 p-5 rounded-xl">
              <p className="text-xs text-indigo-300/50 mb-2">COMBINED SEED</p>
              <code className="text-xs break-all">{result.combinedSeed}</code>
            </div>

            <div className="glass bg-white/5 border border-indigo-500/20 p-5 rounded-xl">
              <p className="text-xs text-indigo-300/50 mb-2">PEG HASH</p>
              <code className="text-xs break-all">{result.pegMapHash}</code>
            </div>

            {/* TRAJECTORY */}
            <div className="glass bg-white/5 border border-indigo-500/20 p-5 rounded-xl">
              <p className="text-xs text-indigo-300/50 mb-3">TRAJECTORY</p>

              {result.path && result.path.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.path.map((step, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-xs"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-indigo-400/40 text-sm">
                  No trajectory returned
                </p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}