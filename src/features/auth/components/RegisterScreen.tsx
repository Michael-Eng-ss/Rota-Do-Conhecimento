import { useState } from 'react';
import GameBackground from '@/shared/components/GameBackground';
import GameHeader from '@/shared/components/GameHeader';
import GameInput from '@/shared/components/GameInput';
import GameButton from '@/shared/components/GameButton';
import GameFormCard from '@/shared/components/GameFormCard';
import { useToast } from '@/hooks/use-toast';

interface RegisterScreenProps {
  onRegister: () => void;
  onBackToLogin: () => void;
  signUp: (email: string, password: string, displayName: string) => Promise<{ data: any; error: any }>;
}

const RegisterScreen = ({ onRegister, onBackToLogin, signUp }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'A senha deve ter pelo menos 6 caracteres', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      toast({ title: 'Erro ao cadastrar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Conta criada!', description: 'Verifique seu email para confirmar o cadastro.' });
      onRegister();
    }
  };

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

              <div className="flex flex-col items-center gap-3 pt-4">
                <GameButton onClick={handleRegister} className="w-48" disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </GameButton>
              </div>

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
