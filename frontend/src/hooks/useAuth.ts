export interface UserPayload {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CAMPUS_ADMIN' | 'PLAYER';
}

// Mock inicial do hook de auth para não quebrar a aplicação.
// Em produção, isso deve ler de um Contexto ou Zustand preenchido pelo JWT.
export const useAuth = () => {
  // Simulando que não há usuário logado por padrão.
  // Para testar áreas restritas, altere estes valores manualmente no desenvolvimento inicial
  // ou através do LoginForm.
  const authState = {
    isAuthenticated: false,
    isLoading: false,
    user: null as UserPayload | null,
  };

  // Verificando se há um token/user no localStorage (simulação simples)
  try {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      authState.user = JSON.parse(localUser);
      authState.isAuthenticated = true;
    }
  } catch (e) {
    // Ignore error
  }

  return authState;
};
