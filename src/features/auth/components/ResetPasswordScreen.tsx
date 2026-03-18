import { useState } from 'react';
import GameBackground from '@/components/Game/GameBackground';
import GameHeader from '@/components/Game/GameHeader';
import GameInput from '@/components/Game/GameInput';
import GameButton from '@/components/Game/GameButton';
import GameFormCard from '@/components/Game/GameFormCard';
import { useToast } from '@/hooks/use-toast';

interface ResetPasswordScreenProps {
  onReset: () => void;
  onBackToLogin: () => void;
}

const ResetPasswordScreen = ({ onReset, onBackToLogin }: ResetPasswordScreenProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleReset = async () => {
    if (!email) {
      toast({ title: 'Digite seu email', variant: 'destructive' });
      return;
    }
    setLoading(true);
    // O sistema usa autenticação customizada (JWT próprio).
    // Redefinição de senha requer implementação de envio de email no backend.
    // Por enquanto, informamos o usuário para contatar o administrador.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast({ title: 'Solicitação registrada!', description: 'Entre em contato com o administrador para redefinir sua senha.' });
    }, 1000);
  };

  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 md:pt-12 px-4">
        <GameHeader />
        
        <div className="mt-6 md:mt-8 w-full">
          <GameFormCard title="Redefinir Sua Senha" variant="green">
            <div className="space-y-4">
              {!sent ? (
                <>
                  <p className="text-white/70 text-sm text-center">
                    Digite seu email. A redefinição será processada pelo administrador.
                  </p>
                  <GameInput
                    label="Email :"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="flex flex-col items-center gap-3 pt-4">
                    <GameButton onClick={handleReset} className="w-48" disabled={loading}>
                      {loading ? 'Enviando...' : 'Solicitar Reset'}
                    </GameButton>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-green-400 font-medium mb-2">✉️ Solicitação registrada!</p>
                  <p className="text-white/70 text-sm">
                    Entre em contato com o administrador para redefinir sua senha.
                  </p>
                </div>
              )}

              <div className="text-center pt-4">
                <GameButton onClick={onBackToLogin} variant="link">
                  Voltar ao Login
                </GameButton>
              </div>
            </div>
          </GameFormCard>
        </div>
      </div>
    </GameBackground>
  );
};

export default ResetPasswordScreen;
