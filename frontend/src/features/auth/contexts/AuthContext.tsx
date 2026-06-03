import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getToken, clearAuth, getSavedUser, setToken, setSavedUser, type AppUser } from '@/lib/api-client';
import { login as apiLogin, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword } from '@/models/services/auth.service';
import { createUsuario as apiRegisterUser, getUsuarioById } from '@/models/services/usuario.service';
import { type AuthError } from '@/models/types';

interface AuthContextType {
  user: AppUser | null;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, senha: string) => Promise<{ data: AppUser | null; error: AuthError | null }>;
  signUp: (email: string, senha: string, nome: string, campusId?: number) => Promise<{ data: AppUser | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
  checkAdminRole: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resetPassword: (token: string, novaSenha: string) => Promise<{ error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
    } catch (err: unknown) {
      return { data: null, error: { message: err instanceof Error ? err.message : String(err) } };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string, campusId?: number) => {
    try {
      const newUser = await apiRegisterUser({
        nome: displayName,
        email,
        senha: password,
        cursoid: 1,
        campusid: campusId || 1,
      });
      return { data: newUser as unknown as AppUser, error: null };
    } catch (err: unknown) {
      return { data: null, error: { message: err instanceof Error ? err.message : String(err) } };
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
    } catch (err: unknown) {
      return { error: { message: err instanceof Error ? err.message : String(err) } };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, novaSenha: string) => {
    try {
      await apiResetPassword(token, novaSenha);
      return { error: null };
    } catch (err: unknown) {
      return { error: { message: err instanceof Error ? err.message : String(err) } };
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      isAdmin,
      signIn,
      signUp,
      signOut,
      checkAdminRole,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
