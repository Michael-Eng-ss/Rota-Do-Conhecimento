import { useState } from 'react';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { environmentConfigs as envConfigsFromFile, type EnvironmentId } from '@/config/environments';
import HealthBar from './HealthBar';
import SoundButton from './SoundButton';
import EnvironmentMenu from './EnvironmentMenu';
import ProfileAvatar from './ProfileAvatar';
import DialogBox from '@/components/VisualNovel/DialogBox';
import CharacterSprite from '@/components/VisualNovel/CharacterSprite';
import BattleScreen from '@/components/Battle/BattleScreen';

// Import backgrounds
import auditorioImage from '@/assets/backgrounds/auditorio.png';
import bibliotecaImage from '@/assets/backgrounds/biblioteca.png';
import salaMatematicaImage from '@/assets/backgrounds/sala-matematica.png';

// Import character sprites
import claraDuvidaImage from '@/assets/characters/clara-duvida.png';
import claraDuvidaMochilaImage from '@/assets/characters/clara-duvida-mochila.png';
import claraMatematicaImage from '@/assets/characters/clara-matematica.png';

interface EnvironmentVisualConfig {
  background: string;
  characterImage: string;
  dialogue: string;
}

const environmentVisualConfigs: Record<EnvironmentId, EnvironmentVisualConfig> = {
  1: {
    background: auditorioImage,
    characterImage: claraDuvidaImage,
    dialogue: "O auditório das ciências e linguagens... Biologia, Química, Física e Língua Portuguesa me aguardam!",
  },
  2: {
    background: bibliotecaImage,
    characterImage: claraDuvidaMochilaImage,
    dialogue: "A biblioteca da formação geral... Literatura, Matemática, Língua Inglesa, Geografia e História me esperam!",
  },
  3: {
    background: salaMatematicaImage,
    characterImage: claraMatematicaImage,
    dialogue: "O desafio final! Todas as matérias em um só combate... Preciso dar o meu melhor!",
  },
};

interface EnvironmentScreenProps {
  environmentId: EnvironmentId;
  onBackToPatio: () => void;
  onProfile: () => void;
  onEnvironmentComplete?: (envId: number, score: number) => void;
}

const EnvironmentScreen = ({ environmentId, onBackToPatio, onProfile, onEnvironmentComplete }: EnvironmentScreenProps) => {
  const [health, setHealth] = useState(100);
  const [showBattle, setShowBattle] = useState(false);
  const [dialogueRead, setDialogueRead] = useState(false);
  const { settings, toggleMute } = useSoundSystem();

  const visualConfig = environmentVisualConfigs[environmentId];
  const envConfig = envConfigsFromFile[environmentId];

  const handleHelp = () => {
    console.log('Ajuda - a ser implementado');
  };

  const handleDialogueClick = () => {
    if (!dialogueRead) {
      setDialogueRead(true);
      setShowBattle(true);
    }
  };

  const handleVictory = (score: number) => {
    onEnvironmentComplete?.(environmentId, score);
  };

  if (showBattle) {
    return (
      <BattleScreen
        environmentId={environmentId}
        onBackToPatio={onBackToPatio}
        onProfile={onProfile}
        onVictory={handleVictory}
      />
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${visualConfig.background})` }}
      />

      <div className="absolute top-4 left-4 flex items-center gap-4 z-20">
        <ProfileAvatar onProfileClick={onProfile} />
        <HealthBar health={health} />
      </div>

      <div className="absolute bottom-40 md:bottom-48 left-4 flex flex-col gap-3 z-20">
        <SoundButton isMuted={settings.isMuted} onToggle={toggleMute} />
        <EnvironmentMenu onBackToPatio={onBackToPatio} onHelp={handleHelp} />
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-20">
        <span className="font-bold">{envConfig.name}</span> - Ambiente {environmentId} / 3
        {envConfig.isFinalBoss && <span className="ml-2 text-red-300">★ BOSS FINAL</span>}
      </div>

      <div className="absolute inset-0 z-10">
        <CharacterSprite
          character={{
            id: `clara-env-${environmentId}`,
            name: 'Clara',
            image: visualConfig.characterImage,
            position: 'center',
          }}
          isNew={true}
        />
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20 cursor-pointer"
        onClick={handleDialogueClick}
      >
        <DialogBox
          speaker="Clara"
          dialogue={visualConfig.dialogue}
        />
      </div>
    </div>
  );
};

export default EnvironmentScreen;
