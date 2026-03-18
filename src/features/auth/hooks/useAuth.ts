import { useState, useEffect, useCallback } from 'react';
import { getToken, setToken, clearAuth, getSavedUser, setSavedUser, type AppUser } from '@/lib/api-client';
import { AuthController } from '@/controllers';
import { UsuarioController } from '@/controllers';
import type { UsuarioCreate } from '@/models/types';

const authCtrl = new AuthController();
const usuarioCtrl = new UsuarioController();

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
      const result = await authCtrl.login(email, password);
      const fullUser = result.user as unknown as AppUser;
      setUser(fullUser);
      setIsAdmin(fullUser.role === 1);
      return { data: fullUser, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      const newUser = await usuarioCtrl.create({
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
    authCtrl.logout();
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
