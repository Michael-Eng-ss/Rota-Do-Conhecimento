import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        Rota do Conhecimento
      </h1>
      <p className="text-xl text-slate-300 mb-8 text-center max-w-2xl">
        Bem-vindo ao jogo universitário que testará suas habilidades e conhecimentos.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/login" 
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-transform hover:scale-105"
        >
          Acessar Plataforma
        </Link>
      </div>
    </div>
  );
};
