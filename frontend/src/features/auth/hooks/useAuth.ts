import { useState, useEffect, useCallback } from 'react';
import { getToken, clearAuth, getSavedUser, setToken, setSavedUser, type AppUser } from '@/lib/api-client';
import { login as apiLogin, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword, confirmEmail as apiConfirmEmail } from '@/models/services/auth.service';
import { createUsuario as apiRegisterUser, getUsuarioById } from '@/models/services/usuario.service';

export const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const token = getToken();
    const saved = getSavedUser();
    if (token && saved) {
      // Se o nome estiver vazio (sessão antiga incompleta), re-busca o usuário no backend
      if (!saved.nome) {
        getUsuarioById(saved.id)
          .then(fresh => {
            const updated = fresh as AppUser;
            setSavedUser(updated);
            setUser(updated);
            setIsAdmin(updated.role === 1);
          })
          .catch(() => {
            // Se falhar, usa o que tem (evita logout forçado)
            setUser(saved);
            setIsAdmin(saved.role === 1);
          });
      } else {
        setUser(saved);
        setIsAdmin(saved.role === 1);
      }
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await apiLogin({ email, senha: password });
      
      setToken(result.token);

      // Usa o objeto completo retornado pelo backend (sem senha)
      const appUser: AppUser = result.user as AppUser;
      
      setSavedUser(appUser);
      setUser(appUser);
      setIsAdmin(result.role === 1);
      return { data: appUser, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      const newUser = await apiRegisterUser({
        nome: displayName,
        email,
        senha: password,
        cursoid: 1,
      });
      return { data: newUser, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  }, []);

  const signOut = useCallback(async () => {
    clearAuth();
    setUser(null);
    setIsAdmin(false);
  }, []);

  const checkAdminRole = useCallback(async () => {
    if (user) {
      setIsAdmin(user.role === 1);
    }
  }, [user]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      await apiForgotPassword(email);
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message } };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, novaSenha: string) => {
    try {
      await apiResetPassword(token, novaSenha);
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message } };
    }
  }, []);

  const confirmEmail = useCallback(async (token: string) => {
    try {
      await apiConfirmEmail(token);
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message } };
    }
  }, []);

  return { user, setUser, loading, isAdmin, signIn, signUp, signOut, checkAdminRole, forgotPassword, resetPassword, confirmEmail };
};
