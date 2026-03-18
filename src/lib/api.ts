// Barrel re-export for backward compatibility
export { callEdge, getToken, setToken, clearAuth, getSavedUser, setSavedUser, type AppUser } from './api-client';
export { apiLogin } from '@/features/auth/services/auth.service';
export { apiRegisterUser, apiGetUser, apiUpdateUser, apiUpdateScore, apiGetRanking } from '@/features/profile/services/user.service';
export { apiGetCampusList, apiGetCursoList, apiGetPerguntasByQuiz, apiGetAlternativas } from '@/features/game/services/game.service';
