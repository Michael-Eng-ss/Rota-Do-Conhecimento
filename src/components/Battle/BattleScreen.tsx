import { useState, useCallback, useEffect } from 'react';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { useQuestions } from '@/hooks/useQuestions';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { environmentConfigs, MIN_PASS_PERCENTAGE, getDamagePercentage } from '@/config/environments';
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
import laboratorioImage from '@/assets/backgrounds/laboratorio.png';
import auditorioImage from '@/assets/backgrounds/auditorio.png';
import bibliotecaImage from '@/assets/backgrounds/biblioteca.png';
import salaMatematicaImage from '@/assets/backgrounds/sala-matematica.png';

// Import Clara sprites
import claraLaboratorioImage from '@/assets/characters/clara-laboratorio.png';
import claraFelizCienciaImage from '@/assets/characters/clara-feliz-ciencia.png';
import claraDuvidaImage from '@/assets/characters/clara-duvida.png';
import claraAnimadaImage from '@/assets/characters/clara-animada.png';
import claraCelebrandoImage from '@/assets/characters/clara-celebrando.png';
import claraGritoImage from '@/assets/characters/clara-grito.png';
import claraMatematicaImage from '@/assets/characters/clara-matematica.png';
import claraMatematicaConfianteImage from '@/assets/characters/clara-matematica-confiante.png';
import claraMatematicaTristeImage from '@/assets/characters/clara-matematica-triste.png';
import claraFelizCiencia2Image from '@/assets/characters/clara-feliz-ciencia-2.png';
import claraSorrindoImage from '@/assets/characters/clara-sorrindo.png';
import claraOuvindoImage from '@/assets/characters/clara-ouvindo.png';
import claraChorandoImage from '@/assets/characters/clara-chorando.png';
import claraLabAssustadaImage from '@/assets/characters/clara-lab-assustada.png';
import claraDuvidaDialogoImage from '@/assets/characters/clara-duvida-dialogo.png';

// Import Boss sprites - Laboratório (Ambiente 1)
import profCienciasDestemidaImage from '@/assets/characters/prof-ciencias-destemida.png';
import profCienciasGargalhandoImage from '@/assets/characters/prof-ciencias-gargalhando.png';
import profCienciasTristeImage from '@/assets/characters/prof-ciencias-triste.png';
import profCienciasPurificadaImage from '@/assets/characters/prof-ciencias-purificada.png';

// Import Boss sprites - Auditório (Ambiente 2)
import profAuditorioNormalImage from '@/assets/characters/prof-auditorio-normal.png';
import profAuditorioPurificadoImage from '@/assets/characters/prof-auditorio-purificado.png';
import profAuditorioBossImage from '@/assets/characters/prof-auditorio-boss.png';
import profAuditorioBossFelizImage from '@/assets/characters/prof-auditorio-boss-feliz.png';
import profAuditorioBossGargalhandoImage from '@/assets/characters/prof-auditorio-boss-gargalhando.png';
import profAuditorioBossTristeImage from '@/assets/characters/prof-auditorio-boss-triste.png';
import profAuditorioArrependidoImage from '@/assets/characters/prof-auditorio-arrependido.png';

// Import Boss sprites - Biblioteca (Ambiente 3)
import profBibliotecaDialogoImage from '@/assets/characters/prof-biblioteca-dialogo.png';
import profBibliotecaPurificadaImage from '@/assets/characters/prof-biblioteca-purificada.png';
import profBibliotecaBossImage from '@/assets/characters/prof-biblioteca-boss.png';
import profBibliotecaBossSeriaImage from '@/assets/characters/prof-biblioteca-boss-seria.png';
import profBibliotecaBossGargalhandoImage from '@/assets/characters/prof-biblioteca-boss-gargalhando.png';
import profBibliotecaBossTristeImage from '@/assets/characters/prof-biblioteca-boss-triste.png';

