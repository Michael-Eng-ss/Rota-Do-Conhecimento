import { useState } from 'react';
import GameBackground from '@/components/Game/GameBackground';
import GameHeader from '@/components/Game/GameHeader';
import GameInput from '@/components/Game/GameInput';
import GameButton from '@/components/Game/GameButton';
import GameFormCard from '@/components/Game/GameFormCard';

interface RegisterScreenProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

const RegisterScreen = ({ onRegister, onBackToLogin }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 md:pt-12 px-4">
        <GameHeader />
        
        <div className="mt-6 md:mt-8 w-full">
          <GameFormCard title="Cadastre Sua Conta">
            <div className="space-y-4">
              <GameInput
                label="Nome Completo :"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              
              <GameInput
                label="Email :"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <GameInput
                label="Digite Sua Senha :"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <GameInput
                label="Confirme Sua Senha :"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="text-center pt-4">
                <GameButton onClick={onBackToLogin} variant="link">
                  Já Possui conta...
                </GameButton>
              </div>
            </div>
          </GameFormCard>
        </div>
      </div>
    </GameBackground>
  );
};

export default RegisterScreen;
