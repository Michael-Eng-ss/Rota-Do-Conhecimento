import { useState, useCallback, useMemo } from 'react';
import { Scene } from './types';
import CharacterSprite from './CharacterSprite';
import DialogBox from './DialogBox';
import GameButtons from './GameButtons';
import MenuButton from './MenuButton';
import SkipButton from './SkipButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import assets - backgrounds
import backgroundImage from '@/assets/backgrounds/casa-tropical.jpg';
import universidadeImage from '@/assets/backgrounds/universidade.jpg';
import patioEscolaImage from '@/assets/backgrounds/patio-escola.png';

// Import assets - characters
import claraImage from '@/assets/characters/clara.png';
import maeImage from '@/assets/characters/mae-clara.png';
import paiImage from '@/assets/characters/pai-clara.png';
import claraAnimadaImage from '@/assets/characters/clara-animada.png';
import claraDuvidaImage from '@/assets/characters/clara-duvida.png';
import claraEspantoImage from '@/assets/characters/clara-espanto.png';

interface VisualNovelGameProps {
  onBack?: () => void;
}

const scenes: Scene[] = [
  // Cena 1 - Intro com botões
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
  // Cena 2 - Clara se apresenta
  {
    id: 2,
    background: backgroundImage,
    characters: [
      { id: 'clara', name: 'Clara', image: claraImage, position: 'center' },
    ],
    speaker: 'Clara',
    dialogue: 'Olá, me chamo Clara, venho do interior, estudei por muitos anos e agora finalmente vou poder prestar o vestibular de medicina. Estou muito animada.',
  },
  // Cena 3 - Mãe fala com Clara
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
  // Cena 4 - Pai fala com Clara
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
  // Cena 5 - Família reunida
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
  // Cena 6 - Clara na universidade (animada)
  {
    id: 6,
    background: universidadeImage,
    characters: [
      { id: 'clara-animada', name: 'Clara', image: claraAnimadaImage, position: 'center' },
    ],
    speaker: 'Clara',
    dialogue: 'Hoje é o dia do meu vestibular, finalmente poderei mostrar o tanto que estudei esses dias.',
  },
  // Cena 7 - Clara no pátio da escola (confusa com dúvida)
  {
    id: 7,
    background: patioEscolaImage,
    characters: [
      { id: 'clara-duvida', name: 'Clara', image: claraDuvidaImage, position: 'center' },
    ],
    speaker: 'Clara',
    dialogue: 'Espera, por que está com esse clima tão estranho aqui dentro?',
  },
  // Cena 8 - Lívia aparece (Clara com dúvida)
  {
    id: 8,
    background: patioEscolaImage,
    characters: [
      { id: 'livia', name: 'Lívia', image: claraImage, position: 'left' }, // Placeholder - substituir por sprite da Lívia
      { id: 'clara-duvida', name: 'Clara', image: claraDuvidaImage, position: 'right' },
    ],
    speaker: 'Lívia',
    dialogue: 'CLARA! AIII QUE BOM TE ENCONTRAR!!!',
  },
  // Cena 9 - Clara pergunta para Lívia (espanto)
  {
    id: 9,
    background: patioEscolaImage,
    characters: [
      { id: 'livia', name: 'Lívia', image: claraImage, position: 'left' }, // Placeholder - substituir por sprite da Lívia
      { id: 'clara-espanto', name: 'Clara', image: claraEspantoImage, position: 'right' },
    ],
    speaker: 'Clara',
    dialogue: 'Lívia, o que houve com a escola?',
  },
];

const VisualNovelGame = ({ onBack }: VisualNovelGameProps) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [prevCharacterIds, setPrevCharacterIds] = useState<string[]>([]);

  const currentScene = scenes[currentSceneIndex];
  const isFirstScene = currentSceneIndex === 0;
  const isLastScene = currentSceneIndex === scenes.length - 1;

  const handleAdvance = useCallback(() => {
    if (currentSceneIndex < scenes.length - 1) {
      setPrevCharacterIds(currentScene.characters.map(c => c.id));
      setCurrentSceneIndex(prev => prev + 1);
    }
  }, [currentSceneIndex, currentScene.characters]);

  const handlePrevious = useCallback(() => {
    if (currentSceneIndex > 0) {
      setPrevCharacterIds(currentScene.characters.map(c => c.id));
      setCurrentSceneIndex(prev => prev - 1);
    }
  }, [currentSceneIndex, currentScene.characters]);

  const handleSkip = useCallback(() => {
    // Skip to end or handle skip logic
    setCurrentSceneIndex(scenes.length - 1);
  }, []);

  const handleGoToFirst = useCallback(() => {
    setPrevCharacterIds([]);
    setCurrentSceneIndex(0);
  }, []);

  const handleGoToLast = useCallback(() => {
    setPrevCharacterIds([]);
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
        {onBack && (
          <button
            onClick={onBack}
            className="vn-skip-button"
          >
            Sair
          </button>
        )}
        <SkipButton onClick={handleSkip} />
        <MenuButton />
      </div>

      {/* Scene indicator (debug) */}
      <div className="absolute top-4 left-4 text-sm text-foreground/50 z-20">
        Cutscene {currentScene.id} / {scenes.length}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 left-4 z-30">
        <button
          onClick={isFirstScene ? handleGoToLast : handlePrevious}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all duration-200 hover:scale-110"
          title={isFirstScene ? "Ir para última cena" : "Cena anterior"}
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      </div>
      
      <div className="absolute bottom-1/2 right-4 z-30">
        <button
          onClick={isLastScene ? handleGoToFirst : handleAdvance}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all duration-200 hover:scale-110"
          title={isLastScene ? "Ir para primeira cena" : "Próxima cena"}
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
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
