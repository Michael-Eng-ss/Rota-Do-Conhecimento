import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { setSavedUser, type AppUser } from '@/lib/api-client';
import { updatePontuacao } from '@/models/services/usuario.service';
import LoginScreen from '@/features/auth/components/LoginScreen';
import UserMenuScreen from '@/features/profile/components/UserMenuScreen';
import RegisterScreen from '@/features/auth/components/RegisterScreen';
import { RankingPage as RankingScreen } from '@/pages/game/RankingPage';
import ProfileScreen from '@/features/profile/components/ProfileScreen';
import AdminLoginScreen from '@/features/auth/components/AdminLoginScreen';
import AdminHubScreen from '@/features/admin/components/AdminHubScreen';
import QuestionAdminScreen from '@/features/admin/components/QuestionAdminScreen';
import { ManageUsersPage } from '@/pages/admin/ManageUsersPage';
import VisualNovelGame from '@/features/game/components/VisualNovel/VisualNovelGame';
import EnvironmentScreen from '@/features/game/components/Environment/EnvironmentScreen';
import EnvironmentSelectionScreen from '@/features/game/components/Environment/EnvironmentSelectionScreen';
import EndingScreen from '@/features/game/components/Ending/EndingScreen';
import ForgotPasswordScreen from '@/features/auth/components/ForgotPasswordScreen';
import NewPasswordScreen from '@/features/auth/components/NewPasswordScreen';
import EmailConfirmScreen from '@/features/auth/components/EmailConfirmScreen';
import { verifyEmail } from '@/models/services/auth.service';
import NotFound from '@/pages/NotFound';

