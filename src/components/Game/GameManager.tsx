import { useState } from 'react';
import LoginScreen from '@/components/Screens/LoginScreen';
import UserMenuScreen from '@/components/Screens/UserMenuScreen';
import RegisterScreen from '@/components/Screens/RegisterScreen';
import ResetPasswordScreen from '@/components/Screens/ResetPasswordScreen';
import RankingScreen from '@/components/Screens/RankingScreen';
import ProfileScreen from '@/components/Screens/ProfileScreen';
import AdminLoginScreen from '@/components/Screens/AdminLoginScreen';
import QuestionAdminScreen from '@/components/Screens/QuestionAdminScreen';
import VisualNovelGame from '@/components/VisualNovel/VisualNovelGame';
import EnvironmentScreen from '@/components/Environment/EnvironmentScreen';
import EnvironmentSelectionScreen from '@/components/Environment/EnvironmentSelectionScreen';

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
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('login');
  const [previousScreen, setPreviousScreen] = useState<GameScreen>('menu');
  const [currentEnvironment, setCurrentEnvironment] = useState<1 | 2 | 3 | 4>(1);
  const [completedEnvironments, setCompletedEnvironments] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState<string>('Jogador');
  const [playerAvatar, setPlayerAvatar] = useState<string>('clara');
  const [totalScore, setTotalScore] = useState<number>(0);
  const [environmentScores, setEnvironmentScores] = useState<Record<number, number>>({});

  const handleUpdateProfile = (name: string, avatarId: string) => {
    setPlayerName(name);
    setPlayerAvatar(avatarId);
  };

  const handleEnvironmentComplete = (envId: number, score: number) => {
    if (!completedEnvironments.includes(envId)) {
      setCompletedEnvironments(prev => [...prev, envId]);
    }
    setEnvironmentScores(prev => ({ ...prev, [envId]: score }));
    setTotalScore(prev => prev + score);
  };

  const handleStartGame = () => {
    setCurrentScreen('cutscene');
  };

  const handleCutsceneEnd = () => {
    setCurrentScreen('environmentSelection');
  };

  const handleSelectEnvironment = (envId: 1 | 2 | 3 | 4) => {
    setCurrentEnvironment(envId);
    setCurrentScreen('environment');
  };

  const handleProfile = (fromScreen: GameScreen) => {
    setPreviousScreen(fromScreen);
    setCurrentScreen('profile');
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
          />
        );
      
      case 'menu':
        return (
          <UserMenuScreen
            onStart={handleStartGame}
            onRanking={() => setCurrentScreen('ranking')}
            onProfile={() => handleProfile('menu')}
            onBack={() => setCurrentScreen('login')}
          />
        );
      
      case 'ranking':
        return (
          <RankingScreen
            onBack={() => setCurrentScreen('menu')}
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
          />
        );
      
      case 'register':
        return (
          <RegisterScreen
            onRegister={() => setCurrentScreen('login')}
            onBackToLogin={() => setCurrentScreen('login')}
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
          />
        );
      
      case 'questionAdmin':
        return (
          <QuestionAdminScreen
            onBack={() => setCurrentScreen('adminLogin')}
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
