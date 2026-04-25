interface VictoryScreenProps {
  score: number;
  totalQuestions: number;
  damageDealt: number;
  maxBossHealth: number;
  onBackToPatio: () => void;
  bossName: string;
  isFinalBoss?: boolean;
}

const VictoryScreen = ({ 
  score, 
  totalQuestions, 
  onBackToPatio, 
  bossName,
  isFinalBoss = false
}: VictoryScreenProps) => {
  const hitPercentage  = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const wrongAnswers   = totalQuestions - score;

  // Cor do badge de porcentagem
  const pctColor =
    hitPercentage === 100 ? 'text-purple-600 bg-purple-50' :
    hitPercentage >= 90   ? 'text-green-600  bg-green-50'  :
                            'text-yellow-600 bg-yellow-50';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-black/40">
      {/* Victory Banner */}
      <div className="relative mb-8">
        <div className={`px-12 py-6 rounded-2xl shadow-2xl transform rotate-[-2deg] border-4 ${
          isFinalBoss 
            ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 border-purple-500'
            : 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 border-yellow-500'
        }`}>
          <h1 className={`text-5xl md:text-6xl font-black drop-shadow-lg tracking-wide ${
            isFinalBoss ? 'text-purple-900' : 'text-yellow-900'
          }`}>
            {isFinalBoss ? 'CAMPEÃO!' : 'VITÓRIA!'}
          </h1>
        </div>
        {/* Star decorations */}
        <div className="absolute -top-4 -left-4 text-yellow-400 text-4xl animate-pulse">⭐</div>
        <div className="absolute -top-2 -right-6 text-yellow-400 text-3xl animate-pulse" style={{ animationDelay: '0.2s' }}>⭐</div>
        <div className="absolute -bottom-3 left-10 text-yellow-400 text-2xl animate-pulse" style={{ animationDelay: '0.4s' }}>⭐</div>
        {isFinalBoss && (
          <>
            <div className="absolute -bottom-4 -right-4 text-purple-400 text-3xl animate-pulse" style={{ animationDelay: '0.6s' }}>👑</div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce">🏆</div>
          </>
        )}
      </div>

      {/* Score Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8 text-center min-w-[300px]">
        <p className="text-gray-600 text-lg mb-1">Você derrotou</p>
        <p className="text-2xl font-bold mb-5 text-purple-600">{bossName}</p>

        {/* Porcentagem de acertos — destaque principal */}
        <div className={`mb-4 p-4 rounded-xl ${pctColor}`}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 opacity-70">
            Aproveitamento
          </p>
          <div className="text-5xl font-black leading-none">
            {hitPercentage}%
          </div>
          <p className="text-sm mt-2 font-medium">
            {score} acerto{score !== 1 ? 's' : ''} de {totalQuestions} pergunta{totalQuestions !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Mini breakdown: acertos / erros */}
        <div className="flex gap-3 justify-center text-sm font-semibold">
          <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
            ✅ {score} certo{score !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-full">
            ❌ {wrongAnswers} erro{wrongAnswers !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Mínimo atingido */}
        <p className="mt-3 text-xs text-gray-400">
          Mínimo necessário: 80% ({Math.ceil(totalQuestions * 0.8)}/{totalQuestions})
        </p>

        {/* Mensagem especial para Boss Final */}
        {isFinalBoss && (
          <p className="mt-4 text-sm text-purple-600 font-medium">
            🎉 Parabéns! Você completou todos os desafios!
          </p>
        )}
      </div>

      {/* Continue Button */}
      <button
        onClick={onBackToPatio}
        className={`px-10 py-4 rounded-xl font-bold text-xl shadow-lg transition-all duration-300 hover:scale-105 text-white ${
          isFinalBoss 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
        }`}
      >
        {isFinalBoss ? 'Finalizar Jogo' : 'Continuar'}
      </button>
    </div>
  );
};

export default VictoryScreen;
