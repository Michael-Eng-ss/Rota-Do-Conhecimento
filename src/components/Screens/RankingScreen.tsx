import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import GameBackground from '../Game/GameBackground';
import GameHeader from '../Game/GameHeader';
import GameButton from '../Game/GameButton';
import GameFormCard from '../Game/GameFormCard';

interface RankingScreenProps {
  onBack: () => void;
}

interface PlayerRank {
  position: number;
  name: string;
  score: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

const mockRanking: PlayerRank[] = [
  { position: 1, name: 'Clara Silva', score: 9850, difficulty: 'Difícil' },
  { position: 2, name: 'João Pedro', score: 8720, difficulty: 'Difícil' },
  { position: 3, name: 'Maria Santos', score: 7650, difficulty: 'Médio' },
  { position: 4, name: 'Lucas Oliveira', score: 6890, difficulty: 'Médio' },
  { position: 5, name: 'Ana Costa', score: 5430, difficulty: 'Fácil' },
  { position: 6, name: 'Pedro Lima', score: 4920, difficulty: 'Fácil' },
  { position: 7, name: 'Julia Ferreira', score: 4210, difficulty: 'Médio' },
  { position: 8, name: 'Rafael Souza', score: 3890, difficulty: 'Fácil' },
];

const RankingScreen = ({ onBack }: RankingScreenProps) => {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-white">{position}</span>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-500/80';
      case 'Médio':
        return 'bg-yellow-500/80';
      case 'Difícil':
        return 'bg-red-500/80';
      default:
        return 'bg-gray-500/80';
    }
  };

  const getRowBackground = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-yellow-500/20 border-yellow-400/50';
      case 2:
        return 'bg-gray-400/20 border-gray-300/50';
      case 3:
        return 'bg-amber-600/20 border-amber-500/50';
      default:
        return 'bg-white/10 border-white/20';
    }
  };

  return (
    <GameBackground>
      <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-8 md:pt-12">
        <GameHeader />
        
        <GameFormCard title="🏆 Ranking" variant="blue">
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
            {mockRanking.map((player) => (
              <div
                key={player.position}
                className={`flex items-center gap-3 p-3 rounded-xl border ${getRowBackground(player.position)} transition-all hover:scale-[1.02]`}
              >
                <div className="flex-shrink-0">
                  {getPositionIcon(player.position)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{player.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm">{player.score.toLocaleString()} pts</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getDifficultyColor(player.difficulty)}`}>
                      {player.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/20">
            <GameButton 
              variant="secondary" 
              onClick={onBack}
              className="w-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </GameButton>
          </div>
        </GameFormCard>
      </div>
    </GameBackground>
  );
};

export default RankingScreen;
