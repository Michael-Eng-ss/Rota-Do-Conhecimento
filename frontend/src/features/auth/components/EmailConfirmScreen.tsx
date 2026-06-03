import { useEffect, useState } from 'react';
import GameBackground from '@/shared/components/GameBackground';
import GameHeader from '@/shared/components/GameHeader';
import GameButton from '@/shared/components/GameButton';
import GameFormCard from '@/shared/components/GameFormCard';

import type { AuthError } from '@/models/types';

interface EmailConfirmScreenProps {
  token: string;
  onGoToLogin: () => void;
  confirmEmail: (token: string) => Promise<{ error: AuthError | null }>;
}

const EmailConfirmScreen = ({ token, onGoToLogin, confirmEmail }: EmailConfirmScreenProps) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token não encontrado na URL.');
      return;
    }
    confirmEmail(token).then(({ error }) => {
      if (error) {
        setStatus('error');
        setMessage(error.message || 'Link inválido ou expirado.');
      } else {
        setStatus('success');
        setMessage('Seu e-mail foi confirmado com sucesso! Agora você pode fazer login.');
      }
    });
  }, [token, confirmEmail]);

  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-start min-h-screen pt-8 md:pt-12 px-4">
        <GameHeader />

        <div className="mt-6 md:mt-8 w-full">
          <GameFormCard title="Confirmação de E-mail" variant="green">
            <div className="text-center py-6 space-y-4">
              {status === 'loading' && (
                <>
                  <p className="text-4xl animate-spin inline-block">⏳</p>
                  <p className="text-white/70">Validando seu e-mail...</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <p className="text-5xl">✅</p>
                  <p className="text-green-400 font-semibold text-lg">E-mail confirmado!</p>
                  <p className="text-white/70 text-sm">{message}</p>
                  <GameButton onClick={onGoToLogin} className="w-48 mt-2">
                    Fazer Login
                  </GameButton>
                </>
              )}

              {status === 'error' && (
                <>
                  <p className="text-5xl">❌</p>
                  <p className="text-red-400 font-semibold text-lg">Confirmação inválida</p>
                  <p className="text-white/70 text-sm">{message}</p>
                  <GameButton onClick={onGoToLogin} variant="secondary" className="w-48 mt-2">
                    Voltar ao Login
                  </GameButton>
                </>
              )}
            </div>
          </GameFormCard>
        </div>
      </div>
    </GameBackground>
  );
};

export default EmailConfirmScreen;
