import { useState, useCallback, useEffect } from 'react';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { environmentConfigs, MIN_PASS_PERCENTAGE, getDamagePercentage } from '@/config/environments';
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

// Import Effects
import efeitoVerdeImage from '@/assets/effects/efeito-verde.png';

// Fases da batalha expandidas para suportar múltiplos diálogos
type BattlePhase = 'intro-1' | 'intro-2' | 'intro-3' | 'battle-start' | 'question' | 'feedback' | 'victory' | 'defeat';

type FeedbackType = 'correct' | 'wrong' | null;

interface TrueFalseQuestion {
  id: number;
  text: string;
  isTrue: boolean;
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

// Perguntas por ambiente (serão substituídas pelo backend)
const questionsByEnvironment: Record<1 | 2 | 3 | 4, TrueFalseQuestion[]> = {
  1: [ // Laboratório: Biologia, Química, História
    { id: 1, text: "A mitocôndria é responsável pela produção de energia (ATP) nas células.", isTrue: true, subject: "Biologia" },
    { id: 2, text: "O oxigênio é um gás nobre.", isTrue: false, subject: "Química" },
    { id: 3, text: "A fotossíntese ocorre nas mitocôndrias.", isTrue: false, subject: "Biologia" },
    { id: 4, text: "A Revolução Francesa ocorreu em 1789.", isTrue: true, subject: "História" },
    { id: 5, text: "O átomo é a menor partícula da matéria.", isTrue: false, subject: "Química" },
  ],
  2: [ // Auditório: Português, L. Estrangeira, Literatura
    { id: 1, text: "Substantivo é uma classe de palavra que nomeia seres.", isTrue: true, subject: "Português" },
    { id: 2, text: "'The' é um artigo definido em inglês.", isTrue: true, subject: "L. Estrangeira" },
    { id: 3, text: "Machado de Assis escreveu 'Dom Casmurro'.", isTrue: true, subject: "Literatura" },
    { id: 4, text: "Verbos são palavras que indicam qualidade.", isTrue: false, subject: "Português" },
    { id: 5, text: "O Modernismo brasileiro começou em 1822.", isTrue: false, subject: "Literatura" },
  ],
  3: [ // Biblioteca: Matemática, Física, Geografia
    { id: 1, text: "A soma dos ângulos internos de um triângulo é 180°.", isTrue: true, subject: "Matemática" },
    { id: 2, text: "A gravidade na Terra é aproximadamente 9,8 m/s².", isTrue: true, subject: "Física" },
    { id: 3, text: "O Brasil possui 26 estados.", isTrue: false, subject: "Geografia" },
    { id: 4, text: "Pi (π) é igual a exatamente 3,14.", isTrue: false, subject: "Matemática" },
    { id: 5, text: "O Amazonas é o maior rio do mundo em volume de água.", isTrue: true, subject: "Geografia" },
  ],
  4: [ // Boss Final: TODAS as matérias
    { id: 1, text: "O DNA contém as informações genéticas dos seres vivos.", isTrue: true, subject: "Biologia" },
    { id: 2, text: "A tabela periódica possui 118 elementos.", isTrue: true, subject: "Química" },
    { id: 3, text: "O Império Romano durou mais de 1000 anos.", isTrue: true, subject: "História" },
    { id: 4, text: "Adjetivos são palavras que modificam verbos.", isTrue: false, subject: "Português" },
    { id: 5, text: "'Goodbye' significa 'bom dia' em inglês.", isTrue: false, subject: "L. Estrangeira" },
    { id: 6, text: "Fernando Pessoa criou heterônimos como Alberto Caeiro.", isTrue: true, subject: "Literatura" },
    { id: 7, text: "A raiz quadrada de 144 é 12.", isTrue: true, subject: "Matemática" },
    { id: 8, text: "A velocidade da luz no vácuo é infinita.", isTrue: false, subject: "Física" },
    { id: 9, text: "O Monte Everest é a montanha mais alta do mundo.", isTrue: true, subject: "Geografia" },
    { id: 10, text: "As células vegetais possuem parede celular.", isTrue: true, subject: "Biologia" },
  ],
};

interface BattleScreenProps {
  environmentId: 1 | 2 | 3 | 4;
  onBackToPatio: () => void;
  onProfile: () => void;
  onVictory: (score: number) => void;
}

const BattleScreen = ({ environmentId, onBackToPatio, onProfile, onVictory }: BattleScreenProps) => {
  const envConfig = environmentConfigs[environmentId];
  const questions = questionsByEnvironment[environmentId];
  
  const [phase, setPhase] = useState<BattlePhase>('intro-1');
  const [playerHealth, setPlayerHealth] = useState(100);
  const [bossHealth, setBossHealth] = useState(envConfig.maxHealth);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [pendingResult, setPendingResult] = useState<{ isCorrect: boolean; newPlayerHealth: number; newBossHealth: number; damageDealt: number } | null>(null);
  const [bossTransformed, setBossTransformed] = useState(false);
  const { settings, toggleMute } = useSoundSystem();
  const { playSound } = useSoundEffects();

  const currentQuestion = questions[currentQuestionIndex];
  const damagePerWrongAnswer = Math.ceil(100 / questions.length);
  const damagePerCorrectAnswer = Math.ceil(envConfig.maxHealth / questions.length);
  
  // Nome do chefão por ambiente
  const bossNameByEnv: Record<1 | 2 | 3 | 4, string> = {
    1: 'Professora de Ciências',
    2: 'Professor de Letras',
    3: 'Professor de Exatas',
    4: 'Diretor Supremo',
  };

  const handleHelp = () => {
    console.log('Ajuda - a ser implementado');
  };

  const getClaraSprite = () => {
    if (phase === 'defeat') return claraGritoImage;
    if (phase === 'victory') return claraCelebrandoImage;
    if (phase === 'battle-start') return claraAnimadaImage;
    if (phase === 'question' || phase === 'feedback') return claraAnimadaImage;
    if (phase === 'intro-2') return claraAnimadaImage; // Clara determinada
    if (phase === 'intro-3') return claraAnimadaImage; // Clara enfrentando boss transformado
    return claraDuvidaImage; // intro-1: Clara surpresa
  };

  const getBossSprite = () => {
    // Para Ambiente 2 (Auditório), usa os mesmos sprites por enquanto
    // TODO: Adicionar sprites específicos do professor do Auditório
    if (phase === 'victory') return profCienciasPurificadaImage;
    if (phase === 'defeat') return profCienciasGargalhandoImage;
    if (bossTransformed || phase === 'intro-3' || phase === 'battle-start' || phase === 'question' || phase === 'feedback') {
      return profCienciasDestemidaImage; // Boss transformado
    }
    if (bossHealth < 30) return profCienciasDestemidaImage;
    return profCienciasPurificadaImage; // Professor normal
  };
  const showGreenEffect = phase === 'intro-1' || phase === 'intro-2' || phase === 'victory';

  // Diálogos por ambiente e fase
  const getDialogue = () => {
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

    // Diálogos padrão para outros ambientes
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

  const handleAnswerConfirm = (answer: boolean) => {
    const isCorrect = answer === currentQuestion.isTrue;
    
    // Play sound effect based on answer (only if not muted)
    if (!settings.isMuted) {
      playSound(isCorrect ? 'correct' : 'wrong');
    }
    
    // Calculate new health values and damage dealt
    const damageDealt = isCorrect ? damagePerCorrectAnswer : 0;
    const newBossHealth = isCorrect ? Math.max(0, bossHealth - damagePerCorrectAnswer) : bossHealth;
    const newPlayerHealth = isCorrect ? playerHealth : Math.max(0, playerHealth - damagePerWrongAnswer);
    
    // Store pending result and show feedback
    setPendingResult({ isCorrect, newPlayerHealth, newBossHealth, damageDealt });
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setPhase('feedback');
  };

  const handleFeedbackEnd = useCallback(() => {
    if (!pendingResult) return;
    
    const { isCorrect, newPlayerHealth, newBossHealth, damageDealt } = pendingResult;
    
    // Apply health changes
    if (isCorrect) {
      setScore(prev => prev + 1);
      setBossHealth(newBossHealth);
      setTotalDamageDealt(prev => prev + damageDealt);
    } else {
      setPlayerHealth(newPlayerHealth);
    }

    // Clear feedback
    setFeedback(null);
    setPendingResult(null);

    // Check for player defeat (vida do jogador zerou)
    if (!isCorrect && newPlayerHealth <= 0) {
      setPhase('defeat');
      return;
    }

    // Check for victory (boss derrotado)
    if (isCorrect && newBossHealth <= 0) {
      setPhase('victory');
      return;
    }

    // Next question or end
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setPhase('question');
    } else {
      // Todas as perguntas respondidas - verificar se atingiu 80%
      const finalDamage = isCorrect ? totalDamageDealt + damageDealt : totalDamageDealt;
      const damagePercentage = finalDamage / envConfig.maxHealth;
      
      if (damagePercentage >= MIN_PASS_PERCENTAGE) {
        setPhase('victory');
      } else {
        setPhase('defeat');
      }
    }
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
