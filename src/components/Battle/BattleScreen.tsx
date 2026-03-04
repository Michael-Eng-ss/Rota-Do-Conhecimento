import { useState, useCallback, useEffect } from 'react';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { useQuestions } from '@/hooks/useQuestions';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { environmentConfigs, MIN_PASS_PERCENTAGE, getDamagePercentage, type EnvironmentId } from '@/config/environments';
import HealthBar from '@/components/Environment/HealthBar';
import BossHealthBar from './BossHealthBar';
import SoundButton from '@/components/Environment/SoundButton';
import EnvironmentMenu from '@/components/Environment/EnvironmentMenu';
import ProfileAvatar from '@/components/Environment/ProfileAvatar';
import MultipleChoiceCard from './MultipleChoiceCard';
import VictoryScreen from './VictoryScreen';
import DefeatScreen from './DefeatScreen';
import DialogBox from '@/components/VisualNovel/DialogBox';
import FeedbackOverlay from './FeedbackOverlay';

// Import backgrounds
import auditorioImage from '@/assets/backgrounds/auditorio.png';
import bibliotecaImage from '@/assets/backgrounds/biblioteca.png';
import salaMatematicaImage from '@/assets/backgrounds/sala-matematica.png';

// Import Clara sprites
import claraDuvidaImage from '@/assets/characters/clara-duvida.png';
import claraAnimadaImage from '@/assets/characters/clara-animada.png';
import claraCelebrandoImage from '@/assets/characters/clara-celebrando.png';
import claraGritoImage from '@/assets/characters/clara-grito.png';
import claraMatematicaImage from '@/assets/characters/clara-matematica.png';
import claraMatematicaConfianteImage from '@/assets/characters/clara-matematica-confiante.png';
import claraMatematicaTristeImage from '@/assets/characters/clara-matematica-triste.png';
import claraFelizCienciaImage from '@/assets/characters/clara-feliz-ciencia.png';
import claraFelizCiencia2Image from '@/assets/characters/clara-feliz-ciencia-2.png';
import claraSorrindoImage from '@/assets/characters/clara-sorrindo.png';
import claraOuvindoImage from '@/assets/characters/clara-ouvindo.png';
import claraChorandoImage from '@/assets/characters/clara-chorando.png';
import claraDuvidaDialogoImage from '@/assets/characters/clara-duvida-dialogo.png';

// Import Boss sprites - Auditório (Ambiente 1)
import profAuditorioNormalImage from '@/assets/characters/prof-auditorio-normal.png';
import profAuditorioPurificadoImage from '@/assets/characters/prof-auditorio-purificado.png';
import profAuditorioBossImage from '@/assets/characters/prof-auditorio-boss.png';
import profAuditorioBossFelizImage from '@/assets/characters/prof-auditorio-boss-feliz.png';
import profAuditorioBossGargalhandoImage from '@/assets/characters/prof-auditorio-boss-gargalhando.png';
import profAuditorioBossTristeImage from '@/assets/characters/prof-auditorio-boss-triste.png';
import profAuditorioArrependidoImage from '@/assets/characters/prof-auditorio-arrependido.png';

// Import Boss sprites - Biblioteca (Ambiente 2)
import profBibliotecaDialogoImage from '@/assets/characters/prof-biblioteca-dialogo.png';
import profBibliotecaPurificadaImage from '@/assets/characters/prof-biblioteca-purificada.png';
import profBibliotecaBossImage from '@/assets/characters/prof-biblioteca-boss.png';
import profBibliotecaBossSeriaImage from '@/assets/characters/prof-biblioteca-boss-seria.png';
import profBibliotecaBossGargalhandoImage from '@/assets/characters/prof-biblioteca-boss-gargalhando.png';
import profBibliotecaBossTristeImage from '@/assets/characters/prof-biblioteca-boss-triste.png';

