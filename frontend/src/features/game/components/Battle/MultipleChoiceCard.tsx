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

/** Classifica o texto para adaptar tamanho de fonte */
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
  const questionSize  = getTextSize(baseText);
  const hasLongAlts   = alternatives.some(a => a.text.length > 120);
  const hasShortAlts  = alternatives.every(a => a.text.length <= 50);
  const progress      = Math.round((questionNumber / totalQuestions) * 100);

  const questionFontClass =
    questionSize === 'short'  ? 'text-base md:text-lg' :
    questionSize === 'medium' ? 'text-sm  md:text-base' :
                                'text-xs  md:text-sm';

  const altFontClass = hasLongAlts
    ? 'text-xs md:text-sm'
    : hasShortAlts
    ? 'text-sm md:text-base'
    : 'text-sm md:text-base';

  const altGridClass = hasShortAlts && alternatives.length <= 4
    ? 'grid grid-cols-2 gap-2'
    : 'flex flex-col gap-2';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-2 sm:px-4 py-2 sm:py-4">

      {/* Card principal */}
      <div
        className="
          bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl
          border border-slate-600/60
          pointer-events-auto w-full mx-auto flex flex-col
          max-w-2xl
          max-h-[90dvh] sm:max-h-[85dvh]
          overflow-hidden
        "
        style={{ boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.2)' }}
      >
        {/* ── Barra de progresso ── */}
        <div className="h-1.5 bg-slate-700 flex-shrink-0">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-blue-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Header: contador ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/60 flex-shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Questão
          </span>
          <span className="text-sm font-black text-violet-400">
            {questionNumber} / {totalQuestions}
          </span>
        </div>

        {/* ── Enunciado ── */}
        <div
          className={`
            px-5 py-4 border-b border-slate-700/60
            overflow-y-auto flex-shrink-0
            ${questionSize === 'long' ? 'max-h-[32%]' : questionSize === 'medium' ? 'max-h-[28%]' : ''}
          `}
        >
          <p className={`text-slate-100 leading-relaxed whitespace-pre-wrap ${questionFontClass}`}>
            {baseText}
          </p>
        </div>

        {/* ── Label ── */}
        <div className="px-5 py-2 bg-slate-800/60 border-b border-slate-700/40 flex-shrink-0">
          <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
            Selecione a alternativa correta
          </p>
        </div>

        {/* ── Alternativas ── */}
        <div className={`px-5 py-4 overflow-y-auto flex-1 ${altGridClass}`}>
          {alternatives.map((alt, index) => {
            const letter     = String.fromCharCode(65 + index);
            const isSelected = displaySelectedId === alt.id;

            // Cores por estado
            let btnClass = 'bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-violet-500/60';
            let letterClass = 'bg-slate-700 text-slate-300';
            let textClass = 'text-slate-200';

            if (reviewMode) {
              if (alt.isCorrect) {
                btnClass   = 'bg-green-900/60 border-2 border-green-500/80';
                letterClass = 'bg-green-500 text-white';
                textClass   = 'text-green-200';
              } else if (isSelected && !alt.isCorrect) {
                btnClass   = 'bg-red-900/60 border-2 border-red-500/80';
                letterClass = 'bg-red-500 text-white';
                textClass   = 'text-red-200';
              } else {
                btnClass   = 'bg-slate-800/50 border border-slate-700 opacity-40';
              }
            } else if (isSelected) {
              btnClass   = 'bg-violet-900/60 border-2 border-violet-400 shadow-lg shadow-violet-500/20';
              letterClass = 'bg-violet-500 text-white';
              textClass   = 'text-violet-100';
            }

            return (
              <button
                key={alt.id}
                type="button"
                onClick={() => !disabled && !reviewMode && setSelectedId(alt.id)}
                disabled={disabled || reviewMode}
                className={`
                  flex items-center gap-3 p-3 rounded-xl text-left
                  transition-all duration-150
                  ${btnClass}
                  ${disabled || reviewMode ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}
                `}
              >
                {/* Letra */}
                <span className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  font-bold text-sm transition-all
                  ${letterClass}
                `}>
                  {letter}
                </span>

                {/* Texto */}
                <span className={`flex-1 leading-snug ${altFontClass} ${textClass}`}>
                  {alt.text}
                </span>

                {/* Ícones review */}
                {reviewMode && alt.isCorrect && (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                )}
                {reviewMode && isSelected && !alt.isCorrect && (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Botão ── */}
        <div className="px-5 py-4 bg-slate-900/80 border-t border-slate-700/60 flex-shrink-0">
          {reviewMode ? (
            <button
              onClick={onContinue}
              className="w-full py-3 rounded-xl text-base font-bold
                         bg-gradient-to-r from-violet-600 to-blue-500
                         hover:from-violet-500 hover:to-blue-400
                         text-white active:scale-[0.98] shadow-lg transition-all duration-200"
            >
              Continuar ➜
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!selectedId || disabled}
              className={`
                w-full py-3 rounded-xl text-base font-bold
                transition-all duration-200 shadow-lg
                ${selectedId && !disabled
                  ? 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-white active:scale-[0.98]'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
              `}
            >
              {selectedId ? 'Confirmar Resposta ✓' : 'Selecione uma alternativa'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceCard;
