import { Link } from "react-router-dom";
import Verifier from "../components/Verifier";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070f] via-[#0b0e1a] to-[#05070f] text-slate-100 font-sans p-6 sm:p-10 flex flex-col items-center relative overflow-hidden">
      
      {/* DECORATIVE BACKGROUND GLOWS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl z-10 py-10">
        <Verifier />
      </div>

      <div className="z-10 pb-20">
        <Link 
          to="/game"
          className="flex items-center gap-3 px-8 py-4 bg-slate-900/50 border border-indigo-500/30 rounded-2xl text-[10px] uppercase font-black tracking-[0.3em] text-indigo-300 hover:text-white hover:border-indigo-400 hover:bg-indigo-600/20 transition-all glass glow-indigo shadow-2xl"
        >
          <span>←</span> <span>Back to Arcade</span>
        </Link>
      </div>

    </div>
  );
}