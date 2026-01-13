import { useState, useCallback, useMemo } from 'react';
import { Scene } from './types';
import CharacterSprite from './CharacterSprite';
import DialogBox from './DialogBox';
import GameButtons from './GameButtons';
import MenuButton from './MenuButton';
import SkipButton from './SkipButton';

// Import assets
import backgroundImage from '@/assets/backgrounds/casa-tropical.jpg';
import claraImage from '@/assets/characters/clara.png';
import maeImage from '@/assets/characters/mae-clara.png';
import paiImage from '@/assets/characters/pai-clara.png';
import claraAnimadaImage from '@/assets/characters/clara-animada.png';

const scenes: Scene[] = [
  {
    id: 1,
    background: backgroundImage,
    characters: [],
    showButtons: true,
    buttonLabels: {
      advance: 'Avançar',
      skip: 'Pular',
    },
  },
  {
    id: 2,
    background: backgroundImage,
    characters: [
      { id: 'clara', name: 'Clara', image: claraImage, position: 'center' },
    ],
    speaker: 'Clara',
    dialogue: 'Olá, me chamo Clara, venho do interior, estudei por muitos anos e agora finalmente vou poder prestar o vestibular de medicina. Estou muito animada.',
  },
  {
    id: 3,
    background: backgroundImage,
    characters: [
      { id: 'mae', name: 'Mãe da Clara', image: maeImage, position: 'left' },
      { id: 'clara', name: 'Clara', image: claraImage, position: 'right' },
    ],
    speaker: 'Mãe Da Clara',
    dialogue: 'Parabéns, minha filha, espero que tenha boa sorte no seu futuro e possa realizar todos os seus desejos. Que tenha muita sorte, seu futuro escolar vai ser ótimo.',
  },
  {
    id: 4,
    background: backgroundImage,
    characters: [
      { id: 'pai', name: 'Pai da Clara', image: paiImage, position: 'left' },
      { id: 'clara', name: 'Clara', image: claraImage, position: 'right' },
    ],
    speaker: 'Pai Da Clara',
    dialogue: 'Parabéns, minha filha, espero que tenha boa sorte no seu futuro e possa realizar todos os seus desejos. Que tenha muita sorte, seu futuro escolar vai ser ótimo.',
  },
  {
    id: 5,
    background: backgroundImage,
    characters: [
      { id: 'pai', name: 'Pai da Clara', image: paiImage, position: 'left' },
      { id: 'mae', name: 'Mãe da Clara', image: maeImage, position: 'left' },
      { id: 'clara-animada', name: 'Clara', image: claraAnimadaImage, position: 'right' },
    ],
    speaker: 'Clara',
    dialogue: 'Irei dar meu melhor!',
  },
];

const VisualNovelGame = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [prevCharacterIds, setPrevCharacterIds] = useState<string[]>([]);

  const currentScene = scenes[currentSceneIndex];

  const handleAdvance = useCallback(() => {
    if (currentSceneIndex < scenes.length - 1) {
      setPrevCharacterIds(currentScene.characters.map(c => c.id));
      setCurrentSceneIndex(prev => prev + 1);
    }
  }, [currentSceneIndex, currentScene.characters]);

  const handleSkip = useCallback(() => {
    // Skip to end or handle skip logic
    setCurrentSceneIndex(scenes.length - 1);
  }, []);

  const handleScreenClick = useCallback(() => {
    if (!currentScene.showButtons && currentScene.dialogue) {
      handleAdvance();
    }
  }, [currentScene, handleAdvance]);

  // Determine which characters are new in this scene
  const newCharacterIds = useMemo(() => {
    return currentScene.characters
      .filter(c => !prevCharacterIds.includes(c.id))
      .map(c => c.id);
  }, [currentScene.characters, prevCharacterIds]);

  // Special positioning for scene 5 (family scene)
  const renderCharacters = () => {
    if (currentScene.id === 5) {
      // Custom rendering for family scene
      return (
        <>
          <div className="absolute bottom-0 left-0 md:left-4 flex">
            <img
              src={paiImage}
              alt="Pai da Clara"
              className="h-[55vh] md:h-[65vh] object-contain drop-shadow-2xl animate-float"
            />
            <img
              src={maeImage}
              alt="Mãe da Clara"
              className="h-[55vh] md:h-[65vh] object-contain drop-shadow-2xl animate-float -ml-16"
              style={{ animationDelay: '0.3s' }}
            />
          </div>
          <div className="absolute bottom-0 right-0 md:right-8 animate-character-enter-right">
            <img
              src={claraAnimadaImage}
              alt="Clara"
              className="h-[55vh] md:h-[65vh] object-contain drop-shadow-2xl animate-float"
              style={{ animationDelay: '0.6s' }}
            />
          </div>
        </>
      );
    }

    return currentScene.characters.map(character => (
      <CharacterSprite
        key={character.id}
        character={character}
        isNew={newCharacterIds.includes(character.id)}
      />
    ));
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden cursor-pointer select-none"
      onClick={handleScreenClick}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{ backgroundImage: `url(${currentScene.background})` }}
      />

      {/* Top UI */}
      <div className="absolute top-4 right-4 flex gap-3 z-20">
        <SkipButton onClick={handleSkip} />
        <MenuButton />
      </div>

      {/* Scene indicator (debug) */}
      <div className="absolute top-4 left-4 text-sm text-foreground/50 z-20">
        Cutscene {currentScene.id}
      </div>

      {/* Characters */}
      <div className="absolute inset-0 z-10">
        {renderCharacters()}
      </div>

      {/* Bottom UI */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
        {currentScene.showButtons ? (
          <div className="flex justify-end">
            <GameButtons
              showAdvance={true}
              advanceLabel={currentScene.buttonLabels?.advance}
              skipLabel={currentScene.buttonLabels?.skip}
              onAdvance={handleAdvance}
              onSkip={handleSkip}
            />
          </div>
        ) : (
          <DialogBox
            speaker={currentScene.speaker}
            dialogue={currentScene.dialogue}
          />
        )}
      </div>

      {/* Click indicator for dialogue scenes */}
      {!currentScene.showButtons && currentScene.dialogue && (
        <div className="absolute bottom-2 right-4 text-sm text-foreground/40 animate-pulse z-30">
          Clique para continuar...
        </div>
      )}
    </div>
  );
};

export default VisualNovelGame;
