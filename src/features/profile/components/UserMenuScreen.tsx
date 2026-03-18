import GameBackground from '@/components/Game/GameBackground';
import GameHeader from '@/components/Game/GameHeader';
import GameButton from '@/components/Game/GameButton';

interface UserMenuScreenProps {
  onStart: () => void;
  onRanking: () => void;
  onProfile: () => void;
  onBack: () => void;
}

const UserMenuScreen = ({ onStart, onRanking, onProfile, onBack }: UserMenuScreenProps) => {
  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 md:pt-12 px-4">
        <GameHeader />
        
        <div className="mt-12 md:mt-16 flex flex-col items-center gap-4">
          <GameButton onClick={onStart} className="w-48">
            Iniciar
          </GameButton>
          
          <GameButton onClick={onRanking} className="w-48">
            Ranking
          </GameButton>
          
          <GameButton onClick={onProfile} className="w-48">
            Perfil
          </GameButton>
          
          <GameButton onClick={onBack} variant="secondary" className="w-48">
            Voltar
          </GameButton>
        </div>
      </div>
    </GameBackground>
  );
};

export default UserMenuScreen;
