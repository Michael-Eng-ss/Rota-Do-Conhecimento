import { Edit, Trash2, CheckCircle } from 'lucide-react';
import { Question, getEnvironmentName } from '@/types/questions';

interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

const QuestionList = ({ questions, onEdit, onDelete }: QuestionListProps) => {
  if (questions.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl border-2 border-blue-400 text-center">
        <p className="text-gray-500 text-lg">Nenhuma questão cadastrada ainda.</p>
        <p className="text-gray-400 mt-2">Clique em "Nova Questão" para começar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div
          key={question.id}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border-2 border-blue-400 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="bg-blue-700 px-2 py-1 rounded text-sm font-bold">
                Amb. {question.environmentId}
              </span>
              <span className="bg-blue-600 px-2 py-1 rounded text-sm">
                {question.subject}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(question)}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(question.id)}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Enunciado */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-gray-800 text-sm whitespace-pre-wrap line-clamp-3">{question.baseText}</p>
          </div>

          {/* Alternativas */}
          <div className="p-4 space-y-2">
            {question.alternatives.map((alt, index) => {
              const letter = String.fromCharCode(65 + index);
              return (
                <div key={alt.id} className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm ${
                    alt.isCorrect 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {letter}
                  </span>
                  <p className="flex-1 text-gray-700 text-sm">{alt.text}</p>
                  {alt.isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
