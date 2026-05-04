import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { setSavedUser, updateUserScore as apiUpdateScore, type AppUser } from '@/lib/api-client';
import LoginScreen from '@/features/auth/components/LoginScreen';
import UserMenuScreen from '@/features/profile/components/UserMenuScreen';
import RegisterScreen from '@/features/auth/components/RegisterScreen';
import RankingScreen from '@/features/profile/components/RankingScreen';
import ProfileScreen from '@/features/profile/components/ProfileScreen';
import AdminLoginScreen from '@/features/auth/components/AdminLoginScreen';
import QuestionAdminScreen from '@/features/admin/components/QuestionAdminScreen';
import VisualNovelGame from '@/features/game/components/VisualNovel/VisualNovelGame';
import EnvironmentScreen from '@/features/game/components/Environment/EnvironmentScreen';
import EnvironmentSelectionScreen from '@/features/game/components/Environment/EnvironmentSelectionScreen';
import EndingScreen from '@/features/game/components/Ending/EndingScreen';
import ForgotPasswordScreen from '@/features/auth/components/ForgotPasswordScreen';
import NewPasswordScreen from '@/features/auth/components/NewPasswordScreen';
import NotFound from '@/pages/NotFound';

const GameManager = () => {
  const { user, setUser, isAdmin, signIn, signUp, signOut, checkAdminRole, forgotPassword, resetPassword } = useAuth();
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
    if (token && path.includes('nova-senha')) {
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
        const updatedUser = await apiUpdateScore(user.id, score);
        setSavedUser(updatedUser);
        setUser(updatedUser);
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
    await signOut();
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={
          <LoginScreen
            onLogin={() => navigate('/menu')}
            onRegister={() => navigate('/register')}
            onForgotPassword={() => navigate('/forgotPassword')}
            onAdminLogin={() => navigate('/adminLogin')}
            signIn={signIn}
          />
        } />

        <Route path="/forgotPassword" element={
          <ForgotPasswordScreen
            onBack={() => navigate(-1)}
            forgotPassword={forgotPassword}
          />
        } />

        <Route path="/nova-senha" element={
          <NewPasswordScreen
            token={urlToken}
            onSuccess={() => navigate('/login')}
            resetPassword={resetPassword}
          />
        } />
      
        <Route path="/menu" element={
          <UserMenuScreen
            onStart={() => navigate('/cutscene')}
            onRanking={() => navigate('/ranking')}
            onProfile={() => navigate('/profile')}
            onBack={handleLogout}
          />
        } />
      
        <Route path="/ranking" element={
          <RankingScreen
            onBack={() => navigate(-1)}
            cursoId={user?.cursoid || 1}
          />
        } />
      
        <Route path="/profile" element={
          <ProfileScreen
            onBack={() => navigate(-1)}
            playerName={playerName}
            playerAvatar={playerAvatar}
            totalScore={totalScore}
            completedEnvironments={completedEnvironments}
            onUpdateProfile={handleUpdateProfile}
            user={user}
          />
        } />
      
        <Route path="/register" element={
          <RegisterScreen
            onRegister={() => navigate('/login')}
            onBackToLogin={() => navigate(-1)}
            signUp={signUp}
          />
        } />
      
        <Route path="/cutscene" element={
          <VisualNovelGame
            onBack={() => navigate('/menu')}
            onCutsceneEnd={() => navigate('/environmentSelection')}
          />
        } />
      
        <Route path="/environmentSelection" element={
          <EnvironmentSelectionScreen
            onSelectEnvironment={(envId: 1 | 2 | 3) => {
              setCurrentEnvironment(envId);
              navigate('/environment');
            }}
            onBack={() => navigate('/menu')}
            completedEnvironments={completedEnvironments}
            isAdmin={isAdmin}
          />
        } />
      
        <Route path="/environment" element={
          <EnvironmentScreen
            environmentId={currentEnvironment}
            onBackToPatio={() => navigate('/environmentSelection')}
            onProfile={() => navigate('/profile')}
            onEnvironmentComplete={handleEnvironmentComplete}
          />
        } />

        <Route path="/ending" element={
          <EndingScreen
            onBack={() => navigate('/menu')}
            onEndingComplete={() => navigate('/menu')}
          />
        } />
      
        <Route path="/adminLogin" element={
          <AdminLoginScreen
            onLogin={() => navigate('/questionAdmin')}
            onBack={() => navigate('/login')}
            signIn={signIn}
            checkAdminRole={checkAdminRole}
          />
        } />
      
        <Route path="/questionAdmin" element={
          <QuestionAdminScreen
            onBack={() => {
              handleLogout();
              navigate('/login');
            }}
          />
        } />
      
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default GameManager;

