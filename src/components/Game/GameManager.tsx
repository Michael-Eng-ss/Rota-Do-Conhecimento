import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  const { user, isAdmin, signIn, signUp, signOut, resetPassword, checkAdminRole } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('login');
  const [previousScreen, setPreviousScreen] = useState<GameScreen>('menu');
  const [currentEnvironment, setCurrentEnvironment] = useState<1 | 2 | 3 | 4>(1);
  const [completedEnvironments, setCompletedEnvironments] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState<string>('Jogador');
  const [playerAvatar, setPlayerAvatar] = useState<string>('clara');
  const [totalScore, setTotalScore] = useState<number>(0);
  const [environmentScores, setEnvironmentScores] = useState<Record<number, number>>({});

  // Load profile from DB when user logs in
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, avatar_id, total_score, completed_environments')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setPlayerName(data.display_name);
        setPlayerAvatar(data.avatar_id);
        setTotalScore(data.total_score);
        setCompletedEnvironments(data.completed_environments || []);
      }
    };
    loadProfile();
  }, [user]);

  const handleUpdateProfile = (name: string, avatarId: string) => {
    setPlayerName(name);
    setPlayerAvatar(avatarId);
  };

  const handleEnvironmentComplete = async (envId: number, score: number) => {
    const newCompleted = completedEnvironments.includes(envId)
      ? completedEnvironments
      : [...completedEnvironments, envId];
    const newScore = totalScore + score;

    setCompletedEnvironments(newCompleted);
    setEnvironmentScores(prev => ({ ...prev, [envId]: score }));
    setTotalScore(newScore);

    // Persist to database
    if (user) {
      await supabase
        .from('profiles')
        .update({
          total_score: newScore,
          completed_environments: newCompleted,
        })
        .eq('user_id', user.id);
    }
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
