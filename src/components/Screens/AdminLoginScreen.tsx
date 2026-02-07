import { useState } from 'react';
import GameBackground from '@/components/Game/GameBackground';
import GameHeader from '@/components/Game/GameHeader';
import GameInput from '@/components/Game/GameInput';
import GameButton from '@/components/Game/GameButton';
import { Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginScreenProps {
  onLogin: () => void;
  onBack: () => void;
}

// Credenciais temporárias - será substituído por banco de dados
const TEMP_ADMIN_CREDENTIALS = {
  username: 'admin123',
  password: 'admin123',
};

const AdminLoginScreen = ({ onLogin, onBack }: AdminLoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    if (
      username === TEMP_ADMIN_CREDENTIALS.username &&
      password === TEMP_ADMIN_CREDENTIALS.password
    ) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo, administrador.",
      });
      onLogin();
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Usuário ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 md:pt-12 px-4">
        {/* Header customizado para admin */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="bg-amber-500/90 rounded-full p-4 shadow-lg border-4 border-amber-300">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center">
            Área Administrativa
          </h1>
          <p className="text-white/80 text-center max-w-sm">
            Acesso restrito para gerenciamento de perguntas
          </p>
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <GameInput
            placeholder="Usuário admin"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <GameInput
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex flex-col items-center gap-3 pt-4">
            <GameButton onClick={handleLogin} className="w-48">
              Entrar
            </GameButton>
            
            <GameButton onClick={onBack} variant="secondary" className="w-48 flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </GameButton>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default AdminLoginScreen;