// Import Boss sprites - Sala de Matemática (Ambiente 4 - Boss Final)
import profMatematicaNormalImage from '@/assets/characters/prof-matematica-normal.png';
import profMatematicaPurificadaTristeImage from '@/assets/characters/prof-matematica-purificada-triste.png';
import profMatematicaPurificadaFelizImage from '@/assets/characters/prof-matematica-purificada-feliz.png';
import profMatematicaBossImage from '@/assets/characters/prof-matematica-boss.png';
import profMatematicaBossSorrindoImage from '@/assets/characters/prof-matematica-boss-sorrindo.png';
import profMatematicaBossGargalhandoImage from '@/assets/characters/prof-matematica-boss-gargalhando.png';
import profMatematicaBossTristeImage from '@/assets/characters/prof-matematica-boss-triste.png';

// Import Effects
import efeitoVerdeImage from '@/assets/effects/efeito-verde.png';

// Fases da batalha expandidas para suportar múltiplos diálogos
type BattlePhase = 'intro-1' | 'intro-2' | 'intro-3' | 'battle-start' | 'question' | 'feedback' | 'review' | 'victory' | 'defeat';

type FeedbackType = 'correct' | 'wrong' | null;

// Estrutura de questão de múltipla escolha
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

// Configuração de background por ambiente
const backgroundByEnv: Record<1 | 2 | 3 | 4, string> = {
  1: laboratorioImage,
  2: auditorioImage,
  3: bibliotecaImage,
  4: salaMatematicaImage,
};

// Clara sprites por ambiente
const claraSpriteByEnv: Record<1 | 2 | 3 | 4, { normal: string; happy: string }> = {
  1: { normal: claraLaboratorioImage, happy: claraFelizCienciaImage },
  2: { normal: claraDuvidaImage, happy: claraFelizCienciaImage },
  3: { normal: claraDuvidaImage, happy: claraFelizCienciaImage },
  4: { normal: claraMatematicaImage, happy: claraFelizCienciaImage },
};
interface BattleScreenProps {
  environmentId: 1 | 2 | 3 | 4;
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
  const { settings, toggleMute } = useSoundSystem();
  const { playSound } = useSoundEffects();

  // Load questions from database
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
  
  // Nome do chefão por ambiente
  const bossNameByEnv: Record<1 | 2 | 3 | 4, string> = {
    1: 'Professora de Ciências',
    2: 'Professor de Física',
    3: 'Professora de Humanas',
    4: 'Diretor Supremo',
  };

  const handleHelp = () => {
    console.log('Ajuda - a ser implementado');
  };

  const getClaraSprite = () => {
    // Ambiente 4 (Sala de Matemática) - Clara com Compasso e Lápis
    if (environmentId === 4) {
      if (phase === 'defeat') return claraChorandoImage;
      if (phase === 'victory') return claraCelebrandoImage;
      if (phase === 'intro-1') return claraOuvindoImage; // Ouvindo a professora
      if (phase === 'intro-2') return claraMatematicaImage; // Segurando materiais
      if (phase === 'intro-3') return claraMatematicaConfianteImage; // Confiante com materiais
      if (phase === 'battle-start') return claraMatematicaConfianteImage;
      if (phase === 'question' || phase === 'feedback' || phase === 'review') {
        if (lastFeedback === 'wrong') return claraMatematicaTristeImage; // Errou questão
        return claraMatematicaConfianteImage;
      }
      return claraMatematicaImage;
    }

    // Ambiente 1 (Laboratório)
    if (environmentId === 1) {
      if (phase === 'victory') return claraFelizCiencia2Image;
      if (phase === 'intro-1') return claraLabAssustadaImage;
    }

    // Padrão para outros ambientes
    if (phase === 'defeat') return claraGritoImage;
    if (phase === 'victory') return claraCelebrandoImage;
    if (phase === 'battle-start') return claraAnimadaImage;
    if (phase === 'question' || phase === 'feedback' || phase === 'review') {
        if (lastFeedback === 'wrong') return claraDuvidaDialogoImage; // Errou questão
        return claraAnimadaImage;
    }
    if (phase === 'intro-2') return claraSorrindoImage; // Clara determinada/feliz
    if (phase === 'intro-3') return claraAnimadaImage; // Clara enfrentando boss transformado
    return claraDuvidaImage; // intro-1: Clara surpresa
  };


