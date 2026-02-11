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
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  checkAdminRole: (userId: string) => Promise<void>;
}

const AdminLoginScreen = ({ onLogin, onBack, signIn, checkAdminRole }: AdminLoginScreenProps) => {
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
    const { data, error } = await signIn(email, password);
    if (error) {
      setLoading(false);
      toast({ title: 'Credenciais inválidas', description: error.message, variant: 'destructive' });
      return;
    }

    // Check admin role
    if (data?.user) {
      await checkAdminRole(data.user.id);
      // Re-check via direct query
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      setLoading(false);
      if (roleData) {
        toast({ title: 'Login realizado!', description: 'Bem-vindo, administrador.' });
        onLogin();
      } else {
        toast({ title: 'Acesso negado', description: 'Você não tem permissão de administrador.', variant: 'destructive' });
      }
    } else {
      setLoading(false);
      toast({ title: 'Erro ao verificar permissões', variant: 'destructive' });
    }
  };

  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 md:pt-12 px-4">
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
            placeholder="admin@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <GameInput
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex flex-col items-center gap-3 pt-4">
            <GameButton onClick={handleLogin} className="w-48" disabled={loading}>
              {loading ? 'Verificando...' : 'Entrar'}
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
