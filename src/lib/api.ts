// Barrel re-export for backward compatibility
export { callEdge, getToken, setToken, clearAuth, getSavedUser, setSavedUser, type AppUser } from './api-client';

// Re-export via models for backward compatibility
export { login as apiLogin } from '@/models/services/auth.service';
export { createUsuario as apiRegisterUser, getUsuarioById as apiGetUser, updateUsuario as apiUpdateUser, updatePontuacao as apiUpdateScore, getRanking as apiGetRanking } from '@/models/services/usuario.service';
export { getCampusList as apiGetCampusList } from '@/models/services/campus.service';
export { getCursoList as apiGetCursoList } from '@/models/services/curso.service';
export { getPerguntasByQuiz as apiGetPerguntasByQuiz } from '@/models/services/pergunta.service';
export { getAlternativasByPergunta as apiGetAlternativas } from '@/models/services/alternativa.service';