// Import Boss sprites - Boss Final (Ambiente 3)
import profMatematicaNormalImage from '@/assets/characters/prof-matematica-normal.png';
import profMatematicaPurificadaTristeImage from '@/assets/characters/prof-matematica-purificada-triste.png';
import profMatematicaPurificadaFelizImage from '@/assets/characters/prof-matematica-purificada-feliz.png';
import profMatematicaBossImage from '@/assets/characters/prof-matematica-boss.png';
import profMatematicaBossSorrindoImage from '@/assets/characters/prof-matematica-boss-sorrindo.png';
import profMatematicaBossGargalhandoImage from '@/assets/characters/prof-matematica-boss-gargalhando.png';
import profMatematicaBossTristeImage from '@/assets/characters/prof-matematica-boss-triste.png';

type BattlePhase = 'intro-1' | 'intro-2' | 'intro-3' | 'battle-start' | 'question' | 'feedback' | 'review' | 'victory' | 'defeat';
type FeedbackType = 'correct' | 'wrong' | null;

interface Alternative {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface BattleQuestion {
  id: string;
  baseText: string;
  alternatives: Alternative[];
  subject: string;
}

const backgroundByEnv: Record<EnvironmentId, string> = {
  1: auditorioImage,
  2: bibliotecaImage,
  3: salaMatematicaImage,
};

interface BattleScreenProps {
  environmentId: EnvironmentId;
  onBackToPatio: () => void;
  onProfile: () => void;
  onVictory: (score: number) => void;
}

const BattleScreen = ({ environmentId, onBackToPatio, onProfile, onVictory }: BattleScreenProps) => {
  const envConfig = environmentConfigs[environmentId];
  const { fetchBattleQuestions } = useQuestions();
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  
  const [phase, setPhase] = useState<BattlePhase>('intro-1');
  const [playerHealth, setPlayerHealth] = useState(100);
  const [bossHealth, setBossHealth] = useState(envConfig.maxHealth);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [lastFeedback, setLastFeedback] = useState<FeedbackType>(null);
  const [pendingResult, setPendingResult] = useState<{ isCorrect: boolean; newPlayerHealth: number; newBossHealth: number; damageDealt: number } | null>(null);
  const [reviewSelectedId, setReviewSelectedId] = useState<string | undefined>(undefined);
  const [bossTransformed, setBossTransformed] = useState(false);
  const [shakeClara, setShakeClara] = useState(false);
  const [shakeBoss, setShakeBoss] = useState(false);
  const { settings, toggleMute } = useSoundSystem();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    const loadQuestions = async () => {
      const fetched = await fetchBattleQuestions(environmentId);
      setQuestions(fetched);
      setQuestionsLoaded(true);
    };
    loadQuestions();
  }, [environmentId, fetchBattleQuestions]);

  const currentQuestion = questions[currentQuestionIndex];
  const damagePerWrongAnswer = questions.length > 0 ? Math.ceil(100 / questions.length) : 50;
  const damagePerCorrectAnswer = questions.length > 0 ? Math.ceil(envConfig.maxHealth / questions.length) : 50;
  
  const bossNameByEnv: Record<EnvironmentId, string> = {
    1: 'Professor do Auditório',
    2: 'Professora da Biblioteca',
    3: 'Diretora',
  };

  const handleHelp = () => {
    console.log('Ajuda - a ser implementado');
  };

  const getClaraSprite = () => {
    // Ambiente 3 (Boss Final)
    if (environmentId === 3) {
      if (phase === 'defeat') return claraChorandoImage;
      if (phase === 'victory') return claraCelebrandoImage;
      if (phase === 'intro-1') return claraOuvindoImage;
      if (phase === 'intro-2') return claraMatematicaImage;
      if (phase === 'intro-3') return claraMatematicaConfianteImage;
      if (phase === 'battle-start') return claraMatematicaConfianteImage;
      if (phase === 'question' || phase === 'feedback' || phase === 'review') {
        if (lastFeedback === 'wrong') return claraMatematicaTristeImage;
        return claraMatematicaConfianteImage;
      }
      return claraMatematicaImage;
    }

    // Padrão para Auditório (1) e Biblioteca (2)
    if (phase === 'defeat') return claraGritoImage;
    if (phase === 'victory') return claraCelebrandoImage;
    if (phase === 'battle-start') return claraAnimadaImage;
    if (phase === 'question' || phase === 'feedback' || phase === 'review') {
      if (lastFeedback === 'wrong') return claraDuvidaDialogoImage;
      return claraAnimadaImage;
    }
    if (phase === 'intro-2') return claraSorrindoImage;
    if (phase === 'intro-3') return claraAnimadaImage;
    return claraDuvidaImage;
  };

  const getBossSprite = () => {
    // Ambiente 3 (Boss Final)
    if (environmentId === 3) {
      if (phase === 'victory') return profMatematicaPurificadaFelizImage;
      if (phase === 'defeat') return profMatematicaBossGargalhandoImage;
      if (bossTransformed || phase === 'battle-start' || phase === 'question' || phase === 'feedback' || phase === 'review') {
        if (bossHealth < 30) return profMatematicaBossTristeImage;
        if (phase === 'question' || phase === 'feedback' || phase === 'review') return profMatematicaBossImage;
        return profMatematicaBossSorrindoImage;
      }
      if (phase === 'intro-1') return profMatematicaPurificadaFelizImage;
      if (phase === 'intro-2') return profMatematicaPurificadaTristeImage;
      if (phase === 'intro-3') return profMatematicaNormalImage;
      return profMatematicaNormalImage;
    }

    // Ambiente 2 (Biblioteca)
    if (environmentId === 2) {
      if (phase === 'victory') return profBibliotecaPurificadaImage;
      if (phase === 'defeat') return profBibliotecaBossGargalhandoImage;
      if (bossTransformed || phase === 'intro-3' || phase === 'battle-start' || phase === 'question' || phase === 'feedback' || phase === 'review') {
        if (bossHealth < 30) return profBibliotecaBossTristeImage;
        if (phase === 'question' || phase === 'feedback' || phase === 'review') return profBibliotecaBossSeriaImage;
        return profBibliotecaBossImage;
      }
      return profBibliotecaDialogoImage;
    }

    // Ambiente 1 (Auditório)
    if (phase === 'victory') return profAuditorioArrependidoImage;
    if (phase === 'defeat') return profAuditorioBossGargalhandoImage;
    if (bossTransformed || phase === 'intro-3' || phase === 'battle-start' || phase === 'question' || phase === 'feedback' || phase === 'review') {
      if (bossHealth < 30) return profAuditorioBossTristeImage;
      return profAuditorioBossImage;
    }
    if (phase === 'intro-2') return profAuditorioPurificadoImage;
    return profAuditorioNormalImage;
  };

  const getDialogue = () => {
    // Biblioteca (Ambiente 2)
    if (environmentId === 2) {
      switch (phase) {
        case 'intro-1':
          return { speaker: 'Clara', text: 'Professora, ainda bem que você está aqui. Senti muito sua falta.' };
        case 'intro-2':
          return { speaker: 'Professora', text: 'Clara, fico feliz de ver você bem, só que vim propor os desafios para você. Espero muito que você vença.' };
        case 'intro-3':
          return { speaker: 'Professora', text: 'Vamos, Clara, chegou o momento.' };
        case 'battle-start':
          return { speaker: 'Clara', text: 'Minha querida biblioteca... Sei que irei conseguir, vou arrumar tudo!' };
        default: return null;
      }
    }

    // Boss Final (Ambiente 3)
    if (environmentId === 3) {
      switch (phase) {
        case 'intro-1':
          return { speaker: 'Clara', text: 'Diretora! Você está aqui... Eu sabia que teria que enfrentá-la no final.' };
        case 'intro-2':
          return { speaker: 'Diretora', text: 'Clara, você chegou longe. Mas este é o desafio final. Não será fácil, eu garanto. Mostre tudo o que aprendeu!' };
        case 'intro-3':
          return { speaker: 'Clara', text: 'Eu não vou desistir agora. Passei por todos os outros desafios e vou vencer este também!' };
        case 'battle-start':
          return { speaker: 'Diretora', text: 'Então prove seu valor, Clara. O destino da escola está em suas mãos!' };
        default: return null;
      }
    }

    // Auditório (Ambiente 1)
    switch (phase) {
      case 'intro-1':
        return { speaker: 'Professor', text: 'Olá, Clara, veio aqui para testar minhas perguntas e conseguir salvar a escola?' };
      case 'intro-2':
        return { speaker: 'Clara', text: 'Sim, vou salvar todo mundo.' };
      case 'intro-3':
        return { speaker: 'Professor', text: 'Veremos, Clara.' };
      case 'battle-start':
        return { speaker: 'Clara', text: 'Vamos lá! Estou pronta para responder!' };
      default: return null;
    }
  };

  const handleDialogueClick = () => {
    if (phase === 'intro-1') {
      setPhase('intro-2');
    } else if (phase === 'intro-2') {
      setPhase('intro-3');
      setBossTransformed(true);
    } else if (phase === 'intro-3') {
      setPhase('battle-start');
    } else if (phase === 'battle-start') {
      setPhase('question');
    }
  };

  const handleAnswerConfirm = (selectedAlternativeId: string) => {
    const selectedAlt = currentQuestion.alternatives.find(a => a.id === selectedAlternativeId);
    const isCorrect = selectedAlt?.isCorrect ?? false;

    if (!settings.isMuted) {
      playSound(isCorrect ? 'correct' : 'wrong');
    }
    
    const damageDealt = isCorrect ? damagePerCorrectAnswer : 0;
    const playerDamage = isCorrect ? 0 : damagePerWrongAnswer;
    
    const newBossHealth = Math.max(0, bossHealth - damageDealt);
    const newPlayerHealth = Math.max(0, playerHealth - playerDamage);
    
    setReviewSelectedId(selectedAlternativeId);
    setPendingResult({ isCorrect, newPlayerHealth, newBossHealth, damageDealt });
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setPhase('feedback');
  };

  const handleFeedbackEnd = useCallback(() => {
    if (!pendingResult) return;
    
    const { newPlayerHealth, newBossHealth, damageDealt } = pendingResult;
    
    // Trigger shake on the character that took damage
    if (pendingResult.isCorrect) {
      setShakeBoss(true);
      setTimeout(() => setShakeBoss(false), 500);
    } else {
      setShakeClara(true);
      setTimeout(() => setShakeClara(false), 500);
    }

    setScore(prev => prev + (pendingResult.isCorrect ? 1 : 0));
    setBossHealth(newBossHealth);
    setPlayerHealth(newPlayerHealth);
    setTotalDamageDealt(prev => prev + damageDealt);

    setFeedback(null);
    setLastFeedback(pendingResult.isCorrect ? 'correct' : 'wrong');
    setPhase('review');
  }, [pendingResult]);

  const handleReviewContinue = useCallback(() => {
    if (!pendingResult) return;
    
    const { newPlayerHealth, newBossHealth, damageDealt } = pendingResult;

    setPendingResult(null);
    setReviewSelectedId(undefined);

    if (newPlayerHealth <= 0) {
      setPhase('defeat');
      return;
    }

    if (newBossHealth <= 0) {
      const finalDamage = totalDamageDealt + damageDealt;
      const damagePercentage = finalDamage / envConfig.maxHealth;
      if (damagePercentage >= MIN_PASS_PERCENTAGE) {
        setPhase('victory');
      } else {
        setPhase('defeat');
      }
      return;
    }

    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    setPhase('question');
  }, [pendingResult, currentQuestionIndex, questions.length, totalDamageDealt, envConfig.maxHealth]);

  useEffect(() => {
    if (settings.isMuted) return;
    if (phase === 'victory') playSound('victory');
    else if (phase === 'defeat') playSound('defeat');
  }, [phase, settings.isMuted, playSound]);

  const handleRestart = () => {
    setPhase('intro-1');
    setPlayerHealth(100);
    setBossHealth(envConfig.maxHealth);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalDamageDealt(0);
    setFeedback(null);
    setPendingResult(null);
    setBossTransformed(false);
    setReviewSelectedId(undefined);
  };

  const handleVictoryComplete = () => {
    onVictory(totalDamageDealt);
    onBackToPatio();
  };

  const dialogue = getDialogue();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundByEnv[environmentId]})` }}
      />

      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-4">
          <ProfileAvatar onProfileClick={onProfile} />
          <HealthBar health={playerHealth} />
        </div>
        <div className="flex gap-2 mt-2">
          <SoundButton isMuted={settings.isMuted} onToggle={toggleMute} />
          <EnvironmentMenu onBackToPatio={onBackToPatio} onHelp={handleHelp} />
        </div>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
        <BossHealthBar 
          health={bossHealth} 
          maxHealth={envConfig.maxHealth}
          bossName={bossNameByEnv[environmentId]} 
        />
      </div>

      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-20">
        <span className="font-bold">{envConfig.name}</span> - Ambiente {environmentId} / 3
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className={`absolute bottom-24 left-4 md:left-16 w-52 md:w-72 ${shakeClara ? 'animate-shake-damage' : ''}`}>
          <img 
            key={getClaraSprite()}
            src={getClaraSprite()} 
            alt="Clara" 
            className="w-full h-auto object-contain drop-shadow-lg animate-sprite-swap"
          />
        </div>
        
        <div className={`absolute bottom-24 right-4 md:right-16 w-72 md:w-96 flex items-center justify-center ${shakeBoss ? 'animate-shake-damage' : ''}`}>
          <img 
            key={getBossSprite()}
            src={getBossSprite()} 
            alt="Chefão" 
            className="w-full h-auto object-contain drop-shadow-lg relative z-10 animate-sprite-swap"
          />
        </div>
      </div>

      {(phase === 'question' || phase === 'feedback') && currentQuestion && (
        <MultipleChoiceCard
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          baseText={currentQuestion.baseText}
          alternatives={currentQuestion.alternatives}
          onConfirm={handleAnswerConfirm}
          disabled={phase === 'feedback'}
        />
      )}

      {phase === 'review' && currentQuestion && (
        <MultipleChoiceCard
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          baseText={currentQuestion.baseText}
          alternatives={currentQuestion.alternatives}
          onConfirm={handleAnswerConfirm}
          disabled={true}
          reviewMode={true}
          reviewSelectedId={reviewSelectedId}
          onContinue={handleReviewContinue}
        />
      )}

      {phase === 'feedback' && feedback && (
        <FeedbackOverlay 
          type={feedback} 
          onAnimationEnd={handleFeedbackEnd}
        />
      )}

      {(phase === 'intro-1' || phase === 'intro-2' || phase === 'intro-3' || phase === 'battle-start') && dialogue && (
        <div 
          className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20 cursor-pointer"
          onClick={handleDialogueClick}
        >
          <DialogBox
            speaker={dialogue.speaker}
            dialogue={dialogue.text}
          />
        </div>
      )}

      {phase === 'victory' && (
        <VictoryScreen
          score={score}
          totalQuestions={questions.length}
          damageDealt={totalDamageDealt}
          maxBossHealth={envConfig.maxHealth}
          onBackToPatio={handleVictoryComplete}
          bossName={bossNameByEnv[environmentId]}
          isFinalBoss={envConfig.isFinalBoss}
        />
      )}

      {phase === 'defeat' && (
        <DefeatScreen
          onBackToPatio={onBackToPatio}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default BattleScreen;
