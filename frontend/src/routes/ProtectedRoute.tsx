import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getToken } from '@/lib/api-client';

// Mapeamento de role numérico (backend) → nome de string (rotas do frontend)
const ROLE_NAME_MAP: Record<number, string> = {
  1: 'SUPER_ADMIN',
  2: 'ADMIN',
  3: 'PLAYER',
  4: 'CAMPUS_ADMIN',
};

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Aguarda a restauração da sessão antes de redirecionar
  if (loading) return <div className="p-8 text-center text-white">Carregando permissões...</div>;

  // Sem token ou sem dados de usuário → redireciona para login
  const token = getToken();
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Mapeia role numérico para nome de string e verifica permissão
  const userRoleName = typeof user.role === 'string'
    ? user.role
    : ROLE_NAME_MAP[user.role as number] ?? 'PLAYER';

  if (!allowedRoles.includes(userRoleName)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
