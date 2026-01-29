import { useState, useCallback, useEffect } from 'react';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import HealthBar from '@/components/Environment/HealthBar';
import BossHealthBar from './BossHealthBar';
import SoundButton from '@/components/Environment/SoundButton';
import EnvironmentMenu from '@/components/Environment/EnvironmentMenu';
import ProfileAvatar from '@/components/Environment/ProfileAvatar';
import TrueFalseCard from './TrueFalseCard';
import VictoryScreen from './VictoryScreen';
import DefeatScreen from './DefeatScreen';
import DialogBox from '@/components/VisualNovel/DialogBox';
import FeedbackOverlay from './FeedbackOverlay';

// Import backgrounds
import laboratorioImage from '@/assets/backgrounds/laboratorio.png';

// Import Clara sprites
import claraLaboratorioImage from '@/assets/characters/clara-laboratorio.png';
import claraFelizCienciaImage from '@/assets/characters/clara-feliz-ciencia.png';

// Import Boss sprites
import profCienciasDestemidaImage from '@/assets/characters/prof-ciencias-destemida.png';
import profCienciasGargalhandoImage from '@/assets/characters/prof-ciencias-gargalhando.png';
import profCienciasTristeImage from '@/assets/characters/prof-ciencias-triste.png';
import profCienciasPurificadaImage from '@/assets/characters/prof-ciencias-purificada.png';

// Import Effects
import efeitoVerdeImage from '@/assets/effects/efeito-verde.png';

type BattlePhase = 'intro' | 'battle-start' | 'question' | 'feedback' | 'victory' | 'defeat';

type FeedbackType = 'correct' | 'wrong' | null;

interface TrueFalseQuestion {
  id: number;
  text: string;
  isTrue: boolean;
}

// Perguntas Verdadeiro/Falso (serão substituídas pelo backend)
const staticQuestions: TrueFalseQuestion[] = [
  {
    id: 1,
    text: "A mitocôndria é responsável pela produção de energia (ATP) nas células.",
    isTrue: true,
  },
  {
    id: 2,
    text: "O Sol gira em torno da Terra.",
    isTrue: false,
  },
  {
    id: 3,
    text: "A fotossíntese é o processo de conversão de luz em energia química pelas plantas.",
    isTrue: true,
  },
  {
    id: 4,
    text: "Os humanos têm 206 ossos no corpo adulto.",
    isTrue: true,
  },
  {
    id: 5,
    text: "A água ferve a 50 graus Celsius ao nível do mar.",
    isTrue: false,
  },
];

interface BattleScreenProps {
  environmentId: 1 | 2 | 3 | 4;
  onBackToPatio: () => void;
  onProfile: () => void;
  onVictory: (score: number) => void;
}

const BattleScreen = ({ environmentId, onBackToPatio, onProfile, onVictory }: BattleScreenProps) => {
  const [phase, setPhase] = useState<BattlePhase>('intro');
  const [playerHealth, setPlayerHealth] = useState(100);
  const [bossHealth, setBossHealth] = useState(100);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [pendingResult, setPendingResult] = useState<{ isCorrect: boolean; newPlayerHealth: number; newBossHealth: number } | null>(null);
  const { settings, toggleMute } = useSoundSystem();
  const { playSound } = useSoundEffects();

  const questions = staticQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const damagePerWrongAnswer = Math.ceil(100 / questions.length);
  const damagePerCorrectAnswer = Math.ceil(100 / questions.length);

  const handleHelp = () => {
    console.log('Ajuda - a ser implementado');
  };

  const getClaraSprite = () => {
    if (phase === 'victory') return claraFelizCienciaImage;
    if (phase === 'battle-start') return claraFelizCienciaImage;
    if (phase === 'question' || phase === 'feedback') return claraFelizCienciaImage;
    return claraLaboratorioImage;
  };

  const getBossSprite = () => {
    if (phase === 'victory') return profCienciasPurificadaImage;
    if (phase === 'defeat') return profCienciasTristeImage;
    if (bossHealth < 30) return profCienciasDestemidaImage;
    if (phase === 'intro') return profCienciasPurificadaImage;
    return profCienciasGargalhandoImage;
  };

  const showGreenEffect = phase === 'intro' || phase === 'victory';

  const getDialogue = () => {
    switch (phase) {
      case 'intro':
        return {
          speaker: 'Professora',
          text: 'Você aqui, senhorita. Então, veio passar nos meus desafios, espero que tenha estudado bem, porque já vamos começar. Espero que esteja preparada. HAHA',
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
    if (phase === 'intro') {
      setPhase('battle-start');
    } else if (phase === 'battle-start') {
      setPhase('question');
    }
  };

  const handleAnswerConfirm = (answer: boolean) => {
    const isCorrect = answer === currentQuestion.isTrue;
    
    // Play sound effect based on answer (only if not muted)
    if (!settings.isMuted) {
      playSound(isCorrect ? 'correct' : 'wrong');
    }
    
    // Calculate new health values
    const newBossHealth = isCorrect ? Math.max(0, bossHealth - damagePerCorrectAnswer) : bossHealth;
    const newPlayerHealth = isCorrect ? playerHealth : Math.max(0, playerHealth - damagePerWrongAnswer);
    
    // Store pending result and show feedback
    setPendingResult({ isCorrect, newPlayerHealth, newBossHealth });
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setPhase('feedback');
  };

  const handleFeedbackEnd = useCallback(() => {
    if (!pendingResult) return;
    
    const { isCorrect, newPlayerHealth, newBossHealth } = pendingResult;
    
    // Apply health changes
    if (isCorrect) {
      setScore(prev => prev + 1);
      setBossHealth(newBossHealth);
    } else {
      setPlayerHealth(newPlayerHealth);
    }

    // Clear feedback
    setFeedback(null);
    setPendingResult(null);

    // Check for victory or defeat
    if (isCorrect && newBossHealth <= 0) {
      setPhase('victory');
      return;
    }

    if (!isCorrect && newPlayerHealth <= 0) {
      setPhase('defeat');
      return;
    }

    // Next question or end
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setPhase('question');
    } else {
      // All questions answered
      const finalScore = isCorrect ? score + 1 : score;
      if (finalScore >= questions.length / 2) {
        setPhase('victory');
      } else {
        setPhase('defeat');
      }
    }
  }, [pendingResult, currentQuestionIndex, questions.length, score]);

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
    setPhase('intro');
    setPlayerHealth(100);
    setBossHealth(100);
    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback(null);
    setPendingResult(null);
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
        style={{ backgroundImage: `url(${laboratorioImage})` }}
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
        <BossHealthBar health={bossHealth} bossName="Professora" />
      </div>

      {/* Environment Indicator */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-20">
        <span className="font-bold">Ciências</span> - Ambiente {environmentId} / 4
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

      {/* Question Phase - True/False */}
      {(phase === 'question' || phase === 'feedback') && currentQuestion && (
        <TrueFalseCard
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          questionText={currentQuestion.text}
          onConfirm={handleAnswerConfirm}
          disabled={phase === 'feedback'}
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
      {(phase === 'intro' || phase === 'battle-start') && dialogue && (
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
          onBackToPatio={handleVictoryComplete}
          bossName="Professora de Ciências"
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
