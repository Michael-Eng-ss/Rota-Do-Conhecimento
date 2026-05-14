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
    }, 1300);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Background flash */}
      <div
        className={`absolute inset-0 animate-fade-out ${
          isCorrect ? 'bg-green-500/25' : 'bg-red-500/25'
        }`}
      />

      {/* Icon */}
      <div
        className={`relative flex items-center justify-center w-32 h-32 md:w-44 md:h-44 rounded-full shadow-2xl animate-scale-in ${
          isCorrect
            ? 'bg-gradient-to-br from-green-400 to-green-600'
            : 'bg-gradient-to-br from-red-400 to-red-600'
        }`}
        style={{ boxShadow: isCorrect ? '0 0 60px rgba(34,197,94,0.5)' : '0 0 60px rgba(239,68,68,0.5)' }}
      >
        {isCorrect ? (
          <Check className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg" strokeWidth={3} />
        ) : (
          <X className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg" strokeWidth={3} />
        )}
      </div>

      {/* Text feedback */}
      <div
        className={`absolute bottom-1/3 text-4xl md:text-5xl font-black drop-shadow-2xl animate-fade-in ${
          isCorrect ? 'text-green-300' : 'text-red-300'
        }`}
        style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
      >
        {isCorrect ? '✓ CORRETO!' : '✗ ERRADO!'}
      </div>

      {/* Radiating particles */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * 360;
          const distance = 110 + Math.random() * 40;
          const x = Math.cos((angle * Math.PI) / 180) * distance;
          const y = Math.sin((angle * Math.PI) / 180) * distance;
          return (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${
                isCorrect ? 'bg-green-400' : 'bg-red-400'
              }`}
              style={{
                animation: `particle-burst 0.7s ease-out ${i * 0.04}s forwards`,
                ['--tx' as string]: `${x}px`,
                ['--ty' as string]: `${y}px`,
                opacity: 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackOverlay;

