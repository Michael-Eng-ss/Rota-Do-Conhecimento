import { useState, useEffect } from 'react';
import { Check, X, CheckCircle, XCircle } from 'lucide-react';

interface Statement {
  id: string;
  text: string;
  isTrue: boolean;
}

interface StatementResult {
  statementId: string;
  userAnswer: boolean;
  correctAnswer: boolean;
  isCorrect: boolean;
}

interface TrueFalseCardProps {
  questionNumber: number;
  totalQuestions: number;
  baseText: string;
  statements: Statement[];
  onConfirm: (answers: Record<string, boolean>) => void;
  disabled?: boolean;
  reviewMode?: boolean;
  reviewResults?: StatementResult[];
  onContinue?: () => void;
}

function getTextSize(text: string): 'short' | 'medium' | 'long' {
  if (text.length <= 80)  return 'short';
  if (text.length <= 220) return 'medium';
  return 'long';
}

const TrueFalseCard = ({
  questionNumber,
  totalQuestions,
  baseText,
  statements,
  onConfirm,
  disabled = false,
  reviewMode = false,
  reviewResults = [],
  onContinue,
}: TrueFalseCardProps) => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setAnswers({});
  }, [questionNumber]);

  const handleAnswerChange = (statementId: string, value: boolean) => {
    if (disabled) return;
    setAnswers(prev => ({ ...prev, [statementId]: value }));
  };

  const allAnswered = statements.every(s => answers[s.id] !== undefined);
  const answeredCount = statements.filter(s => answers[s.id] !== undefined).length;

  const handleConfirm = () => {
    if (allAnswered && !disabled) onConfirm(answers);
  };

  const questionSize = getTextSize(baseText);
  const hasLongStatements = statements.some(s => s.text.length > 100);

  const questionFontClass =
    questionSize === 'short'  ? 'text-base md:text-lg lg:text-xl' :
    questionSize === 'medium' ? 'text-sm  md:text-base'           :
                                'text-xs  md:text-sm';

  const statementFontClass = hasLongStatements
    ? 'text-xs md:text-sm'
    : 'text-sm md:text-base';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-2 sm:px-4 py-2 sm:py-4">

      {/* Contador flutuante */}
      <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full mb-2 shadow-lg pointer-events-auto flex-shrink-0 text-sm font-bold">
        Questão {questionNumber} de {totalQuestions}
      </div>

      {/* Card principal */}
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
            ${questionSize === 'long' ? 'max-h-[32%]' : questionSize === 'medium' ? 'max-h-[28%]' : ''}
          `}
        >
          <p className={`text-gray-800 leading-relaxed whitespace-pre-wrap ${questionFontClass}`}>
            {baseText}
          </p>
        </div>

        {/* ── Label + progresso de respostas ── */}
        <div className="px-4 sm:px-6 py-1.5 bg-gray-100 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
          <p className="text-gray-500 text-xs font-medium tracking-wide uppercase">
            Verdadeiro ou Falso
          </p>
          {!reviewMode && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              allAnswered ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
            }`}>
              {answeredCount}/{statements.length}
            </span>
          )}
        </div>

        {/* ── Afirmações — scroll quando necessário ── */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto flex-1 flex flex-col gap-2 sm:gap-3">
          {statements.map((statement, index) => {
            const letter        = String.fromCharCode(65 + index);
            const currentAnswer = answers[statement.id];
            const reviewResult  = reviewMode
              ? reviewResults.find(r => r.statementId === statement.id)
              : null;

            let bgClass = 'bg-gray-50 border border-gray-200';
            if (reviewMode && reviewResult) {
              bgClass = reviewResult.isCorrect
                ? 'bg-green-100 border-2 border-green-400'
                : 'bg-red-100 border-2 border-red-400';
            } else if (currentAnswer !== undefined) {
              bgClass = currentAnswer
                ? 'bg-green-50 border border-green-300'
                : 'bg-red-50 border border-red-300';
            }

            return (
              <div
                key={statement.id}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all ${bgClass}`}
              >
                {/* Letra */}
                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full text-xs sm:text-sm">
                  {letter}
                </span>

                {/* Texto da afirmação */}
                <p className={`flex-1 text-gray-800 leading-snug ${statementFontClass}`}>
                  {statement.text}
                </p>

                {/* Modo review: ícone de resultado */}
                {reviewMode && reviewResult ? (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      reviewResult.userAnswer ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {reviewResult.userAnswer ? 'V' : 'F'}
                    </span>
                    {reviewResult.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          statement.isTrue ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {statement.isTrue ? 'V' : 'F'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Modo normal: botões V / F */
                  <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAnswerChange(statement.id, true)}
                      disabled={disabled}
                      className={`
                        w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center
                        font-bold text-sm sm:text-base transition-all
                        ${currentAnswer === true
                          ? 'bg-green-500 text-white shadow-md scale-110 ring-2 ring-green-300'
                          : 'bg-gray-200 text-gray-600 hover:bg-green-100 hover:text-green-700'}
                        ${disabled ? 'cursor-not-allowed opacity-50' : 'active:scale-95'}
                      `}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerChange(statement.id, false)}
                      disabled={disabled}
                      className={`
                        w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center
                        font-bold text-sm sm:text-base transition-all
                        ${currentAnswer === false
                          ? 'bg-red-500 text-white shadow-md scale-110 ring-2 ring-red-300'
                          : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-700'}
                        ${disabled ? 'cursor-not-allowed opacity-50' : 'active:scale-95'}
                      `}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
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
              disabled={!allAnswered || disabled}
              className={`
                w-full py-2.5 sm:py-3 rounded-xl text-base sm:text-lg font-bold
                transition-all duration-200 shadow-lg
                ${allAnswered && !disabled
                  ? 'bg-green-500 hover:bg-green-600 text-white active:scale-[0.98]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              {allAnswered
                ? 'Confirmar Respostas'
                : `Responda todas (${answeredCount}/${statements.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrueFalseCard;
