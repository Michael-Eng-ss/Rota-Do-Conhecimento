import { useEffect, useState } from 'react';

interface DialogBoxProps {
  speaker?: string;
  dialogue?: string;
  onComplete?: () => void;
}

const DialogBox = ({ speaker, dialogue, onComplete }: DialogBoxProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

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
    }, 30);

    return () => clearInterval(interval);
  }, [dialogue, onComplete]);

  const handleClick = () => {
    if (!isComplete && dialogue) {
      setDisplayedText(dialogue);
      setIsComplete(true);
      onComplete?.();
    }
  };

  if (!dialogue) return null;

  return (
    <div 
      className="animate-dialog-appear w-full max-w-4xl mx-auto cursor-pointer"
      onClick={handleClick}
    >
      {speaker && (
        <div className="flex justify-center mb-2">
          <span className="vn-name-tag">{speaker}</span>
        </div>
      )}
      <div className="vn-dialog-box">
        <p className="text-lg md:text-xl leading-relaxed text-center font-medium text-foreground/90">
          {displayedText}
          {!isComplete && (
            <span className="animate-pulse-soft ml-1">▌</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default DialogBox;
