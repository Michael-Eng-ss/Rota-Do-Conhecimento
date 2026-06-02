import { useState, useEffect } from 'react';
import GameBackground from '@/shared/components/GameBackground';
import GameHeader from '@/shared/components/GameHeader';
import GameInput from '@/shared/components/GameInput';
import GameButton from '@/shared/components/GameButton';
import GameFormCard from '@/shared/components/GameFormCard';
import { useToast } from '@/hooks/use-toast';

interface NewPasswordScreenProps {
  token: string;
  onSuccess: () => void;
  resetPassword: (token: string, novaSenha: string) => Promise<{ error: { message: string } | null }>;
}

const NewPasswordScreen = ({ token, onSuccess, resetPassword }: NewPasswordScreenProps) => {
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!token) {
      toast({ title: 'Link inválido', description: 'Token não encontrado na URL.', variant: 'destructive' });
    }
  }, [token, toast]);

  const handleSubmit = async () => {
    if (!senha || !confirmar) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    if (senha !== confirmar) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }
    if (senha.length < 6) {
      toast({ title: 'A senha deve ter pelo menos 6 caracteres', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(token, senha);
    setLoading(false);
    if (error) {
      toast({ title: 'Erro ao redefinir senha', description: error.message, variant: 'destructive' });
    } else {
      setDone(true);
      toast({ title: '✅ Senha redefinida com sucesso!' });
    }
  };

  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 md:pt-12 px-4">
        <GameHeader />

        <div className="mt-6 md:mt-8 w-full">
          <GameFormCard title="Nova Senha" variant="green">
            <div className="space-y-4">
              {!done ? (
                <>
                  <p className="text-white/70 text-sm text-center">
                    Escolha uma nova senha para sua conta.
                  </p>
                  <GameInput
                    label="Nova Senha :"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                  <GameInput
                    label="Confirmar Nova Senha :"
                    type="password"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                  <div className="flex flex-col items-center gap-3 pt-4">
                    <GameButton onClick={handleSubmit} className="w-52" disabled={loading || !token}>
                      {loading ? 'Salvando...' : '🔑 Salvar Nova Senha'}
                    </GameButton>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-4xl">🎉</p>
                  <p className="text-green-400 font-semibold text-lg">Senha redefinida!</p>
                  <p className="text-white/70 text-sm">
                    Sua senha foi atualizada com sucesso. Faça login com a nova senha.
                  </p>
                  <GameButton onClick={onSuccess} className="w-48 mt-4">
                    Ir para Login
                  </GameButton>
                </div>
              )}
            </div>
          </GameFormCard>
        </div>
      </div>
    </GameBackground>
  );
};

export default NewPasswordScreen;
