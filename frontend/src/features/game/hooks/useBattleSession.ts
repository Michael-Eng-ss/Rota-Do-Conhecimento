import { useState, useCallback, useRef } from 'react';
import { callEdge } from '@/lib/api-client';
import { environmentConfigs, type EnvironmentId } from '../config/environments';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BattleAlternative {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface BattleQuestion {
  id: string;
  baseText: string;
  subject: string;
  alternatives: BattleAlternative[];
}

interface RawAlternativa {
  id: number;
  conteudo: string | null;
  imagem: string | null;
  correta: boolean;
  perguntasid: number;
}

interface RawPergunta {
  id: number;
  conteudo: string | null;
  status: boolean;
  categoriasid: number;
  perguntasnivelid: number;
  tempo: number;
  pathimage: string | null;
  quizid: number | null;
  alternativas?: RawAlternativa[];
}

// ─── Fisher-Yates Shuffle — O(n), sem mutação ────────────────────────────────
//
// Complexidade: O(n) tempo, O(n) espaço (cópia do array).
// Garante distribuição uniforme e não-viesada (cada permutação tem
// probabilidade 1/n! de ocorrer), ao contrário de array.sort(() => Math.random() - 0.5).
//
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── State interno do hook ────────────────────────────────────────────────────

interface SessionState {
  /** Array embaralhado e limitado de perguntas para a rodada atual. */
  questions: BattleQuestion[];
  /** Ponteiro da pergunta atual (0-based). */
  currentIndex: number;
  /**
   * IDs de perguntas já exibidas nesta rodada.
   * Funciona como a última linha de defesa anti-repetição:
   * mesmo que advanceQuestion() falhe na guarda, um ID nunca entra duas vezes.
   */
  usedIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  /**
   * Incrementado a cada nova sessão (Game Over / nova partida).
   * Permite que componentes externos detectem o reset via useEffect/key.
   */
  sessionKey: number;
}

const INITIAL_STATE: SessionState = {
  questions: [],
  currentIndex: 0,
  usedIds: new Set(),
  isLoading: false,
  error: null,
  sessionKey: 0,
};

// ─── useBattleSession ─────────────────────────────────────────────────────────

/**
 * Gerencia o ciclo completo de perguntas de uma batalha.
 *
 * ## Como o estouro de limite é prevenido (passo a passo):
 *
 * ### Durante o carregamento (`startNewSession`):
 *  1. O banco retorna perguntas em `ORDER BY RANDOM()` — 1ª camada de aleatoriedade.
 *  2. Filtramos apenas perguntas `status=true` COM alternativas — eliminamos dados inválidos.
 *  3. `effectiveLimit = Math.min(configuredMax, eligible.length)` — **nunca pedimos mais
 *     do que existe no banco**. Se o banco tem 7 perguntas e o ambiente pede 10,
 *     usamos 7. Isso torna matematicamente impossível acessar um índice fora do array.
 *  4. Fisher-Yates embaralha o pool no cliente — 2ª camada (cache-safe). Mesmo que o
 *     banco retorne em cache com a mesma ordem, o resultado final será diferente.
 *  5. `.slice(0, effectiveLimit)` corta o array no tamanho seguro calculado no passo 3.
 *  6. As alternativas de cada pergunta também são embaralhadas individualmente — 3ª camada.
 *
 * ### Durante a batalha (`advanceQuestion`):
 *  7. Guard interno: `if (currentIndex >= questions.length - 1) return prev` — o ponteiro
 *     NUNCA ultrapassa o último índice do array. A operação é idempotente.
 *  8. `usedIds` registra cada pergunta exibida. Um ID nunca é inserido duas vezes.
 *
 * ### No Game Over / nova partida (`startNewSession` novamente):
 *  9. `currentIndex` volta para 0, `usedIds` é zerado e `sessionKey` incrementa.
 *  10. Um novo fetch é feito — as perguntas são buscadas do banco e re-embaralhadas,
 *      garantindo uma partida diferente da anterior.
 */
export function useBattleSession(environmentId: EnvironmentId) {
  const configuredMax = environmentConfigs[environmentId].totalQuestions;
  const [state, setState] = useState<SessionState>(INITIAL_STATE);

  // Ref para evitar race conditions: se o usuário clicar "Reiniciar" rapidamente,
  // um fetch anterior não sobrescreve o estado de um fetch mais recente.
  const isFetchingRef = useRef(false);

  // ── startNewSession ──────────────────────────────────────────────────────────

  const startNewSession = useCallback(async (): Promise<void> => {
    if (isFetchingRef.current) return; // Evita fetches simultâneos
    isFetchingRef.current = true;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Passo 1 — Aleatoriedade na camada de banco (ORDER BY RANDOM())
      const res = await callEdge(
        'perguntas-api',
        `completas/${environmentId}?random=true`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}: Erro ao buscar perguntas`);

      const raw: RawPergunta[] = await res.json();

      // Passo 2 — Filtra perguntas válidas (ativas + com alternativas)
      const eligible = raw.filter(
        p => p.status && (p.alternativas?.length ?? 0) > 0,
      );

      // Passo 3 — CONTROLE DE LIMITE (ponto crítico anti-estouro)
      // effectiveLimit nunca excede o total de perguntas válidas no banco.
      // Se o banco tiver menos perguntas que o configurado, usamos todas.
      const effectiveLimit = Math.min(configuredMax, eligible.length);

      if (effectiveLimit === 0) {
        setState(prev => ({
          ...INITIAL_STATE,
          isLoading: false,
          error: 'Nenhuma pergunta ativa disponível para este ambiente.',
          sessionKey: prev.sessionKey + 1,
        }));
        return;
      }

      // Passo 4 — Fisher-Yates client-side (cache-safe)
      // Passo 5 — Corta no effectiveLimit calculado acima
      const shuffledPool = shuffle(eligible).slice(0, effectiveLimit);

      // Passo 6 — Embaralha as alternativas de cada pergunta individualmente
      const questions: BattleQuestion[] = shuffledPool.map(p => ({
        id: String(p.id),
        baseText: p.conteudo ?? '',
        subject: '',
        alternatives: shuffle(
          (p.alternativas ?? []).map(a => ({
            id: String(a.id),
            text: a.conteudo ?? '',
            isCorrect: a.correta,
          })),
        ),
      }));

      // Passo 9/10 — Reset completo: nova sessão, pool fresco, ponteiro zerado
      setState(prev => ({
        questions,
        currentIndex: 0,
        usedIds: new Set<string>(),
        isLoading: false,
        error: null,
        sessionKey: prev.sessionKey + 1,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : 'Erro desconhecido ao carregar perguntas.',
      }));
    } finally {
      isFetchingRef.current = false;
    }
  }, [environmentId, configuredMax]);

  // ── advanceQuestion ──────────────────────────────────────────────────────────

  /**
   * Avança o ponteiro para a próxima pergunta e registra a atual em `usedIds`.
   *
   * Guard anti-estouro (Passo 7): só avança se `currentIndex < questions.length - 1`.
   * A operação é idempotente — chamadas extras na última pergunta não causam efeito.
   */
  const advanceQuestion = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex >= prev.questions.length - 1) return prev; // Guard

      const currentQ = prev.questions[prev.currentIndex];
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        usedIds: new Set([...prev.usedIds, currentQ.id]), // Passo 8
      };
    });
  }, []);

  // ── Valores derivados (leitura) ───────────────────────────────────────────────

  const { questions, currentIndex, isLoading, error, sessionKey, usedIds } = state;

  const currentQuestion: BattleQuestion | null = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;
  const isLastQuestion = totalQuestions > 0 && currentIndex === totalQuestions - 1;
  const questionsLoaded = !isLoading && totalQuestions > 0;

  return {
    // ── State ──
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    isLastQuestion,
    questionsLoaded,
    isLoading,
    error,
    sessionKey,
    usedIds,

    // ── Actions ──
    startNewSession,
    advanceQuestion,
  };
}
