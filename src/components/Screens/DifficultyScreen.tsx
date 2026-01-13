import GameBackground from '@/components/Game/GameBackground';
import GameButton from '@/components/Game/GameButton';
import DifficultyCard from '@/components/Game/DifficultyCard';

interface DifficultyScreenProps {
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onBack: () => void;
}

const DifficultyScreen = ({ onSelectDifficulty, onBack }: DifficultyScreenProps) => {
  return (
    <GameBackground>
      <div className="flex flex-col min-h-screen px-4">
        {/* Difficulty Cards */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-wrap justify-center items-end gap-4 md:gap-8">
            <DifficultyCard
              label="Fácil"
              color="green"
              onClick={() => onSelectDifficulty('easy')}
              className="self-start mt-8"
            />
            
            <DifficultyCard
              label="Médio"
              color="yellow"
              onClick={() => onSelectDifficulty('medium')}
              className="self-center"
            />
            
            <DifficultyCard
              label="Difícil"
              color="red"
              onClick={() => onSelectDifficulty('hard')}
              className="self-start mt-8"
            />
          </div>
        </div>

        {/* Back Button */}
        <div className="pb-8 pl-4">
          <GameButton onClick={onBack} variant="primary" className="w-48">
            Voltar
          </GameButton>
        </div>
      </div>
    </GameBackground>
  );
};

export default DifficultyScreen;
