import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface QuestionOption {
  letter: string;
  text: string;
}

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  options: QuestionOption[];
  onConfirm: (selectedIndex: number) => void;
}

function getTextSize(text: string): 'short' | 'medium' | 'long' {
  if (text.length <= 80)  return 'short';
  if (text.length <= 220) return 'medium';
  return 'long';
}

const QuestionCard = ({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  onConfirm,
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedOption !== null) {
      onConfirm(selectedOption);
      setSelectedOption(null);
    }
  };

  const textSize    = getTextSize(questionText);
  const hasLongOpts = options.some(o => o.text.length > 80);
  const hasShortOpts = options.every(o => o.text.length <= 40);

  const questionFontClass =
    textSize === 'short'  ? 'text-base md:text-lg lg:text-xl' :
    textSize === 'medium' ? 'text-sm  md:text-base'           :
                            'text-xs  md:text-sm';

  const optFontClass = hasLongOpts
    ? 'text-xs md:text-sm'
    : hasShortOpts
    ? 'text-sm md:text-base lg:text-lg'
    : 'text-sm md:text-base';

  const optGridClass = hasShortOpts && options.length <= 4
    ? 'grid grid-cols-2 gap-2'
    : 'flex flex-col gap-2';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-2 sm:px-4 py-2 sm:py-4">

      {/* Contador */}
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
            px-4 sm:px-6 py-3 sm:py-5 bg-blue-50 border-b-2 border-blue-200
            overflow-y-auto flex-shrink-0 text-center
            ${textSize === 'long' ? 'max-h-[35%]' : textSize === 'medium' ? 'max-h-[30%]' : ''}
          `}
        >
          <p className={`text-gray-800 leading-relaxed font-medium whitespace-pre-wrap ${questionFontClass}`}>
            {questionText}
          </p>
        </div>

        {/* ── Opções ── */}
        <div className={`px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto flex-1 ${optGridClass}`}>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`
                flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl text-left
                transition-all duration-150 active:scale-[0.98]
                ${selectedOption === index
                  ? 'bg-blue-500 text-white shadow-lg scale-[1.01]'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
              `}
            >
              <span className={`font-bold shrink-0 ${
                selectedOption === index ? 'text-blue-100' : 'text-gray-400'
              } text-sm sm:text-base`}>
                {option.letter})
              </span>
              <span className={`flex-1 leading-snug ${optFontClass}`}>
                {option.text}
              </span>
            </button>
          ))}
        </div>

        {/* ── Botão Confirmar ── */}
        <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className={`
              w-full py-2.5 sm:py-3 rounded-xl font-bold text-base sm:text-lg
              flex items-center justify-center gap-2
              transition-all duration-200 shadow-lg
              ${selectedOption !== null
                ? 'bg-green-500 hover:bg-green-600 text-white active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            <CheckCircle className="w-5 h-5" />
            {selectedOption !== null ? 'Confirmar Resposta' : 'Selecione uma opção'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
