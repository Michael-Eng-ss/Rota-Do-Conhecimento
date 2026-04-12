import { useState } from 'react';
import GameBackground from '@/shared/components/GameBackground';
import GameHeader from '@/shared/components/GameHeader';
import GameInput from '@/shared/components/GameInput';
import GameButton from '@/shared/components/GameButton';
import GameFormCard from '@/shared/components/GameFormCard';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  forgotPassword: (email: string) => Promise<{ error: any }>;
}

const ForgotPasswordScreen = ({ onBack, forgotPassword }: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!email) {
      toast({ title: 'Digite seu e-mail', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await forgotPassword(email);
    setLoading(false);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      setSent(true);
    }
  };

  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 md:pt-12 px-4">
        <GameHeader />

        <div className="mt-6 md:mt-8 w-full">
          <GameFormCard title="Recuperar Senha" variant="green">
            <div className="space-y-4">
              {!sent ? (
                <>
                  <p className="text-white/70 text-sm text-center">
                    Digite seu e-mail cadastrado e enviaremos um link para você criar uma nova senha.
                  </p>
                  <GameInput
                    label="E-mail :"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                  <div className="flex flex-col items-center gap-3 pt-4">
                    <GameButton onClick={handleSubmit} className="w-52" disabled={loading}>
                      {loading ? 'Enviando...' : '📧 Enviar Link'}
                    </GameButton>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-4xl">✉️</p>
                  <p className="text-green-400 font-semibold text-lg">Link enviado!</p>
                  <p className="text-white/70 text-sm">
                    Se o e-mail <strong className="text-white">{email}</strong> estiver cadastrado,
                    você receberá as instruções em breve. Verifique também sua caixa de spam.
                  </p>
                </div>
              )}

              <div className="text-center pt-2">
                <GameButton onClick={onBack} variant="link">
                  ← Voltar ao Login
                </GameButton>
              </div>
            </div>
          </GameFormCard>
        </div>
      </div>
    </GameBackground>
  );
};

export default ForgotPasswordScreen;
