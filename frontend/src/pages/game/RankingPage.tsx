import { useQuery } from '@tanstack/react-query';
import {
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell,
} from 'recharts';
import { Trophy, Medal, Award, Loader2, ArrowLeft, Star, TrendingUp, Crown } from 'lucide-react';
import { callEdge } from '@/lib/api-client';

// ── Cores do pódio ────────────────────────────────────────────────────────────
const PODIUM = [
  { bg: 'from-yellow-400/20 to-yellow-600/10', border: 'border-yellow-500/40', text: 'text-yellow-400',  glow: 'shadow-yellow-500/20', icon: <Crown  className="w-7 h-7 text-yellow-400" />,  label: '1º' },
  { bg: 'from-slate-300/15 to-slate-500/10',   border: 'border-slate-400/40',  text: 'text-slate-300',   glow: 'shadow-slate-400/20',  icon: <Medal  className="w-7 h-7 text-slate-300" />,   label: '2º' },
  { bg: 'from-amber-600/20 to-amber-800/10',   border: 'border-amber-700/40',  text: 'text-amber-500',   glow: 'shadow-amber-700/20',  icon: <Award  className="w-7 h-7 text-amber-500" />,   label: '3º' },
];

const BAR_COLOR = (i: number) => ['#fbbf24','#94a3b8','#b45309','#6366f1','#34d399','#f472b6','#60a5fa'][i] ?? '#6366f1';

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
      const raw = await res.json();
      return raw.map((item: any, idx: number) => ({
        rank: item.position ?? idx + 1,
        name: item.nome,
        score: item.pontuacao,
        campus: item.campusId ? `Campus ${item.campusId}` : 'Geral',
        photo: item.foto,
      }));
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

      {/* ── Fundo decorativo ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 rounded-full bg-blue-600/8 blur-3xl" />
      </div>

      {/* ── Botão Voltar ── */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-slate-900/80 border border-slate-700/60 text-slate-300
                     hover:bg-slate-800 hover:text-white transition-all duration-200
                     backdrop-blur-sm shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">Voltar</span>
        </button>
      )}

      <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* ── Header ── */}
        <div className="text-center space-y-3 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-semibold mb-2">
            <Star className="w-4 h-4" />
            Classificação Geral
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight
                         bg-gradient-to-br from-white via-slate-200 to-slate-400
                         bg-clip-text text-transparent">
            Ranking Global
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Acompanhe o desempenho dos melhores jogadores da Rota do Conhecimento em tempo real.
          </p>
        </div>

        {/* ── Estados: Loading / Error / Data ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-4 text-violet-400">
            <Loader2 className="w-14 h-14 animate-spin" />
            <p className="text-lg font-medium">Carregando ranking...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl text-center text-red-400 space-y-2">
            <p className="font-bold text-xl">Erro de Conexão</p>
            <p className="text-sm text-red-400/80">Não foi possível carregar os dados do ranking no momento.</p>
          </div>
        ) : (
          <>
            {/* ── Pódio Visual ── */}
            {rankingData && rankingData.length >= 3 && (
              <div className="flex items-end justify-center gap-4 md:gap-6 pt-4">
                {/* 2º lugar */}
                <PodiumCard player={rankingData[1]} pos={1} height="h-36" />
                {/* 1º lugar — destacado */}
                <PodiumCard player={rankingData[0]} pos={0} height="h-48" featured />
                {/* 3º lugar */}
                <PodiumCard player={rankingData[2]} pos={2} height="h-28" />
              </div>
            )}

            {/* ── Grid: Tabela + Gráfico ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

              {/* Tabela completa */}
              <div className="xl:col-span-2 bg-slate-900/60 border border-slate-800/60 rounded-2xl
                              overflow-hidden shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-800/60">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h2 className="font-bold text-slate-100">Classificação Completa</h2>
                </div>
                <ul className="divide-y divide-slate-800/50">
                  {rankingData?.map((player: any, index: number) => (
                    <li
                      key={player.rank || index}
                      className={`flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-slate-800/40
                        ${index < 3 ? 'bg-slate-800/20' : ''}`}
                    >
                      {/* Posição */}
                      <span className={`w-7 text-center text-sm font-bold shrink-0
                        ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'}`}>
                        {index + 1}º
                      </span>
                      {/* Ícone pódio */}
                      <div className="shrink-0">
                        {index === 0 && <Crown className="w-4 h-4 text-yellow-400" />}
                        {index === 1 && <Medal className="w-4 h-4 text-slate-300" />}
                        {index === 2 && <Award className="w-4 h-4 text-amber-600" />}
                        {index >= 3 && <div className="w-4" />}
                      </div>
                      {/* Nome */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-100 truncate">{player.name}</p>
                        <p className="text-xs text-slate-500 truncate">{player.campus}</p>
                      </div>
                      {/* Pontuação */}
                      <div className="text-right shrink-0">
                        <p className={`font-bold text-base ${index === 0 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                          {player.score.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-xs text-slate-600">pts</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gráfico */}
              <div className="xl:col-span-3 bg-slate-900/60 border border-slate-800/60 rounded-2xl
                              p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-bold text-slate-100">Pontuação — Top {Math.min(rankingData?.length ?? 0, 7)}</h2>
                </div>
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rankingData?.slice(0, 7)} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                      <defs>
                        {rankingData?.slice(0, 7).map((_: any, i: number) => (
                          <linearGradient key={i} id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={BAR_COLOR(i)} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={BAR_COLOR(i)} stopOpacity={0.4} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#334155"
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        dy={8}
                      />
                      <YAxis
                        stroke="#334155"
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          padding: '10px 14px',
                        }}
                        labelStyle={{ color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}
                        itemStyle={{ color: '#34d399', fontWeight: 700 }}
                        formatter={(v: number) => [v.toLocaleString('pt-BR') + ' pts', 'Pontuação']}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={52}>
                        {rankingData?.slice(0, 7).map((_: any, i: number) => (
                          <Cell key={i} fill={`url(#bar-${i})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Sub-componente: Card do Pódio ─────────────────────────────────────────────
interface PodiumCardProps {
  player: any;
  pos: number;
  height: string;
  featured?: boolean;
}

function PodiumCard({ player, pos, height, featured }: PodiumCardProps) {
  const style = PODIUM[pos];
  return (
    <div className={`relative flex flex-col items-center gap-2 ${featured ? 'scale-105' : ''}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full
                        bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold">
          Campeão
        </div>
      )}
      {/* Avatar */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0
                       bg-gradient-to-br ${style.bg} border-2 ${style.border}
                       shadow-xl ${style.glow}`}>
        {style.icon}
      </div>
      {/* Nome */}
      <div className="text-center max-w-[90px]">
        <p className={`font-bold text-sm leading-tight truncate ${style.text}`}>{player.name}</p>
        <p className={`font-extrabold text-base ${style.text}`}>{player.score.toLocaleString('pt-BR')}</p>
        <p className="text-xs text-slate-600">pts</p>
      </div>
      {/* Degrau do pódio */}
      <div className={`w-24 ${height} rounded-t-xl bg-gradient-to-b ${style.bg}
                       border border-t-0 ${style.border} flex items-end justify-center pb-2`}>
        <span className={`text-2xl font-black ${style.text} opacity-60`}>{style.label}</span>
      </div>
    </div>
  );
}
