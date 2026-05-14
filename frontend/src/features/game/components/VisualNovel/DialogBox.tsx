import { useEffect, useState, useCallback } from 'react';

interface DialogBoxProps {
  speaker?: string;
  dialogue?: string;
  onComplete?: () => void;
}

const DialogBox = ({ speaker, dialogue, onComplete }: DialogBoxProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const finishText = useCallback(() => {
    if (dialogue) {
      setDisplayedText(dialogue);
      setIsComplete(true);
      onComplete?.();
    }
  }, [dialogue, onComplete]);

  useEffect(() => {
    if (!dialogue) {
      setDisplayedText('');
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < dialogue.length) {
        setDisplayedText(dialogue.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        onComplete?.();
      }
    }, 28);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogue]);

  const handleClick = () => {
    if (!isComplete) {
      finishText();
    }
  };

  if (!dialogue) return null;

  return (
    <div
      className="animate-dialog-appear w-full max-w-4xl mx-auto cursor-pointer select-none"
      onClick={handleClick}
    >
      {speaker && (
        <div className="flex justify-center mb-2">
          <span className="vn-name-tag">{speaker}</span>
        </div>
      )}
      <div className="vn-dialog-box">
        <p className="text-lg md:text-xl leading-relaxed text-center font-medium text-foreground/90 min-h-[2.5rem]">
          {displayedText}
          {!isComplete && (
            <span className="animate-pulse-soft ml-1">▌</span>
          )}
        </p>
        {/* Indicador "clique para continuar" quando texto completo */}
        {isComplete && (
          <div className="flex justify-end mt-2">
            <span className="text-sm text-foreground/50 animate-bounce select-none">
              Clique para continuar ▼
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogBox;
