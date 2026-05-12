import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Trophy, Medal, Award, Loader2, ArrowLeft } from 'lucide-react';
import { callEdge } from '@/lib/api-client';

// Cores dinâmicas para o pódio
const getBarColor = (index: number) => {
  if (index === 0) return '#fbbf24'; // Ouro
  if (index === 1) return '#94a3b8'; // Prata
  if (index === 2) return '#b45309'; // Bronze
  return '#3b82f6'; // Azul padrão para os demais
};

interface RankingPageProps {
  onBack?: () => void;
  cursoId?: number;
}

export const RankingPage = ({ onBack, cursoId }: RankingPageProps) => {
  const { data: rankingData, isLoading, isError } = useQuery({
    queryKey: ['ranking', cursoId],
    queryFn: async () => {
      const endpoint = cursoId ? `curso/${cursoId}` : '';
      const res = await callEdge('ranking-api', endpoint);
      if (!res.ok) throw new Error('Falha ao buscar ranking');
      const rawData = await res.json();
      
      // Mapeia os dados do backend para o formato esperado pelo Recharts e UI
      return rawData.map((item: any) => ({
        rank: item.position,
        name: item.nome,
        score: item.pontuacao,
        campus: item.campusId ? `Campus ${item.campusId}` : 'Geral',
        photo: item.foto
      }));
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 p-2 bg-slate-900 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors"
          title="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-slate-300" />
        </button>
      )}
      <div className="max-w-5xl mx-auto space-y-12 mt-12 md:mt-0">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
            Ranking Global
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Acompanhe o desempenho dos melhores jogadores da Rota do Conhecimento em tempo real.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-emerald-400">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="text-lg">Buscando posições no banco de dados...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl text-center text-red-400">
            <p className="font-bold text-lg">Erro de Conexão</p>
            <p>Não foi possível carregar os dados do ranking no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pódio em Destaque */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-slate-800 pb-2">
                <Trophy className="text-yellow-500 w-6 h-6" /> Top 3 Jogadores
              </h2>
              <div className="space-y-4">
                {rankingData?.slice(0, 3).map((player: any, index: number) => (
                  <div 
                    key={player.rank || index} 
                    className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg transition-transform hover:scale-105"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-slate-800">
                      {index === 0 && <Trophy className="text-yellow-500 w-7 h-7" />}
                      {index === 1 && <Medal className="text-slate-400 w-7 h-7" />}
                      {index === 2 && <Award className="text-amber-700 w-7 h-7" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{player.name}</p>
                      <p className="text-sm text-slate-400">{player.campus}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-emerald-400">{player.score}</p>
                      <p className="text-xs text-slate-500">pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico Recharts */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-slate-200">Pontuação Geral (Top 7)</h2>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      tick={{ fill: '#94a3b8' }} 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: '#1e293b' }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {rankingData?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
