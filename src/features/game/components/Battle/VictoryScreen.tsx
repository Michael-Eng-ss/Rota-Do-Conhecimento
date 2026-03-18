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
  damageDealt,
  maxBossHealth,
  onBackToPatio, 
  bossName,
  isFinalBoss = false
}: VictoryScreenProps) => {
  const damagePercentage = Math.round((damageDealt / maxBossHealth) * 100);
  
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
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8 text-center min-w-[280px]">
        <p className="text-gray-600 text-lg mb-2">Você derrotou</p>
        <p className={`text-2xl font-bold mb-4 ${isFinalBoss ? 'text-purple-600' : 'text-purple-600'}`}>
          {bossName}
        </p>
        
        {/* Porcentagem de dano */}
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Dano causado</p>
          <div className="text-4xl font-black text-green-600">
            {damagePercentage}%
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {damageDealt} / {maxBossHealth} pontos
          </p>
        </div>

        {/* Acertos */}
        <div className="flex items-center justify-center gap-2 text-xl font-bold text-blue-600">
          <span>Acertos:</span>
          <span>{score}/{totalQuestions}</span>
        </div>
        
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
