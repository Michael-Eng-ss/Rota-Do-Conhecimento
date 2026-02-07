import { useState } from 'react';
import GameBackground from '@/components/Game/GameBackground';
import GameButton from '@/components/Game/GameButton';
import QuestionForm from '@/components/Admin/QuestionForm';
import QuestionList from '@/components/Admin/QuestionList';
import { Question, getEnvironmentName, subjectsByEnvironment } from '@/types/questions';
import { Plus, LogOut, Filter } from 'lucide-react';

// Dados fictícios para demonstração
const mockQuestions: Question[] = [
  {
    id: '1',
    environmentId: 1,
    subject: 'Biologia',
    baseText: 'Sobre a célula e suas organelas, analise as afirmações abaixo de acordo com seus conhecimentos sobre biologia celular:',
    statements: [
      { id: 's1', text: 'A mitocôndria é responsável pela produção de energia (ATP) nas células.', isTrue: true },
      { id: 's2', text: 'O núcleo contém o material genético da célula.', isTrue: true },
      { id: 's3', text: 'O ribossomo é responsável pela fotossíntese.', isTrue: false },
      { id: 's4', text: 'A membrana plasmática é impermeável a todas as substâncias.', isTrue: false },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    environmentId: 3,
    subject: 'Matemática',
    baseText: 'Sobre geometria plana, analise as afirmações abaixo considerando as propriedades das figuras geométricas:',
    statements: [
      { id: 's5', text: 'A soma dos ângulos internos de um triângulo é 180 graus.', isTrue: true },
      { id: 's6', text: 'Um quadrado tem todos os lados iguais e ângulos retos.', isTrue: true },
      { id: 's7', text: 'O perímetro de um círculo é calculado por πr².', isTrue: false },
      { id: 's8', text: 'A diagonal de um quadrado divide-o em dois triângulos retângulos.', isTrue: true },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface QuestionAdminScreenProps {
  onBack: () => void;
}

const QuestionAdminScreen = ({ onBack }: QuestionAdminScreenProps) => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [filterEnvironment, setFilterEnvironment] = useState<1 | 2 | 3 | 4 | 'all'>('all');

  const handleSaveQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingQuestion) {
      // Editar existente
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...questionData, updatedAt: new Date() } 
          : q
      ));
    } else {
      // Criar nova
      const newQuestion: Question = {
        id: `q_${Date.now()}`,
        ...questionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setQuestions(prev => [...prev, newQuestion]);
    }
    setIsFormOpen(false);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsFormOpen(true);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta questão?')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const filteredQuestions = filterEnvironment === 'all' 
    ? questions 
    : questions.filter(q => q.environmentId === filterEnvironment);

  return (
    <GameBackground>
      <div className="flex flex-col min-h-screen px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              Gerenciamento de Questões
            </h1>
            <p className="text-white/70 mt-1">
              {questions.length} questões cadastradas
            </p>
          </div>
          <GameButton onClick={onBack} variant="primary" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sair do Admin
          </GameButton>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <GameButton 
            onClick={() => {
              setEditingQuestion(null);
              setIsFormOpen(true);
            }} 
            variant="secondary" 
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Questão
          </GameButton>

          {/* Filtro por ambiente */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <Filter className="w-4 h-4 text-white" />
            <select
              value={filterEnvironment}
              onChange={(e) => setFilterEnvironment(e.target.value === 'all' ? 'all' : Number(e.target.value) as 1 | 2 | 3 | 4)}
              className="bg-transparent text-white border-none outline-none"
            >
              <option value="all" className="text-gray-800">Todos os Ambientes</option>
              {([1, 2, 3, 4] as const).map(id => (
                <option key={id} value={id} className="text-gray-800">
                  {id} - {getEnvironmentName(id)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form ou Lista */}
        <div className="flex-1 overflow-auto">
          {isFormOpen ? (
            <QuestionForm
              initialData={editingQuestion}
              onSave={handleSaveQuestion}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingQuestion(null);
              }}
            />
          ) : (
            <QuestionList
              questions={filteredQuestions}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
            />
          )}
        </div>
      </div>
    </GameBackground>
  );
};

export default QuestionAdminScreen;
