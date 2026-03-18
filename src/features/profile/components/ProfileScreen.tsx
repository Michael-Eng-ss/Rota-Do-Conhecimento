import { useState } from 'react';
import { ArrowLeft, Trophy, Star, Target, CheckCircle, Lock, Pencil, X, Check } from 'lucide-react';
import { environmentConfigs, TOTAL_ENVIRONMENTS, type EnvironmentId } from '@/features/game/config/environments';
import { useToast } from '@/hooks/use-toast';
import { type AppUser } from '@/lib/api-client';
import { apiUpdateUser } from '@/features/profile/services/user.service';

// Avatares disponíveis
import claraImage from '@/assets/characters/clara.png';
import claraAnimadaImage from '@/assets/characters/clara-animada.png';
import claraCelebrandoImage from '@/assets/characters/clara-celebrando.png';
import claraDuvidaImage from '@/assets/characters/clara-duvida.png';
import claraEspantoImage from '@/assets/characters/clara-espanto.png';
import claraMatematicaImage from '@/assets/characters/clara-matematica.png';

// Backgrounds para preview dos ambientes
import auditorioImage from '@/assets/backgrounds/auditorio.png';
import bibliotecaImage from '@/assets/backgrounds/biblioteca.png';
import salaMatematicaImage from '@/assets/backgrounds/sala-matematica.png';

interface AvatarOption {
  id: string;
  image: string;
  label: string;
}

const avatarOptions: AvatarOption[] = [
  { id: 'clara', image: claraImage, label: 'Clara' },
  { id: 'clara-animada', image: claraAnimadaImage, label: 'Clara Animada' },
  { id: 'clara-celebrando', image: claraCelebrandoImage, label: 'Clara Celebrando' },
  { id: 'clara-duvida', image: claraDuvidaImage, label: 'Clara Pensativa' },
  { id: 'clara-espanto', image: claraEspantoImage, label: 'Clara Surpresa' },
  { id: 'clara-matematica', image: claraMatematicaImage, label: 'Clara Matemática' },
];

interface EnvironmentProgress {
  id: number;
  name: string;
  subjects: string;
  background: string;
  completed: boolean;
  score: number;
  maxScore: number;
}

const environmentBackgrounds: Record<number, string> = {
  1: auditorioImage,
  2: bibliotecaImage,
  3: salaMatematicaImage,
};

interface ProfileScreenProps {
  onBack: () => void;
  playerName?: string;
  playerAvatar?: string;
  totalScore?: number;
  completedEnvironments?: number[];
  onUpdateProfile?: (name: string, avatarId: string) => void;
  user?: AppUser | null;
}

