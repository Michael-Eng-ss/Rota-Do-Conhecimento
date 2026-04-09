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

function callPerguntasApi(path: string, options?: { method?: string; body?: unknown; auth?: boolean }) {
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
    if (!environmentId || isNaN(environmentId)) return [];
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

      // Se não há perguntas cadastradas no banco, retorna vazio (não usar fallback)
      return parsed;
    } catch (err) {
      console.error('Error fetching battle questions:', err);
      // Em caso de erro de rede, também retorna vazio para não exibir perguntas falsas
      return [];
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
    const res = await callPerguntasApi(id, { method: 'DELETE', auth: true });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erro ao excluir pergunta');
    }
  };

  return { questions, loading, fetchQuestions, fetchBattleQuestions, saveQuestion, updateQuestion, deleteQuestion };
};
