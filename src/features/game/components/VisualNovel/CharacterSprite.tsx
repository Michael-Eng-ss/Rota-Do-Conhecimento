import { Character } from './types';

interface CharacterSpriteProps {
  character: Character;
  isNew?: boolean;
}

const CharacterSprite = ({ character, isNew = false }: CharacterSpriteProps) => {
  const positionClasses = {
    left: 'left-0 md:left-8',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0 md:right-8',
  };

  const animationClasses = {
    left: isNew ? 'animate-character-enter-left' : '',
    center: isNew ? 'animate-character-enter-center' : '',
    right: isNew ? 'animate-character-enter-right' : '',
  };

  return (
    <div
      className={`absolute bottom-0 ${positionClasses[character.position]} ${animationClasses[character.position]}`}
    >
      <img
        src={character.image}
        alt={character.name}
        className="h-[60vh] md:h-[70vh] object-contain drop-shadow-2xl animate-float"
        style={{ animationDelay: character.position === 'right' ? '0.5s' : '0s' }}
      />
    </div>
  );
};

export default CharacterSprite;
