import { useState, useEffect, useCallback } from 'react';
import { getToken, clearAuth, getSavedUser, setToken, setSavedUser, type AppUser } from '@/lib/api-client';
import { login as apiLogin } from '@/models/services/auth.service';
import { createUsuario as apiRegisterUser } from '@/models/services/usuario.service';

export const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const token = getToken();
    const saved = getSavedUser();
    if (token && saved) {
      setUser(saved);
      setIsAdmin(saved.role === 1);
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await apiLogin({ email, senha: password });
      
      // Armazena no localStorage
      setToken(result.token);
      
      const appUser: AppUser = {
        id: result.id,
        nome: '', // Será preenchido num fetch real depois
        email,
        role: result.role,
        pontuacao: 0,
        foto: '',
        cursoid: 1,
        campusid: null,
        cidade: '',
        uf: '',
        telefone: '',
        sexo: 0,
        turma: null,
        periodo: null,
        datanascimento: '',
        status: true,
      };
      
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

  return { user, setUser, loading, isAdmin, signIn, signUp, signOut, checkAdminRole };
};
