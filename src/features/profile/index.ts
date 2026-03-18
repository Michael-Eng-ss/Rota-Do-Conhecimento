export { default as ProfileScreen } from './components/ProfileScreen';
export { default as RankingScreen } from './components/RankingScreen';
export { default as UserMenuScreen } from './components/UserMenuScreen';

// Re-export from models for backward compatibility
export { createUsuario as apiRegisterUser, getUsuarioById as apiGetUser, updateUsuario as apiUpdateUser, updatePontuacao as apiUpdateScore, getRanking as apiGetRanking } from '@/models/services/usuario.service';
