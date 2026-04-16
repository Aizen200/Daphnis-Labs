export default function MuteToggle({ muted, setMuted }) {
  return (
    <button
      onClick={setMuted}
      className="flex items-center justify-center p-3 text-sm font-black text-indigo-200 border border-indigo-500/30 rounded-xl glass hover:bg-slate-800/80 transition-all shadow-lg glow-hover"
      title={muted ? "Unmute" : "Mute"}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}