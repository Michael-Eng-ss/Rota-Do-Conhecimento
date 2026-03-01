import { useState } from 'react';
import { Lock } from 'lucide-react';
import patioEscolaImage from '@/assets/backgrounds/patio-escola.png';
import { isFinalBossUnlocked, type EnvironmentId } from '@/config/environments';

// Preview images for each environment
import auditorioImage from '@/assets/backgrounds/auditorio.png';
import bibliotecaImage from '@/assets/backgrounds/biblioteca.png';
import salaMatematicaImage from '@/assets/backgrounds/sala-matematica.png';

interface EnvironmentOption {
  id: EnvironmentId;
  name: string;
  subjects: string[];
  description: string;
  background: string;
  isFinalBoss: boolean;
}

interface EnvironmentSelectionScreenProps {
  onSelectEnvironment: (environmentId: EnvironmentId) => void;
  onBack: () => void;
  completedEnvironments?: number[];
}

const EnvironmentSelectionScreen = ({ 
  onSelectEnvironment, 
  onBack,
  completedEnvironments = []
}: EnvironmentSelectionScreenProps) => {
  const [hoveredEnv, setHoveredEnv] = useState<number | null>(null);

  const finalBossUnlocked = isFinalBossUnlocked(completedEnvironments);

  const environments: EnvironmentOption[] = [
    {
      id: 1,
      name: 'Auditório',
      subjects: ['Biologia', 'Química', 'Física', 'L. Portuguesa'],
      description: 'Grupo 1 - Ciências da Natureza e Linguagens!',
      background: auditorioImage,
      isFinalBoss: false,
    },
    {
      id: 2,
      name: 'Biblioteca',
      subjects: ['Literatura', 'Matemática', 'L. Inglesa', 'Geografia', 'História'],
      description: 'Grupo 2 - Formação Geral!',
      background: bibliotecaImage,
      isFinalBoss: false,
    },
    {
      id: 3,
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
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${patioEscolaImage})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Escolha seu Destino
          </h1>
          <p className="text-lg text-white/80">
            Selecione um ambiente para começar sua jornada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
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
                <div 
                  className="aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: `url(${env.background})` }}
                />
                
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent
                  flex flex-col justify-end p-3
                  transition-all duration-300
                  ${hoveredEnv === env.id ? 'from-black/95' : ''}
                  ${env.isFinalBoss ? 'from-red-900/90' : ''}
                `}>
                  <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded ${
                    env.isFinalBoss ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {env.isFinalBoss ? '★ FINAL' : `Grupo ${env.id}`}
                  </div>
                  
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      ✓
                    </div>
                  )}
                  
                  <h3 className={`text-white font-bold text-lg drop-shadow-lg ${
                    env.isFinalBoss ? 'text-red-300' : ''
                  }`}>
                    {env.name}
                  </h3>
                  
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
                  
                  <p className={`
                    text-white/80 text-xs mt-1
                    transition-all duration-300
                    ${hoveredEnv === env.id ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}
                  `}>
                    {env.description}
                  </p>

                  {env.isFinalBoss && !isUnlocked && (
                    <p className="text-red-300 text-xs mt-1">
                      Complete os ambientes 1 e 2 primeiro!
                    </p>
                  )}
                </div>

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
