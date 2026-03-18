import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Alternative {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MultipleChoiceCardProps {
  questionNumber: number;
  totalQuestions: number;
  baseText: string;
  alternatives: Alternative[];
  onConfirm: (selectedAlternativeId: string) => void;
  disabled?: boolean;
  reviewMode?: boolean;
  reviewSelectedId?: string;
  onContinue?: () => void;
}

const MultipleChoiceCard = ({
  questionNumber,
  totalQuestions,
  baseText,
  alternatives,
  onConfirm,
  disabled = false,
  reviewMode = false,
  reviewSelectedId,
  onContinue,
}: MultipleChoiceCardProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Reset selection when question changes
  useEffect(() => {
    setSelectedId(null);
  }, [questionNumber]);

  const handleConfirm = () => {
    if (selectedId && !disabled) {
      onConfirm(selectedId);
    }
  };

  const displaySelectedId = reviewMode ? reviewSelectedId : selectedId;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4 py-8 overflow-auto">
      {/* Question Counter */}
      <div className="bg-blue-600 text-white px-4 py-2 rounded-full mb-4 shadow-lg pointer-events-auto flex-shrink-0">
        <span className="font-bold">Questão {questionNumber} de {totalQuestions}</span>
      </div>

      {/* Question Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-blue-400 pointer-events-auto max-w-3xl w-full mx-auto overflow-hidden flex-shrink-0 max-h-[75vh] overflow-y-auto">
        {/* Base Text */}
        <div className="p-4 md:p-6 bg-blue-50 border-b-2 border-blue-200 max-h-[200px] overflow-y-auto">
          <p className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {baseText}
          </p>
        </div>

        {/* Instructions */}
        <div className="px-4 md:px-6 py-2 bg-gray-100 border-b border-gray-200">
          <p className="text-gray-600 text-sm font-medium">
            Selecione a alternativa correta:
          </p>
        </div>

        {/* Alternatives */}
        <div className="p-4 md:p-6 space-y-3">
          {alternatives.map((alt, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = displaySelectedId === alt.id;

            // Determine styling
            let bgClass = 'bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-300';
            if (reviewMode) {
              if (alt.isCorrect) {
                bgClass = 'bg-green-100 border-2 border-green-400';
              } else if (isSelected && !alt.isCorrect) {
                bgClass = 'bg-red-100 border-2 border-red-400';
              } else {
                bgClass = 'bg-gray-50 border border-gray-200 opacity-60';
              }
            } else if (isSelected) {
              bgClass = 'bg-blue-100 border-2 border-blue-500 shadow-md';
            }

            return (
              <button
                key={alt.id}
                type="button"
                onClick={() => !disabled && !reviewMode && setSelectedId(alt.id)}
                disabled={disabled || reviewMode}
                className={`w-full flex items-center gap-3 p-3 md:p-4 rounded-xl text-left transition-all ${bgClass} ${
                  disabled || reviewMode ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                {/* Letter circle */}
                <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  reviewMode && alt.isCorrect
                    ? 'bg-green-500 text-white'
                    : reviewMode && isSelected && !alt.isCorrect
                    ? 'bg-red-500 text-white'
                    : isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {letter}
                </span>

                {/* Text */}
                <span className="flex-1 text-gray-800 text-sm md:text-base leading-relaxed">
                  {alt.text}
                </span>

                {/* Review icons */}
                {reviewMode && alt.isCorrect && (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                )}
                {reviewMode && isSelected && !alt.isCorrect && (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Confirm / Continue Button */}
        <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200">
          {reviewMode ? (
            <button
              onClick={onContinue}
              className="w-full py-4 rounded-xl text-xl font-bold transition-all duration-300 shadow-xl bg-blue-500 hover:bg-blue-600 text-white hover:scale-[1.02]"
            >
              Continuar ➜
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!selectedId || disabled}
              className={`w-full py-4 rounded-xl text-xl font-bold transition-all duration-300 shadow-xl ${
                selectedId && !disabled
                  ? 'bg-green-500 hover:bg-green-600 text-white scale-100 hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedId ? 'Confirmar Resposta' : 'Selecione uma alternativa'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceCard;
