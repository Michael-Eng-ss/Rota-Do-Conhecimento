import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { setSavedUser, type AppUser } from '@/lib/api-client';
import { UsuarioController } from '@/controllers';
import LoginScreen from '@/features/auth/components/LoginScreen';
import UserMenuScreen from '@/features/profile/components/UserMenuScreen';
import RegisterScreen from '@/features/auth/components/RegisterScreen';
import ResetPasswordScreen from '@/features/auth/components/ResetPasswordScreen';
import RankingScreen from '@/features/profile/components/RankingScreen';
import ProfileScreen from '@/features/profile/components/ProfileScreen';
import AdminLoginScreen from '@/features/auth/components/AdminLoginScreen';
import QuestionAdminScreen from '@/features/admin/components/QuestionAdminScreen';
import VisualNovelGame from '@/features/game/components/VisualNovel/VisualNovelGame';
import EnvironmentScreen from '@/features/game/components/Environment/EnvironmentScreen';
import EnvironmentSelectionScreen from '@/features/game/components/Environment/EnvironmentSelectionScreen';

const usuarioCtrl = new UsuarioController();

type GameScreen = 
  | 'login' 
  | 'menu' 
  | 'register' 
  | 'resetPassword' 
  | 'ranking'
  | 'profile'
  | 'cutscene'
  | 'environmentSelection'
  | 'environment'
  | 'adminLogin'
  | 'questionAdmin';

const GameManager = () => {
  const { user, setUser, isAdmin, signIn, signUp, signOut, checkAdminRole } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('login');
  const [previousScreen, setPreviousScreen] = useState<GameScreen>('menu');
  const [currentEnvironment, setCurrentEnvironment] = useState<1 | 2 | 3>(1);
  const [completedEnvironments, setCompletedEnvironments] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState<string>('Jogador');
  const [playerAvatar, setPlayerAvatar] = useState<string>('clara');
  const [totalScore, setTotalScore] = useState<number>(0);

  // Load profile from user data when logged in
  useEffect(() => {
    if (!user) return;
    setPlayerName(user.nome);
    setTotalScore(user.pontuacao);
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
        const updatedEntity = await usuarioCtrl.updateScore(user.id, score);
        const updatedUser = updatedEntity.toApi() as unknown as AppUser;
        setSavedUser(updatedUser);
        setUser(updatedUser);
      } catch (err) {
        console.error('Failed to update score:', err);
        setTotalScore(prev => prev + score);
      }
    }
  };

  const handleStartGame = () => {
    setCurrentScreen('cutscene');
  };

  const handleCutsceneEnd = () => {
    setCurrentScreen('environmentSelection');
  };

  const handleSelectEnvironment = (envId: 1 | 2 | 3) => {
    setCurrentEnvironment(envId);
    setCurrentScreen('environment');
  };

  const handleProfile = (fromScreen: GameScreen) => {
    setPreviousScreen(fromScreen);
    setCurrentScreen('profile');
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={() => setCurrentScreen('menu')}
            onRegister={() => setCurrentScreen('register')}
            onForgotPassword={() => setCurrentScreen('resetPassword')}
            onAdminLogin={() => setCurrentScreen('adminLogin')}
            signIn={signIn}
          />
        );
      
      case 'menu':
        return (
          <UserMenuScreen
            onStart={handleStartGame}
            onRanking={() => setCurrentScreen('ranking')}
            onProfile={() => handleProfile('menu')}
            onBack={handleLogout}
          />
        );
      
      case 'ranking':
        return (
          <RankingScreen
            onBack={() => setCurrentScreen('menu')}
            cursoId={user?.cursoid || 1}
          />
        );
      
      case 'profile':
        return (
          <ProfileScreen
            onBack={() => setCurrentScreen(previousScreen)}
            playerName={playerName}
            playerAvatar={playerAvatar}
            totalScore={totalScore}
            completedEnvironments={completedEnvironments}
            onUpdateProfile={handleUpdateProfile}
            user={user}
          />
        );
      
      case 'register':
        return (
          <RegisterScreen
            onRegister={() => setCurrentScreen('login')}
            onBackToLogin={() => setCurrentScreen('login')}
            signUp={signUp}
          />
        );
      
      case 'resetPassword':
        return (
          <ResetPasswordScreen
            onReset={() => setCurrentScreen('login')}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );
      
      case 'cutscene':
        return (
          <VisualNovelGame
            onBack={() => setCurrentScreen('menu')}
            onCutsceneEnd={handleCutsceneEnd}
          />
        );
      
      case 'environmentSelection':
        return (
          <EnvironmentSelectionScreen
            onSelectEnvironment={handleSelectEnvironment}
            onBack={() => setCurrentScreen('menu')}
            completedEnvironments={completedEnvironments}
            isAdmin={isAdmin}
          />
        );
      
      case 'environment':
        return (
          <EnvironmentScreen
            environmentId={currentEnvironment}
            onBackToPatio={() => setCurrentScreen('environmentSelection')}
            onProfile={() => handleProfile('environment')}
            onEnvironmentComplete={handleEnvironmentComplete}
          />
        );
      
      case 'adminLogin':
        return (
          <AdminLoginScreen
            onLogin={() => setCurrentScreen('questionAdmin')}
            onBack={() => setCurrentScreen('login')}
            signIn={signIn}
            checkAdminRole={checkAdminRole}
          />
        );
      
      case 'questionAdmin':
        return (
          <QuestionAdminScreen
            onBack={() => {
              handleLogout();
              setCurrentScreen('login');
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen">
      {renderScreen()}
    </div>
  );
};

export default GameManager;
