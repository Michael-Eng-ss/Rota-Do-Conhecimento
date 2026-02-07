// Sistema de perguntas com 4 afirmações V/F por questão

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

// Uma única afirmação V/F
export interface Statement {
  id: string;
  text: string;
  isTrue: boolean;
}

// Uma questão completa com 4 afirmações
export interface Question {
  id: string;
  environmentId: 1 | 2 | 3 | 4;
  subject: string;
  title: string; // Título/contexto da questão
  statements: Statement[]; // 4 afirmações
  createdAt: Date;
  updatedAt: Date;
}

// Resposta do usuário para uma questão
export interface UserAnswer {
  questionId: string;
  answers: Record<string, boolean>; // statementId -> resposta do usuário
}

// Resultado de uma questão
export interface QuestionResult {
  questionId: string;
  correctCount: number;
  totalStatements: number;
  statementResults: {
    statementId: string;
    userAnswer: boolean;
    correctAnswer: boolean;
    isCorrect: boolean;
  }[];
}

// Obter nome do ambiente
export const getEnvironmentName = (envId: 1 | 2 | 3 | 4): string => {
  return environmentConfigs[envId]?.name || `Ambiente ${envId}`;
};

// Verificar se a matéria pertence ao ambiente
export const isSubjectValidForEnvironment = (subject: string, envId: 1 | 2 | 3 | 4): boolean => {
  return subjectsByEnvironment[envId].includes(subject);
};

// Calcular resultado de uma questão
export const calculateQuestionResult = (
  question: Question,
  userAnswers: Record<string, boolean>
): QuestionResult => {
  const statementResults = question.statements.map(statement => ({
    statementId: statement.id,
    userAnswer: userAnswers[statement.id] ?? false,
    correctAnswer: statement.isTrue,
    isCorrect: userAnswers[statement.id] === statement.isTrue,
  }));

  return {
    questionId: question.id,
    correctCount: statementResults.filter(r => r.isCorrect).length,
    totalStatements: question.statements.length,
    statementResults,
  };
};
