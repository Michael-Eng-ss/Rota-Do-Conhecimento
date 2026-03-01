import { useState } from 'react';
import GameBackground from '@/components/Game/GameBackground';
import GameHeader from '@/components/Game/GameHeader';
import GameInput from '@/components/Game/GameInput';
import GameButton from '@/components/Game/GameButton';
import { useToast } from '@/hooks/use-toast';

interface LoginScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onForgotPassword: () => void;
  onAdminLogin?: () => void;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
}

const LoginScreen = ({ onLogin, onRegister, onForgotPassword, onAdminLogin, signIn }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: 'Erro ao entrar', description: error.message, variant: 'destructive' });
    } else {
      onLogin();
    }
  };

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
            <GameButton onClick={handleLogin} className="w-48" disabled={loading}>
              {loading ? 'Entrando...' : 'Login'}
            </GameButton>
            
            <GameButton onClick={onRegister} variant="secondary" className="w-48">
              Cadastrar
            </GameButton>
          </div>

          <div className="text-center pt-4 space-y-2">
            <GameButton onClick={onForgotPassword} variant="link">
              Esqueceu a senha ?
            </GameButton>
            
            {onAdminLogin && (
              <GameButton onClick={onAdminLogin} variant="link" className="opacity-60 text-sm">
                Área Admin
              </GameButton>
            )}
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default LoginScreen;
