import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types matching the database schema
export interface DbStatement {
  id: string;
  text: string;
  isTrue: boolean;
}

export interface DbQuestion {
  id: string;
  environment_id: number;
  subject: string;
  base_text: string;
  statements: DbStatement[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fallback hardcoded questions (used when DB is empty for an environment)
const fallbackQuestions: Record<number, Array<{ baseText: string; subject: string; statements: DbStatement[] }>> = {
  1: [
    {
      baseText: 'Sobre a célula e suas organelas, considere os conhecimentos de biologia celular para analisar as seguintes afirmações:',
      subject: 'Biologia',
      statements: [
        { id: 'f1_1', text: 'A mitocôndria é responsável pela produção de energia (ATP) nas células.', isTrue: true },
        { id: 'f1_2', text: 'O núcleo contém o material genético da célula.', isTrue: true },
        { id: 'f1_3', text: 'O ribossomo é responsável pela fotossíntese.', isTrue: false },
        { id: 'f1_4', text: 'A membrana plasmática é impermeável a todas as substâncias.', isTrue: false },
      ],
    },
    {
      baseText: 'Considerando os elementos químicos e suas propriedades, analise as afirmações sobre a tabela periódica:',
      subject: 'Química',
      statements: [
        { id: 'f1_5', text: 'O oxigênio é classificado como um gás nobre.', isTrue: false },
        { id: 'f1_6', text: 'O átomo é a menor partícula que mantém as propriedades de um elemento.', isTrue: true },
        { id: 'f1_7', text: 'A água (H₂O) é composta por dois átomos de hidrogênio e um de oxigênio.', isTrue: true },
        { id: 'f1_8', text: 'Todos os metais são sólidos à temperatura ambiente.', isTrue: false },
      ],
    },
  ],
  2: [
    {
      baseText: 'Sobre as classes gramaticais da língua portuguesa, analise as afirmações a seguir:',
      subject: 'Português',
      statements: [
        { id: 'f2_1', text: 'Substantivo é uma classe de palavra que nomeia seres, lugares e objetos.', isTrue: true },
        { id: 'f2_2', text: 'Verbos são palavras que indicam qualidade ou característica.', isTrue: false },
        { id: 'f2_3', text: 'Adjetivos podem modificar substantivos.', isTrue: true },
        { id: 'f2_4', text: 'Advérbios modificam apenas verbos.', isTrue: false },
      ],
    },
    {
      baseText: 'Sobre a literatura brasileira e seus principais autores, considere as seguintes afirmações:',
      subject: 'Literatura',
      statements: [
        { id: 'f2_5', text: 'Machado de Assis escreveu "Dom Casmurro".', isTrue: true },
        { id: 'f2_6', text: 'O Modernismo brasileiro começou em 1822.', isTrue: false },
        { id: 'f2_7', text: 'A Semana de Arte Moderna ocorreu em São Paulo em 1922.', isTrue: true },
        { id: 'f2_8', text: 'Carlos Drummond de Andrade foi um poeta modernista.', isTrue: true },
      ],
    },
  ],
  3: [
    {
      baseText: 'Sobre geometria plana e suas propriedades, analise as afirmações:',
      subject: 'Matemática',
      statements: [
        { id: 'f3_1', text: 'A soma dos ângulos internos de um triângulo é 180°.', isTrue: true },
        { id: 'f3_2', text: 'Pi (π) é igual a exatamente 3,14.', isTrue: false },
        { id: 'f3_3', text: 'Um quadrado tem todos os lados iguais e ângulos retos.', isTrue: true },
        { id: 'f3_4', text: 'A área de um círculo é calculada por 2πr.', isTrue: false },
      ],
    },
    {
      baseText: 'Sobre geografia do Brasil e do mundo, considere as afirmações:',
      subject: 'Geografia',
      statements: [
        { id: 'f3_5', text: 'O Brasil possui 26 estados e 1 Distrito Federal.', isTrue: true },
        { id: 'f3_6', text: 'O Amazonas é o maior rio do mundo em volume de água.', isTrue: true },
        { id: 'f3_7', text: 'O Monte Everest fica na América do Sul.', isTrue: false },
        { id: 'f3_8', text: 'O Brasil faz fronteira com todos os países da América do Sul.', isTrue: false },
      ],
    },
  ],
  4: [
    {
      baseText: 'Esta é a prova final! Reúna todos os seus conhecimentos para analisar as afirmações sobre ciências:',
      subject: 'Multidisciplinar',
      statements: [
        { id: 'f4_1', text: 'O DNA contém as informações genéticas dos seres vivos.', isTrue: true },
        { id: 'f4_2', text: 'A tabela periódica possui 118 elementos químicos conhecidos.', isTrue: true },
        { id: 'f4_3', text: 'A velocidade da luz no vácuo é infinita.', isTrue: false },
        { id: 'f4_4', text: 'A gravidade na Terra é aproximadamente 9,8 m/s².', isTrue: true },
      ],
    },
    {
      baseText: 'Analise as afirmações sobre história, literatura e gramática:',
      subject: 'Multidisciplinar',
      statements: [
        { id: 'f4_5', text: 'A Revolução Francesa ocorreu em 1789.', isTrue: true },
        { id: 'f4_6', text: 'Fernando Pessoa criou heterônimos como Alberto Caeiro.', isTrue: true },
        { id: 'f4_7', text: '"Goodbye" significa "bom dia" em inglês.', isTrue: false },
        { id: 'f4_8', text: 'Adjetivos são palavras que modificam verbos.', isTrue: false },
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
      
      // Parse JSONB statements
      const parsed = (data || []).map(q => ({
        ...q,
        statements: (typeof q.statements === 'string' ? JSON.parse(q.statements) : q.statements) as DbStatement[],
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
        statements: (typeof q.statements === 'string' ? JSON.parse(q.statements) : q.statements) as DbStatement[],
      }));

      // If no questions in DB, use fallback
      if (parsed.length === 0) {
        return (fallbackQuestions[environmentId] || []).map((q, i) => ({
          id: `fallback_${environmentId}_${i}`,
          baseText: q.baseText,
          subject: q.subject,
          statements: q.statements,
        }));
      }

      return parsed;
    } catch (err) {
      console.error('Error fetching battle questions:', err);
      // Return fallback on error
      return (fallbackQuestions[environmentId] || []).map((q, i) => ({
        id: `fallback_${environmentId}_${i}`,
        baseText: q.baseText,
        subject: q.subject,
        statements: q.statements,
      }));
    }
  }, []);

  const saveQuestion = async (questionData: {
    environment_id: number;
    subject: string;
    base_text: string;
    statements: DbStatement[];
    is_active?: boolean;
  }) => {
    const { data, error } = await supabase
      .from('questions')
      .insert([{
        environment_id: questionData.environment_id,
        subject: questionData.subject,
        base_text: questionData.base_text,
        statements: JSON.stringify(questionData.statements),
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
    statements?: DbStatement[];
    is_active?: boolean;
  }) => {
    const updateData: Record<string, unknown> = {};
    if (questionData.environment_id !== undefined) updateData.environment_id = questionData.environment_id;
    if (questionData.subject !== undefined) updateData.subject = questionData.subject;
    if (questionData.base_text !== undefined) updateData.base_text = questionData.base_text;
    if (questionData.statements !== undefined) updateData.statements = JSON.stringify(questionData.statements);
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
