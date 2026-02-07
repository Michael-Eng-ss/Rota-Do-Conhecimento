import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { Question, Statement, subjectsByEnvironment, getEnvironmentName } from '@/types/questions';
import GameButton from '@/components/Game/GameButton';

interface QuestionFormProps {
  initialData?: Question | null;
  onSave: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const emptyStatement = (): Omit<Statement, 'id'> => ({
  text: '',
  isTrue: true,
});

const QuestionForm = ({ initialData, onSave, onCancel }: QuestionFormProps) => {
  const [environmentId, setEnvironmentId] = useState<1 | 2 | 3 | 4>(initialData?.environmentId || 1);
  const [subject, setSubject] = useState(initialData?.subject || subjectsByEnvironment[1][0]);
  const [baseText, setBaseText] = useState(initialData?.baseText || '');
  const [statements, setStatements] = useState<Omit<Statement, 'id'>[]>(
    initialData?.statements.map(s => ({ text: s.text, isTrue: s.isTrue })) || 
    [emptyStatement(), emptyStatement(), emptyStatement(), emptyStatement()]
  );

  // Atualizar matéria quando ambiente muda
  useEffect(() => {
    const availableSubjects = subjectsByEnvironment[environmentId];
    if (!availableSubjects.includes(subject)) {
      setSubject(availableSubjects[0]);
    }
  }, [environmentId, subject]);

  const handleStatementChange = (index: number, field: 'text' | 'isTrue', value: string | boolean) => {
    setStatements(prev => prev.map((s, i) => 
      i === index ? { ...s, [field]: value } : s
    ));
  };

  const handleSubmit = () => {
    // Validar
    if (!baseText.trim()) {
      alert('Digite o texto base/enunciado da questão');
      return;
    }

    const validStatements = statements.filter(s => s.text.trim());
    if (validStatements.length < 4) {
      alert('Preencha todas as 4 afirmações');
      return;
    }

    onSave({
      environmentId,
      subject,
      baseText: baseText.trim(),
      statements: statements.map((s, i) => ({
        id: initialData?.statements[i]?.id || `stmt_${Date.now()}_${i}`,
        text: s.text.trim(),
        isTrue: s.isTrue,
      })),
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border-2 border-blue-400">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Questão' : 'Nova Questão'}
      </h3>
      
      {/* Ambiente e Matéria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ambiente *
          </label>
          <select
            value={environmentId}
            onChange={(e) => setEnvironmentId(Number(e.target.value) as 1 | 2 | 3 | 4)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 bg-white"
          >
            {([1, 2, 3, 4] as const).map(id => (
              <option key={id} value={id}>
                {id} - {getEnvironmentName(id)}
              </option>
            ))}
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

      {/* Texto Base/Enunciado */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Texto Base/Enunciado da Questão *
        </label>
        <textarea
          value={baseText}
          onChange={(e) => setBaseText(e.target.value)}
          placeholder="Cole aqui o texto base da questão (notícia, contexto, situação-problema...)&#10;&#10;Ex: O presidente Luiz Inácio Lula da Silva assina nesta sexta-feira contratos de financiamento do BNDES..."
          className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-800 min-h-[150px]"
        />
      </div>

      {/* 4 Afirmações (A, B, C, D) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assinale V (verdadeiro) ou F (falso) para as alternativas de acordo com o texto: *
        </label>
        
        <div className="space-y-3">
          {statements.map((statement, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            return (
            <div key={index} className="flex gap-2 items-start">
              <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-blue-100 text-blue-800 font-bold rounded">
                {letter}
              </span>
              
              <textarea
                value={statement.text}
                onChange={(e) => handleStatementChange(index, 'text', e.target.value)}
                placeholder={`Afirmação ${letter}...`}
                className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-gray-800 min-h-[60px]"
              />
              
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleStatementChange(index, 'isTrue', true)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                    statement.isTrue 
                      ? 'bg-green-500 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                  }`}
                >
                  V
                </button>
                <button
                  type="button"
                  onClick={() => handleStatementChange(index, 'isTrue', false)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                    !statement.isTrue 
                      ? 'bg-red-500 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                  }`}
                >
                  F
                </button>
              </div>
            </div>
            );
          })}
        </div>
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
