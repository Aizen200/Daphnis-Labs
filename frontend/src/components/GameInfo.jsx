export default function GameInfo({
  phase,
  commitHex,
  nonce,
  roundId,
  clientSeed,
}) {
  return (
    <div className="border border-[#222633] rounded-lg bg-[#151922] p-4 space-y-3">

      <div className="flex justify-between text-sm">
        <span className="text-zinc-400">Status</span>
        <span className="text-zinc-200 font-medium">{phase}</span>
      </div>

      {roundId && (
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Round</span>
          <span className="text-zinc-200">{roundId}</span>
        </div>
      )}

      {commitHex && (
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Commit</span>
          <span className="text-zinc-200 font-mono">
            {commitHex.slice(0, 10)}...
          </span>
        </div>
      )}

      {nonce && (
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Nonce</span>
          <span className="text-zinc-200">{nonce}</span>
        </div>
      )}

      {clientSeed && (
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Seed</span>
          <span className="text-zinc-200 font-mono">
            {clientSeed.slice(0, 10)}...
          </span>
        </div>
      )}

    </div>
  );
}