import { useState } from 'react';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import HealthBar from './HealthBar';
import SoundButton from './SoundButton';
import EnvironmentMenu from './EnvironmentMenu';
import ProfileAvatar from './ProfileAvatar';
import DialogBox from '@/components/VisualNovel/DialogBox';
import CharacterSprite from '@/components/VisualNovel/CharacterSprite';

// Import backgrounds
import auditorioImage from '@/assets/backgrounds/auditorio.png';
import bibliotecaImage from '@/assets/backgrounds/biblioteca.png';
import laboratorioImage from '@/assets/backgrounds/laboratorio.png';
import salaMatematicaImage from '@/assets/backgrounds/sala-matematica.png';

// Import character sprites
import claraDuvidaImage from '@/assets/characters/clara-duvida.png';
import claraDuvidaMochilaImage from '@/assets/characters/clara-duvida-mochila.png';
import claraLaboratorioImage from '@/assets/characters/clara-laboratorio.png';
import claraMatematicaImage from '@/assets/characters/clara-matematica.png';

interface EnvironmentConfig {
  background: string;
  characterImage: string;
  dialogue: string;
  subject: string;
}

const environmentConfigs: Record<1 | 2 | 3 | 4, EnvironmentConfig> = {
  1: {
    background: auditorioImage,
    characterImage: claraDuvidaImage,
    dialogue: "O que aconteceu com o pátio da escola? Nunca tinha visto ele assim, esse desastre deve ser por conta da corrupção.",
    subject: "Português",
  },
  2: {
    background: bibliotecaImage,
    characterImage: claraDuvidaMochilaImage,
    dialogue: "Minha querida biblioteca, até ela está sendo afetada, como? Sei que irei conseguir, vou arrumar tudo.",
    subject: "História",
  },
  3: {
    background: laboratorioImage,
    characterImage: claraLaboratorioImage,
    dialogue: "Oi, alguém? Sempre tive receio desse lugar, laboratório me dá calafrio.",
    subject: "Ciências",
  },
  4: {
    background: salaMatematicaImage,
    characterImage: claraMatematicaImage,
    dialogue: "Meu lugar favorito, sempre fui muito apegado aqui, minha segunda casa. Sem estar aqui, me sinto meia vazia. Tive vários momentos especiais aqui, todos sabem como eu me dedico nessa parte. Não quero mesmo reprovar, então vamos lá.",
    subject: "Matemática",
  },
};

interface EnvironmentScreenProps {
  environmentId: 1 | 2 | 3 | 4;
  onBackToPatio: () => void;
  onProfile: () => void;
}

const EnvironmentScreen = ({ environmentId, onBackToPatio, onProfile }: EnvironmentScreenProps) => {
  const [health, setHealth] = useState(100);
  const { settings, toggleMute } = useSoundSystem();

  const config = environmentConfigs[environmentId];

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
        style={{ backgroundImage: `url(${config.background})` }}
      />

      {/* Top UI - Esquerda: Perfil + Barra de Vida */}
      <div className="absolute top-4 left-4 flex items-center gap-4 z-20">
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
        <span className="font-bold">{config.subject}</span> - Ambiente {environmentId} / 4
      </div>

      {/* Personagem */}
      <div className="absolute inset-0 z-10">
        <CharacterSprite
          character={{
            id: `clara-env-${environmentId}`,
            name: 'Clara',
            image: config.characterImage,
            position: 'center',
          }}
          isNew={true}
        />
      </div>

      {/* Diálogo */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
        <DialogBox
          speaker="Clara"
          dialogue={config.dialogue}
        />
      </div>
    </div>
  );
};

export default EnvironmentScreen;
