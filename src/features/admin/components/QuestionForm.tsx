import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { Question, Alternative, subjectsByEnvironment, getEnvironmentName } from '@/features/game/types/questions';
import GameButton from '@/shared/components/GameButton';

interface QuestionFormProps {
  initialData?: Question | null;
  onSave: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const emptyAlternative = (): Omit<Alternative, 'id'> => ({
  text: '',
  isCorrect: false,
});

const QuestionForm = ({ initialData, onSave, onCancel }: QuestionFormProps) => {
  const [environmentId, setEnvironmentId] = useState<1 | 2 | 3>(initialData?.environmentId || 1);
  const [subject, setSubject] = useState(initialData?.subject || subjectsByEnvironment[1][0]);
  const [baseText, setBaseText] = useState(initialData?.baseText || '');
  const [alternatives, setAlternatives] = useState<Omit<Alternative, 'id'>[]>(
    initialData?.alternatives.map(a => ({ text: a.text, isCorrect: a.isCorrect })) || 
    [emptyAlternative(), emptyAlternative(), emptyAlternative(), emptyAlternative()]
  );

  // Atualizar matéria quando ambiente muda
  useEffect(() => {
    const availableSubjects = subjectsByEnvironment[environmentId];
    if (!availableSubjects.includes(subject)) {
      setSubject(availableSubjects[0]);
    }
  }, [environmentId, subject]);

  const handleAlternativeTextChange = (index: number, value: string) => {
    setAlternatives(prev => prev.map((a, i) => 
      i === index ? { ...a, text: value } : a
    ));
  };

  const handleCorrectChange = (index: number) => {
    // Apenas 1 correta: desmarcar todas e marcar a selecionada
    setAlternatives(prev => prev.map((a, i) => ({
      ...a,
      isCorrect: i === index,
    })));
  };

  const addAlternative = () => {
    if (alternatives.length < 5) {
      setAlternatives(prev => [...prev, emptyAlternative()]);
    }
  };

  const removeAlternative = (index: number) => {
    if (alternatives.length > 2) {
      setAlternatives(prev => {
        const updated = prev.filter((_, i) => i !== index);
        // Se removeu a correta, não selecionar nenhuma
        return updated;
      });
    }
  };

  const handleSubmit = () => {
    if (!baseText.trim()) {
      alert('Digite o enunciado da questão');
      return;
    }

    const validAlternatives = alternatives.filter(a => a.text.trim());
    if (validAlternatives.length < 2) {
      alert('Preencha pelo menos 2 alternativas');
      return;
    }

    const hasCorrect = alternatives.some(a => a.isCorrect && a.text.trim());
    if (!hasCorrect) {
      alert('Selecione a alternativa correta');
      return;
    }

    // Filtrar apenas alternativas preenchidas
    const finalAlternatives = alternatives
      .filter(a => a.text.trim())
      .map((a, i) => ({
        id: initialData?.alternatives[i]?.id || `alt_${Date.now()}_${i}`,
        text: a.text.trim(),
        isCorrect: a.isCorrect,
      }));

    onSave({
      environmentId,
      subject,
      baseText: baseText.trim(),
      alternatives: finalAlternatives,
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border-2 border-blue-400">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Questão' : 'Nova Questão'}
      </h3>
      
      {/* Grupo e Matéria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grupo *
          </label>
          <select
            value={environmentId}
            onChange={(e) => setEnvironmentId(Number(e.target.value) as 1 | 2 | 3)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 bg-white"
          >
            <option value={1}>Grupo 1 - Auditório (Literatura, Matemática, L. Inglesa, Geografia, História)</option>
            <option value={2}>Grupo 2 - Biblioteca (Biologia, Química, Física, L. Portuguesa)</option>
            <option value={3}>Boss Final - Todas as Matérias</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matéria *
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 bg-white"
          >
            {subjectsByEnvironment[environmentId].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Enunciado */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enunciado da Questão *
        </label>
        <textarea
          value={baseText}
          onChange={(e) => setBaseText(e.target.value)}
          placeholder="Digite o enunciado da questão..."
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 min-h-[120px]"
        />
      </div>

      {/* Alternativas */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alternativas (selecione a correta) *
        </label>
        
        <div className="space-y-3">
          {alternatives.map((alt, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D, E
            return (
              <div key={index} className="flex gap-2 items-start">
                {/* Radio para selecionar correta */}
                <button
                  type="button"
                  onClick={() => handleCorrectChange(index)}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-2 ${
                    alt.isCorrect 
                      ? 'bg-green-500 text-white border-green-600 shadow-lg scale-110' 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                  title={alt.isCorrect ? 'Alternativa correta' : 'Marcar como correta'}
                >
                  {letter}
                </button>
                
                <textarea
                  value={alt.text}
                  onChange={(e) => handleAlternativeTextChange(index, e.target.value)}
                  placeholder={`Alternativa ${letter}...`}
                  className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-gray-800 min-h-[50px]"
                />
                
                {alternatives.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeAlternative(index)}
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Remover alternativa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {alternatives.length < 5 && (
          <button
            type="button"
            onClick={addAlternative}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Alternativa
          </button>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <Check className="w-4 h-4" />
          Salvar
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;
