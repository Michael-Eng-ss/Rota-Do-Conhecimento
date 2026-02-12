// Sistema de perguntas de múltipla escolha

import { environmentConfigs } from '@/config/environments';

// Matérias disponíveis por ambiente
export const subjectsByEnvironment: Record<1 | 2 | 3 | 4, string[]> = {
  1: ['Biologia', 'Química', 'História'],
  2: ['Português', 'L. Estrangeira', 'Literatura'],
  3: ['Matemática', 'Física', 'Geografia'],
  4: [
    'Biologia', 'Química', 'História',
    'Português', 'L. Estrangeira', 'Literatura',
    'Matemática', 'Física', 'Geografia'
  ],
};

// Uma alternativa de múltipla escolha
export interface Alternative {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Uma questão completa com enunciado e alternativas
export interface Question {
  id: string;
  environmentId: 1 | 2 | 3 | 4;
  subject: string;
  baseText: string; // Enunciado da questão
  alternatives: Alternative[]; // 2-5 alternativas (apenas 1 correta)
  createdAt: Date;
  updatedAt: Date;
}

// Resposta do usuário para uma questão
export interface UserAnswer {
  questionId: string;
  selectedAlternativeId: string;
}

// Resultado de uma questão
export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  selectedAlternativeId: string;
  correctAlternativeId: string;
}

// Obter nome do ambiente
export const getEnvironmentName = (envId: 1 | 2 | 3 | 4): string => {
  return environmentConfigs[envId]?.name || `Ambiente ${envId}`;
};

// Verificar se a matéria pertence ao ambiente
export const isSubjectValidForEnvironment = (subject: string, envId: 1 | 2 | 3 | 4): boolean => {
  return subjectsByEnvironment[envId].includes(subject);
};
