import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types matching the new multiple-choice structure
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

// Fallback hardcoded questions (multiple choice)
const fallbackQuestions: Record<number, Array<{ baseText: string; subject: string; alternatives: DbAlternative[] }>> = {
  1: [
    {
      baseText: 'Qual organela celular é responsável pela produção de energia (ATP) nas células eucarióticas?',
      subject: 'Biologia',
      alternatives: [
        { id: 'f1_a', text: 'Ribossomo', isCorrect: false },
        { id: 'f1_b', text: 'Mitocôndria', isCorrect: true },
        { id: 'f1_c', text: 'Complexo de Golgi', isCorrect: false },
        { id: 'f1_d', text: 'Lisossomo', isCorrect: false },
      ],
    },
    {
      baseText: 'Qual é o símbolo químico do elemento Ouro na tabela periódica?',
      subject: 'Química',
      alternatives: [
        { id: 'f1_e', text: 'Ag', isCorrect: false },
        { id: 'f1_f', text: 'Fe', isCorrect: false },
        { id: 'f1_g', text: 'Au', isCorrect: true },
        { id: 'f1_h', text: 'Or', isCorrect: false },
      ],
    },
  ],
  2: [
    {
      baseText: 'Qual classe gramatical tem a função de modificar o substantivo, atribuindo-lhe qualidade ou característica?',
      subject: 'Português',
      alternatives: [
        { id: 'f2_a', text: 'Advérbio', isCorrect: false },
        { id: 'f2_b', text: 'Adjetivo', isCorrect: true },
        { id: 'f2_c', text: 'Pronome', isCorrect: false },
        { id: 'f2_d', text: 'Conjunção', isCorrect: false },
      ],
    },
    {
      baseText: 'Quem escreveu a obra "Dom Casmurro"?',
      subject: 'Literatura',
      alternatives: [
        { id: 'f2_e', text: 'José de Alencar', isCorrect: false },
        { id: 'f2_f', text: 'Machado de Assis', isCorrect: true },
        { id: 'f2_g', text: 'Carlos Drummond de Andrade', isCorrect: false },
        { id: 'f2_h', text: 'Guimarães Rosa', isCorrect: false },
      ],
    },
  ],
  3: [
    {
      baseText: 'Qual é a soma dos ângulos internos de um triângulo?',
      subject: 'Matemática',
      alternatives: [
        { id: 'f3_a', text: '90°', isCorrect: false },
        { id: 'f3_b', text: '180°', isCorrect: true },
        { id: 'f3_c', text: '360°', isCorrect: false },
        { id: 'f3_d', text: '270°', isCorrect: false },
      ],
    },
    {
      baseText: 'Quantos estados possui o Brasil?',
      subject: 'Geografia',
      alternatives: [
        { id: 'f3_e', text: '24', isCorrect: false },
        { id: 'f3_f', text: '25', isCorrect: false },
        { id: 'f3_g', text: '26', isCorrect: true },
        { id: 'f3_h', text: '27', isCorrect: false },
      ],
    },
  ],
  4: [
    {
      baseText: 'Qual molécula contém as informações genéticas dos seres vivos?',
      subject: 'Biologia',
      alternatives: [
        { id: 'f4_a', text: 'RNA', isCorrect: false },
        { id: 'f4_b', text: 'DNA', isCorrect: true },
        { id: 'f4_c', text: 'ATP', isCorrect: false },
        { id: 'f4_d', text: 'Proteína', isCorrect: false },
      ],
    },
    {
      baseText: 'Em que ano ocorreu a Revolução Francesa?',
      subject: 'História',
      alternatives: [
        { id: 'f4_e', text: '1776', isCorrect: false },
        { id: 'f4_f', text: '1789', isCorrect: true },
        { id: 'f4_g', text: '1822', isCorrect: false },
        { id: 'f4_h', text: '1848', isCorrect: false },
      ],
    },
  ],
};

export const useQuestions = () => {
  const [questions, setQuestions] = useState<DbQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = useCallback(async (environmentId?: number) => {
    setLoading(true);
    try {
      let query = supabase.from('questions').select('*');
      if (environmentId) {
        query = query.eq('environment_id', environmentId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Parse JSONB statements as alternatives
      const parsed = (data || []).map(q => ({
        ...q,
        alternatives: (typeof q.statements === 'string' ? JSON.parse(q.statements) : q.statements) as DbAlternative[],
      }));
      
      setQuestions(parsed);
      return parsed;
    } catch (err) {
      console.error('Error fetching questions:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBattleQuestions = useCallback(async (environmentId: number) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('environment_id', environmentId)
        .eq('is_active', true);
      
      if (error) throw error;
      
      const parsed = (data || []).map(q => ({
        id: q.id,
        baseText: q.base_text,
        subject: q.subject,
        alternatives: (typeof q.statements === 'string' ? JSON.parse(q.statements) : q.statements) as DbAlternative[],
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

  const saveQuestion = async (questionData: {
    environment_id: number;
    subject: string;
    base_text: string;
    alternatives: DbAlternative[];
    is_active?: boolean;
  }) => {
    const { data, error } = await supabase
      .from('questions')
      .insert([{
        environment_id: questionData.environment_id,
        subject: questionData.subject,
        base_text: questionData.base_text,
        statements: JSON.stringify(questionData.alternatives),
        is_active: questionData.is_active ?? true,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const updateQuestion = async (id: string, questionData: {
    environment_id?: number;
    subject?: string;
    base_text?: string;
    alternatives?: DbAlternative[];
    is_active?: boolean;
  }) => {
    const updateData: Record<string, unknown> = {};
    if (questionData.environment_id !== undefined) updateData.environment_id = questionData.environment_id;
    if (questionData.subject !== undefined) updateData.subject = questionData.subject;
    if (questionData.base_text !== undefined) updateData.base_text = questionData.base_text;
    if (questionData.alternatives !== undefined) updateData.statements = JSON.stringify(questionData.alternatives);
    if (questionData.is_active !== undefined) updateData.is_active = questionData.is_active;

    const { data, error } = await supabase
      .from('questions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  };

  return { questions, loading, fetchQuestions, fetchBattleQuestions, saveQuestion, updateQuestion, deleteQuestion };
};
