export default function ResultPanel({ landedBin, bet }) {
  if (landedBin === null) return null;

  const MULTIPLIERS = [10,5,3,1.5,1,0.5,0.3,0.5,1,1.5,3,5,10];
  const multiplier = MULTIPLIERS[landedBin];
  const win = bet * multiplier;

  return (
    <div>
      <p>Result</p>

      <p>Bin: {landedBin}</p>
      <p>Multiplier: {multiplier}x</p>
      <p>Win: ₹{win}</p>
    </div>
  );
}