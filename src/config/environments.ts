// Configuração dos ambientes e matérias baseada na tabela de conhecimento

export interface EnvironmentConfig {
  id: 1 | 2 | 3 | 4;
  name: string;
  subjects: string[];
  maxHealth: number;        // 100% da vida do chefão em pontos
  minHealthToPass: number;  // 80% mínimo para vencer (em pontos)
  weight: number;           // Peso da somatória
  isFinalBoss: boolean;
  requiresAllCompleted: boolean;  // Se requer todos os outros ambientes completados
}

export const environmentConfigs: Record<1 | 2 | 3 | 4, EnvironmentConfig> = {
  1: {
    id: 1,
    name: 'Laboratório',
    subjects: ['Biologia', 'Química', 'História'],
    maxHealth: 96,
    minHealthToPass: 77,  // 80% de 96
    weight: 24,
    isFinalBoss: false,
    requiresAllCompleted: false,
  },
  2: {
    id: 2,
    name: 'Auditório',
    subjects: ['Português', 'L. Estrangeira', 'Literatura'],
    maxHealth: 88,
    minHealthToPass: 70,  // 80% de 88
    weight: 24,
    isFinalBoss: false,
    requiresAllCompleted: false,
  },
  3: {
    id: 3,
    name: 'Biblioteca',
    subjects: ['Matemática', 'Física', 'Geografia'],
    maxHealth: 80,
    minHealthToPass: 64,  // 80% de 80
    weight: 20,
    isFinalBoss: false,
    requiresAllCompleted: false,
  },
  4: {
    id: 4,
    name: 'Boss Final',
    subjects: [
      'Biologia', 'Química', 'História',
      'Português', 'L. Estrangeira', 'Literatura',
      'Matemática', 'Física', 'Geografia'
    ],
    maxHealth: 264,
    minHealthToPass: 211,  // 80% de 264
    weight: 66,
    isFinalBoss: true,
    requiresAllCompleted: true,  // Só libera após completar 1, 2 e 3
  },
};

// Total de pontos possíveis
export const TOTAL_MAX_SCORE = 264;  // 100%
export const TOTAL_MIN_SCORE = 211;  // 80%

// Percentual mínimo para passar de qualquer chefão
export const MIN_PASS_PERCENTAGE = 0.80;  // 80%

// Verificar se o Boss Final está liberado
export const isFinalBossUnlocked = (completedEnvironments: number[]): boolean => {
  return [1, 2, 3].every(envId => completedEnvironments.includes(envId));
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
