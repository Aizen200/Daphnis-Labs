export default function MuteToggle({ muted, setMuted }) {
  return (
    <button onClick={setMuted}>
      {muted ? "Muted" : "Sound"}
    </button>
  );
}