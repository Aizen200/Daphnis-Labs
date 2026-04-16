export default function GameInfo({
  phase,
  commitHex,
  nonce,
  roundId,
  clientSeed,
}) {
  return (
    <div>

      <div>
        <strong>Status:</strong> {phase}
      </div>

      {roundId && (
        <div>
          <strong>Round:</strong> {roundId}
        </div>
      )}

      {commitHex && (
        <div>
          <strong>Commit:</strong> {commitHex.slice(0, 10)}...
        </div>
      )}

      {nonce && (
        <div>
          <strong>Nonce:</strong> {nonce}
        </div>
      )}

      {clientSeed && (
        <div>
          <strong>Seed:</strong> {clientSeed.slice(0, 10)}...
        </div>
      )}

    </div>
  );
}