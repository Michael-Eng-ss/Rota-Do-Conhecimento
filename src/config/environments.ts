// Configuração dos ambientes baseada no novo agrupamento

export type EnvironmentId = 1 | 2 | 3;

export interface EnvironmentConfig {
  id: EnvironmentId;
  name: string;
  subjects: string[];
  questionCounts: Record<string, number>; // Questões por disciplina
  maxHealth: number;        // Pontuação máxima (vida do chefão)
  minHealthToPass: number;  // 80% mínimo para vencer
  pointsPerQuestion: number;
  totalQuestions: number;
  isFinalBoss: boolean;
  requiresAllCompleted: boolean;
}

export const environmentConfigs: Record<EnvironmentId, EnvironmentConfig> = {
  1: {
    id: 1,
    name: 'Auditório',
    subjects: ['Biologia', 'Química', 'Física', 'Língua Portuguesa'],
    questionCounts: { 'Biologia': 8, 'Química': 8, 'Física': 8, 'Língua Portuguesa': 6 },
    maxHealth: 60,
    minHealthToPass: 48,  // 80% de 60
    pointsPerQuestion: 2,
    totalQuestions: 30,
    isFinalBoss: false,
    requiresAllCompleted: false,
  },
  2: {
    id: 2,
    name: 'Biblioteca',
    subjects: ['Literatura', 'Matemática', 'Língua Inglesa', 'Geografia', 'História'],
    questionCounts: { 'Literatura': 4, 'Matemática': 4, 'Língua Inglesa': 4, 'Geografia': 4, 'História': 4 },
    maxHealth: 40,
    minHealthToPass: 32,  // 80% de 40
    pointsPerQuestion: 2,
    totalQuestions: 20,
    isFinalBoss: false,
    requiresAllCompleted: false,
  },
  3: {
    id: 3,
    name: 'Boss Final',
    subjects: [
      'Biologia', 'Química', 'Física', 'Língua Portuguesa',
      'Literatura', 'Matemática', 'Língua Inglesa', 'Geografia', 'História'
    ],
    questionCounts: {
      'Biologia': 8, 'Química': 8, 'Física': 8, 'Língua Portuguesa': 6,
      'Literatura': 4, 'Matemática': 4, 'Língua Inglesa': 4, 'Geografia': 4, 'História': 4
    },
    maxHealth: 100,
    minHealthToPass: 80,  // 80% de 100
    pointsPerQuestion: 2,
    totalQuestions: 50,
    isFinalBoss: true,
    requiresAllCompleted: true,
  },
};

// Total de pontos possíveis
export const TOTAL_MAX_SCORE = 100;
export const TOTAL_MIN_SCORE = 80;

// Percentual mínimo para passar de qualquer chefão
export const MIN_PASS_PERCENTAGE = 0.80;

// Número total de ambientes
export const TOTAL_ENVIRONMENTS = 3;

// Verificar se o Boss Final está liberado
export const isFinalBossUnlocked = (completedEnvironments: number[]): boolean => {
  return [1, 2].every(envId => completedEnvironments.includes(envId));
};

// Calcular se o jogador passou do chefão
export const hasPassedBoss = (damageDealt: number, maxHealth: number): boolean => {
  const percentageDealt = damageDealt / maxHealth;
  return percentageDealt >= MIN_PASS_PERCENTAGE;
};

// Obter o percentual de dano causado
export const getDamagePercentage = (damageDealt: number, maxHealth: number): number => {
  return Math.round((damageDealt / maxHealth) * 100);
};
