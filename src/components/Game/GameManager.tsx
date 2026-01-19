import { useState } from 'react';
import LoginScreen from '@/components/Screens/LoginScreen';
import UserMenuScreen from '@/components/Screens/UserMenuScreen';
import RegisterScreen from '@/components/Screens/RegisterScreen';
import ResetPasswordScreen from '@/components/Screens/ResetPasswordScreen';
import DifficultyScreen from '@/components/Screens/DifficultyScreen';
import RankingScreen from '@/components/Screens/RankingScreen';
import VisualNovelGame from '@/components/VisualNovel/VisualNovelGame';
import EnvironmentScreen from '@/components/Environment/EnvironmentScreen';
import EnvironmentSelectionScreen from '@/components/Environment/EnvironmentSelectionScreen';

type GameScreen = 
  | 'login' 
  | 'menu' 
  | 'register' 
  | 'resetPassword' 
  | 'difficulty' 
  | 'ranking'
  | 'cutscene'
  | 'environmentSelection'
  | 'environment';

const GameManager = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('login');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [currentEnvironment, setCurrentEnvironment] = useState<1 | 2 | 3 | 4>(1);
  const [completedEnvironments, setCompletedEnvironments] = useState<number[]>([]);

  const handleSelectDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
    setCurrentScreen('cutscene');
  };

  const handleCutsceneEnd = () => {
    // Após a cutscene 12, vai para a tela de seleção de ambiente
    setCurrentScreen('environmentSelection');
  };

  const handleSelectEnvironment = (envId: 1 | 2 | 3 | 4) => {
    setCurrentEnvironment(envId);
    setCurrentScreen('environment');
  };

  const handleProfile = () => {
    console.log('Perfil - a ser implementado');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={() => setCurrentScreen('menu')}
            onRegister={() => setCurrentScreen('register')}
            onForgotPassword={() => setCurrentScreen('resetPassword')}
          />
        );
      
      case 'menu':
        return (
          <UserMenuScreen
            onStart={() => setCurrentScreen('difficulty')}
            onRanking={() => setCurrentScreen('ranking')}
            onProfile={() => console.log('Perfil - a ser implementado')}
            onBack={() => setCurrentScreen('login')}
          />
        );
      
      case 'ranking':
        return (
          <RankingScreen
            onBack={() => setCurrentScreen('menu')}
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
      
      case 'difficulty':
        return (
          <DifficultyScreen
            onSelectDifficulty={handleSelectDifficulty}
            onBack={() => setCurrentScreen('menu')}
          />
        );
      
      case 'cutscene':
        return (
          <VisualNovelGame
            onBack={() => setCurrentScreen('difficulty')}
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
            onProfile={handleProfile}
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
