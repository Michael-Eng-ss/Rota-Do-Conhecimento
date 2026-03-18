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

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4">
      {/* Question Text Box */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-3xl w-full mx-auto mb-4 shadow-2xl border-4 border-blue-400 pointer-events-auto">
        <div className="text-center text-gray-800 text-base md:text-xl leading-relaxed font-medium">
          {questionText}
        </div>
      </div>

      {/* Options Container */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 max-w-3xl w-full mx-auto shadow-2xl border-4 border-blue-400 pointer-events-auto">
        <div className="flex flex-col gap-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 text-base md:text-lg ${
                selectedOption === index
                  ? 'bg-blue-500 text-white shadow-lg scale-[1.02]'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <span className="font-bold text-lg">{option.letter})</span>
              <span className="flex-1">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={selectedOption === null}
        className={`mt-4 p-4 rounded-full transition-all duration-300 shadow-xl pointer-events-auto ${
          selectedOption !== null
            ? 'bg-green-500 hover:bg-green-600 text-white scale-100 hover:scale-110'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed scale-90'
        }`}
      >
        <CheckCircle className="w-12 h-12" />
      </button>
    </div>
  );
};

export default QuestionCard;