const GameManager = () => {
  const { user, loading, setUser, isAdmin, signIn, signUp, signOut, checkAdminRole, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentEnvironment, setCurrentEnvironment] = useState<1 | 2 | 3>(1);
  const [completedEnvironments, setCompletedEnvironments] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState<string>('Jogador');
  const [playerAvatar, setPlayerAvatar] = useState<string>('clara');
  const [totalScore, setTotalScore] = useState<number>(0);
  const [urlToken, setUrlToken] = useState<string>('');

  // Detecta token na URL para redefinir senha
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const path = window.location.pathname;
    if (token && (path.includes('nova-senha') || path.includes('verificar-email'))) {
      setUrlToken(token);
    }
  }, [location.pathname]);

  // Load profile from user data when logged in
  useEffect(() => {
    if (!user) return;
    if (user.nome) setPlayerName(user.nome);
    setTotalScore(user.pontuacao ?? 0);
    if (user.foto) setPlayerAvatar(user.foto);
  }, [user]);

  const handleUpdateProfile = (name: string, avatarId: string) => {
    setPlayerName(name);
    setPlayerAvatar(avatarId);
  };

  const handleEnvironmentComplete = async (envId: number, score: number) => {
    const newCompleted = completedEnvironments.includes(envId)
      ? completedEnvironments
      : [...completedEnvironments, envId];

    setCompletedEnvironments(newCompleted);

    if (user) {
      try {
        const updatedUser = await updatePontuacao(user.id, score);
        setSavedUser(updatedUser as unknown as AppUser);
        setUser(updatedUser as unknown as AppUser);
      } catch (err) {
        console.error('Failed to update score:', err);
        setTotalScore(prev => prev + score);
      }
    }

    // Se concluiu os 3 ambientes, dispara o final da história
    if (newCompleted.length >= 3) {
      navigate('/ending');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  const AdminRoute = ({ children }: { children: JSX.Element }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/menu" replace />;
    return children;
  };

  const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
    if (user) {
      const userRole = String(user.role).toUpperCase();
      if (['SUPER_ADMIN', 'ADMIN', 'CAMPUS_ADMIN', '1', '2'].includes(userRole)) {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to="/menu" replace />;
    }
    return children;
  };

  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/menu" : "/login"} replace />} />
        
        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginScreen
              onLogin={() => {}}
              onRegister={() => navigate('/register')}
              onForgotPassword={() => navigate('/forgotPassword')}
              signIn={signIn}
            />
          </PublicOnlyRoute>
        } />

        <Route path="/forgotPassword" element={
          <PublicOnlyRoute>
            <ForgotPasswordScreen
              onBack={() => navigate(-1)}
              forgotPassword={forgotPassword}
            />
          </PublicOnlyRoute>
        } />

        <Route path="/nova-senha" element={
          <PublicOnlyRoute>
            <NewPasswordScreen
              token={urlToken}
              onSuccess={() => navigate('/login')}
              resetPassword={resetPassword}
            />
          </PublicOnlyRoute>
        } />

        <Route path="/verificar-email" element={
          <PublicOnlyRoute>
            <EmailConfirmScreen
              token={urlToken}
              onGoToLogin={() => navigate('/login')}
              confirmEmail={async (token) => {
                try {
                  await verifyEmail(token);
                  return { error: null };
                } catch (err: unknown) {
                  return { error: err };
                }
              }}
            />
          </PublicOnlyRoute>
        } />
      
        <Route path="/menu" element={
          <ProtectedRoute>
            <UserMenuScreen
              onStart={() => navigate('/cutscene')}
              onRanking={() => navigate('/ranking')}
              onProfile={() => navigate('/profile')}
              onBack={handleLogout}
            />
          </ProtectedRoute>
        } />
      
        <Route path="/ranking" element={
          <ProtectedRoute>
            <RankingScreen
              onBack={() => navigate(-1)}
              cursoId={user?.cursoid || 1}
            />
          </ProtectedRoute>
        } />
      
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileScreen
              onBack={() => navigate(-1)}
              playerName={playerName}
              playerAvatar={playerAvatar}
              totalScore={totalScore}
              completedEnvironments={completedEnvironments}
              onUpdateProfile={handleUpdateProfile}
              user={user}
            />
          </ProtectedRoute>
        } />
      
        <Route path="/register" element={
          <PublicOnlyRoute>
            <RegisterScreen
              onRegister={() => navigate('/login')}
              onBackToLogin={() => navigate('/login')}
              signUp={signUp}
            />
          </PublicOnlyRoute>
        } />
      
        <Route path="/cutscene" element={
          <ProtectedRoute>
            <VisualNovelGame
              onBack={() => navigate('/menu')}
              onCutsceneEnd={() => navigate('/environmentSelection')}
            />
          </ProtectedRoute>
        } />
      
        <Route path="/environmentSelection" element={
          <ProtectedRoute>
            <EnvironmentSelectionScreen
              onSelectEnvironment={(envId: 1 | 2 | 3) => {
                setCurrentEnvironment(envId);
                navigate('/environment');
              }}
              onBack={() => navigate('/menu')}
              completedEnvironments={completedEnvironments}
              isAdmin={isAdmin}
            />
          </ProtectedRoute>
        } />
      
        <Route path="/environment" element={
          <ProtectedRoute>
            <EnvironmentScreen
              environmentId={currentEnvironment}
              onBackToPatio={() => navigate('/environmentSelection')}
              onProfile={() => navigate('/profile')}
              onEnvironmentComplete={handleEnvironmentComplete}
            />
          </ProtectedRoute>
        } />

        <Route path="/ending" element={
          <ProtectedRoute>
            <EndingScreen
              onBack={() => navigate('/menu')}
              onEndingComplete={() => navigate('/menu')}
            />
          </ProtectedRoute>
        } />
      
        <Route path="/adminLogin" element={
          <PublicOnlyRoute>
            <AdminLoginScreen
              onLogin={() => navigate('/questionAdmin')}
              onBack={() => navigate('/login')}
              signIn={signIn}
              checkAdminRole={checkAdminRole}
            />
          </PublicOnlyRoute>
        } />
      
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminHubScreen onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        <Route path="/questionAdmin" element={
          <ProtectedRoute>
            <QuestionAdminScreen
              onBack={() => navigate('/admin')}
            />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={
          <AdminRoute>
            <ManageUsersPage />
          </AdminRoute>
        } />

        <Route path="/admin/preview-ending" element={
          <AdminRoute>
            <EndingScreen
              onBack={() => navigate('/admin')}
              onEndingComplete={() => navigate('/admin')}
            />
          </AdminRoute>
        } />
      
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default GameManager;

