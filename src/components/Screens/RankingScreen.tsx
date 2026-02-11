import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import GameBackground from '../Game/GameBackground';
import GameHeader from '../Game/GameHeader';
import GameButton from '../Game/GameButton';
import GameFormCard from '../Game/GameFormCard';
import { supabase } from '@/integrations/supabase/client';
import { environmentConfigs } from '@/config/environments';

interface RankingScreenProps {
  onBack: () => void;
}

interface PlayerRank {
  position: number;
  name: string;
  score: number;
  completedCount: number;
  avatarId: string;
}

const RankingScreen = ({ onBack }: RankingScreenProps) => {
  const [ranking, setRanking] = useState<PlayerRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, total_score, completed_environments, avatar_id')
        .order('total_score', { ascending: false })
        .limit(20);

      if (!error && data) {
        setRanking(data.map((p, i) => ({
          position: i + 1,
          name: p.display_name,
          score: p.total_score,
          completedCount: (p.completed_environments || []).length,
          avatarId: p.avatar_id,
        })));
      }
      setLoading(false);
    };
    fetchRanking();
  }, []);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-white">{position}</span>;
    }
  };

  const getProgressLabel = (count: number) => {
    if (count === 4) return { text: 'Completo', color: 'bg-green-500/80' };
    if (count >= 2) return { text: `${count}/4 ambientes`, color: 'bg-yellow-500/80' };
    if (count === 1) return { text: '1/4 ambiente', color: 'bg-blue-500/80' };
    return { text: 'Iniciante', color: 'bg-gray-500/80' };
  };

  const getRowBackground = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-yellow-500/20 border-yellow-400/50';
      case 2:
        return 'bg-gray-400/20 border-gray-300/50';
      case 3:
        return 'bg-amber-600/20 border-amber-500/50';
      default:
        return 'bg-white/10 border-white/20';
    }
  };

  return (
    <GameBackground>
      <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-8 md:pt-12">
        <GameHeader />
        
        <GameFormCard title="🏆 Ranking" variant="blue">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-white/70 animate-pulse">Carregando ranking...</p>
            </div>
          ) : ranking.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70">Nenhum jogador no ranking ainda.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {ranking.map((player) => {
                const progress = getProgressLabel(player.completedCount);
                return (
                  <div
                    key={player.position}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${getRowBackground(player.position)} transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex-shrink-0">
                      {getPositionIcon(player.position)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{player.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-white/80 text-sm">{player.score.toLocaleString()} pts</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full text-white ${progress.color}`}>
                          {progress.text}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/20">
            <GameButton 
              variant="secondary" 
              onClick={onBack}
              className="w-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </GameButton>
          </div>
        </GameFormCard>
      </div>
    </GameBackground>
  );
};

export default RankingScreen;
