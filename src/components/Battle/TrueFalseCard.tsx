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

  // Reset answers when question changes
  useEffect(() => {
    setAnswers({});
  }, [questionNumber]);

  const handleAnswerChange = (statementId: string, value: boolean) => {
    if (disabled) return;
    setAnswers(prev => ({ ...prev, [statementId]: value }));
  };

  const allAnswered = statements.every(s => answers[s.id] !== undefined);

  const handleConfirm = () => {
    if (allAnswered && !disabled) {
      onConfirm(answers);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4 py-8 overflow-auto">
      {/* Question Counter */}
      <div className="bg-blue-600 text-white px-4 py-2 rounded-full mb-4 shadow-lg pointer-events-auto flex-shrink-0">
        <span className="font-bold">Questão {questionNumber} de {totalQuestions}</span>
      </div>

      {/* Question Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-blue-400 pointer-events-auto max-w-4xl w-full mx-auto overflow-hidden flex-shrink-0 max-h-[75vh] overflow-y-auto">
        {/* Base Text - scrollable if too long */}
        <div className="p-4 md:p-6 bg-blue-50 border-b-2 border-blue-200 max-h-[200px] overflow-y-auto">
          <p className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {baseText}
          </p>
        </div>

        {/* Instructions */}
        <div className="px-4 md:px-6 py-2 bg-gray-100 border-b border-gray-200">
          <p className="text-gray-600 text-sm font-medium">
            Assinale V (verdadeiro) ou F (falso) para as alternativas de acordo com o texto:
          </p>
        </div>

        {/* Statements */}
        <div className="p-4 md:p-6 space-y-4">
          {statements.map((statement, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            const currentAnswer = answers[statement.id];
            const reviewResult = reviewMode ? reviewResults.find(r => r.statementId === statement.id) : null;
            
            // Determine background color based on mode
            let bgClass = 'bg-gray-50 border border-gray-200';
            if (reviewMode && reviewResult) {
              bgClass = reviewResult.isCorrect
                ? 'bg-green-100 border-2 border-green-400'
                : 'bg-red-100 border-2 border-red-400';
            } else if (currentAnswer !== undefined) {
              bgClass = currentAnswer
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200';
            }

            return (
              <div 
                key={statement.id} 
                className={`flex gap-3 p-3 rounded-lg transition-all ${bgClass}`}
              >
                {/* Letter */}
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full text-sm">
                  {letter}
                </span>

                {/* Statement Text */}
                <p className="flex-1 text-gray-800 text-sm md:text-base leading-relaxed">
                  {statement.text}
                </p>

                {/* Review Mode: show result icons */}
                {reviewMode && reviewResult ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* What user answered */}
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      reviewResult.userAnswer ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {reviewResult.userAnswer ? 'V' : 'F'}
                    </span>
                    {/* Correct/Wrong icon */}
                    {reviewResult.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <XCircle className="w-6 h-6 text-red-600" />
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          statement.isTrue ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {statement.isTrue ? 'V' : 'F'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Normal Mode: V/F Buttons */
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAnswerChange(statement.id, true)}
                      disabled={disabled}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all ${
                        currentAnswer === true
                          ? 'bg-green-500 text-white shadow-lg scale-110 ring-2 ring-green-300'
                          : 'bg-gray-200 text-gray-600 hover:bg-green-100 hover:text-green-700'
                      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      V
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerChange(statement.id, false)}
                      disabled={disabled}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all ${
                        currentAnswer === false
                          ? 'bg-red-500 text-white shadow-lg scale-110 ring-2 ring-red-300'
                          : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-700'
                      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      F
                    </button>
                  </div>
                )}
              </div>
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
              disabled={!allAnswered || disabled}
              className={`w-full py-4 rounded-xl text-xl font-bold transition-all duration-300 shadow-xl ${
                allAnswered && !disabled
                  ? 'bg-green-500 hover:bg-green-600 text-white scale-100 hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {allAnswered ? 'Confirmar Respostas' : `Responda todas as ${statements.length} afirmações`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrueFalseCard;