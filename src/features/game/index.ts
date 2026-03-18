export { default as GameManager } from './components/GameManager';
export { useQuestions } from './hooks/useQuestions';
export { useSoundEffects } from './hooks/useSoundEffects';
export { useSoundSystem } from './hooks/useSoundSystem';
export { environmentConfigs, TOTAL_ENVIRONMENTS } from './config/environments';
export { apiGetCampusList, apiGetCursoList, apiGetPerguntasByQuiz, apiGetAlternativas } from './services/game.service';
export type { EnvironmentId } from './config/environments';
export type { DbQuestion, DbAlternative } from './hooks/useQuestions';
