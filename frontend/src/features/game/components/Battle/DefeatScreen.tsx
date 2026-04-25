import { RotateCcw, DoorOpen, Skull, AlertCircle } from 'lucide-react';

interface DefeatScreenProps {
  onBackToPatio: () => void;
  onRestart: () => void;
  score?: number;
  totalQuestions?: number;
}

const DefeatScreen = ({ onBackToPatio, onRestart, score = 0, totalQuestions = 0 }: DefeatScreenProps) => {
  const hitPercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const isTimeOutOrDead = score === 0 && totalQuestions === 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-slate-900/80 backdrop-blur-sm p-4">
      {/* Decorative Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-red-600/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Game Over Title */}
      <div className="relative mb-8 text-center z-10 animate-[pulse_3s_ease-in-out_infinite]">
        <div className="flex justify-center mb-4 text-red-500 opacity-90 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <Skull className="w-20 h-20 md:w-24 md:h-24" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            GAME
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-800 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            OVER
          </span>
        </h1>
      </div>

      {/* Status Card */}
      <div className="bg-slate-800/90 border-2 border-slate-700 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl mb-8 w-full max-w-sm text-center z-10 relative overflow-hidden">
        {/* Top subtle highlight */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />

        <h2 className="text-slate-300 text-lg font-bold mb-4 uppercase tracking-wider flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          Relatório da Batalha
        </h2>

        {!isTimeOutOrDead ? (
          <>
            <div className="mb-6 bg-slate-900/50 rounded-2xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-1">
                Aproveitamento
              </p>
              <div className="text-4xl md:text-5xl font-black text-red-400 mb-2">
                {hitPercentage}%
              </div>
              <p className="text-slate-300 font-medium">
                {score} acerto{score !== 1 ? 's' : ''} de {totalQuestions}
              </p>
            </div>
            <p className="text-sm text-slate-400 border-t border-slate-700/50 pt-4">
              O chefão não foi derrotado desta vez.<br />
              <span className="text-slate-300 font-semibold">Mínimo necessário: 80%</span>
            </p>
          </>
        ) : (
          <div className="py-4">
            <p className="text-slate-300 text-lg font-medium leading-relaxed">
              Você perdeu toda sua energia antes de terminar o desafio.
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm z-10 relative">
        <button
          onClick={onRestart}
          className="flex-1 group relative flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <RotateCcw className="w-5 h-5 transition-transform group-hover:-rotate-90 duration-300" />
          Tentar Novamente
        </button>
        
        <button
          onClick={onBackToPatio}
          className="flex-1 flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-slate-600 text-slate-200 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <DoorOpen className="w-5 h-5" />
          Fugir
        </button>
      </div>
    </div>
  );
};

export default DefeatScreen;
