import { useState, useEffect } from 'react';
import GameBackground from '@/components/Game/GameBackground';
import GameButton from '@/components/Game/GameButton';
import QuestionForm from '@/components/Admin/QuestionForm';
import QuestionList from '@/components/Admin/QuestionList';
import { Question, getEnvironmentName } from '@/types/questions';
import { useQuestions, DbQuestion } from '@/hooks/useQuestions';
import { Plus, LogOut, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuestionAdminScreenProps {
  onBack: () => void;
}

// Convert DB question to the Question type used by the form/list
const dbToQuestion = (q: DbQuestion): Question => ({
  id: q.id,
  environmentId: q.environment_id as 1 | 2 | 3,
  subject: q.subject,
  baseText: q.base_text,
  alternatives: q.alternatives.map((a, i) => ({
    id: a.id || `a_${i}`,
    text: a.text,
    isCorrect: a.isCorrect,
  })),
  createdAt: new Date(q.created_at),
  updatedAt: new Date(q.updated_at),
});

const QuestionAdminScreen = ({ onBack }: QuestionAdminScreenProps) => {
  const { questions: dbQuestions, loading, fetchQuestions, saveQuestion, updateQuestion, deleteQuestion } = useQuestions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [filterEnvironment, setFilterEnvironment] = useState<1 | 2 | 3 | 'all'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const questions: Question[] = dbQuestions.map(dbToQuestion);

  const handleSaveQuestion = async (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, {
          environment_id: questionData.environmentId,
          subject: questionData.subject,
          base_text: questionData.baseText,
          alternatives: questionData.alternatives.map(a => ({
            id: a.id,
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        });
        toast({ title: 'Questão atualizada!' });
      } else {
        await saveQuestion({
          environment_id: questionData.environmentId,
          subject: questionData.subject,
          base_text: questionData.baseText,
          alternatives: questionData.alternatives.map(a => ({
            id: a.id,
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        });
        toast({ title: 'Questão criada!' });
      }
      setIsFormOpen(false);
      setEditingQuestion(null);
      fetchQuestions();
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsFormOpen(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta questão?')) {
      try {
        await deleteQuestion(id);
        toast({ title: 'Questão excluída!' });
        fetchQuestions();
      } catch (err: any) {
        toast({ title: 'Erro ao excluir', description: err.message, variant: 'destructive' });
      }
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
              {loading ? 'Carregando...' : `${questions.length} questões cadastradas`}
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
              onChange={(e) => setFilterEnvironment(e.target.value === 'all' ? 'all' : Number(e.target.value) as 1 | 2 | 3)}
              className="bg-transparent text-white border-none outline-none"
            >
              <option value="all" className="text-gray-800">Todos os Ambientes</option>
              {([1, 2, 3] as const).map(id => (
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