const ProfileScreen = ({ 
  onBack, 
  playerName = "Jogador",
  playerAvatar = "clara",
  totalScore = 0,
  completedEnvironments = [],
  onUpdateProfile,
  user
}: ProfileScreenProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playerName);
  const [editAvatar, setEditAvatar] = useState(playerAvatar);
  const { toast } = useToast();

  const effectiveName = playerName;
  const effectiveAvatar = playerAvatar;
  const effectiveScore = totalScore || (user?.pontuacao ?? 0);
  const effectiveCompleted = completedEnvironments;

  const getCurrentAvatar = (avatarId: string) => {
    return avatarOptions.find(a => a.id === avatarId)?.image || claraImage;
  };

  const handleSave = async () => {
    if (!editName.trim()) return;

    // Update in backend
    if (user) {
      try {
        await apiUpdateUser(user.id, { nome: editName.trim() } as any);
      } catch (err: any) {
        toast({ title: 'Erro ao salvar perfil', description: err.message, variant: 'destructive' });
        return;
      }
    }

    if (onUpdateProfile) {
      onUpdateProfile(editName.trim(), editAvatar);
    }
    setIsEditing(false);
    toast({ title: 'Perfil atualizado!' });
  };

  const handleCancel = () => {
    setEditName(effectiveName);
    setEditAvatar(effectiveAvatar);
    setIsEditing(false);
  };

  // Build environment progress from config
  const environments: EnvironmentProgress[] = ([1, 2, 3] as const).map(id => {
    const config = environmentConfigs[id];
    return {
      id,
      name: config.name,
      subjects: config.subjects.join(', '),
      background: environmentBackgrounds[id],
      completed: effectiveCompleted.includes(id),
      score: effectiveCompleted.includes(id) ? Math.round(effectiveScore / Math.max(effectiveCompleted.length, 1)) : 0,
      maxScore: config.maxHealth,
    };
  });

  const totalCompleted = environments.filter(e => e.completed).length;
  const overallProgress = (totalCompleted / environments.length) * 100;

  const getMedal = () => {
    if (totalCompleted === 3) return { icon: '🏆', label: 'Mestre do Conhecimento', color: 'text-yellow-400' };
    if (totalCompleted >= 2) return { icon: '🥇', label: 'Especialista', color: 'text-yellow-500' };
    if (totalCompleted >= 1) return { icon: '🥈', label: 'Estudante Dedicado', color: 'text-gray-300' };
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
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-8">
        {/* Card do Perfil */}
        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-6 mb-6 border border-white/10">
          {!isEditing ? (
            <>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-400 shadow-xl shadow-blue-500/30">
                    <img
                      src={getCurrentAvatar(effectiveAvatar)}
                      alt="Avatar do jogador"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 text-3xl">
                    {medal.icon}
                  </div>
                </div>

                {/* Informações */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">{effectiveName}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      title="Editar perfil"
                    >
                      <Pencil className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                  <p className={`${medal.color} font-medium mb-4`}>{medal.label}</p>
                  
                  {/* Stats rápidas */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-xs text-white/60">Pontuação</p>
                        <p className="text-lg font-bold text-white">{effectiveScore}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
                      <Target className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-white/60">Progresso</p>
                        <p className="text-lg font-bold text-white">{totalCompleted}/3</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
                      <Star className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-xs text-white/60">Ambientes</p>
                        <p className="text-lg font-bold text-white">
                          {effectiveCompleted.map(id => environmentConfigs[id as EnvironmentId]?.name?.[0] || '?').join(', ') || '-'}
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
            </>
          ) : (
            /* Modo Edição */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Editar Perfil</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
                    title="Cancelar"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors"
                    title="Salvar"
                  >
                    <Check className="w-5 h-5 text-green-400" />
                  </button>
                </div>
              </div>

              {/* Campo Nome */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Nome do Jogador</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Digite seu nome..."
                  maxLength={20}
                />
                <p className="text-xs text-white/50 mt-1">{editName.length}/20 caracteres</p>
              </div>

              {/* Seleção de Avatar */}
              <div>
                <label className="block text-sm text-white/70 mb-3">Escolha seu Avatar</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setEditAvatar(avatar.id)}
                      className={`
                        relative rounded-xl overflow-hidden transition-all duration-200
                        ${editAvatar === avatar.id 
                          ? 'ring-4 ring-blue-400 scale-105' 
                          : 'ring-2 ring-white/20 hover:ring-white/40'
                        }
                      `}
                    >
                      <div className="aspect-square">
                        <img
                          src={avatar.image}
                          alt={avatar.label}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      {editAvatar === avatar.id && (
                        <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1">
                        <p className="text-[10px] text-white text-center truncate px-1">
                          {avatar.label}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
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
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: `url(${env.background})` }}
              />
              
              <div className="relative p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-blue-600/80 text-white px-2 py-0.5 rounded">
                        {env.id}/3
                      </span>
                      {env.completed && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      {!env.completed && (
                        <Lock className="w-4 h-4 text-white/40" />
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white mt-1">{env.name}</h4>
                    <p className="text-sm text-yellow-300">{env.subjects}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{env.score}</p>
                    <p className="text-xs text-white/60">/ {env.maxScore} pts</p>
                  </div>
                </div>

                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      env.completed 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                        : 'bg-gray-600'
                    }`}
                    style={{ width: `${env.maxScore > 0 ? (env.score / env.maxScore) * 100 : 0}%` }}
                  />
                </div>

                <p className={`text-xs mt-2 ${env.completed ? 'text-green-400' : 'text-white/50'}`}>
                  {env.completed ? '✓ Concluído' : 'Não iniciado'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Estatísticas */}
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
              <p className="text-2xl font-bold text-green-400">{3 - totalCompleted}</p>
              <p className="text-xs text-white/60">Ambientes Restantes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{effectiveScore}</p>
              <p className="text-xs text-white/60">Pontos Totais</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {Math.round(overallProgress)}%
              </p>
              <p className="text-xs text-white/60">Progresso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
