interface DefeatScreenProps {
  onBackToPatio: () => void;
  onRestart: () => void;
}

const DefeatScreen = ({ onBackToPatio, onRestart }: DefeatScreenProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-black/50">
      {/* Game Over Banner - Comic style */}
      <div className="relative mb-12">
        {/* Explosion background */}
        <div className="absolute inset-0 bg-white rounded-full scale-150 opacity-90" 
          style={{ 
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            transform: 'scale(2.5)'
          }} 
        />
        <div className="relative z-10 px-8 py-4">
          <h1 className="text-5xl md:text-7xl font-black">
            <span className="text-orange-500 drop-shadow-[3px_3px_0_#000]">GAME</span>
            <br />
            <span className="text-yellow-400 drop-shadow-[3px_3px_0_#000]">OVER</span>
          </h1>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-6">
        <button
          onClick={onBackToPatio}
          className="bg-white/90 hover:bg-white text-gray-800 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
        >
          Voltar ao Pátio
        </button>
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
        >
          Recomeçar
        </button>
      </div>
    </div>
  );
};

export default DefeatScreen;
