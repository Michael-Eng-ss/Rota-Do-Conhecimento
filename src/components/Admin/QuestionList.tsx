import { Edit, Trash2, Check, X } from 'lucide-react';
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

          {/* Título */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-gray-800 font-medium">{question.title}</h3>
          </div>

          {/* Afirmações */}
          <div className="p-4 space-y-2">
            {question.statements.map((statement, index) => (
              <div key={statement.id} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 font-bold rounded text-sm">
                  {index + 1}
                </span>
                <p className="flex-1 text-gray-700 text-sm">{statement.text}</p>
                <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded font-bold text-sm ${
                  statement.isTrue 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {statement.isTrue ? 'V' : 'F'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
