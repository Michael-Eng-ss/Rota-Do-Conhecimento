interface VictoryScreenProps {
  score: number;
  totalQuestions: number;
  onBackToPatio: () => void;
  bossName: string;
}

const VictoryScreen = ({ score, totalQuestions, onBackToPatio, bossName }: VictoryScreenProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-black/40">
      {/* Victory Banner */}
      <div className="relative mb-8">
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 px-12 py-6 rounded-2xl shadow-2xl transform rotate-[-2deg] border-4 border-yellow-500">
          <h1 className="text-5xl md:text-6xl font-black text-yellow-900 drop-shadow-lg tracking-wide">
            VITÓRIA!
          </h1>
        </div>
        {/* Star decorations */}
        <div className="absolute -top-4 -left-4 text-yellow-400 text-4xl animate-pulse">⭐</div>
        <div className="absolute -top-2 -right-6 text-yellow-400 text-3xl animate-pulse" style={{ animationDelay: '0.2s' }}>⭐</div>
        <div className="absolute -bottom-3 left-10 text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.4s' }}>⭐</div>
      </div>

      {/* Score Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8 text-center">
        <p className="text-gray-600 text-lg mb-2">Você derrotou</p>
        <p className="text-2xl font-bold text-purple-600 mb-4">{bossName}</p>
        <div className="flex items-center justify-center gap-2 text-3xl font-bold text-green-600">
          <span>Acertos:</span>
          <span>{score}/{totalQuestions}</span>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onBackToPatio}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-300 hover:scale-105"
      >
        Continuar
      </button>
    </div>
  );
};

export default VictoryScreen;
