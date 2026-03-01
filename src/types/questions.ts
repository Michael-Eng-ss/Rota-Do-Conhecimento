// Sistema de perguntas de múltipla escolha

import { environmentConfigs, type EnvironmentId } from '@/config/environments';

// Matérias disponíveis por ambiente
export const subjectsByEnvironment: Record<EnvironmentId, string[]> = {
  1: ['Biologia', 'Química', 'Física', 'Língua Portuguesa'],
  2: ['Literatura', 'Matemática', 'Língua Inglesa', 'Geografia', 'História'],
  3: [
    'Biologia', 'Química', 'Física', 'Língua Portuguesa',
    'Literatura', 'Matemática', 'Língua Inglesa', 'Geografia', 'História'
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
  environmentId: EnvironmentId;
  subject: string;
  baseText: string;
  alternatives: Alternative[];
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
export const getEnvironmentName = (envId: EnvironmentId): string => {
  return environmentConfigs[envId]?.name || `Ambiente ${envId}`;
};

// Verificar se a matéria pertence ao ambiente
export const isSubjectValidForEnvironment = (subject: string, envId: EnvironmentId): boolean => {
  return subjectsByEnvironment[envId].includes(subject);
};
