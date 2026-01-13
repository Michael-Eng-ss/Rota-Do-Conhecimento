import { useState } from 'react';
import GameBackground from '@/components/Game/GameBackground';
import GameHeader from '@/components/Game/GameHeader';
import GameInput from '@/components/Game/GameInput';
import GameButton from '@/components/Game/GameButton';

interface LoginScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onForgotPassword: () => void;
}

const LoginScreen = ({ onLogin, onRegister, onForgotPassword }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 md:pt-12 px-4">
        <GameHeader />
        
        <div className="mt-8 md:mt-12 w-full max-w-md space-y-4">
          <GameInput
            placeholder="jogador@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <GameInput
            placeholder="************"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex flex-col items-center gap-3 pt-4">
            <GameButton onClick={onLogin} className="w-48">
              Login
            </GameButton>
            
            <GameButton onClick={onRegister} variant="secondary" className="w-48">
              Cadastrar
            </GameButton>
          </div>

          <div className="text-center pt-4">
            <GameButton onClick={onForgotPassword} variant="link">
              Esqueceu a senha ?
            </GameButton>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default LoginScreen;
