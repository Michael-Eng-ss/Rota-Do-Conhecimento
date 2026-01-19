import { useState } from 'react';
import patioEscolaImage from '@/assets/backgrounds/patio-escola.png';

// Preview images for each environment
import auditorioImage from '@/assets/backgrounds/auditorio.png';
import bibliotecaImage from '@/assets/backgrounds/biblioteca.png';
import laboratorioImage from '@/assets/backgrounds/laboratorio.png';
import salaMatematicaImage from '@/assets/backgrounds/sala-matematica.png';

interface EnvironmentOption {
  id: 1 | 2 | 3 | 4;
  name: string;
  subject: string;
  description: string;
  background: string;
  unlocked: boolean;
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

  const environments: EnvironmentOption[] = [
    {
      id: 1,
      name: 'Auditório',
      subject: 'Português',
      description: 'Enfrente o vilão da corrupção linguística!',
      background: auditorioImage,
      unlocked: true,
    },
    {
      id: 2,
      name: 'Biblioteca',
      subject: 'História',
      description: 'A biblioteca está sendo consumida pelas chamas da ignorância!',
      background: bibliotecaImage,
      unlocked: true,
    },
    {
      id: 3,
      name: 'Laboratório',
      subject: 'Ciências',
      description: 'Os experimentos estão fora de controle!',
      background: laboratorioImage,
      unlocked: true,
    },
    {
      id: 4,
      name: 'Sala de Matemática',
      subject: 'Matemática',
      description: 'Os números entraram em caos total!',
      background: salaMatematicaImage,
      unlocked: true,
    },
  ];

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
            
            return (
              <button
                key={env.id}
                onClick={() => env.unlocked && onSelectEnvironment(env.id)}
                onMouseEnter={() => setHoveredEnv(env.id)}
                onMouseLeave={() => setHoveredEnv(null)}
                disabled={!env.unlocked}
                className={`
                  relative group rounded-xl overflow-hidden
                  transition-all duration-300 transform
                  ${env.unlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                  ${hoveredEnv === env.id ? 'ring-4 ring-yellow-400' : ''}
                  ${isCompleted ? 'ring-2 ring-green-500' : ''}
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
                `}>
                  {/* Número do ambiente */}
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {env.id}/4
                  </div>
                  
                  {/* Indicador de completo */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      ✓
                    </div>
                  )}
                  
                  {/* Nome e matéria */}
                  <h3 className="text-white font-bold text-lg drop-shadow-lg">
                    {env.name}
                  </h3>
                  <p className="text-yellow-300 text-sm font-medium">
                    {env.subject}
                  </p>
                  
                  {/* Descrição (aparece no hover) */}
                  <p className={`
                    text-white/80 text-xs mt-1
                    transition-all duration-300
                    ${hoveredEnv === env.id ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}
                  `}>
                    {env.description}
                  </p>
                </div>

                {/* Bloqueado overlay */}
                {!env.unlocked && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-4xl">🔒</span>
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