  const getBossSprite = () => {
    // Ambiente 4 (Sala de Matemática) - Boss Final
    if (environmentId === 4) {
      if (phase === 'victory') return profMatematicaPurificadaFelizImage;
      if (phase === 'defeat') return profMatematicaBossGargalhandoImage;
      
      // Boss transformado
      if (bossTransformed || phase === 'battle-start' || phase === 'question' || phase === 'feedback' || phase === 'review') {
        if (bossHealth < 30) return profMatematicaBossTristeImage;
        if (phase === 'question' || phase === 'feedback' || phase === 'review') return profMatematicaBossImage;
        return profMatematicaBossSorrindoImage;
      }

      // Fases de Intro (Professora "Normal")
      if (phase === 'intro-2') return profMatematicaPurificadaTristeImage; // Emocionada
      if (phase === 'intro-3') return profMatematicaNormalImage; // Ouvindo Clara
      return profMatematicaNormalImage; // intro-1
    }

    // Ambiente 3 (Biblioteca) - Professora de Humanas
    if (environmentId === 3) {
      if (phase === 'victory') return profBibliotecaPurificadaImage;
      if (phase === 'defeat') return profBibliotecaBossGargalhandoImage;
      // Boss transformado
      if (bossTransformed || phase === 'intro-3' || phase === 'battle-start' || phase === 'question' || phase === 'feedback' || phase === 'review') {
        if (bossHealth < 30) return profBibliotecaBossTristeImage;
        if (phase === 'question' || phase === 'feedback' || phase === 'review') return profBibliotecaBossSeriaImage;
        return profBibliotecaBossImage;
      }
      return profBibliotecaDialogoImage; // Professora normal falando (diálogo)
    }

    // Ambiente 2 (Auditório) - Professor de Física
    if (environmentId === 2) {
      if (phase === 'victory') return profAuditorioArrependidoImage;
      if (phase === 'defeat') return profAuditorioBossGargalhandoImage;
      if (bossTransformed || phase === 'intro-3' || phase === 'battle-start' || phase === 'question' || phase === 'feedback' || phase === 'review') {
        if (bossHealth < 30) return profAuditorioBossTristeImage;
        return profAuditorioBossImage; // Boss transformado
      }
      if (phase === 'intro-2') return profAuditorioPurificadoImage; // Braços cruzados
      return profAuditorioNormalImage; // intro-1: Professor falando
    }

    // Ambiente 1 (Laboratório) - Professora de Ciências (padrão)
    if (phase === 'victory') return profCienciasPurificadaImage;
    if (phase === 'defeat') return profCienciasGargalhandoImage;
    if (bossTransformed || phase === 'intro-3' || phase === 'battle-start' || phase === 'question' || phase === 'feedback' || phase === 'review') {
      return profCienciasDestemidaImage; // Boss transformado
    }
    if (bossHealth < 30) return profCienciasDestemidaImage;
    return profCienciasPurificadaImage; // Professor normal
  };

  // Efeito verde só para ambiente 1 (Ciências)
  const showGreenEffect = environmentId === 1 && (phase === 'intro-1' || phase === 'intro-2' || phase === 'victory');

