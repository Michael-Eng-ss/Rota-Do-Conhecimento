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
        
        <div className="mt-8 md:mt-12 w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.12)] border border-gray-200/60">
            <div className="space-y-4">
              <GameInput
                label="E-mail"
                placeholder="jogador@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <GameInput
                label="Senha"
                placeholder="••••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-center gap-3 pt-6">
              <GameButton onClick={handleLogin} className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </GameButton>
              
              <GameButton onClick={onRegister} variant="secondary" className="w-full">
                Cadastrar
              </GameButton>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-gray-200 mt-6">
              <GameButton onClick={onForgotPassword} variant="link" className="text-gray-600 text-sm no-underline hover:text-gray-800">
                Esqueceu a senha?
              </GameButton>
              
              {onAdminLogin && (
                <GameButton onClick={onAdminLogin} variant="link" className="text-gray-400 text-xs no-underline hover:text-gray-600">
                  Área Admin
                </GameButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default LoginScreen;
