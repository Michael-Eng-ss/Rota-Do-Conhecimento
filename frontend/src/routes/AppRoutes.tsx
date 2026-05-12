import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Importações temporárias. Se as páginas não existirem, Vite vai acusar erro,
// criaremos os stubs logo em seguida.
import { LoginPage } from '@/pages/public/LoginPage';
import { HomePage } from '@/pages/public/HomePage';
import { ManageUsersPage } from '@/pages/admin/ManageUsersPage';
import { RankingPage } from '@/pages/game/RankingPage';
import { GamePage } from '@/pages/game/GamePage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Protegidas - Apenas Administradores */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CAMPUS_ADMIN']} />}>
          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/dashboard" element={<div className="p-8">Dashboard Admin</div>} />
        </Route>

        {/* Rotas Protegidas - Jogadores e Admins */}
        <Route element={<ProtectedRoute allowedRoles={['PLAYER', 'SUPER_ADMIN', 'ADMIN', 'CAMPUS_ADMIN']} />}>
          <Route path="/game" element={<GamePage />} />
          <Route path="/rank" element={<RankingPage />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
