import { useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface FeedbackOverlayProps {
  type: 'correct' | 'wrong';
  onAnimationEnd?: () => void;
}

const FeedbackOverlay = ({ type, onAnimationEnd }: FeedbackOverlayProps) => {
  const isCorrect = type === 'correct';

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Background flash */}
      <div 
        className={`absolute inset-0 animate-fade-out ${
          isCorrect ? 'bg-green-500/30' : 'bg-red-500/30'
        }`}
      />
      
      {/* Icon */}
      <div 
        className={`relative flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl animate-scale-in ${
          isCorrect 
            ? 'bg-gradient-to-br from-green-400 to-green-600' 
            : 'bg-gradient-to-br from-red-400 to-red-600'
        }`}
      >
        {isCorrect ? (
          <Check className="w-16 h-16 md:w-24 md:h-24 text-white drop-shadow-lg" strokeWidth={3} />
        ) : (
          <X className="w-16 h-16 md:w-24 md:h-24 text-white drop-shadow-lg" strokeWidth={3} />
        )}
      </div>

      {/* Text feedback */}
      <div 
        className={`absolute bottom-1/3 text-4xl md:text-6xl font-bold drop-shadow-2xl animate-fade-in ${
          isCorrect ? 'text-green-400' : 'text-red-400'
        }`}
        style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
      >
        {isCorrect ? 'CORRETO!' : 'ERRADO!'}
      </div>

      {/* Particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 rounded-full animate-scale-out ${
              isCorrect ? 'bg-green-400' : 'bg-red-400'
            }`}
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${i * 30}deg) translateY(-80px)`,
              animationDelay: `${i * 0.05}s`,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackOverlay;
