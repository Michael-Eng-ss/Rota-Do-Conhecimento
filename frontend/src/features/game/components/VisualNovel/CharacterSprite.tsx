import { Character } from './types';

interface CharacterSpriteProps {
  character: Character;
  isNew?: boolean;
}

const CharacterSprite = ({ character, isNew = false }: CharacterSpriteProps) => {
  const positionClasses = {
    'far-left': 'left-0 md:left-0',
    left: 'left-[10%] md:left-[12%]',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-[10%] md:right-[12%]',
    'far-right': 'right-0 md:right-0',
  };

  const animationClasses = {
    'far-left': isNew ? 'animate-character-enter-left' : '',
    left: isNew ? 'animate-character-enter-left' : '',
    center: isNew ? 'animate-character-enter-center' : '',
    right: isNew ? 'animate-character-enter-right' : '',
    'far-right': isNew ? 'animate-character-enter-right' : '',
  };

  return (
    <div
      className={`absolute bottom-0 ${positionClasses[character.position]} ${animationClasses[character.position]}`}
    >
      <img
        src={character.image}
        alt={character.name}
        className="max-h-[75vh] max-w-[38vw] w-auto object-contain drop-shadow-2xl animate-float"
        style={{ animationDelay: character.position === 'right' ? '0.5s' : '0s' }}
      />
    </div>
  );
};

export default CharacterSprite;
