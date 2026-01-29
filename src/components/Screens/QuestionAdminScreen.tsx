import { useState } from 'react';
import GameBackground from '@/components/Game/GameBackground';
import GameButton from '@/components/Game/GameButton';
import { Plus, Trash2, Edit, Check, X } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  isTrue: boolean;
  subject: string;
  environment: number;
}

// Dados fictícios para demonstração
const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'A mitocôndria é responsável pela produção de energia (ATP) nas células.',
    isTrue: true,
    subject: 'Ciências',
    environment: 3,
  },
  {
    id: '2',
    text: 'O Sol gira em torno da Terra.',
    isTrue: false,
    subject: 'Ciências',
    environment: 3,
  },
  {
    id: '3',
    text: 'O Brasil foi descoberto em 1500 por Pedro Álvares Cabral.',
    isTrue: true,
    subject: 'História',
    environment: 2,
  },
  {
    id: '4',
    text: 'A soma dos ângulos internos de um triângulo é 180 graus.',
    isTrue: true,
    subject: 'Matemática',
    environment: 4,
  },
  {
    id: '5',
    text: 'Verbos são palavras que indicam ações, estados ou fenômenos.',
    isTrue: true,
    subject: 'Português',
    environment: 1,
  },
];

const subjects = ['Português', 'História', 'Ciências', 'Matemática'];
const environments = [1, 2, 3, 4];

interface QuestionAdminScreenProps {
  onBack: () => void;
}

const QuestionAdminScreen = ({ onBack }: QuestionAdminScreenProps) => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    isTrue: true,
    subject: 'Ciências',
    environment: 3,
  });

  const handleAddQuestion = () => {
    if (!newQuestion.text.trim()) return;
    
    const question: Question = {
      id: Date.now().toString(),
      ...newQuestion,
    };
    
    setQuestions(prev => [...prev, question]);
    setNewQuestion({ text: '', isTrue: true, subject: 'Ciências', environment: 3 });
    setIsAdding(false);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
    setEditingId(null);
  };

  return (
    <GameBackground>
      <div className="flex flex-col min-h-screen px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            Cadastro de Perguntas
          </h1>
          <GameButton onClick={onBack} variant="primary" className="w-32">
            Voltar
          </GameButton>
        </div>

        {/* Add Button */}
        <div className="mb-4">
          <GameButton 
            onClick={() => setIsAdding(true)} 
            variant="secondary" 
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Pergunta
          </GameButton>
        </div>

        {/* Add Form */}
        {isAdding && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-xl border-2 border-blue-400">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Nova Pergunta (Verdadeiro ou Falso)</h3>
            
            <textarea
              value={newQuestion.text}
              onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Digite a afirmação..."
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 text-gray-800 min-h-[100px]"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resposta:</label>
                <select
                  value={newQuestion.isTrue ? 'true' : 'false'}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, isTrue: e.target.value === 'true' }))}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg text-gray-800"
                >
                  <option value="true">Verdadeiro</option>
                  <option value="false">Falso</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matéria:</label>
                <select
                  value={newQuestion.subject}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg text-gray-800"
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ambiente:</label>
                <select
                  value={newQuestion.environment}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, environment: Number(e.target.value) }))}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg text-gray-800"
                >
                  {environments.map(e => (
                    <option key={e} value={e}>Ambiente {e}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                Salvar
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border-2 border-blue-400 overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3 text-left">Pergunta</th>
                  <th className="p-3 text-center w-28">Resposta</th>
                  <th className="p-3 text-center w-28">Matéria</th>
                  <th className="p-3 text-center w-24">Ambiente</th>
                  <th className="p-3 text-center w-24">Ações</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => (
                  <tr key={q.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 text-gray-800">
                      {editingId === q.id ? (
                        <textarea
                          defaultValue={q.text}
                          onBlur={(e) => handleUpdateQuestion(q.id, { text: e.target.value })}
                          className="w-full p-2 border rounded text-gray-800"
                        />
                      ) : (
                        q.text
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm font-bold ${
                        q.isTrue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {q.isTrue ? 'V' : 'F'}
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-700">{q.subject}</td>
                    <td className="p-3 text-center text-gray-700">{q.environment}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setEditingId(q.id)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default QuestionAdminScreen;
