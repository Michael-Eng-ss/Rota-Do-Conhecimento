import { useState } from 'react';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import HealthBar from '@/components/Environment/HealthBar';
import BossHealthBar from './BossHealthBar';
import SoundButton from '@/components/Environment/SoundButton';
import EnvironmentMenu from '@/components/Environment/EnvironmentMenu';
import ProfileAvatar from '@/components/Environment/ProfileAvatar';
import QuestionCard from './QuestionCard';
import VictoryScreen from './VictoryScreen';
import DefeatScreen from './DefeatScreen';
import DialogBox from '@/components/VisualNovel/DialogBox';

// Import backgrounds
import laboratorioImage from '@/assets/backgrounds/laboratorio.png';

// Import Clara sprites
import claraLaboratorioImage from '@/assets/characters/clara-laboratorio.png';
import claraFelizCienciaImage from '@/assets/characters/clara-feliz-ciencia.png';

// Import Boss sprites
import profCienciasNormalImage from '@/assets/characters/prof-ciencias-normal.png';
import profCienciasDestemidaImage from '@/assets/characters/prof-ciencias-destemida.png';
import profCienciasGargalhandoImage from '@/assets/characters/prof-ciencias-gargalhando.png';
import profCienciasTristeImage from '@/assets/characters/prof-ciencias-triste.png';
import profCienciasPurificadaImage from '@/assets/characters/prof-ciencias-purificada.png';

// Import Effects
import efeitoVerdeImage from '@/assets/effects/efeito-verde.png';

type BattlePhase = 'intro' | 'battle-start' | 'question' | 'victory' | 'defeat';

interface StaticQuestion {
  id: number;
  text: string;
  options: { letter: string; text: string }[];
  correctIndex: number;
}

// Perguntas estáticas (serão substituídas pelo backend)
const staticQuestions: StaticQuestion[] = [
  {
    id: 1,
    text: "A globalização intensificou as relações econômicas entre os países, ampliando o fluxo de mercadorias, capitais e informações. No entanto, esse processo ocorre de forma desigual, beneficiando mais intensamente algumas regiões do mundo.\nEssa desigualdade está principalmente relacionada:",
    options: [
      { letter: 'a', text: 'À distribuição homogênea dos recursos naturais entre os países.' },
      { letter: 'b', text: 'Ao nível de desenvolvimento econômico e tecnológico das nações.' },
      { letter: 'c', text: 'À eliminação completa das fronteiras políticas e culturais.' },
      { letter: 'd', text: 'À redução das diferenças sociais entre países desenvolvidos e subdesenvolvidos.' },
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    text: "Qual é a função principal das mitocôndrias nas células?",
    options: [
      { letter: 'a', text: 'Síntese de proteínas.' },
      { letter: 'b', text: 'Produção de energia (ATP).' },
      { letter: 'c', text: 'Armazenamento de informação genética.' },
      { letter: 'd', text: 'Digestão de substâncias.' },
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    text: "O que é a fotossíntese?",
    options: [
      { letter: 'a', text: 'Processo de respiração celular.' },
      { letter: 'b', text: 'Conversão de luz em energia química.' },
      { letter: 'c', text: 'Divisão celular.' },
      { letter: 'd', text: 'Transporte de nutrientes.' },
    ],
    correctIndex: 1,
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
  const { settings, toggleMute } = useSoundSystem();

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
    return claraLaboratorioImage;
  };

  const getBossSprite = () => {
    if (phase === 'victory') return profCienciasPurificadaImage;
    if (phase === 'defeat') return profCienciasTristeImage;
    if (bossHealth < 30) return profCienciasDestemidaImage;
    if (phase === 'intro') return profCienciasNormalImage;
    return profCienciasGargalhandoImage;
  };

  const showGreenEffect = phase === 'victory';

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

  const handleAnswerConfirm = (selectedIndex: number) => {
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setBossHealth(prev => Math.max(0, prev - damagePerCorrectAnswer));
    } else {
      setPlayerHealth(prev => Math.max(0, prev - damagePerWrongAnswer));
    }

    // Check for victory or defeat
    if (isCorrect && bossHealth - damagePerCorrectAnswer <= 0) {
      setPhase('victory');
      return;
    }

    if (!isCorrect && playerHealth - damagePerWrongAnswer <= 0) {
      setPhase('defeat');
      return;
    }

    // Next question or end
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered
      if (bossHealth > 0 && playerHealth > 0) {
        // Determine winner based on remaining health
        if (score >= questions.length / 2) {
          setPhase('victory');
        } else {
          setPhase('defeat');
        }
      }
    }
  };

  const handleRestart = () => {
    setPhase('intro');
    setPlayerHealth(100);
    setBossHealth(100);
    setCurrentQuestionIndex(0);
    setScore(0);
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

      {/* Top UI - Left: Profile + Health */}
      <div className="absolute top-4 left-4 flex items-center gap-4 z-20">
        <ProfileAvatar onProfileClick={onProfile} />
        <HealthBar health={playerHealth} />
      </div>

      {/* Top UI - Right: Boss Health */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
        <BossHealthBar health={bossHealth} bossName="Professora" />
      </div>

      {/* Left UI - Profile + Sound + Menu (stacked below profile) */}
      <div className="absolute top-20 left-4 flex flex-col gap-2 z-20">
        <SoundButton isMuted={settings.isMuted} onToggle={toggleMute} />
        <EnvironmentMenu onBackToPatio={onBackToPatio} onHelp={handleHelp} />
      </div>

      {/* Environment Indicator */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-20">
        <span className="font-bold">Ciências</span> - Ambiente {environmentId} / 4
      </div>

      {/* Characters */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Clara - Left */}
        <div className="absolute bottom-20 left-4 md:left-12 w-56 md:w-72">
          <img 
            src={getClaraSprite()} 
            alt="Clara" 
            className="w-full h-auto object-contain drop-shadow-lg"
          />
        </div>
        
        {/* Boss - Right */}
        <div className="absolute bottom-20 right-4 md:right-12 w-56 md:w-72 relative">
          {/* Green Effect behind boss when purified */}
          {showGreenEffect && (
            <img 
              src={efeitoVerdeImage} 
              alt="Efeito Verde" 
              className="absolute inset-0 w-full h-full object-contain -z-10 opacity-80 scale-125 animate-pulse"
            />
          )}
          <img 
            src={getBossSprite()} 
            alt="Professora" 
            className="w-full h-auto object-contain drop-shadow-lg relative z-10"
          />
        </div>
      </div>

      {/* Question Phase */}
      {phase === 'question' && currentQuestion && (
        <QuestionCard
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          questionText={currentQuestion.text}
          options={currentQuestion.options}
          onConfirm={handleAnswerConfirm}
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
