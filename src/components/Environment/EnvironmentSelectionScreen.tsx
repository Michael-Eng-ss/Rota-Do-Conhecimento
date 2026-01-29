import { useState } from 'react';
import { Lock } from 'lucide-react';
import patioEscolaImage from '@/assets/backgrounds/patio-escola.png';
import { isFinalBossUnlocked } from '@/config/environments';

// Preview images for each environment
import auditorioImage from '@/assets/backgrounds/auditorio.png';
import bibliotecaImage from '@/assets/backgrounds/biblioteca.png';
import laboratorioImage from '@/assets/backgrounds/laboratorio.png';
import salaMatematicaImage from '@/assets/backgrounds/sala-matematica.png';

interface EnvironmentOption {
  id: 1 | 2 | 3 | 4;
  name: string;
  subjects: string[];
  description: string;
  background: string;
  isFinalBoss: boolean;
}

interface EnvironmentSelectionScreenProps {
  onSelectEnvironment: (environmentId: 1 | 2 | 3 | 4) => void;
  onBack: () => void;
  completedEnvironments?: number[];
}

const EnvironmentSelectionScreen = ({ 
  onSelectEnvironment, 
  onBack,
  completedEnvironments = []
}: EnvironmentSelectionScreenProps) => {
  const [hoveredEnv, setHoveredEnv] = useState<number | null>(null);

  // Verifica se o Boss Final está liberado
  const finalBossUnlocked = isFinalBossUnlocked(completedEnvironments);

  const environments: EnvironmentOption[] = [
    {
      id: 1,
      name: 'Laboratório',
      subjects: ['Biologia', 'Química', 'História'],
      description: 'Enfrente o vilão das ciências naturais!',
      background: laboratorioImage,
      isFinalBoss: false,
    },
    {
      id: 2,
      name: 'Auditório',
      subjects: ['Português', 'L. Estrangeira', 'Literatura'],
      description: 'Domine as artes da linguagem e literatura!',
      background: auditorioImage,
      isFinalBoss: false,
    },
    {
      id: 3,
      name: 'Biblioteca',
      subjects: ['Matemática', 'Física', 'Geografia'],
      description: 'Desvende os mistérios dos números e do mundo!',
      background: bibliotecaImage,
      isFinalBoss: false,
    },
    {
      id: 4,
      name: 'Boss Final',
      subjects: ['Todas as Matérias'],
      description: 'O desafio supremo! Todas as matérias em um só combate!',
      background: salaMatematicaImage,
      isFinalBoss: true,
    },
  ];

  const isEnvironmentUnlocked = (env: EnvironmentOption): boolean => {
    if (env.isFinalBoss) {
      return finalBossUnlocked;
    }
    return true;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${patioEscolaImage})` }}
      />
      
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Escolha seu Destino
          </h1>
          <p className="text-lg text-white/80">
            Selecione um ambiente para começar sua jornada
          </p>
        </div>

        {/* Grid de Ambientes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl w-full">
          {environments.map((env) => {
            const isCompleted = completedEnvironments.includes(env.id);
            const isUnlocked = isEnvironmentUnlocked(env);
            
            return (
              <button
                key={env.id}
                onClick={() => isUnlocked && onSelectEnvironment(env.id)}
                onMouseEnter={() => setHoveredEnv(env.id)}
                onMouseLeave={() => setHoveredEnv(null)}
                disabled={!isUnlocked}
                className={`
                  relative group rounded-xl overflow-hidden
                  transition-all duration-300 transform
                  ${isUnlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                  ${hoveredEnv === env.id && isUnlocked ? 'ring-4 ring-yellow-400' : ''}
                  ${isCompleted ? 'ring-2 ring-green-500' : ''}
                  ${env.isFinalBoss && isUnlocked ? 'ring-2 ring-red-500 animate-pulse' : ''}
                `}
              >
                {/* Imagem de Preview */}
                <div 
                  className="aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: `url(${env.background})` }}
                />
                
                {/* Overlay com informações */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent
                  flex flex-col justify-end p-3
                  transition-all duration-300
                  ${hoveredEnv === env.id ? 'from-black/95' : ''}
                  ${env.isFinalBoss ? 'from-red-900/90' : ''}
                `}>
                  {/* Número do ambiente ou indicador de Boss Final */}
                  <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded ${
                    env.isFinalBoss ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {env.isFinalBoss ? '★ FINAL' : `${env.id}/4`}
                  </div>
                  
                  {/* Indicador de completo */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      ✓
                    </div>
                  )}
                  
                  {/* Nome */}
                  <h3 className={`text-white font-bold text-lg drop-shadow-lg ${
                    env.isFinalBoss ? 'text-red-300' : ''
                  }`}>
                    {env.name}
                  </h3>
                  
                  {/* Matérias */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {env.subjects.map((subject, idx) => (
                      <span 
                        key={idx}
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          env.isFinalBoss 
                            ? 'bg-red-500/50 text-red-100' 
                            : 'bg-yellow-500/50 text-yellow-100'
                        }`}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                  
                  {/* Descrição (aparece no hover) */}
                  <p className={`
                    text-white/80 text-xs mt-1
                    transition-all duration-300
                    ${hoveredEnv === env.id ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}
                  `}>
                    {env.description}
                  </p>

                  {/* Aviso de requisito para Boss Final */}
                  {env.isFinalBoss && !isUnlocked && (
                    <p className="text-red-300 text-xs mt-1">
                      Complete os ambientes 1, 2 e 3 primeiro!
                    </p>
                  )}
                </div>

                {/* Bloqueado overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
                    <Lock className="w-8 h-8 text-white/80" />
                    <span className="text-white/80 text-xs text-center px-2">
                      Complete todos os ambientes
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Botão Voltar */}
        <button
          onClick={onBack}
          className="mt-8 px-6 py-3 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg transition-colors border border-white/20"
        >
          ← Voltar ao Menu
        </button>
      </div>
    </div>
  );
};

export default EnvironmentSelectionScreen;
