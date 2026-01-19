import { ArrowLeft, Trophy, Star, Target, CheckCircle, Lock } from 'lucide-react';
import claraImage from '@/assets/characters/clara.png';

// Backgrounds para preview dos ambientes
import auditorioImage from '@/assets/backgrounds/auditorio.png';
import bibliotecaImage from '@/assets/backgrounds/biblioteca.png';
import laboratorioImage from '@/assets/backgrounds/laboratorio.png';
import salaMatematicaImage from '@/assets/backgrounds/sala-matematica.png';

interface EnvironmentProgress {
  id: number;
  name: string;
  subject: string;
  background: string;
  completed: boolean;
  score: number;
  maxScore: number;
}

interface ProfileScreenProps {
  onBack: () => void;
  playerName?: string;
  totalScore?: number;
  completedEnvironments?: number[];
}

const ProfileScreen = ({ 
  onBack, 
  playerName = "Jogador",
  totalScore = 0,
  completedEnvironments = []
}: ProfileScreenProps) => {

  const environments: EnvironmentProgress[] = [
    {
      id: 1,
      name: 'Auditório',
      subject: 'Português',
      background: auditorioImage,
      completed: completedEnvironments.includes(1),
      score: completedEnvironments.includes(1) ? 850 : 0,
      maxScore: 1000,
    },
    {
      id: 2,
      name: 'Biblioteca',
      subject: 'História',
      background: bibliotecaImage,
      completed: completedEnvironments.includes(2),
      score: completedEnvironments.includes(2) ? 920 : 0,
      maxScore: 1000,
    },
    {
      id: 3,
      name: 'Laboratório',
      subject: 'Ciências',
      background: laboratorioImage,
      completed: completedEnvironments.includes(3),
      score: completedEnvironments.includes(3) ? 780 : 0,
      maxScore: 1000,
    },
    {
      id: 4,
      name: 'Sala de Matemática',
      subject: 'Matemática',
      background: salaMatematicaImage,
      completed: completedEnvironments.includes(4),
      score: completedEnvironments.includes(4) ? 900 : 0,
      maxScore: 1000,
    },
  ];

  const totalCompleted = environments.filter(e => e.completed).length;
  const overallProgress = (totalCompleted / environments.length) * 100;
  const calculatedTotalScore = environments.reduce((acc, env) => acc + env.score, 0);

  // Determinar medalha baseada no progresso
  const getMedal = () => {
    if (totalCompleted === 4) return { icon: '🏆', label: 'Mestre do Conhecimento', color: 'text-yellow-400' };
    if (totalCompleted >= 3) return { icon: '🥇', label: 'Especialista', color: 'text-yellow-500' };
    if (totalCompleted >= 2) return { icon: '🥈', label: 'Estudante Dedicado', color: 'text-gray-300' };
    if (totalCompleted >= 1) return { icon: '🥉', label: 'Iniciante', color: 'text-amber-600' };
    return { icon: '📚', label: 'Novato', color: 'text-blue-400' };
  };

  const medal = getMedal();

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-8">
        {/* Card do Perfil */}
        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-400 shadow-xl shadow-blue-500/30">
                <img
                  src={claraImage}
                  alt="Avatar do jogador"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Medalha */}
              <div className="absolute -bottom-2 -right-2 text-3xl">
                {medal.icon}
              </div>
            </div>

            {/* Informações */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">{playerName}</h2>
              <p className={`${medal.color} font-medium mb-4`}>{medal.label}</p>
              
              {/* Stats rápidas */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-xs text-white/60">Pontuação</p>
                    <p className="text-lg font-bold text-white">{calculatedTotalScore || totalScore}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
                  <Target className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-xs text-white/60">Progresso</p>
                    <p className="text-lg font-bold text-white">{totalCompleted}/4</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-white/60">Média</p>
                    <p className="text-lg font-bold text-white">
                      {totalCompleted > 0 ? Math.round(calculatedTotalScore / totalCompleted) : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progresso geral */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Progresso Geral</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <div className="h-3 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Título da seção */}
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Progresso por Ambiente
        </h3>

        {/* Grid de Ambientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {environments.map((env) => (
            <div
              key={env.id}
              className={`
                relative rounded-xl overflow-hidden border transition-all
                ${env.completed 
                  ? 'border-green-500/50 bg-green-900/20' 
                  : 'border-white/10 bg-white/5'
                }
              `}
            >
              {/* Background blur */}
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: `url(${env.background})` }}
              />
              
              <div className="relative p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-blue-600/80 text-white px-2 py-0.5 rounded">
                        {env.id}/4
                      </span>
                      {env.completed && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      {!env.completed && (
                        <Lock className="w-4 h-4 text-white/40" />
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white mt-1">{env.name}</h4>
                    <p className="text-sm text-yellow-300">{env.subject}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{env.score}</p>
                    <p className="text-xs text-white/60">/ {env.maxScore} pts</p>
                  </div>
                </div>

                {/* Barra de progresso do ambiente */}
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      env.completed 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                        : 'bg-gray-600'
                    }`}
                    style={{ width: `${(env.score / env.maxScore) * 100}%` }}
                  />
                </div>

                {/* Status */}
                <p className={`text-xs mt-2 ${env.completed ? 'text-green-400' : 'text-white/50'}`}>
                  {env.completed ? '✓ Concluído' : 'Não iniciado'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Estatísticas adicionais */}
        <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Estatísticas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-400">{totalCompleted}</p>
              <p className="text-xs text-white/60">Ambientes Completos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{4 - totalCompleted}</p>
              <p className="text-xs text-white/60">Ambientes Restantes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{calculatedTotalScore}</p>
              <p className="text-xs text-white/60">Pontos Totais</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {totalCompleted > 0 ? Math.round((calculatedTotalScore / (totalCompleted * 1000)) * 100) : 0}%
              </p>
              <p className="text-xs text-white/60">Taxa de Acerto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
