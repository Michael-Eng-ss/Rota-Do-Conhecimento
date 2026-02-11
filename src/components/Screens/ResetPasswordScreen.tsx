import { useState } from 'react';
import GameBackground from '@/components/Game/GameBackground';
import GameHeader from '@/components/Game/GameHeader';
import GameInput from '@/components/Game/GameInput';
import GameButton from '@/components/Game/GameButton';
import GameFormCard from '@/components/Game/GameFormCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      setSent(true);
      toast({ title: 'Email enviado!', description: 'Verifique sua caixa de entrada.' });
    }
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
                    Digite seu email para receber o link de redefinição de senha.
                  </p>
                  <GameInput
                    label="Email :"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="flex flex-col items-center gap-3 pt-4">
                    <GameButton onClick={handleReset} className="w-48" disabled={loading}>
                      {loading ? 'Enviando...' : 'Enviar Link'}
                    </GameButton>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-green-400 font-medium mb-2">✉️ Email enviado!</p>
                  <p className="text-white/70 text-sm">
                    Verifique sua caixa de entrada e siga as instruções.
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
