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
type BattlePhase = 'intro-1' | 'intro-2' | 'intro-3' | 'battle-start' | 'question' | 'feedback' | 'victory' | 'defeat';

type FeedbackType = 'correct' | 'wrong' | null;

// Nova estrutura de questão com texto base e 4 afirmações
interface Statement {
  id: string;
  text: string;
  isTrue: boolean;
}

interface BattleQuestion {
  id: string;
  baseText: string;
  statements: Statement[];
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

// Questões por ambiente - Novo formato com texto base e 4 afirmações V/F
const questionsByEnvironment: Record<1 | 2 | 3 | 4, BattleQuestion[]> = {
  1: [ // Laboratório: Biologia, Química, História
    {
      id: 'q1_1',
      baseText: 'Sobre a célula e suas organelas, considere os conhecimentos de biologia celular para analisar as seguintes afirmações:',
      subject: 'Biologia',
      statements: [
        { id: 's1', text: 'A mitocôndria é responsável pela produção de energia (ATP) nas células.', isTrue: true },
        { id: 's2', text: 'O núcleo contém o material genético da célula.', isTrue: true },
        { id: 's3', text: 'O ribossomo é responsável pela fotossíntese.', isTrue: false },
        { id: 's4', text: 'A membrana plasmática é impermeável a todas as substâncias.', isTrue: false },
      ],
    },
    {
      id: 'q1_2',
      baseText: 'Considerando os elementos químicos e suas propriedades, analise as afirmações sobre a tabela periódica:',
      subject: 'Química',
      statements: [
        { id: 's5', text: 'O oxigênio é classificado como um gás nobre.', isTrue: false },
        { id: 's6', text: 'O átomo é a menor partícula que mantém as propriedades de um elemento.', isTrue: true },
        { id: 's7', text: 'A água (H₂O) é composta por dois átomos de hidrogênio e um de oxigênio.', isTrue: true },
        { id: 's8', text: 'Todos os metais são sólidos à temperatura ambiente.', isTrue: false },
      ],
    },
  ],
  2: [ // Auditório: Português, L. Estrangeira, Literatura
    {
      id: 'q2_1',
      baseText: 'Sobre as classes gramaticais da língua portuguesa, analise as afirmações a seguir:',
      subject: 'Português',
      statements: [
        { id: 's9', text: 'Substantivo é uma classe de palavra que nomeia seres, lugares e objetos.', isTrue: true },
        { id: 's10', text: 'Verbos são palavras que indicam qualidade ou característica.', isTrue: false },
        { id: 's11', text: 'Adjetivos podem modificar substantivos.', isTrue: true },
        { id: 's12', text: 'Advérbios modificam apenas verbos.', isTrue: false },
      ],
    },
    {
      id: 'q2_2',
      baseText: 'Sobre a literatura brasileira e seus principais autores, considere as seguintes afirmações:',
      subject: 'Literatura',
      statements: [
        { id: 's13', text: 'Machado de Assis escreveu "Dom Casmurro".', isTrue: true },
        { id: 's14', text: 'O Modernismo brasileiro começou em 1822.', isTrue: false },
        { id: 's15', text: 'A Semana de Arte Moderna ocorreu em São Paulo em 1922.', isTrue: true },
        { id: 's16', text: 'Carlos Drummond de Andrade foi um poeta modernista.', isTrue: true },
      ],
    },
  ],
  3: [ // Biblioteca: Matemática, Física, Geografia
    {
      id: 'q3_1',
      baseText: 'Sobre geometria plana e suas propriedades, analise as afirmações:',
      subject: 'Matemática',
      statements: [
        { id: 's17', text: 'A soma dos ângulos internos de um triângulo é 180°.', isTrue: true },
        { id: 's18', text: 'Pi (π) é igual a exatamente 3,14.', isTrue: false },
        { id: 's19', text: 'Um quadrado tem todos os lados iguais e ângulos retos.', isTrue: true },
        { id: 's20', text: 'A área de um círculo é calculada por 2πr.', isTrue: false },
      ],
    },
    {
      id: 'q3_2',
      baseText: 'Sobre geografia do Brasil e do mundo, considere as afirmações:',
      subject: 'Geografia',
      statements: [
        { id: 's21', text: 'O Brasil possui 26 estados e 1 Distrito Federal.', isTrue: true },
        { id: 's22', text: 'O Amazonas é o maior rio do mundo em volume de água.', isTrue: true },
        { id: 's23', text: 'O Monte Everest fica na América do Sul.', isTrue: false },
        { id: 's24', text: 'O Brasil faz fronteira com todos os países da América do Sul.', isTrue: false },
      ],
    },
  ],
  4: [ // Boss Final: TODAS as matérias
    {
      id: 'q4_1',
      baseText: 'Esta é a prova final! Reúna todos os seus conhecimentos para analisar as afirmações sobre ciências:',
      subject: 'Multidisciplinar',
      statements: [
        { id: 's25', text: 'O DNA contém as informações genéticas dos seres vivos.', isTrue: true },
        { id: 's26', text: 'A tabela periódica possui 118 elementos químicos conhecidos.', isTrue: true },
        { id: 's27', text: 'A velocidade da luz no vácuo é infinita.', isTrue: false },
        { id: 's28', text: 'A gravidade na Terra é aproximadamente 9,8 m/s².', isTrue: true },
      ],
    },
    {
      id: 'q4_2',
      baseText: 'Analise as afirmações sobre história, literatura e gramática:',
      subject: 'Multidisciplinar',
      statements: [
        { id: 's29', text: 'A Revolução Francesa ocorreu em 1789.', isTrue: true },
        { id: 's30', text: 'Fernando Pessoa criou heterônimos como Alberto Caeiro.', isTrue: true },
        { id: 's31', text: '"Goodbye" significa "bom dia" em inglês.', isTrue: false },
        { id: 's32', text: 'Adjetivos são palavras que modificam verbos.', isTrue: false },
      ],
    },
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
  const [lastFeedback, setLastFeedback] = useState<FeedbackType>(null);
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
      if (phase === 'question' || phase === 'feedback') {
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
    if (phase === 'question' || phase === 'feedback') {
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
      if (bossTransformed || phase === 'battle-start' || phase === 'question' || phase === 'feedback') {
        if (bossHealth < 30) return profMatematicaBossTristeImage;
        if (phase === 'question' || phase === 'feedback') return profMatematicaBossImage; // Séria
        return profMatematicaBossSorrindoImage; // Confiante/Sorrindo
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
      if (bossTransformed || phase === 'intro-3' || phase === 'battle-start' || phase === 'question' || phase === 'feedback') {
        if (bossHealth < 30) return profBibliotecaBossTristeImage; // Quando Clara está vencendo
        if (phase === 'question' || phase === 'feedback') return profBibliotecaBossSeriaImage; // Séria durante questões
        return profBibliotecaBossImage; // Boss transformado com sorriso maligno
      }
      return profBibliotecaDialogoImage; // Professora normal falando (diálogo)
    }

    // Ambiente 2 (Auditório) - Professor de Física
    if (environmentId === 2) {
      if (phase === 'victory') return profAuditorioArrependidoImage;
      if (phase === 'defeat') return profAuditorioBossGargalhandoImage;
      if (bossTransformed || phase === 'intro-3' || phase === 'battle-start' || phase === 'question' || phase === 'feedback') {
        if (bossHealth < 30) return profAuditorioBossTristeImage;
        return profAuditorioBossImage; // Boss transformado
      }
      if (phase === 'intro-2') return profAuditorioPurificadoImage; // Braços cruzados
      return profAuditorioNormalImage; // intro-1: Professor falando
    }

    // Ambiente 1 (Laboratório) - Professora de Ciências (padrão)
    if (phase === 'victory') return profCienciasPurificadaImage;
    if (phase === 'defeat') return profCienciasGargalhandoImage;
    if (bossTransformed || phase === 'intro-3' || phase === 'battle-start' || phase === 'question' || phase === 'feedback') {
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

  const handleAnswerConfirm = (answers: Record<string, boolean>) => {
    // Calcular quantas afirmações foram acertadas
    const correctCount = currentQuestion.statements.filter(
      s => answers[s.id] === s.isTrue
    ).length;
    const totalStatements = currentQuestion.statements.length;
    const allCorrect = correctCount === totalStatements;
    const noneCorrect = correctCount === 0;
    
    // Play sound effect based on answer (only if not muted)
    if (!settings.isMuted) {
      playSound(allCorrect ? 'correct' : 'wrong');
    }
    
    // Calcular dano proporcional ao número de acertos (cada afirmação vale 1/4 do dano)
    const damagePerStatement = damagePerCorrectAnswer / totalStatements;
    const damageDealt = Math.ceil(damagePerStatement * correctCount);
    
    // Se acertou menos da metade, jogador perde vida proporcional
    const playerDamage = correctCount < totalStatements / 2 
      ? Math.ceil(damagePerWrongAnswer * (1 - correctCount / totalStatements))
      : 0;
    
    const newBossHealth = Math.max(0, bossHealth - damageDealt);
    const newPlayerHealth = Math.max(0, playerHealth - playerDamage);
    
    // Determinar tipo de feedback
    const feedbackType: 'correct' | 'wrong' = allCorrect ? 'correct' : 'wrong';
    
    // Store pending result and show feedback
    setPendingResult({ isCorrect: allCorrect, newPlayerHealth, newBossHealth, damageDealt });
    setFeedback(feedbackType);
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

      {/* Question Phase - True/False com 4 afirmações */}
      {(phase === 'question' || phase === 'feedback') && currentQuestion && (
        <TrueFalseCard
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          baseText={currentQuestion.baseText}
          statements={currentQuestion.statements}
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
