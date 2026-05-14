import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Tela de transição/loading que redireciona o jogador para a sala de jogo
 * ou para a página de criação de personagem, dependendo da lógica da rota.
 */
export const GamePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToSala = () => {
      // Aqui você pode adicionar lógica para escolher para onde redirecionar:
      // - Se o usuário já tem personagem → Sala
      // - Se não tem personagem → Criação de personagem
      const userHasCharacter = false; // substitua por verificação real

      if (userHasCharacter) {
        navigate('/sala', { replace: true });
      } else {
        navigate('/criar-personagem', { replace: true });
      }
    };

    // Redireciona após um breve delay (opcional)
    const timer = setTimeout(redirectToSala, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Rota do Conhecimento</h1>
        <p className="text-xl text-slate-400">Preparando sua jornada...</p>
      </div>
    </div>
  );
};
