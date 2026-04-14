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

/** Classifica o texto para adaptar tamanho de fonte e layout */
function getTextSize(text: string): 'short' | 'medium' | 'long' {
  if (text.length <= 80)  return 'short';
  if (text.length <= 220) return 'medium';
  return 'long';
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

  useEffect(() => {
    setSelectedId(null);
  }, [questionNumber]);

  const handleConfirm = () => {
    if (selectedId && !disabled) onConfirm(selectedId);
  };

  const displaySelectedId = reviewMode ? reviewSelectedId : selectedId;
  const questionSize   = getTextSize(baseText);
  const hasLongAlts    = alternatives.some(a => a.text.length > 120);
  const hasShortAlts   = alternatives.every(a => a.text.length <= 50);

  // Tamanho de fonte do enunciado baseado no tamanho do texto
  const questionFontClass =
    questionSize === 'short'  ? 'text-base md:text-lg lg:text-xl' :
    questionSize === 'medium' ? 'text-sm  md:text-base'           :
                                'text-xs  md:text-sm';

  // Tamanho de fonte das alternativas
  const altFontClass = hasLongAlts
    ? 'text-xs md:text-sm'
    : hasShortAlts
    ? 'text-sm md:text-base lg:text-lg'
    : 'text-sm md:text-base';

  // Grid 2 colunas somente se alternativas forem curtas
  const altGridClass = hasShortAlts && alternatives.length <= 4
    ? 'grid grid-cols-2 gap-2'
    : 'flex flex-col gap-2';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-2 sm:px-4 py-2 sm:py-4">

      {/* Contador flutuante */}
      <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full mb-2 shadow-lg pointer-events-auto flex-shrink-0 text-sm font-bold">
        Questão {questionNumber} de {totalQuestions}
      </div>

      {/* Card principal — cresce com o conteúdo até o limite da tela */}
      <div
        className="
          bg-white/97 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-blue-400
          pointer-events-auto w-full mx-auto flex flex-col
          max-w-3xl
          max-h-[88dvh] sm:max-h-[82dvh]
          overflow-hidden
        "
      >
        {/* ── Enunciado ── */}
        <div
          className={`
            px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 border-b-2 border-blue-200
            overflow-y-auto flex-shrink-0
            ${questionSize === 'long' ? 'max-h-[35%]' : questionSize === 'medium' ? 'max-h-[30%]' : ''}
          `}
        >
          <p className={`text-gray-800 leading-relaxed whitespace-pre-wrap ${questionFontClass}`}>
            {baseText}
          </p>
        </div>

        {/* ── Label ── */}
        <div className="px-4 sm:px-6 py-1.5 bg-gray-100 border-b border-gray-200 flex-shrink-0">
          <p className="text-gray-500 text-xs font-medium tracking-wide uppercase">
            Selecione a alternativa correta
          </p>
        </div>

        {/* ── Alternativas — scroll quando necessário ── */}
        <div className={`px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto flex-1 ${altGridClass}`}>
          {alternatives.map((alt, index) => {
            const letter     = String.fromCharCode(65 + index);
            const isSelected = displaySelectedId === alt.id;

            let bgClass = 'bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-300';
            if (reviewMode) {
              if (alt.isCorrect)                  bgClass = 'bg-green-100 border-2 border-green-400';
              else if (isSelected && !alt.isCorrect) bgClass = 'bg-red-100 border-2 border-red-400';
              else                                bgClass = 'bg-gray-50 border border-gray-200 opacity-50';
            } else if (isSelected) {
              bgClass = 'bg-blue-100 border-2 border-blue-500 shadow-md';
            }

            return (
              <button
                key={alt.id}
                type="button"
                onClick={() => !disabled && !reviewMode && setSelectedId(alt.id)}
                disabled={disabled || reviewMode}
                className={`
                  flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl text-left
                  transition-all duration-150
                  ${bgClass}
                  ${disabled || reviewMode ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}
                `}
              >
                {/* Letra */}
                <span className={`
                  flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
                  font-bold text-xs sm:text-sm transition-all
                  ${reviewMode && alt.isCorrect                  ? 'bg-green-500 text-white'
                  : reviewMode && isSelected && !alt.isCorrect  ? 'bg-red-500 text-white'
                  : isSelected                                   ? 'bg-blue-500 text-white'
                  :                                               'bg-gray-200 text-gray-700'}
                `}>
                  {letter}
                </span>

                {/* Texto */}
                <span className={`flex-1 text-gray-800 leading-snug ${altFontClass}`}>
                  {alt.text}
                </span>

                {/* Ícones review */}
                {reviewMode && alt.isCorrect && (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
                {reviewMode && isSelected && !alt.isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Botão ── */}
        <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          {reviewMode ? (
            <button
              onClick={onContinue}
              className="w-full py-2.5 sm:py-3 rounded-xl text-base sm:text-lg font-bold
                         transition-all duration-200 bg-blue-500 hover:bg-blue-600
                         text-white active:scale-[0.98] shadow-lg"
            >
              Continuar ➜
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!selectedId || disabled}
              className={`
                w-full py-2.5 sm:py-3 rounded-xl text-base sm:text-lg font-bold
                transition-all duration-200 shadow-lg
                ${selectedId && !disabled
                  ? 'bg-green-500 hover:bg-green-600 text-white active:scale-[0.98]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
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
