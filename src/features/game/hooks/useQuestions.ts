import { useState, useCallback } from 'react';
import { callEdge } from '@/lib/api-client';

// Types matching the multiple-choice structure
export interface DbAlternative {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface DbQuestion {
  id: string;
  environment_id: number;
  subject: string;
  base_text: string;
  alternatives: DbAlternative[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Raw types from perguntas-api
interface RawPergunta {
  id: number;
  conteudo: string | null;
  perguntasnivelid: number;
  tempo: number;
  pathimage: string | null;
  status: boolean;
  categoriasid: number;
  quizid: number | null;
  alternativas?: Array<{
    id: number;
    conteudo: string | null;
    imagem: string | null;
    correta: boolean;
    perguntasid: number;
  }>;
}

function callPerguntasApi(path: string, options?: { method?: string; body?: unknown }) {
  return callEdge('perguntas-api', path, options);
}

// Map raw perguntas to DbQuestion format used by the game
function mapPerguntaToDbQuestion(p: RawPergunta): DbQuestion {
  return {
    id: String(p.id),
    environment_id: p.categoriasid,
    subject: '', // perguntas table doesn't have subject field, we can derive or leave empty
    base_text: p.conteudo || '',
    alternatives: (p.alternativas || []).map(a => ({
      id: String(a.id),
      text: a.conteudo || '',
      isCorrect: a.correta,
    })),
    is_active: p.status,
    created_at: '',
    updated_at: '',
  };
}

// Fallback hardcoded questions (multiple choice)
const fallbackQuestions: Record<number, Array<{ baseText: string; subject: string; alternatives: DbAlternative[] }>> = {
  1: [
    {
      baseText: 'Quem escreveu a obra "Dom Casmurro"?',
      subject: 'Literatura',
      alternatives: [
        { id: 'f1_a', text: 'José de Alencar', isCorrect: false },
        { id: 'f1_b', text: 'Machado de Assis', isCorrect: true },
        { id: 'f1_c', text: 'Carlos Drummond de Andrade', isCorrect: false },
        { id: 'f1_d', text: 'Guimarães Rosa', isCorrect: false },
      ],
    },
    {
      baseText: 'Qual é a soma dos ângulos internos de um triângulo?',
      subject: 'Matemática',
      alternatives: [
        { id: 'f1_e', text: '90°', isCorrect: false },
        { id: 'f1_f', text: '180°', isCorrect: true },
        { id: 'f1_g', text: '360°', isCorrect: false },
        { id: 'f1_h', text: '270°', isCorrect: false },
      ],
    },
    {
      baseText: 'Quantos estados possui o Brasil?',
      subject: 'Geografia',
      alternatives: [
        { id: 'f1_i', text: '24', isCorrect: false },
        { id: 'f1_j', text: '25', isCorrect: false },
        { id: 'f1_k', text: '26', isCorrect: true },
        { id: 'f1_l', text: '27', isCorrect: false },
      ],
    },
    {
      baseText: 'Em que ano ocorreu a Revolução Francesa?',
      subject: 'História',
      alternatives: [
        { id: 'f1_m', text: '1776', isCorrect: false },
        { id: 'f1_n', text: '1789', isCorrect: true },
        { id: 'f1_o', text: '1822', isCorrect: false },
        { id: 'f1_p', text: '1848', isCorrect: false },
      ],
    },
  ],
  2: [
    {
      baseText: 'Qual organela celular é responsável pela produção de energia (ATP) nas células eucarióticas?',
      subject: 'Biologia',
      alternatives: [
        { id: 'f2_a', text: 'Ribossomo', isCorrect: false },
        { id: 'f2_b', text: 'Mitocôndria', isCorrect: true },
        { id: 'f2_c', text: 'Complexo de Golgi', isCorrect: false },
        { id: 'f2_d', text: 'Lisossomo', isCorrect: false },
      ],
    },
    {
      baseText: 'Qual é o símbolo químico do elemento Ouro na tabela periódica?',
      subject: 'Química',
      alternatives: [
        { id: 'f2_e', text: 'Ag', isCorrect: false },
        { id: 'f2_f', text: 'Fe', isCorrect: false },
        { id: 'f2_g', text: 'Au', isCorrect: true },
        { id: 'f2_h', text: 'Or', isCorrect: false },
      ],
    },
    {
      baseText: 'A velocidade é uma grandeza escalar ou vetorial?',
      subject: 'Física',
      alternatives: [
        { id: 'f2_i', text: 'Escalar', isCorrect: false },
        { id: 'f2_j', text: 'Vetorial', isCorrect: true },
        { id: 'f2_k', text: 'Nenhuma das anteriores', isCorrect: false },
        { id: 'f2_l', text: 'Ambas', isCorrect: false },
      ],
    },
    {
      baseText: 'Qual classe gramatical tem a função de modificar o substantivo, atribuindo-lhe qualidade ou característica?',
      subject: 'Língua Portuguesa',
      alternatives: [
        { id: 'f2_m', text: 'Advérbio', isCorrect: false },
        { id: 'f2_n', text: 'Adjetivo', isCorrect: true },
        { id: 'f2_o', text: 'Pronome', isCorrect: false },
        { id: 'f2_p', text: 'Conjunção', isCorrect: false },
      ],
    },
  ],
  3: [
    {
      baseText: 'Qual molécula contém as informações genéticas dos seres vivos?',
      subject: 'Biologia',
      alternatives: [
        { id: 'f3_a', text: 'RNA', isCorrect: false },
        { id: 'f3_b', text: 'DNA', isCorrect: true },
        { id: 'f3_c', text: 'ATP', isCorrect: false },
        { id: 'f3_d', text: 'Proteína', isCorrect: false },
      ],
    },
    {
      baseText: 'What is the past tense of "go"?',
      subject: 'Língua Inglesa',
      alternatives: [
        { id: 'f3_e', text: 'Goed', isCorrect: false },
        { id: 'f3_f', text: 'Went', isCorrect: true },
        { id: 'f3_g', text: 'Gone', isCorrect: false },
        { id: 'f3_h', text: 'Going', isCorrect: false },
      ],
    },
  ],
};

export const useQuestions = () => {
  const [questions, setQuestions] = useState<DbQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all questions (for admin), optionally filtered by environmentId (categoriasid)
  const fetchQuestions = useCallback(async (environmentId?: number) => {
    setLoading(true);
    try {
      const path = environmentId
        ? `completas/${environmentId}?active=false`
        : 'todas';
      const res = await callPerguntasApi(path);
      if (!res.ok) throw new Error('Erro ao buscar perguntas');
      const data: RawPergunta[] = await res.json();

      const parsed = data.map(mapPerguntaToDbQuestion);
      setQuestions(parsed);
      return parsed;
    } catch (err) {
      console.error('Error fetching questions:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch active questions with alternatives for battle
  const fetchBattleQuestions = useCallback(async (environmentId: number) => {
    try {
      const res = await callPerguntasApi(`completas/${environmentId}`);
      if (!res.ok) throw new Error('Erro ao buscar perguntas');
      const data: RawPergunta[] = await res.json();

      const parsed = data
        .filter(p => p.alternativas && p.alternativas.length > 0)
        .map(p => ({
          id: String(p.id),
          baseText: p.conteudo || '',
          subject: '',
          alternatives: (p.alternativas || []).map(a => ({
            id: String(a.id),
            text: a.conteudo || '',
            isCorrect: a.correta,
          })),
        }));

      // If no questions in DB, use fallback
      if (parsed.length === 0) {
        return (fallbackQuestions[environmentId] || []).map((q, i) => ({
          id: `fallback_${environmentId}_${i}`,
          baseText: q.baseText,
          subject: q.subject,
          alternatives: q.alternatives,
        }));
      }

      return parsed;
    } catch (err) {
      console.error('Error fetching battle questions:', err);
      return (fallbackQuestions[environmentId] || []).map((q, i) => ({
        id: `fallback_${environmentId}_${i}`,
        baseText: q.baseText,
        subject: q.subject,
        alternatives: q.alternatives,
      }));
    }
  }, []);

  // Create a new question with alternatives
  const saveQuestion = async (questionData: {
    environment_id: number;
    subject: string;
    base_text: string;
    alternatives: DbAlternative[];
    is_active?: boolean;
  }) => {
    const res = await callPerguntasApi('', {
      method: 'POST',
      auth: true,
      body: {
        conteudo: questionData.base_text,
        categoriasid: questionData.environment_id,
        perguntasnivelid: 1,
        tempo: 30,
        status: questionData.is_active ?? true,
        alternativas: questionData.alternatives.map(a => ({
          conteudo: a.text,
          correta: a.isCorrect,
        })),
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erro ao salvar pergunta');
    }
    return await res.json();
  };

  // Update a question and its alternatives
  const updateQuestion = async (id: string, questionData: {
    environment_id?: number;
    subject?: string;
    base_text?: string;
    alternatives?: DbAlternative[];
    is_active?: boolean;
  }) => {
    const body: Record<string, unknown> = {};
    if (questionData.base_text !== undefined) body.conteudo = questionData.base_text;
    if (questionData.environment_id !== undefined) body.categoriasid = questionData.environment_id;
    if (questionData.is_active !== undefined) body.status = questionData.is_active;
    if (questionData.alternatives) {
      body.alternativas = questionData.alternatives.map(a => ({
        conteudo: a.text,
        correta: a.isCorrect,
      }));
    }

    const res = await callPerguntasApi(id, { method: 'PUT', body, auth: true });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erro ao atualizar pergunta');
    }
    return await res.json();
  };

  // Delete a question (and its alternatives)
  const deleteQuestion = async (id: string) => {
    const res = await callPerguntasApi(id, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erro ao excluir pergunta');
    }
  };

  return { questions, loading, fetchQuestions, fetchBattleQuestions, saveQuestion, updateQuestion, deleteQuestion };
};