  // Diálogos por ambiente e fase
  const getDialogue = () => {
    // Diálogos específicos da Biblioteca (Ambiente 3)
    if (environmentId === 3) {
      switch (phase) {
        case 'intro-1':
          return {
            speaker: 'Clara',
            text: 'Professora, ainda bem que você está aqui. Senti muito sua falta.',
          };
        case 'intro-2':
          return {
            speaker: 'Professora',
            text: 'Clara, fico feliz de ver você bem, só que vim propor os desafios para você. Espero muito que você vença.',
          };
        case 'intro-3':
          return {
            speaker: 'Professora',
            text: 'Vamos, Clara, chegou o momento.',
          };
        case 'battle-start':
          return {
            speaker: 'Clara',
            text: 'Minha querida biblioteca... Sei que irei conseguir, vou arrumar tudo!',
          };
        default:
          return null;
      }
    }

    // Diálogos específicos do Auditório (Ambiente 2)
    if (environmentId === 2) {
      switch (phase) {
        case 'intro-1':
          return {
            speaker: 'Professor',
            text: 'Olá, Clara, veio aqui para testar minhas perguntas e conseguir salvar a escola?',
          };
        case 'intro-2':
          return {
            speaker: 'Clara',
            text: 'Sim, vou salvar todo mundo.',
          };
        case 'intro-3':
          return {
            speaker: 'Professor',
            text: 'Veremos, Clara.',
          };
        case 'battle-start':
          return {
            speaker: 'Clara',
            text: 'Vamos lá! Estou pronta para responder!',
          };
        default:
          return null;
      }
    }

    // Diálogos específicos da Sala de Matemática (Ambiente 4)
    if (environmentId === 4) {
      switch (phase) {
        case 'intro-1':
          return {
            speaker: 'Clara',
            text: 'Professora! Você está aqui, estava muito preocupada com você, sabe tanto que gosto de você, como você está?',
          };
        case 'intro-2':
          return {
            speaker: 'Professora',
            text: 'Estou bem, Clara, só que hoje eu não poderei relevar erros. Espero muito de você agora. Lembra de quando estudei com você até tarde? Agora é a hora!',
          };
        case 'intro-3':
          return {
            speaker: 'Clara',
            text: 'Senhora, lembra quando me deu esse lápis e esse compasso? Hoje não irei decepcioná-la, pode ter certeza.',
          };
        case 'battle-start':
          return {
            speaker: 'Professora',
            text: 'Agora é o momento!',
          };
        default:
          return null;
      }
    }

    // Diálogos padrão para Ambiente 1 (Laboratório) e outros
    switch (phase) {
      case 'intro-1':
        return {
          speaker: 'Professora',
          text: 'Você aqui, senhorita. Então, veio passar nos meus desafios?',
        };
      case 'intro-2':
        return {
          speaker: 'Professora',
          text: 'Espero que tenha estudado bem, porque já vamos começar. Espero que esteja preparada. HAHA',
        };
      case 'intro-3':
        return {
          speaker: 'Clara',
          text: 'Pode vir! Estou preparada para qualquer desafio!',
        };
      case 'battle-start':
        return {
          speaker: 'Clara',
          text: 'Vamos, irei vencer!',
        };
      default:
        return null;
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
    // Verificar se a alternativa selecionada é a correta
    const selectedAlt = currentQuestion.alternatives.find(a => a.id === selectedAlternativeId);
    const isCorrect = selectedAlt?.isCorrect ?? false;

    // Play sound effect
    if (!settings.isMuted) {
      playSound(isCorrect ? 'correct' : 'wrong');
    }
    
    // Dano no boss se acertou
    const damageDealt = isCorrect ? damagePerCorrectAnswer : 0;
    
    // Dano na Clara se errou
    const playerDamage = isCorrect ? 0 : damagePerWrongAnswer;
    
    const newBossHealth = Math.max(0, bossHealth - damageDealt);
    const newPlayerHealth = Math.max(0, playerHealth - playerDamage);
    
    // Store selected for review
    setReviewSelectedId(selectedAlternativeId);

    // Store pending result and show feedback
    setPendingResult({ isCorrect, newPlayerHealth, newBossHealth, damageDealt });
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setPhase('feedback');
  };

  const handleFeedbackEnd = useCallback(() => {
    if (!pendingResult) return;
    
    const { newPlayerHealth, newBossHealth, damageDealt } = pendingResult;
    
    // ALWAYS apply health changes (both boss and player take damage every round)
    setScore(prev => prev + (pendingResult.isCorrect ? 1 : 0));
    setBossHealth(newBossHealth);
    setPlayerHealth(newPlayerHealth);
    setTotalDamageDealt(prev => prev + damageDealt);

    // Clear feedback overlay, go to review phase
    setFeedback(null);
    setLastFeedback(pendingResult.isCorrect ? 'correct' : 'wrong');
    setPhase('review');
  }, [pendingResult]);

  const handleReviewContinue = useCallback(() => {
    if (!pendingResult) return;
    
    const { newPlayerHealth, newBossHealth, damageDealt } = pendingResult;

    // Clear pending
    setPendingResult(null);
    setReviewSelectedId(undefined);

    // Check for player defeat (Clara's health reached 0)
    if (newPlayerHealth <= 0) {
      setPhase('defeat');
      return;
    }

    // Check for boss defeat (Boss health reached 0)
    if (newBossHealth <= 0) {
      // Boss derrotado - verificar se atingiu 80% para vitória
      const finalDamage = totalDamageDealt + damageDealt;
      const damagePercentage = finalDamage / envConfig.maxHealth;
      if (damagePercentage >= MIN_PASS_PERCENTAGE) {
        setPhase('victory');
      } else {
        setPhase('defeat');
      }
      return;
    }

    // Loop das questões: volta para a primeira quando acabam
    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    setPhase('question');
  }, [pendingResult, currentQuestionIndex, questions.length, totalDamageDealt, envConfig.maxHealth]);

  // Play victory/defeat sounds
  useEffect(() => {
    if (settings.isMuted) return;
    
    if (phase === 'victory') {
      playSound('victory');
    } else if (phase === 'defeat') {
      playSound('defeat');
    }
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
    onVictory(score);
    onBackToPatio();
  };

  const dialogue = getDialogue();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundByEnv[environmentId]})` }}
      />

      {/* Top UI - Left: Profile + Health + Sound + Menu */}
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

      {/* Top UI - Right: Boss Health */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
        <BossHealthBar 
          health={bossHealth} 
          maxHealth={envConfig.maxHealth}
          bossName={bossNameByEnv[environmentId]} 
        />
      </div>

      {/* Environment Indicator */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-20">
        <span className="font-bold">{envConfig.name}</span> - Ambiente {environmentId} / 4
      </div>

      {/* Characters */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Clara - Left */}
        <div className="absolute bottom-24 left-4 md:left-16 w-64 md:w-80">
          <img 
            src={getClaraSprite()} 
            alt="Clara" 
            className="w-full h-auto object-contain drop-shadow-lg"
          />
        </div>
        
        {/* Boss - Right */}
        <div className="absolute bottom-24 right-4 md:right-16 w-64 md:w-80 flex items-center justify-center">
          {showGreenEffect && (
            <img 
              src={efeitoVerdeImage} 
              alt="Efeito Verde" 
              className="absolute w-[120%] h-[120%] object-contain opacity-70 animate-pulse"
              style={{ zIndex: -1 }}
            />
          )}
          <img 
            src={getBossSprite()} 
            alt="Professora" 
            className="w-full h-auto object-contain drop-shadow-lg relative z-10"
          />
        </div>
      </div>

      {/* Question Phase - Multiple Choice */}
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

      {/* Review Phase - Show correct/incorrect */}
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

      {/* Feedback Overlay */}
      {phase === 'feedback' && feedback && (
        <FeedbackOverlay 
          type={feedback} 
          onAnimationEnd={handleFeedbackEnd}
        />
      )}

      {/* Dialogue Phase */}
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

      {/* Victory Screen */}
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

      {/* Defeat Screen */}
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
