import { useState } from 'react';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import HealthBar from './HealthBar';
import SoundButton from './SoundButton';
import EnvironmentMenu from './EnvironmentMenu';
import ProfileAvatar from './ProfileAvatar';
import DialogBox from '@/components/VisualNovel/DialogBox';
import CharacterSprite from '@/components/VisualNovel/CharacterSprite';

// Import assets
import patioEscolaImage from '@/assets/backgrounds/patio-escola.png';
import claraDuvidaImage from '@/assets/characters/clara-duvida.png';

interface EnvironmentScreenProps {
  environmentId: 1 | 2 | 3 | 4;
  onBackToPatio: () => void;
  onProfile: () => void;
}

const EnvironmentScreen = ({ environmentId, onBackToPatio, onProfile }: EnvironmentScreenProps) => {
  const [health, setHealth] = useState(100);
  const { settings, toggleMute } = useSoundSystem();

  const handleHelp = () => {
    console.log('Ajuda - a ser implementado');
  };

  // Reduz vida quando erra (será chamado pelo sistema de perguntas)
  const takeDamage = (damage: number) => {
    setHealth(prev => Math.max(0, prev - damage));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${patioEscolaImage})` }}
      />

      {/* Top UI - Esquerda: Perfil + Barra de Vida */}
      <div className="absolute top-4 left-4 flex items-center gap-3 z-20">
        <ProfileAvatar onProfileClick={onProfile} />
        <HealthBar health={health} />
      </div>

      {/* Top UI - Direita: Som + Menu */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
        <SoundButton isMuted={settings.isMuted} onToggle={toggleMute} />
        <EnvironmentMenu onBackToPatio={onBackToPatio} onHelp={handleHelp} />
      </div>

      {/* Indicador de Ambiente */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-20">
        Ambiente {environmentId} / 4
      </div>

      {/* Personagem */}
      <div className="absolute inset-0 z-10">
        <CharacterSprite
          character={{
            id: 'clara-duvida',
            name: 'Clara',
            image: claraDuvidaImage,
            position: 'center',
          }}
          isNew={true}
        />
      </div>

      {/* Diálogo */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
        <DialogBox
          speaker="Clara"
          dialogue="O que aconteceu com o pátio da escola? Nunca tinha visto ele assim, esse desastre deve ser por conta da corrupção."
        />
      </div>
    </div>
  );
};

export default EnvironmentScreen;
