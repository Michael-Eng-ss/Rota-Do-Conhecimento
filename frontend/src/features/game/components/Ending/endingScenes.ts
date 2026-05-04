import { Scene } from '../VisualNovel/types';

// Backgrounds
import patioEscolaImage from '@/assets/backgrounds/patio-escola.png';
import universidadeImage from '@/assets/backgrounds/universidade.jpg';
import casaTropicalImage from '@/assets/backgrounds/casa-tropical.jpg';

// Personagens
import claraCelebrandoImage from '@/assets/characters/clara-celebrando.png';
import claraSorrindoImage from '@/assets/characters/clara-sorrindo.png';
import claraAnimadaImage from '@/assets/characters/clara-animada.png';
import liviaImage from '@/assets/characters/livia.png';
import maeImage from '@/assets/characters/mae-clara.png';
import paiImage from '@/assets/characters/Pai da Clara.png';

/**
 * Cenas finais — exibidas após o jogador derrotar todos os 3 ambientes.
 * Mantém o mesmo padrão de Scene usado pela engine VisualNovel.
 */
export const endingScenes: Scene[] = [
  // Cena E1 — Pátio purificado
  {
    id: 101,
    background: patioEscolaImage,
    characters: [
      { id: 'clara-celebrando', name: 'Clara', image: claraCelebrandoImage, position: 'center' },
    ],
    speaker: 'Clara',
    dialogue: 'Conseguimos! A ansiedade do fracasso foi derrotada... a escola voltou ao normal!',
  },
  // Cena E2 — Reencontro com Lívia
  {
    id: 102,
    background: patioEscolaImage,
    characters: [
      { id: 'livia', name: 'Lívia', image: liviaImage, position: 'left' },
      { id: 'clara-sorrindo', name: 'Clara', image: claraSorrindoImage, position: 'right' },
    ],
    speaker: 'Lívia',
    dialogue: 'Clara, você foi incrível! Os professores voltaram ao normal e os alunos estão a salvo. Obrigada por não desistir!',
  },
  // Cena E3 — Clara responde
  {
    id: 103,
    background: patioEscolaImage,
    characters: [
      { id: 'livia', name: 'Lívia', image: liviaImage, position: 'left' },
      { id: 'clara-sorrindo', name: 'Clara', image: claraSorrindoImage, position: 'right' },
    ],
    speaker: 'Clara',
    dialogue: 'Eu aprendi que estudar não é só memorizar... é também ter coragem de tentar, mesmo com medo de errar.',
  },
  // Cena E4 — Resultado do vestibular (universidade)
  {
    id: 104,
    background: universidadeImage,
    characters: [
      { id: 'clara-animada', name: 'Clara', image: claraAnimadaImage, position: 'center' },
    ],
    speaker: 'Clara',
    dialogue: 'O resultado saiu... eu passei! Passei no vestibular de medicina! Todo o esforço valeu a pena!',
  },
  // Cena E5 — Família comemora em casa
  {
    id: 105,
    background: casaTropicalImage,
    characters: [
      { id: 'mae', name: 'Mãe da Clara', image: maeImage, position: 'left' },
      { id: 'clara-celebrando', name: 'Clara', image: claraCelebrandoImage, position: 'center' },
      { id: 'pai', name: 'Pai da Clara', image: paiImage, position: 'right' },
    ],
    speaker: 'Mãe Da Clara',
    dialogue: 'Filha, estamos tão orgulhosos de você! Você enfrentou seus medos e venceu!',
  },
  // Cena E6 — Pai
  {
    id: 106,
    background: casaTropicalImage,
    characters: [
      { id: 'mae', name: 'Mãe da Clara', image: maeImage, position: 'left' },
      { id: 'clara-celebrando', name: 'Clara', image: claraCelebrandoImage, position: 'center' },
      { id: 'pai', name: 'Pai da Clara', image: paiImage, position: 'right' },
    ],
    speaker: 'Pai Da Clara',
    dialogue: 'Sabíamos que você conseguiria. Esse é só o começo da sua jornada, minha filha.',
  },
  // Cena E7 — Mensagem final
  {
    id: 107,
    background: universidadeImage,
    characters: [
      { id: 'clara-sorrindo', name: 'Clara', image: claraSorrindoImage, position: 'center' },
    ],
    speaker: 'Clara',
    dialogue: 'A ansiedade pode tentar nos parar, mas com estudo, coragem e apoio... podemos vencer qualquer desafio. Obrigada por me acompanhar nessa jornada!',
    showButtons: true,
    buttonLabels: {
      advance: 'Finalizar',
    },
  },
];
