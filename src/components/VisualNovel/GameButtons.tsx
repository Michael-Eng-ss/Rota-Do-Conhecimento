interface GameButtonsProps {
  showAdvance?: boolean;
  advanceLabel?: string;
  skipLabel?: string;
  onAdvance?: () => void;
  onSkip?: () => void;
}

const GameButtons = ({ 
  showAdvance = true, 
  advanceLabel = 'Avançar', 
  skipLabel = 'Pular',
  onAdvance,
  onSkip 
}: GameButtonsProps) => {
  return (
    <div className="flex flex-col gap-3">
      {showAdvance && (
        <button 
          className="vn-button min-w-[200px]"
          onClick={onAdvance}
        >
          {advanceLabel}
        </button>
      )}
      <button 
        className="vn-button-secondary min-w-[200px]"
        onClick={onSkip}
      >
        {skipLabel}
      </button>
    </div>
  );
};

export default GameButtons;
