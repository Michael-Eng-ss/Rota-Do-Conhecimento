import { Character } from '../VisualNovel/types';

interface EndingCharacterSpriteProps {
  character: Character;
  /** Personagem acabou de entrar nesta cena */
  isEntering?: boolean;
  /** Personagem está saindo (não existe na próxima cena) */
  isExiting?: boolean;
  /** Personagem é o speaker da cena atual */
  isSpeaking?: boolean;
  /** Existe um speaker ativo na cena? (para escurecer os outros) */
  hasActiveSpeaker?: boolean;
}

/**
 * Sprite de personagem específico do Ending.
 * Suporta animações de entrada, saída e destaque do speaker
 * para dar uma sensação mais fluida de visual novel.
 */
const EndingCharacterSprite = ({
  character,
  isEntering = false,
  isExiting = false,
  isSpeaking = false,
  hasActiveSpeaker = false,
}: EndingCharacterSpriteProps) => {
  const positionClasses = {
    left: 'left-0 md:left-8',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0 md:right-8',
  };

  const enterClass = {
    left: 'animate-character-enter-left',
    center: 'animate-character-enter-center',
    right: 'animate-character-enter-right',
  }[character.position];

  const exitClass = {
    left: 'animate-character-exit-left',
    center: 'animate-character-exit-center',
    right: 'animate-character-exit-right',
  }[character.position];

  const motionClass = isExiting ? exitClass : isEntering ? enterClass : '';

  // Destaque do speaker (apenas se houver alguém falando na cena)
  const speakerClass = hasActiveSpeaker
    ? isSpeaking
      ? 'vn-speaker-active'
      : 'vn-speaker-inactive'
    : '';

  return (
    <div
      className={`absolute bottom-0 ${positionClasses[character.position]} ${motionClass}`}
      style={{ zIndex: isSpeaking ? 2 : 1 }}
    >
      <img
        src={character.image}
        alt={character.name}
        className={`h-[60vh] md:h-[70vh] object-contain drop-shadow-2xl animate-float ${speakerClass}`}
        style={{ animationDelay: character.position === 'right' ? '0.5s' : '0s' }}
      />
    </div>
  );
};

export default EndingCharacterSprite;
