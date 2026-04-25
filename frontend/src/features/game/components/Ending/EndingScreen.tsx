import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import EndingCharacterSprite from './EndingCharacterSprite';
import { Character } from '../VisualNovel/types';
import DialogBox from '../VisualNovel/DialogBox';
import MenuButton from '../VisualNovel/MenuButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { endingScenes } from './endingScenes';

const EXIT_DURATION_MS = 350;

interface EndingScreenProps {
  onBack?: () => void;
  onEndingComplete?: () => void;
}

/**
 * Tela de final da história — reutiliza a engine de visual novel
 * para exibir as cenas de encerramento após a vitória do jogador.
 * Inclui animações de entrada/saída de personagens e destaque do speaker.
 */
const EndingScreen = ({ onBack, onEndingComplete }: EndingScreenProps) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [prevCharacters, setPrevCharacters] = useState<Character[]>([]);
  // Personagens que estão saindo nesta transição (renderizados temporariamente)
  const [exitingCharacters, setExitingCharacters] = useState<Character[]>([]);
  const exitTimerRef = useRef<number | null>(null);

  const currentScene = endingScenes[currentSceneIndex];
  const isFirstScene = currentSceneIndex === 0;
  const isLastScene = currentSceneIndex === endingScenes.length - 1;

  const goToScene = useCallback(
    (nextIndex: number) => {
      const nextScene = endingScenes[nextIndex];
      if (!nextScene) return;

      // Personagens que existiam mas não estão mais na próxima cena → animam saída
      const nextIds = new Set(nextScene.characters.map(c => c.id));
      const leaving = currentScene.characters.filter(c => !nextIds.has(c.id));

      setPrevCharacters(currentScene.characters);
      setExitingCharacters(leaving);
      setCurrentSceneIndex(nextIndex);

      // Limpa os "exiting" após a animação para não acumular
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = window.setTimeout(() => {
        setExitingCharacters([]);
      }, EXIT_DURATION_MS);
    },
    [currentScene.characters]
  );

  const handleAdvance = useCallback(() => {
    if (currentSceneIndex < endingScenes.length - 1) {
      goToScene(currentSceneIndex + 1);
    } else if (onEndingComplete) {
      onEndingComplete();
    }
  }, [currentSceneIndex, goToScene, onEndingComplete]);

  const handlePrevious = useCallback(() => {
    if (currentSceneIndex > 0) {
      goToScene(currentSceneIndex - 1);
    }
  }, [currentSceneIndex, goToScene]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  const handleScreenClick = useCallback(() => {
    if (!currentScene.showButtons && currentScene.dialogue) {
      handleAdvance();
    }
  }, [currentScene, handleAdvance]);

  const prevIds = useMemo(
    () => new Set(prevCharacters.map(c => c.id)),
    [prevCharacters]
  );

  const hasActiveSpeaker = Boolean(currentScene.speaker);

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
        <MenuButton onExit={onBack} />
      </div>

      <div className="absolute top-4 left-4 text-sm text-white/70 drop-shadow z-20 font-bold">
        Final {currentSceneIndex + 1} / {endingScenes.length}
      </div>

      {/* Navegação — seta esquerda */}
      {!isFirstScene && (
        <div className="absolute bottom-1/2 left-4 z-30">
          <button
            onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all duration-200 hover:scale-110"
            title="Cena anterior"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        </div>
      )}

      {/* Navegação — seta direita (só aparece quando não há botão Finalizar) */}
      {!isLastScene && !currentScene.showButtons && (
        <div className="absolute bottom-1/2 right-4 z-30">
          <button
            onClick={(e) => { e.stopPropagation(); handleAdvance(); }}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all duration-200 hover:scale-110"
            title="Próxima cena"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>
      )}

      {/* Personagens */}
      <div className="absolute inset-0 z-10">
        {/* Personagens saindo (animação de exit) */}
        {exitingCharacters.map(character => (
          <EndingCharacterSprite
            key={`exit-${character.id}`}
            character={character}
            isExiting
          />
        ))}

        {/* Personagens da cena atual */}
        {currentScene.characters.map(character => {
          const isEntering = !prevIds.has(character.id);
          const isSpeaking =
            hasActiveSpeaker &&
            currentScene.speaker?.toLowerCase() === character.name.toLowerCase();

          return (
            <EndingCharacterSprite
              key={character.id}
              character={character}
              isEntering={isEntering}
              isSpeaking={isSpeaking}
              hasActiveSpeaker={hasActiveSpeaker}
            />
          );
        })}
      </div>

      {/* Bottom UI */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20 animate-dialog-appear"
      >
        {currentScene.showButtons ? (
          <div className="flex flex-col gap-4 items-center">
            {currentScene.dialogue && (
              <DialogBox
                key={`dialog-${currentSceneIndex}`}
                speaker={currentScene.speaker}
                dialogue={currentScene.dialogue}
              />
            )}
            <button
              onClick={(e) => { e.stopPropagation(); handleAdvance(); }}
              className="vn-button min-w-[200px]"
            >
              {currentScene.buttonLabels?.advance ?? 'Finalizar'}
            </button>
          </div>
        ) : (
          <DialogBox
            key={`dialog-${currentSceneIndex}`}
            speaker={currentScene.speaker}
            dialogue={currentScene.dialogue}
          />
        )}
      </div>

      {!currentScene.showButtons && currentScene.dialogue && (
        <div className="absolute bottom-2 right-4 text-sm text-white/50 animate-pulse z-30 drop-shadow">
          Clique para continuar...
        </div>
      )}
    </div>
  );
};

export default EndingScreen;
