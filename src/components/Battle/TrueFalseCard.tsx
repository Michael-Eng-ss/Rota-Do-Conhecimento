import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface TrueFalseCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  onConfirm: (answer: boolean) => void;
}

const TrueFalseCard = ({
  questionNumber,
  totalQuestions,
  questionText,
  onConfirm,
}: TrueFalseCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const handleConfirm = () => {
    if (selectedAnswer !== null) {
      onConfirm(selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4">
      {/* Question Counter */}
      <div className="bg-blue-600 text-white px-4 py-2 rounded-full mb-4 shadow-lg pointer-events-auto">
        <span className="font-bold">Pergunta {questionNumber} de {totalQuestions}</span>
      </div>

      {/* Question Text Box */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-3xl w-full mx-auto mb-6 shadow-2xl border-4 border-blue-400 pointer-events-auto">
        <div className="text-center text-gray-800 text-lg md:text-xl leading-relaxed font-medium">
          {questionText}
        </div>
      </div>

      {/* True/False Buttons */}
      <div className="flex gap-6 pointer-events-auto mb-4">
        <button
          onClick={() => setSelectedAnswer(true)}
          className={`flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 transition-all duration-300 shadow-xl ${
            selectedAnswer === true
              ? 'bg-green-500 border-green-300 scale-110 text-white'
              : 'bg-green-600 border-green-400 hover:bg-green-500 hover:scale-105 text-white'
          }`}
        >
          <Check className="w-12 h-12 md:w-16 md:h-16 mb-2" />
          <span className="text-xl md:text-2xl font-bold">Verdadeiro</span>
        </button>

        <button
          onClick={() => setSelectedAnswer(false)}
          className={`flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 transition-all duration-300 shadow-xl ${
            selectedAnswer === false
              ? 'bg-red-500 border-red-300 scale-110 text-white'
              : 'bg-red-600 border-red-400 hover:bg-red-500 hover:scale-105 text-white'
          }`}
        >
          <X className="w-12 h-12 md:w-16 md:h-16 mb-2" />
          <span className="text-xl md:text-2xl font-bold">Falso</span>
        </button>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={selectedAnswer === null}
        className={`px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 shadow-xl pointer-events-auto ${
          selectedAnswer !== null
            ? 'bg-blue-500 hover:bg-blue-600 text-white scale-100 hover:scale-105'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed scale-90'
        }`}
      >
        Confirmar
      </button>
    </div>
  );
};

export default TrueFalseCard;
