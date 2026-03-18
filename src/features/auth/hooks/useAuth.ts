import { useState, useEffect, useCallback } from 'react';
import { getToken, setToken, clearAuth, getSavedUser, setSavedUser, type AppUser } from '@/lib/api-client';
import { apiLogin } from '@/features/auth/services/auth.service';
import { apiRegisterUser, apiGetUser } from '@/features/profile/services/user.service';

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
      const result = await apiLogin(email, password);
      setToken(result.token);

      // Fetch full user profile
      const fullUser = await apiGetUser(result.id);
      setSavedUser(fullUser);
      setUser(fullUser);
      setIsAdmin(fullUser.role === 1);

      return { data: fullUser, error: null };
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
        cursoid: 1, // default
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
