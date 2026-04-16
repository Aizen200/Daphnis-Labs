export default function BetControls({ bet, setBet, dropColumn, setDropColumn }) {
  return (
    <div>

      {/* BET */}
      <div>
        <p>Bet Amount</p>

        <div>
          {[5, 10, 25, 50].map((val) => (
            <button
              key={val}
              onClick={() => setBet(val)}
            >
              ₹{val}
            </button>
          ))}
        </div>

        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
        />
      </div>

      {/* SLIDER */}
      <div>
        <p>Drop Column ({dropColumn})</p>

        <input
          type="range"
          min="0"
          max="12"
          value={dropColumn}
          onChange={(e) => setDropColumn(Number(e.target.value))}
        />

        <div>
          <span>0</span>
          <span>12</span>
        </div>
      </div>

    </div>
  );
}